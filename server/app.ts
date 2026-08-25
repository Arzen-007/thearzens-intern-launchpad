import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./_core/oauth.js";
import { registerStorageProxy } from "./_core/storageProxy.js";
import { createContext } from "./_core/context.js";
import { appRouter } from "./routers.js";

/**
 * Builds the server-only THE ARZENS API application without opening a port.
 * The same app is used by the Manus Node server and the Vercel serverless entry.
 */
export function createApp() {
  const app = express();

  // Vercel terminates HTTPS at its edge and sends the original protocol forward.
  // Trusting the first proxy preserves secure session-cookie behavior.
  app.set("trust proxy", 1);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  return app;
}

const app = createApp();

export default app;
