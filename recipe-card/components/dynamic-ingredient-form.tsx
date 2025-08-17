"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RecipeFormValues } from "@/lib/schema"
import { getAllUnits, getUnitType } from "@/lib/types"
import { useMemo } from "react"

export function DynamicIngredientForm() {
  const { control, watch } = useFormContext<RecipeFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  })

  const allUnits = useMemo(() => getAllUnits(), [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => {
          const currentUnit = watch(`ingredients.${index}.unit`)
          const unitType = getUnitType(currentUnit)
          const filteredUnits = allUnits.filter((unit) => getUnitType(unit.abbreviation || unit.name) === unitType)

          return (
            <div key={field.id} className="flex items-end gap-2">
              <FormField
                control={control}
                name={`ingredients.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel className="sr-only">Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Qty"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`ingredients.${index}.unit`}
                render={({ field }) => (
                  <FormItem className="w-32">
                    <FormLabel className="sr-only">Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredUnits.map((unit) => (
                          <SelectItem key={unit.abbreviation || unit.name} value={unit.abbreviation || unit.name}>
                            {unit.name} ({unit.abbreviation})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`ingredients.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Ingredient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingredient name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`ingredients.${index}.notes`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="sr-only">Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Notes (optional)" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="mb-1">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove ingredient</span>
              </Button>
            </div>
          )
        })}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ quantity: 0, unit: "g", name: "", notes: "" })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Ingredient
        </Button>
      </CardContent>
    </Card>
  )
}
