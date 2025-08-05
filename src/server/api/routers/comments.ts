import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { comments } from "~/server/db/schema";

const createCommentSchema = z.object({
  recipeId: z.number(),
  userId: z.number(),
  content: z.string().min(1),
});

const updateCommentSchema = z.object({
  id: z.number(),
  content: z.string().min(1),
});

export const commentRouter = createTRPCRouter({
  getForRecipe: publicProcedure
    .input(z.object({ recipeId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.comments.findMany({
        where: eq(comments.recipeId, input.recipeId),
        with: { user: true },
        orderBy: [desc(comments.createdAt)],
      });
    }),

  create: publicProcedure
    .input(createCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const [comment] = await ctx.db.insert(comments).values(input).returning();
      return comment;
    }),

  update: publicProcedure
    .input(updateCommentSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, content } = input;
      const [comment] = await ctx.db
        .update(comments)
        .set({ content })
        .where(eq(comments.id, id))
        .returning();
      return comment;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(comments).where(eq(comments.id, input.id));
      return { success: true };
    }),
});
