export enum UnitType {
  Mass = "mass",
  Volume = "volume",
  Count = "count",
}

export interface UnitConversion {
  name: string
  abbreviation: string
  type: UnitType
  isMetric: boolean
  // Conversion factors to a base unit (grams for mass, ml for volume)
  gPerUnit?: number // grams per unit (for mass)
  mlPerUnit?: number // milliliters per unit (for volume)
  unitsPerUnit?: number // for count units, e.g., 12 for dozen
}

export interface IngredientDensityData {
  name: string
  densityGPerMl: number // grams per milliliter
}

// Hardcoded unit list for conversion purposes, mirroring the Drizzle schema
// but with computed gPerUnit/mlPerUnit values
const allUnits: UnitConversion[] = [
  // Mass - Metric
  { name: "gram", abbreviation: "g", type: UnitType.Mass, isMetric: true, gPerUnit: 1 },
  { name: "kilogram", abbreviation: "kg", type: UnitType.Mass, isMetric: true, gPerUnit: 1000 },
  { name: "milligram", abbreviation: "mg", type: UnitType.Mass, isMetric: true, gPerUnit: 0.001 },
  // Mass - Imperial
  { name: "ounce", abbreviation: "oz", type: UnitType.Mass, isMetric: false, gPerUnit: 28.3495 },
  { name: "pound", abbreviation: "lb", type: UnitType.Mass, isMetric: false, gPerUnit: 453.592 },
  // Volume - Metric
  { name: "milliliter", abbreviation: "ml", type: UnitType.Volume, isMetric: true, mlPerUnit: 1 },
  { name: "liter", abbreviation: "L", type: UnitType.Volume, isMetric: true, mlPerUnit: 1000 },
  // Volume - Imperial
  { name: "teaspoon", abbreviation: "tsp", type: UnitType.Volume, isMetric: false, mlPerUnit: 4.92892 },
  { name: "tablespoon", abbreviation: "tbsp", type: UnitType.Volume, isMetric: false, mlPerUnit: 14.7868 },
  { name: "fluid ounce", abbreviation: "fl oz", type: UnitType.Volume, isMetric: false, mlPerUnit: 29.5735 },
  { name: "cup", abbreviation: "cup", type: UnitType.Volume, isMetric: false, mlPerUnit: 236.588 },
  { name: "pint", abbreviation: "pt", type: UnitType.Volume, isMetric: false, mlPerUnit: 473.176 },
  { name: "quart", abbreviation: "qt", type: UnitType.Volume, isMetric: false, mlPerUnit: 946.353 },
  { name: "gallon", abbreviation: "gal", type: UnitType.Volume, isMetric: false, mlPerUnit: 3785.41 },
  // Count / Other — no Drizzle equivalents, kept for form display
  { name: "unit", abbreviation: "unit", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "clove", abbreviation: "cloves", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "medium", abbreviation: "medium", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "large", abbreviation: "large", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "small", abbreviation: "small", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "can", abbreviation: "can", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "head", abbreviation: "head", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "pinch", abbreviation: "pinch", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
  { name: "dash", abbreviation: "dash", type: UnitType.Count, isMetric: false, unitsPerUnit: 1 },
]

const ingredientDensities: IngredientDensityData[] = [
  { name: "water", densityGPerMl: 1 },
  { name: "milk", densityGPerMl: 1.03 },
  { name: "flour", densityGPerMl: 0.57 },
  { name: "sugar", densityGPerMl: 0.85 },
  { name: "honey", densityGPerMl: 1.42 },
  { name: "olive oil", densityGPerMl: 0.92 },
  { name: "butter", densityGPerMl: 0.911 },
  { name: "rice", densityGPerMl: 0.85 },
  { name: "quinoa", densityGPerMl: 0.75 },
  { name: "oats", densityGPerMl: 0.4 },
  { name: "salt", densityGPerMl: 1.2 },
  { name: "cocoa powder", densityGPerMl: 0.35 },
  { name: "yogurt", densityGPerMl: 1.03 },
  { name: "cream", densityGPerMl: 1.0 },
  { name: "chicken broth", densityGPerMl: 1.0 },
  { name: "tahini", densityGPerMl: 0.95 },
]

export function getAllUnitsForConversion(): UnitConversion[] {
  return allUnits
}

export function getUnitForConversion(abbreviationOrName: string): UnitConversion | undefined {
  return allUnits.find((unit) => unit.abbreviation === abbreviationOrName || unit.name === abbreviationOrName)
}

export function getUnitType(abbreviationOrName: string): UnitType | undefined {
  return getUnitForConversion(abbreviationOrName)?.type
}

export function getIngredientDensityData(name: string): IngredientDensityData | undefined {
  return ingredientDensities.find((density) => density.name.toLowerCase().includes(name.toLowerCase()))
}

/**
 * Build a UnitConversion from a Drizzle Unit row.
 * Drizzle's `factorToBase` maps to gPerUnit for mass, mlPerUnit for volume.
 */
export function unitFromDrizzle(
  drizzleUnit: { name: string; abbreviation: string; type: string; factorToBase: number; system: string },
): UnitConversion {
  const type = drizzleUnit.type === "mass" ? UnitType.Mass : UnitType.Volume
  const isMetric = drizzleUnit.system === "metric"

  if (type === UnitType.Mass) {
    return { name: drizzleUnit.name, abbreviation: drizzleUnit.abbreviation, type, isMetric, gPerUnit: drizzleUnit.factorToBase }
  }
  // Volume
  return { name: drizzleUnit.name, abbreviation: drizzleUnit.abbreviation, type, isMetric, mlPerUnit: drizzleUnit.factorToBase }
}
