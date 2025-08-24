import { units } from "~/server/db/schema/ingredientData";
import { z } from "zod";
// import { eq, like } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { unitSelectSchema } from "~/server/db/zodSchemas/ingredients";
import { convertIngredientUnit } from "~/lib/unit-scaler";
import { scaleQuantity, type ScaledResult } from "~/lib/unitScaler";

// Helper schema for scaling input
const scaleInputSchema = z.object({
  quantity: z.number(),
  unitId: z.number(),
  multiplier: z.number(),
});

// Zod schema for UnitRow (matching the UnitRow type in unitScaler.ts)
const unitRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  abbreviation: z.string(),
  type: z.enum(["mass", "volume"]),
  factorToBase: z.number(),
  system: z.enum(["metric", "imperial"]),
  subUnitId: z.number().nullable(),
  subUnitScale: z.number().nullable(),
});

// Zod schema for ScaledResult (matching the ScaledResult type in unitScaler.ts)
const scaledResultSchema: z.ZodSchema<ScaledResult> = z.union([
  z.object({
    value: z.number(),
    unit: unitRowSchema,
  }),
  z.object({
    major: z.number(),
    majorUnit: unitRowSchema,
    minor: z.number(),
    minorUnit: unitRowSchema,
  }),
]);
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
  convert: publicProcedure
    .input(
      z.object({
        quantity: z.number(),
        fromUnitId: z.number(),
        toUnitId: z.number(),
        ingredientId: z.number(),
      }),
    )
    .query(async ({ input }) => {
      const convertedValue = await convertIngredientUnit(
        input.quantity,
        input.fromUnitId,
        input.toUnitId,
        input.ingredientId,
      );
      return { value: convertedValue };
    }),
  scale: publicProcedure
    .input(scaleInputSchema)
    .output(scaledResultSchema) // Crucial for frontend type safety
    .query(async ({ input }) => {
      return await scaleQuantity(
        input.quantity,
        input.unitId,
        input.multiplier,
      );
    }),
});
