import { z } from "zod";
import { eq, asc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { steps } from "~/server/db/schema";

const createStepSchema = z.object({
  recipeId: z.number(),
  position: z.number(),
  title: z.string().optional(),
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

const updateStepSchema = createStepSchema.partial().extend({
  id: z.number(),
});

export const stepRouter = createTRPCRouter({
  getForRecipe: publicProcedure
    .input(z.object({ recipeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.steps.findMany({
        where: eq(steps.recipeId, input.recipeId),
        with: { stepIngredients: { with: { ingredient: true } } },
        orderBy: [asc(steps.position)],
      });
    }),

  create: publicProcedure
    .input(createStepSchema)
    .mutation(async ({ ctx, input }) => {
      const [step] = await ctx.db.insert(steps).values(input).returning();
      return step;
    }),

  update: publicProcedure
    .input(updateStepSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [step] = await ctx.db
        .update(steps)
        .set(data)
        .where(eq(steps.id, id))
        .returning();
      return step;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(steps).where(eq(steps.id, input.id));
      return { success: true };
    }),
});
