# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-19)

**Core value:** Trazer extrema rapidez e praticidade na verificacao de servicos, tornando a qualidade uma aliada da obra.
**Current focus:** Phase 4.1 - Navegacao Contextual (INSERTED)

## Current Position

Phase: 4.1 of 6 (Navegacao Contextual)
Plan: 0 of ? in current phase
Status: Ready to plan
Last activity: 2026-01-21 - Phase 4.1 inserted (navegacao contextual urgente)

Progress: [##############] 100% (14/14 plans completed before insertion)

## Performance Metrics

**Velocity:**
- Total plans completed: 14
- Average duration: 4.2 min
- Total execution time: 59 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2 | 20 min | 10 min |
| 02-obras | 4 | 18 min | 4.5 min |
| 03-agrupamentos | 4 | 10 min | 2.5 min |
| 04-unidades | 4 | 11 min | 2.75 min |

**Recent Trend:**
- Last 5 plans: 3 min, 3 min, 2 min, 4 min, 3 min
- Trend: stable, fast

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Init]: Hierarquia 2 niveis (Obra > Agrupamento > Unidade)
- [Init]: Biblioteca FVS por construtora (nao compartilhada)
- [Init]: Supabase como backend com RLS nativo
- [01-01]: Use createStore from zustand/vanilla (not create) for App Router per-request isolation
- [01-01]: Enable devtools middleware only in development mode
- [01-01]: StoreProvider wraps layout content, not html/body
- [01-02]: Use Zod v3.x (not v4.x) for RHF compatibility
- [01-02]: Error messages in Portuguese for Brazilian users
- [01-02]: defaultValues required for all form fields (prevent controlled/uncontrolled warnings)
- [02-01]: Sonner Toaster uses dark theme by default (no next-themes dependency)
- [02-01]: Data access layer pattern: lib/supabase/queries/{entity}.ts with typed interfaces
- [02-01]: obraFormSchema: nome required, codigo/tipologia/cidade/estado/responsavel_tecnico optional
- [02-02]: Server Component + Client Wrapper pattern for pages with modals
- [02-02]: Cidade/estado shown in form but not persisted to DB (ObraInsert lacks columns)
- [02-03]: Modal mode prop pattern: single component handles both create and edit
- [02-03]: AlertDialog variant based on action: destructive for archive, default for restore
- [02-04]: Next.js 15 async params pattern: await params to get route params
- [02-04]: Use notFound() for invalid obra IDs rather than custom error page
- [02-04]: Detail page pattern: Server Component fetches by ID, renders header + info cards
- [03-01]: AgrupamentoWithCount uses Supabase aggregation for unidades count
- [03-01]: updateAgrupamentosOrder uses Promise.all for parallel updates
- [03-01]: generateBatchNames produces 'Prefixo N' format
- [03-01]: Batch limit set to 100 items maximum
- [03-02]: Dual form pattern: separate useForm instances for single vs batch mode
- [03-02]: Preview truncated at 5 items with '...' suffix for UX
- [03-02]: Batch mode checkbox only visible in create mode (not edit)
- [03-03]: Reorder button only visible when agrupamentos.length > 1
- [03-03]: SortableAgrupamentoRow shows drag handle without actions dropdown
- [03-03]: Delete confirmation varies description based on unidades_count
- [03-04]: Use is_admin_or_engenheiro() for agrupamentos RLS policies (engenheiros configure obra structure)
- [04-01]: Natural sort uses Intl.Collator with numeric: true for alphanumeric ordering
- [04-01]: Batch schema uses single rangeInput field with refine validation
- [04-01]: Max 500 units per batch (higher than agrupamentos' 100)
- [04-01]: parseNumericRange + generateUnidadeNames pattern for numeric range batch
- [04-02]: Split-view uses flex-col for mobile, lg:flex-row for desktop
- [04-02]: Selection highlight: bg-surface-200 + border-l-2 border-brand
- [04-02]: Count display inline with name: "Bloco A (12)" format
- [04-02]: RefreshKey state pattern to trigger unidades refetch after mutations
- [04-03]: Use is_admin_or_engenheiro() for unidades RLS policies (consistent with agrupamentos)
- [04-04]: Use sr-only DialogDescription for form modals (accessibility without visual clutter)

### Pending Todos

None.

### Blockers/Concerns

None yet.

### Roadmap Evolution

- Phase 4.1 inserted after Phase 4: Navegacao Contextual (URGENT)
  - Reason: Features implementadas (obras, agrupamentos, unidades) nao tem navegacao funcional
  - Sidebar atual tem placeholders hardcoded sem navegacao real
  - Necessario antes de criar mais features (Biblioteca FVS, Dashboard)

## Session Continuity

Last session: 2026-01-21
Stopped at: Phase 4.1 inserted, ready to plan
Resume file: None
