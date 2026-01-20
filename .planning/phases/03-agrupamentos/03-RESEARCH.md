# Phase 3: Agrupamentos - Research

**Researched:** 2026-01-20
**Domain:** React UI (CRUD, drag-and-drop reordering, batch creation)
**Confidence:** HIGH

## Summary

Phase 3 implements CRUD operations for Agrupamentos (groupings/blocks within a construction site). Agrupamentos are simple containers for Unidades (units) with only `nome` and `ordem` fields. The phase requires a dedicated page at `/app/obras/[id]/agrupamentos`, table display, create/edit modal, delete confirmation, batch creation, and drag-and-drop reordering.

The implementation follows established patterns from Phase 2 (Obras) for data access layer, table components, modals, and confirmation dialogs. The main new element is drag-and-drop reordering, for which **@dnd-kit** is the recommended library.

**Primary recommendation:** Reuse existing patterns from Obras (queries, table, modal, confirmation), add @dnd-kit for reordering, implement batch creation as a toggle in the create modal.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @dnd-kit/core | ^6.x | Drag-and-drop primitives | Modern, lightweight, accessible, actively maintained |
| @dnd-kit/sortable | ^8.x | Sortable list preset | Built specifically for list reordering use case |
| @dnd-kit/utilities | ^3.x | Transform CSS utilities | Helper for drag transforms |
| react-hook-form | existing | Form validation | Already in project, proven pattern |
| zod | existing | Schema validation | Already in project, TypeScript-first |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @dnd-kit/modifiers | ^7.x | Drag modifiers | Optional: restrict axis, snap to grid |
| sonner | existing | Toast notifications | Already in project for success/error feedback |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @dnd-kit | hello-pangea/dnd | Less customization, but simpler API if only basic list sorting |
| @dnd-kit | Native HTML5 drag | No accessibility, poor mobile support |
| @dnd-kit | react-beautiful-dnd | DEPRECATED (archived Aug 2025) |

**Installation:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

## Architecture Patterns

### Recommended Project Structure
```
arden/app/app/obras/[id]/
├── agrupamentos/
│   ├── page.tsx                      # Server Component (data fetching)
│   └── _components/
│       ├── agrupamentos-page-client.tsx   # Client wrapper (modal state)
│       ├── agrupamentos-table.tsx         # Table with toolbar
│       ├── agrupamento-form-modal.tsx     # Create/Edit modal (mode prop)
│       ├── delete-confirmation.tsx        # Delete confirmation dialog
│       └── sortable-item.tsx              # Drag handle + row for reorder mode
└── _components/                       # Shared obra-level components (if any)

arden/lib/supabase/queries/
└── agrupamentos.ts                    # Data access layer

arden/lib/validations/
└── agrupamento.ts                     # Zod schemas
```

### Pattern 1: Data Access Layer
**What:** Centralized Supabase queries in `lib/supabase/queries/agrupamentos.ts`
**When to use:** All database operations for agrupamentos
**Example:**
```typescript
// Source: Existing pattern from lib/supabase/queries/obras.ts
export interface Agrupamento {
  id: string
  obra_id: string
  nome: string
  ordem: number
  created_at: string
  updated_at: string
}

export interface AgrupamentoWithCount extends Agrupamento {
  unidades_count: number
}

export async function listAgrupamentos(obraId: string): Promise<AgrupamentoWithCount[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('agrupamentos')
    .select(`
      *,
      unidades_count:unidades(count)
    `)
    .eq('obra_id', obraId)
    .order('ordem', { ascending: true })

  if (error) throw new Error(`Erro ao listar agrupamentos: ${error.message}`)
  return data || []
}
```

### Pattern 2: Server Component + Client Wrapper
**What:** Server Component fetches data, Client Component handles UI state
**When to use:** Pages with modals, interactive elements
**Example:**
```typescript
// page.tsx (Server Component)
export default async function AgrupamentosPage({ params }: Props) {
  const { id } = await params  // Next.js 15 async params
  const agrupamentos = await listAgrupamentos(id)
  return <AgrupamentosPageClient obraId={id} initialAgrupamentos={agrupamentos} />
}

// _components/agrupamentos-page-client.tsx (Client Component)
'use client'
export function AgrupamentosPageClient({ obraId, initialAgrupamentos }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  // ... modal state management
}
```

### Pattern 3: Modal Mode Prop
**What:** Single modal component handles both create and edit modes
**When to use:** Any entity with create/edit modal
**Example:**
```typescript
// Source: Existing pattern from _components/obra-form-modal.tsx
interface AgrupamentoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  mode?: 'create' | 'edit'
  agrupamento?: Agrupamento | null
  obraId: string
}
```

### Pattern 4: Drag-and-Drop Reorder Mode
**What:** Explicit edit mode for reordering with save/cancel
**When to use:** When reordering should be a deliberate action
**Example:**
```typescript
// Source: dnd-kit official docs
const [isReorderMode, setIsReorderMode] = useState(false)
const [pendingOrder, setPendingOrder] = useState<string[]>([])

// Enter reorder mode
const handleStartReorder = () => {
  setPendingOrder(agrupamentos.map(a => a.id))
  setIsReorderMode(true)
}

// Save new order
const handleSaveOrder = async () => {
  await updateAgrupamentosOrder(obraId, pendingOrder)
  setIsReorderMode(false)
  router.refresh()
}

// Cancel reorder
const handleCancelReorder = () => {
  setPendingOrder([])
  setIsReorderMode(false)
}
```

### Anti-Patterns to Avoid
- **Auto-save on drag end:** User expects explicit confirmation for bulk changes
- **Inline editing while reordering:** Confusing UX, separate modes
- **Hard delete without confirmation:** Always confirm, even for empty agrupamentos
- **Creating new queries file patterns:** Follow existing `lib/supabase/queries/*.ts` pattern

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag-and-drop | Custom drag handlers | @dnd-kit/sortable | Accessibility, keyboard support, touch support, animations |
| Array reordering | Manual splice/shift | arrayMove from @dnd-kit | Handles edge cases, immutable |
| Form validation | Manual if/else | Zod + react-hook-form | Type safety, consistent error messages |
| Toast feedback | Custom alert | sonner (already installed) | Consistent UX, auto-dismiss |
| Confirmation dialog | Custom modal | AlertDialog component | Already exists in components/ui |

**Key insight:** The only truly new functionality is the drag-and-drop reordering. Everything else follows established patterns from Phase 2.

## Common Pitfalls

### Pitfall 1: Forgetting async params in Next.js 15
**What goes wrong:** Runtime error when accessing route params
**Why it happens:** Next.js 15+ changed params to Promise
**How to avoid:** Always `await params` before destructuring
**Warning signs:** TypeError about accessing property of Promise

### Pitfall 2: Drag-and-drop breaking on touch devices
**What goes wrong:** Drag doesn't work on mobile/tablet
**Why it happens:** Using only PointerSensor without TouchSensor
**How to avoid:** Configure both PointerSensor and TouchSensor
**Warning signs:** Works on desktop, fails on mobile

### Pitfall 3: Order conflicts on concurrent edits
**What goes wrong:** Two users reorder simultaneously, one overwrites other
**Why it happens:** No optimistic locking on `ordem` field
**How to avoid:** Accept this for MVP (low risk - admin only), add updated_at check in future
**Warning signs:** Order unexpectedly changes after save

### Pitfall 4: Cascade delete without proper warning
**What goes wrong:** User deletes agrupamento with unidades, loses data
**Why it happens:** Delete confirmation doesn't show unidades count
**How to avoid:** Fetch unidades_count, show in confirmation dialog
**Warning signs:** User surprised by data loss

### Pitfall 5: Batch creation validation edge cases
**What goes wrong:** Invalid batch parameters (negative count, too many items)
**Why it happens:** Client-side validation not thorough
**How to avoid:** Validate: count > 0, count <= 100, startNumber >= 0
**Warning signs:** Error on submit, or server rejects request

## Code Examples

Verified patterns from official sources:

### dnd-kit Sortable List Setup
```typescript
// Source: https://docs.dndkit.com/presets/sortable
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

function ReorderableList({ items, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)
      onReorder(arrayMove(items, oldIndex, newIndex))
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        {items.map(item => (
          <SortableItem key={item.id} id={item.id} item={item} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
```

### Sortable Item Component
```typescript
// Source: https://docs.dndkit.com/presets/sortable/usesortable
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

function SortableItem({ id, item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <button {...attributes} {...listeners} className="cursor-grab">
          <GripVertical className="h-4 w-4 text-foreground-muted" />
        </button>
      </TableCell>
      <TableCell>{item.nome}</TableCell>
      {/* ... */}
    </TableRow>
  )
}
```

### Batch Creation Logic
```typescript
// Generate batch names from prefix, count, startNumber
function generateBatchNames(prefix: string, count: number, startNumber: number): string[] {
  return Array.from({ length: count }, (_, i) => `${prefix} ${startNumber + i}`)
}

// Example: generateBatchNames("Bloco", 5, 3)
// Returns: ["Bloco 3", "Bloco 4", "Bloco 5", "Bloco 6", "Bloco 7"]

// Batch insert with transaction
export async function createAgrupamentosBatch(
  obraId: string,
  names: string[]
): Promise<Agrupamento[]> {
  const supabase = createClient()

  // Get current max ordem
  const { data: existing } = await supabase
    .from('agrupamentos')
    .select('ordem')
    .eq('obra_id', obraId)
    .order('ordem', { ascending: false })
    .limit(1)

  const startOrdem = (existing?.[0]?.ordem ?? -1) + 1

  const records = names.map((nome, index) => ({
    obra_id: obraId,
    nome,
    ordem: startOrdem + index,
  }))

  const { data, error } = await supabase
    .from('agrupamentos')
    .insert(records)
    .select()

  if (error) throw new Error(`Erro ao criar agrupamentos: ${error.message}`)
  return data
}
```

### Update Order Batch
```typescript
// Update ordem for all agrupamentos in one call
export async function updateAgrupamentosOrder(
  obraId: string,
  orderedIds: string[]
): Promise<void> {
  const supabase = createClient()

  // Use Promise.all for parallel updates
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('agrupamentos')
      .update({ ordem: index })
      .eq('id', id)
      .eq('obra_id', obraId)  // Security: ensure belongs to obra
  )

  const results = await Promise.all(updates)
  const errors = results.filter(r => r.error)

  if (errors.length > 0) {
    throw new Error('Erro ao atualizar ordem dos agrupamentos')
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-beautiful-dnd | @dnd-kit | Aug 2025 | react-beautiful-dnd deprecated, use @dnd-kit for new projects |
| Next.js sync params | Next.js async params | Next.js 15 | Must await params in server components |
| getServerSideProps | Server Components | Next.js 13+ | Fetch data directly in async component |

**Deprecated/outdated:**
- react-beautiful-dnd: Repository archived Aug 2025, use @dnd-kit
- react-sortable-hoc: Deprecated, use @dnd-kit

## Open Questions

Things that couldn't be fully resolved:

1. **Optimistic locking for order changes**
   - What we know: Two admins could reorder simultaneously
   - What's unclear: How likely this is in practice (probably rare)
   - Recommendation: Accept for MVP, add updated_at check post-MVP if needed

2. **Maximum batch size limit**
   - What we know: Need to prevent creating 1000+ agrupamentos at once
   - What's unclear: What's a reasonable limit
   - Recommendation: Limit to 100 in client validation, matches typical construction scale

## Sources

### Primary (HIGH confidence)
- @dnd-kit official documentation: https://docs.dndkit.com/presets/sortable
- Existing codebase patterns: `arden/lib/supabase/queries/obras.ts`, `arden/app/app/obras/_components/`
- Database schema: `database/schema.sql` (lines 267-279 for agrupamentos table)
- RLS policies: `database/rls-policies.sql` (lines 212-244 for agrupamentos policies)

### Secondary (MEDIUM confidence)
- npm trends comparison: https://npmtrends.com/@dnd-kit/core-vs-react-beautiful-dnd
- dnd-kit GitHub discussions: https://github.com/clauderic/dnd-kit/discussions/481

### Tertiary (LOW confidence)
- Blog posts on drag-and-drop patterns (for general UX guidance)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - @dnd-kit is clearly the current standard, well-documented
- Architecture: HIGH - Following established patterns from Phase 2 implementation
- Pitfalls: HIGH - Based on actual codebase analysis and official docs

**Research date:** 2026-01-20
**Valid until:** 2026-03-20 (60 days - stable libraries, no expected breaking changes)

---

## Quick Reference: Database Schema

```sql
-- From database/schema.sql lines 267-279
CREATE TABLE agrupamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,

  nome VARCHAR(100) NOT NULL,
  ordem INT DEFAULT 0,  -- For ordering in UI

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agrupamentos_obra ON agrupamentos(obra_id);
```

**Key observations:**
- CASCADE DELETE from obras - if obra is deleted, agrupamentos go too
- No soft delete (arquivada) field - use hard delete
- Simple structure: just nome and ordem
- `updated_at` trigger exists for automatic timestamp updates

## Quick Reference: Available UI Components

From `arden/components/ui/`:
- `table.tsx` - Table, TableHeader, TableBody, TableRow, TableCell, TableHead
- `dialog.tsx` - Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
- `alert-dialog.tsx` - AlertDialog for confirmations
- `button.tsx` - Button with variants
- `input.tsx` - Input component
- `label.tsx` - Label component
- `dropdown-menu.tsx` - DropdownMenu for actions
- `skeleton.tsx` - Loading skeletons
- `badge.tsx` - Status badges (if needed)

**Not yet available:**
- No dedicated drag handle component (create simple one with GripVertical icon)
