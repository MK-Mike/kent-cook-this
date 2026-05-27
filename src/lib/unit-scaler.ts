import { type UnitConversion, UnitType, getAllUnitsForConversion } from "~/lib/conversion-types"

const units: UnitConversion[] = getAllUnitsForConversion()

export function convertUnits(
  quantity: number,
  fromUnit: UnitConversion,
  toUnit: UnitConversion,
  densityGPerMl?: number,
): number {
  if (fromUnit.type !== toUnit.type) {
    throw new Error(`Cannot convert between different unit types: ${fromUnit.type} and ${toUnit.type}`)
  }

  // Handle volume to mass conversion if density is provided
  if (fromUnit.type === UnitType.Volume && toUnit.type === UnitType.Mass) {
    if (!densityGPerMl) {
      throw new Error(
        `Density is required to convert from volume (${fromUnit.name}) to mass (${toUnit.name})`,
      )
    }
    if (fromUnit.mlPerUnit === undefined || toUnit.gPerUnit === undefined) {
      throw new Error(`Missing conversion factor for ${fromUnit.name} or ${toUnit.name}`)
    }
    const quantityMl = quantity * fromUnit.mlPerUnit
    const quantityG = quantityMl * densityGPerMl
    return quantityG / toUnit.gPerUnit
  }

  // Handle mass to volume conversion if density is provided
  if (fromUnit.type === UnitType.Mass && toUnit.type === UnitType.Volume) {
    if (!densityGPerMl) {
      throw new Error(
        `Density is required to convert from mass (${fromUnit.name}) to volume (${toUnit.name})`,
      )
    }
    if (fromUnit.gPerUnit === undefined || toUnit.mlPerUnit === undefined) {
      throw new Error(`Missing conversion factor for ${fromUnit.name} or ${toUnit.name}`)
    }
    const quantityG = quantity * fromUnit.gPerUnit
    const quantityMl = quantityG / densityGPerMl
    return quantityMl / toUnit.mlPerUnit
  }

  // Standard conversion within the same unit type
  if (fromUnit.type === UnitType.Mass) {
    if (fromUnit.gPerUnit === undefined || toUnit.gPerUnit === undefined) {
      throw new Error(`Missing gPerUnit conversion factor for ${fromUnit.name} or ${toUnit.name}`)
    }
    const quantityG = quantity * fromUnit.gPerUnit
    return quantityG / toUnit.gPerUnit
  } else if (fromUnit.type === UnitType.Volume) {
    if (fromUnit.mlPerUnit === undefined || toUnit.mlPerUnit === undefined) {
      throw new Error(`Missing mlPerUnit conversion factor for ${fromUnit.name} or ${toUnit.name}`)
    }
    const quantityMl = quantity * fromUnit.mlPerUnit
    return quantityMl / toUnit.mlPerUnit
  } else if (fromUnit.type === UnitType.Count) {
    if (fromUnit.unitsPerUnit !== undefined && toUnit.unitsPerUnit !== undefined) {
      return (quantity * fromUnit.unitsPerUnit) / toUnit.unitsPerUnit
    }
    return quantity
  }

  return quantity
}

export function scaleQuantity(
  quantity: number,
  originalServings: number,
  targetServings: number,
): number {
  if (originalServings <= 0 || targetServings <= 0) {
    throw new Error("Servings must be positive numbers.")
  }
  return (quantity * targetServings) / originalServings
}

export function formatQuantity(quantity: number): string {
  if (quantity === 0) return "0"
  if (quantity < 1) {
    if (quantity === 0.25) return "1/4"
    if (quantity === 0.33) return "1/3"
    if (quantity === 0.5) return "1/2"
    if (quantity === 0.66) return "2/3"
    if (quantity === 0.75) return "3/4"
    return quantity.toFixed(2).replace(/\.?0+$/, "")
  }
  if (quantity % 1 === 0) {
    return quantity.toString()
  }
  return quantity.toFixed(2).replace(/\.?0+$/, "")
}
