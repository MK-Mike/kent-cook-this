import { api, HydrateClient } from "~/trpc/server";
import { SearchBar } from "./_components/search-bar"; // Still a client component
import { RecipeCard } from "./_components/recipe-card"; // Can be a server component (purely display)
// import { getAllRecipesForUI, getAllCategories, getAllTags } from "@/lib/types" // Server-side data fetching
// import type { Category, Tag } from "@/lib/types" // Types are fine
import { RecipeFilters } from "./_components/recipe-filters";

export default async function Home({
  searchParams,
}: {
  searchParams: {
    q?: string;
    categories?: string;
    tags?: string;
  };
}) {
  const allRecipes = await api.recipes.getAll();
  const allCategories = await api.categories.getAll();
  const allTags = await api.tags.getAll();

  // Extract query parameters from the URL
  const searchQuery = searchParams.q ?? "";
  const selectedCategories = searchParams.categories?.split(",") ?? [];
  const selectedTags = searchParams.tags?.split(",") ?? [];

  // Filter recipes directly on the server
  const filteredRecipes = await api.recipes.getFiltered({
    name: searchQuery,
    categories: selectedCategories,
    tags: selectedTags,
  });

  void api.post.getLatest.prefetch();
  void api.recipes.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container mx-auto p-4">
          <div className="mb-6 flex flex-col items-center gap-4">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Family Recipes
            </h1>
            <p className="text-muted-foreground text-xl">
              Delicious meals, passed down through generations.
            </p>
            <div className="w-full max-w-md">
              {/* SearchBar remains a client component if it updates state */}
              {/* For server components, the search query should be handled via URL params */}
              <SearchBar initialQuery={searchQuery} />
            </div>
          </div>

          <h2 className="mb-4 text-2xl font-bold">Latest Recipes</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {allRecipes.slice(0, 4).map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          <div className="mt-16">
            {/* This whole section handles filtering and will be a Client Component */}
            <RecipeFilters
              allCategories={allCategories}
              allTags={allTags}
              initialSelectedCategories={selectedCategories}
              initialSelectedTags={selectedTags}
            />

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </HydrateClient>
  );
}
