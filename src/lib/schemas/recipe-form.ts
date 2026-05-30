import { z } from "zod";

/**
 * Form-level schema for the new recipe page.
 */
export const ingredientFormSchema = z.object({
  name: z.string().min(1, "Ingredient name is required"),
  quantity: z.number().min(0, "Quantity must be positive").optional(),
  unitName: z.string().optional(),
  notes: z.string().optional(),
});

export const stepFormSchema = z.object({
  description: z.string().min(1, "Step description is required"),
  title: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const recipeFormSchema = z.object({
  title: z.string().min(1, "Recipe name is required"),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  servings: z.number().min(1, "Servings must be at least 1").optional(),
  prepTimeMins: z.number().min(0, "Prep time must be positive").optional(),
  cookTimeMins: z.number().min(0, "Cook time must be positive").optional(),
  ingredients: z.array(ingredientFormSchema).min(1, "At least one ingredient is required"),
  steps: z.array(stepFormSchema).min(1, "At least one step is required"),
  tagNames: z.string().optional(),
  categoryIds: z.array(z.number()),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;

/**
 * The shape expected by the tRPC createWithDetails mutation.
 */
export const ingredientInputSchema = z.object({
  ingredientId: z.number(),
  quantity: z.number().nullable(),
  unitId: z.number().nullable(),
});

export const stepInputSchema = z.object({
  position: z.number(),
  title: z.string().optional(),
  description: z.string().min(1),
  imageUrl: z.string().optional(),
  ingredientIds: z.array(z.number()).optional(),
});

export const createRecipeInputSchema = z.object({
  title: z.string().min(1).max(255),
  authorId: z.number(),
  description: z.string().optional(),
  prepTimeMins: z.number().positive().optional(),
  cookTimeMins: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  imageUrl: z.string().optional(),
  ingredients: z.array(ingredientInputSchema),
  steps: z.array(stepInputSchema),
  tagIds: z.array(z.number()),
  categoryIds: z.array(z.number()),
});

export type CreateRecipeInput = z.infer<typeof createRecipeInputSchema>;
