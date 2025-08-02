import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ingredients } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const ingredientsRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(ingredients).values({
        name: input.name,
      });
    }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    const ingredients = await ctx.db.query.ingredients.findMany();
    return ingredients ?? null;
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const ingredient = await ctx.db.query.ingredients.findFirst({
        where: eq(ingredients.id, input.id),
      });
      return ingredient ?? null;
    }),
});
