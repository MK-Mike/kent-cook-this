"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Plus, Settings, Tag, UtensilsCrossed } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SearchForm } from "./search-form"
import { mockRecipes } from "@/lib/mock-data"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./theme-toggle"
import { UnitSystemToggle } from "./unit-system-toggle"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const uniqueTags = React.useMemo(() => {
    const tags = new Set<string>()
    mockRecipes.forEach((recipe) => {
      recipe.tags?.forEach((tag) => tags.add(tag.toLowerCase()))
    })
    return Array.from(tags).sort()
  }, [])

  const uniqueCategories = React.useMemo(() => {
    // For now, let's just use tags as categories for demonstration
    // In a real app, categories might be distinct from tags
    return uniqueTags
  }, [uniqueTags])

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/"}>
                  <Link href="/">
                    <Home />
                    <span>Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/recipe/new"}>
                  <Link href="/recipe/new">
                    <Plus />
                    <span>Add New Recipe</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70">
                  <UtensilsCrossed className="mr-2 h-4 w-4" />
                  Categories
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </Button>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {uniqueCategories.map((category) => (
                    <SidebarMenuItem key={category}>
                      <SidebarMenuButton asChild isActive={pathname === `/category/${category}`}>
                        <Link href={`/category/${category}`}>
                          <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start text-sidebar-foreground/70">
                  <Tag className="mr-2 h-4 w-4" />
                  Tags
                  <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </Button>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {uniqueTags.map((tag) => (
                    <SidebarMenuItem key={tag}>
                      <SidebarMenuButton asChild isActive={pathname === `/tag/${tag}`}>
                        <Link href={`/tag/${tag}`}>
                          <span>{tag.charAt(0).toUpperCase() + tag.slice(1)}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/settings"}>
                  <Link href="/settings">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <ThemeToggle />
                <UnitSystemToggle />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
