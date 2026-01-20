---
phase: 03-agrupamentos
plan: 03
subsystem: ui
tags: [nextjs, react, dnd-kit, shadcn, drag-and-drop, reorder]

# Dependency graph
requires:
  - phase: 03-agrupamentos
    plan: 01
    provides: Data access layer, @dnd-kit packages
  - phase: 03-agrupamentos
    plan: 02
    provides: AgrupamentosTable, AgrupamentosPageClient
  - phase: 02-obras
    provides: ArchiveConfirmation pattern for delete dialogs
provides:
  - Delete confirmation dialog with unidades count warning
  - Drag-and-drop reorder mode for agrupamentos
  - SortableAgrupamentoRow component
affects: [unidades-phase, fvs-phase]

# Tech tracking
tech-stack:
  added: []
  patterns: [reorder-mode-toggle, dnd-kit-table-rows]

key-files:
  created:
    - arden/app/app/obras/[id]/agrupamentos/_components/delete-confirmation.tsx
    - arden/app/app/obras/[id]/agrupamentos/_components/sortable-agrupamento-row.tsx
  modified:
    - arden/app/app/obras/[id]/agrupamentos/_components/agrupamentos-page-client.tsx
    - arden/app/app/obras/[id]/agrupamentos/_components/agrupamentos-table.tsx

key-decisions:
  - "Reorder button only visible when agrupamentos.length > 1"
  - "SortableAgrupamentoRow shows drag handle without actions dropdown"
  - "Delete confirmation varies description based on unidades_count"

patterns-established:
  - "Reorder mode pattern: isReorderMode state toggles toolbar and table rendering"
  - "DndContext wraps table with SortableContext for vertical list strategy"
  - "pendingOrder tracks local state until explicit save"

# Metrics
duration: 3min
completed: 2026-01-20
---

# Phase 3 Plan 3: Delete and Reorder Summary

**Delete confirmation dialog with cascade warning and drag-and-drop reorder mode using @dnd-kit for agrupamentos list management**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-20T16:05:00Z
- **Completed:** 2026-01-20T16:08:00Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Delete confirmation dialog following archive-confirmation pattern
- Warning shows unidades count when deleting non-empty agrupamento
- Drag-and-drop reorder mode with explicit save/cancel workflow
- Keyboard accessibility for drag-and-drop via KeyboardSensor

## Task Commits

Each task was committed atomically:

1. **Task 1: Add delete confirmation dialog** - `922b20b` (feat)
2. **Task 2: Add drag-and-drop reorder mode** - `d361f2f` (feat)

## Files Created/Modified

- `arden/app/app/obras/[id]/agrupamentos/_components/delete-confirmation.tsx` - AlertDialog for delete confirmation with unidades cascade warning
- `arden/app/app/obras/[id]/agrupamentos/_components/sortable-agrupamento-row.tsx` - Draggable table row with GripVertical handle
- `arden/app/app/obras/[id]/agrupamentos/_components/agrupamentos-page-client.tsx` - Added delete and reorder state management
- `arden/app/app/obras/[id]/agrupamentos/_components/agrupamentos-table.tsx` - Added DndContext, SortableContext, reorder mode rendering

## Decisions Made

- **Reorder visibility:** "Reordenar" button only shown when more than 1 agrupamento exists (no point reordering single item)
- **Reorder table structure:** Reorder mode shows different columns (drag handle, nome, unidades) without actions dropdown
- **pendingOrder pattern:** Local state tracks dragged order until user explicitly clicks "Salvar Ordem", allowing discard via "Cancelar"

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 03 (Agrupamentos) complete with full CRUD, batch creation, and reordering
- Ready for Unidades phase which will follow same patterns
- @dnd-kit patterns established for reuse in future sortable lists

---
*Phase: 03-agrupamentos*
*Completed: 2026-01-20*
