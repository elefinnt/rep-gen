import { z } from "zod";
import { and, like, eq } from "drizzle-orm";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { attributes } from "~/server/db/schema";

export const attributeRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allAttributes = await ctx.db.query.attributes.findMany({
      orderBy: (attributes, { asc }) => [asc(attributes.text)],
    });
    return allAttributes;
  }),

  getByCategory: publicProcedure
    .input(z.object({ category: z.enum(["positive", "improve"]) }))
    .query(async ({ ctx, input }) => {
      const filteredAttributes = await ctx.db.query.attributes.findMany({
        where: (attributes, { eq }) => eq(attributes.category, input.category),
        orderBy: (attributes, { asc }) => [asc(attributes.text)],
      });
      return filteredAttributes;
    }),

  search: publicProcedure
    .input(
      z.object({
        searchTerm: z.string(),
        category: z
          .enum(["positive", "improve", "all"])
          .optional()
          .default("all"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { searchTerm, category } = input;

      // If search term is empty, return all attributes or filtered by category
      if (!searchTerm.trim()) {
        if (category === "all") {
          return ctx.db.query.attributes.findMany({
            orderBy: (attributes, { asc }) => [asc(attributes.text)],
          });
        } else {
          return ctx.db.query.attributes.findMany({
            where: (attributes, { eq }) => eq(attributes.category, category),
            orderBy: (attributes, { asc }) => [asc(attributes.text)],
          });
        }
      }

      // Search with term and optional category filter
      if (category === "all") {
        return ctx.db.query.attributes.findMany({
          where: (attributes, { like }) =>
            like(attributes.text, `%${searchTerm}%`),
          orderBy: (attributes, { asc }) => [asc(attributes.text)],
        });
      } else {
        return ctx.db.query.attributes.findMany({
          where: (attributes, ops) =>
            and(
              eq(attributes.category, category),
              like(attributes.text, `%${searchTerm}%`),
            ),
          orderBy: (attributes, { asc }) => [asc(attributes.text)],
        });
      }
    }),

  create: publicProcedure
    .input(
      z.object({
        text: z.string().min(1),
        category: z.enum(["positive", "improve"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(attributes).values({
        text: input.text,
        category: input.category,
      });
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(attributes).where(eq(attributes.id, input.id));
      return { success: true };
    }),
});
