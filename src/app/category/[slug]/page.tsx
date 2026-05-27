import { Suspense } from "react"
import { notFound } from "next/navigation"
import { RecipeCard } from "~/app/_components/recipe-card"
import { api } from "~/trpc/server"
import Loading from "./loading"

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params

  const categories = await api.categories.getAll()
  const category = categories.find((cat) => cat.slug === slug)

  if (!category) {
    notFound()
  }

  const recipes = await api.recipes.getByCategorySlug({ slug })

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-muted-foreground">{category.description}</p>
          )}
        </div>

        <Suspense fallback={<Loading />}>
          {recipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p className="py-12 text-center text-muted-foreground">
              No recipes found in this category.
            </p>
          )}
        </Suspense>
      </div>
    </div>
  )
}
