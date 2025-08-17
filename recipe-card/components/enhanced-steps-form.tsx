"use client"

import { useFieldArray, useFormContext } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { RecipeFormValues } from "@/lib/schema"

export function EnhancedStepsForm() {
  const { control } = useFormContext<RecipeFormValues>()
  const { fields, append, remove } = useFieldArray({
    control,
    name: "steps",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preparation Steps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <FormField
              control={control}
              name={`steps.${index}.description`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="sr-only">Step {index + 1}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={`Step ${index + 1} description`} className="min-h-[80px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`steps.${index}.image`}
              render={({ field }) => (
                <FormItem className="w-40">
                  <FormLabel className="sr-only">Step {index + 1} Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Image URL (optional)"
                      {...field}
                      value={field.value || ""} // Ensure controlled component
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} className="mt-9">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Remove step</span>
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ description: "", image: "" })}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Step
        </Button>
      </CardContent>
    </Card>
  )
}
