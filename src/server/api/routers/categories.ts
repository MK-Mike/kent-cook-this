import { z } from "zod";
import { eq, isNull } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { categories } from "~/server/db/schema";

const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  parentId: z.number().optional(),
  sortOrder: z.number().default(0),
});

const updateCategorySchema = createCategorySchema.partial().extend({
  id: z.number(),
});

export const categoryRouter = createTRPCRouter({
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const [category] = await ctx.db
        .insert(categories)
        .values(input)
        .returning();
      return category;
    }),

  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [category] = await ctx.db
        .update(categories)
        .set(data)
        .where(eq(categories.id, id))
        .returning();
      return category;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.categories.findMany({
      with: { subcategories: true, parent: true },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
        with: { subcategories: true, parent: true },
      });
    }),

  getRootCategories: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.categories.findMany({
      where: isNull(categories.parentId),
      with: { subcategories: true },
    });
  }),
});
