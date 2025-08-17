"use client"

import * as React from "react"
import Image from "next/image"
import { notFound, useParams } from "next/navigation"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"

import { mockRecipes } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ScaledIngredientDisplay } from "@/components/scaled-ingredient-display"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CookPage() {
  const params = useParams()
  const recipeId = params.id as string
  const recipe = mockRecipes.find((r) => r.id === recipeId)

  const [currentStepIndex, setCurrentStepIndex] = React.useState(0)
  const [showIngredients, setShowIngredients] = React.useState(false)

  if (!recipe) {
    notFound()
  }

  const currentStep = recipe.steps[currentStepIndex]
  const progress = ((currentStepIndex + 1) / recipe.steps.length) * 100

  const handleNext = () => {
    if (currentStepIndex < recipe.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1)
    }
  }

  const handleKeyDown = React.useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        handleNext()
      } else if (event.key === "ArrowLeft") {
        handlePrevious()
      }
    },
    [], // Removed handleNext and handlePrevious from dependencies
  )

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b p-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <X className="h-6 w-6" />
          <span className="sr-only">Exit cooking mode</span>
        </Button>
        <h1 className="text-xl font-bold">{recipe.name}</h1>
        <Dialog open={showIngredients} onOpenChange={setShowIngredients}>
          <DialogTrigger asChild>
            <Button variant="outline">Ingredients</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ingredients for {recipe.name}</DialogTitle>
            </DialogHeader>
            <ScaledIngredientDisplay recipe={recipe} />
          </DialogContent>
        </Dialog>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-3xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Step {currentStepIndex + 1} of {recipe.steps.length}
            </CardTitle>
            <Progress value={progress} className="mt-2 h-2" />
          </CardHeader>
          <CardContent className="relative min-h-[300px] p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStepIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 p-6"
              >
                {currentStep.image && (
                  <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
                    <Image
                      src={currentStep.image || "/placeholder.svg"}
                      alt={`Step ${currentStepIndex + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <ScrollArea className="h-full max-h-[calc(100vh-350px)] pr-4">
                  <p className="text-lg leading-relaxed text-muted-foreground">{currentStep.description}</p>
                </ScrollArea>
              </motion.div>
            </AnimatePresence>
          </CardContent>
          <CardFooter className="flex justify-between p-6">
            <Button onClick={handlePrevious} disabled={currentStepIndex === 0}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button onClick={handleNext} disabled={currentStepIndex === recipe.steps.length - 1}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
