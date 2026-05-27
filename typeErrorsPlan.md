# TypeScript Type Error Analysis & Plan

**Generated:** 2026-05-20
**Total errors:** ~422 (across main project + recipe-card)

---

## Overview

This project has two TypeScript sub-projects:

| Project | Error Count | Severity |
|---|---|---|
| Main (`src/`) | 3 | Low |
| Recipe Card (`recipe-card/`) | ~419 | High |

The vast majority of recipe-card errors (TS2307) are caused by **uninstalled dependencies** — `recipe-card/package.json` lists its own dependencies but `bun install` was only run at the root. Beyond that, there are ~60+ genuine type bugs.

---

## Main Project (`src/`)

### 1. Duplicate `createTable` export
**Files:** `src/server/db/schema/index.ts`

**Error:** TS2308 — `createTable` is exported from all four schema files (`userData`, `recipeData`, `ingredientData`, `categoryData`) via `export *` but only defined in one.

**Fix:** Re-export `createTable` explicitly from a single module instead of using `export *` on all four:

```ts
export { createTable } from "./userData";
export * from "./recipeData";
export * from "./ingredientData";
export * from "./categoryData";
```

---

## Recipe Card Project (`recipe-card/`)

### Category A: Missing Dependencies (TS2307) — ~200+ errors

**Cause:** `recipe-card/package.json` dependencies were never installed (root `bun install` only covers the main project).

**Files affected:** Every file that imports:
- Radix UI components (`@radix-ui/react-*`)
- `@/components/ui/*` (local UI shadcn registry)
- `@/lib/*`, `@/hooks/*`, `@/components/*` (local modules resolving via `@/` path alias)
- Third-party: `react-hook-form`, `next-themes`, `sonner`, `framer-motion`, `lucide-react`, `cmdk`, `input-otp`, `react-day-picker`, `recharts`, `embla-carousel-react`, `vaul`, `react-resizable-panels`

**Fix:** Either:
- Install deps in `recipe-card/`: `cd recipe-card && bun install`
- Or merge `recipe-card/dependencies` into root `package.json` and remove `recipe-card/package.json`

---

### Category B: Implicit `any` Parameters (TS7006, TS7031) — ~60 errors

**Cause:** Callback parameters and destructured bindings lack type annotations.

**Files affected (representative):** `page.tsx`, `cook/page.tsx`, `recipe/new/page.tsx`, `components/recipe-card.tsx`, `components/scaled-ingredient-display.tsx`, `components/sidebar.tsx`, `components/search-form.tsx`, `components/enhanced-ingredient-form.tsx`, `components/enhanced-steps-form.tsx`, `components/app-sidebar.tsx`, `sidebar.tsx`, `components/ui/sheet.tsx`, `components/ui/toaster.tsx`, `components/ui/use-toast.ts`, `hooks/use-toast.ts`

**Patterns:**
```ts
// ❌ Bad
.map((recipe) => ...)
// ✅ Fix
.map((recipe: Recipe) => ...)
```

```tsx
// ❌ Bad
({ field }) => ...
// ✅ Fix
({ field }: { field: ... }) => ...
```

**Fix:** Add explicit type annotations to all callback parameters throughout recipe-card.

---

### Category C: Wrong Property Names / Missing Properties (TS2339, TS2551)

#### C1. `prepTimeMins`/`cookTimeMins` → `prepTimeMinutes`/`cookTimeMinutes`
**Files:**
- `recipe-card/lib/types.ts:185` — wrong property used in template literal
- `recipe-card/lib/recipe-store.ts:149-150` — wrong properties in object literal

```ts
// ❌
time: `${(recipe.prepTimeMins || 0) + (recipe.cookTimeMins || 0)} min`
// ✅
time: `${(recipe.prepTimeMinutes || 0) + (recipe.cookTimeMinutes || 0)} min`
```

#### C2. `avatarUrl` → `avatar`
**File:** `recipe-card/lib/recipe-store.ts:108`

```ts
// ❌
author: { name: "New User", avatarUrl: "/avatars/alex.jpg" }
// ✅
author: { name: "New User", avatar: "/avatars/alex.jpg" }
```

#### C3. `Unit` type lacks conversion properties
**File:** `recipe-card/lib/unit-scaler.ts`

The `Unit` type (imported from `./types`) has properties `name`, `abbreviation`, `type`, `factorToBase`, `isMetric`, `subUnitId`, `subUnitScale` — it does NOT have `gPerUnit`, `mlPerUnit`, or `unitsPerUnit`. These belong to the `UnitConversion` interface (also defined in `./types.ts`).

**Fix:** Either:
- Change import to use `UnitConversion` instead of `Unit` in `unit-scaler.ts`
- Or add the conversion properties to the `Unit` interface

#### C4. `Recipe` lacks `title`, `slug`, `imageUrl`
**File:** `recipe-card/lib/recipe-store.ts:73,145-150`

The `Recipe` type in `types.ts` uses `name` (not `title`), has `image` (not `imageUrl`), and has no `slug` property. The `addRecipe` function also uses a complex `Omit<...>` type that omits these.

**Fix:** Either:
- Update `Recipe` type in `types.ts` to include `title`, `slug`, `imageUrl` (and deprecate conflicting properties)
- Or align `recipe-store.ts` to use the existing `Recipe` property names

#### C5. `SheetContentProps` lacks `className`/`children`
**File:** `recipe-card/components/ui/sheet.tsx:59`

The Radix UI `DialogContentProps` might have changed in the installed version.

**Fix:** Type the props explicitly with `className?: string` and `children?: React.ReactNode`.

---

### Category D: Type Assignability Errors (TS2322)

#### D1. `Author | undefined` not assignable to `Author`
**File:** `recipe-card/lib/mock-data.ts` (lines 760, 804, 859, 909, 966, 1014)

`mockAuthors.find()` can return `undefined`. Use non-null assertion (`!`) or a fallback.

#### D2. `User | undefined` not assignable to `Author`
**File:** `recipe-card/lib/recipe-store.ts:160`

`User` and `Author` are different types. The `mockUsers[0]` is a `User` but `recipe.author` expects `Author`.

#### D3. `Category | null` not assignable to `Category | undefined`
**File:** `recipe-card/lib/recipe-store.ts:162`

`subcategory` field on `Recipe` expects `Category | undefined`, but the code provides `null`.

#### D4. `unit: string | undefined` not assignable to `string`
**File:** `recipe-card/lib/recipe-store.ts:197-200`

The `.abbreviation` property lookup can return undefined.

#### D5. `IngredientDensity.createdAt` has optional `createdAt`
**File:** `recipe-card/lib/types.ts:137`

```ts
// type expects: createdAt: Date
// code returns: createdAt?: Date | undefined
```
The return from `find()` is typed with `createdAt` as optional, but `IngredientDensity` requires it.

---

### Category E: Possibly Undefined (TS18048)

#### E1. `recipe.tags` is possibly undefined
**Files:**
- `recipe-card/lib/recipe-store.ts:75,88`
- `recipe-card/lib/types.ts:175-177` (`author` is possibly undefined)

**Fix:** Use optional chaining (`recipe.tags?.some(...)`) or add null checks.

---

### Category F: Circular / Self-Referencing Types (TS7022, TS7024)

**Files:** `recipe-card/lib/schema.ts:30,35,65,72`

The `categories` and `units` Drizzle table definitions reference themselves (e.g., `categories.parentId -> categories.id`), causing implicit `any` types.

**Fix:** Add explicit type annotations:
```ts
export const categories = pgTable("categories", { ... })
```

But the `parentId` self-reference is a Drizzle ORM issue — may need the module-level type annotation.

---

### Category G: Other Errors

| File | Line | Error | Fix |
|---|---|---|---|
| `lib/types.ts` | 144 | Comparison of `number` and `string` (TS2367) | `includes()` on numbers — cast to string or use `===` |
| `lib/recipe-store.ts` | 132 | `number | undefined` for `parseInt` arg | Add nullish coalescing: `parseInt(r.id ?? "0")` |
| `lib/recipe-store.ts` | 216 | `recipeId: number` vs expected `recipeId: string` | Convert to string or align types |
| `components/ui/pagination.tsx` | 68,84 | `size` specified twice (TS2783) | Rename the conflicting property |
| `sidebar.tsx` | 62,83 | `isCurrent` doesn't exist on breadcrumb type | Add to the type or use a different approach |
| `tailwind.config.ts` | 6 | `["class"]` needs `["class", string]` | Update darkMode to `["class", "class"]` |
| `app/layout.tsx` | 25 | `cookies()` returns Promise (Next.js 15+) | Await the cookies promise |
| `components/ui/input-otp.tsx` | 38 | `inputOTPContext` is `unknown` | Add explicit type annotation for context |
| `components/ui/sidebar.tsx` | 5 | `VariantProps` needs type-only import | Change to `import type { VariantProps }` |

---

## Recommended Priority Order

1. **Install recipe-card dependencies** — eliminates ~200 errors (Category A)
2. **Fix `src/server/db/schema/index.ts`** — eliminates 3 errors (main project)
3. **Fix wrong property names** (Category C) — ~20 real logic bugs
4. **Fix type assignability** (Category D) — ~10 errors
5. **Fix possibly undefined** (Category E) — ~5 errors, potential runtime bugs
6. **Fix circular types** (Category F) — 4 errors
7. **Add implicit `any` annotations** (Category B) — ~60 errors, mechanical work
8. **Fix remaining outliers** (Category G) — ~12 miscellaneous errors
