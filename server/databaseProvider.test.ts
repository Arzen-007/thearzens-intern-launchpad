import { describe, expect, it } from "vitest";
import { databaseProviderFromUrl, neonUserUpdateSet } from "./db";

describe("THE ARZENS independent database provider selection", () => {
  it("keeps the existing MySQL dashboard path as the default", () => {
    expect(databaseProviderFromUrl("mysql://dashboard.example/thearzens")).toBe("mysql");
  });

  it("selects Neon for a Neon PostgreSQL connection", () => {
    expect(
      databaseProviderFromUrl(
        "postgresql://owner:secret@ep-example.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
      )
    ).toBe("neon");
  });

  it("allows Vercel to select Neon explicitly without exposing credentials", () => {
    expect(
      databaseProviderFromUrl("postgresql://hosted.example/dashboard", "neon")
      ).toBe("neon");
  });

  it("does not demote an existing Neon owner role during a session refresh", () => {
    const updateSet = neonUserUpdateSet({
      name: null,
      email: null,
      loginMethod: null,
      lastSignedIn: new Date("2026-08-25T00:00:00.000Z"),
    });

    expect(updateSet).not.toHaveProperty("role");
  });

  it("updates the Neon role when the GitHub owner callback explicitly grants admin", () => {
    const updateSet = neonUserUpdateSet({
      name: "THE ARZENS Owner",
      email: null,
      loginMethod: "github",
      role: "admin",
      lastSignedIn: new Date("2026-08-25T00:00:00.000Z"),
    });

    expect(updateSet.role).toBe("admin");
  });
});
