import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { favorites } from "~/server/db/schema";

const favoriteSchema = z.object({
  userId: z.number(),
  recipeId: z.number(),
});

export const favoriteRouter = createTRPCRouter({
  getForUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.favorites.findMany({
        where: eq(favorites.userId, input.userId),
        with: { recipe: true },
        orderBy: [desc(favorites.createdAt)],
      });
    }),

  add: publicProcedure
    .input(favoriteSchema)
    .mutation(async ({ ctx, input }) => {
      const [item] = await ctx.db.insert(favorites).values(input).returning();
      return item;
    }),

  remove: publicProcedure
    .input(favoriteSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(favorites)
        .where(
          and(
            eq(favorites.userId, input.userId),
            eq(favorites.recipeId, input.recipeId),
          ),
        );
      return { success: true };
    }),
});
