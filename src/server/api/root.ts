import { attributeRouter } from "~/server/api/routers/attribute";
import { seedRouter } from "~/server/api/routers/seed";
import { studentRouter } from "~/server/api/routers/student";
import { openaiRouter } from "~/server/api/routers/openai";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  student: studentRouter,
  attribute: attributeRouter,
  seed: seedRouter,
  openai: openaiRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
