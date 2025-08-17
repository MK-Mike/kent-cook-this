"use client"

import React from "react"

import { AppSidebar } from "./components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"
import { useMemo } from "react"
import { mockRecipes } from "@/lib/mock-data"

export default function SidebarLayout() {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const crumbs = [{ name: "Home", href: "/" }]

    if (pathSegments.length > 0) {
      let currentPath = ""
      pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`
        let name = segment.replace(/-/g, " ") // Replace hyphens for display

        // Special handling for recipe ID, category, and tag slugs
        if (segment === "recipe" && pathSegments[index + 1]) {
          const recipeId = pathSegments[index + 1]
          const recipe = mockRecipes.find((r) => r.id === recipeId)
          if (recipe) {
            name = recipe.name
            crumbs.push({ name: "Recipe", href: "/recipe" }) // Add a generic 'Recipe' crumb
            crumbs.push({ name, href: currentPath })
            return // Skip next segment as it's part of the recipe ID
          }
        } else if (segment === "category" && pathSegments[index + 1]) {
          name = `Category: ${decodeURIComponent(pathSegments[index + 1]).replace(/-/g, " ")}`
          crumbs.push({ name, href: currentPath })
          return
        } else if (segment === "tag" && pathSegments[index + 1]) {
          name = `Tag: ${decodeURIComponent(pathSegments[index + 1]).replace(/-/g, " ")}`
          crumbs.push({ name, href: currentPath })
          return
        } else if (segment === "cook") {
          name = "Cook Mode"
        } else if (segment === "new") {
          name = "New Recipe"
        } else if (segment === "search") {
          name = "Search"
        } else if (segment === "settings") {
          name = "Settings"
        }

        if (index === pathSegments.length - 1) {
          crumbs.push({ name, href: currentPath, isCurrent: true })
        } else {
          crumbs.push({ name, href: currentPath })
        }
      })
    }
    return crumbs
  }, [pathname])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.href}>
                  <BreadcrumbItem>
                    {crumb.isCurrent ? (
                      <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>{crumb.name}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
