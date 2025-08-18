//schema.ts
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  sqliteTableCreator,
  uniqueIndex,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { tags, categories } from "./categoryData";
import { comments, favorites } from "./userData";
import { ingredients, units } from "./ingredientData";
import { users } from "./userData";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `kent-cook-this_${name}`,
);
export const recipes = createTable("recipes", (d) => ({
  id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  authorId: d
    .integer({ mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: d.text({ length: 255 }).notNull(),
  description: d.text(),
  prepTimeMins: d.integer({ mode: "number" }),
  cookTimeMins: d.integer({ mode: "number" }),
  servings: d.integer({ mode: "number" }).notNull(),
  imageUrl: d.text(),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
  updatedAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date()),
}));

// RECIPE ↔ INGREDIENT JOIN
export const recipeIngredients = createTable("recipe_ingredients", (d) => ({
  id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  recipeId: d
    .integer({ mode: "number" })
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  ingredientId: d
    .integer({ mode: "number" })
    .notNull()
    .references(() => ingredients.id, { onDelete: "restrict" }),
  quantity: d.real().notNull(),
  unitId: d
    .integer({ mode: "number" })
    .references(() => units.id, { onDelete: "restrict" }),
}));

// STEP-BY-STEP INSTRUCTIONS
export const steps = createTable(
  "steps",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    recipeId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    position: d.integer({ mode: "number" }).notNull(),
    title: d.text({ length: 255 }),
    description: d.text().notNull(),
    imageUrl: d.text(),
  }),
  (t) => [uniqueIndex("steps_recipe_position_idx").on(t.recipeId, t.position)],
);

// JOIN TABLE FOR INGREDIENTS PER STEP
export const stepIngredients = createTable(
  "step_ingredients",
  (d) => ({
    stepId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => steps.id, { onDelete: "cascade" }),
    ingredientId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => ingredients.id, { onDelete: "restrict" }),
  }),
  (t) => [primaryKey({ columns: [t.stepId, t.ingredientId] })],
);

// CATEGORIES

// RECIPE ↔ CATEGORY JOIN
export const recipeCategories = createTable(
  "recipe_categories",
  (d) => ({
    recipeId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    categoryId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
  }),
  (t) => [primaryKey({ columns: [t.recipeId, t.categoryId] })],
);

// Recipe Tags Table (Many-to-Many between Recipes and Tags)
export const recipeTags = createTable(
  "recipe_tags",
  (d) => ({
    recipeId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    tagId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [primaryKey({ columns: [t.recipeId, t.tagId] })],
);

// ---------- //
// RELATIONS //
// ---------//

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  author: one(users, { fields: [recipes.authorId], references: [users.id] }),
  ingredients: many(recipeIngredients),
  steps: many(steps),
  favorites: many(favorites),
  comments: many(comments),
  recipeTags: many(recipeTags),
}));
export const recipeIngredientsRelations = relations(
  recipeIngredients,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeIngredients.recipeId],
      references: [recipes.id],
    }),
    ingredient: one(ingredients, {
      fields: [recipeIngredients.ingredientId],
      references: [ingredients.id],
    }),
    unit: one(units, {
      fields: [recipeIngredients.unitId],
      references: [units.id],
    }),
  }),
);

export const stepsRelations = relations(steps, ({ one, many }) => ({
  recipe: one(recipes, { fields: [steps.recipeId], references: [recipes.id] }),
  stepIngredients: many(stepIngredients),
}));

export const stepIngredientsRelations = relations(
  stepIngredients,
  ({ one }) => ({
    step: one(steps, {
      fields: [stepIngredients.stepId],
      references: [steps.id],
    }),
    ingredient: one(ingredients, {
      fields: [stepIngredients.ingredientId],
      references: [ingredients.id],
    }),
  }),
);
// Recipe Tags Relations
export const recipeTagsRelations = relations(recipeTags, ({ one, many }) => ({
  recipe: one(recipes, {
    fields: [recipeTags.recipeId],
    references: [recipes.id],
  }),
  tag: one(tags, {
    fields: [recipeTags.tagId],
    references: [tags.id],
  }),
  recipeCategories: many(recipeCategories),
}));
export const recipeCategoriesRelations = relations(
  recipeCategories,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeCategories.recipeId],
      references: [recipes.id],
    }),
    category: one(categories, {
      fields: [recipeCategories.categoryId],
      references: [categories.id],
    }),
  }),
);
