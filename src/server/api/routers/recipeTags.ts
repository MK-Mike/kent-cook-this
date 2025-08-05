import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { recipeTags } from "~/server/db/schema";

const recipeTagSchema = z.object({
  recipeId: z.number(),
  tagId: z.number(),
});

export const recipeTagRouter = createTRPCRouter({
  getForRecipe: publicProcedure
    .input(z.object({ recipeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.recipeTags.findMany({
        where: eq(recipeTags.recipeId, input.recipeId),
        with: {
          tag: true,
        },
      });
    }),

  addTagToRecipe: publicProcedure
    .input(recipeTagSchema)
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db.insert(recipeTags).values(input).returning();
      return item;
    }),

  removeTagFromRecipe: publicProcedure
    .input(recipeTagSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(recipeTags)
        .where(
          and(
            eq(recipeTags.recipeId, input.recipeId),
            eq(recipeTags.tagId, input.tagId),
          ),
        );
      return { success: true };
    }),
});
