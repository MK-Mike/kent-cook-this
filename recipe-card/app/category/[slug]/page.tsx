"use client";

import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { getTagsByType } from "@/lib/types2";
import { useState, useMemo } from "react";
import { Filter, X } from "lucide-react";
import { notFound } from "next/navigation";
import { mockCategories, mockRecipes } from "@/lib/mock-data"; // Corrected import
import Loading from "./loading";
import { Suspense } from "react";

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  const category = useMemo(() => {
    return mockCategories.find((cat) => cat.slug === slug);
  }, [slug]);

  if (!category) {
    notFound();
  }

  const categoryName =
    category.name ||
    slug.charAt(0).toUpperCase() + slug.slice(1).replace("-", " ");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Get all tag types for filtering
  const dietaryTags = getTagsByType("dietary_preferences");
  const cuisineTags = getTagsByType("cuisines");
  const preparationTags = getTagsByType("preparation_style");
  const occasionTags = getTagsByType("occasions_and_seasons");

  const filteredRecipes = useMemo(() => {
    let recipes = mockRecipes.filter(
      (recipe) =>
        recipe.category?.slug === slug || recipe.subcategory?.slug === slug,
    );

    if (selectedTags.length > 0) {
      recipes = recipes.filter((recipe) =>
        selectedTags.some((tagSlug) => recipe.tags.includes(tagSlug)),
      );
    }
    return recipes;
  }, [slug, selectedTags]);

  const toggleTag = (tagSlug: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagSlug)
        ? prev.filter((s) => s !== tagSlug)
        : [...prev, tagSlug],
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
  };

  return (
    <div className="bg-background min-h-screen md:ml-64">
      <div className="p-8 pt-16 md:pt-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-foreground text-3xl font-bold">
                {categoryName}
              </h1>
              {category.description && (
                <p className="text-muted-foreground mt-2">
                  {category.description}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {selectedTags.length > 0 && (
                <span className="bg-primary text-primary-foreground ml-1 rounded-full px-2 py-0.5 text-xs">
                  {selectedTags.length}
                </span>
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="bg-card mb-8 rounded-lg p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-card-foreground font-medium">
                  Filter by Tags
                </h3>
                {selectedTags.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {dietaryTags.length > 0 && (
                  <div>
                    <h4 className="text-card-foreground mb-2 text-sm font-medium">
                      Dietary Preferences
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dietaryTags.map((tag) => (
                        <Button
                          key={tag.slug}
                          variant={
                            selectedTags.includes(tag.slug)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleTag(tag.slug)}
                          className="text-xs"
                          style={
                            selectedTags.includes(tag.slug)
                              ? {
                                  backgroundColor: tag.color,
                                  borderColor: tag.color,
                                  color: "white",
                                }
                              : {
                                  borderColor: tag.color,
                                  color: tag.color,
                                }
                          }
                        >
                          {tag.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {cuisineTags.length > 0 && (
                  <div>
                    <h4 className="text-card-foreground mb-2 text-sm font-medium">
                      Cuisines
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {cuisineTags.map((tag) => (
                        <Button
                          key={tag.slug}
                          variant={
                            selectedTags.includes(tag.slug)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleTag(tag.slug)}
                          className="text-xs"
                          style={
                            selectedTags.includes(tag.slug)
                              ? {
                                  backgroundColor: tag.color,
                                  borderColor: tag.color,
                                  color: "white",
                                }
                              : {
                                  borderColor: tag.color,
                                  color: tag.color,
                                }
                          }
                        >
                          {tag.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {preparationTags.length > 0 && (
                  <div>
                    <h4 className="text-card-foreground mb-2 text-sm font-medium">
                      Preparation Style
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {preparationTags.map((tag) => (
                        <Button
                          key={tag.slug}
                          variant={
                            selectedTags.includes(tag.slug)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleTag(tag.slug)}
                          className="text-xs"
                          style={
                            selectedTags.includes(tag.slug)
                              ? {
                                  backgroundColor: tag.color,
                                  borderColor: tag.color,
                                  color: "white",
                                }
                              : {
                                  borderColor: tag.color,
                                  color: tag.color,
                                }
                          }
                        >
                          {tag.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {occasionTags.length > 0 && (
                  <div>
                    <h4 className="text-card-foreground mb-2 text-sm font-medium">
                      Occasions & Seasons
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {occasionTags.map((tag) => (
                        <Button
                          key={tag.slug}
                          variant={
                            selectedTags.includes(tag.slug)
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() => toggleTag(tag.slug)}
                          className="text-xs"
                          style={
                            selectedTags.includes(tag.slug)
                              ? {
                                  backgroundColor: tag.color,
                                  borderColor: tag.color,
                                  color: "white",
                                }
                              : {
                                  borderColor: tag.color,
                                  color: tag.color,
                                }
                          }
                        >
                          {tag.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <Suspense fallback={<Loading />}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </Suspense>

          {filteredRecipes.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                {selectedTags.length > 0
                  ? "No recipes found matching your filters."
                  : "No recipes found in this category."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
