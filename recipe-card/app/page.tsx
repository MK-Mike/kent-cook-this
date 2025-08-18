"use client";

import { useState, useMemo } from "react";
import { SearchBar } from "@/components/search-bar";
import { RecipeCard } from "@/components/recipe-card";
import { getAllRecipesForUI, getAllCategories, getAllTags } from "@/lib/types2";
import type { Category, Tag } from "@/lib/types2";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { mockRecipes } from "@/lib/mock-data";

export default function HomePage() {
  const allRecipes = useMemo(() => getAllRecipesForUI(), []);
  const allCategories = useMemo(() => getAllCategories(), []);
  const allTags = useMemo(() => getAllTags(), []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredRecipes = useMemo(() => {
    let filtered = allRecipes;

    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(lowerCaseQuery) ||
          recipe.tags?.some((tag) =>
            tag.toLowerCase().includes(lowerCaseQuery),
          ) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.name.toLowerCase().includes(lowerCaseQuery),
          ),
      );
    }

    if (selectedCategories.length > 0) {
      // Filter logic for categories would go here
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((recipe) =>
        recipe.tags?.some((tag) => selectedTags.includes(tag)),
      );
    }

    return filtered;
  }, [allRecipes, searchQuery, selectedCategories, selectedTags]);

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    setSelectedCategories((prev) =>
      checked
        ? [...prev, categorySlug]
        : prev.filter((slug) => slug !== categorySlug),
    );
  };

  const handleTagChange = (tagSlug: string, checked: boolean) => {
    setSelectedTags((prev) =>
      checked ? [...prev, tagSlug] : prev.filter((slug) => slug !== tagSlug),
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex flex-col items-center gap-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Family Recipes
        </h1>
        <p className="text-muted-foreground text-xl">
          Delicious meals, passed down through generations.
        </p>
        <div className="w-full max-w-md">
          <SearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      <h2 className="mb-4 text-2xl font-bold">Latest Recipes</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mockRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      <div className="mt-16">
        <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Filter by Category</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Categories</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allCategories.map((category: Category) => (
                  <DropdownMenuCheckboxItem
                    key={category.id}
                    checked={selectedCategories.includes(category.slug)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category.slug, checked)
                    }
                  >
                    {category.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Filter by Tag</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Tags</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allTags.map((tag: Tag) => (
                  <DropdownMenuCheckboxItem
                    key={tag.id}
                    checked={selectedTags.includes(tag.slug)}
                    onCheckedChange={(checked) =>
                      handleTagChange(tag.slug, checked)
                    }
                  >
                    {tag.name}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/recipe/new">
              <Button className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                New Recipe
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </div>
  );
}
