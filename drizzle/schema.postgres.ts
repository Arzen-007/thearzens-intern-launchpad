import {
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Neon/PostgreSQL equivalent of the active Manus MySQL users table.
 * It is intentionally separate so the Vercel dashboard can migrate without
 * changing the existing Manus database or its schema contract.
 */
export const postgresUserRole = pgEnum("user_role", ["user", "admin"]);

export const postgresUsers = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: postgresUserRole("role").default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in", { withTimezone: true }).defaultNow().notNull(),
});

export type PostgresUser = typeof postgresUsers.$inferSelect;
export type InsertPostgresUser = typeof postgresUsers.$inferInsert;
