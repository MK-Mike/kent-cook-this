import {
  mockUsers,
  mockCategories,
  mockTags,
  mockUnits,
  mockIngredients,
  mockIngredientDensities,
  mockRecipes,
  mockRecipeIngredients,
  mockSteps,
  mockRecipeTags,
} from "./mock-data"

// --- INTERFACES ---

export interface User {
  id: number
  name: string
  email: string
  passwordHash: string
  avatarUrl?: string
  createdAt: Date
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parentId: number | null
  sortOrder: number
  createdAt: Date
}

export interface Tag {
  id: number
  name: string
  slug: string
  type: string // e.g., 'dietary_preferences', 'cuisines'
  color?: string // Hex color for UI
  createdAt: Date
}

export interface Unit {
  id: number
  name: string
  abbreviation?: string
  type: "mass" | "volume" | "count"
  factorToBase: number // Factor to convert to a base unit (e.g., 1000 for kg to g)
  isMetric: boolean
  subUnitId?: number // For units like 'lb' having 'oz' as sub-unit
  subUnitScale?: number // e.g., 16 for 1 lb = 16 oz
  createdAt: Date
}

export interface Ingredient {
  id: number
  name: string
  createdAt: Date
}

export interface IngredientDensity {
  ingredientId: number
  densityGPerMl: number // Density in grams per milliliter
  createdAt: Date
}

export interface RecipeIngredient {
  name: string
  quantity: number
  unit: string
  notes?: string
}

export interface Step {
  title?: string
  description: string
  image?: string | null
}

export interface Author {
  id: string
  name: string
  avatar: string
}

export interface Recipe {
  id: string
  author: Author
  name: string
  description: string
  image: string
  prepTimeMinutes: number
  cookTimeMinutes: number
  servings: number
  category?: Category
  subcategory?: Category
  tags?: string[] // Simplified to string array for UI display
  ingredients: RecipeIngredient[]
  steps: Step[]
  instructions: Step[]
  time: string
  rating: number | null
  createdAt: Date
  updatedAt: Date
}

// --- HELPER FUNCTIONS FOR MOCK DATA ACCESS ---

export function getAllUsers(): User[] {
  return mockUsers
}

export function getAllCategories(): Category[] {
  return mockCategories
}

export function getAllTags(): Tag[] {
  return mockTags
}

export function getTagsByType(type: string): Tag[] {
  return mockTags.filter((tag) => tag.type === type)
}

export function getAllUnits(): Unit[] {
  return mockUnits
}

export function getAllIngredients(): Ingredient[] {
  return mockIngredients
}

export function getIngredientDensity(ingredientName: string): IngredientDensity | undefined {
  const ingredient = mockIngredients.find((ing) => ing.name === ingredientName)
  if (!ingredient) return undefined
  return mockIngredientDensities.find((density) => density.ingredientId === ingredient.id)
}

export function getAllRecipesForUI(): Recipe[] {
  // This function transforms the mock data into the Recipe interface expected by the UI
  // It's a simplified representation for client-side usage without full Drizzle relations
  return mockRecipes.map((recipe) => {
    const author = mockUsers.find((user) => user.id === recipe.author.id) || mockUsers[0] // Fallback
    const category = mockCategories.find((cat) => cat.id === recipe.category?.id)
    const subcategory = mockCategories.find((cat) => cat.id === recipe.subcategory?.id)
    const recipeTagsSlugs = mockRecipeTags.filter((rt) => rt.recipeId === recipe.id).map((rt) => rt.tagId)
    const tags = mockTags.filter((tag) => recipeTagsSlugs.includes(tag.id)).map((tag) => tag.name)

    const ingredients = mockRecipeIngredients
      .filter((ri) => ri.recipeId === recipe.id)
      .map((ri) => {
        const ingredient = mockIngredients.find((ing) => ing.id === ri.ingredientId)
        const unit = mockUnits.find((u) => u.id === ri.unitId)
        return {
          name: ingredient?.name || "Unknown Ingredient",
          quantity: ri.quantity,
          unit: unit?.abbreviation || unit?.name || "unit",
          notes: ri.notes || undefined,
        }
      })

    const instructions = mockSteps
      .filter((s) => s.recipeId === recipe.id)
      .sort((a, b) => a.position - b.position)
      .map((s) => ({
        title: s.title || undefined,
        description: s.description,
        image: s.imageUrl || undefined,
      }))

    return {
      ...recipe,
      author: {
        id: author.id.toString(),
        name: author.name,
        avatar: author.avatarUrl || "/placeholder.svg?height=40&width=40",
      },
      category: category,
      subcategory: subcategory,
      tags: tags,
      ingredients: ingredients,
      instructions: instructions,
      steps: instructions,
      time: `${(recipe.prepTimeMins || 0) + (recipe.cookTimeMins || 0)} min`,
      rating: null,
    }
  })
}

export function getRecipesByCategory(categorySlug: string): Recipe[] {
  const category = mockCategories.find((cat) => cat.slug === categorySlug)
  if (!category) return []

  const recipesInMainCategory = getAllRecipesForUI().filter((recipe) => recipe.category?.slug === categorySlug)
  const recipesInSubcategory = getAllRecipesForUI().filter((recipe) => recipe.subcategory?.slug === categorySlug)

  // Combine and remove duplicates
  const combinedRecipes = [...recipesInMainCategory, ...recipesInSubcategory]
  const uniqueRecipeIds = new Set(combinedRecipes.map((r) => r.id))
  return Array.from(uniqueRecipeIds).map((id) => combinedRecipes.find((r) => r.id === id)!)
}

export function getRecipesByTag(tagSlug: string): Recipe[] {
  return getAllRecipesForUI().filter((recipe) =>
    recipe.tags?.some((tag) => tag.toLowerCase() === tagSlug.toLowerCase()),
  )
}

export function searchRecipes(query: string): Recipe[] {
  const lowerCaseQuery = query.toLowerCase()
  return getAllRecipesForUI().filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(lowerCaseQuery) ||
      recipe.description.toLowerCase().includes(lowerCaseQuery) ||
      recipe.tags?.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)) ||
      recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(lowerCaseQuery)),
  )
}

export enum UnitType {
  Mass = "mass",
  Volume = "volume",
  Count = "count",
}

export interface UnitConversion {
  name: string
  abbreviation: string
  type: UnitType
  isMetric: boolean
  // Conversion factors to a base unit (e.g., grams for mass, ml for volume)
  gPerUnit?: number // grams per unit
  mlPerUnit?: number // milliliters per unit
  unitsPerUnit?: number // for count units, e.g., 12 for dozen
}

export interface IngredientDensityData {
  name: string
  densityGPerMl: number // grams per milliliter
}

const allUnits: UnitConversion[] = [
  // Mass - Metric
  { name: "gram", abbreviation: "g", type: UnitType.Mass, isMetric: true, gPerUnit: 1 },
  { name: "kilogram", abbreviation: "kg", type: UnitType.Mass, isMetric: true, gPerUnit: 1000 },
  // Mass - Imperial
  { name: "ounce", abbreviation: "oz", type: UnitType.Mass, isMetric: false, gPerUnit: 28.3495 },
  { name: "pound", abbreviation: "lb", type: UnitType.Mass, isMetric: false, gPerUnit: 453.592 },
  // Volume - Metric
  { name: "milliliter", abbreviation: "ml", type: UnitType.Volume, isMetric: true, mlPerUnit: 1 },
  { name: "liter", abbreviation: "L", type: UnitType.Volume, isMetric: true, mlPerUnit: 1000 },
  // Volume - Imperial
  { name: "teaspoon", abbreviation: "tsp", type: UnitType.Volume, isMetric: false, mlPerUnit: 4.92892 },
  { name: "tablespoon", abbreviation: "tbsp", type: UnitType.Volume, isMetric: false, mlPerUnit: 14.7868 },
  { name: "fluid ounce", abbreviation: "fl oz", type: UnitType.Volume, isMetric: false, mlPerUnit: 29.5735 },
  { name: "cup", abbreviation: "cup", type: UnitType.Volume, isMetric: false, mlPerUnit: 236.588 },
  { name: "pint", abbreviation: "pt", type: UnitType.Volume, isMetric: false, mlPerUnit: 473.176 },
  { name: "quart", abbreviation: "qt", type: UnitType.Volume, isMetric: false, mlPerUnit: 946.353 },
  { name: "gallon", abbreviation: "gal", type: UnitType.Volume, isMetric: false, mlPerUnit: 3785.41 },
  // Count / Other
  { name: "unit", abbreviation: "unit", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "clove", abbreviation: "cloves", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "medium", abbreviation: "medium", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "large", abbreviation: "large", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "small", abbreviation: "small", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "can", abbreviation: "can", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "head", abbreviation: "head", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "pinch", abbreviation: "pinch", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "dash", abbreviation: "dash", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
]

const ingredientDensities: IngredientDensityData[] = [
  { name: "water", densityGPerMl: 1 },
  { name: "milk", densityGPerMl: 1.03 },
  { name: "flour", densityGPerMl: 0.57 }, // All-purpose flour
  { name: "sugar", densityGPerMl: 0.85 }, // Granulated sugar
  { name: "honey", densityGPerMl: 1.42 },
  { name: "olive oil", densityGPerMl: 0.92 },
  { name: "butter", densityGPerMl: 0.911 },
  { name: "rice", densityGPerMl: 0.85 }, // Uncooked white rice
  { name: "quinoa", densityGPerMl: 0.75 }, // Uncooked quinoa
  { name: "oats", densityGPerMl: 0.4 }, // Rolled oats
  { name: "salt", densityGPerMl: 1.2 }, // Table salt
  { name: "cocoa powder", densityGPerMl: 0.35 },
  { name: "yogurt", densityGPerMl: 1.03 },
  { name: "cream", densityGPerMl: 1.0 }, // Heavy cream
  { name: "chicken broth", densityGPerMl: 1.0 },
  { name: "tahini", densityGPerMl: 0.95 },
]

export function getAllUnitsForConversion(): UnitConversion[] {
  return allUnits
}

export function getUnitForConversion(abbreviationOrName: string): UnitConversion | undefined {
  return allUnits.find((unit) => unit.abbreviation === abbreviationOrName || unit.name === abbreviationOrName)
}

export function getUnitType(abbreviationOrName: string): UnitType | undefined {
  return getUnitForConversion(abbreviationOrName)?.type
}

export function getIngredientDensityData(name: string): IngredientDensityData | undefined {
  // Simple case-insensitive match for demonstration
  return ingredientDensities.find((density) => density.name.toLowerCase().includes(name.toLowerCase()))
}
