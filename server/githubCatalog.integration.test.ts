import { describe, expect, it } from "vitest";
import { githubAppReadiness, listGitHubManagedCatalog } from "./githubCatalog";

const runInstalledCredentialCheck = process.env.VITEST_GITHUB_APP_INTEGRATION === "1";
const installedCredentialIt = runInstalledCredentialCheck ? it : it.skip;

describe("installed GitHub App credential", () => {
  installedCredentialIt("authenticates with the server-held key and reads the managed catalog without writing to GitHub", async () => {
    expect(githubAppReadiness()).toMatchObject({ connected: true });

    const result = await listGitHubManagedCatalog();

    expect(result.connected).toBe(true);
    expect(result.catalog).not.toBeNull();
    expect(result.catalog).toMatchObject({ version: 1 });
  }, 20_000);
});
