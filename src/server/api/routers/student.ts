import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { students } from "~/server/db/schema";

export const studentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allStudents = await ctx.db.query.students.findMany({
      orderBy: (students, { asc }) => [asc(students.name)],
    });
    return allStudents;
  }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(students).values({
        name: input.name,
      });
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(students).where({ id: input.id });
      return { success: true };
    }),
});
