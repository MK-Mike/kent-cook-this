import { db } from "~/server/db/index"; // Your Drizzle DB instance
import { units } from "~/server/db/schema"; // Your Drizzle schema
import { eq } from "drizzle-orm";

// Define the structure of a row from the `units` table
type UnitRow = {
  id: number;
  name: string;
  abbreviation: string;
  type: "mass" | "volume";
  factorToBase: number;
  system: "metric" | "imperial";
  subUnitId: number | null;
  subUnitScale: number | null;
};

// Define the possible shapes of the scaled result
export type ScaledResult =
  | { value: number; unit: UnitRow } // Simple result: eg. 1.5 kg
  | {
      major: number;
      majorUnit: UnitRow;
      minor: number;
      minorUnit: UnitRow;
    }; // Compound result: eg. 3 lb + 2 oz

/**
 * Scales a given quantity by a multiplier and returns it in the
 * most appropriate unit, potentially as a compound (major + minor) unit
 * if the original unit's system supports it (e.g., pounds and ounces).
 *
 * @param quantity The initial quantity (e.g., 16 for 16 ounces).
 * @param unitId The ID of the initial unit (e.g., ID for 'Ounce').
 * @param multiplier The factor by which to scale the quantity (e.g., 3 for tripling).
 * @returns A Promise that resolves to a ScaledResult, containing the scaled value
 *          and the best-fitting unit, or major/minor units for compound displays.
 */
export async function scaleQuantity(
  quantity: number,
  unitId: number,
  multiplier: number,
): Promise<ScaledResult> {
  // 1. Fetch the 'from' unit details from the database
  const fromUnitResult = await db
    .select()
    .from(units)
    .where(eq(units.id, unitId))
    .limit(1);
  const fromUnit = fromUnitResult[0] as UnitRow | undefined;

  if (!fromUnit) {
    throw new Error(`Unit with ID ${unitId} not found.`);
  }

  // 2. Calculate the total quantity in its base unit (grams for mass, milliliters for volume)
  const totalInBase = quantity * multiplier * fromUnit.factorToBase;

  // 3. Fetch all units of the same type (mass or volume) from the database
  const allSameTypeUnits = (await db
    .select()
    .from(units)
    .where(eq(units.type, fromUnit.type))) as UnitRow[];

  // 4. Determine the best unit for displaying the scaled quantity
  const bestUnit = chooseBestUnit(
    allSameTypeUnits,
    totalInBase,
    fromUnit.system,
  );

  // 5. Check if the best unit has a defined sub-unit for compound display
  if (bestUnit.subUnitId && bestUnit.subUnitScale !== null) {
    // Fetch the sub-unit details
    const subUnitResult = await db
      .select()
      .from(units)
      .where(eq(units.id, bestUnit.subUnitId))
      .limit(1);
    const subUnit = subUnitResult[0] as UnitRow | undefined;

    if (!subUnit) {
      throw new Error(
        `Sub-unit with ID ${bestUnit.subUnitId} not found for unit ${bestUnit.name}.`,
      );
    }

    // Calculate major and minor components
    const majorValue = Math.floor(totalInBase / bestUnit.factorToBase);
    const remainderInBase = totalInBase - majorValue * bestUnit.factorToBase;

    // Convert remainder to sub-units and round to nearest whole number
    let minorValue = Math.round(remainderInBase / subUnit.factorToBase);

    // Handle carry-over: if minorValue reaches or exceeds subUnitScale,
    // increment majorValue and adjust minorValue. This helps with rounding
    // that might push it just over.
    if (minorValue >= bestUnit.subUnitScale) {
      minorValue -= bestUnit.subUnitScale;
      return {
        major: majorValue + 1,
        majorUnit: bestUnit,
        minor: minorValue,
        minorUnit: subUnit,
      };
    }

    return {
      major: majorValue,
      majorUnit: bestUnit,
      minor: minorValue,
      minorUnit: subUnit,
    };
  }

  // 6. If no sub-unit is defined, return a simple (decimal) scaled value
  return {
    value: totalInBase / bestUnit.factorToBase,
    unit: bestUnit,
  };
}

/**
 * Helper function to select the most appropriate unit from a list
 * of units of the same type (mass or volume). It prioritizes units
 * within the `preferredSystem` (metric/imperial) and chooses the largest
 * unit that can express the quantity as at least 1 unit.
 *
 * @param unitList An array of UnitRow objects, all of the same type (e.g., all mass units).
 * @param quantityInBase The total quantity expressed in its base unit (grams or milliliters).
 * @param preferredSystem The preferred unit system (e.g., 'imperial' if the original unit was imperial).
 * @returns The UnitRow object that is deemed the "best" for display.
 */
function chooseBestUnit(
  unitList: UnitRow[],
  quantityInBase: number,
  preferredSystem: "metric" | "imperial",
): UnitRow {
  // First, try to filter units by the preferred system
  const unitsInPreferredSystem = unitList.filter(
    (u) => u.system === preferredSystem,
  );

  // Use units from the preferred system if available, otherwise use all units
  const candidates = unitsInPreferredSystem.length
    ? unitsInPreferredSystem
    : unitList;

  // Sort candidates in descending order of their factorToBase (largest unit first)
  candidates.sort((a, b) => b.factorToBase - a.factorToBase);

  const absoluteQuantityInBase = Math.abs(quantityInBase);

  // Find the largest unit that can express the quantity as 1 or more (e.g., 0.5 kg but not 0.0005 kg)
  const bestFittingUnit =
    candidates.find((u) => absoluteQuantityInBase >= u.factorToBase) ??
    // If no unit can express it as 1 or more (e.g., a tiny amount),
    // fall back to the smallest unit available (which will be the last after sorting).
    candidates[candidates.length - 1];

  if (!bestFittingUnit) {
    throw new Error("No suitable unit found for the given quantity.");
  }

  return bestFittingUnit;
}
