import type { InferInsertModel } from "drizzle-orm";
import type {
  users,
  recipes,
  ingredients,
  units,
  ingredientDensities,
  recipeIngredients,
  steps,
  stepIngredients,
  categories,
  recipeCategories,
  favorites,
  comments,
} from "./schema";

// --- MOCK DATA FOR SEEDING ---

// Helper function to convert dates to Unix timestamps
// const toUnixTimestamp = (date: Date) => Math.floor(date.getTime() / 1000);
const toUnixTimestamp = (date: Date) => date;

// 1. Users
export const mockUsers: InferInsertModel<typeof users>[] = [
  {
    id: 1,
    name: "Chef Alex",
    email: "alex@example.com",
    passwordHash: "hashedpassword1_replace_with_real_hash",
    avatarUrl: "/avatars/alex.jpg",
    createdAt: toUnixTimestamp(new Date("2023-01-15T10:00:00Z")),
  },
  {
    id: 2,
    name: "Gourmet Bella",
    email: "bella@example.com",
    passwordHash: "hashedpassword2_replace_with_real_hash",
    avatarUrl: "/avatars/bella.jpg",
    createdAt: toUnixTimestamp(new Date("2023-02-20T11:30:00Z")),
  },
  {
    id: 3,
    name: "Foodie Charlie",
    email: "charlie@example.com",
    passwordHash: "hashedpassword3_replace_with_real_hash",
    avatarUrl: "/avatars/charlie.jpg",
    createdAt: toUnixTimestamp(new Date("2023-03-01T09:15:00Z")),
  },
];

// 2. Categories (General recipe classifications)
export const mockCategories: InferInsertModel<typeof categories>[] = [
  {
    id: 101,
    name: "Main Course",
    slug: "main-course",
    description: "Primary dishes for meals",
    parentId: null,
    sortOrder: 0,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 102,
    name: "Dessert",
    slug: "dessert",
    description: "Sweet treats and after-dinner delights",
    parentId: null,
    sortOrder: 1,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 103,
    name: "Appetizer",
    slug: "appetizer",
    description: "Small dishes served before the main course",
    parentId: null,
    sortOrder: 2,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 104,
    name: "Breakfast",
    slug: "breakfast",
    description: "Morning meal dishes",
    parentId: null,
    sortOrder: 3,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 105,
    name: "Vegan",
    slug: "vegan",
    description: "Plant-based dishes with no animal products",
    parentId: null,
    sortOrder: 4,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 106,
    name: "Healthy",
    slug: "healthy",
    description: "Nutritious and wholesome recipes",
    parentId: null,
    sortOrder: 5,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 107,
    name: "Mediterranean",
    slug: "mediterranean",
    description: "Dishes inspired by Mediterranean cuisine",
    parentId: null,
    sortOrder: 6,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 108,
    name: "Bakes",
    slug: "bakes",
    description: "Oven-baked dishes and treats",
    parentId: null,
    sortOrder: 7,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 109,
    name: "Chocolate",
    slug: "chocolate",
    description: "Chocolate-based recipes",
    parentId: 102, // Child of Dessert
    sortOrder: 0,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 110,
    name: "Family Recipe",
    slug: "family-recipe",
    description: "Traditional family recipes passed down through generations",
    parentId: null,
    sortOrder: 8,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 111,
    name: "Spicy",
    slug: "spicy",
    description: "Dishes with heat and bold flavors",
    parentId: null,
    sortOrder: 9,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 112,
    name: "Beef",
    slug: "beef",
    description: "Beef-based dishes",
    parentId: 101, // Child of Main Course
    sortOrder: 0,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 113,
    name: "Quick",
    slug: "quick",
    description: "Fast and easy recipes for busy schedules",
    parentId: null,
    sortOrder: 10,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 114,
    name: "Italian",
    slug: "italian",
    description: "Traditional Italian cuisine",
    parentId: null,
    sortOrder: 11,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
  {
    id: 115,
    name: "Comfort Food",
    slug: "comfort-food",
    description: "Hearty, satisfying dishes that bring comfort",
    parentId: null,
    sortOrder: 12,
    createdAt: toUnixTimestamp(new Date("2023-01-01T00:00:00Z")),
  },
];

// 3. Units
export const mockUnits: InferInsertModel<typeof units>[] = [
  // Metric Volume (Base = 1ml)
  {
    id: 1,
    name: "Milliliter",
    abbreviation: "ml",
    type: "volume",
    factorToBase: 1,
    system: "metric",
    subUnitId: null,
    subUnitScale: null,
  },
  {
    id: 2,
    name: "Liter",
    abbreviation: "l",
    type: "volume",
    factorToBase: 1000,
    system: "metric",
    subUnitId: 1,
    subUnitScale: 1000,
  },

  // Imperial Volume (Base = 1ml for calculations)
  {
    id: 3,
    name: "Teaspoon",
    abbreviation: "tsp",
    type: "volume",
    factorToBase: 4.92892,
    system: "imperial",
    subUnitId: null,
    subUnitScale: null,
  },
  {
    id: 4,
    name: "Tablespoon",
    abbreviation: "tbsp",
    type: "volume",
    factorToBase: 14.7868,
    system: "imperial",
    subUnitId: 3,
    subUnitScale: 3,
  },
  {
    id: 5,
    name: "Cup",
    abbreviation: "cup",
    type: "volume",
    factorToBase: 236.588,
    system: "imperial",
    subUnitId: 4,
    subUnitScale: 16,
  },

  // Metric Mass (Base = 1g)
  {
    id: 6,
    name: "Gram",
    abbreviation: "g",
    type: "mass",
    factorToBase: 1,
    system: "metric",
    subUnitId: null,
    subUnitScale: null,
  },
  {
    id: 7,
    name: "Kilogram",
    abbreviation: "kg",
    type: "mass",
    factorToBase: 1000,
    system: "metric",
    subUnitId: 6,
    subUnitScale: 1000,
  },

  // Imperial Mass (Base = 1g for calculations)
  {
    id: 8,
    name: "Ounce",
    abbreviation: "oz",
    type: "mass",
    factorToBase: 28.3495,
    system: "imperial",
    subUnitId: null,
    subUnitScale: null,
  },
  {
    id: 9,
    name: "Pound",
    abbreviation: "lb",
    type: "mass",
    factorToBase: 453.592,
    system: "imperial",
    subUnitId: 8,
    subUnitScale: 16,
  },

  // Generic/Countable Units
  {
    id: 10,
    name: "Piece",
    abbreviation: "pc",
    type: "volume",
    factorToBase: 1,
    system: "imperial",
    subUnitId: null,
    subUnitScale: null,
  },
  {
    id: 11,
    name: "Whole",
    abbreviation: "",
    type: "volume",
    factorToBase: 1,
    system: "imperial",
    subUnitId: null,
    subUnitScale: null,
  },
  {
    id: 12,
    name: "Handful",
    abbreviation: "handful",
    type: "volume",
    factorToBase: 40,
    system: "imperial",
    subUnitId: null,
    subUnitScale: null,
  },
];

// 4. Ingredients (Master list of unique ingredient names)
export const mockIngredients: InferInsertModel<typeof ingredients>[] = [
  { id: 1, name: "Quinoa" },
  { id: 2, name: "Vegetable Broth" },
  { id: 3, name: "Cucumber" },
  { id: 4, name: "Cherry Tomatoes" },
  { id: 5, name: "Red Onion" },
  { id: 6, name: "Kalamata Olives" },
  { id: 7, name: "Feta Cheese" },
  { id: 8, name: "Olive Oil" },
  { id: 9, name: "Lemon" },
  { id: 10, name: "Fresh Herbs" },
  { id: 11, name: "All-Purpose Flour" },
  { id: 12, name: "Sugar" },
  { id: 13, name: "Cocoa Powder" },
  { id: 14, name: "Baking Soda" },
  { id: 15, name: "Eggs" },
  { id: 16, name: "Buttermilk" },
  { id: 17, name: "Vegetable Oil" },
  { id: 18, name: "Vanilla Extract" },
  { id: 19, name: "Beef Sirloin" },
  { id: 20, name: "Bell Peppers" },
  { id: 21, name: "Garlic Cloves" },
  { id: 22, name: "Soy Sauce" },
  { id: 23, name: "Chili Sauce" },
  { id: 24, name: "Onion" },
  { id: 25, name: "Salt" },
  { id: 26, name: "Black Pepper" },
];

// 5. Ingredient Densities (Required for volume <-> mass conversions)
export const mockIngredientDensities: InferInsertModel<
  typeof ingredientDensities
>[] = [
  { ingredientId: 1, densityGPerMl: 0.85 }, // Quinoa
  { ingredientId: 2, densityGPerMl: 1.0 }, // Vegetable Broth
  { ingredientId: 8, densityGPerMl: 0.918 }, // Olive Oil
  { ingredientId: 11, densityGPerMl: 0.593 }, // All-Purpose Flour
  { ingredientId: 12, densityGPerMl: 0.847 }, // Sugar
  { ingredientId: 13, densityGPerMl: 0.56 }, // Cocoa Powder
  { ingredientId: 16, densityGPerMl: 1.03 }, // Buttermilk
  { ingredientId: 17, densityGPerMl: 0.92 }, // Vegetable Oil
];

// 6. Recipes
export const mockRecipes: InferInsertModel<typeof recipes>[] = [
  {
    id: 1,
    authorId: 1,
    title: "Mediterranean Quinoa Bowl",
    description:
      "A fresh and vibrant bowl, packed with protein and healthy fats, perfect for a quick, nutritious meal.",
    prepTimeMins: 15,
    cookTimeMins: 10,
    servings: 4,
    imageUrl: "/images/mediterranean-quinoa-bowl.jpg",
    createdAt: toUnixTimestamp(new Date("2023-04-01T14:00:00Z")),
    updatedAt: toUnixTimestamp(new Date("2023-04-01T14:00:00Z")),
  },
  {
    id: 2,
    authorId: 2,
    title: "Grandma's Classic Chocolate Cake",
    description:
      "A timeless, rich, and moist chocolate cake recipe, a true family favorite for any celebration.",
    prepTimeMins: 20,
    cookTimeMins: 35,
    servings: 8,
    imageUrl: "/images/chocolate-cake.jpg",
    createdAt: toUnixTimestamp(new Date("2023-04-10T16:00:00Z")),
    updatedAt: toUnixTimestamp(new Date("2023-04-10T16:00:00Z")),
  },
  {
    id: 3,
    authorId: 3,
    title: "Spicy Beef Stir Fry",
    description:
      "A quick and flavorful stir fry with tender beef and crisp vegetables, perfect for a weeknight dinner.",
    prepTimeMins: 10,
    cookTimeMins: 10,
    servings: 4,
    imageUrl: "/images/spicy-beef-stir-fry.jpg",
    createdAt: toUnixTimestamp(new Date("2023-04-20T18:30:00Z")),
    updatedAt: toUnixTimestamp(new Date("2023-04-20T18:30:00Z")),
  },
];

// 7. Recipe Categories (Join Table)
export const mockRecipeCategories: InferInsertModel<typeof recipeCategories>[] =
  [
    // Mediterranean Quinoa Bowl (Recipe ID 1)
    { recipeId: 1, categoryId: 101 }, // Main Course
    { recipeId: 1, categoryId: 105 }, // Vegan
    { recipeId: 1, categoryId: 106 }, // Healthy
    { recipeId: 1, categoryId: 107 }, // Mediterranean
    { recipeId: 1, categoryId: 113 }, // Quick

    // Grandma's Classic Chocolate Cake (Recipe ID 2)
    { recipeId: 2, categoryId: 102 }, // Dessert
    { recipeId: 2, categoryId: 108 }, // Bakes
    { recipeId: 2, categoryId: 109 }, // Chocolate
    { recipeId: 2, categoryId: 110 }, // Family Recipe
    { recipeId: 2, categoryId: 115 }, // Comfort Food

    // Spicy Beef Stir Fry (Recipe ID 3)
    { recipeId: 3, categoryId: 101 }, // Main Course
    { recipeId: 3, categoryId: 111 }, // Spicy
    { recipeId: 3, categoryId: 112 }, // Beef
    { recipeId: 3, categoryId: 113 }, // Quick
  ];

// 8. Recipe Ingredients (Join Table: What ingredients a recipe *calls for*)
export const mockRecipeIngredients: InferInsertModel<
  typeof recipeIngredients
>[] = [
  // Mediterranean Quinoa Bowl (Recipe ID 1)
  { id: 1, recipeId: 1, ingredientId: 1, quantity: 1, unitId: 5 }, // Quinoa, 1 cup
  { id: 2, recipeId: 1, ingredientId: 2, quantity: 2, unitId: 5 }, // Vegetable Broth, 2 cups
  { id: 3, recipeId: 1, ingredientId: 3, quantity: 1, unitId: 11 }, // Cucumber, 1 Whole
  { id: 4, recipeId: 1, ingredientId: 4, quantity: 1, unitId: 5 }, // Cherry Tomatoes, 1 cup
  { id: 5, recipeId: 1, ingredientId: 5, quantity: 0.5, unitId: 11 }, // Red Onion, 0.5 Whole
  { id: 6, recipeId: 1, ingredientId: 6, quantity: 0.25, unitId: 5 }, // Kalamata Olives, 0.25 cup
  { id: 7, recipeId: 1, ingredientId: 7, quantity: 0.25, unitId: 5 }, // Feta Cheese, 0.25 cup
  { id: 8, recipeId: 1, ingredientId: 8, quantity: 2, unitId: 4 }, // Olive Oil, 2 tbsp
  { id: 9, recipeId: 1, ingredientId: 9, quantity: 1, unitId: 11 }, // Lemon, 1 Whole
  { id: 10, recipeId: 1, ingredientId: 10, quantity: 1, unitId: 12 }, // Fresh Herbs, 1 handful

  // Grandma's Classic Chocolate Cake (Recipe ID 2)
  { id: 11, recipeId: 2, ingredientId: 11, quantity: 2, unitId: 5 }, // All-Purpose Flour, 2 cups
  { id: 12, recipeId: 2, ingredientId: 12, quantity: 2, unitId: 5 }, // Sugar, 2 cups
  { id: 13, recipeId: 2, ingredientId: 13, quantity: 0.75, unitId: 5 }, // Cocoa Powder, 0.75 cup
  { id: 14, recipeId: 2, ingredientId: 14, quantity: 2, unitId: 3 }, // Baking Soda, 2 tsp
  { id: 15, recipeId: 2, ingredientId: 15, quantity: 2, unitId: 10 }, // Eggs, 2 pc
  { id: 16, recipeId: 2, ingredientId: 16, quantity: 1, unitId: 5 }, // Buttermilk, 1 cup
  { id: 17, recipeId: 2, ingredientId: 17, quantity: 0.5, unitId: 5 }, // Vegetable Oil, 0.5 cup
  { id: 18, recipeId: 2, ingredientId: 18, quantity: 1, unitId: 3 }, // Vanilla Extract, 1 tsp

  // Spicy Beef Stir Fry (Recipe ID 3)
  { id: 19, recipeId: 3, ingredientId: 19, quantity: 1, unitId: 9 }, // Beef Sirloin, 1 lb
  { id: 20, recipeId: 3, ingredientId: 20, quantity: 2, unitId: 11 }, // Bell Peppers, 2 Whole
  { id: 21, recipeId: 3, ingredientId: 24, quantity: 1, unitId: 11 }, // Onion, 1 Whole
  { id: 22, recipeId: 3, ingredientId: 21, quantity: 3, unitId: 10 }, // Garlic Cloves, 3 pc
  { id: 23, recipeId: 3, ingredientId: 22, quantity: 3, unitId: 4 }, // Soy Sauce, 3 tbsp
  { id: 24, recipeId: 3, ingredientId: 23, quantity: 2, unitId: 4 }, // Chili Sauce, 2 tbsp
  { id: 25, recipeId: 3, ingredientId: 17, quantity: 2, unitId: 4 }, // Vegetable Oil, 2 tbsp
];

// 9. Steps (Instruction details for each recipe)
export const mockSteps: InferInsertModel<typeof steps>[] = [
  // Recipe 1: Mediterranean Quinoa Bowl (id: 1)
  {
    id: 1,
    recipeId: 1,
    position: 1,
    title: "Cook Quinoa & Prepare Vegetables",
    description:
      "Rinse quinoa thoroughly and cook in vegetable broth according to package instructions. While quinoa cooks, dice the cucumber, halve the cherry tomatoes, and thinly slice the red onion.",
    imageUrl: "/images/steps/quinoa-bowl-step1.jpg",
  },
  {
    id: 2,
    recipeId: 1,
    position: 2,
    title: "Make the Dressing",
    description:
      "In a small bowl, whisk together the olive oil, juice from one lemon, a pinch of salt, and black pepper until well combined.",
    imageUrl: "/images/steps/quinoa-bowl-step2.jpg",
  },
  {
    id: 3,
    recipeId: 1,
    position: 3,
    title: "Assemble the Bowl",
    description:
      "Once quinoa is cooked and cooled slightly, combine it in a large bowl with the prepared vegetables, kalamata olives, and crumbled feta cheese. Drizzle generously with the dressing and toss gently to combine. Garnish with fresh herbs before serving.",
    imageUrl: "/images/steps/quinoa-bowl-step3.jpg",
  },

  // Recipe 2: Grandma's Classic Chocolate Cake (id: 2)
  {
    id: 4,
    recipeId: 2,
    position: 1,
    title: "Preheat Oven and Prepare Pans",
    description:
      "Preheat your oven to 350°F (175°C). Lightly grease and flour two 9-inch round cake pans. Set aside.",
    imageUrl: "/images/steps/cake-step1.jpg",
  },
  {
    id: 5,
    recipeId: 2,
    position: 2,
    title: "Mix Dry Ingredients",
    description:
      "In a large mixing bowl, whisk together the all-purpose flour, sugar, cocoa powder, and baking soda. Ensure no lumps remain.",
    imageUrl: "/images/steps/cake-step2.jpg",
  },
  {
    id: 6,
    recipeId: 2,
    position: 3,
    title: "Combine Wet Ingredients",
    description:
      "In a separate medium bowl, lightly beat the eggs. Then, stir in the buttermilk, vegetable oil, and vanilla extract until fully incorporated.",
    imageUrl: "/images/steps/cake-step3.jpg",
  },
  {
    id: 7,
    recipeId: 2,
    position: 4,
    title: "Combine and Bake",
    description:
      "Gradually add the wet ingredients to the dry ingredients, mixing with a spatula until just combined. Do not overmix. Divide the batter evenly between the prepared pans and bake for 30-35 minutes, or until a toothpick inserted into the center comes out clean.",
    imageUrl: "/images/steps/cake-step4.jpg",
  },

  // Recipe 3: Spicy Beef Stir Fry (id: 3)
  {
    id: 8,
    recipeId: 3,
    position: 1,
    title: "Prepare Ingredients",
    description:
      "Slice the beef sirloin thinly against the grain. Cut bell peppers and onion into thin strips. Mince the garlic cloves.",
    imageUrl: "/images/steps/stirfry-step1.jpg",
  },
  {
    id: 9,
    recipeId: 3,
    position: 2,
    title: "Cook Beef",
    description:
      "Heat 1 tablespoon of vegetable oil in a large wok or skillet over high heat. Add the sliced beef and stir-fry until browned, about 2-3 minutes. Remove beef from the pan and set aside.",
    imageUrl: "/images/steps/stirfry-step2.jpg",
  },
  {
    id: 10,
    recipeId: 3,
    position: 3,
    title: "Stir-fry Vegetables",
    description:
      "Add the remaining 1 tablespoon of vegetable oil to the wok. Add bell peppers, onion, and minced garlic. Stir-fry for 3-4 minutes until vegetables are crisp-tender.",
    imageUrl: "/images/steps/stirfry-step3.jpg",
  },
  {
    id: 11,
    recipeId: 3,
    position: 4,
    title: "Combine and Finish",
    description:
      "Return the cooked beef to the wok. Add soy sauce and chili sauce. Toss everything together until well coated and heated through. Serve immediately with rice or noodles.",
    imageUrl: "/images/steps/stirfry-step4.jpg",
  },
];

// 10. Step Ingredients (Join Table: Which ingredients are mentioned/used in which step)
export const mockStepIngredients: InferInsertModel<typeof stepIngredients>[] = [
  // Recipe 1, Step 1
  { stepId: 1, ingredientId: 1 }, // Quinoa
  { stepId: 1, ingredientId: 2 }, // Vegetable Broth
  { stepId: 1, ingredientId: 3 }, // Cucumber
  { stepId: 1, ingredientId: 4 }, // Cherry Tomatoes
  { stepId: 1, ingredientId: 5 }, // Red Onion
  // Recipe 1, Step 2
  { stepId: 2, ingredientId: 8 }, // Olive Oil
  { stepId: 2, ingredientId: 9 }, // Lemon
  { stepId: 2, ingredientId: 25 }, // Salt
  { stepId: 2, ingredientId: 26 }, // Black Pepper
  // Recipe 1, Step 3
  { stepId: 3, ingredientId: 6 }, // Kalamata Olives
  { stepId: 3, ingredientId: 7 }, // Feta Cheese
  { stepId: 3, ingredientId: 10 }, // Fresh Herbs

  // Recipe 2, Step 2
  { stepId: 5, ingredientId: 11 }, // All-Purpose Flour
  { stepId: 5, ingredientId: 12 }, // Sugar
  { stepId: 5, ingredientId: 13 }, // Cocoa Powder
  { stepId: 5, ingredientId: 14 }, // Baking Soda
  // Recipe 2, Step 3
  { stepId: 6, ingredientId: 15 }, // Eggs
  { stepId: 6, ingredientId: 16 }, // Buttermilk
  { stepId: 6, ingredientId: 17 }, // Vegetable Oil
  { stepId: 6, ingredientId: 18 }, // Vanilla Extract

  // Recipe 3, Step 1
  { stepId: 8, ingredientId: 19 }, // Beef Sirloin
  { stepId: 8, ingredientId: 20 }, // Bell Peppers
  { stepId: 8, ingredientId: 24 }, // Onion
  { stepId: 8, ingredientId: 21 }, // Garlic Cloves
  // Recipe 3, Step 2
  { stepId: 9, ingredientId: 17 }, // Vegetable Oil
  { stepId: 9, ingredientId: 19 }, // Beef Sirloin
  // Recipe 3, Step 3
  { stepId: 10, ingredientId: 17 }, // Vegetable Oil
  { stepId: 10, ingredientId: 20 }, // Bell Peppers
  { stepId: 10, ingredientId: 24 }, // Onion
  { stepId: 10, ingredientId: 21 }, // Garlic Cloves
  // Recipe 3, Step 4
  { stepId: 11, ingredientId: 22 }, // Soy Sauce
  { stepId: 11, ingredientId: 23 }, // Chili Sauce
];

// Mock data for optional tables (Favorites, Comments)
export const mockFavorites: InferInsertModel<typeof favorites>[] = [
  {
    id: 1,
    userId: 1,
    recipeId: 2,
    createdAt: toUnixTimestamp(new Date("2023-05-01T09:00:00Z")),
  },
  {
    id: 2,
    userId: 2,
    recipeId: 1,
    createdAt: toUnixTimestamp(new Date("2023-05-05T10:15:00Z")),
  },
];

export const mockComments: InferInsertModel<typeof comments>[] = [
  {
    id: 1,
    recipeId: 1,
    userId: 2,
    content: "Loved this! So fresh and easy.",
    createdAt: toUnixTimestamp(new Date("2023-05-10T12:00:00Z")),
  },
  {
    id: 2,
    recipeId: 2,
    userId: 1,
    content: "My family devoured it! Classic for a reason.",
    createdAt: toUnixTimestamp(new Date("2023-05-12T14:30:00Z")),
  },
];
