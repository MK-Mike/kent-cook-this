import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, Utensils } from "lucide-react"

import { api } from "~/trpc/server"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Separator } from "~/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { ScaledIngredientDisplay } from "~/components/scaled-ingredient-display"

interface RecipePageProps {
  params: Promise<{ id: string }>
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params
  const recipe = await api.recipes.getById({ id: Number(id) })

  if (!recipe) {
    notFound()
  }

  const totalTimeMins = (recipe.prepTimeMins ?? 0) + (recipe.cookTimeMins ?? 0)
  const tags = recipe.recipeTags?.map((rt) => rt.tag.name) ?? []

  const scaledRecipe = {
    id: recipe.id,
    title: recipe.title,
    servings: recipe.servings ?? 4,
    ingredients: (recipe.ingredients ?? []).map((ri) => ({
      name: ri.ingredient.name,
      quantity: ri.quantity ?? 0,
      unitAbbreviation: ri.unit?.abbreviation ?? null,
      unitName: ri.unit?.name ?? null,
    })),
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={recipe.imageUrl ?? "/placeholder.svg"}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h1 className="mb-2 text-4xl font-bold text-white">{recipe.title}</h1>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-white/80 text-foreground backdrop-blur-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6 flex items-center justify-between rounded-lg bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Utensils className="h-5 w-5" />
                <span>{recipe.servings ?? 0} servings</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-5 w-5" />
                <span>{totalTimeMins} min</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="h-9 w-9 border-2 border-primary">
                <AvatarImage
                  src={recipe.author.avatarUrl ?? "/placeholder.svg"}
                  alt={recipe.author.name ?? "Author"}
                />
                <AvatarFallback>{(recipe.author.name ?? "U").charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-base font-medium text-foreground">{recipe.author.name}</span>
            </div>
          </div>

          {recipe.description && (
            <div className="mb-8 rounded-lg bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">Description</h2>
              <p className="text-muted-foreground">{recipe.description}</p>
            </div>
          )}

          {recipe.steps && recipe.steps.length > 0 && (
            <div className="rounded-lg bg-card p-6 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold">Preparation</h2>
              <ol className="space-y-6">
                {(recipe.steps ?? [])
                  .slice()
                  .sort((a, b) => a.position - b.position)
                  .map((step, index) => (
                    <li key={step.id} className="flex items-start gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        {step.title && <h3 className="mb-1 font-semibold">{step.title}</h3>}
                        <p className="text-muted-foreground">{step.description}</p>
                        {step.imageUrl && (
                          <div className="relative mt-4 h-48 w-full overflow-hidden rounded-md">
                            <Image
                              src={step.imageUrl}
                              alt={`Step ${index + 1}`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
              </ol>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 rounded-lg bg-card p-6 shadow-sm">
            <ScaledIngredientDisplay recipe={scaledRecipe} />
            <Separator className="my-6" />
            <Button asChild className="w-full">
              <Link href={`/recipe/${recipe.id}/cook`}>Start Cooking</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
