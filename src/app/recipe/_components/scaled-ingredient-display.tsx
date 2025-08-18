"use client";

import { useState, useMemo } from "react";
import { Label } from "~/components/ui/label";
import { Slider } from "~/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import type { Recipe } from "~/lib/types";
import { convertUnits, formatQuantity } from "~/lib/unit-scaler";
import { getIngredientDensity, getAllUnits } from "~/lib/types";
import { useUnitSystem } from "~/hooks/use-unit-system"; // Corrected import path

interface ScaledIngredientDisplayProps {
  recipe: Recipe;
}

export function ScaledIngredientDisplay({
  recipe,
}: ScaledIngredientDisplayProps) {
  const { unitSystem, toggleUnitSystem } = useUnitSystem();
  const [servings, setServings] = useState(recipe.servings);

  const allUnits = useMemo(() => getAllUnits(), []);

  const scaledIngredients = useMemo(() => {
    const scaleFactor = servings / recipe.servings;
    return recipe.ingredients.map((ingredient) => {
      const originalUnit = allUnits.find(
        (u) => u.abbreviation === ingredient.unit || u.name === ingredient.unit,
      );
      if (!originalUnit) {
        console.warn(`Unit not found for: ${ingredient.unit}`);
        return { ...ingredient, scaledQuantity: ingredient.quantity };
      }

      const targetUnit =
        allUnits.find(
          (u) =>
            u.type === originalUnit.type &&
            u.isMetric === (unitSystem === "metric"),
        ) || originalUnit;

      const density = getIngredientDensity(ingredient.name);

      try {
        const convertedQuantity = convertUnits(
          ingredient.quantity * scaleFactor,
          originalUnit,
          targetUnit,
          density?.densityGPerMl,
        );
        return {
          ...ingredient,
          scaledQuantity: convertedQuantity,
          displayUnit: targetUnit.abbreviation || targetUnit.name,
        };
      } catch (error) {
        console.error(`Error converting unit for ${ingredient.name}:`, error);
        return {
          ...ingredient,
          scaledQuantity: ingredient.quantity * scaleFactor,
          displayUnit: ingredient.unit,
        };
      }
    });
  }, [servings, recipe.servings, recipe.ingredients, unitSystem, allUnits]);

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="servings" className="text-lg font-semibold">
          Servings: {servings}
        </Label>
        <Slider
          id="servings"
          min={1}
          max={12}
          step={1}
          value={[servings]}
          onValueChange={([value]) => setServings(value)}
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

      <h3 className="text-xl font-bold">Ingredients ({servings} Servings)</h3>
      <ul className="space-y-2">
        {scaledIngredients.map((ingredient, index) => (
          <li key={index} className="flex items-center gap-2">
            <span className="font-medium">
              {formatQuantity(ingredient.scaledQuantity)}{" "}
              {ingredient.displayUnit || ingredient.unit}
            </span>
            <span>{ingredient.name}</span>
            {ingredient.notes && (
              <span className="text-muted-foreground text-sm">
                ({ingredient.notes})
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
