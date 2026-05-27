"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "~/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import type { RecipeFormValues } from "~/lib/schemas/recipe-form"
import { api } from "~/trpc/react"
import { useMemo } from "react"

export function EnhancedIngredientForm() {
  const { control } = useFormContext<RecipeFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  })

  const { data: units = [] } = api.units.getAll.useQuery()

  const allUnits = useMemo(() => units, [units])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
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
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const val = e.target.value
                        field.onChange(val === "" ? undefined : Number(val))
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`ingredients.${index}.unitName`}
              render={({ field }) => (
                <FormItem className="w-32">
                  <FormLabel className="sr-only">Unit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value ?? ""}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {allUnits.map((unit) => (
                        <SelectItem key={unit.id} value={unit.abbreviation || unit.name}>
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
                    <Input
                      placeholder="Notes (optional)"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => remove(index)}
              className="mb-1"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove ingredient</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({ name: "", quantity: undefined, unitName: "", notes: "" })
          }
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Ingredient
        </Button>
      </CardContent>
    </Card>
  )
}
