import { Skeleton } from "~/components/ui/skeleton"
import { SkeletonRecipeCard } from "~/app/_components/skeleton-recipe-card"

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-6xl">
        <Skeleton className="mb-2 h-9 w-48 rounded" />
        <Skeleton className="mb-8 h-5 w-72 rounded" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonRecipeCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
