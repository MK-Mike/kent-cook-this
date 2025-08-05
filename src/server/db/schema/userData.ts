//schema.ts
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  sqliteTableCreator,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { recipes } from "./recipeData";
/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator(
  (name) => `kent-cook-this_${name}`,
);
export const users = createTable(
  "users",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 255 }).notNull(),
    email: d.text({ length: 320 }).notNull(),
    passwordHash: d.text().notNull(),
    avatarUrl: d.text(),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [uniqueIndex("users_email_idx").on(t.email)],
);
// USER FAVORITES
export const favorites = createTable(
  "favorites",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    userId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recipeId: d
      .integer({ mode: "number" })
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
  }),
  (t) => [uniqueIndex("favorites_user_recipe_idx").on(t.userId, t.recipeId)],
);

// COMMENTS
export const comments = createTable("comments", (d) => ({
  id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  recipeId: d
    .integer({ mode: "number" })
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  userId: d
    .integer({ mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "set null" }),
  content: d.text().notNull(),
  createdAt: d
    .integer({ mode: "timestamp" })
    .default(sql`(unixepoch())`)
    .notNull(),
}));

export const posts = createTable(
  "post",
  (d) => ({
    id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: d.text({ length: 256 }),
    createdAt: d
      .integer({ mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: d.integer({ mode: "timestamp" }).$onUpdate(() => new Date()),
  }),
  (t) => [index("name_idx").on(t.name)],
);
// ---------- //
// RELATIONS //
// ---------//

export const usersRelations = relations(users, ({ many }) => ({
  recipes: many(recipes),
  favorites: many(favorites),
  comments: many(comments),
}));
export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  recipe: one(recipes, {
    fields: [favorites.recipeId],
    references: [recipes.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  recipe: one(recipes, {
    fields: [comments.recipeId],
    references: [recipes.id],
  }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
}));
