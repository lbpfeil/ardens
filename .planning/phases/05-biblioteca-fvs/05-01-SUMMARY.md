---
phase: 05-biblioteca-fvs
plan: 01
subsystem: database
tags: [supabase, typescript, zod, crud, servicos, validation]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Supabase client, validation patterns (common.ts)
  - phase: 02-obras
    provides: Query pattern (obras.ts), DEV_CLIENTE_ID pattern
  - phase: 03-agrupamentos
    provides: Order management pattern, batch operations pattern
provides:
  - Servico CRUD operations (listServicos, createServico, updateServico, archiveServico)
  - ItemServico CRUD operations (listItensServico, createItemServico, updateItemServico, deleteItemServico)
  - ObraServico activation operations (activateServico, deactivateServico, bulkActivateServicos)
  - Servico and ItemServico validation schemas with PT-BR messages
affects: [05-02, 05-03, 05-04, 06-dashboard]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Soft delete with arquivado flag for servicos"
    - "Hard delete for itens_servico (CASCADE via DB)"
    - "Upsert pattern for obra_servicos activation"
    - "ServicoWithActivation join pattern for activation UI"

key-files:
  created:
    - arden/lib/supabase/queries/servicos.ts
    - arden/lib/supabase/queries/itens-servico.ts
    - arden/lib/supabase/queries/obra-servicos.ts
    - arden/lib/validations/servico.ts
    - arden/lib/validations/item-servico.ts
  modified:
    - arden/lib/validations/index.ts
    - arden/components/navigation/sidebar-global.tsx

key-decisions:
  - "CategoriaServico as TypeScript type union (11 categories matching DB enum)"
  - "Error code 23505 (unique_violation) returns 'Ja existe um servico com este codigo'"
  - "Upsert pattern for activateServico (onConflict: obra_id,servico_id)"
  - "ServicoWithActivation type for listServicosForObra join query"

patterns-established:
  - "updateItensOrder: Promise.all parallel updates with security eq(servico_id)"
  - "syncObraServicos: Calculate diff (toActivate/toDeactivate) and bulk execute"
  - "createItensServicoBatch: Auto-increment ordem from max + 1"

# Metrics
duration: 4min
completed: 2026-01-21
---

# Phase 5 Plan 1: Data Access Layer Summary

**Servicos, ItensServico, and ObraServicos data access layer with typed interfaces, CRUD operations, and PT-BR validation schemas**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-21T20:11:06Z
- **Completed:** 2026-01-21T20:14:36Z
- **Tasks:** 3
- **Files modified:** 7

## Accomplishments
- Complete data access layer for servicos with soft delete (archiveServico/restoreServico)
- Complete data access layer for itens_servico with order management and batch operations
- Complete data access layer for obra_servicos with activation/deactivation and sync
- Validation schemas with PT-BR error messages for forms
- Biblioteca FVS navigation enabled (badge removed)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create servicos data access layer** - `cedc803` (feat)
2. **Task 2: Create itens-servico and obra-servicos data access layers** - `2562d0c` (feat)
3. **Task 3: Create validation schemas and update navigation** - `ed6ce09` (feat)

## Files Created/Modified

**Created:**
- `arden/lib/supabase/queries/servicos.ts` - Servico CRUD with soft delete
- `arden/lib/supabase/queries/itens-servico.ts` - ItemServico CRUD with order management
- `arden/lib/supabase/queries/obra-servicos.ts` - ObraServico activation with sync
- `arden/lib/validations/servico.ts` - servicoFormSchema with categoriaServicoOptions
- `arden/lib/validations/item-servico.ts` - itemServicoFormSchema

**Modified:**
- `arden/lib/validations/index.ts` - Re-exports for new schemas
- `arden/components/navigation/sidebar-global.tsx` - Removed "Em breve" badge from Biblioteca FVS

## Decisions Made

1. **CategoriaServico type union** - Used TypeScript type union instead of enum for better type inference and compatibility with Zod
2. **Unique constraint error handling** - Error code 23505 returns user-friendly message "Ja existe um servico com este codigo"
3. **Upsert for activation** - activateServico uses upsert with onConflict to handle idempotent activation
4. **ServicoWithActivation pattern** - Extended type for listServicosForObra that includes obra_servico_id and ativo_na_obra
5. **syncObraServicos pattern** - Computes diff between current and target, then bulk activates/deactivates

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Data access layer complete for all three tables (servicos, itens_servico, obra_servicos)
- Validation schemas ready for form integration
- Navigation shows Biblioteca FVS as active feature
- Ready for 05-02: Biblioteca list page and servicos table UI

---
*Phase: 05-biblioteca-fvs*
*Completed: 2026-01-21*
