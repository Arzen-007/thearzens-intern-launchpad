import { describe, expect, it } from "vitest";
import { databaseProviderFromUrl } from "./db";

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
});
