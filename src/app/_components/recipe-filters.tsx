"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
} from "src/components/ui/dropdown-menu";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import type { Category, Tag } from "~/lib/types"; // Import types

type RecipeFiltersProps = {
  allCategories: Category[];
  allTags: Tag[];
  initialSelectedCategories: string[];
  initialSelectedTags: string[];
};

export function RecipeFilters({
  allCategories,
  allTags,
  initialSelectedCategories,
  initialSelectedTags,
}: RecipeFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialSelectedCategories,
  );
  const [selectedTags, setSelectedTags] =
    useState<string[]>(initialSelectedTags);

  const updateUrlParams = (newCategories: string[], newTags: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());

    if (newCategories.length > 0) {
      newSearchParams.set("categories", newCategories.join(","));
    } else {
      newSearchParams.delete("categories");
    }

    if (newTags.length > 0) {
      newSearchParams.set("tags", newTags.join(","));
    } else {
      newSearchParams.delete("tags");
    }

    router.replace(`?${newSearchParams.toString()}`);
  };

  const handleCategoryChange = (categorySlug: string, checked: boolean) => {
    const newCategories = checked
      ? [...selectedCategories, categorySlug]
      : selectedCategories.filter((slug) => slug !== categorySlug);
    setSelectedCategories(newCategories);
    updateUrlParams(newCategories, selectedTags);
  };

  const handleTagChange = (tagSlug: string, checked: boolean) => {
    const newTags = checked
      ? [...selectedTags, tagSlug]
      : selectedTags.filter((slug) => slug !== tagSlug);
    setSelectedTags(newTags);
    updateUrlParams(selectedCategories, newTags);
  };

  return (
    <div className="mb-8 flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="flex gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter by Category</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allCategories.length > 0 ? (
              allCategories.map((category: Category) => (
                <DropdownMenuCheckboxItem
                  key={category!.id}
                  checked={selectedCategories.includes(category!.slug)}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category!.slug, checked)
                  }
                >
                  {category!.name}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No Categories</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Filter by Tag</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allTags.length > 0 ? (
              allTags.map((tag: Tag) => (
                <DropdownMenuCheckboxItem
                  key={tag!.id}
                  checked={selectedTags.includes(tag!.slug)}
                  onCheckedChange={(checked) =>
                    handleTagChange(tag!.slug, checked)
                  }
                >
                  {tag!.name}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No Tags</DropdownMenuItem>
            )}
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
  );
}
