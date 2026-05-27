# Migration Plan: recipe-card → src/ (T3 Stack)

## Overview

The `recipe-card/` directory is a v0.dev mockup that needs to be migrated into the main T3 Stack project at `src/`. The main project uses **tRPC + Drizzle ORM + SQLite** for data, while `recipe-card` uses **mock data** with a PostgreSQL schema. This plan covers migrating all pages, components, hooks, and assets while adapting them to the T3 stack's architecture.

---

## Project Differences (Key Constraints)

| Aspect | recipe-card (source) | src/ (target) |
|--------|---------------------|---------------|
| **Path alias** | `@/` → `./*` | `~/` → `./src/*` |
| **CSS framework** | Tailwind v3 + `tailwindcss-animate` | Tailwind v4 + `tw-animate-css` |
| **Data layer** | Mock data (`mock-data.ts`, `recipe-store.ts`) | tRPC + Drizzle ORM + SQLite |
| **Types** | Hand-written interfaces (`Recipe`, `Author`, etc.) | tRPC `RouterOutputs`-derived types |
| **Schema** | PostgreSQL (`pgTable`, `serial`) | SQLite (`sqliteTableCreator`, `integer`) |
| **UI components** | Older shadcn style (class-variant, no data-slot) | Shadcn v4 style (`data-slot`, `cva`) |
| **Auth** | None | None yet (Clerk planned in ToDo.md) |

---

## Migration Phases

### Phase 0 — Prerequisites / Cleanup

**0.1 — Fix `components.json`**

File: `components.json` at project root.

The current config points to `recipe-card/app/globals.css` instead of the main project's CSS. Fix it:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "~/components",
    "utils": "~/lib/utils",
    "ui": "~/components/ui",
    "lib": "~/lib",
    "hooks": "~/hooks"
  },
  "iconLibrary": "lucide"
}
```

**0.2 — Fix duplicate `createTable` export**

File: `src/server/db/schema/index.ts`
The `export *` from all four schema files causes TS2308 because `createTable` is exported from each. Fix by re-exporting `createTable` from one module explicitly:

```ts
export { createTable } from "./userData";
export * from "./recipeData";
export * from "./ingredientData";
export * from "./categoryData";
```

**0.3 — Copy placeholder assets**

Copy from `recipe-card/public/` to the main `public/`:

```
cp recipe-card/public/placeholder.svg public/
cp recipe-card/public/placeholder.jpg public/
cp recipe-card/public/placeholder-user.jpg public/
cp recipe-card/public/placeholder-logo.png public/
cp recipe-card/public/placeholder-logo.svg public/
```

Create image/avatar directories so paths don't 404:

```
mkdir -p public/images
mkdir -p public/avatars
mkdir -p public/images/steps
```

Since we don't have actual recipe photos, create a simple fallback approach: update the code to reference `/placeholder.svg` when images are missing, rather than needing actual JPGs.

---

### Phase 1 — Add Missing Shadcn UI Components

**Do NOT install radix packages directly.** Use `npx shadcn@latest add` which handles dependencies, installs Radix packages, and generates the v4-styled components automatically.

**1.1 — Fix components.json first** (Phase 0.1) so shadcn CLI generates components with correct paths.

**1.2 — Components already in `src/components/ui/`** (v4 style, no action needed):
| Component | Files |
|-----------|-------|
| `avatar` | `src/components/ui/avatar.tsx` |
| `badge` | `src/components/ui/badge.tsx` |
| `button` | `src/components/ui/button.tsx` |
| `card` | `src/components/ui/card.tsx` |
| `dropdown-menu` | `src/components/ui/dropdown-menu.tsx` |
| `input` | `src/components/ui/input.tsx` |
| `skeleton` | `src/components/ui/skeleton.tsx` |
| `slider` | `src/components/ui/slider.tsx` |

**1.3 — Components to add via `npx shadcn@latest add`**

Run these commands in order from most-used to least-used:

```bash
# Priority 1 — Core page components
npx shadcn@latest add select       # 6 uses
npx shadcn@latest add label        # 6 uses
npx shadcn@latest add separator    # 5 uses
npx shadcn@latest add textarea     # 4 uses
npx shadcn@latest add form         # 4 uses (needs react-hook-form + @hookform/resolvers)
npx shadcn@latest add dialog       # 2 uses
npx shadcn@latest add sonner       # 1 use (toast system)
npx shadcn@latest add scroll-area  # 1 use
npx shadcn@latest add progress     # 1 use

# Priority 2 — Sidebar (complex — adds multiple files)
npx shadcn@latest add sidebar      # 4 uses (adds sheet, tooltip, collapsible, breadcrumb as dependencies)
# Note: `sidebar` will prompt to add its dependencies. Accept all.
# This single command adds: sheet.tsx, tooltip.tsx, collapsible.tsx, breadcrumb.tsx,
# plus the sidebar.tsx itself. Confirmed by checking import counts:
#   sidebar 4, sheet 2, tooltip 2, collapsible 1, breadcrumb 1

# Priority 3 — Settings / Forms
npx shadcn@latest add switch       # 1 use
npx shadcn@latest add toggle       # 1 use

# Priority 4 — Optional (for toast system)
npx shadcn@latest add toast        # 3 uses in older recipe-card components
```

**Dependency note:** `form` requires `react-hook-form` and `@hookform/resolvers`. Add them first:
```bash
bun add react-hook-form @hookform/resolvers
```

**Verification:** After adding all components, the import list from recipe-card should be fully covered:

| Import | Needed count | Status |
|--------|-------------|--------|
| `button` | 19 | ✅ Already in src |
| `input` | 9 | ✅ Already in src |
| `card` | 9 | ✅ Already in src |
| `skeleton` | 6 | ✅ Already in src |
| `select` | 6 | ➕ Add |
| `label` | 6 | ➕ Add |
| `separator` | 5 | ➕ Add |
| `textarea` | 4 | ➕ Add |
| `sidebar` | 4 | ➕ Add (includes breadcrumb, sheet, tooltip, collapsible) |
| `form` | 4 | ➕ Add |
| `dropdown-menu` | 4 | ✅ Already in src |
| `toast` | 3 | ➕ Optional |
| `badge` | 3 | ✅ Already in src |
| `avatar` | 3 | ✅ Already in src |
| `tooltip` | 2 | ➕ Added by sidebar |
| `sheet` | 2 | ➕ Added by sidebar |
| `dialog` | 2 | ➕ Add |
| `toggle` | 1 | ➕ Add |
| `switch` | 1 | ➕ Add |
| `sonner` | 1 | ➕ Add |
| `slider` | 1 | ✅ Already in src |
| `scroll-area` | 1 | ➕ Add |
| `progress` | 1 | ➕ Add |
| `collapsible` | 1 | ➕ Added by sidebar |
| `breadcrumb` | 1 | ➕ Added by sidebar |

---

### Phase 2 — Migrate Hooks

Copy the three hooks from recipe-card, fix imports (`@/` → `~/`).

```bash
mkdir -p src/hooks
```

| Hook | Source | Target |
|------|--------|--------|
| `use-mobile.tsx` | `recipe-card/hooks/use-mobile.tsx` | `src/hooks/use-mobile.ts` |
| `use-unit-system.ts` | `recipe-card/hooks/use-unit-system.ts` | `src/hooks/use-unit-system.ts` |
| `use-toast.ts` | `recipe-card/hooks/use-toast.ts` | `src/hooks/use-toast.ts` (only if toast system is used) |

**Import fix:** No UI imports in these hooks — only `react` imports. Straight copy.

---

### Phase 3 — Migrate Utility Functions

| Dependency | Source | Action |
|-----------|--------|--------|
| `cn()` utility | Already at `src/lib/utils.ts` | Already done ✓ |
| `unit-scaler.ts` | `recipe-card/lib/unit-scaler.ts` | Copy to `src/lib/unit-scaler.ts`. Adapt to use main project's `Unit` type from Drizzle schema instead of recipe-card's `Unit` interface. The Drizzle `Unit` type has `factorToBase`, `type` ("mass"\|"volume"), but not `gPerUnit`/`mlPerUnit` — these must be computed. |
| `conversion-types.ts` | Extract from `recipe-card/lib/types.ts` | Create `src/lib/conversion-types.ts` with only the conversion-related types (`UnitConversion`, `IngredientDensityData`, `UnitType` enum) and helper functions (`getAllUnitsForConversion`, `getIngredientDensityData`). Do NOT copy the mock data accessor functions. |

---

### Phase 4 — Migrate Custom Components

Copy from `recipe-card/components/`, adapting imports (`@/` → `~/`) and replacing mock data with tRPC.

**4.1 — `recipe-card.tsx`** → `src/app/_components/recipe-card.tsx`

Already exists in src and adapted for tRPC types. The existing one uses:
- `recipe.imageUrl` (correct for schema)
- `recipe.title` (correct for schema)
- `recipe.author.avatarUrl` (correct for schema)
- `recipe.author.name` (correct for schema)

Just needs visual polish to match the recipe-card version's gradients and hover effects.

**4.2 — `search-bar.tsx`** → `src/app/_components/search-bar.tsx`
- Already exists ✓

**4.3 — `recipe-filters.tsx`** → `src/app/_components/recipe-filters.tsx`
- Already exists ✓

**4.4 — `scaled-ingredient-display.tsx`** → `src/components/scaled-ingredient-display.tsx`

Adapt:
- `@/lib/types` → `~/lib/conversion-types`
- `@/lib/unit-scaler` → `~/lib/unit-scaler`
- `@/hooks/use-unit-system` → `~/hooks/use-unit-system`
- `@/components/ui/...` → `~/components/ui/...`
- `Recipe` type: create a local props interface for the data shape needed, or derive from `RouterOutputs["recipes"]["getById"]`

**4.5 — `app-sidebar.tsx`** → `src/components/app-sidebar.tsx`

Major rewrite:
- Replace `mockRecipes` with tRPC data: use `api.categories.getAll()` and `api.tags.getAll()` to populate category/tag lists
- Change imports: `@/components/ui/...` → `~/components/ui/...`
- Change `@/components/search-form` → `~/components/search-form`
- Change `@/components/theme-toggle` → `~/components/theme-toggle`
- Change `@/components/unit-system-toggle` → `~/components/unit-system-toggle`

**4.6 — `search-form.tsx`** → `src/components/search-form.tsx`
- Adapt imports (`@/` → `~/`)
- Already uses `useRouter` from `next/navigation` — compatible

**4.7 — `theme-provider.tsx`** → `src/components/theme-provider.tsx`
- Straight copy, fix imports

**4.8 — `theme-toggle.tsx`** → `src/components/theme-toggle.tsx`
- Straight copy, fix imports

**4.9 — `unit-system-toggle.tsx`** → `src/components/unit-system-toggle.tsx`
- Straight copy, fix imports

**4.10 — `enhanced-ingredient-form.tsx`** → `src/components/enhanced-ingredient-form.tsx`
- Used by new recipe page (react-hook-form pattern)
- Adapt: `@/lib/types` → `~/lib/conversion-types` for unit lists
- Data: instead of `getAllUnits()` from mock data, use tRPC `api.units.getAll()` if available, or include a unit list
- `@/lib/schema` → `~/lib/schemas/recipe-form` (new file)

**4.11 — `enhanced-steps-form.tsx`** → `src/components/enhanced-steps-form.tsx`
- Same pattern as ingredient form, just simpler

**4.12 — `dynamic-ingredient-form.tsx`** → (optional) Only if the non-hook-form pattern is needed
**4.13 — `dynamic-steps-form.tsx`** → (optional) Same

**4.14 — `sidebar.tsx`** (root level recipe-card) → Do NOT migrate. This is an alternate layout component. The `app-sidebar.tsx` is the one integrated with the sidebar system.

---

### Phase 5 — Create Missing Route Pages

Create route directories and page files in `src/app/`. Each page follows this pattern:

```
src/app/<route>/page.tsx   ← server component using tRPC
src/app/<route>/loading.tsx  ← loading state
```

**5.1 — Recipe Detail Page**
```
src/app/recipe/[id]/page.tsx
src/app/recipe/[id]/loading.tsx
```
- Data: `api.recipes.getById({ id: Number(params.id) })`
- If null, call `notFound()`
- Template: `recipe-card/app/recipe/[id]/page.tsx`
- Key property mapping (tRPC type → display):
  - `title` → recipe name
  - `imageUrl` → main image (fallback to `/placeholder.svg`)
  - `ingredients[n].ingredient.name` → ingredient name
  - `ingredients[n].quantity` → quantity
  - `ingredients[n].unit?.abbreviation` → unit
  - `steps` (ordered by `position`) → preparation steps
  - `recipeTags[n].tag.name` → tag badges
  - `author.name` + `author.avatarUrl` → author display

**5.2 — Cook Mode Page**
```
src/app/recipe/[id]/cook/page.tsx
src/app/recipe/[id]/cook/loading.tsx
```
- Same data as detail page
- Template: `recipe-card/app/recipe/[id]/cook/page.tsx`
- Note: recipe-card version uses `framer-motion` for animations. Either install it (`bun add framer-motion`) or remove the animation wrapper.
- Uses `Progress`, `ScrollArea`, `Dialog`, `Card`, `Button` — all added in Phase 1
- Keyboard navigation (arrow keys) — keep this

**5.3 — New Recipe Page**
```
src/app/recipe/new/page.tsx
```
- Template: `recipe-card/app/recipe/new/page.tsx`
- Replace mock data with tRPC mutations:
  - `recipeStore.add()` → `api.recipes.createWithDetails.mutateAsync()`
  - `mockAuthors` → use current user (eventually Clerk auth). For now, hardcode `authorId: 1`
  - `generateId()` → server auto-increment handles this
- Form validation: use `zod` schemas matching `createRecipeWithDetailsSchema` in `src/server/api/routers/recipes.ts`
- Uses: `react-hook-form`, `@hookform/resolvers`, `sonner` toast

**5.4 — Search Results Page**
```
src/app/search/page.tsx
src/app/search/loading.tsx
```
- Template: `recipe-card/app/search/page.tsx`
- Data: `api.recipes.getFiltered({ name: searchParams.q })` instead of `mockRecipes.filter()`
- The main project home page already does URL-based search — reuse that pattern

**5.5 — Category Page**
```
src/app/category/[slug]/page.tsx
src/app/category/[slug]/loading.tsx
```
- Template: `recipe-card/app/category/[slug]/page.tsx`
- Data strategy: 
  - Look up category by slug: `api.categories.getAll()` and find matching slug
  - Filter recipes: `api.recipes.getFiltered({ categories: [categorySlug] })` — **but** this filters by category `name`, not `slug`. Need to either:
    a) Add a `getByCategorySlug` tRPC procedure that joins on `categories.slug`
    b) Or fetch all categories, match slug to name, then filter by name
- Tag filter sidebar: `api.tags.getByType()` for each tag type

**5.6 — Tag Page**
```
src/app/tag/[slug]/page.tsx
src/app/tag/[slug]/loading.tsx
```
- Template: `recipe-card/app/tag/[slug]/page.tsx`
- Same pattern as category page but with tags
- `api.recipes.getFiltered({ tags: [tagSlug] })` — same slug vs name issue

**5.7 — Settings Page**
```
src/app/settings/page.tsx
```
- Template: `recipe-card/app/settings/page.tsx`
- Fully client-side, no data fetching needed
- Uses: `ThemeToggle`, `UnitSystemToggle`, `Switch`, `Select`, `Input`, `Textarea`, `Card`, `Separator`

---

### Phase 6 — Update Root Layout

File: `src/app/layout.tsx`

Current layout is minimal (Geist font + TRPCReactProvider). Update it to include sidebar, theme, and toaster, modeled after `recipe-card/app/layout.tsx`:

```tsx
// src/app/layout.tsx
import "~/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { Toaster } from "~/components/ui/sonner";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Family Recipes",
  description: "Delicious meals, passed down through generations.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <html lang="en" className={`${geist.variable}`} suppressHydrationWarning>
      <body>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSidebar />
              <main className="flex-1 overflow-hidden">{children}</main>
            </SidebarProvider>
            <Toaster />
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
```

**Important considerations:**
- `AppSidebar` will need to fetch categories and tags. Since it's in a client component (sidebar needs interactivity), fetch data client-side via `api.categories.getAll()` and `api.tags.getAll()` using the tRPC React hooks.
- Or make the sidebar a server component that receives data as props from the layout.

---

### Phase 7 — tRPC Router Enhancements

Some procedures needed by the migrated pages are missing:

| Need | Status | Action |
|------|--------|--------|
| Filter by category **slug** | `getByCategory` uses category `name` | Add a `getByCategorySlug` procedure that joins `recipeCategories` → `categories` and matches on `categories.slug` |
| Filter by tag **slug** | `getByTag` uses tag `name` | Add a `getByTagSlug` procedure that joins `recipeTags` → `tags` and matches on `tags.slug` |
| Fetch all ingredients | `ingredientRouter` exists — check for `getAll` | Add `getAll` procedure if missing |
| Fetch all units | No unit router exists | Add `unitRouter` with `getAll` procedure |
| Fetch categories by parent | `getRootCategories` exists | Good ✓ |
| Fetch tags by type | `tagRouter.getByType` exists | Good ✓ |

**Add `src/server/api/routers/units.ts`** if it doesn't exist:
```ts
// Similar to other routers, query all units
export const unitRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.units.findMany();
  }),
});
```

Register it in `src/server/api/root.ts`.

**Add `getByCategorySlug` and `getByTagSlug`** to the recipes router or the category/tag routers.

---

### Phase 8 — Form Validation Schemas

Create `src/lib/schemas/recipe-form.ts` with Zod schemas that mirror the tRPC `createRecipeWithDetailsSchema`:

```ts
import { z } from "zod";

export const ingredientSchema = z.object({
  ingredientId: z.number(),
  quantity: z.number().nullable(),
  unitId: z.number().nullable(),
});

export const stepSchema = z.object({
  position: z.number(),
  title: z.string().optional(),
  description: z.string().min(1, "Step description is required"),
  imageUrl: z.string().optional(),
  ingredientIds: z.array(z.number()).optional(),
});

export const recipeFormSchema = z.object({
  title: z.string().min(1, "Recipe name is required"),
  authorId: z.number(),
  description: z.string().optional(),
  prepTimeMins: z.number().positive().optional(),
  cookTimeMins: z.number().positive().optional(),
  servings: z.number().positive().optional(),
  imageUrl: z.string().optional(),
  ingredients: z.array(ingredientSchema).min(1, "At least one ingredient is required"),
  steps: z.array(stepSchema).min(1, "At least one step is required"),
  tagIds: z.array(z.number()),
  categoryIds: z.array(z.number()),
});

export type RecipeFormValues = z.infer<typeof recipeFormSchema>;
```

This lives in `src/` and aligns with the tRPC server-side schema, not the recipe-card's mock-based schema.

---

### Phase 9 — CSS / Styling

The main project uses **Tailwind v4** (`@import "tailwindcss"`, `@theme` directives). The recipe-card uses **Tailwind v3** (`@tailwind base`, `tailwind.config.ts`).

**Do NOT** copy `recipe-card/app/globals.css`. Instead:

1. Ensure `src/styles/globals.css` has all the CSS variables needed by shadcn components. It already defines:
   - `--background`, `--foreground`, `--card`, `--card-foreground`, etc. (light mode)
2. Add the **dark mode** CSS variables if missing (check the full globals.css for `.dark` class variables)
3. Add **sidebar-specific CSS variables** after adding the sidebar component (shadcn will add these when you run `npx shadcn add sidebar`)
4. Ensure `@import "tw-animate-css"` is present (already is)

---

### Phase 10 — Type Definitions

The main project's types at `src/lib/types.ts` are tRPC-derived:
```ts
export type Recipe = RouterOutputs["recipes"]["getById"];
export type Category = RouterOutputs["categories"]["getById"];
export type Tag = RouterOutputs["tags"]["getById"];
```

**Do NOT copy** `recipe-card/lib/types.ts` — it conflicts with the tRPC pattern.

Instead, create **view-specific interfaces** in the components that need them:

```ts
// src/components/scaled-ingredient-display.tsx
interface ScaledIngredientItem {
  name: string;
  quantity: number;
  unitAbbreviation: string | null;
  notes?: string | null;
}

interface ScaledIngredientDisplayProps {
  recipe: {
    id: number;
    title: string;
    servings: number;
    ingredients: ScaledIngredientItem[];
  };
}
```

This keeps components loosely coupled from the exact tRPC return shape.

---

## Migration Order (Recommended Sequence)

```
Phase 0: Fix components.json, fix duplicate createTable, copy placeholder assets
    |
    v
Phase 1: npx shadcn@latest add (select, label, separator, textarea, form, dialog,
         sonner, scroll-area, progress, sidebar, switch, toggle)
    |
    v
Phase 2: Copy hooks (use-mobile, use-unit-system)
    |
    v
Phase 3: Create conversion-types.ts, copy unit-scaler.ts
    |
    v
Phase 4: Copy custom components (theme-provider, theme-toggle, unit-system-toggle,
         search-form, scaled-ingredient-display)
    |
    v
Phase 6: Update root layout with sidebar + theme + toaster
    |
    v
Phase 5.1: Recipe detail page (page.tsx + loading.tsx)
    |
    v
Phase 5.2: Cook mode page
    |
    v
Phase 5.7: Settings page
    |
    v
Phase 5.4: Search page
    |
    v
Phase 7: Add tRPC procedures (getByCategorySlug, getByTagSlug, unitRouter)
    |
    v
Phase 5.5-5.6: Category & Tag pages
    |
    v
Phase 4.4: app-sidebar.tsx (needs tRPC data + all UI components first)
    |
    v
Phase 4.10-4.11: Enhanced form components
    |
    v
Phase 8: Form validation schemas
    |
    v
Phase 5.3: New recipe page (most complex)
    |
    v
Phase 9-10: CSS polish + type refinements
```

---

## Quick Wins (Do These First)

```bash
# Step 1: Fix components.json so shadcn CLI works correctly
# (Edit components.json — change css path to src/styles/globals.css)

# Step 2: Copy placeholder assets
mkdir -p public/images public/avatars public/images/steps
cp recipe-card/public/placeholder.svg public/
cp recipe-card/public/placeholder.jpg public/
cp recipe-card/public/placeholder-user.jpg public/

# Step 3: Fix duplicate createTable export
# (Edit src/server/db/schema/index.ts — change export * to explicit)

# Step 4: Install form dependencies + add core UI components
bun add react-hook-form @hookform/resolvers
npx shadcn@latest add select label separator textarea
npx shadcn@latest add dialog sonner scroll-area progress
npx shadcn@latest add form
npx shadcn@latest add sidebar    # Adds sheet, tooltip, collapsible, breadcrumb automatically
npx shadcn@latest add switch toggle

# Step 5: Copy hooks
mkdir -p src/hooks
cp recipe-card/hooks/use-mobile.tsx src/hooks/use-mobile.ts
cp recipe-card/hooks/use-unit-system.ts src/hooks/use-unit-system.ts

# Step 6: Copy utility
cp recipe-card/lib/unit-scaler.ts src/lib/unit-scaler.ts
# Then create src/lib/conversion-types.ts with conversion types extracted from recipe-card/lib/types.ts
```

This unblocks the immediate 404s and gets the app rendering with proper components.

---

## Complete File Inventory Checklist

### Route Pages to Create (7)
- [ ] `src/app/recipe/[id]/page.tsx` + `loading.tsx`
- [ ] `src/app/recipe/[id]/cook/page.tsx` + `loading.tsx`
- [ ] `src/app/recipe/new/page.tsx` + `loading.tsx`
- [ ] `src/app/search/page.tsx` + `loading.tsx`
- [ ] `src/app/category/[slug]/page.tsx` + `loading.tsx`
- [ ] `src/app/tag/[slug]/page.tsx` + `loading.tsx`
- [ ] `src/app/settings/page.tsx` + `loading.tsx`

### UI Components to Add via shadcn (11 commands)
- [ ] `npx shadcn@latest add select`
- [ ] `npx shadcn@latest add label`
- [ ] `npx shadcn@latest add separator`
- [ ] `npx shadcn@latest add textarea`
- [ ] `npx shadcn@latest add form` (requires `react-hook-form` + `@hookform/resolvers`)
- [ ] `npx shadcn@latest add dialog`
- [ ] `npx shadcn@latest add sonner`
- [ ] `npx shadcn@latest add scroll-area`
- [ ] `npx shadcn@latest add progress`
- [ ] `npx shadcn@latest add sidebar` (auto-adds sheet, tooltip, collapsible, breadcrumb)
- [ ] `npx shadcn@latest add switch`
- [ ] `npx shadcn@latest add toggle`
- [ ] `npx shadcn@latest add toast` (optional)

### Hooks to Copy (3)
- [ ] `src/hooks/use-mobile.ts`
- [ ] `src/hooks/use-unit-system.ts`
- [ ] `src/hooks/use-toast.ts` (if needed)

### Custom Components to Create/Migrate (11)
- [ ] `src/components/scaled-ingredient-display.tsx`
- [ ] `src/components/app-sidebar.tsx`
- [ ] `src/components/search-form.tsx`
- [ ] `src/components/theme-provider.tsx`
- [ ] `src/components/theme-toggle.tsx`
- [ ] `src/components/unit-system-toggle.tsx`
- [ ] `src/components/enhanced-ingredient-form.tsx`
- [ ] `src/components/enhanced-steps-form.tsx`
- [ ] `src/lib/unit-scaler.ts`
- [ ] `src/lib/conversion-types.ts`
- [ ] `src/lib/schemas/recipe-form.ts`

### Scaffold Changes (3)
- [ ] Fix `components.json` (css path → `src/styles/globals.css`)
- [ ] Fix `src/server/db/schema/index.ts` (duplicate createTable)
- [ ] Update `src/app/layout.tsx` (sidebar + theme + toaster)

### tRPC Additions (3-4)
- [ ] `src/server/api/routers/units.ts` (getAll)
- [ ] Register `unitRouter` in `src/server/api/root.ts`
- [ ] Add `getByCategorySlug` to recipes or categories router
- [ ] Add `getByTagSlug` to recipes or tags router
