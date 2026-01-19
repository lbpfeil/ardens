# Architecture

**Analysis Date:** 2026-01-19

## Pattern Overview

**Overall:** Supabase-first Monolithic Frontend

**Key Characteristics:**
- No traditional backend server - Supabase handles 90% of backend logic
- Next.js 16 App Router with React 19 for the web portal
- Row-Level Security (RLS) for multi-tenant data isolation
- Direct Supabase client calls from frontend (no API layer)
- Server Components for initial data fetching, Client Components for interactivity

## Layers

**Presentation Layer:**
- Purpose: UI rendering and user interaction
- Location: `arden/app/` (pages), `arden/components/` (reusable components)
- Contains: React components, pages, layouts
- Depends on: Supabase client, UI components
- Used by: End users via browser

**UI Component Layer:**
- Purpose: Reusable design system components (shadcn/ui)
- Location: `arden/components/ui/`
- Contains: Button, Card, Input, DropdownMenu, etc. (13 components)
- Depends on: Radix UI primitives, Tailwind CSS, `lib/utils.ts`
- Used by: All page components

**Data Access Layer:**
- Purpose: Supabase client initialization and authentication
- Location: `arden/lib/supabase/`
- Contains: Browser client (`client.ts`), Server client (`server.ts`)
- Depends on: `@supabase/ssr`, environment variables
- Used by: Pages, middleware, components needing data

**Middleware Layer:**
- Purpose: Auth protection and route guards
- Location: `arden/middleware.ts`
- Contains: Session refresh, protected route redirection
- Depends on: Supabase server client
- Used by: Next.js request pipeline

**Database Layer:**
- Purpose: Data storage, RLS policies, business logic triggers
- Location: `database/schema.sql`, `database/rls-policies.sql`
- Contains: PostgreSQL schema, ENUMs, triggers, RLS policies
- Depends on: Supabase PostgreSQL
- Used by: All data operations via Supabase client

## Data Flow

**Authentication Flow:**

1. User submits credentials on `/login` page (`arden/app/login/page.tsx`)
2. Client-side Supabase client calls `signInWithPassword`
3. Supabase Auth validates and returns session
4. Middleware (`arden/middleware.ts`) detects session via cookies
5. User redirected to `/app` (protected area)

**Protected Route Access:**

1. User navigates to `/app/*` route
2. Middleware creates Supabase server client
3. Middleware calls `supabase.auth.getUser()` to validate session
4. If no user, redirect to `/login`
5. If user exists, allow access and render page

**Data Read Flow:**

1. Component (Server or Client) creates Supabase client
2. Component calls `supabase.from('table').select()`
3. Supabase applies RLS policies based on `auth.uid()`
4. Only tenant-scoped data returned
5. Component renders data

**State Management:**
- Local component state via React `useState` hooks
- No global state library implemented yet (Zustand planned per CLAUDE.md)
- Form state managed inline in page components

## Key Abstractions

**Supabase Client Factory:**
- Purpose: Create properly configured Supabase clients for different contexts
- Examples: `arden/lib/supabase/client.ts`, `arden/lib/supabase/server.ts`
- Pattern: Factory function returning configured client instance

**UI Component Composition:**
- Purpose: Consistent design via composable shadcn components
- Examples: `arden/components/ui/button.tsx`, `arden/components/ui/card.tsx`
- Pattern: Radix primitives wrapped with Tailwind styling and CVA variants

**Class Merging Utility:**
- Purpose: Merge Tailwind classes safely
- Examples: `arden/lib/utils.ts` exports `cn()` function
- Pattern: `clsx` + `tailwind-merge` composition

## Entry Points

**Root Layout:**
- Location: `arden/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: HTML structure, fonts, global CSS

**Landing Page:**
- Location: `arden/app/page.tsx`
- Triggers: Unauthenticated visitors to `/`
- Responsibilities: Marketing content, login/signup CTAs

**App Layout (Protected):**
- Location: `arden/app/app/layout.tsx`
- Triggers: All `/app/*` routes
- Responsibilities: Sidebar navigation, top bar, auth context

**App Home:**
- Location: `arden/app/app/page.tsx`
- Triggers: Authenticated user visits `/app`
- Responsibilities: Dashboard with KPIs, recent NCs feed

**Middleware:**
- Location: `arden/middleware.ts`
- Triggers: All requests (except static assets)
- Responsibilities: Session refresh, route protection

## Error Handling

**Strategy:** Component-level error state with user feedback

**Patterns:**
- Authentication errors shown via local `error` state in forms (`arden/app/login/page.tsx`)
- Error display uses conditional rendering with destructive styling
- No global error boundary implemented yet
- Supabase errors passed directly to UI (`error.message`)

## Cross-Cutting Concerns

**Logging:** Not implemented - rely on Supabase dashboard and browser console

**Validation:** Client-side validation planned via Zod (not yet implemented)

**Authentication:**
- Supabase Auth with email/password
- Session managed via HTTP-only cookies
- Middleware validates on every protected request

**Multi-Tenancy:**
- RLS policies isolate data by `cliente_id`
- Users associated with clients via `usuario_clientes` join table
- All queries automatically filtered by tenant

**Styling:**
- Tailwind CSS 4 with CSS custom properties
- Dark mode first (single theme)
- Design tokens defined in `arden/app/globals.css`

---

*Architecture analysis: 2026-01-19*
