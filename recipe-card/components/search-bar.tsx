"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export function SearchBar({ onSearch, placeholder = "Search recipes..." }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    onSearch?.(value)
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex w-full max-w-sm items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="text" placeholder={placeholder} value={query} onChange={handleInputChange} className="pl-10" />
      </div>
    </form>
  )
}
