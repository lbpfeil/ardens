# Phase 4: Unidades - Research

**Researched:** 2026-01-20
**Domain:** React UI (Split-view layout, CRUD, batch creation with numeric range, alphanumeric sorting)
**Confidence:** HIGH

## Summary

Phase 4 implements CRUD operations for Unidades (units within agrupamentos/groupings). This phase introduces a split-view (master-detail) layout where agrupamentos appear on the left panel and unidades for the selected agrupamento appear on the right panel. The main new elements compared to Phase 3 are:

1. **Split-view Layout** - A responsive master-detail pattern for desktop (40%/60% split) with vertical stacking on mobile
2. **Selection State** - Visual indication of selected agrupamento with highlight and brand-colored border
3. **Numeric Range Batch Creation** - Parse "Apto 101-110" format to create 10 units
4. **Alphanumeric Natural Sorting** - Sort units so "Apto 2" comes before "Apto 10"
5. **Badge Count Display** - Show unit counts inline with agrupamento names

The implementation reuses extensive patterns from Phase 3 (Agrupamentos): data access layer, form modals, delete confirmation, and toast feedback. No new library dependencies are required - natural sorting uses the browser's built-in `Intl.Collator` API.

**Primary recommendation:** Transform the agrupamentos page into a split-view layout, create unidades data layer following agrupamentos.ts pattern, implement numeric range parser, and use `Intl.Collator` for natural sorting.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-hook-form | existing | Form validation | Already in project, proven pattern from Phase 3 |
| zod | existing | Schema validation | Already in project, TypeScript-first |
| sonner | existing | Toast notifications | Already in project for success/error feedback |
| Intl.Collator | built-in | Alphanumeric sorting | Browser native, excellent performance, no dependency |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| parse-numeric-range | ^3.0.0 | Parse "101-110" format | Optional - can be hand-rolled for simple cases |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Intl.Collator | localeCompare() | Same result, Collator is faster for large lists |
| Intl.Collator | natural-sort npm | Unnecessary dependency, browser API is sufficient |
| parse-numeric-range | Custom regex | Simple regex handles "101-110" pattern adequately |

**Installation:**
```bash
# No new dependencies required
# Optional if complex range patterns needed:
# npm install parse-numeric-range
```

## Architecture Patterns

### Recommended Project Structure
```
arden/app/app/obras/[id]/agrupamentos/
├── page.tsx                      # Server Component (data fetching)
└── _components/
    ├── agrupamentos-page-client.tsx   # Client wrapper (modal state, selection)
    ├── split-view-layout.tsx          # NEW: Master-detail container
    ├── agrupamentos-panel.tsx         # NEW: Left panel (agrupamentos list)
    ├── unidades-panel.tsx             # NEW: Right panel (unidades for selected)
    ├── unidade-form-modal.tsx         # NEW: Create/Edit modal for unidades
    ├── unidade-delete-confirmation.tsx # NEW: Delete confirmation for unidades
    ├── agrupamento-form-modal.tsx     # Existing: Create/Edit agrupamentos
    ├── delete-confirmation.tsx        # Existing: Delete agrupamentos
    └── sortable-agrupamento-row.tsx   # Existing: Drag handle row

arden/lib/supabase/queries/
├── agrupamentos.ts                # Existing
└── unidades.ts                    # NEW: Data access layer

arden/lib/validations/
├── agrupamento.ts                 # Existing
└── unidade.ts                     # NEW: Zod schemas
```

### Pattern 1: Split-View Layout (Master-Detail)
**What:** Two-panel layout where selecting an item in the left panel shows its details/children in the right panel
**When to use:** Parent-child hierarchical data where user needs to see both levels
**Example:**
```typescript
// Source: Design system grid patterns, project-specific pattern
interface SplitViewLayoutProps {
  leftPanel: React.ReactNode
  rightPanel: React.ReactNode
  selectedId?: string
}

export function SplitViewLayout({ leftPanel, rightPanel, selectedId }: SplitViewLayoutProps) {
  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Left Panel: 40% on desktop, full width on mobile */}
      <div className="w-full lg:w-2/5">
        {leftPanel}
      </div>
      {/* Right Panel: 60% on desktop, full width on mobile */}
      <div className="w-full lg:w-3/5">
        {rightPanel}
      </div>
    </div>
  )
}
```

### Pattern 2: Selection State with Brand Highlight
**What:** Visual indication of selected item using background highlight and brand-colored left border
**When to use:** Clickable list items that control another panel's content
**Example:**
```typescript
// Source: Design system, CSS variables
<div
  className={cn(
    'cursor-pointer rounded-md px-3 py-2 transition-colors',
    'hover:bg-surface-200',
    isSelected && 'bg-surface-200 border-l-2 border-brand'
  )}
  onClick={() => onSelect(item.id)}
>
  {item.nome}
</div>
```

### Pattern 3: Inline Badge Count
**What:** Display count inline with name using parentheses or badge
**When to use:** Showing aggregated child counts alongside parent name
**Example:**
```typescript
// Source: CONTEXT.md decision - "Bloco A (12)" format
<span className="font-medium">{agrupamento.nome}</span>
<span className="text-foreground-muted ml-1.5">({agrupamento.unidades_count})</span>
```

### Pattern 4: Numeric Range Batch Creation
**What:** Parse "Apto 101-110" input to generate numbered unit names
**When to use:** User wants to create multiple units with sequential numbering
**Example:**
```typescript
// Source: Custom implementation based on CONTEXT.md requirements
interface ParsedRange {
  prefix: string
  start: number
  end: number
}

export function parseNumericRange(input: string): ParsedRange | null {
  // Match patterns: "Apto 101-110", "101-110", "Casa 1-5"
  const match = input.match(/^(.+?\s)?(\d+)-(\d+)$/)
  if (!match) return null

  const prefix = (match[1] || '').trim()
  const start = parseInt(match[2], 10)
  const end = parseInt(match[3], 10)

  if (start > end || end - start > 499) return null // Max 500 limit

  return { prefix, start, end }
}

export function generateUnidadeNames(parsed: ParsedRange): string[] {
  const { prefix, start, end } = parsed
  const names: string[] = []
  for (let i = start; i <= end; i++) {
    names.push(prefix ? `${prefix} ${i}` : `${i}`)
  }
  return names
}

// Example usage:
// parseNumericRange("Apto 101-110") -> { prefix: "Apto", start: 101, end: 110 }
// generateUnidadeNames({ prefix: "Apto", start: 101, end: 110 })
// -> ["Apto 101", "Apto 102", ..., "Apto 110"]
```

### Pattern 5: Alphanumeric Natural Sort
**What:** Sort strings so numbers within them are compared numerically
**When to use:** Sorting unit names like "Apto 1", "Apto 2", ..., "Apto 10"
**Example:**
```typescript
// Source: MDN Intl.Collator, https://fuzzytolerance.info/blog/2019/07/19/The-better-way-to-do-natural-sort-in-JavaScript/
// HIGH confidence - browser native API

const naturalCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base'
})

export function sortUnidadesNatural<T extends { nome: string }>(unidades: T[]): T[] {
  return [...unidades].sort((a, b) => naturalCollator.compare(a.nome, b.nome))
}

// Example:
// Input:  ["Apto 10", "Apto 1", "Apto 2", "Apto 11"]
// Output: ["Apto 1", "Apto 2", "Apto 10", "Apto 11"]
```

### Anti-Patterns to Avoid
- **Alphabetical sort for numeric data:** Results in "Apto 10" before "Apto 2"
- **Rebuilding agrupamentos table from scratch:** Reuse existing components, add split-view wrapper
- **Modal per entity type:** Reuse single modal pattern with mode prop
- **Hardcoded widths:** Use responsive Tailwind classes (w-2/5, w-3/5)
- **Direct array mutation in sort:** Always spread before sort to avoid mutation

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Alphanumeric sorting | Custom comparison function | Intl.Collator | Handles locale, edge cases, faster for large lists |
| Toast notifications | Custom alert system | sonner (existing) | Already in project, consistent UX |
| Form validation | Manual if/else | Zod + react-hook-form | Type safety, consistent error messages |
| Confirmation dialog | Custom modal | AlertDialog component | Already exists in components/ui |
| Selection state | Custom context | useState in parent | Simple parent state, no need for context |

**Key insight:** The split-view layout and numeric range parsing are the only truly new functionality. Everything else follows established patterns from Phase 3.

## Common Pitfalls

### Pitfall 1: Mobile layout breaks split-view
**What goes wrong:** Panels overlap or have fixed widths on small screens
**Why it happens:** Using fixed pixel widths instead of responsive classes
**How to avoid:** Use `flex-col lg:flex-row` and `w-full lg:w-2/5` patterns
**Warning signs:** Layout looks cramped on mobile, horizontal scroll appears

### Pitfall 2: Selection state lost on data refresh
**What goes wrong:** After creating/editing/deleting, selected agrupamento is deselected
**Why it happens:** Router refresh resets all state
**How to avoid:** Store selectedAgrupamentoId in state, preserve across refresh
**Warning signs:** User clicks back to select agrupamento after every action

### Pitfall 3: Batch creation exceeds limit
**What goes wrong:** User enters "1-1000" and creates 1000 units
**Why it happens:** No client-side validation on range size
**How to avoid:** Validate range produces max 500 units, show error if exceeded
**Warning signs:** Slow UI, server timeout, excessive database writes

### Pitfall 4: Alphabetical instead of natural sort
**What goes wrong:** "Apto 10" appears before "Apto 2"
**Why it happens:** Using default Array.sort() without numeric collation
**How to avoid:** Always use `Intl.Collator` with `numeric: true`
**Warning signs:** Unit list order doesn't match user expectations

### Pitfall 5: Empty state not handling selection correctly
**What goes wrong:** Right panel shows stale data or errors when no agrupamento selected
**Why it happens:** Not handling undefined/null selectedAgrupamentoId
**How to avoid:** Explicit empty state with "Selecione um agrupamento para ver unidades"
**Warning signs:** Error messages, blank panel, or stale unit list

### Pitfall 6: RLS policy mismatch
**What goes wrong:** Engenheiro user cannot create/edit/delete unidades
**Why it happens:** Current RLS policies allow only admin for unidades (unlike agrupamentos which allows admin OR engenheiro)
**How to avoid:** Document this limitation; may need RLS update if engenheiro should manage unidades
**Warning signs:** 403 errors for engenheiro role, but not for admin

## Code Examples

Verified patterns from official sources and existing codebase:

### Data Access Layer for Unidades
```typescript
// Source: Following pattern from lib/supabase/queries/agrupamentos.ts
import { createClient } from '@/lib/supabase/client'

export interface Unidade {
  id: string
  agrupamento_id: string
  nome: string
  codigo: string | null
  ordem: number
  created_at: string
  updated_at: string
}

export interface UnidadeInsert {
  nome: string
  codigo?: string | null
  ordem?: number
}

export interface UnidadeUpdate {
  nome?: string
  codigo?: string | null
  ordem?: number
}

/**
 * Lista unidades de um agrupamento.
 * Ordenado por natural sort (nome).
 */
export async function listUnidades(agrupamentoId: string): Promise<Unidade[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('unidades')
    .select('*')
    .eq('agrupamento_id', agrupamentoId)
    .order('ordem', { ascending: true })

  if (error) {
    throw new Error(`Erro ao listar unidades: ${error.message}`)
  }

  // Apply natural sort client-side for name ordering
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })
  return (data || []).sort((a, b) => collator.compare(a.nome, b.nome))
}

/**
 * Cria uma nova unidade.
 * Auto-assigns ordem as max(existing ordem) + 1.
 */
export async function createUnidade(agrupamentoId: string, data: UnidadeInsert): Promise<Unidade> {
  const supabase = createClient()

  // Get current max ordem for this agrupamento
  const { data: existing } = await supabase
    .from('unidades')
    .select('ordem')
    .eq('agrupamento_id', agrupamentoId)
    .order('ordem', { ascending: false })
    .limit(1)

  const nextOrdem = data.ordem ?? ((existing?.[0]?.ordem ?? -1) + 1)

  const { data: created, error } = await supabase
    .from('unidades')
    .insert({
      agrupamento_id: agrupamentoId,
      nome: data.nome,
      codigo: data.codigo ?? null,
      ordem: nextOrdem,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar unidade: ${error.message}`)
  }

  return created
}

/**
 * Cria multiplas unidades em lote.
 */
export async function createUnidadesBatch(
  agrupamentoId: string,
  names: string[]
): Promise<Unidade[]> {
  const supabase = createClient()

  // Get current max ordem
  const { data: existing } = await supabase
    .from('unidades')
    .select('ordem')
    .eq('agrupamento_id', agrupamentoId)
    .order('ordem', { ascending: false })
    .limit(1)

  const startOrdem = (existing?.[0]?.ordem ?? -1) + 1

  const records = names.map((nome, index) => ({
    agrupamento_id: agrupamentoId,
    nome,
    ordem: startOrdem + index,
  }))

  const { data, error } = await supabase
    .from('unidades')
    .insert(records)
    .select()

  if (error) {
    throw new Error(`Erro ao criar unidades: ${error.message}`)
  }

  return data || []
}

/**
 * Atualiza uma unidade existente.
 */
export async function updateUnidade(id: string, updates: UnidadeUpdate): Promise<Unidade> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('unidades')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar unidade: ${error.message}`)
  }

  return data
}

/**
 * Deleta uma unidade (hard delete).
 */
export async function deleteUnidade(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('unidades')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao deletar unidade: ${error.message}`)
  }
}
```

### Zod Schema with Numeric Range Validation
```typescript
// Source: Following pattern from lib/validations/agrupamento.ts
import { z } from 'zod'

/**
 * Schema de validacao para formulario de unidade individual.
 */
export const unidadeFormSchema = z.object({
  nome: z
    .string({ required_error: 'Nome e obrigatorio' })
    .min(1, 'Nome e obrigatorio')
    .max(100, 'Nome deve ter no maximo 100 caracteres'),
})

export type UnidadeFormData = z.infer<typeof unidadeFormSchema>

/**
 * Schema de validacao para criacao em lote com range numerico.
 * Accepts patterns like "Apto 101-110" or "101-110"
 */
export const unidadeBatchSchema = z.object({
  rangeInput: z
    .string({ required_error: 'Range e obrigatorio' })
    .min(1, 'Range e obrigatorio')
    .refine(
      (val) => {
        const match = val.match(/^(.+?\s)?(\d+)-(\d+)$/)
        if (!match) return false
        const start = parseInt(match[2], 10)
        const end = parseInt(match[3], 10)
        return start <= end && (end - start + 1) <= 500
      },
      {
        message: 'Formato invalido. Use "Prefixo inicio-fim" (ex: Apto 101-110). Maximo 500 unidades.',
      }
    ),
})

export type UnidadeBatchData = z.infer<typeof unidadeBatchSchema>

/**
 * Parses a range string into prefix, start, and end.
 * Returns null if invalid format.
 */
export function parseNumericRange(input: string): {
  prefix: string
  start: number
  end: number
} | null {
  const match = input.match(/^(.+?\s)?(\d+)-(\d+)$/)
  if (!match) return null

  const prefix = (match[1] || '').trim()
  const start = parseInt(match[2], 10)
  const end = parseInt(match[3], 10)

  if (start > end || end - start >= 500) return null

  return { prefix, start, end }
}

/**
 * Generates unit names from parsed range.
 * @example generateUnidadeNames({ prefix: "Apto", start: 101, end: 103 })
 * // Returns: ["Apto 101", "Apto 102", "Apto 103"]
 */
export function generateUnidadeNames(parsed: {
  prefix: string
  start: number
  end: number
}): string[] {
  const { prefix, start, end } = parsed
  const names: string[] = []
  for (let i = start; i <= end; i++) {
    names.push(prefix ? `${prefix} ${i}` : `${i}`)
  }
  return names
}
```

### Selection State in Parent Component
```typescript
// Source: Standard React pattern
const [selectedAgrupamentoId, setSelectedAgrupamentoId] = useState<string | null>(null)

// Find selected agrupamento (preserves selection after refresh)
const selectedAgrupamento = useMemo(
  () => agrupamentos.find(a => a.id === selectedAgrupamentoId) ?? null,
  [agrupamentos, selectedAgrupamentoId]
)

// Handle selection
const handleSelectAgrupamento = useCallback((id: string) => {
  setSelectedAgrupamentoId(id)
}, [])
```

### Empty State for Unidades Panel
```typescript
// Source: Design system empty state pattern
{!selectedAgrupamento ? (
  <div className="rounded-md border border-border bg-surface-100">
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <Database className="h-12 w-12 text-foreground-muted mb-4" />
      <p className="text-foreground-light mb-2">Selecione um agrupamento</p>
      <p className="text-sm text-foreground-muted">
        Clique em um agrupamento a esquerda para ver suas unidades.
      </p>
    </div>
  </div>
) : (
  <UnidadesPanel
    agrupamento={selectedAgrupamento}
    unidades={unidades}
  />
)}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| String.localeCompare() per comparison | Intl.Collator (reusable instance) | ES2015 | ~5x faster for large arrays |
| CSS Grid fixed columns | Flexbox with responsive width classes | Current best practice | Better mobile support |
| Custom range parser libraries | Simple regex for "N-M" format | Always valid | No extra dependency for simple case |

**Deprecated/outdated:**
- `array.sort((a, b) => a.localeCompare(b))` for every comparison - use Collator instance instead
- Fixed pixel widths for panels - use responsive Tailwind classes

## Open Questions

Things that couldn't be fully resolved:

1. **RLS Policy for Engenheiro Role on Unidades**
   - What we know: Current RLS only allows admin to INSERT/UPDATE/DELETE unidades
   - What's unclear: Should engenheiro also be able to manage unidades (like they can with agrupamentos)?
   - Recommendation: Document as limitation for MVP; raise with product owner if engenheiro needs this access

2. **Keyboard Navigation in Split-View**
   - What we know: Selection via click is implemented
   - What's unclear: Should arrow keys navigate agrupamentos list?
   - Recommendation: Not for MVP, consider in future accessibility pass

3. **Preserving Selection on Page Navigation**
   - What we know: Selection lives in client state, lost on hard navigation
   - What's unclear: Should URL params store selection (e.g., `?agrupamento=uuid`)?
   - Recommendation: Accept for MVP; URL params could be added if users request

## Sources

### Primary (HIGH confidence)
- Existing codebase patterns: `arden/lib/supabase/queries/agrupamentos.ts`, `arden/app/app/obras/[id]/agrupamentos/_components/`
- Database schema: `database/schema.sql` (lines 308-323 for unidades table)
- RLS policies: `database/rls-policies.sql` (lines 247-292 for unidades policies)
- Design system: `docs/design/DESIGN-SYSTEM.md` (layout patterns, empty states)
- Phase 4 Context: `.planning/phases/04-unidades/04-CONTEXT.md`

### Secondary (MEDIUM confidence)
- [MDN Intl.Collator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator) - Native API documentation
- [JavaScript Natural Sorting Blog](https://fuzzytolerance.info/blog/2019/07/19/The-better-way-to-do-natural-sort-in-JavaScript/) - Performance comparison
- [multi-integer-range npm](https://github.com/smikitky/node-multi-integer-range) - Range parsing patterns

### Tertiary (LOW confidence)
- Various Stack Overflow answers on alphanumeric sorting (verified against MDN)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new dependencies, using browser APIs and existing patterns
- Architecture: HIGH - Split-view is well-documented pattern, following established codebase structure
- Pitfalls: HIGH - Based on actual codebase analysis and common React patterns

**Research date:** 2026-01-20
**Valid until:** 2026-03-20 (60 days - stable patterns, no expected breaking changes)

---

## Quick Reference: Database Schema

```sql
-- From database/schema.sql lines 308-323
CREATE TABLE unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agrupamento_id UUID NOT NULL REFERENCES agrupamentos(id) ON DELETE CASCADE,

  nome VARCHAR(100) NOT NULL,  -- Ex: "Casa A01", "Apto 201"
  codigo VARCHAR(50),          -- Codigo alternativo (optional)
  ordem INT DEFAULT 0,         -- Para ordenacao na UI

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_unidades_agrupamento ON unidades(agrupamento_id);
```

**Key observations:**
- CASCADE DELETE from agrupamentos - if agrupamento is deleted, unidades go too
- `codigo` field is optional (nullable)
- Simple structure: nome, codigo (optional), ordem
- `updated_at` trigger exists for automatic timestamp updates

## Quick Reference: RLS Policies

```sql
-- From database/rls-policies.sql lines 247-292
-- SELECT: Follows obra permission (via agrupamento)
-- INSERT/UPDATE/DELETE: Admin only

-- NOTE: Unlike agrupamentos (which allows admin OR engenheiro),
-- unidades currently only allows admin for write operations.
-- This may need review based on business requirements.
```

## Quick Reference: Available UI Components

From `arden/components/ui/` (all available, no new components needed):
- `table.tsx` - Table, TableHeader, TableBody, TableRow, TableCell, TableHead
- `dialog.tsx` - Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
- `alert-dialog.tsx` - AlertDialog for confirmations
- `button.tsx` - Button with variants
- `input.tsx` - Input component
- `label.tsx` - Label component
- `dropdown-menu.tsx` - DropdownMenu for actions
- `checkbox.tsx` - Checkbox for batch mode toggle
- `badge.tsx` - For counts (optional, using inline text instead per CONTEXT.md)

## Quick Reference: Key Decisions from CONTEXT.md

| Decision | Implementation |
|----------|----------------|
| Split-view 40%/60% | `lg:w-2/5` / `lg:w-3/5` |
| Mobile: vertical stack | `flex-col lg:flex-row` |
| Selection indicator | `bg-surface-200 border-l-2 border-brand` |
| Count display | Inline `"Bloco A (12)"` format |
| Batch format | "Apto 101-110" numeric range |
| Batch limit | 500 unidades max |
| Field: nome only | No codigo required |
| Natural sort | `Intl.Collator` with `numeric: true` |
| No drag-and-drop | Unlike agrupamentos, no reordering |
