import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { recipeIngredients } from "~/server/db/schema";

const recipeIngredientSchema = z.object({
  recipeId: z.number(),
  ingredientId: z.number(),
  quantity: z.number().nullable().optional(),
  unitId: z.number().nullable().optional(),
});

export const recipeIngredientRouter = createTRPCRouter({
  getForRecipe: publicProcedure
    .input(z.object({ recipeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.recipeIngredients.findMany({
        where: eq(recipeIngredients.recipeId, input.recipeId),
        with: {
          ingredient: true,
          unit: true,
        },
      });
    }),

  addIngredientToRecipe: publicProcedure
    .input(recipeIngredientSchema)
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .insert(recipeIngredients)
        .values(input)
        .returning();
      return item;
    }),

  removeIngredientFromRecipe: publicProcedure
    .input(z.object({ recipeId: z.number(), ingredientId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(recipeIngredients)
        .where(
          and(
            eq(recipeIngredients.recipeId, input.recipeId),
            eq(recipeIngredients.ingredientId, input.ingredientId),
          ),
        );
      return { success: true };
    }),
});
