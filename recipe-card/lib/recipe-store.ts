import type { Recipe, Author } from "./types"
import {
  mockIngredients,
  mockUnits,
  mockRecipeIngredients,
  mockSteps,
  mockUsers,
  mockCategories,
  mockTags,
  mockRecipeTags,
  mockRecipes, // Corrected import
} from "./mock-data"

// This file acts as a mock data store for recipes.
// In a real application, this would interact with a database or API.

// Simulate a database fetch with a delay
const simulateDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let recipes: Recipe[] = [...mockRecipes]

export const recipeStore = {
  getAll: (): Recipe[] => {
    return recipes
  },

  getById: (id: string): Recipe | undefined => {
    return recipes.find((recipe) => recipe.id === id)
  },

  add: (newRecipe: Recipe): Recipe => {
    recipes.push(newRecipe)
    return newRecipe
  },

  update: (updatedRecipe: Recipe): Recipe | undefined => {
    const index = recipes.findIndex((recipe) => recipe.id === updatedRecipe.id)
    if (index > -1) {
      recipes[index] = updatedRecipe
      return updatedRecipe
    }
    return undefined
  },

  delete: (id: string): boolean => {
    const initialLength = recipes.length
    recipes = recipes.filter((recipe) => recipe.id !== id)
    return recipes.length < initialLength
  },

  // For demonstration/testing purposes, to reset the store
  reset: () => {
    recipes = [...mockRecipes]
  },
}

interface GetRecipesOptions {
  query?: string
  categorySlug?: string
  tagSlug?: string
}

export async function getRecipes(options?: GetRecipesOptions): Promise<{ recipes: Recipe[] }> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  let filteredRecipes = recipes

  if (options?.query) {
    const lowerCaseQuery = options.query.toLowerCase()
    filteredRecipes = filteredRecipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(lowerCaseQuery) ||
        recipe.description.toLowerCase().includes(lowerCaseQuery) ||
        recipe.tags?.some((tag) => tag.toLowerCase().includes(lowerCaseQuery)) ||
        recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(lowerCaseQuery)),
    )
  }

  if (options?.categorySlug) {
    filteredRecipes = filteredRecipes.filter(
      (recipe) => recipe.category?.slug === options.categorySlug || recipe.subcategory?.slug === options.categorySlug,
    )
  }

  if (options?.tagSlug) {
    filteredRecipes = filteredRecipes.filter((recipe) =>
      recipe.tags?.some((tag) => tag.toLowerCase() === options.tagSlug?.toLowerCase()),
    )
  }

  return { recipes: filteredRecipes }
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300))
  return recipes.find((recipe) => recipe.id === id) || null
}

export async function createRecipe(recipe: Omit<Recipe, "id" | "createdAt" | "updatedAt" | "author">): Promise<Recipe> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  const newRecipe: Recipe = {
    id: (recipes.length + 1).toString(), // Simple ID generation
    ...recipe,
    author: { id: "0", name: "New User", avatar: "/avatars/alex.jpg" }, // Placeholder author
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  recipes.push(newRecipe) // Add to mock data
  return newRecipe
}

export async function addRecipe(
  newRecipeData: Omit<
    Recipe,
    "id" | "createdAt" | "updatedAt" | "author" | "category" | "subcategory" | "tags" | "ingredients" | "steps"
  > & {
    ingredients: { name: string; quantity: number; unit: string; notes?: string }[]
    steps: { title?: string; description: string; imageUrl?: string }[]
    categorySlug: string
    subcategorySlug?: string
    tagSlugs: string[]
  },
): Promise<Recipe> {
  await simulateDelay(500) // Simulate network delay

  const newRecipeId = recipes.length > 0 ? Math.max(...recipes.map((r) => Number.parseInt(r.id ?? "0"))) + 1 : 1
  const newIngredientIdStart = mockIngredients.length > 0 ? Math.max(...mockIngredients.map((i) => i.id)) + 1 : 1
  const newStepIdStart = mockSteps.length > 0 ? Math.max(...mockSteps.map((s) => s.id ?? 0)) + 1 : 1

  const category = mockCategories.find((c) => c.slug === newRecipeData.categorySlug)
  const subcategory = newRecipeData.subcategorySlug
    ? mockCategories.find((c) => c.slug === newRecipeData.subcategorySlug)
    : undefined

  if (!category) {
    throw new Error(`Category with slug ${newRecipeData.categorySlug} not found.`)
  }

  const recipeToAdd: Recipe = {
    id: newRecipeId.toString(),
    name: newRecipeData.name,
    description: newRecipeData.description,
    image: newRecipeData.image,
    prepTimeMinutes: newRecipeData.prepTimeMinutes ?? 0,
    cookTimeMinutes: newRecipeData.cookTimeMinutes ?? 0,
    servings: newRecipeData.servings,
    createdAt: new Date(),
    updatedAt: new Date(),
    ingredients: [],
    steps: [],
    instructions: [],
    time: newRecipeData.time,
    rating: newRecipeData.rating ?? null,
    author: { id: mockUsers[0]!.id.toString(), name: mockUsers[0]!.name, avatar: mockUsers[0]!.avatarUrl || "/placeholder.svg" },
    category: category,
    subcategory: subcategory || undefined,
    tags: [],
  }

  recipeStore.add(recipeToAdd)

  // Add ingredients
  const addedIngredients: any[] = []
  const addedRecipeIngredients: any[] = []
  newRecipeData.ingredients.forEach((ing, index) => {
    const existingIngredient = mockIngredients.find((mi) => mi.name.toLowerCase() === ing.name.toLowerCase())
    const ingredientId = existingIngredient ? existingIngredient.id : newIngredientIdStart + index

    if (!existingIngredient) {
      const newIngredient: any = { id: ingredientId, name: ing.name, createdAt: new Date() }
      mockIngredients.push(newIngredient)
      addedIngredients.push(newIngredient)
    }

    const unit = mockUnits.find((u) => u.abbreviation === ing.unit)
    if (!unit) {
      console.warn(`Unit abbreviation ${ing.unit} not found for ingredient ${ing.name}. Skipping ingredient.`)
      return
    }

    addedRecipeIngredients.push({
      recipeId: newRecipeId.toString(),
      ingredientId: ingredientId,
      quantity: ing.quantity,
      unitId: unit.id,
      notes: ing.notes,
      createdAt: new Date(),
    })
  })
  mockRecipeIngredients.push(...addedRecipeIngredients)
  recipeToAdd.ingredients = addedRecipeIngredients.map((ri) => {
    const ing = mockIngredients.find((i) => i.id === ri.ingredientId)
    return {
      name: ing?.name ?? "Unknown",
      quantity: ri.quantity,
      unit: mockUnits.find((u) => u.id === ri.unitId)?.abbreviation ?? "unit",
      notes: ri.notes || undefined,
    }
  })

  // Add steps
  const addedSteps: any[] = []
  newRecipeData.steps.forEach((step, index) => {
    const newStep = {
      id: newStepIdStart + index,
      recipeId: newRecipeId.toString(),
      position: index + 1,
      title: step.title || null,
      description: step.description,
      imageUrl: step.imageUrl || null,
      createdAt: new Date(),
    }
    mockSteps.push(newStep)
    addedSteps.push(newStep)
  })
  recipeToAdd.steps = addedSteps

  // Add tags
  const addedRecipeTags: any[] = []
  const recipeTags: any[] = []
  newRecipeData.tagSlugs.forEach((tagSlug) => {
    const tag = mockTags.find((t) => t.slug === tagSlug)
    if (tag) {
      addedRecipeTags.push({ recipeId: newRecipeId.toString(), tagId: tag.id, createdAt: new Date() })
      recipeTags.push(tag)
    } else {
      console.warn(`Tag with slug ${tagSlug} not found. Skipping tag.`)
    }
  })
  mockRecipeTags.push(...addedRecipeTags)
  recipeToAdd.tags = recipeTags.map((t: any) => t.name)

  return recipeToAdd
}
