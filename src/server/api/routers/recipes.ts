import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  recipeCategories,
  recipeIngredients,
  recipes,
  recipeTags,
  stepIngredients,
  steps,
} from "~/server/db/schema";

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

// Schema for a single ingredient within the recipe
const recipeIngredientInputSchema = z.object({
  ingredientId: z.number(),
  quantity: z.number().nullable(),
  unitId: z.number().nullable(),
});

// NEW: Updated schema for a single step to include its ingredients
const stepInputSchema = z.object({
  position: z.number(),
  title: z.string().optional(),
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
  ingredientIds: z.array(z.number()).optional(), // <-- The key addition
});

// The main schema for the entire recipe creation form
const createRecipeWithDetailsSchema = z.object({
  // Main recipe fields
  title: z.string().min(1).max(255),
  authorId: z.number(),
  description: z.string().optional(),
  prepTimeMins: z.number().positive().optional(),
  cookTimeMins: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  imageUrl: z.string().url().optional(),

  // Nested arrays for related data
  ingredients: z.array(recipeIngredientInputSchema),
  steps: z.array(stepInputSchema), // This now uses the updated step schema
  tagIds: z.array(z.number()),
  categoryIds: z.array(z.number()),
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
  createWithDetails: publicProcedure
    .input(createRecipeWithDetailsSchema)
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.transaction(async (tx) => {
        const [newRecipe] = await tx
          .insert(recipes)
          .values({
            title: input.title,
            authorId: input.authorId,
            description: input.description,
            prepTimeMins: input.prepTimeMins,
            cookTimeMins: input.cookTimeMins,
            servings: input.servings,
            imageUrl: input.imageUrl,
          })
          .returning({ id: recipes.id });

        const recipeId = newRecipe!.id;

        // Fixed: Use correct table reference
        if (input.ingredients.length > 0) {
          await tx.insert(recipeIngredients).values(
            input.ingredients.map((ing) => ({
              recipeId: recipeId,
              ingredientId: ing.ingredientId,
              quantity: ing.quantity,
              unitId: ing.unitId,
            })),
          );
        }

        if (input.steps.length > 0) {
          const newSteps = await tx
            .insert(steps)
            .values(
              input.steps.map((step) => ({
                recipeId: recipeId,
                position: step.position,
                description: step.description,
                title: step.title,
                imageUrl: step.imageUrl,
              })),
            )
            .returning({ id: steps.id, position: steps.position });

          const stepIdMap = new Map(newSteps.map((s) => [s.position, s.id]));

          const allStepIngredients = input.steps.flatMap((step) => {
            const stepId = stepIdMap.get(step.position);
            if (
              !stepId ||
              !step.ingredientIds ||
              step.ingredientIds.length === 0
            ) {
              return [];
            }
            return step.ingredientIds.map((ingredientId) => ({
              stepId: stepId,
              ingredientId: ingredientId,
            }));
          });

          if (allStepIngredients.length > 0) {
            await tx.insert(stepIngredients).values(allStepIngredients);
          }
        }

        if (input.tagIds.length > 0) {
          await tx
            .insert(recipeTags)
            .values(input.tagIds.map((tagId) => ({ recipeId, tagId })));
        }

        if (input.categoryIds.length > 0) {
          await tx
            .insert(recipeCategories)
            .values(
              input.categoryIds.map((categoryId) => ({ recipeId, categoryId })),
            );
        }

        return { recipeId };
      });
    }),
});
