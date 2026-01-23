# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-19)

**Core value:** Trazer extrema rapidez e praticidade na verificacao de servicos, tornando a qualidade uma aliada da obra.
**Current focus:** Phase 5.2 - Tags e Revisao Condicional (in progress)

## Current Position

Phase: 5.2 of 9 (Tags e Revisao Condicional)
Plan: 4 of 5 in current phase
Status: In progress
Last activity: 2026-01-23 - Completed 05.2-04-PLAN.md

Progress: [##########################] 94% (30/32 plans completed)

## Performance Metrics

**Velocity:**
- Total plans completed: 30
- Average duration: 4.0 min
- Total execution time: 119 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2 | 20 min | 10 min |
| 02-obras | 4 | 18 min | 4.5 min |
| 03-agrupamentos | 4 | 10 min | 2.5 min |
| 04-unidades | 4 | 11 min | 2.75 min |
| 04.1-navegacao-contextual | 4 | 13 min | 3.25 min |
| 05-biblioteca-fvs | 4 | 13 min | 3.25 min |
| 05.1-revisoes-servico | 4 | 18 min | 4.5 min |
| 05.2-tags-revisao-condicional | 4 | 16 min | 4 min |

**Recent Trend:**
- Last 5 plans: 5 min, 4 min, 4 min, 4 min, 4 min
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
- [05.1-01]: Revision stored as VARCHAR(5) with zero-padding (00-99) for sortability
- [05.1-01]: Snapshot pattern captures codigo, nome, categoria, referencia_normativa at each revision
- [05.1-01]: createServico automatically creates initial revision record (rev 00)
- [05.1-01]: updateServicoWithRevision requires descricao_mudanca for audit trail
- [05.1-01]: activateServico captures current servico revision at activation time
- [05.1-01]: has_newer_revision computed by comparing revisao_ativa vs revisao_atual
- [05.1-02]: servicoEditFormSchema extends base schema with descricao_mudanca
- [05.1-02]: Conditional resolver: zodResolver(isEditMode ? servicoEditFormSchema : servicoFormSchema)
- [05.1-02]: Badge variant='outline' for table revision, variant='secondary' for detail page
- [05.1-04]: Use parseInt for revision comparison to handle 09 < 10 correctly
- [05.1-04]: Custom warning badge styling using bg-warning/20 text-warning (no badge variant)
- [05.1-04]: Widen container to max-w-5xl to accommodate extra revision columns
- [05.2-01]: TAG_COLORS provides 8 preset hex colors for tag picker UI
- [05.2-01]: primeira_ativacao_em NULL means service in draft mode (edits don't create revisions)
- [05.2-01]: Race condition safety with .is('primeira_ativacao_em', null) guard on bulk activations
- [05.2-02]: Color picker uses preset 8-color palette from TAG_COLORS constant
- [05.2-02]: No delete option in UI per REQ-02 (tags cannot be deleted)
- [05.2-02]: Reorder button only visible when tags.length > 1
- [05.2-03]: updateServicoSmart checks primeira_ativacao_em to decide revision behavior
- [05.2-03]: Conditional form schema: zodResolver switches based on needsRevisionDescription
- [05.2-03]: Draft mode indicator: gray dot with 'Modo rascunho' text for unactivated services
- [05.2-04]: Tag selector uses value='none' for untagged items (Select doesn't accept null)
- [05.2-04]: Untagged items appear first without header section
- [05.2-04]: Tagged groups have 3px colored left border matching tag.cor
- [05.2-04]: Table header only on first group to avoid repetition
- [05.2-04]: Groups sorted by tag.ordem, items within by item.ordem

### Pending Todos

1. **Excluir servico permanentemente (admin only)** (biblioteca) - Cascade delete com confirmacao forte
2. **Melhorar contraste de textos muted/secundários** (ui) - Textos de ajuda com baixa visibilidade em fundo escuro

### Blockers/Concerns

None yet.

### Roadmap Evolution

- Phase 4.1 inserted after Phase 4: Navegacao Contextual (URGENT)
  - Reason: Features implementadas (obras, agrupamentos, unidades) nao tem navegacao funcional
  - Sidebar atual tem placeholders hardcoded sem navegacao real
  - Necessario antes de criar mais features (Biblioteca FVS, Dashboard)

- Phase 5.1 inserted after Phase 5: Revisoes de Servicos
  - Reason: Todo servico FVS precisa de controle de revisao (padrao PBQP-H)
  - Revisao por obra deve ser independente da biblioteca
  - Necessario para rastreabilidade de mudancas em auditorias

- Phase 5.2 inserted after Phase 5.1: Tags e Revisao Condicional
  - Reason: Tags para organizar itens de verificacao por categoria/etapa
  - Revisao condicional: so gera revisao se servico ja foi ativado em obra
  - Servicos em "modo rascunho" podem ser editados livremente

## Session Continuity

Last session: 2026-01-23
Stopped at: Completed 05.2-04-PLAN.md
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

### Phase 5: Biblioteca FVS (VERIFIED 2026-01-21)

All 4 plans executed and verified:
- 05-01: Data access layer (servicos, itens-servico, obra-servicos)
- 05-02: Biblioteca list page with servicos table
- 05-03: Servico detail page with itens CRUD
- 05-04: Obra servicos activation page

Verification: 8/8 must-haves passed
Report: .planning/phases/05-biblioteca-fvs/05-VERIFICATION.md

Ready for Phase 5.1: Revisoes de Servicos

### Phase 5.1: Revisoes de Servicos (VERIFIED 2026-01-22)

All 4 plans executed and verified:
- 05.1-01: Schema and data access layer (revision tracking infrastructure)
- 05.1-02: Form modal with revision increment
- 05.1-03: Revision history panel
- 05.1-04: Obra revision tracking UI

Verification: 6/6 must-haves passed
Report: .planning/phases/05.1-revisoes-servico/05.1-VERIFICATION.md

Ready for Phase 5.2: Tags e Revisao Condicional
