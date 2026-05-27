import { Suspense } from "react"
import { RecipeCard } from "~/app/_components/recipe-card"
import { SearchBar } from "~/app/_components/search-bar"
import { api } from "~/trpc/server"
import Loading from "./loading"

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams
  const query = q ?? ""

  const filteredRecipes = query
    ? await api.recipes.getFiltered({ name: `%${query}%` })
    : await api.recipes.getAll()

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Search Recipes</h1>
        <div className="w-full max-w-md">
          <SearchBar initialQuery={query} />
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-bold">
        {query ? `Results for "${query}"` : "All Recipes"}
      </h2>
      <Suspense fallback={<Loading />}>
        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No recipes found matching your search.</p>
        )}
      </Suspense>
    </div>
  )
}
