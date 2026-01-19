# Coding Conventions

**Analysis Date:** 2026-01-19

## Naming Patterns

**Files:**
- Components: `kebab-case.tsx` (e.g., `alert-dialog.tsx`, `dropdown-menu.tsx`)
- Pages: `page.tsx` (Next.js App Router convention)
- Layouts: `layout.tsx` (Next.js App Router convention)
- Utilities: `kebab-case.ts` (e.g., `utils.ts`)
- Supabase clients: `client.ts`, `server.ts`

**Functions:**
- Components: `PascalCase` function names (e.g., `AlertDialog`, `Button`, `DropdownMenu`)
- Utility functions: `camelCase` (e.g., `createClient`, `cn`)
- Event handlers: `handle{Action}` pattern (e.g., `handleLogin`, `handleSignup`, `handleNavClick`)

**Variables:**
- State: `camelCase` with descriptive names (e.g., `sidebarExpanded`, `showSecondary`, `loading`)
- Constants: `camelCase` for arrays/objects (e.g., `primaryNav`, `mockKPIs`, `bottomNav`)
- Environment variables: `NEXT_PUBLIC_` prefix for client-side, `SCREAMING_SNAKE_CASE`

**Types:**
- Props: Inline `React.ComponentProps<"element">` or `React.ComponentProps<typeof Primitive>`
- Intersections: Use `&` for extending props (e.g., `React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>`)
- Generics: Prefer inline type definitions over separate interfaces

## Code Style

**Formatting:**
- No explicit Prettier config (uses Next.js defaults)
- 2-space indentation
- Single quotes for strings in JSX attributes
- Double quotes for import paths
- Semicolons omitted (Next.js default)
- Max line length: ~100 characters (soft limit)

**Linting:**
- ESLint 9 with flat config (`eslint.config.mjs`)
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

**TypeScript Configuration:**
- Strict mode enabled (`"strict": true`)
- Target: ES2017
- Module resolution: Bundler
- JSX: react-jsx
- Path alias: `@/*` maps to `./*`

## Import Organization

**Order:**
1. React and core libraries (`"react"`, `"next/*"`)
2. External packages (`"radix-ui"`, `"lucide-react"`, `"class-variance-authority"`)
3. Internal aliases (`@/components/*`, `@/lib/*`)

**Example pattern from `arden/components/ui/button.tsx`:**
```typescript
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"
```

**Path Aliases:**
- `@/*` - Maps to project root (configured in `tsconfig.json`)
- Use aliases for all internal imports

## Error Handling

**Patterns:**
- Client-side form errors: Store in React state (`useState<string | null>(null)`)
- Display inline error messages with destructive styling
- Supabase errors: Extract `.message` from error object
- Try-catch blocks with early return on error

**Example from `arden/app/login/page.tsx`:**
```typescript
const { error } = await supabase.auth.signInWithPassword({ email, password })

if (error) {
  setError(error.message)
  setLoading(false)
  return
}
```

**Error Display:**
```tsx
{error && (
  <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm">
    {error}
  </div>
)}
```

## Logging

**Framework:** Browser console (no dedicated logging library)

**Patterns:**
- Minimal logging in production code
- Use try-catch silently for non-critical operations (e.g., cookie setting in Server Components)

```typescript
try {
  cookiesToSet.forEach(({ name, value, options }) =>
    cookieStore.set(name, value, options)
  )
} catch {
  // Server Component - ignorar
}
```

## Comments

**When to Comment:**
- Mock data sections (e.g., `// Mock data for breadcrumb`, `// Mock KPIs`)
- Component sections within JSX (e.g., `{/* Header */}`, `{/* Features Section */}`)
- Non-obvious silent catches

**JSDoc/TSDoc:**
- Not used in current codebase
- Type annotations serve as documentation

**Style:**
- Portuguese for domain-specific comments
- English for technical comments
- Section separators: `{/* Section Name */}`

## Function Design

**Size:**
- Components: 50-150 lines typical
- Utility functions: < 10 lines

**Parameters:**
- Destructure props inline with type annotation
- Use spread for remaining props (`...props`)
- Default values in destructuring (e.g., `variant = "default"`)

```typescript
function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
```

**Return Values:**
- Components return JSX directly
- No explicit return type annotations (inferred)
- Early returns for conditional rendering

## Module Design

**Exports:**
- Named exports for all components and functions
- Export multiple related components from single file
- No default exports

**Example from `arden/components/ui/card.tsx`:**
```typescript
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
```

**Barrel Files:**
- Not currently used
- Import directly from component files

## Component Patterns

**UI Components (shadcn style):**
1. Use `"use client"` directive when needed (interactive components)
2. Accept `className` prop for customization
3. Use `cn()` utility to merge classes
4. Add `data-slot` attributes for styling hooks
5. Use CVA (class-variance-authority) for variants

```typescript
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "dark:bg-input/30 border-input focus-visible:border-ring...",
        className
      )}
      {...props}
    />
  )
}
```

**Page Components:**
1. Export default function with `Page` suffix naming
2. Server components by default (no `"use client"`)
3. Use `"use client"` only when interactivity needed

**State Management:**
- React `useState` for local state
- No global state library configured yet (Zustand planned per CLAUDE.md)

## Tailwind/CSS Conventions

**Approach:**
- Mobile-first responsive design
- Dark mode as default (Supabase-inspired)
- Use CSS custom properties from `globals.css`
- Prefer composition over abstraction

**Color Usage:**
- Backgrounds: `bg-background`, `bg-surface-100`, `bg-surface-200`
- Text: `text-foreground`, `text-foreground-light`, `text-foreground-lighter`, `text-foreground-muted`
- Borders: `border-border`, `border-strong`, `border-overlay`
- Brand: `bg-brand`, `text-brand`, `text-brand-link`
- States: `bg-destructive`, `text-destructive`, `bg-warning`

**Never hardcode:**
- Color values (use CSS variables)
- Spacing outside Tailwind scale
- Font sizes outside Tailwind scale

## Git Conventions

**Commits:**
- Language: Portuguese
- Format: `tipo: descricao`
- Types: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`

**Examples from git log:**
```
feat: implementa landing page, autenticacao Supabase e ajusta design tokens
docs: adiciona CLAUDE.md e atualiza WARP.md com regras de desenvolvimento
style: alinha globals.css com design system Supabase
```

## Supabase Client Patterns

**Browser Client (`lib/supabase/client.ts`):**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server Client (`lib/supabase/server.ts`):**
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(/* ... */)
}
```

**Usage in Components:**
- Import `createClient` from appropriate file
- Call within event handlers or effects, not at module level

---

*Convention analysis: 2026-01-19*
