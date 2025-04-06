import { eq, and, like } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { userAttributes } from "~/server/db/schema";

export const userAttributeRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.string().default("default") }))
    .query(async ({ ctx, input }) => {
      const allUserAttributes = await ctx.db.query.userAttributes.findMany({
        where: eq(userAttributes.userId, input.userId),
        orderBy: (userAttributes, { asc }) => [asc(userAttributes.text)],
      });
      return allUserAttributes;
    }),

  search: publicProcedure
    .input(
      z.object({
        searchTerm: z.string().default(""),
        category: z.enum(["positive", "improve", "all"]).default("all"),
        userId: z.string().default("default"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { searchTerm, category, userId } = input;

      let query = ctx.db
        .select()
        .from(userAttributes)
        .where(eq(userAttributes.userId, userId));

      if (searchTerm) {
        query = query.where(like(userAttributes.text, `%${searchTerm}%`));
      }

      if (category !== "all") {
        query = query.where(eq(userAttributes.category, category));
      }

      const results = await query;
      return results;
    }),

  create: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
        category: z.enum(["positive", "improve"]),
        userId: z.string().default("default"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(userAttributes).values({
        text: input.text,
        category: input.category,
        userId: input.userId,
      });
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(userAttributes)
        .where(eq(userAttributes.id, input.id));
      return { success: true };
    }),
});
