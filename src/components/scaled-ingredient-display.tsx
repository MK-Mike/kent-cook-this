"use client"

import { useState, useMemo } from "react"
import { Label } from "~/components/ui/label"
import { Slider } from "~/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { convertUnits, formatQuantity } from "~/lib/unit-scaler"
import { getAllUnitsForConversion, getIngredientDensityData, type UnitConversion } from "~/lib/conversion-types"
import { useUnitSystem } from "~/hooks/use-unit-system"

interface IngredientItem {
  name: string
  quantity: number
  unitAbbreviation: string | null
  unitName: string | null
  notes?: string | null
}

interface ScaledIngredientDisplayProps {
  recipe: {
    id: number
    title: string
    servings: number
    ingredients: IngredientItem[]
  }
}

export function ScaledIngredientDisplay({ recipe }: ScaledIngredientDisplayProps) {
  const { unitSystem, setUnitSystem } = useUnitSystem()
  const [servings, setServings] = useState(recipe.servings)

  const allUnits = useMemo(() => getAllUnitsForConversion(), [])

  const scaledIngredients = useMemo(() => {
    const scaleFactor = servings / recipe.servings
    return recipe.ingredients.map((ingredient) => {
      const unitIdentifier = ingredient.unitAbbreviation ?? ingredient.unitName ?? ""
      const originalUnit = allUnits.find(
        (u) => u.abbreviation === unitIdentifier || u.name === unitIdentifier,
      )
      if (!originalUnit) {
        console.warn(`Unit not found for: ${unitIdentifier}`)
        return { ...ingredient, scaledQuantity: ingredient.quantity, displayUnit: unitIdentifier }
      }

      const targetUnit: UnitConversion | undefined =
        allUnits.find(
          (u) => u.type === originalUnit.type && u.isMetric === (unitSystem === "metric"),
        ) ?? originalUnit

      const density = getIngredientDensityData(ingredient.name)

      try {
        const convertedQuantity = convertUnits(
          ingredient.quantity * scaleFactor,
          originalUnit,
          targetUnit,
          density?.densityGPerMl,
        )
        return {
          ...ingredient,
          scaledQuantity: convertedQuantity,
          displayUnit: targetUnit.abbreviation || targetUnit.name,
        }
      } catch (error) {
        console.error(`Error converting unit for ${ingredient.name}:`, error)
        return {
          ...ingredient,
          scaledQuantity: ingredient.quantity * scaleFactor,
          displayUnit: unitIdentifier,
        }
      }
    })
  }, [servings, recipe.servings, recipe.ingredients, unitSystem, allUnits])

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
          onValueChange={([value]) => setServings(value ?? 1)}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="unit-system" className="text-lg font-semibold">
          Unit System
        </Label>
        <Select
          value={unitSystem}
          onValueChange={(value) => setUnitSystem(value as "metric" | "imperial")}
        >
          <SelectTrigger id="unit-system" className="w-[180px] mt-2">
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
              {formatQuantity(ingredient.scaledQuantity)} {ingredient.displayUnit}
            </span>
            <span>{ingredient.name}</span>
            {ingredient.notes && (
              <span className="text-muted-foreground text-sm">({ingredient.notes})</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
