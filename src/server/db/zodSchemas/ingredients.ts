import z from "zod";
import {
  ingredients,
  units,
  ingredientDensities,
  unitTypeEnum,
} from "~/server/db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const ingredientInsertSchema = createInsertSchema(ingredients);
export const ingredientInsertDensitySchema =
  createInsertSchema(ingredientDensities);
export const ingredientSelectSchema = createSelectSchema(ingredients);
export const ingredientSelectDensitySchema =
  createSelectSchema(ingredientDensities);

// Base Drizzle-Zod schemas
const baseUnitInsertSchema = createInsertSchema(units);
const baseUnitSelectSchema = createSelectSchema(units);

// Explicitly define the 'type' as a Zod enum
export const unitInsertSchema = baseUnitInsertSchema.extend({
  type: z.enum(unitTypeEnum),
});

export const unitSelectSchema = baseUnitSelectSchema.extend({
  type: z.enum(unitTypeEnum),
});

export type InsertIngredient = z.infer<typeof ingredientInsertSchema>;
export type UnitInsertSchema = z.infer<typeof unitInsertSchema>;
export type IngredientDensityInsertSchema = z.infer<
  typeof ingredientInsertDensitySchema
>;
export type SelectIngredient = z.infer<typeof ingredientSelectSchema>;
export type SelectUnit = z.infer<typeof unitSelectSchema>;
export type SelectIngredientDensity = z.infer<
  typeof ingredientSelectDensitySchema
>;
