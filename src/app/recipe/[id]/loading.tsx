import { Skeleton } from "~/components/ui/skeleton"

export default function RecipeLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="mb-6 h-96 w-full rounded-lg" />
          <Skeleton className="mb-6 h-24 w-full rounded-lg" />
          <Skeleton className="mb-8 h-32 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
