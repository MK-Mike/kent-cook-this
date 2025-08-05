import { postRouter } from "~/server/api/routers/post";
import { recipeRouter } from "~/server/api/routers/recipes";
import { ingredientRouter } from "~/server/api/routers/ingredients";
import { tagRouter } from "~/server/api/routers/tags";
import { categoryRouter } from "~/server/api/routers/categories";
import { stepRouter } from "~/server/api/routers/steps";
import { commentRouter } from "~/server/api/routers/comments";
import { favoriteRouter } from "~/server/api/routers/favorites";
import { recipeIngredientRouter } from "~/server/api/routers/recipeIngredients";
import { recipeTagRouter } from "~/server/api/routers/recipeTags";
import { recipeCategoryRouter } from "~/server/api/routers/recipeCategories";
import { stepIngredientRouter } from "~/server/api/routers/stepIngredients";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

//export main tRPC router
export const appRouter = createTRPCRouter({
  // Core Routers
  post: postRouter,
  ingredients: ingredientRouter,
  recipes: recipeRouter,
  tags: tagRouter,
  categories: categoryRouter,
  steps: stepRouter,
  comments: commentRouter,
  favorites: favoriteRouter,

  // Junction / Relationship Routers
  recipeIngredients: recipeIngredientRouter,
  recipeTags: recipeTagRouter,
  recipeCategories: recipeCategoryRouter,
  stepIngredients: stepIngredientRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
