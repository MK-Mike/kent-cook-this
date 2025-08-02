"use client";
import { api } from "~/trpc/react";

export function Ingredient() {
  const [ingredients] = api.ingredients.getAll.useSuspenseQuery();

  return (
    <div className="w-full max-w-xs">
      {ingredients ? (
        ingredients.map((ingredient) => (
          <div key={ingredient.id}>
            <p>{ingredient.name}</p>
          </div>
        ))
      ) : (
        <p>No Ingredients</p>
      )}
    </div>
  );
}
