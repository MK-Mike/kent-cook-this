import type { RouterOutputs } from "~/trpc/react";
import type { api } from "~/trpc/server";
export type Recipe = RouterOutputs["recipes"]["getById"];
// export type Recipe = Awaited<ReturnType<typeof api.recipes.getById>>;

export type Category = RouterOutputs["categories"]["getById"];
export type Tag = RouterOutputs["tags"]["getById"];
