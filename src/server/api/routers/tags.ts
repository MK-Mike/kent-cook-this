import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { tags, tagTypeEnum, recipeTags } from "~/server/db/schema";

const createTagSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  type: z.enum(tagTypeEnum),
  color: z.string().optional(),
});

const updateTagSchema = createTagSchema.partial().extend({
  id: z.number(),
});

export const tagRouter = createTRPCRouter({
  create: publicProcedure
    .input(createTagSchema)
    .mutation(async ({ ctx, input }) => {
      const [tag] = await ctx.db.insert(tags).values(input).returning();
      return tag;
    }),

  update: publicProcedure
    .input(updateTagSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const [tag] = await ctx.db
        .update(tags)
        .set(data)
        .where(eq(tags.id, id))
        .returning();
      return tag;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.tags.findMany();
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.tags.findFirst({
        where: eq(tags.id, input.id),
      });
    }),

  getByType: publicProcedure
    .input(z.object({ type: z.enum(tagTypeEnum) }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.tags.findMany({
        where: eq(tags.type, input.type),
      });
    }),

  /**
   * Returns only tags that have at least one recipe associated with them.
   * Used by the sidebar to avoid showing empty tags.
   */
  getActive: publicProcedure.query(async ({ ctx }) => {
    const activeTagIds = ctx.db
      .select({ id: recipeTags.tagId })
      .from(recipeTags)
      .groupBy(recipeTags.tagId);

    return await ctx.db.query.tags.findMany({
      where: inArray(tags.id, activeTagIds),
    });
  }),
});
