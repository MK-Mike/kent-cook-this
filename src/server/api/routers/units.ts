import { units } from "~/server/db/schema/ingredientData";
// import { z } from "zod";
// import { eq, like } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { unitSelectSchema } from "~/server/db/zodSchemas/ingredients";

export const unitRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.units.findMany();
  }),
  create: publicProcedure
    .input(unitSelectSchema)
    .mutation(async ({ ctx, input }) => {
      const [unit] = await ctx.db.insert(units).values(input).returning();
      return unit;
    }),
});
