import { Suspense } from "react"
import { notFound } from "next/navigation"
import { RecipeCard } from "~/app/_components/recipe-card"
import { api } from "~/trpc/server"
import Loading from "./loading"

interface TagPageProps {
  params: Promise<{ slug: string }>
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params

  const tags = await api.tags.getAll()
  const tag = tags.find((t) => t.slug === slug)

  if (!tag) {
    notFound()
  }

  const recipes = await api.recipes.getByTagSlug({ slug })

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold capitalize">Tag: {tag.name}</h1>
      <Suspense fallback={<Loading />}>
        {recipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-muted-foreground">
            No recipes found with this tag.
          </p>
        )}
      </Suspense>
    </div>
  )
}
