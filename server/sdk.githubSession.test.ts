import { describe, expect, it } from "vitest";
import {
  GITHUB_OWNER_SESSION_APP_ID,
  resolveSessionAppId,
} from "./_core/sdk";

describe("independent THE ARZENS GitHub session audience", () => {
  it("uses a stable standalone value when no Manus VITE_APP_ID is configured", () => {
    expect(resolveSessionAppId("github:12345", "")).toBe(
      GITHUB_OWNER_SESSION_APP_ID
    );
  });

  it("keeps a configured Manus app ID for the retained fallback session path", () => {
    expect(resolveSessionAppId("manus-user", "manus-app-id")).toBe(
      "manus-app-id"
    );
  });
});
