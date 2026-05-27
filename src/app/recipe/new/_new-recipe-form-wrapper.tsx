"use client"

import dynamic from "next/dynamic"

const NewRecipeForm = dynamic(
  () => import("./_new-recipe-form"),
  { ssr: false },
)

export function NewRecipeFormWrapper() {
  return <NewRecipeForm />
}
