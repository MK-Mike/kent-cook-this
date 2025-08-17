"use client"

import { useUnitSystem } from "@/hooks/use-unit-system"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function UnitSystemToggle() {
  const { unitSystem, toggleUnitSystem } = useUnitSystem()

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="unit-system-select">Units:</Label>
      <Select value={unitSystem} onValueChange={toggleUnitSystem}>
        <SelectTrigger id="unit-system-select" className="w-[120px]">
          <SelectValue placeholder="Select units" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="metric">Metric</SelectItem>
          <SelectItem value="imperial">Imperial</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
