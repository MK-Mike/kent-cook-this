import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { stepIngredients } from "~/server/db/schema";

const stepIngredientSchema = z.object({
  stepId: z.number(),
  ingredientId: z.number(),
});

export const stepIngredientRouter = createTRPCRouter({
  addIngredientToStep: publicProcedure
    .input(stepIngredientSchema)
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .insert(stepIngredients)
        .values(input)
        .returning();
      return item;
    }),

  removeIngredientFromStep: publicProcedure
    .input(stepIngredientSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(stepIngredients)
        .where(
          and(
            eq(stepIngredients.stepId, input.stepId),
            eq(stepIngredients.ingredientId, input.ingredientId),
          ),
        );
      return { success: true };
    }),
});
