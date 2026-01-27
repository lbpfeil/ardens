# Phase 10: Seleção e Operações em Massa - Research

**Researched:** 2026-01-27
**Domain:** React selection state management, CSS Grid visual selection, bulk operations UX, floating toolbar
**Confidence:** HIGH

## Summary

This phase adds a selection mode to the existing matriz-grid.tsx, enabling bulk verification operations. The codebase already has the complete backend infrastructure: the `bulk_verificar` PostgreSQL RPC handles all conflict resolution atomically, and the `bulkVerificar` Server Action wraps it with Zod validation and ActionResult pattern.

The implementation is purely frontend: a selection mode toggle, selection state management via `Set<string>`, visual feedback on selected cells, a fixed bottom toolbar (Gmail-style), a bulk verification modal, and wiring to the existing Server Action. The existing event delegation pattern in `matriz-grid.tsx` provides the ideal hook point for toggling between navigation mode and selection mode.

**Primary recommendation:** Extend `matriz-client.tsx` with selection mode state (`isSelectionMode`, `selectedCells: Set<string>`) and modify the existing `handleClick` in `matriz-grid.tsx` to branch on mode. Keep all selection logic in useState/useRef (per prior decision -- not Zustand). Use the existing `Dialog` component for the bulk modal and a simple fixed-position div for the bottom toolbar.

## Standard Stack

### Core (Already in Codebase)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| React 19 | 19.x | State management (useState, useCallback, useTransition, useEffect) | Already used |
| sonner | latest | Toast notifications for success/error | Already configured in layout.tsx via `<Toaster />` |
| Radix Dialog | via shadcn | Modal for bulk verification form | Already available at `@/components/ui/dialog` |
| Radix AlertDialog | via shadcn | Alternative modal (used in existing excecao-modal) | Already available |
| Radix Progress | via shadcn | Progress bar during operation | Already available at `@/components/ui/progress` |
| Zod | 3.x | Schema validation for bulk input | Already used in `bulk-verificar.ts` |
| lucide-react | latest | Icons (CheckSquare, X, AlertTriangle, etc.) | Already used throughout |

### Supporting (Already in Codebase)

| Library | Purpose | When to Use |
|---------|---------|-------------|
| `cn()` from `@/lib/utils` | Conditional class merging | Selection visual feedback classes |
| `useRouter` from `next/navigation` | Navigation in normal mode | Already in `matriz-grid.tsx` |
| `toast` from `sonner` | Success/error feedback | After bulk operation completes |

### No New Dependencies Needed

All requirements can be met with existing libraries. No new packages to install.

## Architecture Patterns

### Recommended Component Structure

```
arden/app/app/obras/[id]/verificacoes/_components/
├── matriz-client.tsx          # MODIFY: Add selection mode state + toolbar
├── matriz-grid.tsx            # MODIFY: Dual-mode click handler + selection visuals
├── matriz-header.tsx          # MODIFY: Add header click for row/column selection
├── matriz-status.ts           # NO CHANGE
├── matriz-selection-toolbar.tsx  # NEW: Fixed bottom bar component
└── matriz-bulk-modal.tsx         # NEW: Bulk verification modal
```

### Pattern 1: Selection Mode State Architecture

**What:** Centralize selection state in `matriz-client.tsx` and pass down as props.
**When to use:** When multiple child components need to read/write selection state.

The state lives in `matriz-client.tsx` (the orchestrator) and flows down:

```typescript
// In matriz-client.tsx
const [isSelectionMode, setIsSelectionMode] = useState(false)
const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())

// Toggle a single cell: "servicoId:unidadeId"
const handleToggleCell = useCallback((cellKey: string) => {
  setSelectedCells(prev => {
    const next = new Set(prev)
    if (next.has(cellKey)) {
      next.delete(cellKey)
    } else {
      next.add(cellKey)
    }
    return next
  })
}, [])

// Select entire row (all visible units for a service)
const handleSelectRow = useCallback((servicoId: string) => {
  setSelectedCells(prev => {
    const next = new Set(prev)
    for (const unit of visibleUnits) {
      const key = `${servicoId}:${unit.id}`
      next.add(key)
    }
    return next
  })
}, [visibleUnits])

// Select entire column (all services for a unit)
const handleSelectColumn = useCallback((unidadeId: string) => {
  setSelectedCells(prev => {
    const next = new Set(prev)
    for (const servico of servicos) {
      const key = `${servico.id}:${unidadeId}`
      next.add(key)
    }
    return next
  })
}, [servicos])

// Exit selection mode
const handleExitSelectionMode = useCallback(() => {
  setIsSelectionMode(false)
  setSelectedCells(new Set())
}, [])

// Esc key handler
useEffect(() => {
  if (!isSelectionMode) return
  const handler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') handleExitSelectionMode()
  }
  document.addEventListener('keydown', handler)
  return () => document.removeEventListener('keydown', handler)
}, [isSelectionMode, handleExitSelectionMode])
```

**Why this pattern:**
- Prior decision: useState/useRef local, not Zustand
- Set<string> gives O(1) lookup for `isSelected` check per cell
- useCallback with updater form (`prev => ...`) avoids stale closure issues
- Empty dependency arrays where possible for stable function references

### Pattern 2: Dual-Mode Event Delegation

**What:** Modify the existing single `handleClick` in `matriz-grid.tsx` to branch on `isSelectionMode`.
**When to use:** When the same click target has different behavior based on mode.

```typescript
// In matriz-grid.tsx -- modify existing handleClick
const handleClick = useCallback(
  (e: React.MouseEvent<HTMLDivElement>) => {
    // Check for header clicks first (selection mode only)
    if (isSelectionMode) {
      const headerRow = (e.target as HTMLElement).closest('[data-header-servico]') as HTMLElement | null
      if (headerRow) {
        onSelectRow?.(headerRow.dataset.headerServico!)
        return
      }
      const headerCol = (e.target as HTMLElement).closest('[data-header-unidade]') as HTMLElement | null
      if (headerCol) {
        onSelectColumn?.(headerCol.dataset.headerUnidade!)
        return
      }
    }

    const cell = (e.target as HTMLElement).closest('[data-cell]') as HTMLElement | null
    if (!cell) return

    const servicoId = cell.dataset.servicoId
    const unidadeId = cell.dataset.unidadeId
    if (!servicoId || !unidadeId) return

    if (isSelectionMode) {
      // Selection mode: toggle cell
      onToggleCell?.(`${servicoId}:${unidadeId}`)
    } else {
      // Normal mode: navigate
      const key = `${servicoId}:${unidadeId}`
      const verificacao = verificacoesMap[key]
      if (verificacao) {
        router.push(`/app/obras/${obraId}/verificacoes/${verificacao.id}`)
      } else {
        router.push(`/app/obras/${obraId}/verificacoes/nova?servico=${servicoId}&unidade=${unidadeId}`)
      }
    }
  },
  [isSelectionMode, verificacoesMap, obraId, router, onToggleCell, onSelectRow, onSelectColumn]
)
```

**Why this pattern:**
- Preserves the existing event delegation decision (data-cell, closest())
- Single click handler for performance (no per-cell listeners)
- Header clicks use new data attributes: `data-header-servico`, `data-header-unidade`
- Clean separation: mode check at top, navigation code untouched

### Pattern 3: Fixed Bottom Toolbar (Gmail-style)

**What:** A `fixed bottom-0` bar that appears when selection mode is active.
**When to use:** For contextual bulk actions.

```typescript
// matriz-selection-toolbar.tsx
interface SelectionToolbarProps {
  selectedCount: number
  onVerificar: () => void
  onExcecao: () => void
  onCancel: () => void
}

export function SelectionToolbar({ selectedCount, onVerificar, onExcecao, onCancel }: SelectionToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-100 px-6 py-3 flex items-center justify-between animate-in slide-in-from-bottom duration-200">
      <span className="text-sm text-foreground">
        <strong>{selectedCount}</strong> {selectedCount === 1 ? 'célula selecionada' : 'células selecionadas'}
      </span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="outline" size="sm" onClick={onExcecao}>
          <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
          Exceção
        </Button>
        <Button size="sm" onClick={onVerificar}>
          <Check className="w-3.5 h-3.5 mr-1.5" />
          Verificar
        </Button>
      </div>
    </div>
  )
}
```

**Why this pattern:**
- Fixed positioning ensures visibility regardless of scroll
- z-40 stays above grid content (z-10/20/30) but below modals (z-50)
- animate-in/slide-in-from-bottom from tw-animate-css (already imported in globals.css)
- Left margin accounts for sidebar if present

### Pattern 4: Conflict Summary Computation

**What:** Pre-compute what will happen to each selected cell before showing the modal.
**When to use:** When the user clicks "Verificar" or "Exceção" to show the summary.

```typescript
interface BulkSummary {
  pendentes: string[]       // Will be created normally
  ncExistentes: string[]    // Will become "Conforme após Reinspeção" (if bulk Conforme)
  conformesTravadas: string[] // Will be skipped (immutable)
  excecoesTravadas: string[]  // Will be skipped (immutable)
}

function computeBulkSummary(
  selectedCells: Set<string>,
  verificacoesMap: Record<string, MatrizVerificacao>
): BulkSummary {
  const summary: BulkSummary = {
    pendentes: [],
    ncExistentes: [],
    conformesTravadas: [],
    excecoesTravadas: [],
  }

  for (const key of selectedCells) {
    const v = verificacoesMap[key]
    if (!v) {
      summary.pendentes.push(key)
    } else {
      const status = deriveMatrizCellStatus(v)
      switch (status) {
        case 'pendente':
          summary.pendentes.push(key)
          break
        case 'conforme':
        case 'conforme_reinspecao':
          summary.conformesTravadas.push(key)
          break
        case 'excecao':
          summary.excecoesTravadas.push(key)
          break
        case 'nao_conforme':
        case 'nc_reinspecao':
          summary.ncExistentes.push(key)
          break
      }
    }
  }
  return summary
}
```

**Why this pattern:**
- Pre-computation shows the user exactly what will happen before confirming
- Uses existing `deriveMatrizCellStatus` and `verificacoesMap` -- no extra fetches
- The RPC handles the actual conflict resolution server-side; this is purely for display
- Note: `concluida` status in DB covers both "Conforme" and "Exceção" cells

### Pattern 5: Bulk Operation with useTransition

**What:** Use `useTransition` for the bulk Server Action call, consistent with existing patterns.
**When to use:** When calling `bulkVerificar` Server Action.

```typescript
const [isPending, startTransition] = useTransition()

const handleBulkConfirm = (resultado: 'conforme' | 'nao_conforme' | 'excecao', descricao?: string) => {
  const pares = Array.from(selectedCells).map(key => {
    const [servico_id, unidade_id] = key.split(':')
    return { servico_id, unidade_id }
  })

  startTransition(async () => {
    const result = await bulkVerificar({
      obra_id: obraId,
      resultado,
      pares,
      descricao,
    })

    if (result.error) {
      toast.error(result.error)
      // Selection maintained for retry (per CONTEXT decision)
    } else {
      const { created, skipped, reinspected } = result.data
      toast.success(`${created} verificações criadas${reinspected > 0 ? `, ${reinspected} reinspecionadas` : ''}${skipped > 0 ? `, ${skipped} ignoradas` : ''}`)
      // Auto-exit selection mode (per CONTEXT decision)
      handleExitSelectionMode()
      // revalidatePath is called inside bulkVerificar server action
    }
  })
}
```

**Why this pattern:**
- Consistent with `verificacao-individual-client.tsx` which uses same `useTransition` pattern
- `isPending` disables buttons during operation
- Error keeps selection for retry; success clears it
- The Server Action already calls `revalidatePath` -- no extra fetch needed

### Anti-Patterns to Avoid

- **Per-cell event listeners:** The codebase uses event delegation (single onClick on grid container). Never add individual onClick to each cell div.
- **Zustand for selection state:** Prior decision locks this to local useState. Selection is transient UI state, not global app state.
- **Direct RPC calls from client:** Always go through the Server Action (`bulkVerificar`) which validates with Zod and handles revalidation.
- **Mutating Set in place:** React won't detect mutations to the same Set object. Always create a new Set: `new Set(prev)`.
- **Shift+Click / Ctrl+Click modifiers:** CONTEXT decision explicitly says "Click simples acumula -- sem necessidade de Shift ou Ctrl". Do NOT implement keyboard modifier selection.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Conflict resolution logic | Client-side resolution | `bulk_verificar` PostgreSQL RPC | Already handles all cases atomically in a single transaction |
| Toast notifications | Custom notification system | `toast` from `sonner` | Already configured with dark theme in layout.tsx |
| Modal dialogs | Custom overlay/portal | `Dialog` from `@/components/ui/dialog` | Handles accessibility, focus trap, overlay, close on Esc |
| Progress indicator | Custom progress bar | `Progress` from `@/components/ui/progress` | Radix primitive, already used in matriz-grid for row progress |
| Form validation | Manual if/else | Zod schema in `bulk-verificar.ts` | Already validates obra_id, resultado, pares (1-500), descricao |
| Cell status derivation | Duplicate status logic | `deriveMatrizCellStatus()` from `matriz-status.ts` | Single source of truth for 6 visual states |
| Immutability check | Custom lock logic | `deriveMatrizCellStatus()` returning 'conforme' or 'excecao' | Same function already used for heatmap colors |

**Key insight:** The backend is 100% complete. The `bulk_verificar` RPC + `bulkVerificar` Server Action already handle all BULK-07 through BULK-09 requirements (conflict resolution, atomicity, item marking). This phase is purely frontend work.

## Common Pitfalls

### Pitfall 1: Set Identity in React State

**What goes wrong:** Using `selectedCells.add(key)` or `.delete(key)` on the existing Set and calling `setSelectedCells(selectedCells)` -- React sees the same reference and skips re-render.
**Why it happens:** React uses Object.is() for state comparison. Same Set reference = no update.
**How to avoid:** Always create a new Set: `setSelectedCells(prev => { const next = new Set(prev); next.add(key); return next; })`
**Warning signs:** Cell visually doesn't toggle, but state seems correct in console.

### Pitfall 2: Stale Closures in useCallback

**What goes wrong:** `handleToggleCell` captures `selectedCells` in closure, causing stale reads when clicking rapidly.
**Why it happens:** useCallback with `[selectedCells]` in deps recreates on every change; without it, reads stale.
**How to avoid:** Use the updater form exclusively: `setSelectedCells(prev => ...)`. Never read `selectedCells` inside the callback -- use `prev` parameter.
**Warning signs:** Selecting multiple cells rapidly loses some selections.

### Pitfall 3: z-index Conflicts with Sticky Headers

**What goes wrong:** The bottom toolbar (z-40) or modal (z-50) appears behind the sticky grid headers (z-10/20/30).
**Why it happens:** CSS stacking contexts. The grid container creates its own stacking context; `position: sticky` elements within it are scoped to that context.
**How to avoid:** The bottom toolbar and modal are outside the grid container, so they use the document-level stacking context. z-40 for toolbar and z-50 for modal (matching existing Dialog/AlertDialog) will work correctly because they're siblings, not children of the grid.
**Warning signs:** Toolbar hidden behind grid when scrolling.

### Pitfall 4: Header Click Conflicts with Expand/Collapse

**What goes wrong:** Clicking an agrupamento header in selection mode triggers expand/collapse instead of column selection.
**Why it happens:** AgrupamentoHeaders already has onClick for toggle. Adding selection behavior creates ambiguity.
**How to avoid:** In selection mode, agrupamento headers should NOT be selectable (they represent groups, not individual units). Only UNIT headers (row 2) should select columns, and SERVICE name cells (sticky left) should select rows. Agrupamento headers keep their expand/collapse behavior in all modes.
**Warning signs:** Clicking group header selects all units across multiple groups.

### Pitfall 5: Exceção Cells vs Conforme Cells in Conflict Detection

**What goes wrong:** Treating Exceção cells differently from Conforme cells in the pre-computation summary.
**Why it happens:** They look different in the UI (yellow vs green) but share the same DB status (`concluida`).
**How to avoid:** Use `deriveMatrizCellStatus()` which returns distinct visual statuses ('conforme' vs 'excecao'), so the summary can differentiate them for user display. The RPC skips both because both are `concluida` in the DB.
**Warning signs:** Summary says "3 will be created" but RPC returns `created: 0, skipped: 3`.

### Pitfall 6: Cursor Style in Selection Mode

**What goes wrong:** Cells still show `cursor-pointer` which suggests navigation, confusing users about what click will do.
**Why it happens:** The existing cell styling has `cursor-pointer` hardcoded.
**How to avoid:** Conditionally apply cursor: `cursor-pointer` in normal mode, `cursor-cell` or `cursor-crosshair` in selection mode. Can use a parent-level class: add `data-selection-mode` to grid container and use CSS descendant selector.
**Warning signs:** User confusion about what clicking will do.

### Pitfall 7: Progress Bar During Operation

**What goes wrong:** Trying to show cell-by-cell progress for a single RPC call.
**Why it happens:** The `bulk_verificar` RPC runs as a single atomic transaction -- there's no way to get per-cell progress from a single database call.
**How to avoid:** Use an indeterminate/animated progress bar or spinner during the operation (isPending from useTransition). The "barra de progresso" mentioned in CONTEXT should be a loading indicator, not a cell-by-cell counter. Alternatively, show a determinate progress bar that goes from 0 to 100 when the operation completes (optimistic).
**Warning signs:** Attempting to poll for progress or split the bulk into multiple RPC calls.

## Code Examples

### Example 1: Selection Visual Feedback on Cells

```typescript
// In matriz-grid.tsx cell rendering
const isSelected = isSelectionMode && selectedCells.has(`${servico.id}:${unidade.id}`)

<div
  data-cell=""
  data-servico-id={servico.id}
  data-unidade-id={unidade.id}
  className={cn(
    "transition-opacity border-r border-b border-border/30 flex items-center justify-center",
    isSelectionMode ? "cursor-cell" : "cursor-pointer hover:opacity-80"
  )}
  style={{ gridRow }}
>
  <div className={cn(
    "w-7 h-7 rounded-md",
    colorClass,
    isSelected && "ring-2 ring-brand ring-offset-1 ring-offset-surface-100"
  )} />
</div>
```

**Why ring instead of overlay:** A ring (outline/border) is simpler, more performant, and doesn't obscure the heatmap color. The CONTEXT mentions "borda azul/brand + overlay semitransparente" -- the ring-2 with ring-brand achieves the border, and we can add a subtle overlay via a pseudo-element or bg-brand/10 background on the container.

### Example 2: Header Data Attributes for Selection

```typescript
// In matriz-header.tsx, UnitHeaderCell -- add data attribute for column selection
<div
  data-header-unidade={isSelectionMode ? unidade.id : undefined}
  className={cn(
    "bg-surface-100 border-b border-r border-border flex items-center justify-center",
    isSelectionMode && "cursor-cell hover:bg-surface-200"
  )}
  style={{ position: 'sticky', top: 40, zIndex: 20, gridRow }}
>
  <span className="text-xs text-foreground-lighter text-center leading-tight">
    {unidade.nome}
  </span>
</div>

// In matriz-grid.tsx, service name cell -- add data attribute for row selection
<div
  data-header-servico={isSelectionMode ? servico.id : undefined}
  className={cn(
    "bg-surface-100 border-b border-r border-border px-3 py-1 flex flex-col justify-center",
    isSelectionMode && "cursor-cell hover:bg-surface-200"
  )}
  style={{ position: 'sticky', left: 0, zIndex: 10, gridRow, gridColumn: '1' }}
>
```

### Example 3: Bulk Modal with Summary

```typescript
// matriz-bulk-modal.tsx
interface BulkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: BulkSummary
  mode: 'verificar' | 'excecao'
  onConfirm: (resultado: 'conforme' | 'nao_conforme' | 'excecao', descricao?: string) => void
  isPending: boolean
}

export function BulkModal({ open, onOpenChange, summary, mode, onConfirm, isPending }: BulkModalProps) {
  const [resultado, setResultado] = useState<'conforme' | 'nao_conforme'>('conforme')
  const [descricao, setDescricao] = useState('')

  const actionable = summary.pendentes.length + summary.ncExistentes.length
  const skipped = summary.conformesTravadas.length + summary.excecoesTravadas.length

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'excecao' ? 'Marcar como Exceção' : 'Verificação em Massa'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Result selection (only for 'verificar' mode) */}
          {mode === 'verificar' && (
            <div className="flex gap-2">
              <button onClick={() => setResultado('conforme')} className={cn(...)}>
                Conforme
              </button>
              <button onClick={() => setResultado('nao_conforme')} className={cn(...)}>
                Não Conforme
              </button>
            </div>
          )}

          {/* Summary */}
          <div className="text-sm space-y-1">
            {actionable > 0 && (
              <p className="text-foreground">
                {actionable} {actionable === 1 ? 'verificação será' : 'verificações serão'}{' '}
                {mode === 'excecao' ? 'marcadas como Exceção' : `criadas como ${resultado === 'conforme' ? 'Conforme' : 'Não Conforme'}`}.
              </p>
            )}
            {summary.ncExistentes.length > 0 && resultado === 'conforme' && mode === 'verificar' && (
              <p className="text-foreground-light">
                {summary.ncExistentes.length} NC {summary.ncExistentes.length === 1 ? 'existente receberá' : 'existentes receberão'} reinspeção.
              </p>
            )}
            {skipped > 0 && (
              <p className="text-foreground-muted">
                {skipped} {skipped === 1 ? 'célula será ignorada' : 'células serão ignoradas'} (já concluídas).
              </p>
            )}
          </div>

          {/* Description */}
          <Textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição opcional..."
            rows={3}
          />

          {/* Progress during operation */}
          {isPending && <Progress className="h-1" />}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            onClick={() => onConfirm(
              mode === 'excecao' ? 'excecao' : resultado,
              descricao || undefined
            )}
            disabled={isPending || actionable === 0}
          >
            {isPending ? 'Processando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

### Example 4: Enter Selection Mode Button

```typescript
// In matriz-client.tsx toolbar area
<Button
  variant={isSelectionMode ? "default" : "outline"}
  size="sm"
  className="h-7 text-xs gap-1.5"
  onClick={() => setIsSelectionMode(prev => !prev)}
>
  <CheckSquare className="w-3.5 h-3.5" />
  <span>{isSelectionMode ? 'Selecionando...' : 'Selecionar'}</span>
</Button>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Shift+Click for range, Ctrl+Click for toggle | Simple click-to-toggle in explicit mode | CONTEXT decision | Simpler UX, no keyboard modifiers needed |
| Array of selected IDs | Set<string> for O(1) lookup | Best practice | Performance: avoids `.includes()` on every cell render |
| Polling for progress | Single atomic RPC + loading indicator | Already implemented | No partial progress possible from single transaction |
| useReducer for complex selection | useState with updater functions | React 19 pattern | Simpler code, same performance |

**Deprecated/outdated:**
- BULK-02 (Shift+Click range) and BULK-03 (Ctrl+Click toggle) from original requirements are superseded by CONTEXT decision: "Click simples acumula". The requirements are still met (user CAN use Shift/Ctrl+Click, but the behavior is identical to simple click -- we don't need to differentiate).

## Open Questions

1. **Progress bar granularity**
   - What we know: The RPC runs as a single atomic transaction. There is no way to get per-cell progress.
   - What's unclear: Should the modal show an indeterminate progress bar (spinner/animated) or a fake progress that jumps to 100% on completion?
   - Recommendation: Use `isPending` from `useTransition` to show an indeterminate animated `Progress` bar. This is honest and consistent with the rest of the app.

2. **Sidebar offset for bottom toolbar**
   - What we know: The app has a sidebar. The bottom toolbar uses `fixed bottom-0 left-0 right-0`.
   - What's unclear: The exact sidebar width and whether the toolbar should account for it.
   - Recommendation: Check the app layout. If the main content area has a left margin/padding for the sidebar, the fixed bottom bar should use `left-[sidebar-width]` instead of `left-0`. Alternatively, place the toolbar inside the page content flow (not fixed to viewport) using `sticky bottom-0`.

3. **NC + bulk Exceção handling**
   - What we know: The RPC accepts 'excecao' as p_resultado. For existing NC cells, it would update items to 'excecao' (via the pendente/em_andamento branch) if the status allows. But for `com_nc` status cells, the current RPC only handles 'conforme' (conforme_apos_reinspecao) vs anything else (reprovado_apos_retrabalho).
   - What's unclear: Is the current RPC behavior correct for NC + bulk Exceção? The RPC would set `status_reinspecao = 'reprovado_apos_retrabalho'` which may not be semantically correct for an Exceção override.
   - Recommendation: For v1.1, the modal summary can warn that NC cells will be treated as "reprovado_apos_retrabalho" if the user selects Exceção. This is acceptable because the CONTEXT says "Exceção imutáveis" for cells that are ALREADY exceção, not for making NC cells into exceptions. Alternatively, the RPC may need a small update to handle this edge case if business rules require it.

## Sources

### Primary (HIGH confidence)
- **Codebase inspection** - All key files read and analyzed:
  - `arden/app/app/obras/[id]/verificacoes/_components/matriz-client.tsx` - Current orchestrator
  - `arden/app/app/obras/[id]/verificacoes/_components/matriz-grid.tsx` - Event delegation, cell rendering
  - `arden/app/app/obras/[id]/verificacoes/_components/matriz-header.tsx` - Header components
  - `arden/app/app/obras/[id]/verificacoes/_components/matriz-status.ts` - 6 status states + derivation
  - `arden/lib/supabase/actions/bulk-verificar.ts` - Server Action with Zod + RPC call
  - `arden/lib/supabase/actions/verificacoes.ts` - CRUD actions pattern
  - `arden/lib/supabase/queries/verificacoes.ts` - MatrizData types + getMatrizData
  - `arden/lib/validations/verificacao.ts` - ActionResult<T> type + schemas
  - `database/schema.sql` lines 833-957 - Complete `bulk_verificar` RPC source
  - `arden/components/ui/dialog.tsx` - Radix Dialog component
  - `arden/components/ui/progress.tsx` - Radix Progress component
  - `arden/components/ui/sonner.tsx` - Toast configuration
  - `arden/components/ui/button.tsx` - Button variants
  - `arden/app/layout.tsx` - Toaster placement

### Secondary (MEDIUM confidence)
- [PatternFly Bulk Selection Pattern](https://www.patternfly.org/patterns/bulk-selection/) - UX pattern reference
- [React useCallback documentation](https://react.dev/reference/react/useCallback) - Stable references, updater form
- React 19 patterns for useTransition with Server Actions

### Tertiary (LOW confidence)
- [Material 3 Expressive floating toolbars](https://9to5google.com/2025/05/18/material-3-expressive-toolbars/) - Gmail-style bottom bar direction

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in codebase, no new dependencies needed
- Architecture: HIGH - Patterns derive from existing codebase conventions (event delegation, useState, useTransition, ActionResult)
- Pitfalls: HIGH - Identified from direct code analysis (Set identity, z-index hierarchy, RPC behavior)
- Backend completeness: HIGH - Verified `bulk_verificar` RPC source code and `bulkVerificar` Server Action

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (stable -- all patterns based on existing codebase, no external dependency changes expected)
