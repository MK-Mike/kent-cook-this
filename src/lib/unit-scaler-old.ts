import { api } from "~/trpc/server";
import { type Ingredient, UnitType } from "./types2";
import type { SelectUnit as Unit } from "~/server/db/zodSchemas/ingredients";

const units: Unit[] = await api.units.getAll();

export function convertUnits(
  quantity: number,
  fromUnit: Unit,
  toUnit: Unit,
  densityGPerMl?: number,
): number {
  if (fromUnit.type !== toUnit.type) {
    throw new Error(
      `Cannot convert between different unit types: ${fromUnit.type} and ${toUnit.type}`,
    );
  }

  // Handle volume to mass conversion if density is provided
  if (fromUnit.type === "volume" && toUnit.type === "mass") {
    if (!densityGPerMl) {
      throw new Error(
        `Density is required to convert from volume (${fromUnit.name}) to mass (${toUnit.name})`,
      );
    }
    // Convert volume to ml first, then to grams
    const quantityMl = quantity * fromUnit.mlPerUnit;
    const quantityG = quantityMl * densityGPerMl;
    return quantityG / toUnit.gPerUnit;
  }

  // Handle mass to volume conversion if density is provided
  if (fromUnit.type === "mass" && toUnit.type === "volume") {
    if (!densityGPerMl) {
      throw new Error(
        `Density is required to convert from mass (${fromUnit.name}) to volume (${toUnit.name})`,
      );
    }
    // Convert mass to grams first, then to ml
    const quantityG = quantity * fromUnit.gPerUnit;
    const quantityMl = quantityG / densityGPerMl;
    return quantityMl / toUnit.mlPerUnit;
  }

  // Standard conversion within the same unit type (mass, volume, count)
  if (fromUnit.type === "mass") {
    const quantityG = quantity * fromUnit.gPerUnit;
    return quantityG / toUnit.gPerUnit;
  } else if (fromUnit.type === "volume") {
    const quantityMl = quantity * fromUnit.mlPerUnit;
    return quantityMl / toUnit.mlPerUnit;
  } else if (fromUnit.type === "count") {
    // For count units, direct conversion if a ratio exists, otherwise 1:1
    if (fromUnit.unitsPerUnit && toUnit.unitsPerUnit) {
      return (quantity * fromUnit.unitsPerUnit) / toUnit.unitsPerUnit;
    }
    return quantity; // Assume 1:1 if no specific conversion factor
  }

  return quantity; // Should not reach here if types are handled
}

export function scaleIngredients(
  ingredients: Ingredient[],
  originalServings: number,
  targetServings: number,
): Ingredient[] {
  if (originalServings <= 0 || targetServings <= 0) {
    throw new Error("Servings must be positive numbers.");
  }

  const scaleFactor = targetServings / originalServings;

  return ingredients.map((ingredient) => {
    const scaledQuantity = ingredient.quantity * scaleFactor;
    return { ...ingredient, quantity: scaledQuantity };
  });
}

export function formatQuantity(quantity: number): string {
  if (quantity === 0) return "0";
  if (quantity < 1) {
    // For quantities less than 1, show up to 2 decimal places or fractions
    if (quantity === 0.25) return "1/4";
    if (quantity === 0.33) return "1/3";
    if (quantity === 0.5) return "1/2";
    if (quantity === 0.66) return "2/3";
    if (quantity === 0.75) return "3/4";
    return quantity.toFixed(2).replace(/\.?0+$/, ""); // Remove trailing zeros
  }
  // For quantities 1 or greater, show up to 2 decimal places if not whole
  if (quantity % 1 === 0) {
    return quantity.toString();
  }
  return quantity.toFixed(2).replace(/\.?0+$/, ""); // Remove trailing zeros
}
