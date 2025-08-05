import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { recipes } from "~/server/db/schema";

const createRecipeSchema = z.object({
  authorId: z.number(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  prepTimeMins: z.number().positive().optional(),
  cookTimeMins: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),
});

const updateRecipeSchema = createRecipeSchema.partial().extend({
  id: z.number(),
});

export const recipeRouter = createTRPCRouter({
  create: publicProcedure
    .input(createRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      const [recipe] = await ctx.db.insert(recipes).values(input).returning();
      return recipe;
    }),

  update: publicProcedure
    .input(updateRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [recipe] = await ctx.db
        .update(recipes)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(recipes.id, id))
        .returning();
      return recipe;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.recipes.findMany({
      with: { author: true },
      orderBy: [desc(recipes.createdAt)],
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.recipes.findFirst({
        where: eq(recipes.id, input.id),
        with: {
          author: true,
          ingredients: { with: { ingredient: true, unit: true } },
          steps: true,
          recipeTags: { with: { tag: true } },
        },
      });
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.recipes.findFirst({
      orderBy: [desc(recipes.createdAt)],
      with: { author: true },
    });
  }),

  getByAuthor: publicProcedure
    .input(z.object({ authorId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.recipes.findMany({
        where: eq(recipes.authorId, input.authorId),
        with: { author: true },
        orderBy: [desc(recipes.createdAt)],
      });
    }),
});
