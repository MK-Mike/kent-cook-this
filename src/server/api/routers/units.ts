import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { units } from "~/server/db/schema";

export const unitRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.units.findMany();
  }),
});
