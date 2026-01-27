# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-26)
See: .planning/CONVENTIONS.md (regras obrigatórias para novas páginas/tabelas)

**Core value:** Trazer extrema rapidez e praticidade na verificação de serviços, tornando a qualidade uma aliada da obra.
**Current focus:** v1.1 Verificações no Portal Web

## Current Position

Phase: 8 - Verificação Individual — IN PROGRESS
Plan: 1 of 3 complete (08-01)
Status: Página individual criada, prosseguir para 08-02
Last activity: 2026-01-27 — Completado 08-01-PLAN.md (página individual com checklist)

Progress: [███.......] 2/5 fases | 6/28 requisitos

## Performance Metrics

**v1.0 Summary:**
- Total plans completed: 34
- Average duration: 4.0 min
- Total execution time: 146 min
- Timeline: 5 days (2026-01-19 to 2026-01-24)

**v1.1 Summary:**
- Total plans completed: 4
- Average duration: 3.5 min (Phase 7-8)
- Started: 2026-01-26
- Phase 7: 3 plans, 2 waves — COMPLETE
- Phase 8: 1 of 3 plans complete

## Accumulated Context

### Decisions

All v1.0 decisions documented in PROJECT.md Key Decisions table.

**v1.1 Decisions:**
- CSS Grid customizado para matriz (não usar AG Grid/TanStack Table) — controle total, economia de ~200KB bundle
- Estado de seleção em useState/useRef local (não Zustand global) — estado transiente de UI
- Upload de fotos diferido para v1.2 — foco na verificação sem fotos primeiro
- Filtro por agrupamento como default na matriz — mitiga performance com muitas unidades
- RPC PostgreSQL para bulk insert — atomicidade e eficiência
- Padrão 'use server' em lib/supabase/actions/ — separa mutations de queries
- ActionResult<T> com { data } ou { error } — nunca throw em Server Actions
- Imutabilidade: verificação Conforme (concluída + todos itens conformes) é travada
- UI "NA" (Não se Aplica) → enum 'exceção' no banco
- Nomes de colunas de itens_servico: observacao/metodo/tolerancia (não descricao/metodo_verificacao/criterio_aceitacao)
- initPlan pattern em RLS policies de verificações — (SELECT fn()) para caching per-statement
- SECURITY DEFINER com autorização interna para bulk_verificar — bypassa RLS, verifica permissões manualmente
- Limite 500 pares por operação bulk — proteção contra timeout em operações em massa
- SupabaseClient como parâmetro nas queries (não import direto) — flexibilidade server/client
- **NC modal interception com rollback automático** (08-01) — pendingNC não atualiza state, rollback é implícito
- **Empty value guard em ToggleGroup** (08-01) — previne desmarcar itens já verificados
- **Status indicator via left border color** (08-01) — feedback visual sutil sem badges extras

### Pending Todos

1. **Excluir serviço permanentemente (admin only)** (biblioteca) - Cascade delete com confirmação forte
2. **Sidebar flutuante com transição suave** (ui) - Overlay sobre conteúdo, ícones fixos, transição suave

### Blockers/Concerns

None.

### Roadmap Evolution

v1.0 roadmap archived to .planning/milestones/v1.0-ROADMAP.md
v1.1 roadmap created: .planning/ROADMAP.md (Fases 7-11, 28 requisitos)

## Session Continuity

Last session: 2026-01-27
Stopped at: Completado 08-01 (página individual de verificação com checklist)
Resume file: None

## Completed Phases (v1.1)

### Phase 7: Fundação de Dados e Server Actions (COMPLETE 2026-01-26)

3 plans, 2 waves, 4 requisitos (DADOS-01 a DADOS-04) — all verified.
Key artifacts:
- arden/lib/validations/verificacao.ts (Zod schemas + ActionResult)
- arden/lib/supabase/actions/verificacoes.ts (3 Server Actions CRUD)
- arden/lib/supabase/actions/itens-verificacao.ts (2 Server Actions itens)
- arden/lib/supabase/actions/bulk-verificar.ts (Server Action + RPC wrapper)
- arden/lib/supabase/queries/verificacoes.ts (getMatrizData + getVerificacaoComItens)
- RPC bulk_verificar aplicada ao banco
- 10 RLS policies otimizadas com initPlan

## Active Phases (v1.1)

### Phase 8: Verificação Individual (IN PROGRESS)

**Plan 08-01 (COMPLETE 2026-01-27):** Página Individual de Verificação
- 2 tasks, 2 commits (781a93e, 89b2293), 3.4 min
- Página em /app/obras/[id]/verificacoes/[verificacaoId]
- Checklist de itens com toggles C/NC/NA (ToggleGroup do radix-ui)
- Modal de NC com observação obrigatória (Zod validation)
- Atualizações otimistas com rollback em erro
- Empty value guard previne desmarcar itens
- Status indicator via left border color
- Imutabilidade de verificação Conforme travada
- Requisitos implementados: VERIF-01, VERIF-02 (parcial)

## Completed Milestones

### v1.0 MVP (SHIPPED 2026-01-24)

9 phases, 34 plans, 36 requirements — all verified.
See: .planning/milestones/v1.0-ROADMAP.md
See: .planning/milestones/v1.0-REQUIREMENTS.md
See: .planning/MILESTONES.md
