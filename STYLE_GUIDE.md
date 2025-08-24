# Kent Cook This - Style Guide

This style guide documents the coding conventions, patterns, and best practices used throughout the Kent Cook This codebase.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [File Structure](#file-structure)
4. [TypeScript Configuration](#typescript-configuration)
5. [Component Architecture](#component-architecture)
6. [Database Schema Patterns](#database-schema-patterns)
7. [API Patterns (tRPC)](#api-patterns-trpc)
8. [Styling Conventions](#styling-conventions)
9. [Code Formatting](#code-formatting)
10. [Naming Conventions](#naming-conventions)
11. [Error Handling](#error-handling)
12. [Testing Guidelines](#testing-guidelines)

## Project Overview

Kent Cook This is a Next.js application for recipe management with the following key features:

- Recipe creation and management
- Ingredient scaling and unit conversion
- User authentication and profiles
- Recipe categorization and tagging
- Search and filtering functionality

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **API**: tRPC for type-safe API routes
- **Validation**: Zod schemas
- **State Management**: React Query + tRPC
- **Icons**: Lucide React
- **Forms**: React Hook Form (implied from patterns)

## File Structure

```
├── app/                    # Next.js App Router pages
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── app-sidebar.tsx   # Application-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
│   ├── types2.ts         # TypeScript type definitions
│   ├── utils.ts          # General utilities (clsx/tailwind-merge)
│   ├── unit-scaler.ts    # Recipe scaling logic
│   ├── validation.ts     # Form validation helpers
│   └── schema.ts         # Database schemas and Zod schemas
├── server/               # Backend/server-side code
│   ├── api/             # tRPC API routes
│   └── db/              # Database configuration and schemas
└── styles/              # Global styles
```

## TypeScript Configuration

### Strict Mode

- `strict: true` - Full strict mode enabled
- `noUncheckedIndexedAccess: true` - Prevents unsafe array/object access
- `exactOptionalPropertyTypes: true` - Strict optional properties

### Path Aliases

- `~/*` maps to `./src/*` - Consistent import paths

### Key Settings

```typescript
// Use type-only imports for types
import type { User, Recipe } from "~/lib/types2";

// Use regular imports for runtime values
import { cn, formatQuantity } from "~/lib/utils";
```

## Component Architecture

### UI Components (shadcn/ui pattern)

```typescript
// components/ui/button.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // ...
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        // ...
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
```

### Application Components

```typescript
// Use "use client" directive for client components
"use client";

import type React from "react";
import { useState } from "react";

// Props interface with proper typing
interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  // Component logic
}
```

## Database Schema Patterns

### Table Creation with Prefix

```typescript
// server/db/schema/recipeData.ts
export const createTable = sqliteTableCreator(
  (name) => `kent-cook-this_${name}`,
);

export const recipes = createTable("recipes", (d) => ({
  id: d.integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
  authorId: d
    .integer({ mode: "number" })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: d.text({ length: 255 }).notNull(),
  // ... other fields
}));
```

### Relations Pattern

```typescript
export const recipesRelations = relations(recipes, ({ one, many }) => ({
  author: one(users, { fields: [recipes.authorId], references: [users.id] }),
  ingredients: many(recipeIngredients),
  steps: many(steps),
}));
```

### Join Tables

```typescript
// Many-to-many relationships
export const recipeTags = createTable("recipe_tags", (d) => ({
  recipeId: d
    .integer({ mode: "number" })
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  tagId: d
    .integer({ mode: "number" })
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
}));
```

## API Patterns (tRPC)

### Router Structure

```typescript
// server/api/routers/recipes.ts
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const createRecipeSchema = z.object({
  authorId: z.number(),
  title: z.string().min(1).max(255),
  // ... validation rules
});

export const recipeRouter = createTRPCRouter({
  create: publicProcedure
    .input(createRecipeSchema)
    .mutation(async ({ ctx, input }) => {
      const [recipe] = await ctx.db.insert(recipes).values(input).returning();
      return recipe;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.recipes.findFirst({
        where: eq(recipes.id, input.id),
        with: {
          author: true,
          ingredients: { with: { ingredient: true, unit: true } },
        },
      });
    }),
});
```

### Complex Mutations with Transactions

```typescript
createWithDetails: publicProcedure
  .input(createRecipeWithDetailsSchema)
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.transaction(async (tx) => {
      // Multiple related database operations
      const [newRecipe] = await tx.insert(recipes).values({...}).returning()

      if (input.ingredients.length > 0) {
        await tx.insert(recipeIngredients).values(...)
      }

      // ... more operations
      return { recipeId: newRecipe.id }
    })
  }),
```

## Styling Conventions

### Tailwind CSS Patterns

- Use design tokens from CSS variables
- Follow shadcn/ui component patterns
- Consistent spacing scale (4px increments)
- Dark mode support with `dark:` prefixes

### Component Styling

```typescript
// Use cn() utility for class merging
className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  className // Allow custom overrides
)}

// Consistent hover states
className="transition-colors hover:bg-accent hover:text-accent-foreground"

// Focus states for accessibility
className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
```

## Code Formatting

### Prettier Configuration

```javascript
// prettier.config.js
export default {
  plugins: ["prettier-plugin-tailwindcss"],
};
```

### Scripts

```json
{
  "format:write": "prettier --write \"**/*.{ts,tsx,js,jsx,mdx}\" --cache",
  "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,mdx}\" --cache",
  "lint": "next lint",
  "lint:fix": "next lint --fix"
}
```

## Naming Conventions

### Files and Directories

- Components: `PascalCase` (e.g., `RecipeCard.tsx`)
- Utilities: `kebab-case` (e.g., `unit-scaler.ts`)
- Types: `PascalCase` with `Types` suffix (e.g., `types2.ts`)
- Hooks: `useCamelCase` (e.g., `use-mobile.tsx`)

### Variables and Functions

```typescript
// camelCase for variables and functions
const userName = "John";
function calculateTotal() {}

// PascalCase for types and interfaces
interface UserProfile {}
type RecipeFormValues = z.infer<typeof recipeFormSchema>;

// SCREAMING_SNAKE_CASE for constants
const MAX_RECIPE_NAME_LENGTH = 255;
const API_VERSION = "v1";
```

### Database Tables and Fields

```typescript
// snake_case for database fields
export const recipes = createTable("recipes", (d) => ({
  id: d.integer("id").primaryKey(),
  authorId: d.integer("author_id"), // Foreign keys
  createdAt: d.timestamp("created_at"), // Timestamps
}));

// camelCase for JavaScript property access
const recipe = {
  id: 1,
  authorId: 123,
  createdAt: new Date(),
};
```

## Error Handling

### Validation Errors

```typescript
// Use Zod for runtime validation
export function validateRecipeForm(data: z.infer<typeof recipeFormSchema>) {
  try {
    recipeFormSchema.parse(data);
    return { success: true, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.flatten().fieldErrors };
    }
    return {
      success: false,
      errors: { general: ["An unknown error occurred."] },
    };
  }
}
```

### API Error Handling

```typescript
// tRPC handles errors automatically
// Custom error handling in components
const handleSubmit = async (data: RecipeFormValues) => {
  try {
    await createRecipe.mutateAsync(data);
  } catch (error) {
    console.error("Failed to create recipe:", error);
    // Handle error (show toast, etc.)
  }
};
```

## Testing Guidelines

### File Organization

- Tests should be co-located with the code they test
- Test files should end with `.test.ts` or `.spec.ts`
- Component tests should end with `.test.tsx`

### Testing Stack

- **Framework**: Vitest (recommended based on Next.js patterns)
- **Component Testing**: Testing Library
- **Mocking**: Mock Service Worker for API calls

### Test Structure

```typescript
// Example test file structure
describe("RecipeCard", () => {
  it("renders recipe information correctly", () => {
    // Test implementation
  });

  it("handles hover state", () => {
    // Test implementation
  });
});
```

## Best Practices

### 1. Type Safety

- Use TypeScript strict mode
- Define proper interfaces for all data structures
- Use type-only imports when possible
- Leverage tRPC for end-to-end type safety

### 2. Component Design

- Use composition over inheritance
- Keep components small and focused
- Use proper TypeScript interfaces for props
- Implement proper loading and error states

### 3. Database Design

- Use foreign keys with proper cascade rules
- Implement proper indexing for performance
- Use transactions for related operations
- Follow normalization principles

### 4. API Design

- Use descriptive procedure names
- Implement proper input validation with Zod
- Use transactions for complex mutations
- Include proper error handling

### 5. Code Organization

- Separate concerns (UI, business logic, data access)
- Use barrel exports for clean imports
- Follow the single responsibility principle
- Keep files small and focused

### 6. Performance

- Use proper React patterns (memo, useCallback, useMemo)
- Implement proper loading states
- Use proper database queries with relations
- Optimize images and assets

## ESLint Configuration

### Key Rules

```javascript
// eslint.config.js
{
  rules: {
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports", fixStyle: "inline-type-imports" }
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { argsIgnorePattern: "^_" }
    ],
    "drizzle/enforce-delete-with-where": ["error"],
    "drizzle/enforce-update-with-where": ["error"],
  }
}
```

## Code Quality Issues to Address

Based on the current codebase analysis, here are some issues that should be addressed:

### TypeScript Errors

1. **Missing type annotations** in `recipe-card/lib/schema.ts`:
   - `categories` and `units` variables need explicit typing
   - Functions need return type annotations

2. **Missing properties** in `recipe-card/lib/unit-scaler.ts`:
   - `Unit` interface is missing properties: `mlPerUnit`, `gPerUnit`, `unitsPerUnit`
   - `Ingredient` interface is missing `quantity` property

### Deprecation Warnings

1. **Zod URL validation** - Replace deprecated `.url()` with proper URL validation
2. **Drizzle pgTable** - Update to use the new table creation syntax
3. **Zod error.flatten()** - Update to use the new error handling API

### Recommended Fixes

```typescript
// Instead of deprecated .url()
z.string().url("Must be a valid URL");

// Use proper URL validation
z.string().refine((val) => {
  try {
    new URL(val);
    return true;
  } catch {
    return false;
  }
}, "Must be a valid URL");
```

## Contributing

When adding new code:

1. Follow the established patterns in this guide
2. Run `npm run typecheck` and `npm run lint` before committing
3. Add tests for new functionality
4. Update this style guide if introducing new patterns

This style guide should be updated as the codebase evolves and new patterns emerge.
