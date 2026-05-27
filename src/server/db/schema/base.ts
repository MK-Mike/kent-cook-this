import { sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const createTable = sqliteTableCreator(
  (name) => `kent-cook-this_${name}`,
);
