import { db } from "~/server/db/index"; // Your Drizzle DB instance
import { units, ingredientDensities } from "~/server/db/schema"; // Your Drizzle schema
import { eq } from "drizzle-orm";

/**
 * @description
 * Converts a quantity of a specific ingredient from one unit to another.
 * This function handles two primary conversion scenarios:
 * 1. Same-Type Conversion: Converts between units of the same type, such as
 *    volume-to-volume (e.g., cups to milliliters) or mass-to-mass (e.g., ounces to grams).
 * 2. Cross-Type Conversion: Converts between volume and mass, which requires
 *    the ingredient's specific density (e.g., cups of flour to grams of flour).
 *
 * @param quantity The numerical value of the quantity to convert (e.g., 2 for 2 cups).
 * @param fromUnitId The database ID of the unit you are converting FROM.
 * @param toUnitId The database ID of the unit you are converting TO.
 * @param ingredientId The database ID of the ingredient being converted. This is
 *                     essential for accurate volume-to-mass conversions.
 *
 * @returns A Promise that resolves to a `number` representing the converted quantity.
 *
 * @throws Will throw an error if a unit ID is not found in the database.
 * @throws Will throw an error if a volume-to-mass conversion is attempted for an
 *         ingredient that does not have a density defined in the `ingredientDensities` table.
 *
 * @example
 * // Convert 2 cups of flour (ingredientId: 12) to grams (unitId: 6)
 * const gramsOfFlour = await convertIngredientUnit(2, 7, 6, 12);
 * console.log(gramsOfFlour); // Outputs the equivalent grams
 */
export async function convertIngredientUnit(
  quantity: number,
  fromUnitId: number,
  toUnitId: number,
  ingredientId: number,
): Promise<number> {
  // Fetch all required data in parallel for efficiency
  const [fromUnit, toUnit, densityRecord] = await Promise.all([
    db.select().from(units).where(eq(units.id, fromUnitId)).get(),
    db.select().from(units).where(eq(units.id, toUnitId)).get(),
    db
      .select({ densityGPerMl: ingredientDensities.densityGPerMl })
      .from(ingredientDensities)
      .where(eq(ingredientDensities.ingredientId, ingredientId))
      .get(),
  ]);

  // --- Input Validation ---
  if (!fromUnit || !toUnit) {
    throw new Error("One or both unit IDs were not found in the database.");
  }

  // --- Logic Case 1: Same-Type Conversion (Volume -> Volume or Mass -> Mass) ---
  // This is the simplest case and does not require density.
  if (fromUnit.type === toUnit.type) {
    // Convert the 'from' quantity to the base unit (ml or g),
    // then convert from the base unit to the 'to' unit.
    const quantityInBase = quantity * fromUnit.factorToBase;
    return quantityInBase / toUnit.factorToBase;
  }

  // --- Logic Case 2: Cross-Type Conversion (Volume <-> Mass) ---
  // This requires the ingredient's density.
  if (!densityRecord) {
    throw new Error(
      `Cannot convert between volume and mass for ingredient ID ${ingredientId}: No density is defined.`,
    );
  }
  const { densityGPerMl } = densityRecord;

  // Sub-case 2a: Volume to Mass (e.g., cups -> grams)
  if (fromUnit.type === "volume" && toUnit.type === "mass") {
    // 1. Convert source volume (e.g., cups) to base volume (ml)
    const totalMilliliters = quantity * fromUnit.factorToBase;
    // 2. Convert base volume (ml) to base mass (g) using density
    const totalGrams = totalMilliliters * densityGPerMl;
    // 3. Convert base mass (g) to the target mass unit (e.g., oz)
    return totalGrams / toUnit.factorToBase;
  }

  // Sub-case 2b: Mass to Volume (e.g., grams -> cups)
  if (fromUnit.type === "mass" && toUnit.type === "volume") {
    // 1. Convert source mass (e.g., oz) to base mass (g)
    const totalGrams = quantity * fromUnit.factorToBase;
    // 2. Convert base mass (g) to base volume (ml) using density
    const totalMilliliters = totalGrams / densityGPerMl;
    // 3. Convert base volume (ml) to the target volume unit (e.g., cups)
    return totalMilliliters / toUnit.factorToBase;
  }

  // Fallback error for unexpected scenarios
  throw new Error(
    `An unexpected conversion scenario occurred from ${fromUnit.type} to ${toUnit.type}.`,
  );
}
