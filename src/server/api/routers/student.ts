import { eq, and } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { students, studentAttributes, attributes } from "~/server/db/schema";

export const studentRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allStudents = await ctx.db.query.students.findMany({
      orderBy: (students, { asc }) => [asc(students.name)],
    });
    return allStudents;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const student = await ctx.db.query.students.findFirst({
        where: eq(students.id, input.id),
      });
      return student;
    }),

  getStudentAttributes: publicProcedure
    .input(z.object({ studentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const studentAttrs = await ctx.db
        .select({
          id: attributes.id,
          text: attributes.text,
          category: attributes.category,
        })
        .from(studentAttributes)
        .innerJoin(attributes, eq(studentAttributes.attributeId, attributes.id))
        .where(eq(studentAttributes.studentId, input.studentId));
      return studentAttrs;
    }),

  addAttributeToStudent: publicProcedure
    .input(z.object({ studentId: z.number(), attributeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      // Check if the attribute is already assigned to the student
      const existing = await ctx.db
        .select()
        .from(studentAttributes)
        .where(
          and(
            eq(studentAttributes.studentId, input.studentId),
            eq(studentAttributes.attributeId, input.attributeId),
          ),
        );

      if (existing.length === 0) {
        await ctx.db.insert(studentAttributes).values({
          studentId: input.studentId,
          attributeId: input.attributeId,
        });
      }
      return { success: true };
    }),

  removeAttributeFromStudent: publicProcedure
    .input(z.object({ studentId: z.number(), attributeId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(studentAttributes)
        .where(
          and(
            eq(studentAttributes.studentId, input.studentId),
            eq(studentAttributes.attributeId, input.attributeId),
          ),
        );
      return { success: true };
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        gender: z.enum(["male", "female", "other"]).default("other"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(students).values({
        name: input.name,
        gender: input.gender,
      });
      return { success: true };
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(students).where(eq(students.id, input.id));
      return { success: true };
    }),
});
