import { describe, expect, it, vi } from "vitest";
import {
  GITHUB_OWNER_SESSION_APP_ID,
  resolveSessionAppId,
  SDKServer,
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

  it("does not initialize the legacy Manus OAuth client when the SDK is constructed", () => {
    const info = vi.spyOn(console, "log").mockImplementation(() => undefined);
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined);

    new SDKServer({} as never);

    expect(info).not.toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
    info.mockRestore();
    error.mockRestore();
  });
});
