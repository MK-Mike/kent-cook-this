import { SkeletonRecipeCard } from "~/app/_components/skeleton-recipe-card"

export default function SearchLoading() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col items-center gap-4">
        <div className="h-12 w-64 animate-pulse rounded bg-muted" />
        <div className="h-10 w-full max-w-md animate-pulse rounded bg-muted" />
      </div>
      <div className="h-8 w-48 animate-pulse rounded bg-muted mb-4" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonRecipeCard key={i} />
        ))}
      </div>
    </div>
  )
}
