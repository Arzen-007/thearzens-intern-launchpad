import { TRPCError } from "@trpc/server";
import { importPKCS8, SignJWT } from "jose";
import { createPrivateKey } from "node:crypto";
import {
  GITHUB_BRANCH,
  GITHUB_OWNER,
  GITHUB_PAGES_URL,
  GITHUB_REPOSITORY,
  MANAGED_CATALOG_PATH,
  managedCatalogSchema,
  type ManagedCatalog,
  type ManagedResourceInput,
} from "../shared/catalog.js";
import { ENV } from "./_core/env.js";

type GitHubAppConfig = {
  appId: string;
  installationId: string;
  privateKey: string;
};

type GitHubContentFile = {
  content: string;
  encoding: "base64";
  sha: string;
};

type GitHubCommitResponse = {
  commit: { sha: string; html_url: string };
};

export function githubAppReadinessFrom(config: GitHubAppConfig) {
  const missing = [
    !config.appId && "GitHub App ID",
    !config.installationId && "repository installation ID",
    !config.privateKey && "private key",
  ].filter(Boolean) as string[];

  return {
    connected: missing.length === 0,
    missing,
    repository: `${GITHUB_OWNER}/${GITHUB_REPOSITORY}`,
    branch: GITHUB_BRANCH,
    catalogPath: MANAGED_CATALOG_PATH,
    pagesUrl: GITHUB_PAGES_URL,
  };
}

export function githubAppReadiness() {
  return githubAppReadinessFrom({
    appId: ENV.githubAppId,
    installationId: ENV.githubAppInstallationId,
    privateKey: ENV.githubAppPrivateKey,
  });
}

export async function listGitHubManagedCatalog() {
  const readiness = githubAppReadiness();
  if (!readiness.connected) {
    return { connected: false as const, catalog: null };
  }
  const token = await createInstallationToken(githubConfigOrThrow());
  const { catalog } = await readManagedCatalog(token);
  return { connected: true as const, catalog };
}

type GitHubWorkflowRun = {
  status: string;
  conclusion: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  run_number: number;
};

export function githubDeploymentStateFrom(run?: GitHubWorkflowRun) {
  if (!run) {
    return {
      available: false as const,
      state: "not-found" as const,
      message: "No GitHub Pages workflow run is visible yet.",
      pagesUrl: GITHUB_PAGES_URL,
      workflowUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/actions/workflows/deploy-pages.yml`,
    };
  }
  return {
    available: true as const,
    state: run.status === "completed" && run.conclusion === "success" ? "published" as const : run.status === "completed" ? "failed" as const : "running" as const,
    status: run.status,
    conclusion: run.conclusion,
    runNumber: run.run_number,
    runUrl: run.html_url,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    pagesUrl: GITHUB_PAGES_URL,
    workflowUrl: `https://github.com/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/actions/workflows/deploy-pages.yml`,
  };
}

export async function githubPagesDeploymentStatus() {
  const workflowUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/actions/workflows/deploy-pages.yml/runs?per_page=1`;
  try {
    const response = await fetch(workflowUrl, { headers: { Accept: "application/vnd.github+json", "User-Agent": "THE-ARZENS-Launchpad-Control-Room" } });
    if (!response.ok) {
      return {
        ...githubDeploymentStateFrom(),
        message: response.status === 404 ? "The Pages workflow is not visible in GitHub yet. Push the workflow before checking deployment." : `GitHub could not provide deployment state (${response.status}).`,
      };
    }
    const payload = (await response.json()) as { workflow_runs?: GitHubWorkflowRun[] };
    return githubDeploymentStateFrom(payload.workflow_runs?.[0]);
  } catch {
    return { ...githubDeploymentStateFrom(), message: "GitHub deployment status is temporarily unavailable. Open the workflow directly to check it." };
  }
}

function githubConfigOrThrow(): GitHubAppConfig {
  const config = {
    appId: ENV.githubAppId,
    installationId: ENV.githubAppInstallationId,
    privateKey: ENV.githubAppPrivateKey,
  };
  const readiness = githubAppReadinessFrom(config);

  if (!readiness.connected) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: `GitHub catalog publishing is not connected. Missing: ${readiness.missing.join(", ")}.`,
    });
  }

  return config;
}

export function normalizePrivateKeyForSigning(value: string) {
  const normalized = value
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");

  try {
    const converted = createPrivateKey(normalized).export({ format: "pem", type: "pkcs8" });
    return typeof converted === "string" ? converted : converted.toString();
  } catch {
    return normalized;
  }
}

async function createInstallationToken(config: GitHubAppConfig) {
  const privateKey = await importPKCS8(normalizePrivateKeyForSigning(config.privateKey), "RS256");
  const appJwt = await new SignJWT({})
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(config.appId)
    .setIssuedAt()
    .setExpirationTime("9m")
    .sign(privateKey);

  const response = await fetch(`https://api.github.com/app/installations/${config.installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${appJwt}`,
      "User-Agent": "THE-ARZENS-Launchpad-Catalog-Manager",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  const payload = (await response.json()) as { token?: string; message?: string };
  if (!response.ok || !payload.token) {
    throw new TRPCError({ code: "BAD_GATEWAY", message: `GitHub installation token could not be created: ${payload.message ?? response.statusText}` });
  }

  return payload.token;
}

async function githubRequest<T>(token: string, path: string, init?: RequestInit) {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "THE-ARZENS-Launchpad-Catalog-Manager",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  const text = await response.text();
  const payload = text ? (JSON.parse(text) as T & { message?: string }) : ({} as T & { message?: string });
  if (!response.ok) {
    throw new TRPCError({ code: "BAD_GATEWAY", message: `GitHub catalog request failed: ${payload.message ?? response.statusText}` });
  }
  return payload as T;
}

function repositoryPath() {
  return `/repos/${GITHUB_OWNER}/${GITHUB_REPOSITORY}/contents/${MANAGED_CATALOG_PATH.split("/").map(encodeURIComponent).join("/")}`;
}

async function readManagedCatalog(token: string) {
  const file = await githubRequest<GitHubContentFile>(token, `${repositoryPath()}?ref=${GITHUB_BRANCH}`);
  if (file.encoding !== "base64") {
    throw new TRPCError({ code: "BAD_GATEWAY", message: "GitHub returned the catalog in an unsupported encoding." });
  }
  try {
    return {
      file,
      catalog: managedCatalogSchema.parse(JSON.parse(Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8"))),
    };
  } catch {
    throw new TRPCError({ code: "BAD_GATEWAY", message: "The GitHub-managed catalog could not be parsed safely." });
  }
}

async function commitCatalog(token: string, catalog: ManagedCatalog, sha: string, message: string) {
  return githubRequest<GitHubCommitResponse>(token, repositoryPath(), {
    method: "PUT",
    body: JSON.stringify({
      message,
      content: Buffer.from(`${JSON.stringify(catalog, null, 2)}\n`, "utf8").toString("base64"),
      sha,
      branch: GITHUB_BRANCH,
    }),
  });
}

export async function upsertManagedCatalogResource(resource: ManagedResourceInput) {
  const token = await createInstallationToken(githubConfigOrThrow());
  const { file, catalog } = await readManagedCatalog(token);
  const now = new Date().toISOString();
  const existing = catalog.resources.find((record) => record.id === resource.id);
  const nextRecord = { ...resource, status: "active" as const, updatedAt: now };
  const resources = existing
    ? catalog.resources.map((record) => record.id === resource.id ? nextRecord : record)
    : [...catalog.resources, nextRecord];
  const nextCatalog = managedCatalogSchema.parse({ ...catalog, updatedAt: now, resources });
  const action = existing ? "update" : "add";
  const commit = await commitCatalog(token, nextCatalog, file.sha, `catalog: ${action} ${resource.name}`);

  return { action, resource: nextRecord, commit: commit.commit };
}

export async function archiveManagedCatalogResource(id: string) {
  const token = await createInstallationToken(githubConfigOrThrow());
  const { file, catalog } = await readManagedCatalog(token);
  const existing = catalog.resources.find((record) => record.id === id);
  if (!existing) {
    throw new TRPCError({ code: "NOT_FOUND", message: "The catalog record was not found in the GitHub repository." });
  }
  const now = new Date().toISOString();
  const resources = catalog.resources.map((record) => record.id === id ? { ...record, status: "archived" as const, updatedAt: now } : record);
  const nextCatalog = managedCatalogSchema.parse({ ...catalog, updatedAt: now, resources });
  const commit = await commitCatalog(token, nextCatalog, file.sha, `catalog: archive ${existing.name}`);

  return { action: "archive" as const, resource: { ...existing, status: "archived" as const, updatedAt: now }, commit: commit.commit };
}
