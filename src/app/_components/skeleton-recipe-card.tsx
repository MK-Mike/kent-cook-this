import { Card, CardContent } from "~/components/ui/card";

export function SkeletonRecipeCard() {
  return (
    <Card className="overflow-hidden bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <div className="aspect-[4/3] animate-pulse bg-gray-200 dark:bg-gray-700" />
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="h-5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          <div className="flex justify-between">
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
