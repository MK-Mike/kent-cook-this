import { db } from "./index";
import * as schema from "./schema";
import * as data from "./seed-data";

export async function main() {
  // Order matters due to FKs!
  await db.insert(schema.users).values(data.mockUsers);
  await db.insert(schema.categories).values(data.mockCategories);
  await db.insert(schema.units).values(data.mockUnits);
  await db.insert(schema.ingredients).values(data.mockIngredients);
  await db
    .insert(schema.ingredientDensities)
    .values(data.mockIngredientDensities);
  await db.insert(schema.recipes).values(data.mockRecipes);
  await db.insert(schema.recipeCategories).values(data.mockRecipeCategories);
  await db.insert(schema.recipeIngredients).values(data.mockRecipeIngredients);
  await db.insert(schema.steps).values(data.mockSteps);
  await db.insert(schema.stepIngredients).values(data.mockStepIngredients);
  await db.insert(schema.favorites).values(data.mockFavorites);
  await db.insert(schema.comments).values(data.mockComments);

  console.log("🌱 Seed complete!");
}

// main()
//   .catch((err) => {
//     console.error("Seed failed:", err);
//     process.exit(1);
//   })
//   .finally(() => {
//     // db.close?.(); // If your db client supports close()
//     console.log("Go Water Your Seeds");
//   });
