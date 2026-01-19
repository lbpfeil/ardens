# Phase 1: Foundation - Research

**Researched:** 2026-01-19
**Domain:** State Management (Zustand) + Form Validation (React Hook Form + Zod)
**Confidence:** HIGH

## Summary

This phase establishes the foundation for state management and form validation in the Arden FVS application. Research focused on integrating Zustand with Next.js 16 App Router (React 19) and combining React Hook Form with Zod for type-safe form validation.

**Key findings:**
1. Zustand 5.x requires a **per-request store pattern** for Next.js App Router to avoid sharing state across requests
2. React Hook Form 7.x + Zod 3.x (NOT Zod 4.x) is the stable, production-ready combination - Zod v4 has unresolved compatibility issues with @hookform/resolvers
3. The project's design system (DESIGN-SYSTEM.md) already documents the expected Form component pattern using shadcn/ui primitives

**Primary recommendation:** Use `createStore` from `zustand/vanilla` with React Context for state management. Use Zod v3 (3.23.x or 3.24.x) with React Hook Form for maximum stability.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| zustand | 5.0.10 | State management | Minimal, performant, React 19 compatible |
| react-hook-form | 7.71.x | Form state management | Lightweight, excellent DX, shadcn integration |
| zod | 3.23.x | Schema validation | TypeScript-first, integrates with RHF via resolver |
| @hookform/resolvers | 3.9.x | RHF resolver for Zod | Bridges Zod schemas to RHF validation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| immer | 10.x | Immutable state updates | When Zustand state has deep nesting |
| @redux-devtools/extension | 3.x | DevTools integration | Development debugging (devDependency) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod 3.23.x | Zod 4.x | Zod 4 has type compatibility issues with @hookform/resolvers - wait for ecosystem stabilization |
| zustand | jotai | Jotai is more atomic but zustand is simpler for this use case |
| react-hook-form | formik | RHF is lighter weight and better integrated with shadcn |

**Installation:**
```bash
cd arden && npm install zustand@^5.0.10 react-hook-form@^7.71.0 zod@^3.23.8 @hookform/resolvers@^3.9.0
```

**DevDependencies (optional):**
```bash
cd arden && npm install -D @redux-devtools/extension
```

## Architecture Patterns

### Recommended Project Structure
```
arden/
├── lib/
│   ├── stores/                    # Zustand stores
│   │   ├── index.ts               # Re-export all stores
│   │   ├── store-provider.tsx     # Context provider for stores
│   │   └── app-store.ts           # Main application store
│   ├── validations/               # Zod schemas
│   │   ├── index.ts               # Re-export all schemas
│   │   ├── auth.ts                # Auth-related schemas
│   │   └── common.ts              # Shared validation patterns
│   └── hooks/                     # Custom hooks
│       └── use-form-with-schema.ts # Optional: typed form hook wrapper
├── components/
│   └── ui/
│       └── form.tsx               # shadcn Form component (to be added)
```

### Pattern 1: Per-Request Store with Context Provider (Zustand + Next.js App Router)

**What:** Create stores using `createStore` from `zustand/vanilla`, wrap in Context, consume with `useStore`
**When to use:** Always for Next.js App Router to avoid request-scope leaking
**Example:**

```typescript
// lib/stores/app-store.ts
import { createStore } from 'zustand/vanilla'

export interface AppState {
  // UI state
  sidebarOpen: boolean

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
}

export const createAppStore = (initialState?: Partial<AppState>) => {
  return createStore<AppState>()((set) => ({
    // Default state
    sidebarOpen: true,
    ...initialState,

    // Actions
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
  }))
}

export type AppStore = ReturnType<typeof createAppStore>
```

```typescript
// lib/stores/store-provider.tsx
'use client'

import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createAppStore, type AppStore, type AppState } from './app-store'

const AppStoreContext = createContext<AppStore | null>(null)

interface StoreProviderProps {
  children: ReactNode
  initialState?: Partial<AppState>
}

export function StoreProvider({ children, initialState }: StoreProviderProps) {
  const storeRef = useRef<AppStore | null>(null)

  if (!storeRef.current) {
    storeRef.current = createAppStore(initialState)
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  )
}

export function useAppStore<T>(selector: (state: AppState) => T): T {
  const store = useContext(AppStoreContext)
  if (!store) {
    throw new Error('useAppStore must be used within StoreProvider')
  }
  return useStore(store, selector)
}
```

```typescript
// app/app/layout.tsx (or root layout)
import { StoreProvider } from '@/lib/stores/store-provider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      {children}
    </StoreProvider>
  )
}
```

### Pattern 2: Form with Zod Validation (React Hook Form + shadcn)

**What:** Use useForm with zodResolver, integrate with shadcn Field components
**When to use:** All forms requiring validation
**Example:**

```typescript
// lib/validations/auth.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(8, 'Senha deve ter no minimo 8 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

```typescript
// components/forms/login-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    // Handle form submission
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className="text-destructive text-xs">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          {...register('password')}
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && (
          <p className="text-destructive text-xs">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
}
```

### Pattern 3: Selecting State Efficiently (Zustand)

**What:** Use selectors to pick individual state properties, not entire state object
**When to use:** Always when consuming Zustand state to avoid unnecessary re-renders
**Example:**

```typescript
// GOOD: Select individual properties
function Sidebar() {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)
  // Component only re-renders when sidebarOpen changes
}

// BAD: Selecting entire state causes re-renders on ANY state change
function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore((state) => state) // Avoid!
}

// OK: Selecting multiple actions (actions don't change, won't cause re-renders)
function SidebarActions() {
  const { toggleSidebar, setSidebarOpen } = useAppStore((state) => ({
    toggleSidebar: state.toggleSidebar,
    setSidebarOpen: state.setSidebarOpen,
  }))
}
```

### Anti-Patterns to Avoid

- **Global store with `create()`:** Using `create()` in module scope creates global state that persists across requests in Next.js App Router - use `createStore()` with Context instead
- **Hydration mismatch with persist middleware:** Don't use persist middleware without handling hydration - if needed, implement custom hydration handling
- **Selecting entire state object:** Always use selectors to pick specific properties
- **Zod v4 with @hookform/resolvers:** Type compatibility issues exist - stick with Zod v3.23.x

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom validation logic | Zod schemas + zodResolver | Type inference, reusable, consistent errors |
| Form state | useState for each field | useForm hook | Handles dirty, touched, validation, performance |
| Global state | React Context + useState | Zustand stores | Better performance, devtools, persistence ready |
| Hydration handling | Custom useEffect patterns | Zustand's built-in patterns | Edge cases handled, tested |
| Error message formatting | Manual string construction | Zod's message customization | i18n ready, consistent |

**Key insight:** Form validation and state management have many edge cases (async validation, field arrays, hydration, devtools). Using established libraries avoids weeks of debugging.

## Common Pitfalls

### Pitfall 1: Hydration Mismatch with Zustand
**What goes wrong:** Server renders with initial state, client hydrates with different state (e.g., from localStorage)
**Why it happens:** Next.js renders on server first, Zustand persist middleware loads state on client
**How to avoid:**
- Don't use persist middleware for SSR-rendered state
- For persist: use `skipHydration: true` and manually call `rehydrate()` after mount
- Use the per-request store pattern shown above
**Warning signs:** React hydration error in console, UI flickers on load

### Pitfall 2: Zod v4 Type Errors with React Hook Form
**What goes wrong:** TypeScript errors when using zodResolver: "Type 'Resolver<input<T>>' is not assignable to type 'Resolver<output<T>>'"
**Why it happens:** Zod v4 changed type inference, @hookform/resolvers not fully compatible
**How to avoid:** Use Zod v3.23.x or v3.24.x explicitly
**Warning signs:** Type errors mentioning `input<T>` vs `output<T>`, forms not submitting

### Pitfall 3: Stale Closures in Zustand Actions
**What goes wrong:** Actions reference stale state
**Why it happens:** Using external variables inside `set()` callback
**How to avoid:** Always use the `state` parameter in `set()` callback
**Warning signs:** State updates seem to "miss" changes, inconsistent behavior

```typescript
// BAD: Stale closure
let count = 0
const store = createStore((set) => ({
  count: 0,
  increment: () => set({ count: count + 1 }), // `count` is captured, never updates
}))

// GOOD: Use state parameter
const store = createStore((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

### Pitfall 4: Missing Default Values in useForm
**What goes wrong:** Controlled input warnings, form resets don't work properly
**Why it happens:** React Hook Form expects defaultValues for controlled inputs
**How to avoid:** Always provide defaultValues matching your schema
**Warning signs:** Console warnings about controlled/uncontrolled inputs

```typescript
// GOOD: Provide all default values
const form = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  defaultValues: {
    email: '',
    password: '',
  },
})
```

## Code Examples

### Complete Zustand Store with TypeScript

```typescript
// lib/stores/app-store.ts
// Source: Zustand official Next.js guide + TypeScript guide
import { createStore } from 'zustand/vanilla'
import { devtools } from 'zustand/middleware'

// 1. Define state interface
export interface AppState {
  // UI State
  sidebarOpen: boolean
  currentObraId: string | null

  // Loading states
  isLoading: boolean

  // Actions
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setCurrentObra: (obraId: string | null) => void
  setLoading: (loading: boolean) => void
}

// 2. Define initial state
const initialState = {
  sidebarOpen: true,
  currentObraId: null,
  isLoading: false,
}

// 3. Create store factory
export const createAppStore = (preloadedState?: Partial<AppState>) => {
  return createStore<AppState>()(
    devtools(
      (set) => ({
        ...initialState,
        ...preloadedState,

        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen }), false, 'toggleSidebar'),

        setSidebarOpen: (open) =>
          set({ sidebarOpen: open }, false, 'setSidebarOpen'),

        setCurrentObra: (obraId) =>
          set({ currentObraId: obraId }, false, 'setCurrentObra'),

        setLoading: (loading) =>
          set({ isLoading: loading }, false, 'setLoading'),
      }),
      { name: 'app-store', enabled: process.env.NODE_ENV === 'development' }
    )
  )
}

export type AppStore = ReturnType<typeof createAppStore>
```

### Complete Form with Validation

```typescript
// lib/validations/obra.ts
import { z } from 'zod'

export const obraSchema = z.object({
  nome: z.string()
    .min(3, 'Nome deve ter no minimo 3 caracteres')
    .max(100, 'Nome deve ter no maximo 100 caracteres'),
  endereco: z.string()
    .min(5, 'Endereco deve ter no minimo 5 caracteres'),
  dataInicio: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),
  responsavel: z.string()
    .min(2, 'Nome do responsavel deve ter no minimo 2 caracteres'),
})

export type ObraFormData = z.infer<typeof obraSchema>
```

```typescript
// components/forms/obra-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { obraSchema, type ObraFormData } from '@/lib/validations/obra'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ObraFormProps {
  defaultValues?: Partial<ObraFormData>
  onSubmit: (data: ObraFormData) => Promise<void>
}

export function ObraForm({ defaultValues, onSubmit }: ObraFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ObraFormData>({
    resolver: zodResolver(obraSchema),
    defaultValues: {
      nome: '',
      endereco: '',
      dataInicio: '',
      responsavel: '',
      ...defaultValues,
    },
  })

  const handleFormSubmit = async (data: ObraFormData) => {
    await onSubmit(data)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome">Nome da Obra</Label>
        <Input
          id="nome"
          {...register('nome')}
          className={errors.nome ? 'border-destructive' : ''}
        />
        {errors.nome && (
          <p className="text-destructive text-xs">{errors.nome.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="endereco">Endereco</Label>
        <Input
          id="endereco"
          {...register('endereco')}
          className={errors.endereco ? 'border-destructive' : ''}
        />
        {errors.endereco && (
          <p className="text-destructive text-xs">{errors.endereco.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="dataInicio">Data de Inicio</Label>
        <Input
          id="dataInicio"
          type="date"
          {...register('dataInicio')}
          className={errors.dataInicio ? 'border-destructive' : ''}
        />
        {errors.dataInicio && (
          <p className="text-destructive text-xs">{errors.dataInicio.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="responsavel">Responsavel</Label>
        <Input
          id="responsavel"
          {...register('responsavel')}
          className={errors.responsavel ? 'border-destructive' : ''}
        />
        {errors.responsavel && (
          <p className="text-destructive text-xs">{errors.responsavel.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Salvar Obra'}
      </Button>
    </form>
  )
}
```

### Using Zustand Store in Components

```typescript
// components/sidebar.tsx
'use client'

import { useAppStore } from '@/lib/stores/store-provider'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Sidebar() {
  // Select individual properties for optimal performance
  const sidebarOpen = useAppStore((state) => state.sidebarOpen)
  const toggleSidebar = useAppStore((state) => state.toggleSidebar)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
      >
        {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {sidebarOpen && (
        <aside className="w-64 bg-sidebar border-r border-border">
          {/* Sidebar content */}
        </aside>
      )}
    </>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Zustand `create()` global | `createStore()` + Context | Zustand 4.x / Next.js 13+ | Required for App Router SSR |
| Zod v3 | Zod v4 | Dec 2025 | Zod v4 has performance improvements but RHF compatibility issues |
| Custom form validation | Zod + RHF | 2023 | Type-safe, reusable schemas |
| Redux for global state | Zustand | 2022+ | Simpler API, smaller bundle |

**Deprecated/outdated:**
- `zustand/context` (removed in v4) - use standard React Context with `createStore`
- Global `create()` stores in Next.js App Router - causes request leaking

## Open Questions

Things that couldn't be fully resolved:

1. **Zod v4 migration timeline**
   - What we know: @hookform/resolvers has ongoing compatibility issues with Zod v4
   - What's unclear: When will type issues be fully resolved
   - Recommendation: Stay on Zod v3.23.x for now, monitor GitHub issues

2. **shadcn Form component**
   - What we know: Project doesn't have form.tsx component yet
   - What's unclear: Whether to use shadcn's Form wrapper or direct RHF integration
   - Recommendation: Add shadcn Form component for consistency with design system

## Sources

### Primary (HIGH confidence)
- [Zustand npm package](https://www.npmjs.com/package/zustand) - version 5.0.10
- [Zustand Next.js Setup Guide](https://zustand.docs.pmnd.rs/guides/nextjs) - official documentation
- [React Hook Form npm](https://www.npmjs.com/package/react-hook-form) - version 7.71.x
- [React Hook Form Get Started](https://react-hook-form.com/get-started) - official documentation
- [Zod npm package](https://www.npmjs.com/package/zod) - version info
- [shadcn/ui React Hook Form docs](https://ui.shadcn.com/docs/forms/react-hook-form) - integration pattern

### Secondary (MEDIUM confidence)
- [Zustand GitHub Discussions](https://github.com/pmndrs/zustand/discussions/2326) - Next.js patterns
- [TkDodo's blog on Zustand and Context](https://tkdodo.eu/blog/zustand-and-react-context) - architecture patterns
- [Zustand GitHub Discussions #1975](https://github.com/pmndrs/zustand/discussions/1975) - create vs createStore

### Tertiary (LOW confidence)
- [GitHub Issue #12829](https://github.com/react-hook-form/react-hook-form/issues/12829) - Zod v4 support status
- [GitHub Issue #799](https://github.com/react-hook-form/resolvers/issues/799) - hookform/resolvers Zod v4 issues
- Community blog posts on Medium about hydration patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation and npm verified
- Architecture patterns: HIGH - Based on official Zustand Next.js guide
- Pitfalls: MEDIUM - Based on GitHub issues and community discussions

**Research date:** 2026-01-19
**Valid until:** 2026-02-19 (30 days - stable ecosystem)
