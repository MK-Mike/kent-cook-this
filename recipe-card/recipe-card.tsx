"use client";

import type React from "react";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, MoreVertical, Edit, Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import type { Recipe } from "@/lib/types2";
import { mockRecipes } from "@/lib/mock-data";

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement edit functionality
    console.log("Edit recipe:", recipe.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement delete functionality
    console.log("Delete recipe:", recipe.id);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement duplicate functionality
    console.log("Duplicate recipe:", recipe.id);
  };

  return (
    <Link href={`/recipe/${recipe.id}`} className="block">
      <Card
        className="group relative cursor-pointer overflow-hidden bg-gradient-to-br from-white to-gray-50/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg dark:from-gray-900 dark:to-gray-800/50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 226, 0.1) 0%, transparent 50%)
          `,
        }}
      >
        <div className="absolute top-3 right-3 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 bg-white/80 p-0 backdrop-blur-sm hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800/90"
                onClick={(e) => e.preventDefault()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={recipe.image || "/placeholder.svg"}
            alt={recipe.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="group-hover:text-primary line-clamp-2 text-lg leading-tight font-semibold transition-colors">
                {recipe.name}
              </h3>
              <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                {recipe.description}
              </p>
            </div>

            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={recipe.author.avatar || "/placeholder.svg"}
                    alt={recipe.author.name}
                  />
                  <AvatarFallback className="text-xs">
                    {recipe.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground text-sm">
                  {recipe.author.name}
                </span>
              </div>
            </div>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recipe.tags.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-2 py-0.5 text-xs"
                  >
                    {tag}
                  </Badge>
                ))}
                {recipe.tags.length > 3 && (
                  <Badge variant="outline" className="px-2 py-0.5 text-xs">
                    +{recipe.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {isHovered && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="mx-4 max-w-xs rounded-lg bg-white p-4 dark:bg-gray-800">
                  <h4 className="mb-2 font-semibold">Ingredients:</h4>
                  <ul className="max-h-32 space-y-1 overflow-y-auto text-sm">
                    {recipe.ingredients.slice(0, 6).map((ingredient, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{ingredient.name}</span>
                        <span className="text-muted-foreground">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                    {recipe.ingredients.length > 6 && (
                      <li className="text-muted-foreground">
                        +{recipe.ingredients.length - 6} more...
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export function RecipeCardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-3xl font-bold">Our Recipes</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
