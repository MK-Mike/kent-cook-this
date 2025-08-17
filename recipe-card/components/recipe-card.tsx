"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Users, MoreVertical, Edit, Trash2, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement edit functionality
    console.log("Edit recipe:", recipe.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement delete functionality
    console.log("Delete recipe:", recipe.id)
  }

  const handleDuplicate = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // TODO: Implement duplicate functionality
    console.log("Duplicate recipe:", recipe.id)
  }

  return (
    <Link href={`/recipe/${recipe.id}`} className="block">
      <Card
        className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50"
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
                className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white/90 dark:bg-gray-800/80 dark:hover:bg-gray-800/90"
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
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                {recipe.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{recipe.description}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={recipe.author.avatar || "/placeholder.svg"} alt={recipe.author.name} />
                  <AvatarFallback className="text-xs">
                    {recipe.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{recipe.author.name}</span>
              </div>
            </div>

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recipe.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs px-2 py-0.5">
                    {tag}
                  </Badge>
                ))}
                {recipe.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    +{recipe.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {isHovered && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 max-w-xs mx-4">
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <ul className="text-sm space-y-1 max-h-32 overflow-y-auto">
                    {recipe.ingredients.slice(0, 6).map((ingredient, index) => (
                      <li key={index} className="flex justify-between">
                        <span>{ingredient.name}</span>
                        <span className="text-muted-foreground">
                          {ingredient.quantity} {ingredient.unit}
                        </span>
                      </li>
                    ))}
                    {recipe.ingredients.length > 6 && (
                      <li className="text-muted-foreground">+{recipe.ingredients.length - 6} more...</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
