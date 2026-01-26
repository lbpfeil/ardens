# Phase 8: Verificação Individual - Research

**Researched:** 2026-01-26
**Domain:** Form-based CRUD UI with toggles, Server Actions, database queries
**Confidence:** HIGH

## Summary

Phase 8 implements a dedicated page for individual verification of a single service in a single unit, where the engineer evaluates each inspection item with C/NC/NA toggles. The page shows a checklist of items with inline toggle controls, automatic result calculation, and modal-based flows for detailed views and NC observations.

The standard approach combines Radix UI ToggleGroup components for the C/NC/NA controls, React Hook Form with Zod for validation, Server Actions for mutations, and Supabase queries for data fetching. The existing project has established patterns for modal-based forms, Server Actions with ActionResult type, and query-based data loading that must be followed.

**Primary recommendation:** Use Radix UI ToggleGroup (type="single") wrapped in React Hook Form Controller for each item's C/NC/NA toggle, implement Server Actions for marking items individually, and follow existing page structure patterns (Server Component + Client Component split).

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React Hook Form | 7.x | Form state management | Industry standard for complex forms, minimal re-renders, excellent TypeScript support |
| Zod | 3.x | Schema validation | Type-safe validation, works seamlessly with RHF, already used project-wide |
| Radix UI ToggleGroup | 1.x | Toggle button controls | Accessible primitives, keyboard nav, matches Supabase design system |
| Radix UI Dialog | 1.x | Modal overlays | Composable, accessible, consistent with existing modals |
| Radix UI AlertDialog | 1.x | Confirmation dialogs | Distinct semantics for destructive actions |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | Latest | Icons | Existing icon library, use Check/X/Ban for C/NC/NA |
| sonner | Latest | Toast notifications | Already integrated, use for success/error feedback |
| next/navigation | Latest | URL params, routing | Reading verificacaoId from route params |
| date-fns | Latest | Date formatting | Existing date utility, format timestamps |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ToggleGroup | Custom Button group | ToggleGroup provides accessibility, keyboard nav, and ARIA out of box |
| React Hook Form | useState | RHF handles validation, errors, and submission state better for forms |
| Radix Dialog | HTML dialog | Radix provides consistent styling, better accessibility, and animation hooks |

**Installation:**

All libraries already installed in project. No new dependencies required.

## Architecture Patterns

### Recommended Project Structure

```
app/app/obras/[id]/verificacoes/[verificacaoId]/
├── page.tsx                           # Server Component: fetch data, render layout
└── _components/
    ├── verificacao-individual-client.tsx   # Client Component: main UI orchestrator
    ├── item-checklist.tsx                  # Item list with toggles
    ├── item-detail-modal.tsx               # Modal showing Observação/Método/Tolerância
    ├── item-nc-modal.tsx                   # Modal for NC observation (required)
    └── verificacao-header.tsx              # Header: service + unit + obra identification
```

### Pattern 1: Server Component Page Structure

**What:** Next.js 14+ App Router pattern separating server-side data fetching from client interactivity.

**When to use:** All pages. Fetch data at server boundary, pass as props to client components.

**Example:**

```typescript
// app/app/obras/[id]/verificacoes/[verificacaoId]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { VerificacaoIndividualClient } from './_components/verificacao-individual-client'

export default async function VerificacaoIndividualPage({
  params,
}: {
  params: { id: string; verificacaoId: string }
}) {
  const supabase = await createClient()

  // Fetch verificacao with joined data
  const { data: verificacao } = await supabase
    .from('verificacoes')
    .select(`
      *,
      servicos(id, nome, codigo),
      unidades(id, nome),
      obras(id, nome)
    `)
    .eq('id', params.verificacaoId)
    .single()

  // Fetch items with template data
  const { data: itens } = await supabase
    .from('itens_verificacao')
    .select(`
      *,
      itens_servico(id, observacao, metodo, tolerancia, ordem)
    `)
    .eq('verificacao_id', params.verificacaoId)
    .order('itens_servico(ordem)', { ascending: true })

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-4xl mx-auto">
        <VerificacaoIndividualClient
          verificacao={verificacao}
          itens={itens}
        />
      </div>
    </div>
  )
}
```

**Key:** Server Component fetches data with single query including all needed joins, passes to Client Component.

### Pattern 2: ToggleGroup with React Hook Form

**What:** Radix UI ToggleGroup integrated with React Hook Form via Controller component.

**When to use:** For C/NC/NA toggle controls that need validation and form integration.

**Example:**

```typescript
// _components/item-checklist.tsx (excerpt)
'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as ToggleGroup from '@radix-ui/react-toggle-group'
import { Check, X, Ban } from 'lucide-react'

interface ItemChecklistProps {
  itens: ItemVerificacao[]
  onItemMark: (itemId: string, status: Status) => Promise<void>
}

export function ItemChecklist({ itens, onItemMark }: ItemChecklistProps) {
  const { control } = useForm()

  return (
    <div className="space-y-2">
      {itens.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-3 rounded-md border border-border hover:bg-surface-100">
          <div className="flex-1 cursor-pointer" onClick={() => openDetailModal(item)}>
            <p className="text-sm text-foreground">{item.itens_servico.observacao}</p>
          </div>

          <Controller
            control={control}
            name={`item-${item.id}`}
            defaultValue={item.status}
            render={({ field }) => (
              <ToggleGroup.Root
                type="single"
                value={field.value}
                onValueChange={async (value) => {
                  if (value) {
                    field.onChange(value)
                    if (value === 'nao_conforme') {
                      // Open NC modal for required observation
                      openNCModal(item)
                    } else {
                      await onItemMark(item.id, value as Status)
                    }
                  }
                }}
                className="inline-flex rounded-md border border-border"
              >
                <ToggleGroup.Item
                  value="conforme"
                  className="px-3 py-1.5 text-xs data-[state=on]:bg-brand data-[state=on]:text-white hover:bg-surface-200 transition-colors"
                >
                  <Check className="h-4 w-4" />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="nao_conforme"
                  className="px-3 py-1.5 text-xs data-[state=on]:bg-destructive data-[state=on]:text-white hover:bg-surface-200 transition-colors"
                >
                  <X className="h-4 w-4" />
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="excecao"
                  className="px-3 py-1.5 text-xs data-[state=on]:bg-warning data-[state=on]:text-white hover:bg-surface-200 transition-colors"
                >
                  <Ban className="h-4 w-4" />
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            )}
          />
        </div>
      ))}
    </div>
  )
}
```

**Key:** Controller wraps ToggleGroup, field.onChange updates form state, onValueChange triggers Server Action.

### Pattern 3: Server Action with Optimistic Updates

**What:** Mutation via Server Action with immediate UI feedback, then revalidation.

**When to use:** For all mutations (mark item, update verification).

**Example:**

```typescript
// _components/verificacao-individual-client.tsx (excerpt)
'use client'

import { useState, useTransition } from 'react'
import { marcarItemVerificacao } from '@/lib/supabase/actions/itens-verificacao'
import { toast } from 'sonner'

export function VerificacaoIndividualClient({ verificacao, itens: initialItens }) {
  const [itens, setItens] = useState(initialItens)
  const [isPending, startTransition] = useTransition()

  const handleItemMark = async (itemId: string, status: Status, observacao?: string) => {
    // Optimistic update
    setItens((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status, data_inspecao: new Date().toISOString() }
          : item
      )
    )

    // Server mutation
    startTransition(async () => {
      const result = await marcarItemVerificacao({
        item_verificacao_id: itemId,
        status,
        observacao,
      })

      if (result.error) {
        toast.error(result.error)
        // Rollback optimistic update
        setItens(initialItens)
      } else {
        toast.success('Item marcado com sucesso')
        // Page revalidation happens via revalidatePath in Server Action
      }
    })
  }

  return (
    <div>
      <ItemChecklist itens={itens} onItemMark={handleItemMark} />
      {isPending && <div>Salvando...</div>}
    </div>
  )
}
```

**Key:** Optimistic update for instant feedback, startTransition for non-blocking mutation, rollback on error.

### Pattern 4: Modal for NC Observation

**What:** Radix Dialog with form for required NC observation.

**When to use:** When user marks item as NC, modal intercepts before Server Action.

**Example:**

```typescript
// _components/item-nc-modal.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const ncSchema = z.object({
  observacao: z.string().min(1, 'Observação é obrigatória para NC'),
})

interface ItemNCModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ItemVerificacao
  onConfirm: (observacao: string) => Promise<void>
}

export function ItemNCModal({ open, onOpenChange, item, onConfirm }: ItemNCModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(ncSchema),
  })

  const onSubmit = async (data: { observacao: string }) => {
    await onConfirm(data.observacao)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Não Conformidade</DialogTitle>
          <p className="text-sm text-foreground-light mt-2">
            {item.itens_servico.observacao}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="observacao">Observação (obrigatória)</Label>
            <Textarea
              id="observacao"
              {...register('observacao')}
              placeholder="Descreva o problema encontrado..."
              rows={4}
              className="mt-2"
            />
            {errors.observacao && (
              <p className="text-xs text-destructive mt-1">{errors.observacao.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Marcar NC'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Key:** Modal blocks submission until observation is provided, validates with Zod, calls onConfirm callback with observation.

### Pattern 5: Item Detail Modal

**What:** Read-only modal showing item template fields (Observação, Método, Tolerância).

**When to use:** When user clicks on item row (outside toggle), opens non-blocking detail view.

**Example:**

```typescript
// _components/item-detail-modal.tsx
'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ItemDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ItemVerificacao
}

export function ItemDetailModal({ open, onOpenChange, item }: ItemDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium text-foreground-muted uppercase mb-2">
              O que verificar
            </h4>
            <p className="text-sm text-foreground">{item.itens_servico.observacao}</p>
          </div>

          {item.itens_servico.metodo && (
            <div>
              <h4 className="text-xs font-medium text-foreground-muted uppercase mb-2">
                Como verificar
              </h4>
              <p className="text-sm text-foreground-light">{item.itens_servico.metodo}</p>
            </div>
          )}

          {item.itens_servico.tolerancia && (
            <div>
              <h4 className="text-xs font-medium text-foreground-muted uppercase mb-2">
                Critério de aceitação
              </h4>
              <p className="text-sm text-foreground-light">{item.itens_servico.tolerancia}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

**Key:** Simple read-only display, no form, closes on outside click or Escape.

### Anti-Patterns to Avoid

- **Fetching data in Client Components:** Always fetch at Server Component boundary, pass as props
- **Using useState for toggle state:** Use React Hook Form to centralize form state and validation
- **Manual ARIA attributes on ToggleGroup:** Radix handles accessibility, don't override
- **Optimistic updates without rollback:** Always handle error case and revert state on failure
- **Blocking UI during mutation:** Use useTransition for non-blocking mutations with loading states

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toggle button group | Custom div + onClick handlers | Radix UI ToggleGroup | Handles keyboard nav, ARIA, focus management, roving tabindex |
| Form validation | Manual error state + regex | Zod + React Hook Form | Type-safe, composable, handles async validation, error messages |
| Modal focus trap | Custom event listeners | Radix Dialog | Manages focus, Escape key, outside click, scroll lock |
| Optimistic UI | Manual state sync | React useTransition + useState | Coordinates pending state, automatic batching, error boundaries |
| Date formatting | Manual string manipulation | date-fns | Handles locales, timezones, edge cases, i18n |

**Key insight:** UI primitives like toggles and modals have complex accessibility requirements (keyboard navigation, screen reader support, focus management) that are error-prone to implement manually. Radix UI primitives are battle-tested and match the existing Supabase design system.

## Common Pitfalls

### Pitfall 1: ToggleGroup Losing Selection on Empty Value

**What goes wrong:** ToggleGroup with `type="single"` allows deselecting by clicking active item, resulting in empty value. User marks item as C, clicks C again, status becomes unset.

**Why it happens:** Radix ToggleGroup single mode allows toggling off by design (WAI-ARIA toggle pattern).

**How to avoid:** Prevent empty selection in onValueChange handler:

```typescript
onValueChange={(value) => {
  if (value) {
    field.onChange(value)
    // Only proceed if value is not empty
  }
}}
```

**Warning signs:** User clicks toggle and status becomes "nao_verificado" unexpectedly.

---

### Pitfall 2: Verificação Travada Not Enforced in UI

**What goes wrong:** User can click toggles on a Conforme (travada) verification, mutation fails server-side, shows error toast. Frustrating UX.

**Why it happens:** UI doesn't disable toggles based on verification status.

**How to avoid:** Check verification status and disable toggles if travada:

```typescript
const isVerificacaoTravada =
  verificacao.status === 'concluida' &&
  verificacao.total_itens > 0 &&
  verificacao.itens_conformes === verificacao.total_itens

// In ToggleGroup
<ToggleGroup.Root
  disabled={isVerificacaoTravada}
  // ...
>
```

Display banner at top: "Verificação Conforme — não pode ser alterada".

**Warning signs:** Toast errors saying "Verificação Conforme é travada" when user clicks toggles.

---

### Pitfall 3: Race Condition in Optimistic Updates

**What goes wrong:** User rapidly clicks multiple toggles, optimistic updates apply in wrong order, final state doesn't match server.

**Why it happens:** Async Server Actions complete out of order, setItens calls interleave.

**How to avoid:** Use functional setState to base updates on previous state:

```typescript
setItens((prev) =>
  prev.map((item) =>
    item.id === itemId ? { ...item, status } : item
  )
)
```

Alternative: Disable toggles while isPending to prevent concurrent mutations.

**Warning signs:** Item status flickers between values, final state inconsistent with last click.

---

### Pitfall 4: NC Modal Dismissed Without Observation

**What goes wrong:** User marks NC, modal opens, user clicks outside or presses Escape, modal closes without submitting. Item status is not updated (still shows previous status).

**Why it happens:** Radix Dialog allows dismissing by default. ToggleGroup onValueChange was called but Server Action was never invoked.

**How to avoid:** Control modal dismissal and rollback toggle on cancel:

```typescript
// In ItemChecklist
const [pendingNC, setPendingNC] = useState<{ itemId: string; item: ItemVerificacao } | null>(null)

// ToggleGroup onValueChange
if (value === 'nao_conforme') {
  setPendingNC({ itemId: item.id, item })
  // Don't call field.onChange yet
}

// NC Modal onConfirm
const handleNCConfirm = async (observacao: string) => {
  await onItemMark(pendingNC!.itemId, 'nao_conforme', observacao)
  setPendingNC(null)
}

// NC Modal onOpenChange
const handleNCCancel = () => {
  // Rollback toggle to previous state
  setPendingNC(null)
}
```

**Warning signs:** User clicks NC, closes modal, toggle shows NC but Server Action never fired.

---

### Pitfall 5: Missing Revalidation After Mutation

**What goes wrong:** User marks item, sees toast success, but counter/banner doesn't update (e.g., "3 de 10 itens verificados" still shows old count).

**Why it happens:** Server Action updates database but page wasn't revalidated, Server Component still renders stale data.

**How to avoid:** Always call `revalidatePath` in Server Action:

```typescript
// In Server Action
import { revalidatePath } from 'next/cache'

export async function marcarItemVerificacao(input: MarcarItemInput) {
  // ... mutation logic ...

  // Revalidate page
  revalidatePath(`/app/obras/${obra_id}/verificacoes/${verificacao_id}`)

  return { data: { id: item_verificacao_id } }
}
```

**Warning signs:** Counters/banners don't update after mutation, requires manual page refresh.

## Code Examples

Verified patterns from existing codebase:

### Server Action Pattern (from itens-verificacao.ts)

```typescript
// lib/supabase/actions/itens-verificacao.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  marcarItemSchema,
  type MarcarItemInput,
  type ActionResult,
} from '@/lib/validations/verificacao'

export async function marcarItemVerificacao(
  input: MarcarItemInput
): Promise<ActionResult<{ id: string }>> {
  // 1. Validate input
  const parsed = marcarItemSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { item_verificacao_id, status, observacao } = parsed.data

  // 2. Check immutability (verificação travada)
  const { data: item, error: fetchError } = await supabase
    .from('itens_verificacao')
    .select('id, verificacoes(obra_id, status, itens_conformes, total_itens)')
    .eq('id', item_verificacao_id)
    .single()

  if (fetchError || !item) {
    return { error: 'Item não encontrado' }
  }

  const verificacao = item.verificacoes as any

  if (
    verificacao.status === 'concluida' &&
    verificacao.total_itens > 0 &&
    verificacao.itens_conformes === verificacao.total_itens
  ) {
    return { error: 'Verificação Conforme é travada e não pode ser alterada' }
  }

  // 3. Update item
  const { error: updateError } = await supabase
    .from('itens_verificacao')
    .update({
      status,
      observacao: observacao || null,
      data_inspecao: new Date().toISOString(),
    })
    .eq('id', item_verificacao_id)

  if (updateError) {
    return { error: `Erro ao marcar item: ${updateError.message}` }
  }

  // 4. Revalidate page
  revalidatePath(`/app/obras/${verificacao.obra_id}`)

  return { data: { id: item_verificacao_id } }
}
```

**Source:** Project codebase `arden/lib/supabase/actions/itens-verificacao.ts`

### React Hook Form with Modal Pattern (from servico-form-modal.tsx)

```typescript
// _components/servico-form-modal.tsx (adapted)
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface FormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function FormModal({ open, onOpenChange, onSuccess }: FormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(mySchema),
    defaultValues: { field: '' },
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      const result = await myServerAction(data)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Salvo com sucesso')
        onOpenChange(false)
        onSuccess()
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Título do Modal</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="field">Campo</Label>
            <Input id="field" {...register('field')} />
            {errors.field && (
              <p className="text-xs text-destructive mt-1">{errors.field.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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

**Source:** Adapted from `arden/app/app/biblioteca/_components/servico-form-modal.tsx`

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| React Context for forms | React Hook Form + Zod | 2022-2023 | Reduced re-renders, better performance, type-safe validation |
| Custom toggle components | Radix UI primitives | 2021-2022 | Accessibility built-in, less maintenance |
| Client-side mutations | Server Actions | Next.js 14 (2023) | Simpler data flow, automatic revalidation, no API routes |
| Manual optimistic updates | useTransition + revalidatePath | React 18 (2022) | Coordinated pending states, less boilerplate |
| Manual focus management | Radix Dialog focus trap | 2021 | Handles edge cases, WCAG compliant |

**Deprecated/outdated:**

- **API Routes for mutations:** Replaced by Server Actions in Next.js 14+. Server Actions provide better DX (co-located with components), automatic serialization, and built-in revalidation.
- **Custom form validation:** Replaced by Zod + React Hook Form. Manual validation is error-prone and lacks type safety.
- **Material-UI or Ant Design:** Not used in this project. Radix UI + Tailwind CSS matches Supabase design system and provides lower-level control.

## Open Questions

Things that couldn't be fully resolved:

1. **Reinspeção Flow in Web Portal**
   - What we know: Mobile app has 4-state reinspeção (conforme_apos_reinspecao, retrabalho, aprovado_com_concessao, reprovado_apos_retrabalho)
   - What's unclear: Should web portal expose full reinspeção flow or simplify to "resolver NC" (binary)?
   - Recommendation: Start with simplified binary flow (resolve/reject), defer 4-state to Phase 11 (integration) based on user feedback. Context says "Fluxo de reinspeção no portal web" is Claude's discretion.

2. **Descrição Geral Positioning**
   - What we know: Textarea for general verification observation (VERIF-04) should be visible
   - What's unclear: Top (above checklist) or bottom (below checklist)?
   - Recommendation: Place at top for visibility before user starts marking items. Sticky positioning if checklist is long.

3. **Exceção Flow**
   - What we know: "Marcar como Exceção" button should be in header, requires justification modal
   - What's unclear: Does marking Exceção also mark all items as 'excecao', or just change verification status?
   - Recommendation: Based on schema logic, Exceção should mark all items as 'excecao' status (NA), since verification result is derived from items. Confirm with user during planning.

4. **Banner Position for Concluída**
   - What we know: Banner should show "Verificação concluída — Conforme" or "Verificação concluída — Não Conforme"
   - What's unclear: Fixed at top or inline after last item?
   - Recommendation: Fixed at top with Alert component (green for Conforme, red for NC), always visible regardless of scroll.

## Sources

### Primary (HIGH confidence)

- [Radix UI ToggleGroup](https://www.radix-ui.com/primitives/docs/components/toggle-group) - Official API reference, keyboard navigation, accessibility features
- [Radix UI Dialog](https://www.radix-ui.com/primitives/docs/components/dialog) - Modal implementation patterns
- Project codebase:
  - `arden/lib/supabase/actions/itens-verificacao.ts` - Server Action pattern with ActionResult
  - `arden/lib/supabase/actions/verificacoes.ts` - Verification mutation patterns
  - `arden/lib/validations/verificacao.ts` - Zod schemas, ActionResult type
  - `arden/app/app/biblioteca/_components/servico-form-modal.tsx` - React Hook Form + modal pattern
  - `docs/design/DESIGN-SYSTEM.md` - Component catalog, styling conventions
  - `database/schema.sql` - Database structure, enums, triggers

### Secondary (MEDIUM confidence)

- [React Hook Form with toggle buttons discussion](https://github.com/orgs/react-hook-form/discussions/8247) - Controller pattern for custom components
- [shadcn/ui React Hook Form docs](https://ui.shadcn.com/docs/forms/react-hook-form) - Form integration patterns
- Project context document - Phase 8 implementation decisions (CONTEXT.md)

### Tertiary (LOW confidence)

- Web search results on React Hook Form best practices 2026 - General patterns, not project-specific

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All libraries already in use, patterns verified in codebase
- Architecture: HIGH - Existing Server Actions and page patterns match requirements exactly
- Pitfalls: HIGH - Based on real production issues (toggle deselection, race conditions, revalidation)

**Research date:** 2026-01-26
**Valid until:** 60 days (March 2026) - Stack is stable, unlikely to change before Phase 8 implementation
