import { z } from "zod";
import { eq, like } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ingredients } from "~/server/db/schema";

const createIngredientSchema = z.object({
  name: z.string().min(1).max(255),
});

const updateIngredientSchema = createIngredientSchema.partial().extend({
  id: z.number(),
});

export const ingredientRouter = createTRPCRouter({
  create: publicProcedure
    .input(createIngredientSchema)
    .mutation(async ({ ctx, input }) => {
      const [ingredient] = await ctx.db
        .insert(ingredients)
        .values(input)
        .returning();
      return ingredient;
    }),

  update: publicProcedure
    .input(updateIngredientSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [ingredient] = await ctx.db
        .update(ingredients)
        .set(data)
        .where(eq(ingredients.id, id))
        .returning();
      return ingredient;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.ingredients.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.ingredients.findFirst({
        where: eq(ingredients.id, input.id),
        with: { density: true },
      });
    }),

  search: publicProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.ingredients.findMany({
        where: like(ingredients.name, `%${input.query}%`),
      });
    }),
});
