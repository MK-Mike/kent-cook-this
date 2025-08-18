import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Utensils } from "lucide-react";

import { api } from "~/trpc/server";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { ScaledIngredientDisplay } from "../_components/scaled-ingredient-display";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface RecipePageProps {
  params: {
    id: number;
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await api.recipes.getById({ id: params.id });

  if (!recipe) {
    notFound();
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="relative mb-6 h-96 w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={recipe.imageUrl ?? "/placeholder.svg"}
              alt={recipe.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute right-4 bottom-4 left-4">
              <h1 className="mb-2 text-4xl font-bold text-white">
                {recipe?.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                {recipe.recipeTags.map((tag) => (
                  <Badge
                    key={tag.tagId}
                    variant="secondary"
                    className="text-foreground bg-white/80 backdrop-blur-sm"
                  >
                    {tag.tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card mb-6 flex items-center justify-between rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="text-muted-foreground flex items-center gap-1">
                <Utensils className="h-5 w-5" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="text-muted-foreground flex items-center gap-1">
                <Clock className="h-5 w-5" />
                <span>{recipe.cookTimeMins}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Avatar className="border-primary h-9 w-9 border-2">
                <AvatarImage
                  src={recipe.author.avatarUrl ?? "/placeholder.svg"}
                  alt={recipe.author.name}
                />
                <AvatarFallback>{recipe.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-foreground text-base font-medium">
                {recipe.author.name}
              </span>
            </div>
          </div>

          <div className="bg-card mb-8 rounded-lg p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Description</h2>
            <p className="text-muted-foreground">{recipe.description}</p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold">Preparation</h2>
            <ol className="space-y-6">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-lg font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-muted-foreground">{step.description}</p>
                    {step.imageUrl && (
                      <div className="relative mt-4 h-48 w-full overflow-hidden rounded-md">
                        <Image
                          src={step.imageUrl || "/placeholder.svg"}
                          alt={`Step ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card sticky top-8 rounded-lg p-6 shadow-sm">
            <ScaledIngredientDisplay recipe={recipe} />
            <Separator className="my-6" />
            <Button asChild className="w-full">
              <Link href={`/recipe/${recipe.id}/cook`}>Start Cooking</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
