"use client"

import { useState, useEffect } from "react"

export type UnitSystem = "metric" | "imperial"

const UNIT_SYSTEM_KEY = "unit-system"

export function useUnitSystem() {
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>("metric")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Load from localStorage on mount
    const stored = localStorage.getItem(UNIT_SYSTEM_KEY)
    if (stored === "metric" || stored === "imperial") {
      setUnitSystemState(stored)
    }
    setIsLoaded(true)
  }, [])

  const setUnitSystem = (system: UnitSystem) => {
    setUnitSystemState(system)
    localStorage.setItem(UNIT_SYSTEM_KEY, system)
  }

  const toggleUnitSystem = () => {
    const newSystem = unitSystem === "metric" ? "imperial" : "metric"
    setUnitSystem(newSystem)
  }

  return {
    unitSystem,
    setUnitSystem,
    toggleUnitSystem,
    isLoaded,
  }
}
