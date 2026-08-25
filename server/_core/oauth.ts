import {
  COOKIE_NAME,
  GITHUB_OAUTH_STATE_COOKIE,
  ONE_YEAR_MS,
  OAUTH_STATE_COOKIE,
  decodeOAuthState,
} from "@shared/const";
import { parse as parseCookieHeader } from "cookie";
import type { Express, Request, Response } from "express";
import * as db from "../db.js";
import { getSessionCookieOptions } from "./cookies.js";
import { ENV } from "./env.js";
import { GITHUB_OWNER_SESSION_APP_ID, sdk } from "./sdk.js";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

function getRequestOrigin(req: Request): string {
  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto = Array.isArray(forwardedProto)
    ? forwardedProto[0]
    : forwardedProto?.split(",")[0];
  return `${proto?.trim() || req.protocol || "https"}://${req.get("host")}`;
}

function githubOAuthReady() {
  return Boolean(
    ENV.githubOAuthClientId &&
      ENV.githubOAuthClientSecret &&
      ENV.githubOAuthAllowedLogin
  );
}

export function registerOAuthRoutes(app: Express) {
  /**
   * Dedicated, allow-listed GitHub OAuth entry for the independent Vercel owner
   * dashboard. It is separate from the Manus callback so the active fallback
   * deployment keeps working without a GitHub OAuth client.
   */
  app.get("/api/oauth/github/start", (req: Request, res: Response) => {
    if (!githubOAuthReady()) {
      res.status(503).json({ error: "GitHub OAuth is not configured" });
      return;
    }

    const state = crypto.randomUUID();
    const cookieOptions = getSessionCookieOptions(req);
    res.cookie(GITHUB_OAUTH_STATE_COOKIE, state, {
      ...cookieOptions,
      maxAge: 10 * 60 * 1000,
    });

    const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
    authorizeUrl.searchParams.set("client_id", ENV.githubOAuthClientId);
    authorizeUrl.searchParams.set(
      "redirect_uri",
      `${getRequestOrigin(req)}/api/oauth/github/callback`
    );
    authorizeUrl.searchParams.set("state", state);
    authorizeUrl.searchParams.set("scope", "read:user user:email");
    res.redirect(302, authorizeUrl.toString());
  });

  app.get("/api/oauth/github/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");
    const expectedState = parseCookieHeader(req.headers.cookie ?? "")[
      GITHUB_OAUTH_STATE_COOKIE
    ];
    const cookieOptions = getSessionCookieOptions(req);
    res.clearCookie(GITHUB_OAUTH_STATE_COOKIE, cookieOptions);

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }
    if (!githubOAuthReady()) {
      res.status(503).json({ error: "GitHub OAuth is not configured" });
      return;
    }
    if (!expectedState || state !== expectedState) {
      res.status(403).json({ error: "invalid github oauth state" });
      return;
    }

    try {
      const tokenResponse = await fetch(
        "https://github.com/login/oauth/access_token",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: ENV.githubOAuthClientId,
            client_secret: ENV.githubOAuthClientSecret,
            code,
            redirect_uri: `${getRequestOrigin(req)}/api/oauth/github/callback`,
          }),
        }
      );
      const tokenPayload = (await tokenResponse.json()) as {
        access_token?: string;
      };
      if (!tokenResponse.ok || !tokenPayload.access_token) {
        throw new Error("GitHub token exchange failed");
      }

      const githubResponse = await fetch("https://api.github.com/user", {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${tokenPayload.access_token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      });
      const githubUser = (await githubResponse.json()) as {
        id?: number;
        login?: string;
        name?: string | null;
        email?: string | null;
      };

      if (
        !githubResponse.ok ||
        !githubUser.id ||
        !githubUser.login ||
        githubUser.login.toLowerCase() !== ENV.githubOAuthAllowedLogin.toLowerCase()
      ) {
        res.status(403).json({ error: "GitHub account is not an approved owner" });
        return;
      }

      const openId = `github:${githubUser.id}`;
      await db.upsertUser({
        openId,
        name: githubUser.name ?? githubUser.login,
        email: githubUser.email ?? null,
        loginMethod: "github",
        role: "admin",
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(openId, {
        name: githubUser.name ?? githubUser.login,
        expiresInMs: ONE_YEAR_MS,
        appId: GITHUB_OWNER_SESSION_APP_ID,
      });
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });
      res.redirect(302, "/admin");
    } catch (error) {
      console.error("[GitHub OAuth] Callback failed", error);
      res.status(500).json({ error: "GitHub OAuth callback failed" });
    }
  });

  /** Existing Manus OAuth callback for the active Manus-hosted fallback. */
  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    const { nonce } = decodeOAuthState(state);
    const expectedNonce = parseCookieHeader(req.headers.cookie ?? "")[OAUTH_STATE_COOKIE];
    if (!nonce || nonce !== expectedNonce) {
      res.status(403).json({ error: "invalid oauth state" });
      return;
    }
    res.clearCookie(OAUTH_STATE_COOKIE, { path: "/", secure: true, sameSite: "none" });

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });
}
