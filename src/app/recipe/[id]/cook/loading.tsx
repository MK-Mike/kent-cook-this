import { Skeleton } from "~/components/ui/skeleton"

export default function CookLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-10 w-28 rounded-md" />
      </header>
      <main className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-3xl space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-[300px] w-full rounded-lg" />
          <div className="flex justify-between">
            <Skeleton className="h-10 w-28 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>
        </div>
      </main>
    </div>
  )
}
