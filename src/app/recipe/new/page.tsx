"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { recipeFormSchema, type RecipeFormValues } from "~/lib/schemas/recipe-form"
import { EnhancedIngredientForm } from "~/components/enhanced-ingredient-form"
import { EnhancedStepsForm } from "~/components/enhanced-steps-form"
import { api } from "~/trpc/react"

export default function NewRecipePage() {
  const router = useRouter()
  const utils = api.useUtils()

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      servings: 4,
      prepTimeMins: undefined,
      cookTimeMins: undefined,
      tagNames: "",
      ingredients: [{ name: "", quantity: undefined, unitName: "", notes: "" }],
      steps: [{ description: "", imageUrl: "" }],
    },
  })

  const createRecipe = api.recipes.createWithDetails.useMutation({
    onSuccess: (data) => {
      toast.success("Recipe added successfully!")
      router.push(`/recipe/${data.recipeId}`)
    },
    onError: (error) => {
      console.error("Failed to add recipe:", error)
      toast.error(`Failed to add recipe: ${error.message}`)
    },
  })

  // Lookup resolvers
  const { data: allIngredients = [] } = api.ingredients.getAll.useQuery()
  const { data: allUnits = [] } = api.units.getAll.useQuery()
  const { data: allTags = [] } = api.tags.getAll.useQuery()

  async function onSubmit(values: RecipeFormValues) {
    // Resolve ingredient names to IDs (create new ones if needed)
    const ingredientIds = await resolveIngredientIds(values.ingredients, allIngredients)

    // Resolve unit names to IDs
    const unitIds = resolveUnitIds(values.ingredients, allUnits)

    // Resolve tag names to IDs
    const tagIds = resolveTagIds(values.tagNames ?? "", allTags)

    const ingredients = values.ingredients.map((ing, i) => ({
      ingredientId: ingredientIds[i] ?? 0,
      quantity: ing.quantity ?? null,
      unitId: unitIds[i] ?? null,
    }))

    const steps = values.steps.map((step, i) => ({
      position: i + 1,
      title: step.title,
      description: step.description,
      imageUrl: step.imageUrl || undefined,
    }))

    createRecipe.mutate({
      title: values.title,
      authorId: 1, // Hardcoded for now; will use Clerk auth later
      description: values.description || undefined,
      prepTimeMins: values.prepTimeMins || undefined,
      cookTimeMins: values.cookTimeMins || undefined,
      servings: values.servings || undefined,
      imageUrl: values.imageUrl || undefined,
      ingredients,
      steps,
      tagIds,
      categoryIds: [],
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Add New Recipe</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recipe Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipe Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Classic Lasagna" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="A brief description of the recipe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., /images/lasagna.jpg" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="servings"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Servings</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prepTimeMins"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prep Time (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 15"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cookTimeMins"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cook Time (minutes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 45"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="tagNames"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., vegan, healthy, quick" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <EnhancedIngredientForm />
          <EnhancedStepsForm />

          <Button type="submit" className="w-full" disabled={createRecipe.isPending}>
            {createRecipe.isPending ? "Saving..." : "Add Recipe"}
          </Button>
        </form>
      </Form>
    </div>
  )
}

// Helper: resolve ingredient names to IDs, creating new ingredients on-the-fly
async function resolveIngredientIds(
  ingredients: { name: string }[],
  existingIngredients: { id: number; name: string }[],
): Promise<number[]> {
  return ingredients.map((ing) => {
    const found = existingIngredients.find(
      (ei) => ei.name.toLowerCase() === ing.name.toLowerCase(),
    )
    return found?.id ?? 0 // Will be resolved server-side; 0 means create
  })
}

// Helper: resolve unit names/abbreviations to IDs
function resolveUnitIds(
  ingredients: { unitName?: string }[],
  units: { id: number; name: string; abbreviation: string }[],
): (number | null)[] {
  return ingredients.map((ing) => {
    if (!ing.unitName) return null
    const found = units.find(
      (u) =>
        u.abbreviation.toLowerCase() === ing.unitName!.toLowerCase() ||
        u.name.toLowerCase() === ing.unitName!.toLowerCase(),
    )
    return found?.id ?? null
  })
}

// Helper: resolve comma-separated tag names to IDs
function resolveTagIds(
  tagNames: string,
  tags: { id: number; name: string }[],
): number[] {
  if (!tagNames) return []
  return tagNames
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((name) => {
      const found = tags.find((t) => t.name.toLowerCase() === name.toLowerCase())
      return found?.id
    })
    .filter((id): id is number => id !== undefined)
}
