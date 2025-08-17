import type { InferInsertModel } from "drizzle-orm"
import type { ingredientDensities, recipeIngredients, steps, stepIngredients, recipeTags } from "./schema"
import type { Recipe, User, Category, Tag, Unit, Ingredient, Author } from "./types"

// --- MOCK DATA ---

// 1. Users Table
export const mockUsers: User[] = [
  {
    id: 1,
    name: "Chef Alex",
    email: "alex@example.com",
    passwordHash: "hashedpassword1",
    avatarUrl: "/avatars/alex.jpg",
    createdAt: new Date("2023-01-15T10:00:00Z"),
  },
  {
    id: 2,
    name: "Gourmet Bella",
    email: "bella@example.com",
    passwordHash: "hashedpassword2",
    avatarUrl: "/avatars/bella.jpg",
    createdAt: new Date("2023-02-20T11:30:00Z"),
  },
  {
    id: 3,
    name: "Foodie Charlie",
    email: "charlie@example.com",
    passwordHash: "hashedpassword3",
    avatarUrl: "/avatars/charlie.jpg",
    createdAt: new Date("2023-03-01T09:15:00Z"),
  },
]

export const mockAuthors: Author[] = [
  { id: "author-1", name: "Alex Johnson", avatar: "/avatars/alex.jpg" },
  { id: "author-2", name: "Bella Smith", avatar: "/avatars/bella.jpg" },
  { id: "author-3", name: "Charlie Green", avatar: "/avatars/charlie.jpg" },
]

// 2. Hierarchical Categories Table
export const mockCategories: Category[] = [
  // Main Categories
  {
    id: 1,
    name: "Starters & Sides",
    slug: "starters-sides",
    description: "Appetizers, salads, and side dishes",
    parentId: null,
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Main Dishes",
    slug: "main-dishes",
    description: "Hearty main course recipes",
    parentId: null,
    sortOrder: 2,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Baking & Sweets",
    slug: "baking-sweets",
    description: "Desserts, cakes, and baked goods",
    parentId: null,
    sortOrder: 3,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Breakfast & Brunch",
    slug: "breakfast-brunch",
    description: "Morning meals and brunch favorites",
    parentId: null,
    sortOrder: 4,
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Drinks",
    slug: "drinks",
    description: "Beverages hot and cold",
    parentId: null,
    sortOrder: 5,
    createdAt: new Date(),
  },
  {
    id: 6,
    name: "Sauces, Condiments & Basics",
    slug: "sauces-condiments-basics",
    description: "Essential sauces and condiments",
    parentId: null,
    sortOrder: 6,
    createdAt: new Date(),
  },

  // Starters & Sides Subcategories
  { id: 11, name: "Appetizers", slug: "appetizers", parentId: 1, sortOrder: 1, createdAt: new Date() },
  {
    id: 12,
    name: "Dips & Spreads",
    slug: "dips-spreads",
    parentId: 1,
    sortOrder: 2,
    createdAt: new Date(),
  },
  { id: 13, name: "Salads", slug: "salads", parentId: 1, sortOrder: 3, createdAt: new Date() },
  { id: 14, name: "Soups", slug: "soups", parentId: 1, sortOrder: 4, createdAt: new Date() },
  {
    id: 15,
    name: "Side Dishes",
    slug: "side-dishes",
    parentId: 1,
    sortOrder: 5,
    createdAt: new Date(),
  },

  // Main Dishes Subcategories
  { id: 21, name: "Meat", slug: "meat", parentId: 2, sortOrder: 1, createdAt: new Date() },
  { id: 22, name: "Poultry", slug: "poultry", parentId: 2, sortOrder: 2, createdAt: new Date() },
  { id: 23, name: "Seafood", slug: "seafood", parentId: 2, sortOrder: 3, createdAt: new Date() },
  { id: 24, name: "Vegetarian", slug: "vegetarian", parentId: 2, sortOrder: 4, createdAt: new Date() },
  { id: 25, name: "Vegan", slug: "vegan", parentId: 2, sortOrder: 5, createdAt: new Date() },
  {
    id: 26,
    name: "Pasta & Noodles",
    slug: "pasta-noodles",
    parentId: 2,
    sortOrder: 6,
    createdAt: new Date(),
  },
  {
    id: 27,
    name: "Casseroles & One-Pot Meals",
    slug: "casseroles-one-pot",
    parentId: 2,
    sortOrder: 7,
    createdAt: new Date(),
  },

  // Baking & Sweets Subcategories
  {
    id: 31,
    name: "Cakes & Cupcakes",
    slug: "cakes-cupcakes",
    parentId: 3,
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 32,
    name: "Cookies & Bars",
    slug: "cookies-bars",
    parentId: 3,
    sortOrder: 2,
    createdAt: new Date(),
  },
  {
    id: 33,
    name: "Breads & Rolls",
    slug: "breads-rolls",
    parentId: 3,
    sortOrder: 3,
    createdAt: new Date(),
  },
  {
    id: 34,
    name: "Pies & Tarts",
    slug: "pies-tarts",
    parentId: 3,
    sortOrder: 4,
    createdAt: new Date(),
  },
  {
    id: 35,
    name: "Muffins & Scones",
    slug: "muffins-scones",
    parentId: 3,
    sortOrder: 5,
    createdAt: new Date(),
  },
  {
    id: 36,
    name: "Puddings & Custards",
    slug: "puddings-custards",
    parentId: 3,
    sortOrder: 6,
    createdAt: new Date(),
  },

  // Breakfast & Brunch Subcategories
  {
    id: 41,
    name: "Eggs & Omelets",
    slug: "eggs-omelets",
    parentId: 4,
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 42,
    name: "Pancakes & Waffles",
    slug: "pancakes-waffles",
    parentId: 4,
    sortOrder: 2,
    createdAt: new Date(),
  },
  {
    id: 43,
    name: "Smoothies & Bowls",
    slug: "smoothies-bowls",
    parentId: 4,
    sortOrder: 3,
    createdAt: new Date(),
  },
  { id: 44, name: "Pastries", slug: "pastries", parentId: 4, sortOrder: 4, createdAt: new Date() },

  // Drinks Subcategories
  {
    id: 51,
    name: "Hot Beverages",
    slug: "hot-beverages",
    parentId: 5,
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 52,
    name: "Cold Beverages",
    slug: "cold-beverages",
    parentId: 5,
    sortOrder: 2,
    createdAt: new Date(),
  },
  {
    id: 53,
    name: "Cocktails & Mocktails",
    slug: "cocktails-mocktails",
    parentId: 5,
    sortOrder: 3,
    createdAt: new Date(),
  },
  {
    id: 54,
    name: "Smoothies & Shakes",
    slug: "smoothies-shakes",
    parentId: 5,
    sortOrder: 4,
    createdAt: new Date(),
  },

  // Sauces & Basics Subcategories
  {
    id: 61,
    name: "Sauces & Gravies",
    slug: "sauces-gravies",
    parentId: 6,
    sortOrder: 1,
    createdAt: new Date(),
  },
  {
    id: 62,
    name: "Dressings & Marinades",
    slug: "dressings-marinades",
    parentId: 6,
    sortOrder: 2,
    createdAt: new Date(),
  },
  {
    id: 63,
    name: "Jams & Preserves",
    slug: "jams-preserves",
    parentId: 6,
    sortOrder: 3,
    createdAt: new Date(),
  },
  {
    id: 64,
    name: "Spice Mixes & Rubs",
    slug: "spice-mixes-rubs",
    parentId: 6,
    sortOrder: 4,
    createdAt: new Date(),
  },
]

// 3. Tags Table
export const mockTags: Tag[] = [
  // Dietary Preferences
  {
    id: 1,
    name: "Vegan",
    slug: "vegan",
    type: "dietary_preferences",
    color: "#22c55e",
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Vegetarian",
    slug: "vegetarian",
    type: "dietary_preferences",
    color: "#84cc16",
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Gluten-Free",
    slug: "gluten-free",
    type: "dietary_preferences",
    color: "#f59e0b",
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Dairy-Free",
    slug: "dairy-free",
    type: "dietary_preferences",
    color: "#06b6d4",
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Keto",
    slug: "keto",
    type: "dietary_preferences",
    color: "#8b5cf6",
    createdAt: new Date(),
  },
  {
    id: 6,
    name: "Paleo",
    slug: "paleo",
    type: "dietary_preferences",
    color: "#f97316",
    createdAt: new Date(),
  },
  {
    id: 7,
    name: "Low-Carb",
    slug: "low-carb",
    type: "dietary_preferences",
    color: "#ef4444",
    createdAt: new Date(),
  },
  {
    id: 8,
    name: "Nut-Free",
    slug: "nut-free",
    type: "dietary_preferences",
    color: "#64748b",
    createdAt: new Date(),
  },

  // Cuisines
  { id: 11, name: "Italian", slug: "italian", type: "cuisines", color: "#dc2626", createdAt: new Date() },
  { id: 12, name: "Mexican", slug: "mexican", type: "cuisines", color: "#ea580c", createdAt: new Date() },
  { id: 13, name: "Indian", slug: "indian", type: "cuisines", color: "#d47706", createdAt: new Date() },
  { id: 14, name: "Asian", slug: "asian", type: "cuisines", color: "#ca8a04", createdAt: new Date() },
  {
    id: 15,
    name: "Mediterranean",
    slug: "mediterranean",
    type: "cuisines",
    color: "#16a34a",
    createdAt: new Date(),
  },
  {
    id: 16,
    name: "American",
    slug: "american",
    type: "cuisines",
    color: "#2563eb",
    createdAt: new Date(),
  },
  { id: 17, name: "French", slug: "french", type: "cuisines", color: "#7c3aed", createdAt: new Date() },
  { id: 18, name: "Thai", slug: "thai", type: "cuisines", color: "#c2410c", createdAt: new Date() },

  // Preparation Style
  {
    id: 21,
    name: "Quick (under 30 minutes)",
    slug: "quick",
    type: "preparation_style",
    color: "#10b981",
    createdAt: new Date(),
  },
  {
    id: 22,
    name: "Easy",
    slug: "easy",
    type: "preparation_style",
    color: "#059669",
    createdAt: new Date(),
  },
  {
    id: 23,
    name: "One-Pot",
    slug: "one-pot",
    type: "preparation_style",
    color: "#0d9488",
    createdAt: new Date(),
  },
  {
    id: 24,
    name: "Slow Cooker",
    slug: "slow-cooker",
    type: "preparation_style",
    color: "#0891b2",
    createdAt: new Date(),
  },
  {
    id: 25,
    name: "No-Cook",
    slug: "no-cook",
    type: "preparation_style",
    color: "#0284c7",
    createdAt: new Date(),
  },
  {
    id: 26,
    name: "Grill-Friendly",
    slug: "grill-friendly",
    type: "preparation_style",
    color: "#2563eb",
    createdAt: new Date(),
  },
  {
    id: 27,
    name: "Make-Ahead",
    slug: "make-ahead",
    type: "preparation_style",
    color: "#4f46e5",
    createdAt: new Date(),
  },

  // Occasions and Seasons
  {
    id: 31,
    name: "Holiday",
    slug: "holiday",
    type: "occasions_and_seasons",
    color: "#dc2626",
    createdAt: new Date(),
  },
  {
    id: 32,
    name: "Party",
    slug: "party",
    type: "occasions_and_seasons",
    color: "#e11d48",
    createdAt: new Date(),
  },
  {
    id: 33,
    name: "Weeknight",
    slug: "weeknight",
    type: "occasions_and_seasons",
    color: "#be185d",
    createdAt: new Date(),
  },
  {
    id: 34,
    name: "Summer",
    slug: "summer",
    type: "occasions_and_seasons",
    color: "#f59e0b",
    createdAt: new Date(),
  },
  {
    id: 35,
    name: "Winter",
    slug: "winter",
    type: "occasions_and_seasons",
    color: "#3b82f6",
    createdAt: new Date(),
  },
  {
    id: 36,
    name: "Kid-Friendly",
    slug: "kid-friendly",
    type: "occasions_and_seasons",
    color: "#10b981",
    createdAt: new Date(),
  },

  // Key Ingredients
  {
    id: 41,
    name: "Chicken",
    slug: "chicken",
    type: "key_ingredients",
    color: "#f97316",
    createdAt: new Date(),
  },
  {
    id: 42,
    name: "Beef",
    slug: "beef",
    type: "key_ingredients",
    color: "#dc2626",
    createdAt: new Date(),
  },
  {
    id: 43,
    name: "Seafood",
    slug: "seafood",
    type: "key_ingredients",
    color: "#0891b2",
    createdAt: new Date(),
  },
  {
    id: 44,
    name: "Pasta",
    slug: "pasta",
    type: "key_ingredients",
    color: "#ca8a04",
    createdAt: new Date(),
  },
  {
    id: 45,
    name: "Chocolate",
    slug: "chocolate",
    type: "key_ingredients",
    color: "#92400e",
    createdAt: new Date(),
  },
  {
    id: 46,
    name: "Fruits",
    slug: "fruits",
    type: "key_ingredients",
    color: "#dc2626",
    createdAt: new Date(),
  },
]

// 4. Units Table
export const mockUnits: Unit[] = [
  {
    id: 1,
    name: "Gram",
    abbreviation: "g",
    type: "mass",
    factorToBase: 1,
    isMetric: true,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: "Kilogram",
    abbreviation: "kg",
    type: "mass",
    factorToBase: 1000,
    isMetric: true,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: "Milliliter",
    abbreviation: "ml",
    type: "volume",
    factorToBase: 1,
    isMetric: true,
    createdAt: new Date(),
  },
  {
    id: 4,
    name: "Liter",
    abbreviation: "l",
    type: "volume",
    factorToBase: 1000,
    isMetric: true,
    createdAt: new Date(),
  },
  {
    id: 5,
    name: "Teaspoon",
    abbreviation: "tsp",
    type: "volume",
    factorToBase: 4.92892,
    isMetric: false,
    createdAt: new Date(),
  },
  {
    id: 6,
    name: "Tablespoon",
    abbreviation: "tbsp",
    type: "volume",
    factorToBase: 14.7868,
    isMetric: false,
    createdAt: new Date(),
  },
  {
    id: 7,
    name: "Cup",
    abbreviation: "cup",
    type: "volume",
    factorToBase: 236.588,
    isMetric: false,
    createdAt: new Date(),
  },
  {
    id: 8,
    name: "Ounce",
    abbreviation: "oz",
    type: "mass",
    factorToBase: 28.3495,
    isMetric: false,
    createdAt: new Date(),
  },
  {
    id: 9,
    name: "Pound",
    abbreviation: "lb",
    type: "mass",
    factorToBase: 453.592,
    isMetric: false,
    subUnitId: 8,
    subUnitScale: 16,
    createdAt: new Date(),
  },
  {
    id: 10,
    name: "Piece",
    abbreviation: "pc",
    type: "count",
    factorToBase: 1,
    isMetric: false,
    createdAt: new Date(),
  },
  {
    id: 11,
    name: "Whole",
    abbreviation: "",
    type: "count",
    factorToBase: 1,
    isMetric: false,
    createdAt: new Date(),
  },
  {
    id: 12,
    name: "Pinch",
    abbreviation: "pinch",
    type: "volume",
    factorToBase: 0.308, // Approx. 1/16 tsp
    isMetric: false,
    createdAt: new Date(),
  },
]

// 5. Ingredients Table (with new additions for the pudding recipe)
export const mockIngredients: Ingredient[] = [
  { id: 1, name: "Quinoa", createdAt: new Date() },
  { id: 2, name: "Vegetable Broth", createdAt: new Date() },
  { id: 3, name: "Cucumber", createdAt: new Date() },
  { id: 4, name: "Cherry Tomatoes", createdAt: new Date() },
  { id: 5, name: "Red Onion", createdAt: new Date() },
  { id: 6, name: "Kalamata Olives", createdAt: new Date() },
  { id: 7, name: "Feta Cheese", createdAt: new Date() },
  { id: 8, name: "Olive Oil", createdAt: new Date() },
  { id: 9, name: "Lemon", createdAt: new Date() },
  { id: 10, name: "Fresh Parsley", createdAt: new Date() },
  { id: 11, name: "Fresh Mint", createdAt: new Date() },
  { id: 12, name: "All-Purpose Flour", createdAt: new Date() },
  { id: 13, name: "Granulated Sugar", createdAt: new Date() },
  { id: 14, name: "Cocoa Powder", createdAt: new Date() },
  { id: 15, name: "Baking Soda", createdAt: new Date() },
  { id: 16, name: "Large Eggs", createdAt: new Date() },
  { id: 17, name: "Buttermilk", createdAt: new Date() },
  { id: 18, name: "Vanilla Extract", createdAt: new Date() },
  { id: 19, name: "Beef Sirloin", createdAt: new Date() },
  { id: 20, name: "Bell Peppers", createdAt: new Date() },
  { id: 21, name: "Garlic Cloves", createdAt: new Date() },
  { id: 22, name: "Soy Sauce", createdAt: new Date() },
  { id: 23, name: "Chili Sauce", createdAt: new Date() },
  { id: 24, name: "Salt", createdAt: new Date() },
  { id: 25, name: "Black Pepper", createdAt: new Date() },
  { id: 26, name: "Butter", createdAt: new Date() },
  { id: 27, name: "Heavy Cream", createdAt: new Date() },
  { id: 28, name: "Chocolate Chips", createdAt: new Date() },
  { id: 29, name: "Spaghetti", createdAt: new Date() },
  { id: 30, name: "Ground Beef", createdAt: new Date() },
  { id: 31, name: "Canned Tomatoes", createdAt: new Date() },
  { id: 32, name: "Onion", createdAt: new Date() },
  { id: 33, name: "Vegetable Oil", createdAt: new Date() },
  // --- New Ingredients ---
  { id: 34, name: "Baking Powder", createdAt: new Date() },
  { id: 35, name: "Soft Light Brown Sugar", createdAt: new Date() },
  { id: 36, name: "Milk", createdAt: new Date() },
  { id: 37, name: "Water", createdAt: new Date() },
  { id: 38, name: "Chickpeas", createdAt: new Date() },
  { id: 39, name: "Flank Steak", createdAt: new Date() },
  { id: 40, name: "Cornstarch", createdAt: new Date() },
  { id: 41, name: "Sesame Oil", createdAt: new Date() },
  { id: 42, name: "Broccoli Florets", createdAt: new Date() },
  { id: 43, name: "Carrots", createdAt: new Date() },
  { id: 44, name: "Sweet Potato", createdAt: new Date() },
  { id: 45, name: "Peanut Butter", createdAt: new Date() },
  { id: 46, name: "Walnuts", createdAt: new Date() },
  { id: 47, name: "Plain Flour", createdAt: new Date() },
  { id: 48, name: "Unsweetened Cocoa Powder", createdAt: new Date() },
  { id: 49, name: "Creamy Peanut Butter", createdAt: new Date() },
  { id: 50, name: "Maple Syrup", createdAt: new Date() },
  { id: 51, name: "Fresh Ginger", createdAt: new Date() },
  { id: 52, name: "Red Pepper Flakes", createdAt: new Date() },
  { id: 53, name: "Avocado", createdAt: new Date() },
  { id: 54, name: "Sesame Seeds", createdAt: new Date() },
  { id: 55, name: "Linguine Pasta", createdAt: new Date() },
]

// 6. Ingredient Densities Table
export const mockIngredientDensities: InferInsertModel<typeof ingredientDensities>[] = [
  { ingredientId: 1, densityGPerMl: 0.85 },
  { ingredientId: 2, densityGPerMl: 1.0 },
  { ingredientId: 8, densityGPerMl: 0.918 },
  { ingredientId: 12, densityGPerMl: 0.593 },
  { ingredientId: 13, densityGPerMl: 0.847 },
  { ingredientId: 14, densityGPerMl: 0.56 },
  { ingredientId: 17, densityGPerMl: 1.03 },
  { ingredientId: 33, densityGPerMl: 0.92 },
  { ingredientId: 26, densityGPerMl: 0.911 },
  { ingredientId: 27, densityGPerMl: 0.994 },
  // --- New Densities ---
  { ingredientId: 35, densityGPerMl: 0.75 }, // Brown sugar is less dense than granulated
  { ingredientId: 36, densityGPerMl: 1.03 }, // Milk
  { ingredientId: 37, densityGPerMl: 1.0 }, // Water
  { ingredientId: 38, densityGPerMl: 190 }, // Chickpeas
  { ingredientId: 39, densityGPerMl: 1.4 }, // Flank Steak
  { ingredientId: 40, densityGPerMl: 0.7 }, // Cornstarch
  { ingredientId: 41, densityGPerMl: 0.93 }, // Sesame Oil
  { ingredientId: 42, densityGPerMl: 0.85 }, // Broccoli Florets
  { ingredientId: 43, densityGPerMl: 0.8 }, // Carrots
  { ingredientId: 44, densityGPerMl: 0.85 }, // Sweet Potato
  { ingredientId: 45, densityGPerMl: 0.9 }, // Peanut Butter
  { ingredientId: 46, densityGPerMl: 0.65 }, // Walnuts
  { ingredientId: 47, densityGPerMl: 1.0 }, // Plain Flour
  { ingredientId: 48, densityGPerMl: 0.56 }, // Unsweetened Cocoa Powder
  { ingredientId: 49, densityGPerMl: 0.9 }, // Creamy Peanut Butter
  { ingredientId: 50, densityGPerMl: 1.2 }, // Maple Syrup
  { ingredientId: 51, densityGPerMl: 0.9 }, // Fresh Ginger
  { ingredientId: 52, densityGPerMl: 0.3 }, // Red Pepper Flakes
  { ingredientId: 53, densityGPerMl: 0.9 }, // Avocado
  { ingredientId: 54, densityGPerMl: 0.9 }, // Sesame Seeds
  { ingredientId: 55, densityGPerMl: 0.92 }, // Linguine Pasta
]

// 7. Recipes Table
export const mockRecipes: Recipe[] = [
  {
    id: "1",
    name: "Mediterranean Quinoa Bowl",
    description:
      "A vibrant and healthy quinoa bowl packed with fresh Mediterranean flavors. Perfect for a light lunch or dinner.",
    image: "/images/mediterranean-quinoa-bowl.jpg",
    servings: 2,
    time: "25 minutes",
    author: mockAuthors[0],
    rating: 4.5,
    tags: ["healthy", "vegetarian", "quick"],
    ingredients: [
      { quantity: 1, unit: "cup", name: "quinoa", notes: "uncooked" },
      { quantity: 2, unit: "cup", name: "water" },
      { quantity: 0.5, unit: "cup", name: "cucumber", notes: "diced" },
      { quantity: 0.5, unit: "cup", name: "cherry tomatoes", notes: "halved" },
      { quantity: 0.25, unit: "cup", name: "red onion", notes: "thinly sliced" },
      { quantity: 0.25, unit: "cup", name: "Kalamata olives", notes: "pitted and halved" },
      { quantity: 0.5, unit: "cup", name: "feta cheese", notes: "crumbled" },
      { quantity: 0.25, unit: "cup", name: "fresh parsley", notes: "chopped" },
      { quantity: 2, unit: "tbsp", name: "olive oil" },
      { quantity: 1, unit: "tbsp", name: "lemon juice" },
      { quantity: 0.5, unit: "tsp", name: "dried oregano" },
      { quantity: 0.25, unit: "tsp", name: "salt" },
      { quantity: 0.125, unit: "tsp", name: "black pepper" },
    ],
    steps: [
      {
        description:
          "Rinse quinoa thoroughly under cold water. In a small saucepan, combine quinoa and water. Bring to a boil, then reduce heat to low, cover, and simmer for 15 minutes, or until all water is absorbed. Let stand for 5 minutes, then fluff with a fork.",
        image: "/images/steps/quinoa_prep.jpg",
      },
      {
        description:
          "While quinoa cooks, prepare the dressing: In a small bowl, whisk together olive oil, lemon juice, dried oregano, salt, and pepper.",
        image: "/images/steps/dressing.jpg",
      },
      {
        description:
          "In a large bowl, combine cooked quinoa, diced cucumber, cherry tomatoes, red onion, Kalamata olives, feta cheese, and fresh parsley. Pour the dressing over the salad and toss gently to combine. Serve immediately or chill for later.",
        image: "/images/steps/quinoa_bowl_assemble.jpg",
      },
    ],
  },
  {
    id: "2",
    name: "Decadent Chocolate Cake",
    description:
      "A rich, moist, and intensely chocolatey cake that's surprisingly easy to make. Perfect for any celebration!",
    image: "/images/chocolate-cake.jpg",
    servings: 12,
    time: "1 hour 15 minutes",
    author: mockAuthors[1],
    rating: 5,
    tags: ["dessert", "baking", "chocolate"],
    ingredients: [
      { quantity: 2, unit: "cup", name: "all-purpose flour" },
      { quantity: 0.75, unit: "cup", name: "unsweetened cocoa powder" },
      { quantity: 2, unit: "cup", name: "granulated sugar" },
      { quantity: 1.5, unit: "tsp", name: "baking soda" },
      { quantity: 1.5, unit: "tsp", name: "baking powder" },
      { quantity: 1, unit: "tsp", name: "salt" },
      { quantity: 1, unit: "cup", name: "buttermilk" },
      { quantity: 0.5, unit: "cup", name: "vegetable oil" },
      { quantity: 2, unit: "large", name: "eggs" },
      { quantity: 1, unit: "tsp", name: "vanilla extract" },
      { quantity: 1, unit: "cup", name: "hot water", notes: "or hot coffee" },
    ],
    steps: [
      {
        description: "Preheat oven to 350°F (175°C). Grease and flour two 9-inch round baking pans.",
        image: "/images/steps/cake_preheat.jpg",
      },
      {
        description:
          "In a large bowl, whisk together flour, cocoa powder, sugar, baking soda, baking powder, and salt.",
        image: "/images/steps/cake_dry_mix.jpg",
      },
      {
        description:
          "In a separate bowl, whisk together buttermilk, oil, eggs, and vanilla extract. Pour the wet ingredients into the dry ingredients and mix until just combined.",
        image: "/images/steps/cake_wet_mix.jpg",
      },
      {
        description:
          "Carefully stir in the hot water (or coffee) until the batter is smooth. The batter will be thin. Divide evenly between the prepared pans.",
        image: null,
      },
      {
        description:
          "Bake for 30-35 minutes, or until a wooden skewer inserted into the center comes out clean. Let cool in the pans for 10 minutes before inverting onto a wire rack to cool completely.",
        image: "/images/steps/cake_bake.jpg",
      },
      {
        description: "Frost with your favorite chocolate frosting.",
        image: null,
      },
    ],
  },
  {
    id: "3",
    name: "Creamy Garlic Shrimp Pasta",
    description:
      "A quick and easy weeknight meal featuring succulent shrimp in a rich, creamy garlic sauce tossed with pasta.",
    image: "/images/shrimp-pasta.jpg",
    servings: 4,
    time: "30 minutes",
    author: mockAuthors[2],
    rating: 4.8,
    tags: ["seafood", "pasta", "quick", "dinner"],
    ingredients: [
      { quantity: 8, unit: "oz", name: "linguine or fettuccine" },
      { quantity: 1, unit: "lb", name: "shrimp", notes: "peeled and deveined" },
      { quantity: 2, unit: "tbsp", name: "olive oil" },
      { quantity: 4, unit: "cloves", name: "garlic", notes: "minced" },
      { quantity: 0.5, unit: "cup", name: "chicken broth" },
      { quantity: 0.5, unit: "cup", name: "heavy cream" },
      { quantity: 0.25, unit: "cup", name: "Parmesan cheese", notes: "grated" },
      { quantity: 0.25, unit: "cup", name: "fresh parsley", notes: "chopped" },
      { quantity: 0.5, unit: "tsp", name: "red pepper flakes", notes: "optional" },
      { quantity: 0.5, unit: "tsp", name: "salt" },
      { quantity: 0.25, unit: "tsp", name: "black pepper" },
    ],
    steps: [
      {
        description:
          "Cook pasta according to package directions until al dente. Reserve 1/2 cup of pasta water before draining.",
        image: "/images/steps/pasta_cook.jpg",
      },
      {
        description:
          "While pasta cooks, heat olive oil in a large skillet over medium heat. Add shrimp and cook for 2-3 minutes per side, until pink and opaque. Remove shrimp from skillet and set aside.",
        image: null,
      },
      {
        description:
          "In the same skillet, add minced garlic and red pepper flakes (if using). Cook for 1 minute until fragrant. Stir in chicken broth and heavy cream. Bring to a simmer and cook for 3-5 minutes, until sauce slightly thickens.",
        image: "/images/steps/garlic_butter.jpg",
      },
      {
        description:
          "Stir in grated Parmesan cheese and chopped parsley. Add the cooked shrimp and drained pasta to the skillet. Toss to coat, adding a splash of reserved pasta water if needed to reach desired consistency. Season with salt and pepper to taste.",
        image: "/images/steps/pasta_serve.jpg",
      },
      {
        description: "Serve immediately and enjoy!",
        image: null,
      },
    ],
  },
  {
    id: "4",
    name: "Spicy Beef Stir-Fry",
    description: "A quick and flavorful beef stir-fry with a spicy kick, loaded with fresh vegetables.",
    image: "/images/beef-stir-fry.jpg",
    servings: 4,
    time: "20 minutes",
    author: mockAuthors[0],
    rating: 4.2,
    tags: ["spicy", "asian", "dinner", "quick"],
    ingredients: [
      { quantity: 1, unit: "lb", name: "beef sirloin", notes: "thinly sliced" },
      { quantity: 1, unit: "tbsp", name: "soy sauce" },
      { quantity: 1, unit: "tbsp", name: "cornstarch" },
      { quantity: 2, unit: "tbsp", name: "sesame oil" },
      { quantity: 1, unit: "head", name: "broccoli", notes: "cut into florets" },
      { quantity: 2, unit: "medium", name: "carrots", notes: "julienned" },
      { quantity: 1, unit: "red bell pepper", name: "red bell pepper", notes: "sliced" },
      { quantity: 0.5, unit: "cup", name: "snow peas" },
      { quantity: 3, unit: "cloves", name: "garlic", notes: "minced" },
      { quantity: 1, unit: "tbsp", name: "fresh ginger", notes: "grated" },
      { quantity: 0.25, unit: "cup", name: "chicken broth" },
      { quantity: 1, unit: "tbsp", name: "Sriracha", notes: "or to taste" },
      { quantity: 1, unit: "tsp", name: "honey" },
    ],
    steps: [
      {
        description: "In a bowl, toss sliced beef with soy sauce and cornstarch. Set aside.",
        image: null,
      },
      {
        description:
          "Heat 1 tbsp sesame oil in a large skillet or wok over high heat. Add beef and stir-fry until browned, about 3-4 minutes. Remove beef from skillet and set aside.",
        image: null,
      },
      {
        description:
          "Add remaining 1 tbsp sesame oil to the skillet. Add broccoli and carrots, stir-fry for 3-4 minutes until slightly tender-crisp. Add red bell pepper and snow peas, stir-fry for another 2 minutes.",
        image: null,
      },
      {
        description: "Add minced garlic and grated ginger to the vegetables, stir-fry for 1 minute until fragrant.",
        image: null,
      },
      {
        description:
          "In a small bowl, whisk together chicken broth, Sriracha, and honey. Pour sauce over vegetables and bring to a simmer.",
        image: null,
      },
      {
        description:
          "Return beef to the skillet and toss to coat with the sauce and vegetables. Cook for 1-2 minutes until heated through. Serve immediately with rice or noodles.",
        image: null,
      },
    ],
  },
  {
    id: "5",
    name: "Vegan Buddha Bowl",
    description:
      "A nourishing and colorful vegan Buddha bowl with roasted sweet potatoes, chickpeas, and a creamy tahini dressing.",
    image: "/images/buddha-bowl.jpg",
    servings: 2,
    time: "40 minutes",
    author: mockAuthors[1],
    rating: 4.7,
    tags: ["vegan", "healthy", "lunch", "meal prep"],
    ingredients: [
      { quantity: 1, unit: "medium", name: "sweet potato", notes: "cubed" },
      { quantity: 1, unit: "can", name: "chickpeas", notes: "rinsed and drained" },
      { quantity: 1, unit: "tbsp", name: "olive oil" },
      { quantity: 0.5, unit: "tsp", name: "smoked paprika" },
      { quantity: 0.25, unit: "tsp", name: "cumin" },
      { quantity: 0.25, unit: "tsp", name: "salt" },
      { quantity: 0.125, unit: "tsp", name: "black pepper" },
      { quantity: 4, unit: "cup", name: "mixed greens" },
      { quantity: 0.5, unit: "cup", name: "cucumber", notes: "sliced" },
      { quantity: 0.5, unit: "cup", name: "cherry tomatoes", notes: "halved" },
      { quantity: 0.25, unit: "cup", name: "tahini" },
      { quantity: 2, unit: "tbsp", name: "lemon juice" },
      { quantity: 1, unit: "tbsp", name: "water" },
      { quantity: 1, unit: "clove", name: "garlic", notes: "minced" },
    ],
    steps: [
      {
        description:
          "Preheat oven to 400°F (200°C). On a baking sheet, toss cubed sweet potato and chickpeas with olive oil, smoked paprika, cumin, salt, and pepper. Roast for 25-30 minutes, flipping halfway, until tender and slightly crispy.",
        image: null,
      },
      {
        description:
          "While vegetables roast, prepare the tahini dressing: In a small bowl, whisk together tahini, lemon juice, water, and minced garlic until smooth and creamy. Add more water if needed to reach desired consistency.",
        image: null,
      },
      {
        description:
          "Assemble the bowls: Divide mixed greens between two bowls. Top with roasted sweet potatoes and chickpeas, sliced cucumber, and cherry tomatoes.",
        image: null,
      },
      {
        description: "Drizzle generously with the tahini dressing. Serve immediately.",
        image: null,
      },
    ],
  },
  {
    id: "6",
    name: "Exploding Chocolate Pudding",
    description: "A magical self-saucing chocolate pudding that creates its own rich fudge sauce as it bakes.",
    image: "/images/exploding-chocolate-pudding.jpg",
    servings: 4,
    time: "45 minutes",
    author: mockAuthors[2],
    rating: 4.9,
    tags: ["dessert", "chocolate", "comfort food"],
    ingredients: [
      { quantity: 1, unit: "cup", name: "all-purpose flour" },
      { quantity: 0.5, unit: "cup", name: "granulated sugar" },
      { quantity: 2, unit: "tbsp", name: "unsweetened cocoa powder", notes: "for pudding" },
      { quantity: 2, unit: "tsp", name: "baking powder" },
      { quantity: 0.25, unit: "tsp", name: "salt" },
      { quantity: 0.5, unit: "cup", name: "milk" },
      { quantity: 0.25, unit: "cup", name: "melted butter" },
      { quantity: 1, unit: "tsp", name: "vanilla extract" },
      { quantity: 0.5, unit: "cup", name: "brown sugar", notes: "packed, for sauce" },
      { quantity: 0.25, unit: "cup", name: "unsweetened cocoa powder", notes: "for sauce" },
      { quantity: 1.75, unit: "cup", name: "hot water" },
    ],
    steps: [
      {
        description: "Preheat oven to 350°F (175°C). Lightly grease an 8x8 inch (20x20 cm) baking dish.",
        image: null,
      },
      {
        description:
          "In a medium bowl, sift together flour, granulated sugar, 2 tbsp cocoa powder, baking powder, and salt.",
        image: "/images/steps/pudding_sift.jpg",
      },
      {
        description:
          "In a separate bowl, whisk together milk, melted butter, and vanilla extract. Pour the wet ingredients into the dry ingredients and mix until just combined. Do not overmix.",
        image: "/images/steps/pudding_batter.jpg",
      },
      {
        description: "Pour the batter evenly into the prepared baking dish.",
        image: "/images/steps/pudding_pour.jpg",
      },
      {
        description:
          "In a small bowl, whisk together brown sugar and 1/4 cup cocoa powder. Sprinkle this mixture evenly over the batter in the baking dish.",
        image: "/images/steps/pudding_topping.jpg",
      },
      {
        description: "Carefully pour the hot water over the top of the sugar-cocoa mixture. Do NOT stir.",
        image: null,
      },
      {
        description:
          "Bake for 30-35 minutes, or until the top is set and the sauce is bubbling around the edges. The center will still be soft. Alternatively, you can microwave it for 8-10 minutes on high power until set.",
        image: "/images/steps/pudding_microwave.jpg",
      },
      {
        description:
          "Let cool for a few minutes before serving. The sauce will be at the bottom. Serve warm with ice cream or whipped cream.",
        image: null,
      },
    ],
  },
]

// 8. Recipe Tags (Many-to-Many relationships)
export const mockRecipeTags: InferInsertModel<typeof recipeTags>[] = [
  // Mediterranean Quinoa Bowl
  { recipeId: "1", tagId: 1 }, // Vegan
  { recipeId: "1", tagId: 3 }, // Gluten-Free
  { recipeId: "1", tagId: 15 }, // Mediterranean
  { recipeId: "1", tagId: 21 }, // Quick
  { recipeId: "1", tagId: 22 }, // Easy

  // Grandma's Classic Chocolate Cake
  { recipeId: "2", tagId: 2 }, // Vegetarian
  { recipeId: "2", tagId: 31 }, // Holiday
  { recipeId: "2", tagId: 45 }, // Chocolate

  // Speedy Garlic Butter Shrimp Pasta
  { recipeId: "3", tagId: 21 }, // Quick
  { recipeId: "3", tagId: 22 }, // Easy
  { recipeId: "3", tagId: 33 }, // Weeknight
  { recipeId: "3", tagId: 43 }, // Seafood
  { recipeId: "3", tagId: 44 }, // Pasta

  // Classic Beef Stir Fry
  { recipeId: "4", tagId: 14 }, // Asian
  { recipeId: "4", tagId: 21 }, // Quick
  { recipeId: "4", tagId: 33 }, // Weeknight
  { recipeId: "4", tagId: 42 }, // Beef

  // Vegan Buddha Bowl
  { recipeId: "5", tagId: 1 }, // Vegan
  { recipeId: "5", tagId: 3 }, // Gluten-Free
  { recipeId: "5", tagId: 22 }, // Easy
  { recipeId: "5", tagId: 27 }, // Make-Ahead

  // --- New Recipe Tags ---
  { recipeId: "6", tagId: 2 }, // Vegetarian
  { recipeId: "6", tagId: 8 }, // Nut-Free (original recipe crossed out walnuts)
  { recipeId: "6", tagId: 21 }, // Quick
  { recipeId: "6", tagId: 22 }, // Easy
  { recipeId: "6", tagId: 35 }, // Winter
  { recipeId: "6", tagId: 36 }, // Kid-Friendly
  { recipeId: "6", tagId: 45 }, // Chocolate
]

// 9. Recipe Ingredients Table
export const mockRecipeIngredients: InferInsertModel<typeof recipeIngredients>[] = [
  // Mediterranean Quinoa Bowl (Recipe ID 1)
  { recipeId: "1", ingredientId: 1, quantity: 1, unitId: 7 },
  { recipeId: "1", ingredientId: 37, quantity: 2, unitId: 7 },
  { recipeId: "1", ingredientId: 3, quantity: 1, unitId: 11 },
  { recipeId: "1", ingredientId: 4, quantity: 1, unitId: 7 },
  { recipeId: "1", ingredientId: 5, quantity: 0.5, unitId: 11 },
  { recipeId: "1", ingredientId: 6, quantity: 0.25, unitId: 7 },
  { recipeId: "1", ingredientId: 7, quantity: 0.5, unitId: 7 },
  { recipeId: "1", ingredientId: 8, quantity: 2, unitId: 6 },
  { recipeId: "1", ingredientId: 10, quantity: 0.5, unitId: 7 },
  { recipeId: "1", ingredientId: 11, quantity: 0.5, unitId: 7 },
  { recipeId: "1", ingredientId: 45, quantity: 0.25, unitId: 7 },
  { recipeId: "1", ingredientId: 8, quantity: 1, unitId: 6 },
  { recipeId: "1", ingredientId: 24, quantity: 0.5, unitId: 5 },
  { recipeId: "1", ingredientId: 25, quantity: 0.25, unitId: 5 },

  // Grandma's Classic Chocolate Cake (Recipe ID 2)
  { recipeId: "2", ingredientId: 12, quantity: 2, unitId: 7 },
  { recipeId: "2", ingredientId: 13, quantity: 2, unitId: 7 },
  { recipeId: "2", ingredientId: 48, quantity: 0.75, unitId: 7 },
  { recipeId: "2", ingredientId: 15, quantity: 2, unitId: 5 },
  { recipeId: "2", ingredientId: 34, quantity: 1, unitId: 5 },
  { recipeId: "2", ingredientId: 24, quantity: 1, unitId: 12 },
  { recipeId: "2", ingredientId: 16, quantity: 2, unitId: 7 },
  { recipeId: "2", ingredientId: 33, quantity: 0.5, unitId: 7 },
  { recipeId: "2", ingredientId: 25, quantity: 0.25, unitId: 5 },
  { recipeId: "2", ingredientId: 27, quantity: 1, unitId: 3 },
  { recipeId: "2", ingredientId: 28, quantity: 1, unitId: 7 },

  // Speedy Garlic Butter Shrimp Pasta (Recipe ID 3)
  { recipeId: "3", ingredientId: 55, quantity: 8, unitId: 8 },
  { recipeId: "3", ingredientId: 26, quantity: 4, unitId: 6 },
  { recipeId: "3", ingredientId: 21, quantity: 4, unitId: 10 },
  { recipeId: "3", ingredientId: 8, quantity: 1, unitId: 6 },
  { recipeId: "3", ingredientId: 24, quantity: 1, unitId: 12 },
  { recipeId: "3", ingredientId: 25, quantity: 0.5, unitId: 5 },
  { recipeId: "3", ingredientId: 46, quantity: 50, unitId: 1 },
  { recipeId: "3", ingredientId: 53, quantity: 0.5, unitId: 7 },

  // --- New Recipe Ingredients (Saucy Chocolate Pudding, Recipe ID 6) ---
  { recipeId: "6", ingredientId: 47, quantity: 100, unitId: 1 }, // Plain Flour
  { recipeId: "6", ingredientId: 48, quantity: 75, unitId: 3 }, // Cocoa Powder (for batter)
  { recipeId: "6", ingredientId: 48, quantity: 3, unitId: 6 }, // Cocoa Powder (for topping)
  { recipeId: "6", ingredientId: 34, quantity: 10, unitId: 3 }, // Baking Powder
  { recipeId: "6", ingredientId: 24, quantity: 1, unitId: 12 }, // Salt
  { recipeId: "6", ingredientId: 35, quantity: 225, unitId: 1 }, // Soft Light Brown Sugar
  { recipeId: "6", ingredientId: 36, quantity: 175, unitId: 3 }, // Milk
  { recipeId: "6", ingredientId: 33, quantity: 30, unitId: 3 }, // Vegetable Oil
  { recipeId: "6", ingredientId: 18, quantity: 5, unitId: 3 }, // Vanilla Extract
  { recipeId: "6", ingredientId: 37, quantity: 350, unitId: 3 }, // Boiling Water
  { recipeId: "6", ingredientId: 46, quantity: 50, unitId: 1 }, // Walnuts (optional)
]

// 10. Steps Table
export const mockSteps: InferInsertModel<typeof steps>[] = [
  // Recipe 1: Mediterranean Quinoa Bowl
  {
    id: 1,
    recipeId: "1",
    position: 1,
    title: "Cook Quinoa & Veggies Prep",
    description:
      "Rinse quinoa thoroughly under cold water. In a medium saucepan, combine quinoa and water. Bring to a boil, then reduce heat to low, cover, and simmer for 15 minutes, or until all water is absorbed and quinoa is fluffy.",
    imageUrl: "/images/steps/quinoa_prep.jpg",
  },
  {
    id: 2,
    recipeId: "1",
    position: 2,
    title: "Prepare Dressing",
    description:
      "While quinoa cooks, prepare the dressing: In a small bowl, whisk together tahini, lemon juice, olive oil, minced garlic, salt, and pepper until smooth. Add a tablespoon or two of water if needed to reach desired consistency.",
    imageUrl: "/images/steps/dressing.jpg",
  },
  {
    id: 3,
    recipeId: "1",
    position: 3,
    title: "Assemble Bowl",
    description:
      "Once quinoa is cooked and cooled, combine with diced cucumber, cherry tomatoes, red onion, Kalamata olives, chickpeas, and fresh parsley. Add crumbled feta cheese if using. Drizzle generously with dressing and gently toss to combine. Garnish with fresh parsley and mint before serving.",
    imageUrl: "/images/steps/quinoa_bowl_assemble.jpg",
  },

  // Recipe 2: Grandma's Classic Chocolate Cake
  {
    id: 4,
    recipeId: "2",
    position: 1,
    title: "Preheat Oven & Pans",
    description: "Preheat oven to 350°F (175°C). Grease and flour two 9-inch round baking pans.",
    imageUrl: "/images/steps/cake_preheat.jpg",
  },
  {
    id: 5,
    recipeId: "2",
    position: 2,
    title: "Mix Dry Ingredients",
    description:
      "In a large bowl, whisk together all-purpose flour, granulated sugar, cocoa powder, baking soda, baking powder, and salt.",
    imageUrl: "/images/steps/cake_dry_mix.jpg",
  },
  {
    id: 6,
    recipeId: "2",
    position: 3,
    title: "Combine Wet Ingredients",
    description:
      "Add milk, vegetable oil, eggs, and vanilla extract to the dry ingredients. Beat on medium speed for 2 minutes.",
    imageUrl: "/images/steps/cake_wet_mix.jpg",
  },
  {
    id: 7,
    recipeId: "2",
    position: 4,
    title: "Combine & Bake",
    description:
      "Stir in boiling water (batter will be thin). Pour evenly into prepared pans. Bake for 30-35 minutes, or until a wooden skewer inserted into the center comes out clean.",
    imageUrl: "/images/steps/cake_bake.jpg",
  },
  {
    id: 8,
    recipeId: "2",
    position: 5,
    title: "Cool & Make Ganache",
    description:
      "Let cool in pans for 10 minutes, then invert onto wire racks to cool completely. For ganache: Heat heavy cream in a small saucepan until simmering. Remove from heat and pour over chocolate chips in a bowl. Let sit for 5 minutes, then whisk until smooth. Let cool slightly before spreading over cake.",
  },
  {
    id: 9,
    recipeId: "2",
    position: 6,
    title: "Serve",
    description: "Serve immediately.",
  },

  // Recipe 3: Speedy Garlic Butter Shrimp Pasta
  {
    id: 10,
    recipeId: "3",
    position: 1,
    title: "Cook Pasta",
    description:
      "Cook linguine according to package directions until al dente. Reserve 1 cup of pasta water before draining.",
    imageUrl: "/images/steps/pasta_cook.jpg",
  },
  {
    id: 11,
    recipeId: "3",
    position: 2,
    title: "Sauté Shrimp",
    description:
      "While pasta cooks, heat olive oil in a large skillet over medium heat. Add shrimp and cook for 2-3 minutes per side, until pink and opaque. Remove shrimp from skillet and set aside.",
  },
  {
    id: 12,
    recipeId: "3",
    position: 3,
    title: "Prepare Sauce",
    description:
      "In the same skillet, add minced garlic and red pepper flakes (if using). Sauté for 1 minute until fragrant. Pour in heavy cream and bring to a gentle simmer. Stir in grated Parmesan cheese until melted and sauce thickens slightly. Season with salt and pepper.",
    imageUrl: "/images/steps/garlic_butter.jpg",
  },
  {
    id: 13,
    recipeId: "3",
    position: 4,
    title: "Combine & Serve",
    description:
      "Add cooked linguine and cooked shrimp to the skillet. Toss to coat, adding reserved pasta water a little at a time if the sauce is too thick. Garnish with fresh parsley and serve immediately.",
    imageUrl: "/images/steps/pasta_serve.jpg",
  },

  // --- New Steps (Saucy Chocolate Pudding, Recipe ID 6) ---
  {
    id: 14,
    recipeId: "6",
    position: 1,
    title: "Mix Dry Batter Ingredients",
    description:
      "Sift the flour, 75 ml (5 tbsp) of cocoa powder, baking powder, and salt into a large bowl. Stir in 100 g (4 oz) of the brown sugar. (Note: Sift the sugar if lumpy).",
    imageUrl: "/images/steps/pudding_sift.jpg",
  },
  {
    id: 15,
    recipeId: "6",
    position: 2,
    title: "Create the Batter",
    description: "Make a well in the centre and pour in the milk, oil, and vanilla extract. Beat to a smooth batter.",
    imageUrl: "/images/steps/pudding_batter.jpg",
  },
  {
    id: 16,
    recipeId: "6",
    position: 3,
    title: "Assemble for Cooking",
    description:
      "Pour the mixture into a 20.5 cm (8 inch) round dish. Mix the remaining sugar (~125g / 4 oz) and the remaining cocoa powder (3-4 tbsp) together. (Note: Sift the sugar and cocoa together). Sprinkle this mixture evenly over the batter and pour the 350 ml of boiling water over it. (Note: Pour vigorously, not gently).",
    imageUrl: "/images/steps/pudding_pour.jpg",
  },
  {
    id: 17,
    recipeId: "6",
    position: 4,
    title: "Microwave and Serve",
    description:
      "Cover the bowl with clingfilm. Microwave on HIGH for 12–14 minutes or until the top looks dry and the sauce is just bubbling through. The pudding will separate into a light sponge on top, leaving a rich chocolate sauce underneath. If your microwave does not have a turntable, give the dish a quarter turn four times during cooking. Serve immediately.",
    imageUrl: "/images/steps/pudding_microwave.jpg",
  },
]

// 11. Step Ingredients Table
export const mockStepIngredients: InferInsertModel<typeof stepIngredients>[] = [
  // Recipe 1, Step 1 - Cook Quinoa & Veggies Prep
  { stepId: 1, ingredientId: 1 },
  { stepId: 1, ingredientId: 37 },
  { stepId: 1, ingredientId: 3 },
  { stepId: 1, ingredientId: 4 },
  { stepId: 1, ingredientId: 5 },

  // Recipe 1, Step 2 - Prepare Dressing
  { stepId: 2, ingredientId: 45 },
  { stepId: 2, ingredientId: 9 },
  { stepId: 2, ingredientId: 24 },
  { stepId: 2, ingredientId: 25 },

  // Recipe 1, Step 3 - Assemble Bowl
  { stepId: 3, ingredientId: 6 },
  { stepId: 3, ingredientId: 7 },
  { stepId: 3, ingredientId: 10 },
  { stepId: 3, ingredientId: 11 },

  // Recipe 2, Step 2 - Mix Dry Ingredients
  { stepId: 5, ingredientId: 12 },
  { stepId: 5, ingredientId: 13 },
  { stepId: 5, ingredientId: 48 },
  { stepId: 5, ingredientId: 15 },
  { stepId: 5, ingredientId: 34 },

  // Recipe 2, Step 3 - Combine Wet Ingredients
  { stepId: 6, ingredientId: 16 },
  { stepId: 6, ingredientId: 36 },
  { stepId: 6, ingredientId: 33 },
  { stepId: 6, ingredientId: 18 },

  // Recipe 3, Step 1 - Cook Pasta
  { stepId: 10, ingredientId: 55 },

  // Recipe 3, Step 2 - Sauté Garlic & Butter
  { stepId: 11, ingredientId: 26 },
  { stepId: 11, ingredientId: 8 },
  { stepId: 11, ingredientId: 21 },

  // Recipe 3, Step 3 - Prepare Sauce
  { stepId: 12, ingredientId: 8 },
  { stepId: 12, ingredientId: 46 },
  { stepId: 12, ingredientId: 27 },
  { stepId: 12, ingredientId: 24 },
  { stepId: 12, ingredientId: 25 },

  // Recipe 3, Step 4 - Combine & Serve
  { stepId: 13, ingredientId: 55 },
  { stepId: 13, ingredientId: 46 },
  { stepId: 13, ingredientId: 53 },
  { stepId: 13, ingredientId: 24 },
  { stepId: 13, ingredientId: 25 },

  // --- New Step Ingredients (Saucy Chocolate Pudding, Recipe ID 6) ---
  // Step 14 - Mix Dry Batter Ingredients
  { stepId: 14, ingredientId: 47 }, // Plain Flour
  { stepId: 14, ingredientId: 48 }, // Cocoa Powder (for batter)
  { stepId: 14, ingredientId: 34 }, // Baking Powder
  { stepId: 14, ingredientId: 24 }, // Salt
  { stepId: 14, ingredientId: 35 }, // Soft Light Brown Sugar (part of it)

  // Step 15 - Create the Batter
  { stepId: 15, ingredientId: 36 }, // Milk
  { stepId: 15, ingredientId: 33 }, // Vegetable Oil
  { stepId: 15, ingredientId: 18 }, // Vanilla Extract

  // Step 16 - Assemble for Cooking
  { stepId: 16, ingredientId: 35 }, // Soft Light Brown Sugar (rest of it)
  { stepId: 16, ingredientId: 48 }, // Cocoa Powder (for topping)
  { stepId: 16, ingredientId: 37 }, // Boiling Water

  // Step 17 - Microwave and Serve
  { stepId: 17, ingredientId: 46 }, // Walnuts (optional)
]

// Legacy data for backward compatibility
export const sampleRecipes = mockRecipes
export const dietaryFilters = mockTags.filter((tag) => tag.type === "dietary_preferences").map((tag) => tag.name)
export const cuisineFilters = mockTags.filter((tag) => tag.type === "cuisines").map((tag) => tag.name)
