import { describe, expect, it } from "vitest";
import { generateKeyPairSync } from "node:crypto";
import { githubAppReadinessFrom, githubDeploymentStateFrom, normalizePrivateKeyForSigning } from "./githubCatalog";

describe("GitHub catalog publisher readiness", () => {
  it("keeps publishing disabled until every server-side App credential is present", () => {
    expect(githubAppReadinessFrom({ appId: "", installationId: "", privateKey: "" })).toMatchObject({
      connected: false,
      missing: ["GitHub App ID", "repository installation ID", "private key"],
    });
  });

  it("reports a connected status without returning credential values", () => {
    const readiness = githubAppReadinessFrom({ appId: "123", installationId: "456", privateKey: "private-key-material" });
    expect(readiness).toMatchObject({ connected: true, repository: "Arzen-007/thearzens-intern-launchpad" });
    expect(readiness).not.toHaveProperty("privateKey");
  });

  it("turns the latest GitHub Actions result into a publication state without any token", () => {
    expect(githubDeploymentStateFrom({
      status: "completed",
      conclusion: "success",
      html_url: "https://github.com/Arzen-007/thearzens-intern-launchpad/actions/runs/1",
      created_at: "2026-08-25T00:00:00.000Z",
      updated_at: "2026-08-25T00:01:00.000Z",
      run_number: 1,
    })).toMatchObject({ available: true, state: "published", runNumber: 1 });
  });

  it("normalizes valid GitHub-style RSA PEM keys for jose signing", () => {
    const { privateKey } = generateKeyPairSync("rsa", {
      modulusLength: 2048,
      privateKeyEncoding: { format: "pem", type: "pkcs1" },
    });

    expect(normalizePrivateKeyForSigning(privateKey)).toContain("BEGIN PRIVATE KEY");
  });
});
