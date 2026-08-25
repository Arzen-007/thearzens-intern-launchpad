import { COOKIE_NAME } from "../shared/const.js";
import { managedResourceInputSchema } from "../shared/catalog.js";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies.js";
import { systemRouter } from "./_core/systemRouter.js";
import { adminProcedure, publicProcedure, router } from "./_core/trpc.js";
import { archiveManagedCatalogResource, githubAppReadiness, githubPagesDeploymentStatus, listGitHubManagedCatalog, upsertManagedCatalogResource } from "./githubCatalog.js";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  catalog: router({
    status: adminProcedure.query(() => githubAppReadiness()),
    list: adminProcedure.query(() => listGitHubManagedCatalog()),
    deployment: adminProcedure.query(() => githubPagesDeploymentStatus()),
    upsert: adminProcedure.input(z.object({ resource: managedResourceInputSchema })).mutation(({ input }) => upsertManagedCatalogResource(input.resource)),
    archive: adminProcedure.input(z.object({ id: z.string().min(3).max(80) })).mutation(({ input }) => archiveManagedCatalogResource(input.id)),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
