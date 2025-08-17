"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"
import type { Step } from "@/lib/types"

interface DynamicStepsFormProps {
  steps: Step[]
  onChange: (steps: Step[]) => void
}

export function DynamicStepsForm({ steps, onChange }: DynamicStepsFormProps) {
  const addStep = () => {
    const newStep: Step = {
      description: "",
      image: null,
    }
    onChange([...steps, newStep])
  }

  const removeStep = (index: number) => {
    const newSteps = steps.filter((_, i) => i !== index)
    onChange(newSteps)
  }

  const updateStep = (index: number, field: keyof Step, value: string) => {
    const newSteps = steps.map((step, i) => {
      if (i === index) {
        return { ...step, [field]: value }
      }
      return step
    })
    onChange(newSteps)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Instructions</Label>
        <Button type="button" onClick={addStep} size="sm" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>

      {steps.map((step, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-muted-foreground" />
                Step {index + 1}
              </div>
              {steps.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeStep(index)}
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor={`step-description-${index}`}>Description</Label>
              <Textarea
                id={`step-description-${index}`}
                placeholder="Describe this step..."
                value={step.description}
                onChange={(e) => updateStep(index, "description", e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor={`step-image-${index}`}>Image URL (optional)</Label>
              <Input
                id={`step-image-${index}`}
                type="url"
                placeholder="https://example.com/step-image.jpg"
                value={step.image || ""}
                onChange={(e) => updateStep(index, "image", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {steps.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No steps added yet. Click "Add Step" to get started.</p>
        </div>
      )}
    </div>
  )
}
