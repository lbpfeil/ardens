# Phase 2: Obras - Research

**Researched:** 2026-01-19
**Domain:** CRUD Operations (Supabase + Next.js) + Table/Modal UI Patterns
**Confidence:** HIGH

## Summary

This phase implements CRUD operations for "Obras" (construction projects) within the "Visao Global" context. Research focused on the existing database schema, established UI patterns from Phase 1, and required shadcn components.

**Key findings:**
1. The `obras` table schema is well-defined with cliente_id foreign key, soft-delete via `arquivada` boolean, and relevant metadata fields
2. RLS policies enforce that only admins can INSERT/UPDATE/DELETE obras, and users see obras filtered by their construtora
3. Phase 1 established Zustand + RHF + Zod patterns that should be reused for the obras form
4. **Missing components:** Dialog (for modals), Table, and Progress (for progress bars) - need to be added via shadcn CLI
5. Toasts/notifications not yet configured - need sonner for success/error feedback

**Primary recommendation:** Extend the obra validation schema from Phase 1, add missing shadcn components (Dialog, Table, Progress, Sonner), create obras-specific Supabase data access functions, and implement the table-based list with modal create/edit pattern per CONTEXT.md decisions.

## Schema Analysis

### Obras Table Structure

```sql
CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

  -- Identification
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(50),  -- Internal code (optional)
  tipologia tipologia_obra DEFAULT 'residencial_horizontal',

  -- Location (coordinates only, per decision)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Responsible
  responsavel_tecnico VARCHAR(255),

  -- Status
  ativo BOOLEAN DEFAULT true,
  arquivada BOOLEAN DEFAULT false,  -- Soft delete

  -- Configuration
  config JSONB DEFAULT '{
    "ci_ativo": false,
    "aprovacao_verificacoes": false,
    "liberar_inspecoes": false
  }',

  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tipologia Enum

```sql
CREATE TYPE tipologia_obra AS ENUM (
  'residencial_horizontal',  -- Loteamento, casas
  'residencial_vertical',    -- Predios, torres
  'comercial',               -- Lojas, escritorios
  'retrofit',                -- Reforma/modernizacao
  'misto'                    -- Combinacao
);
```

### RLS Policies for Obras

| Operation | Policy | Who Can Execute |
|-----------|--------|-----------------|
| SELECT | `obras_select` | Users whose `cliente_id = get_user_cliente_id()` AND (is_admin() OR has obra access) |
| INSERT | `obras_insert` | Only admin users (`is_admin()`) |
| UPDATE | `obras_update` | Only admin users (`is_admin()`) |
| DELETE | `obras_delete` | Only admin users (`is_admin()`) |

**Key functions:**
- `get_user_cliente_id()`: Returns the current user's construtora ID
- `is_admin()`: Checks if user has admin profile
- `user_has_obra_access(obra_id)`: Checks specific obra permission

### Related Tables

| Table | Relationship | Notes |
|-------|--------------|-------|
| `clientes` | Parent (1:N) | Construtora that owns the obra |
| `usuario_obras` | Permission table | Grants obra access to non-admin users |
| `agrupamentos` | Child (1:N) | Quadras/Torres/Blocos within obra |
| `obra_servicos` | Junction table | FVS services active in obra |
| `verificacoes` | Child (1:N) | Inspections linked to obra |

## Existing Patterns (from Phase 1)

### Zustand Store Pattern

**Location:** `arden/lib/stores/`

**Pattern established:**
- Use `createStore` from `zustand/vanilla` (not `create`)
- Wrap in Context via `StoreProvider`
- Consume via `useAppStore` hook with selectors
- Enable devtools only in development

**Existing state:**
```typescript
interface AppState {
  sidebarOpen: boolean
  currentObraId: string | null  // Can be used for obra context
  isLoading: boolean
  // Actions...
}
```

### Form Validation Pattern

**Location:** `arden/lib/validations/`

**Existing obra schema (needs update):**
```typescript
// lib/validations/obra.ts
export const obraSchema = z.object({
  nome: requiredString(3, 100, 'Nome'),
  codigo: optionalString(20),
  endereco: requiredString(5, 200, 'Endereco'),  // Not in DB schema
  dataInicio: dateString(),  // Not in DB schema
  responsavel: requiredString(2, 100, 'Responsavel'),
})
```

**Issue:** Current schema doesn't match database. Needs update per CONTEXT.md:
- Required: `nome` only
- Optional: endereco (cidade/estado), tipologia, responsavel_tecnico

### Supabase Client Pattern

**Browser client:** `arden/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Server client:** `arden/lib/supabase/server.ts`
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(/* ... */)
}
```

## Available Components

### shadcn/ui Components Present

| Component | File | Notes |
|-----------|------|-------|
| AlertDialog | `alert-dialog.tsx` | For archive confirmation |
| Badge | `badge.tsx` | For status badges (Ativa/Arquivada) |
| Button | `button.tsx` | All variants available |
| Card | `card.tsx` | For potential detail views |
| Combobox | `combobox.tsx` | For searchable selects |
| DropdownMenu | `dropdown-menu.tsx` | For row actions |
| Field | `field.tsx` | Form field wrapper |
| Input | `input.tsx` | Text inputs |
| InputGroup | `input-group.tsx` | Input with addons |
| Label | `label.tsx` | Form labels |
| Select | `select.tsx` | For tipologia dropdown |
| Separator | `separator.tsx` | Visual dividers |
| Textarea | `textarea.tsx` | Multiline inputs |

### Missing Components (Need to Add)

| Component | Purpose | How to Add |
|-----------|---------|------------|
| **Dialog** | Create/Edit obra modal | `npx shadcn@latest add dialog` |
| **Table** | Obras list | `npx shadcn@latest add table` |
| **Progress** | Progress bar in table | `npx shadcn@latest add progress` |
| **Sonner** | Toast notifications | `npx shadcn@latest add sonner` |
| **Skeleton** | Loading states | `npx shadcn@latest add skeleton` |

## Standard Stack

### Core Data Fetching

| Library | Already Installed | Purpose |
|---------|------------------|---------|
| @supabase/ssr | Yes | Server/Browser Supabase clients |
| @supabase/supabase-js | Yes | Supabase JavaScript SDK |

### UI Components

| Library | Already Installed | Purpose |
|---------|------------------|---------|
| radix-ui | Yes | UI primitives for Dialog, etc |
| lucide-react | Yes | Icons |
| class-variance-authority | Yes | Variant styling |

### Forms (from Phase 1)

| Library | Version | Already Installed |
|---------|---------|-------------------|
| react-hook-form | 7.71.1 | Yes |
| @hookform/resolvers | 3.10.0 | Yes |
| zod | 3.25.76 | Yes |

**Installation for missing UI:**
```bash
cd arden && npx shadcn@latest add dialog table progress sonner skeleton
```

## Architecture Patterns

### Recommended Project Structure (Phase 2 additions)

```
arden/
├── app/
│   └── app/
│       └── obras/
│           ├── page.tsx           # Obras list page
│           ├── [id]/
│           │   └── page.tsx       # Obra detail/context page
│           └── _components/       # Private route components
│               ├── obras-table.tsx
│               ├── obra-form-modal.tsx
│               ├── archive-confirmation.tsx
│               └── status-badge.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Existing
│   │   ├── server.ts             # Existing
│   │   └── queries/
│   │       └── obras.ts          # NEW: Obras data access
│   ├── validations/
│   │   ├── obra.ts               # UPDATE: Align with DB schema
│   │   └── common.ts             # Existing
│   └── stores/
│       └── obras-store.ts        # NEW: Obras UI state (optional)
```

### Pattern 1: Data Access Layer for Obras

**What:** Centralized functions for Supabase queries
**When to use:** All data operations (list, create, update, archive)
**Example:**

```typescript
// lib/supabase/queries/obras.ts
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/supabase'

type Obra = Database['public']['Tables']['obras']['Row']
type ObraInsert = Database['public']['Tables']['obras']['Insert']
type ObraUpdate = Database['public']['Tables']['obras']['Update']

export async function listObras(options?: { includeArchived?: boolean }) {
  const supabase = createClient()

  let query = supabase
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false })

  if (!options?.includeArchived) {
    query = query.eq('arquivada', false)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function getObra(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('obras')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createObra(obra: ObraInsert) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('obras')
    .insert(obra)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateObra(id: string, updates: ObraUpdate) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('obras')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function archiveObra(id: string) {
  return updateObra(id, { arquivada: true })
}

export async function restoreObra(id: string) {
  return updateObra(id, { arquivada: false })
}
```

### Pattern 2: Updated Obra Form Schema

**What:** Zod schema aligned with DB and CONTEXT.md decisions
**When to use:** Create/Edit obra forms

```typescript
// lib/validations/obra.ts
import { z } from 'zod'
import { requiredString, optionalString } from './common'

export const tipologiaOptions = [
  { value: 'residencial_horizontal', label: 'Residencial Horizontal' },
  { value: 'residencial_vertical', label: 'Residencial Vertical' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'retrofit', label: 'Retrofit' },
  { value: 'misto', label: 'Misto' },
] as const

export const obraFormSchema = z.object({
  // Required per CONTEXT.md
  nome: requiredString(3, 255, 'Nome'),

  // Optional fields
  codigo: optionalString(50),
  tipologia: z.enum([
    'residencial_horizontal',
    'residencial_vertical',
    'comercial',
    'retrofit',
    'misto'
  ]).optional(),
  cidade: optionalString(100),
  estado: z.string().length(2, 'Estado deve ter 2 caracteres').optional().or(z.literal('')),
  responsavel_tecnico: optionalString(255),
})

export type ObraFormData = z.infer<typeof obraFormSchema>
```

### Pattern 3: Modal Form Pattern

**What:** Reusable modal for create/edit with form
**When to use:** Both create and edit flows per CONTEXT.md decision

```typescript
// Example structure for obra-form-modal.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { obraFormSchema, type ObraFormData } from '@/lib/validations/obra'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ObraFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<ObraFormData>
  onSubmit: (data: ObraFormData) => Promise<void>
  mode: 'create' | 'edit'
}

export function ObraFormModal({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  mode
}: ObraFormModalProps) {
  const form = useForm<ObraFormData>({
    resolver: zodResolver(obraFormSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      tipologia: undefined,
      cidade: '',
      estado: '',
      responsavel_tecnico: '',
      ...defaultValues,
    },
  })

  // Form implementation...
}
```

### Pattern 4: Table with Actions

**What:** Data table with row actions via dropdown menu
**When to use:** Obras list page

```typescript
// Example table pattern from DESIGN-SYSTEM.md
<div className="rounded-md border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Progresso</TableHead>
        <TableHead>Data Criacao</TableHead>
        <TableHead className="w-[50px]">Acoes</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {obras.map((obra) => (
        <TableRow
          key={obra.id}
          className="cursor-pointer"
          onClick={() => router.push(`/app/obras/${obra.id}`)}
        >
          <TableCell>{obra.nome}</TableCell>
          <TableCell>
            <Badge variant={obra.arquivada ? 'secondary' : 'default'}>
              {obra.arquivada ? 'Arquivada' : 'Ativa'}
            </Badge>
          </TableCell>
          <TableCell>
            <Progress value={calculateProgress(obra)} />
          </TableCell>
          <TableCell>{formatDate(obra.created_at)}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => openEditModal(obra)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => openArchiveConfirmation(obra)}
                >
                  Arquivar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### Anti-Patterns to Avoid

- **Direct Supabase calls in components:** Use data access layer functions
- **Passing entire store to components:** Use selectors
- **Inline Supabase error handling:** Centralize error handling with toast notifications
- **Form without defaultValues:** Always provide defaults to avoid controlled/uncontrolled warnings
- **Client-side filtering when RLS handles it:** Let RLS do the permission filtering

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Archive confirmation | Custom modal | AlertDialog | Semantically correct, accessible |
| Status badges | Custom styled spans | Badge component | Consistent with design system |
| Dropdown actions | Custom menu | DropdownMenu | Keyboard accessible, animations |
| Toast notifications | Alert or console.log | Sonner | Non-blocking, customizable |
| Loading skeletons | CSS animation | Skeleton component | Consistent styling |

## Common Pitfalls

### Pitfall 1: RLS Policy Errors Not Showing User-Friendly Messages

**What goes wrong:** Supabase returns "Row Level Security policy violation" without context
**Why it happens:** RLS is enforced server-side, errors are generic
**How to avoid:**
- Catch errors and map to user-friendly Portuguese messages
- Check user role before showing actions (hide archive button for non-admins)
**Warning signs:** Generic error messages in production

### Pitfall 2: Stale Data After Mutations

**What goes wrong:** List doesn't update after create/edit/archive
**Why it happens:** No cache invalidation or refetching
**How to avoid:**
- Use `router.refresh()` for Server Components
- Or maintain client-side state with Zustand and update optimistically
- Consider React Query/TanStack Query for complex caching needs
**Warning signs:** Need to refresh page to see changes

### Pitfall 3: N+1 Queries for Progress Calculation

**What goes wrong:** Fetching verification counts separately for each obra
**Why it happens:** Progress requires counting verificacoes per obra
**How to avoid:**
- Use Supabase RPC function for aggregated progress data
- Or batch query all progress data in one call
- Consider denormalized progress fields on obras table
**Warning signs:** Slow list page load with many obras

### Pitfall 4: Modal Form State Persistence

**What goes wrong:** Form keeps old values when opening for new create
**Why it happens:** Form state not reset between modal opens
**How to avoid:**
- Reset form when modal opens for create
- Use `key` prop on form to force remount
- Call `form.reset()` in onOpenChange
**Warning signs:** Edit values appearing in create modal

### Pitfall 5: Click Handler Conflicts (Row vs Dropdown)

**What goes wrong:** Clicking dropdown opens obra detail page
**Why it happens:** Click event bubbles from dropdown to row
**How to avoid:** Use `e.stopPropagation()` on dropdown trigger
**Warning signs:** Navigation happens when clicking actions

## Code Examples

### Complete Obra Form Modal

```typescript
// app/app/obras/_components/obra-form-modal.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { obraFormSchema, type ObraFormData, tipologiaOptions } from '@/lib/validations/obra'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface ObraFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<ObraFormData>
  onSubmit: (data: ObraFormData) => Promise<void>
  mode: 'create' | 'edit'
}

export function ObraFormModal({
  open,
  onOpenChange,
  defaultValues,
  onSubmit,
  mode,
}: ObraFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ObraFormData>({
    resolver: zodResolver(obraFormSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      tipologia: undefined,
      cidade: '',
      estado: '',
      responsavel_tecnico: '',
      ...defaultValues,
    },
  })

  const tipologia = watch('tipologia')

  const handleFormSubmit = async (data: ObraFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      toast.success(mode === 'create' ? 'Obra criada com sucesso' : 'Obra atualizada com sucesso')
      reset()
      onOpenChange(false)
    } catch (error) {
      toast.error('Erro ao salvar obra. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nova Obra' : 'Editar Obra'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nome (required) */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              {...register('nome')}
              className={errors.nome ? 'border-destructive' : ''}
            />
            {errors.nome && (
              <p className="text-destructive text-xs">{errors.nome.message}</p>
            )}
          </div>

          {/* Tipologia (optional) */}
          <div className="space-y-2">
            <Label htmlFor="tipologia">Tipologia</Label>
            <Select
              value={tipologia}
              onValueChange={(value) => setValue('tipologia', value as ObraFormData['tipologia'])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a tipologia" />
              </SelectTrigger>
              <SelectContent>
                {tipologiaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cidade / Estado */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" {...register('cidade')} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">UF</Label>
              <Input
                id="estado"
                {...register('estado')}
                maxLength={2}
                className={errors.estado ? 'border-destructive' : ''}
              />
              {errors.estado && (
                <p className="text-destructive text-xs">{errors.estado.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

### Archive Confirmation Dialog

```typescript
// app/app/obras/_components/archive-confirmation.tsx
'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ArchiveConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  obraName: string
  onConfirm: () => Promise<void>
  isArchiving: boolean
}

export function ArchiveConfirmation({
  open,
  onOpenChange,
  obraName,
  onConfirm,
  isArchiving,
}: ArchiveConfirmationProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Arquivar obra?</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja arquivar a obra "{obraName}"?
            A obra sera removida da lista principal, mas podera ser restaurada posteriormente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={onConfirm}
            disabled={isArchiving}
          >
            {isArchiving ? 'Arquivando...' : 'Arquivar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| useEffect for data fetching | Server Components + client mutations | Next.js 13+ | Better performance, SEO |
| Redux for CRUD state | Zustand or no global state | 2023+ | Simpler, less boilerplate |
| REST API calls | Supabase client with RLS | Supabase adoption | Type safety, real-time ready |

## Open Questions

1. **Progress calculation**
   - What we know: CONTEXT.md specifies progress bar column showing % of verificacoes completed
   - What's unclear: How to efficiently calculate progress (no verificacoes data yet)
   - Recommendation: For Phase 2, show placeholder or 0% - implement real progress when verificacoes exist

2. **TypeScript types for Supabase**
   - What we know: @supabase/supabase-js supports generated types
   - What's unclear: Whether types have been generated for this project
   - Recommendation: Generate types with `npx supabase gen types typescript --local > types/supabase.ts`

3. **Pagination**
   - What we know: CONTEXT.md mentions "based on volumetria 3-10 obras"
   - What's unclear: Whether pagination is needed for MVP
   - Recommendation: Skip pagination initially, add if obra count exceeds 20

## Implementation Recommendations

### Plan 02-01: Listagem de Obras

1. Add missing shadcn components (Dialog, Table, Progress, Skeleton, Sonner)
2. Create `/app/app/obras/page.tsx` with Server Component data fetching
3. Implement `ObrasTable` client component
4. Add toolbar with search input and status filter
5. Add empty state for no obras

### Plan 02-02: Criar Obra

1. Update `lib/validations/obra.ts` to match DB schema
2. Create `ObraFormModal` component
3. Create `lib/supabase/queries/obras.ts` with createObra function
4. Wire up modal trigger from list page
5. Add success toast and list refresh

### Plan 02-03: Editar e Arquivar

1. Add edit action to row dropdown (reuse `ObraFormModal` in edit mode)
2. Create `ArchiveConfirmation` AlertDialog
3. Add archive/restore actions with confirmation
4. Implement updateObra and archiveObra query functions
5. Handle archived obras in status filter

### Plan 02-04: Detalhes da Obra

1. Create `/app/app/obras/[id]/page.tsx`
2. Fetch obra data and display detail view
3. Implement context switch (sidebar should change per navigation docs)
4. For now, this page can be minimal - KPIs/dashboard come in Phase 6

## Sources

### Primary (HIGH confidence)
- `database/schema.sql` - Obras table definition, enums
- `database/rls-policies.sql` - RLS functions and policies
- `docs/design/DESIGN-SYSTEM.md` - Table, Modal, Badge patterns
- `.planning/phases/02-obras/02-CONTEXT.md` - User decisions

### Secondary (MEDIUM confidence)
- `docs/product/04_NAVIGATION.md` - Visao Global context, sidebar behavior
- `.planning/phases/01-foundation/01-RESEARCH.md` - Established patterns

### Tertiary (LOW confidence)
- shadcn/ui documentation for Dialog, Table components (need to verify current API)

## Metadata

**Confidence breakdown:**
- Schema analysis: HIGH - Directly from database files
- Existing patterns: HIGH - Code inspection of Phase 1 implementation
- UI components: MEDIUM - Need to verify Dialog/Table shadcn CLI output
- RLS behavior: MEDIUM - Based on policy definitions, not runtime testing

**Research date:** 2026-01-19
**Valid until:** 2026-02-19 (30 days - stable patterns)
