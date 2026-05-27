"use client"

import { SidebarTrigger } from "~/components/ui/sidebar"

export function PageHeader() {
  return (
    <header className="flex h-12 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <span className="text-lg font-semibold">Family Recipes</span>
    </header>
  )
}
