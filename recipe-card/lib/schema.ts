import { pgTable, serial, text, timestamp, integer, boolean, pgEnum, unique } from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"
import { z } from "zod"

// Enums
export const unitTypeEnum = pgEnum("unit_type", ["mass", "volume", "count"])
export const tagTypeEnum = pgEnum("tag_type", [
  "dietary_preferences",
  "cuisines",
  "preparation_style",
  "occasions_and_seasons",
  "key_ingredients",
])

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
}))

// Categories Table (Hierarchical)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  parentId: integer("parent_id").references(() => categories.id), // Self-referencing for subcategories
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parent_category",
  }),
  subcategories: many(categories, { relationName: "parent_category" }),
  recipes: many(recipes),
}))

// Tags Table
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  type: tagTypeEnum("type").notNull(),
  color: text("color"), // Hex color for UI representation
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const tagsRelations = relations(tags, ({ many }) => ({
  recipeTags: many(recipeTags),
}))

// Units Table
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  abbreviation: text("abbreviation").unique(),
  type: unitTypeEnum("type").notNull(), // e.g., 'mass', 'volume', 'count'
  factorToBase: integer("factor_to_base").notNull(), // Factor to convert to a base unit (e.g., 1000 for kg to g)
  isMetric: boolean("is_metric").notNull(),
  subUnitId: integer("sub_unit_id").references(() => units.id), // For units like 'lb' having 'oz' as sub-unit
  subUnitScale: integer("sub_unit_scale"), // e.g., 16 for 1 lb = 16 oz
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const unitsRelations = relations(units, ({ one, many }) => ({
  subUnit: one(units, {
    fields: [units.subUnitId],
    references: [units.id],
    relationName: "parent_unit",
  }),
  parentUnits: many(units, { relationName: "parent_unit" }),
  recipeIngredients: many(recipeIngredients),
  ingredientDensities: many(ingredientDensities),
}))

// Ingredients Table
export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const ingredientsRelations = relations(ingredients, ({ many }) => ({
  recipeIngredients: many(recipeIngredients),
  ingredientDensities: many(ingredientDensities),
  stepIngredients: many(stepIngredients),
}))

// Ingredient Densities Table (for volume to mass conversion)
export const ingredientDensities = pgTable(
  "ingredient_densities",
  {
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
    densityGPerMl: integer("density_g_per_ml").notNull(), // Density in grams per milliliter
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    unq: unique().on(t.ingredientId),
  }),
)

export const ingredientDensitiesRelations = relations(ingredientDensities, ({ one }) => ({
  ingredient: one(ingredients, {
    fields: [ingredientDensities.ingredientId],
    references: [ingredients.id],
  }),
}))

// Recipes Table
export const recipes = pgTable("recipes", {
  id: text("id").primaryKey(), // Changed to text for UUID or custom IDs
  authorId: integer("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  prepTimeMinutes: integer("prep_time_minutes"),
  cookTimeMinutes: integer("cook_time_minutes"),
  servings: integer("servings"),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  subcategoryId: integer("subcategory_id").references(() => categories.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const recipesRelations = relations(recipes, ({ one, many }) => ({
  author: one(users, {
    fields: [recipes.authorId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [recipes.categoryId],
    references: [categories.id],
    relationName: "recipe_category",
  }),
  subcategory: one(categories, {
    fields: [recipes.subcategoryId],
    references: [categories.id],
    relationName: "recipe_subcategory",
  }),
  recipeIngredients: many(recipeIngredients),
  steps: many(steps),
  recipeTags: many(recipeTags),
}))

// Recipe Ingredients Table (Many-to-Many between Recipes and Ingredients)
export const recipeIngredients = pgTable(
  "recipe_ingredients",
  {
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    unitId: integer("unit_id")
      .notNull()
      .references(() => units.id, { onDelete: "restrict" }),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: unique().on(t.recipeId, t.ingredientId),
  }),
)

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
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
}))

// Steps Table
export const steps = pgTable("steps", {
  id: serial("id").primaryKey(),
  recipeId: text("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  position: integer("position").notNull(), // Order of the step
  title: text("title"),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const stepsRelations = relations(steps, ({ one, many }) => ({
  recipe: one(recipes, {
    fields: [steps.recipeId],
    references: [recipes.id],
  }),
  stepIngredients: many(stepIngredients),
}))

// Step Ingredients Table (Many-to-Many between Steps and Ingredients)
export const stepIngredients = pgTable(
  "step_ingredients",
  {
    stepId: integer("step_id")
      .notNull()
      .references(() => steps.id, { onDelete: "cascade" }),
    ingredientId: integer("ingredient_id")
      .notNull()
      .references(() => ingredients.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: unique().on(t.stepId, t.ingredientId),
  }),
)

export const stepIngredientsRelations = relations(stepIngredients, ({ one }) => ({
  step: one(steps, {
    fields: [stepIngredients.stepId],
    references: [steps.id],
  }),
  ingredient: one(ingredients, {
    fields: [stepIngredients.ingredientId],
    references: [ingredients.id],
  }),
}))

// Recipe Tags Table (Many-to-Many between Recipes and Tags)
export const recipeTags = pgTable(
  "recipe_tags",
  {
    recipeId: text("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: unique().on(t.recipeId, t.tagId),
  }),
)

export const recipeTagsRelations = relations(recipeTags, ({ one }) => ({
  recipe: one(recipes, {
    fields: [recipeTags.recipeId],
    references: [recipes.id],
  }),
  tag: one(tags, {
    fields: [recipeTags.tagId],
    references: [tags.id],
  }),
}))

// Schemas for validation
export const ingredientSchema = z.object({
  quantity: z
    .number()
    .min(0, "Quantity must be a positive number")
    .nullable()
    .transform((val) => (val === null ? 0 : val)),
  unit: z.string().min(1, "Unit is required"),
  name: z.string().min(1, "Ingredient name is required"),
  notes: z.string().optional(),
})

export const stepSchema = z.object({
  description: z.string().min(1, "Step description is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export const recipeFormSchema = z.object({
  name: z.string().min(1, "Recipe name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  servings: z.number().min(1, "Servings must be at least 1"),
  time: z.string().min(1, "Preparation time is required"),
  authorId: z.string().min(1, "Author is required"),
  tags: z.array(z.string()).optional(),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  steps: z.array(stepSchema).min(1, "At least one step is required"),
})

export type RecipeFormValues = z.infer<typeof recipeFormSchema>
