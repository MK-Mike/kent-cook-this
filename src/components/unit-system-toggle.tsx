"use client"

import { useEffect, useState } from "react"
import { useUnitSystem } from "~/hooks/use-unit-system"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Label } from "~/components/ui/label"

export function UnitSystemToggle() {
  const { unitSystem, setUnitSystem } = useUnitSystem()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Label htmlFor="unit-system-select">Units:</Label>
        <div className="h-9 w-[120px] animate-pulse rounded-md bg-muted" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="unit-system-select">Units:</Label>
      <Select value={unitSystem} onValueChange={(value) => setUnitSystem(value as "metric" | "imperial")}>
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
