import { Skeleton } from "~/components/ui/skeleton"
import { SkeletonRecipeCard } from "~/app/_components/skeleton-recipe-card"

export default function TagLoading() {
  return (
    <div className="container mx-auto p-4">
      <Skeleton className="mb-6 h-9 w-48 rounded" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonRecipeCard key={i} />
        ))}
      </div>
    </div>
  )
}
