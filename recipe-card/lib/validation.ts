import { z } from "zod"
import { recipeFormSchema } from "./schema"

export function validateRecipeForm(data: z.infer<typeof recipeFormSchema>) {
  try {
    recipeFormSchema.parse(data)
    return { success: true, errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors }
    }
    return { success: false, errors: { general: ["An unknown error occurred."] } }
  }
}
