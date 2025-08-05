//schema.ts
import { relations } from "drizzle-orm";
import { sqliteTableCreator, uniqueIndex } from "drizzle-orm/sqlite-core";
import { recipeIngredients, stepIngredients } from "./recipeData";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `kent-cook-this_${name}`,
);
// INGREDIENTS MASTER LIST
export const ingredients = createTable(
  "ingredients",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 255 }).notNull(),
  }),
  (t) => [uniqueIndex("ingredients_name_unique").on(t.name)],
);
// ----------------------------------------------------
// UNIT CONVERSION & SCALING TABLES
// ----------------------------------------------------

// UNITS (enums stored as text with CHECK constraints)
export const units = createTable(
  "units",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 50 }).notNull(),
    abbreviation: d.text({ length: 10 }).notNull(),
    type: d.text().notNull(), // 'volume' or 'mass'
    factorToBase: d.real().notNull(),
    system: d.text().notNull(), // 'metric' or 'imperial'
    subUnitId: d
      .integer({ mode: "number" })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .references((): any => units.id, { onDelete: "set null" }),
    subUnitScale: d.integer({ mode: "number" }),
  }),
  (t) => [
    uniqueIndex("units_name_abbrev_type_idx").on(
      t.name,
      t.abbreviation,
      t.type,
    ),
  ],
);

// INGREDIENT DENSITY
export const ingredientDensities = createTable(
  "ingredient_densities",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    ingredientId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
    densityGPerMl: d.real().notNull(),
  }),
  (t) => [uniqueIndex("ingredient_density_ingredient_idx").on(t.ingredientId)],
);

// ---------- //
// RELATIONS //
// ---------//

export const ingredientsRelations = relations(ingredients, ({ one, many }) => ({
  recipeIngredients: many(recipeIngredients),
  density: one(ingredientDensities, {
    fields: [ingredients.id],
    references: [ingredientDensities.ingredientId],
  }),
  stepIngredients: many(stepIngredients),
}));

export const unitsRelations = relations(units, ({ many, one }) => ({
  recipeIngredients: many(recipeIngredients),
  parentUnit: one(units, {
    fields: [units.subUnitId],
    references: [units.id],
    relationName: "parent_unit",
  }),
  childUnits: many(units, {
    relationName: "parent_unit",
  }),
}));

export const ingredientDensitiesRelations = relations(
  ingredientDensities,
  ({ one }) => ({
    ingredient: one(ingredients, {
      fields: [ingredientDensities.ingredientId],
      references: [ingredients.id],
    }),
  }),
);
