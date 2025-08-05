import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { recipeCategories } from "~/server/db/schema";

const recipeCategorySchema = z.object({
  recipeId: z.number(),
  categoryId: z.number(),
});

export const recipeCategoryRouter = createTRPCRouter({
  getForRecipe: publicProcedure
    .input(z.object({ recipeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.recipeCategories.findMany({
        where: eq(recipeCategories.recipeId, input.recipeId),
        with: { category: true },
      });
    }),

  addCategoryToRecipe: publicProcedure
    .input(recipeCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db
        .insert(recipeCategories)
        .values(input)
        .returning();
      return item;
    }),

  removeCategoryFromRecipe: publicProcedure
    .input(recipeCategorySchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(recipeCategories)
        .where(
          and(
            eq(recipeCategories.recipeId, input.recipeId),
            eq(recipeCategories.categoryId, input.categoryId),
          ),
        );
      return { success: true };
    }),
});
