"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { recipeFormSchema, type RecipeFormValues } from "@/lib/schema"
import { EnhancedIngredientForm } from "@/components/enhanced-ingredient-form"
import { EnhancedStepsForm } from "@/components/enhanced-steps-form"
import { recipeStore } from "@/lib/recipe-store"
import { generateId } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockAuthors } from "@/lib/mock-data"

export default function NewRecipePage() {
  const router = useRouter()

  const form = useForm<RecipeFormValues>({
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      image: "",
      servings: 4,
      time: "30 minutes",
      authorId: mockAuthors[0].id, // Default to first author
      tags: [],
      ingredients: [{ quantity: 0, unit: "g", name: "", notes: "" }],
      steps: [{ description: "", image: "" }],
    },
  })

  async function onSubmit(values: RecipeFormValues) {
    try {
      const newRecipe = {
        id: generateId(), // Generate a unique ID for the new recipe
        ...values,
        author: mockAuthors.find((author) => author.id === values.authorId) || mockAuthors[0], // Assign full author object
        rating: null, // New recipes start with no rating
      }
      recipeStore.add(newRecipe)
      toast.success("Recipe added successfully!")
      router.push(`/recipe/${newRecipe.id}`)
    } catch (error) {
      console.error("Failed to add recipe:", error)
      toast.error("Failed to add recipe. Please try again.")
    }
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
                name="name"
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
                name="image"
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
                        <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preparation Time</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 45 minutes" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="authorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Author</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an author" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockAuthors.map((author) => (
                            <SelectItem key={author.id} value={author.id}>
                              {author.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., vegan, healthy, quick"
                        value={field.value?.join(", ") || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter(Boolean),
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <EnhancedIngredientForm />
          <EnhancedStepsForm />

          <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Add Recipe"}
          </Button>
        </form>
      </Form>
    </div>
  )
}
