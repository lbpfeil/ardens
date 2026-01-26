# Arden FVS

## What This Is

Plataforma SaaS para gestao de qualidade na construcao civil, focada em verificacoes de servicos (FVS) para certificacao PBQP-H. O portal web permite que engenheiros gerenciem obras, agrupamentos, unidades, biblioteca de servicos FVS com revisoes e tags, e acompanhem KPIs de qualidade via dashboard com graficos.

**Usuario:** Engenheiro Civil com expertise em gestao de qualidade e obras, sem conhecimento tecnico em programacao. Precisa de apoio detalhado em cada etapa de desenvolvimento.

## Core Value

Trazer extrema rapidez e praticidade na verificacao de servicos, tornando a qualidade uma aliada (nao um entrave) do andamento da obra.

## Current State

**Shipped:** v1.0 MVP (2026-01-24)
**Codebase:** 13,355 lines TypeScript across ~100 files
**Tech stack:** Next.js 16 + React 19 + Supabase + shadcn/ui + Recharts + date-fns

**What's working:**
- Portal web completo com gestao de obras, agrupamentos, unidades
- Biblioteca FVS com servicos, itens de verificacao, tags coloridas
- Sistema de revisoes com historico e rastreabilidade por obra
- Modo rascunho (editar sem gerar revisao antes da primeira ativacao)
- Dashboard do engenheiro com KPIs, feed de NCs e grafico temporal
- Navegacao contextual (sidebar global + sidebar de obra)
- Drag-and-drop para reordenacao e movimentacao de itens

**Known tech debt:**
- DEV_CLIENTE_ID hardcoded (precisa auth integration)
- Nome da construtora hardcoded no breadcrumb
- isOnline=true hardcoded no status indicator

## Requirements

### Validated

<!-- Shipped and confirmed working -->

- [x] Setup Next.js 16 + React 19 + Tailwind CSS 4 — existing
- [x] Integracao Supabase (client/server/middleware) — existing
- [x] Autenticacao email/senha com Supabase Auth — existing
- [x] Rotas protegidas com middleware — existing
- [x] Landing page com CTAs — existing
- [x] Layout do app (sidebar + topbar) — existing
- [x] Schema do banco de dados completo — existing
- [x] Design system com shadcn/ui (13 componentes) — existing
- [x] Gestao de Obras (CRUD completo) — v1.0
- [x] Gestao de Agrupamentos (criar, editar, excluir, lote, reordenar) — v1.0
- [x] Gestao de Unidades (criar, editar, excluir, lote) — v1.0
- [x] Biblioteca FVS global (servicos e itens de verificacao) — v1.0
- [x] Ativar servicos por obra (obra_servicos) — v1.0
- [x] Sistema de revisoes FVS com historico — v1.0
- [x] Tags para itens de verificacao — v1.0
- [x] Revisao condicional (modo rascunho) — v1.0
- [x] Home do Engenheiro com KPIs e feed de NCs — v1.0
- [x] Grafico de evolucao temporal de conformidade — v1.0
- [x] Navegacao contextual (sidebar global + obra) — v1.0
- [x] Zustand para state management — v1.0
- [x] React Hook Form + Zod para validacao de formularios — v1.0

### Active

<!-- Next milestone scope — to be defined in /gsd:new-milestone -->

(Empty — define in next milestone)

### Out of Scope

<!-- Explicit boundaries -->

- App Mobile (Expo) — Mes 2
- Verificacoes no portal web — Mes 2
- Sync offline — Mes 2
- Relatorios PDF — Mes 3
- Condicoes de Inicio (CI) — Fase 2
- Dashboard Telao — Fase 3
- Integracoes ERPs — Fase 3
- iOS — Fase 2
- 2FA/SSO — Fase 2

## Context

**Publico-alvo:** Construtoras pequenas/medias (4-1000 unidades) com certificacao PBQP-H.

**Modelo de dominio:**
- Obra > Agrupamento > Unidade (hierarquia de 2 niveis)
- Biblioteca FVS por construtora (nao compartilhada)
- Servico tem itens de verificacao (observacao, metodo, tolerancia)
- Verificacao = Servico + Unidade

**Volumetria tipica:**
- Obra: 15-25 servicos ativos
- Construtora pequena: ~40 servicos total
- Construtora grande: ~100 servicos total

**Documentacao existente:**
- `docs/product/` — PRD completo (10 documentos)
- `docs/design/` — Design system
- `database/schema.sql` — Schema PostgreSQL completo
- `.planning/codebase/` — Mapeamento do codigo atual
- `.planning/milestones/` — Historico de milestones

## Constraints

- **Tech stack**: Next.js 16 + React 19 + Supabase + shadcn/ui — ja definido
- **UI**: Usar APENAS componentes existentes em `arden/components/ui/` — consultar `docs/design/README.md`
- **Variaveis CSS**: Usar tokens do `globals.css` — nunca valores hardcoded
- **Multi-tenancy**: RLS via `cliente_id` — ja configurado no schema
- **Commits**: Em portugues, formato `tipo: descricao`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hierarquia 2 niveis (Obra > Agrupamento > Unidade) | Simplicidade e flexibilidade para 99% dos casos | Good |
| Biblioteca FVS por construtora | Cada construtora tem seus padroes proprios | Good |
| Supabase como backend | Elimina necessidade de API layer, RLS nativo | Good |
| Schema SQL definido antes do frontend | Garante modelo de dados consistente | Good |
| Server Component + Client Wrapper pattern | Separacao de data fetching e interatividade | Good |
| createStore from zustand/vanilla | App Router per-request isolation | Good |
| Zod v3.x (not v4) | RHF compatibility | Good |
| Revision stored as VARCHAR(5) zero-padded | Sortability across revisions | Good |
| primeira_ativacao_em NULL = draft mode | Edits before first activation dont create revisions | Good |
| DashboardKPIs with current/previous | Trend calculation pattern | Good |
| date-fns with ptBR locale | Relative dates in Portuguese | Good |
| Recharts for charts | Lightweight, React-native integration | Good |

---
*Last updated: 2026-01-26 after v1.0 milestone*
