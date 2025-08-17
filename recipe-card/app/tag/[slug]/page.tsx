import { Suspense } from "react"
import { notFound } from "next/navigation"
import { RecipeCard } from "@/components/recipe-card"
import { mockRecipes } from "@/lib/mock-data"
import Loading from "./loading"

interface TagPageProps {
  params: {
    slug: string
  }
}

export default function TagPage({ params }: TagPageProps) {
  const tag = decodeURIComponent(params.slug)

  const filteredRecipes = mockRecipes.filter((recipe) =>
    recipe.tags?.some((t) => t.toLowerCase() === tag.toLowerCase()),
  )

  if (filteredRecipes.length === 0) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold capitalize">Tag: {tag}</h1>
      <Suspense fallback={<Loading />}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </Suspense>
    </div>
  )
}
