"use client";

import { useState, useMemo, useEffect } from "react";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useUnitSystem } from "~/hooks/use-unit-system";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { formatQuantity } from "recipe-card/lib/unit-scaler";
import { scaleQuantity } from "~/lib/unitScaler";
type Recipe = inferRouterOutputs<AppRouter>["recipes"]["getById"];
type ScaledResult = inferRouterOutputs<AppRouter>["units"]["scale"];
type RecipeIngredient =
  inferRouterOutputs<AppRouter>["ingredients"]["getAll"][0];
interface ScaledIngredientDisplayProps {
  recipe: Recipe;
}

export function ScaledIngredientDisplay({
  recipe,
}: ScaledIngredientDisplayProps) {
  const { unitSystem, toggleUnitSystem } = useUnitSystem();
  const [currentServings, setServings] = useState(recipe?.servings ?? 1);
  const [scaledIngredients, setScaledIngredients] = useState<
    (RecipeIngredient & { scaled: ScaledResult | null })[]
  >([]);

  // Function to fetch all necessary unit details if not already part of RecipeIngredient
  // This could also be a separate tRPC call or part of a larger recipe fetch.
  const { data: allUnits, isLoading: unitsLoading } =
    api.units.getAll.useQuery();

  useEffect(() => {
    if (!recipe) {
      return;
    }
    const scaleAllIngredients = async () => {
      const scaled = await Promise.all(
        recipe.ingredients.map(async (ing) => {
          if (ing.unitId === null || !allUnits) {
            // Handle ingredients with no unit or if units are still loading
            return {
              id: ing.ingredient.id,
              name: ing.ingredient.name,
              scaled: {
                value: ing.quantity,
                unit: {
                  id: -1,
                  name: "",
                  abbreviation: "",
                  type: "mass",
                  factorToBase: 1,
                  system: "imperial",
                  subUnitId: null,
                  subUnitScale: null,
                },
              },
            }; // Placeholder for no unit
          }
          try {
            const multiplier = currentServings / recipe.servings;
            const result = await scaleQuantity(
              ing.quantity,
              ing.unitId,
              multiplier,
            );
            return {
              id: ing.ingredient.id,
              name: ing.ingredient.name,
              scaled: result,
            };
          } catch (error) {
            console.error(`Error scaling ${ing.ingredient.name}:`, error);
            return { ...ing, scaled: null }; // Handle error state
          }
        }),
      );
      setScaledIngredients(scaled);
    };

    if (allUnits) {
      // Only run scaling if units data is available
      void scaleAllIngredients();
    }
  }, [
    recipe,
    currentServings,
    recipe?.ingredients,
    recipe?.servings,
    allUnits,
  ]);

  const renderQuantity = (scaled: ScaledResult | null) => {
    if (!scaled) {
      return "N/A"; // Or handle error appropriately
    }
    if ("value" in scaled) {
      // Simple display
      return `${scaled.value.toFixed(2)} ${scaled.unit.abbreviation}`;
    } else {
      // Compound display
      let text = `${scaled.major} ${scaled.majorUnit.abbreviation}`;
      if (scaled.minor > 0) {
        text += ` ${scaled.minor} ${scaled.minorUnit.abbreviation}`;
      }
      return text;
    }
  };

  if (!recipe?.ingredients) {
    return <div>No ingredients found for this recipe</div>;
  }
  if (unitsLoading) {
    return <div>Loading units for scaling...</div>;
  }

  if (recipe?.servings) {
    setServings(recipe.servings);
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="servings" className="text-lg font-semibold">
          Servings: {currentServings}
        </Label>
        <Slider
          id="servings"
          min={1}
          max={12}
          step={1}
          value={[currentServings]}
          onValueChange={([value]) => {
            if (!value) {
              setServings(1);
            } else {
              setServings(value);
            }
          }}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="unit-system" className="text-lg font-semibold">
          Unit System
        </Label>
        <Select value={unitSystem} onValueChange={toggleUnitSystem}>
          <SelectTrigger id="unit-system" className="mt-2 w-[180px]">
            <SelectValue placeholder="Select unit system" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metric">Metric (g, ml)</SelectItem>
            <SelectItem value="imperial">Imperial (oz, cups)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <h3 className="text-xl font-bold">
        Ingredients ({currentServings} Servings)
      </h3>
      <ul className="space-y-2">
        {scaledIngredients?.map((ingredient, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="font-medium">
              {formatQuantity(ingredient.scaledQuantity)}{" "}
              {ingredient.unit?.abbreviation}
            </span>
            <span>{ingredient.ingredient.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
