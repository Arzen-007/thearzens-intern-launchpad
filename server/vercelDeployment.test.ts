import fs from "node:fs";
import { createServer } from "node:http";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { createApp } from "./app";

const projectRoot = path.resolve(import.meta.dirname, "..");

describe("THE ARZENS Vercel deployment configuration", () => {
  it("creates an API app without opening a listener", () => {
    const app = createApp();

    expect(typeof app).toBe("function");
    expect(app.get("trust proxy")).toBe(1);
  });

  it("keeps the API function ahead of the SPA fallback", () => {
    const config = JSON.parse(
      fs.readFileSync(path.join(projectRoot, "vercel.json"), "utf8")
    ) as {
      buildCommand: string;
      outputDirectory: string;
      functions: Record<string, { maxDuration: number }>;
      rewrites: Array<{ source: string; destination: string }>;
    };

    expect(config.buildCommand).toBe("pnpm build:vercel");
    expect(config.outputDirectory).toBe("dist/public");
    expect(config.functions["api/[...path].ts"].maxDuration).toBe(30);
    expect(config.rewrites).toEqual([
      { source: "/api/:path*", destination: "/api/[...path]" },
      { source: "/(.*)", destination: "/index.html" },
    ]);
    expect(
      fs.existsSync(path.join(projectRoot, "api", "[...path].ts"))
    ).toBe(true);
  });

  it("routes the OAuth callback through Express instead of the SPA", async () => {
    const app = createApp();
    const server = createServer(app);

    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Test server did not bind to a local port");
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:${address.port}/api/oauth/callback`
      );

      expect(response.status).toBe(400);
      await expect(response.json()).resolves.toEqual({
        error: "code and state are required",
      });
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      );
    }
  });

  it("keeps the GitHub owner-login route in Express and fails closed before configuration", async () => {
    const app = createApp();
    const server = createServer(app);

    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Test server did not bind to a local port");
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:${address.port}/api/oauth/github/start`
      );

      expect(response.status).toBe(503);
      await expect(response.json()).resolves.toEqual({
        error: "GitHub OAuth is not configured",
      });
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      );
    }
  });

  it("routes a malformed tRPC request through the API instead of the SPA", async () => {
    const app = createApp();
    const server = createServer(app);

    await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("Test server did not bind to a local port");
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:${address.port}/api/trpc/not-a-real-procedure?input=%7B%7D`
      );

      expect(response.status).toBe(404);
      expect(response.headers.get("content-type")).toContain("application/json");
    } finally {
      await new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      );
    }
  });
});
