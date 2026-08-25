import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { InsertUser, users } from "../drizzle/schema.js";
import { postgresUsers } from "../drizzle/schema.postgres.js";
import { ENV } from "./_core/env.js";

type MysqlDb = ReturnType<typeof drizzleMysql>;
type NeonDb = ReturnType<typeof drizzleNeon>;

let mysqlDb: MysqlDb | null = null;
let neonDb: NeonDb | null = null;

export type DatabaseProvider = "mysql" | "neon";

export function neonUserUpdateSet(values: {
  name: string | null;
  email: string | null;
  loginMethod: string | null;
  role?: "user" | "admin";
  lastSignedIn: Date;
}) {
  const updateSet: {
    name: string | null;
    email: string | null;
    loginMethod: string | null;
    lastSignedIn: Date;
    updatedAt: Date;
    role?: "user" | "admin";
  } = {
    name: values.name,
    email: values.email,
    loginMethod: values.loginMethod,
    lastSignedIn: values.lastSignedIn,
    updatedAt: new Date(),
  };

  // A refresh supplies only openId/lastSignedIn. Do not overwrite a previously
  // granted owner role with the insert default of "user" on Neon conflicts.
  if (values.role !== undefined) {
    updateSet.role = values.role;
  }

  return updateSet;
}

/**
 * Vercel sets DATABASE_PROVIDER=neon. The URL check is a safe fallback for
 * deployments where the provider flag has not yet been configured.
 */
export function databaseProviderFromUrl(
  databaseUrl = process.env.DATABASE_URL,
  configuredProvider = process.env.DATABASE_PROVIDER
): DatabaseProvider {
  if (configuredProvider === "neon" || databaseUrl?.includes("neon.tech")) {
    return "neon";
  }

  return "mysql";
}

// Lazily create a database client so local tooling can run without credentials.
export async function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return null;

  try {
    if (databaseProviderFromUrl(databaseUrl) === "neon") {
      if (!neonDb) {
        neonDb = drizzleNeon(neon(databaseUrl));
      }
      return neonDb;
    }

    if (!mysqlDb) {
      mysqlDb = drizzleMysql(databaseUrl);
    }
    return mysqlDb;
  } catch (error) {
    console.warn("[Database] Failed to connect:", error);
    return null;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    if (databaseProviderFromUrl() === "neon") {
      const neonValues = {
        openId: values.openId,
        name: values.name ?? null,
        email: values.email ?? null,
        loginMethod: values.loginMethod ?? null,
        role: values.role ?? "user",
        lastSignedIn: values.lastSignedIn,
      };

      await (db as NeonDb)
        .insert(postgresUsers)
        .values(neonValues)
        .onConflictDoUpdate({
          target: postgresUsers.openId,
          set: neonUserUpdateSet({
            name: neonValues.name,
            email: neonValues.email,
            loginMethod: neonValues.loginMethod,
            role: values.role,
            lastSignedIn: neonValues.lastSignedIn,
          }),
        });
      return;
    }

    await (db as MysqlDb).insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  if (databaseProviderFromUrl() === "neon") {
    const result = await (db as NeonDb)
      .select({
        id: postgresUsers.id,
        openId: postgresUsers.openId,
        name: postgresUsers.name,
        email: postgresUsers.email,
        loginMethod: postgresUsers.loginMethod,
        role: postgresUsers.role,
        createdAt: postgresUsers.createdAt,
        updatedAt: postgresUsers.updatedAt,
        lastSignedIn: postgresUsers.lastSignedIn,
      })
      .from(postgresUsers)
      .where(eq(postgresUsers.openId, openId))
      .limit(1);

    return result.length > 0 ? result[0] : undefined;
  }

  const result = await (db as MysqlDb)
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}
