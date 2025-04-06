import { z } from "zod";
import OpenAI from "openai";
import { env } from "~/env";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const openaiRouter = createTRPCRouter({
  generateReport: publicProcedure
    .input(
      z.object({
        studentName: z.string(),
        studentGender: z.string(),
        positiveAttributes: z.array(
          z.object({
            id: z.number(),
            text: z.string(),
            category: z.string(),
          }),
        ),
        improveAttributes: z.array(
          z.object({
            id: z.number(),
            text: z.string(),
            category: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const {
          studentName,
          studentGender,
          positiveAttributes,
          improveAttributes,
        } = input;

        // Construct the prompt for GPT
        const prompt = `Generate a detailed, professional student report for ${studentName} (${studentGender}). 
The report should be 250-300 words long and incorporate the following information:

Positive attributes:
${positiveAttributes.map((attr) => `- ${attr.text}`).join("\n")}

Areas for improvement:
${improveAttributes.map((attr) => `- ${attr.text}`).join("\n")}

The report should follow these specific criteria:

1. Structure: 8-10 sentences organized into paragraphs with line spaces between paragraphs. Do not repeat the same information.

2. Content should reflect key competencies across these areas:
   - Managing self (self-motivation, reliability, resourcefulness, resilience, goal-setting)
   - Relating to others (active listening, recognizing different viewpoints, negotiation, cooperation)
   - Participation and contributions (sense of belonging, confidence to participate)
   - Thinking (seeking knowledge, reflection, drawing on personal knowledge, asking questions)

3. Tone and style:
   - Professional and constructive
   - Highlight strengths while being encouraging about areas for improvement
   - Use specific examples from the provided attributes
   - End with an optimistic summary sentence that generalizes the overall assessment

4. Length: Aim for 250-300 words total.

Please generate the report:`;

        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a professional teacher writing detailed student reports for the first term. Your reports are constructive, specific, and encouraging. You focus on key competencies including managing self, relating to others, participation and contributions, and thinking skills. You write 8-10 sentences organized into paragraphs with line spaces between them. You never repeat the same information. You end with an optimistic summary sentence that generalizes the overall assessment.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 800,
        });

        const report = completion.choices[0]?.message?.content;

        if (!report) {
          throw new Error("Failed to generate report");
        }

        return {
          success: true,
          report,
        };
      } catch (error) {
        console.error("Error generating report:", error);
        return {
          success: false,
          error:
            error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    }),
});
