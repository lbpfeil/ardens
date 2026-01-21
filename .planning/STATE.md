# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-19)

**Core value:** Trazer extrema rapidez e praticidade na verificacao de servicos, tornando a qualidade uma aliada da obra.
**Current focus:** Phase 5 - Biblioteca FVS (in progress)

## Current Position

Phase: 5 of 6 (Biblioteca FVS)
Plan: 4 of 4 in current phase
Status: Phase complete
Last activity: 2026-01-21 - Completed 05-03-PLAN.md (servico detail page with itens)

Progress: [#####################] 100% (22/22 plans completed)

## Performance Metrics

**Velocity:**
- Total plans completed: 22
- Average duration: 3.9 min
- Total execution time: 85 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2 | 20 min | 10 min |
| 02-obras | 4 | 18 min | 4.5 min |
| 03-agrupamentos | 4 | 10 min | 2.5 min |
| 04-unidades | 4 | 11 min | 2.75 min |
| 04.1-navegacao-contextual | 4 | 13 min | 3.25 min |
| 05-biblioteca-fvs | 4 | 13 min | 3.25 min |

**Recent Trend:**
- Last 5 plans: 4 min, 4 min, 3 min, 3 min, 3 min
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
- [04.1-01]: usePathname for active detection with exact option for controlling match behavior
- [04.1-01]: Badge component for placeholder features ("Em breve")
- [04.1-01]: Section labels only visible when sidebar expanded
- [04.1-01]: Hardcoded construtora name with TODO for auth integration
- [04.1-02]: Route renamed from /agrupamentos to /unidades to match user terminology
- [04.1-02]: Permanent redirect (301) for old URLs via next.config.ts
- [04.1-03]: Context detection: pathname.startsWith('/app/obras/') && params.id !== undefined
- [04.1-03]: Breadcrumb receives obraName={null} - enhanced later with context provider
- [04.1-03]: Removed all mock nav arrays - sidebar components are self-contained
- [04.1-04]: Obra detail page is now Dashboard (not cadastral info display)
- [04.1-04]: ObraInfoCard moved to /configuracoes route for settings management
- [04.1-04]: KPICard as inline component for dashboard metrics
- [05-01]: CategoriaServico as TypeScript type union (11 categories matching DB enum)
- [05-01]: Error code 23505 (unique_violation) returns 'Ja existe um servico com este codigo'
- [05-01]: Upsert pattern for activateServico (onConflict: obra_id,servico_id)
- [05-01]: ServicoWithActivation type for listServicosForObra join query
- [05-01]: syncObraServicos computes diff and bulk activates/deactivates
- [05-02]: getCategoryLabel helper maps categoria value to label using categoriaServicoOptions
- [05-02]: Badge variant='secondary' for all categories (consistent styling)
- [05-02]: Row click navigates to detail page (router.push to /app/biblioteca/{id})
- [05-04]: Separate queries merged client-side for activation status (Map-based merge)
- [05-04]: deactivateServico uses obraId + servicoId for API consistency
- [05-04]: Empty state links to Biblioteca FVS for service creation
- [05-03]: Split view: lg:w-80 for info panel, flex-1 for itens panel
- [05-03]: Item ordem displayed as 1-indexed (ordem + 1) for user friendliness
- [05-03]: Truncated observacao in delete confirmation (100 chars max)

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
Stopped at: Completed 05-03-PLAN.md (servico detail page with itens)
Resume file: None

## Completed Phases

### Phase 4.1: Navegacao Contextual (VERIFIED 2026-01-21)

All 4 plans executed and verified:
- 04.1-01: Navigation components (SidebarItem, SidebarGlobal, SidebarObra, Breadcrumb)
- 04.1-02: Route rename (/agrupamentos to /unidades with redirect)
- 04.1-03: Layout integration with context detection
- 04.1-04: Obra dashboard transformation, configuracoes page

Verification: 6/6 must-haves passed
Report: .planning/phases/04.1-navegacao-contextual/04.1-VERIFICATION.md

Ready for Phase 5: Biblioteca FVS

### Phase 5: Biblioteca FVS (COMPLETE 2026-01-21)

All 4 plans executed:
- 05-01: Data access layer (servicos, itens-servico, obra-servicos)
- 05-02: Biblioteca list page with servicos table
- 05-03: Servico detail page with itens CRUD
- 05-04: Obra servicos activation page

Ready for Phase 6: Dashboard (or verification)
