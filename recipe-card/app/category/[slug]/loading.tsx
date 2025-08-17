import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Loading Category...</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-card p-4 shadow-sm">
            <Skeleton className="mb-4 h-48 w-full rounded-md" />
            <Skeleton className="mb-2 h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="mt-4 flex items-center justify-between">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
