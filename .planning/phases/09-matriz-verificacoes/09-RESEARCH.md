# Phase 9: Matriz de Verificações - Research

**Researched:** 2026-01-27
**Domain:** CSS Grid heatmap matrix + React 19 performance + Radix UI Tooltip
**Confidence:** HIGH

## Summary

This phase implements a heatmap-style verification matrix page where rows are services and columns are units (grouped by agrupamento). Each cell is a 40x40px colored square representing the verification status for a service/unit pair. The matrix needs sticky headers (top for units, left for services), collapsible column groups, progress indicators per service row, tooltips on hover, and click-to-navigate to the individual verification page.

The existing data layer (Phase 7) already provides `getMatrizData()` which returns `servicos`, `agrupamentos` (with nested `unidades`), and a `verificacoesMap` with O(1) lookup by key `"servico_id:unidade_id"`. The existing `MatrizVerificacao` interface includes `status`, `itens_conformes`, `itens_nc`, and `itens_excecao` -- but it does NOT include the `status_reinspecao` data needed to distinguish "Conforme after reinspection" from regular "Conforme". This query will need a minor extension.

The approach uses a pure CSS Grid layout (decided -- no AG Grid/TanStack Table), with `position: sticky` on header cells and the service name column. Performance is mitigated by the filter-first strategy: default to showing only the first agrupamento, keeping cell count manageable. For a typical construction project (20 services x 50 units per agrupamento), this yields approximately 1000 cells -- well within React's comfort zone without virtualization.

**Primary recommendation:** Build a div-based CSS Grid with 3-level z-index stacking for sticky headers. Use Radix Tooltip (already installed via `radix-ui@1.4.3`) for cell hover info. Extend `getMatrizData()` to return per-verificacao reinspection status for the 6-color heatmap. Use event delegation on the grid container for cell clicks. Memoize the `MatrizGrid` component and individual row components with `React.memo`.

## Standard Stack

### Core (Already Installed -- Zero New Dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.3 | Component rendering, `React.memo`, `useMemo`, `useCallback` | Framework already in use |
| Next.js | 16.1.1 | App Router, Server Components for data fetching | Framework already in use |
| @supabase/supabase-js | 2.90.1 | Data fetching via `getMatrizData()` | Already configured |
| radix-ui | 1.4.3 | `@radix-ui/react-tooltip` for cell hover tooltips | Already installed, includes Tooltip 1.2.8 |
| Tailwind CSS | 4.1.18 | Utility classes, CSS Grid, sticky positioning | Already configured |
| lucide-react | 0.562.0 | Icons for collapse/expand chevrons | Already installed |
| next/navigation | (bundled) | `useRouter` for cell click navigation | Already available |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sonner | 2.0.7 | Toast for error states | If data fetch fails |
| zustand | 5.0.10 | NOT used for this phase (decision: useState/useRef for transient UI state) | N/A |

### No New Dependencies Needed
This phase requires zero new npm packages. All libraries are already installed.

## Architecture Patterns

### Recommended File Structure
```
arden/app/app/obras/[id]/verificacoes/
├── page.tsx                          # NEW: Server Component - fetches matrix data
└── _components/
    ├── matriz-client.tsx             # NEW: Client Component - main matrix orchestrator
    ├── matriz-grid.tsx               # NEW: CSS Grid heatmap rendering
    ├── matriz-cell.tsx               # NEW: Individual cell (memoized)
    ├── matriz-header.tsx             # NEW: Multi-level column headers with collapse
    ├── matriz-service-row.tsx        # NEW: Service name + progress in sticky column
    ├── matriz-legend.tsx             # NEW: Color legend component
    └── matriz-tooltip.tsx            # NEW: Tooltip wrapper for cell hover info

arden/lib/supabase/queries/
└── verificacoes.ts                   # EXTEND: Add reinspection data to MatrizVerificacao
```

### Pattern 1: Server Component Page + Client Component Matrix
**What:** Server Component fetches data, Client Component renders the interactive grid.
**When to use:** Always for this page.
**Why:** Matrix data should be fetched server-side (RLS auth), but the interactive grid (collapse, tooltips, navigation) requires client-side interactivity.

```typescript
// arden/app/app/obras/[id]/verificacoes/page.tsx
import { createClient } from '@/lib/supabase/server'
import { getMatrizData } from '@/lib/supabase/queries/verificacoes'
import { MatrizClient } from './_components/matriz-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VerificacoesPage({ params }: PageProps) {
  const { id: obraId } = await params
  const supabase = await createClient()
  const matrizData = await getMatrizData(supabase, obraId)

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-foreground">Verificações</h1>
          <p className="text-sm text-foreground-light mt-1">
            Matriz de verificações da obra
          </p>
        </div>
        <MatrizClient initialData={matrizData} obraId={obraId} />
      </div>
    </div>
  )
}
```

### Pattern 2: CSS Grid with Div-Based Layout (NOT `<table>`)
**What:** Use `display: grid` on a div container, not HTML `<table>` elements.
**When to use:** For this heatmap matrix specifically.
**Why:** HTML `<table>` elements have limitations: `<thead>` and `<tr>` cannot be made sticky, only `<th>` can. CSS Grid gives full control over sticky behavior, multi-level headers with colspan-like spans, and dynamic column counts. The cells are purely visual (40x40px color blocks), not semantic tabular data.

```typescript
// Grid container pattern
<div
  className="overflow-auto max-h-[calc(100vh-220px)]"
  style={{
    display: 'grid',
    gridTemplateColumns: `280px repeat(${totalVisibleUnits}, 40px)`,
    gridTemplateRows: `40px 32px repeat(${servicos.length}, 40px)`,
  }}
>
  {/* Corner cell (z-index: 30) */}
  {/* Agrupamento header row (z-index: 20, sticky top: 0) */}
  {/* Unit name header row (z-index: 20, sticky top: 40px) */}
  {/* Service name column (z-index: 10, sticky left: 0) */}
  {/* Data cells (z-index: 0) */}
</div>
```

### Pattern 3: Three-Level Z-Index for Sticky Headers
**What:** Z-index hierarchy ensures correct overlapping during scroll.
**When to use:** Always for the matrix grid.
**Why:** When scrolling both horizontally and vertically, the corner cell must overlap everything, header rows must overlap data cells but not the corner, and the service column must overlap data cells but not headers.

```
Z-INDEX HIERARCHY:
z-30: Corner cell (sticky top + left) -- above everything
z-20: Header rows (sticky top) -- above data + service column
z-10: Service column (sticky left) -- above data cells only
z-0:  Data cells -- base level
```

**Critical:** All sticky elements MUST have an opaque `background-color`. Without it, scrolled content shows through the sticky element.

### Pattern 4: Event Delegation for Cell Clicks
**What:** Single `onClick` handler on the grid container, using `data-*` attributes to identify which cell was clicked.
**When to use:** For navigating to individual verification pages.
**Why:** Attaching 5000 individual click handlers creates 5000 function references. Event delegation uses one handler plus DOM traversal.

```typescript
const handleGridClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
  const cell = (e.target as HTMLElement).closest('[data-servico-id]')
  if (!cell) return

  const servicoId = cell.getAttribute('data-servico-id')
  const unidadeId = cell.getAttribute('data-unidade-id')
  if (!servicoId || !unidadeId) return

  const key = `${servicoId}:${unidadeId}`
  const verificacao = verificacoesMap[key]

  if (verificacao) {
    // Navigate to existing verification
    router.push(`/app/obras/${obraId}/verificacoes/${verificacao.id}`)
  } else {
    // Navigate to "create new" flow (pendente -- no auto-create)
    router.push(`/app/obras/${obraId}/verificacoes/nova?servico=${servicoId}&unidade=${unidadeId}`)
  }
}, [verificacoesMap, obraId, router])
```

### Pattern 5: Collapsible Agrupamento Headers
**What:** Toggle visibility of columns belonging to an agrupamento.
**When to use:** For managing large numbers of units.
**Why:** Default to first agrupamento expanded; others collapsed. This is the primary performance mitigation strategy (200+ units filtered to ~50).

```typescript
// State: Set of expanded agrupamento IDs
const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
  // Default: first agrupamento expanded
  if (agrupamentos.length > 0) {
    return new Set([agrupamentos[0].id])
  }
  return new Set()
})

// Compute visible units from expanded groups
const visibleUnits = useMemo(() => {
  return agrupamentos.flatMap(ag =>
    expandedGroups.has(ag.id) ? ag.unidades : []
  )
}, [agrupamentos, expandedGroups])
```

### Anti-Patterns to Avoid
- **Using `<table>` for the heatmap grid:** `<thead>` and `<tr>` cannot be made sticky. Individual `<th>` can, but multi-level headers with colspan are harder to implement correctly with sticky behavior.
- **Individual onClick per cell:** Creates thousands of function references, breaks React.memo memoization unless useCallback is used for each.
- **Rendering all units when obra has 200+ units:** Performance degrades. Always filter by agrupamento first.
- **Using `overflow: hidden` on a parent of sticky elements:** This breaks sticky positioning entirely. Only the scroll container itself should have `overflow: auto`.
- **Inline function handlers in cell render:** Every render creates new function references, invalidating React.memo. Use event delegation or a single stable callback.
- **Using Zustand for collapse/tooltip state:** Decision says useState/useRef for transient UI state. This is correct -- collapse state doesn't need to survive navigation.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Tooltip on hover | Custom CSS tooltip | Radix UI Tooltip (via `radix-ui@1.4.3`) | Accessibility, Portal rendering, collision detection, WCAG 2.1 compliant |
| Progress bar per service | Custom div with width% | Existing `<Progress>` component (`components/ui/progress.tsx`) | Already uses Radix Progress, consistent styling |
| Cell status color derivation | Ad-hoc color logic per cell | Centralized `getStatusColor()` utility function | Single source of truth for 6 status -> color mappings |
| Scroll container with sticky | Manual JS scroll tracking | Pure CSS `position: sticky` with proper z-index | Browser-native, 60fps, zero JS overhead |
| Data fetching | New query function | Extend existing `getMatrizData()` in `verificacoes.ts` | Already fetches 95% of needed data in parallel |
| Navigation to individual page | Custom routing logic | `next/navigation` `useRouter().push()` | Standard Next.js pattern, preserves history |

**Key insight:** The Radix Tooltip component is already available via `radix-ui@1.4.3` (which bundles `@radix-ui/react-tooltip@1.2.8`). The shadcn/ui tooltip component is NOT yet installed in `components/ui/`, so it must be added via `npx shadcn@latest add tooltip` -- this generates the wrapper component that uses the already-installed Radix primitive.

## Common Pitfalls

### Pitfall 1: Sticky Headers Breaking with Intermediate Overflow
**What goes wrong:** `position: sticky` stops working when any ancestor between the sticky element and the scroll container has `overflow: hidden`, `overflow: auto`, or `overflow: scroll`.
**Why it happens:** CSS spec requires sticky elements to work relative to the nearest scrolling ancestor. An intermediate `overflow` creates a new containing block.
**How to avoid:**
- The scroll container must be the DIRECT ancestor of the grid.
- Do NOT wrap the grid in any div with `overflow-hidden` for styling.
- Structure: `<div className="overflow-auto"> <div style={{display:'grid'}}> ... </div> </div>`
**Warning signs:** Headers stop sticking when you add a wrapper div.

### Pitfall 2: Missing Background on Sticky Elements
**What goes wrong:** Content scrolls behind sticky headers and is visible through transparent backgrounds.
**Why it happens:** Sticky elements need opaque backgrounds to occlude content beneath them.
**How to avoid:** Every sticky cell (`position: sticky`) MUST have an explicit background color:
- Corner cell: `bg-surface-100`
- Header rows: `bg-surface-100`
- Service column: `bg-surface-100`
**Warning signs:** Text from data cells bleeds through header area during scroll.

### Pitfall 3: Z-Index Without Position
**What goes wrong:** Z-index has no effect on elements without `position: relative|absolute|fixed|sticky`.
**Why it happens:** CSS spec requires a positioned context for z-index.
**How to avoid:** Sticky elements automatically create a stacking context. For data cells that need to be below sticky elements, they don't need explicit z-index (they're at the default stacking level).

### Pitfall 4: Re-Renders Cascade When Parent State Changes
**What goes wrong:** Changing collapse state for one agrupamento re-renders ALL cells, including those in other agrupamentos.
**Why it happens:** When `expandedGroups` state changes, the parent component re-renders, and all children re-render unless memoized.
**How to avoid:**
1. `React.memo` on `MatrizCell` component
2. `React.memo` on `MatrizServiceRow` component
3. `useMemo` for `visibleUnits` derivation
4. `useCallback` for event handlers passed as props
5. Event delegation instead of per-cell callbacks
**Warning signs:** UI jank when expanding/collapsing agrupamentos.

### Pitfall 5: Status Mapping Incomplete for Heatmap
**What goes wrong:** The 6-status heatmap needs finer granularity than the database `status_verificacao` enum provides.
**Why it happens:** The `status_verificacao` enum has 4 values (`pendente`, `em_andamento`, `concluida`, `com_nc`), but the heatmap needs 6 visual states: Pendente, Conforme, NC, Exceção, Conforme após Reinspeção, NC após Reinspeção.
**How to avoid:** Derive the visual status from the combination of `status_verificacao` + item-level counters:
- **Pendente**: `status === 'pendente'` (no verification exists, or all items nao_verificado)
- **Conforme**: `status === 'concluida'` AND `itens_conformes === total_itens`
- **NC**: `status === 'com_nc'` (has open NCs, no reinspection yet)
- **Exceção**: `status === 'concluida'` AND `itens_excecao === total_itens`
- **Conforme após Reinspeção**: `status === 'concluida'` AND has reinspection data AND no open NCs
- **NC após Reinspeção**: `status === 'com_nc'` AND has reinspection data (re-inspected but still NC)

The current `getMatrizData()` query does NOT return reinspection-level data. It needs to be extended to fetch a boolean flag or count for "has reinspection items".

### Pitfall 6: Tooltip Provider Wrapping in shadcn v4
**What goes wrong:** The shadcn/ui v4 Tooltip component internally wraps each `<Tooltip>` with its own `<TooltipProvider>`. If you also wrap externally, you get redundant nested providers causing performance issues.
**Why it happens:** shadcn/ui v4 changed the internal implementation.
**How to avoid:** When using shadcn's `<Tooltip>` component, do NOT wrap with `<TooltipProvider>`. The component handles this internally. If you need a shared `delayDuration` across many tooltips (which we do for the grid), wrap the entire grid in a single `<TooltipProvider delayDuration={300}>` and use Radix primitives directly inside.
**Warning signs:** Tooltips feel sluggish or don't appear consistently.

### Pitfall 7: Page Navigation URL for Pending Cells
**What goes wrong:** Clicking a pending cell (no verification exists) navigates to a non-existent verificacaoId.
**Why it happens:** Pending cells have no record in `verificacoesMap`.
**How to avoid:** Decision says clicking a pending cell should NOT auto-create a verification. Two options:
1. Navigate to a "new verification" page with query params: `/app/obras/[id]/verificacoes/nova?servico=X&unidade=Y`
2. Navigate to the individual page which handles the "no verification exists" state gracefully
The individual page (Phase 8) already handles null verification case -- see `page.tsx` line 19-25 which returns "Verificação não encontrada". This needs to be updated to show a "start verification" prompt instead.

## Code Examples

### Status-to-Color Mapping Utility
```typescript
// Source: Derived from CONTEXT.md decisions + codebase CSS variables
// File: _components/matriz-cell.tsx (or a shared utility)

type MatrizCellStatus =
  | 'pendente'
  | 'conforme'
  | 'nao_conforme'
  | 'excecao'
  | 'conforme_reinspecao'
  | 'nc_reinspecao'

/**
 * Maps a verification's visual status to its heatmap background color.
 * Uses CSS custom properties from the design system.
 *
 * Colors chosen for dark mode contrast on bg-surface-100 (#232323):
 * - Pendente: neutral surface (empty cell)
 * - Conforme: brand green
 * - NC: destructive red
 * - Exceção: warning amber
 * - Conforme após Reinspeção: lighter green (brand-600)
 * - NC após Reinspeção: lighter red (destructive-600)
 */
const STATUS_COLORS: Record<MatrizCellStatus, string> = {
  pendente: 'bg-surface-200',                    // #2a2a2a - neutral empty
  conforme: 'bg-brand',                          // hsl(153.1 60.2% 52.7%) - solid green
  nao_conforme: 'bg-destructive',                // hsl(10.2 77.9% 53.9%) - solid red
  excecao: 'bg-warning',                         // hsl(38.9 100% 42.9%) - amber
  conforme_reinspecao: 'bg-brand-600',            // hsl(154.9 59.5% 70%) - lighter green
  nc_reinspecao: 'bg-destructive-600',            // hsl(9.7 85.2% 62.9%) - lighter red
}

const STATUS_LABELS: Record<MatrizCellStatus, string> = {
  pendente: 'Pendente',
  conforme: 'Conforme',
  nao_conforme: 'Não Conforme',
  excecao: 'Exceção',
  conforme_reinspecao: 'Conforme após Reinspeção',
  nc_reinspecao: 'NC após Reinspeção',
}
```

### CSS Grid Container with Sticky Headers
```typescript
// Source: CSS-Tricks sticky header pattern + CSS Grid docs
// File: _components/matriz-grid.tsx

interface MatrizGridProps {
  servicos: MatrizServico[]
  visibleUnits: MatrizUnidade[]
  agrupamentos: MatrizAgrupamento[]  // for header rendering
  expandedGroups: Set<string>
  verificacoesMap: Record<string, MatrizVerificacao>
  onToggleGroup: (groupId: string) => void
  obraId: string
}

const MatrizGrid = memo(function MatrizGrid({
  servicos,
  visibleUnits,
  agrupamentos,
  expandedGroups,
  verificacoesMap,
  onToggleGroup,
  obraId,
}: MatrizGridProps) {
  const router = useRouter()
  const totalCols = visibleUnits.length

  // Event delegation for cell clicks
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest('[data-cell]') as HTMLElement | null
    if (!cell) return

    const servicoId = cell.dataset.servicoId
    const unidadeId = cell.dataset.unidadeId
    if (!servicoId || !unidadeId) return

    const key = `${servicoId}:${unidadeId}`
    const verificacao = verificacoesMap[key]

    if (verificacao) {
      router.push(`/app/obras/${obraId}/verificacoes/${verificacao.id}`)
    } else {
      // Pending cell: navigate but don't auto-create
      router.push(
        `/app/obras/${obraId}/verificacoes/nova?servico=${servicoId}&unidade=${unidadeId}`
      )
    }
  }, [verificacoesMap, obraId, router])

  return (
    <div
      className="overflow-auto rounded-md border border-border"
      style={{ maxHeight: 'calc(100vh - 280px)' }}
    >
      <div
        onClick={handleClick}
        style={{
          display: 'grid',
          gridTemplateColumns: `280px repeat(${totalCols}, 40px)`,
          // Row 1: agrupamento names, Row 2: unit names, then service rows
          gridTemplateRows: `40px 32px repeat(${servicos.length}, 40px)`,
        }}
      >
        {/* Corner cell: z-30, sticky top+left */}
        <div
          className="bg-surface-100 border-b border-r border-border"
          style={{
            position: 'sticky',
            top: 0,
            left: 0,
            zIndex: 30,
            gridRow: '1 / 3',  // spans both header rows
            gridColumn: '1',
          }}
        />

        {/* Agrupamento header row: z-20, sticky top:0 */}
        {/* Unit name header row: z-20, sticky top:40px */}
        {/* Service rows with sticky left column */}
        {/* Data cells */}
      </div>
    </div>
  )
})
```

### Multi-Level Header with Collapse
```typescript
// Source: Synthesized from CSS Grid colspan-like pattern
// File: _components/matriz-header.tsx

// Agrupamento header spans multiple columns
function AgrupamentoHeader({
  agrupamento,
  isExpanded,
  onToggle,
  startCol,    // grid column start position (2-based, since col 1 is service name)
  unitCount,   // number of units in this agrupamento
}: {
  agrupamento: MatrizAgrupamento
  isExpanded: boolean
  onToggle: () => void
  startCol: number
  unitCount: number
}) {
  return (
    <div
      className="bg-surface-100 border-b border-r border-border flex items-center gap-1 px-2 cursor-pointer hover:bg-surface-200 text-xs font-medium text-foreground-light"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 20,
        gridRow: '1',
        gridColumn: isExpanded
          ? `${startCol} / span ${unitCount}`
          : `${startCol} / span 1`,
      }}
      onClick={onToggle}
    >
      <ChevronRight
        className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
      />
      <span className="truncate">{agrupamento.nome}</span>
    </div>
  )
}
```

### Tooltip for Cell Hover
```typescript
// Source: Radix UI Tooltip docs (v1.2.8 via radix-ui@1.4.3)
// File: _components/matriz-tooltip.tsx

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// Note: Must first install shadcn tooltip component:
// npx shadcn@latest add tooltip

function CellWithTooltip({
  children,
  status,
  verificacao,
}: {
  children: React.ReactNode
  status: MatrizCellStatus
  verificacao: MatrizVerificacao | null
}) {
  if (status === 'pendente') {
    // No tooltip for pending cells
    return <>{children}</>
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <div className="space-y-1">
          <div className="font-medium">{STATUS_LABELS[status]}</div>
          {verificacao?.data_conclusao && (
            <div className="text-foreground-lighter">
              {format(new Date(verificacao.data_conclusao), 'dd/MM/yyyy')}
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
```

### Extending getMatrizData for Reinspection Status
```typescript
// Source: Existing verificacoes.ts query + reinspection fields from schema
// File: lib/supabase/queries/verificacoes.ts (extend)

// Current MatrizVerificacao needs additional field:
export interface MatrizVerificacao {
  id: string
  unidade_id: string
  servico_id: string
  status: 'pendente' | 'em_andamento' | 'concluida' | 'com_nc'
  total_itens: number
  itens_verificados: number
  itens_conformes: number
  itens_nc: number
  itens_excecao: number
  // NEW: needed for 6-status heatmap
  tem_reinspecao: boolean  // true if any item has status_reinspecao != null
}

// In getMatrizData, the verificacoes query needs to JOIN or subquery
// to check for reinspection existence. Options:
//
// Option A: Add computed column via RPC/view (cleanest)
// Option B: Fetch itens_verificacao with reinspection status (heavier)
// Option C: Add a `tem_reinspecao` boolean column to verificacoes table
//           updated by the trigger (most performant, requires migration)
//
// Recommended: Option A or C. Since the trigger already recalculates
// counters, adding a `tem_reinspecao` flag to the trigger is simple.
```

### Deriving Visual Status from Data
```typescript
// Source: Derived from schema enums + CONTEXT.md 6-status requirement

function deriveMatrizCellStatus(
  verificacao: MatrizVerificacao | undefined
): MatrizCellStatus {
  if (!verificacao) return 'pendente'

  const { status, itens_conformes, itens_nc, itens_excecao, total_itens, tem_reinspecao } = verificacao

  if (status === 'pendente') return 'pendente'

  if (status === 'concluida') {
    if (itens_excecao === total_itens) return 'excecao'
    if (tem_reinspecao) return 'conforme_reinspecao'
    return 'conforme'
  }

  if (status === 'com_nc') {
    if (tem_reinspecao) return 'nc_reinspecao'
    return 'nao_conforme'
  }

  // em_andamento: treat as pendente visually (partially inspected)
  return 'pendente'
}
```

## Existing Codebase Integration Points

### 1. Sidebar Navigation (Already Configured)
The sidebar (`components/navigation/sidebar-obra.tsx`) already has a "Verificações" link pointing to `/app/obras/${obraId}/verificacoes`. The page just needs to exist at that route.

### 2. Page URL Structure
- Matrix page: `/app/obras/[id]/verificacoes/page.tsx` (NEW)
- Individual page: `/app/obras/[id]/verificacoes/[verificacaoId]/page.tsx` (EXISTS)
- New verification flow: `/app/obras/[id]/verificacoes/nova/page.tsx` (NEW, for pending cell click)

### 3. Data Layer (Mostly Exists)
- `getMatrizData()` in `lib/supabase/queries/verificacoes.ts` -- EXISTS, needs extension
- `getVerificacaoComItens()` -- EXISTS in same file
- Server Actions in `lib/supabase/actions/verificacoes.ts` -- EXISTS
- SupabaseClient as parameter pattern -- ALREADY IMPLEMENTED

### 4. Layout Integration
The app layout (`app/app/layout.tsx`) renders `<main className="flex-1 overflow-auto bg-surface-100">`. The matrix page content goes inside this. The page wrapper should use `bg-background` (not bg-surface-100) for the outer container, matching existing page patterns (see `obras/[id]/page.tsx`).

**Important:** The main content area already has `overflow-auto`. The matrix grid needs its OWN scroll container (inner div with `overflow-auto` and `max-height`) to keep sticky headers within the grid context, not relative to the main layout scroll.

### 5. Breadcrumb Integration
The existing breadcrumb (`components/navigation/breadcrumb.tsx`) already handles the "verificacoes" section label (line 13: `verificacoes: 'Verificações'`). It will automatically show "Obra Name / Verificações" when on this page.

### 6. CSS Variables for Status Colors
The design system provides these relevant color variables:

| Status | CSS Variable | Tailwind Class | Hex (Dark) |
|--------|-------------|----------------|------------|
| Pendente (empty) | `--surface-200` | `bg-surface-200` | `#2a2a2a` |
| Conforme | `--brand` | `bg-brand` | `hsl(153.1 60.2% 52.7%)` |
| NC | `--destructive` | `bg-destructive` | `hsl(10.2 77.9% 53.9%)` |
| Exceção | `--warning` | `bg-warning` | `hsl(38.9 100% 42.9%)` |
| Conforme após Reinspeção | `--brand-600` | `bg-brand-600` | `hsl(154.9 59.5% 70%)` |
| NC após Reinspeção | `--destructive-600` | `bg-destructive-600` | `hsl(9.7 85.2% 62.9%)` |

**Note:** `bg-brand-600` and `bg-destructive-600` are defined in `globals.css` as `--brand-600` and `--destructive-600` CSS variables. They are mapped in the `@theme inline` block, so they are usable as Tailwind classes. Verified from `globals.css` lines 129 and 153.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<table>` with sticky `<th>` | CSS Grid with sticky divs | CSS Grid browser support (2020+) | Full control over multi-level headers, no table layout limitations |
| Individual cell click handlers | Event delegation on container | React 18+ best practice for grids | Fewer function references, better memoization |
| Virtualization for large grids | Filter-first (show one agrupamento) | Application-specific decision | Simpler implementation, no virtualization library overhead |
| `TooltipProvider` wrapper per tooltip | shadcn v4 internally wraps each Tooltip | shadcn/ui v4 (2025) | No external Provider needed per tooltip |
| `useMemo` alone for grid performance | `React.memo` + `useCallback` + event delegation | React 19 best practices | Combined approach prevents cascade re-renders |

**Deprecated/outdated:**
- `border-collapse: collapse` on CSS Grid: Not applicable. CSS Grid does not use `border-collapse`. Use `gap: 1px` with a background color on the container for grid-line borders, or individual `border` on cells.
- `useFormState` from `react-dom`: Renamed to `useActionState` in React 19 (not relevant for this phase but noted).

## Open Questions

1. **Reinspection Data in Matrix Query**
   - What we know: The current `getMatrizData()` does not return reinspection-level data. The schema has `status_reinspecao` on `itens_verificacao`.
   - What's unclear: Best approach to extend -- add `tem_reinspecao` column to `verificacoes` (trigger-maintained), or subquery in `getMatrizData()`, or fetch as a separate query.
   - Recommendation: Add a `tem_reinspecao` boolean column to `verificacoes` table, updated by the existing `atualizar_contadores_verificacao()` trigger. This is the most performant option (O(1) lookup vs. subquery per verificacao). Requires one Supabase migration.

2. **Pending Cell Click Behavior**
   - What we know: Clicking a pending cell should NOT auto-create a verification. The user must confirm.
   - What's unclear: Does the individual verification page (Phase 8) need modification to handle the "no verification exists yet" state?
   - Recommendation: Create a new route `/app/obras/[id]/verificacoes/nova` that shows a confirmation prompt before creating the verification via Server Action. This keeps the individual page focused on existing verifications.

3. **URL State for Selected Agrupamento**
   - What we know: CONTEXT.md says Claude's discretion for "URL state vs client state".
   - Recommendation: Use URL search params (`?agrupamento=ID`) for the selected/expanded group. This enables deep linking and browser back/forward. Implement with `useSearchParams()` from `next/navigation`.

4. **Progress Bar Component Size**
   - What we know: The existing `<Progress>` component has `h-1` height (4px). For the matrix, the mini progress bar should be even smaller.
   - Recommendation: Use `<Progress className="h-0.5 w-16" />` (2px height, 64px width) to fit below the service name in the sticky column.

## Sources

### Primary (HIGH confidence)
- **Codebase analysis** - Direct examination of:
  - `arden/lib/supabase/queries/verificacoes.ts` - MatrizData types and getMatrizData query
  - `arden/lib/supabase/actions/verificacoes.ts` - Server Actions for verification CRUD
  - `arden/lib/supabase/actions/itens-verificacao.ts` - Item-level Server Actions
  - `arden/app/app/layout.tsx` - App layout structure (sidebar + main)
  - `arden/app/globals.css` - All CSS variables, theme colors, surface scale
  - `arden/components/navigation/sidebar-obra.tsx` - Sidebar with "Verificações" link
  - `arden/components/navigation/breadcrumb.tsx` - Breadcrumb with "verificacoes" label
  - `arden/components/ui/progress.tsx` - Existing Progress component (Radix-based)
  - `arden/app/app/obras/[id]/verificacoes/[verificacaoId]/page.tsx` - Individual verification page
  - `database/schema.sql` - Enums, triggers, table definitions
  - `docs/design/DESIGN-SYSTEM.md` - Full design system reference

- **Package verification** - `radix-ui@1.4.3` includes `@radix-ui/react-tooltip@1.2.8`

### Secondary (MEDIUM confidence)
- [CSS-Tricks: Sticky header + sticky first column](https://css-tricks.com/a-table-with-both-a-sticky-header-and-a-sticky-first-column/) - Z-index hierarchy pattern
- [ReactGrid: Concurrent sticky headers in pure CSS](https://reactgrid.com/blog/how-to-build-a-table-with-concurrent-sticky-headers/) - 9-pane layout concept
- [Radix UI Tooltip documentation](https://www.radix-ui.com/primitives/docs/components/tooltip) - API reference, Provider pattern
- [shadcn/ui Tooltip](https://ui.shadcn.com/docs/components/tooltip) - Component wrapper setup
- [shadcn/ui GitHub Issue #7166](https://github.com/shadcn-ui/ui/issues/7166) - TooltipProvider redundancy in v4
- [React.memo documentation](https://react.dev/reference/react/memo) - Memoization API
- [LetsBuildUI: Heatmap Chart Component](https://www.letsbuildui.dev/articles/building-a-heatmap-chart-component/) - CSS Grid heatmap pattern

### Tertiary (LOW confidence)
- [Medium: Multi-Directional Sticky CSS (Jan 2026)](https://medium.com/@ashutoshgautam10b11/multi-directional-sticky-css-and-horizontal-scroll-in-tables-41fc25c3ce8b) - Recent article, unverified
- [DEV Community: Sticky header + frozen column](https://dev.to/lalitkhu/creating-a-scrollable-table-with-a-sticky-header-and-frozen-column-using-html-and-css-1d2a) - Community pattern
- [Medium: Advanced Performance Patterns for React Data Grids](https://medium.com/@sapnakul/advanced-performance-patterns-for-react-data-grids-real-world-lessons-generic-solutions-4498e3594581) - Event delegation + memoization patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies verified in package.json and node_modules
- Architecture (CSS Grid + Sticky): HIGH - Well-documented CSS spec behavior, verified with multiple authoritative sources
- Architecture (React performance): HIGH - Standard React.memo + useCallback + event delegation patterns, documented in React official docs
- Data layer: HIGH - Directly examined existing `getMatrizData()`, `MatrizData` types, and schema
- Status-to-color mapping: HIGH - Derived from existing CSS variables in globals.css + CONTEXT.md decisions
- Tooltip: HIGH - Radix Tooltip 1.2.8 verified installed, API documented in official docs
- Open questions (reinspection data): MEDIUM - Known gap, clear recommendation but requires migration decision

**Research date:** 2026-01-27
**Valid until:** 2026-02-27 (30 days - stable stack, no rapid changes expected)
