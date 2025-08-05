//schema.ts
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { sqliteTableCreator, uniqueIndex } from "drizzle-orm/sqlite-core";
import { recipeCategories, recipeTags } from "./recipeData";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `kent-cook-this_${name}`,
);
export const tagTypeEnum = [
  "dietary_preferences",
  "cuisines",
  "preparation_style",
  "occasions_and_seasons",
  "key_ingredients",
] as const;

// Categories Table (Hierarchical)
export const categories = createTable(
  "categories",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text().notNull(),
    slug: d.text().notNull(),
    description: d.text(),
    parentId: d
      .integer({ mode: "number" })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .references((): any => categories.id),
    sortOrder: d.integer({ mode: "number" }).notNull().default(0),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [
    uniqueIndex("categories_slug_idx").on(t.slug),
    // uniqueIndex("categories_parent_id_idx").on(t.parentId),
  ],
);
// Tags Table
export const tags = createTable(
  "tags",
  (d) => ({
    id: d.integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text("name").notNull(),
    slug: d.text("slug").notNull(),
    type: d.text("type", { enum: tagTypeEnum }).notNull(), // Enum as TEXT
    color: d.text("color"),
    createdAt: d
      .integer("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [
    uniqueIndex("tags_slug_idx").on(t.slug),
    uniqueIndex("tags_name_idx").on(t.name),
  ],
);

// ---------- //
// RELATIONS //
// ---------//

// Categories Relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parent_category",
  }),
  subcategories: many(categories, { relationName: "parent_category" }),
  recipeCategories: many(recipeCategories),
}));

// Tags Relations
export const tagsRelations = relations(tags, ({ many }) => ({
  recipeTags: many(recipeTags),
}));
