# Arden FVS

## What This Is

Plataforma SaaS para gestão de qualidade na construção civil, focada em verificações de serviços (FVS) para certificação PBQP-H. O portal web permite que engenheiros gerenciem obras, agrupamentos, unidades, biblioteca de serviços FVS com revisões e tags, executem verificações de serviços via matriz interativa com operações em massa, e acompanhem KPIs de qualidade via dashboard com gráficos alimentados por dados reais.

**Usuário:** Engenheiro Civil com expertise em gestão de qualidade e obras, sem conhecimento técnico em programação. Precisa de apoio detalhado em cada etapa de desenvolvimento.

## Core Value

Trazer extrema rapidez e praticidade na verificação de serviços, tornando a qualidade uma aliada (não um entrave) do andamento da obra.

## Current State

**Shipped:** v1.1 Verificações no Portal Web (2026-01-27)
**In progress:** v1.2 Feed de Verificações e Novo Modelo de Status
**Codebase:** 16,807 lines TypeScript across ~121 files
**Tech stack:** Next.js 16 + React 19 + Supabase + shadcn/ui + Recharts + date-fns

**What's working:**
- Portal web completo com gestão de obras, agrupamentos, unidades
- Biblioteca FVS com serviços, itens de verificação, tags coloridas
- Sistema de revisões com histórico e rastreabilidade por obra
- Modo rascunho (editar sem gerar revisão antes da primeira ativação)
- Matriz interativa de verificações serviço × unidade com heatmap de 6 estados
- Verificação individual com checklist de itens (C/NC/NA), exceção e reinspeção
- Operações em massa com seleção por célula/linha/coluna e resolução de conflitos
- Dashboard do engenheiro com KPIs reais, feed de NCs clicável e gráfico temporal
- Navegação contextual (sidebar global + sidebar de obra)
- Navegação bidirecional matriz ↔ verificação individual com preservação de estado
- Drag-and-drop para reordenação e movimentação de itens

**Known tech debt:**
- DEV_CLIENTE_ID hardcoded (precisa auth integration)
- Nome da construtora hardcoded no breadcrumb
- isOnline=true hardcoded no status indicator
- atualizarStatusVerificacao exported but unused (status via triggers)
- Upload de fotos diferido para v1.2

## Requirements

### Validated

<!-- Shipped and confirmed working -->

- [x] Setup Next.js 16 + React 19 + Tailwind CSS 4 — existing
- [x] Integração Supabase (client/server/middleware) — existing
- [x] Autenticação email/senha com Supabase Auth — existing
- [x] Rotas protegidas com middleware — existing
- [x] Landing page com CTAs — existing
- [x] Layout do app (sidebar + topbar) — existing
- [x] Schema do banco de dados completo — existing
- [x] Design system com shadcn/ui (13 componentes) — existing
- [x] Gestão de Obras (CRUD completo) — v1.0
- [x] Gestão de Agrupamentos (criar, editar, excluir, lote, reordenar) — v1.0
- [x] Gestão de Unidades (criar, editar, excluir, lote) — v1.0
- [x] Biblioteca FVS global (serviços e itens de verificação) — v1.0
- [x] Ativar serviços por obra (obra_servicos) — v1.0
- [x] Sistema de revisões FVS com histórico — v1.0
- [x] Tags para itens de verificação — v1.0
- [x] Revisão condicional (modo rascunho) — v1.0
- [x] Home do Engenheiro com KPIs e feed de NCs — v1.0
- [x] Gráfico de evolução temporal de conformidade — v1.0
- [x] Navegação contextual (sidebar global + obra) — v1.0
- [x] Zustand para state management — v1.0
- [x] React Hook Form + Zod para validação de formulários — v1.0
- [x] Server Actions para CRUD de verificações e itens — v1.1
- [x] RPC PostgreSQL para verificação em massa (bulk insert atômico) — v1.1
- [x] Queries otimizadas para alimentar a matriz — v1.1
- [x] Matriz interativa serviço × unidade com heatmap de 6 estados — v1.1
- [x] Verificação individual com itens C/NC/NA, exceção e reinspeção — v1.1
- [x] Seleção estilo planilha: célula, header de coluna, header de linha — v1.1
- [x] Verificação em massa via modal com resolução de conflitos — v1.1
- [x] Ciclo de vida: Pendente → Conforme | NC | Exceção → Reinspeção — v1.1
- [x] Dashboard com KPIs reais e feed de NCs clicável — v1.1
- [x] Navegação bidirecional matriz ↔ verificação individual — v1.1

### Active

<!-- v1.2 Feed de Verificações e Novo Modelo de Status -->

- [ ] Matriz refatorada: seleção em massa como padrão (remove click → verificação individual)
- [ ] Nova página de feed: serviços empilhados como mini-matrizes (itens × unidades) com método/tolerância
- [ ] Seleção em massa no feed: mesma mecânica da matriz (célula, header serviço, header unidade, header item)
- [ ] Toolbar inteligente: ações baseadas na intersecção de status dos itens selecionados
- [ ] Modal de confirmação antes de aplicar status no feed
- [ ] Novo modelo de status da verificação: Pendente / Verificado com Pendências / Finalizada
- [ ] Status granulares (NC, Retrabalho, etc.) exclusivos do nível de item
- [ ] Verificação individual refatorada: página de consulta/detalhe (fotos, histórico, observações)
- [ ] Navegação: feed → matriz (seleção limpa), dashboard NC → verificação individual
- [ ] Botão Exceção amarelo na toolbar de seleção

### Out of Scope

<!-- Explicit boundaries -->

- App Mobile (Expo) — Mês 2
- Sync offline — Mês 2
- Relatórios PDF — Mês 3
- Condições de Início (CI) — Fase 2
- Dashboard Telão — Fase 3
- Integrações ERPs — Fase 3
- iOS — Fase 2
- 2FA/SSO — Fase 2
- Edição inline na célula da matriz — Anti-feature: célula é indicador de status

## Context

**Público-alvo:** Construtoras pequenas/médias (4-1000 unidades) com certificação PBQP-H.

**Modelo de domínio:**
- Obra > Agrupamento > Unidade (hierarquia de 2 níveis)
- Biblioteca FVS por construtora (não compartilhada)
- Serviço tem itens de verificação (observação, método, tolerância)
- Verificação = Serviço + Unidade
- Verificação tem itens (um por item de verificação do serviço)
- Cada item: Conforme / Não Conforme / Não Aplicável
- Status da verificação (v1.2): Pendente | Verificado com Pendências | Verificação Finalizada (calculado automaticamente dos itens)
- Status do item: Pendente | Conforme | NC | Exceção | Retrabalho | Liberado com Concessão | Conforme após Reinspeção | NC após Retrabalho
- Exceção = serviço não se aplica àquela unidade (ex: serviço de lotes em ruas)

**Volumetria típica:**
- Obra: 15-25 serviços ativos
- Construtora pequena: ~40 serviços total
- Construtora grande: ~100 serviços total

**Documentação existente:**
- `docs/product/` — PRD completo (10 documentos)
- `docs/design/` — Design system
- `database/schema.sql` — Schema PostgreSQL completo
- `.planning/codebase/` — Mapeamento do código atual
- `.planning/milestones/` — Histórico de milestones

## Constraints

- **Tech stack**: Next.js 16 + React 19 + Supabase + shadcn/ui — já definido
- **UI**: Usar APENAS componentes existentes em `arden/components/ui/` — consultar `docs/design/README.md`
- **Variáveis CSS**: Usar tokens do `globals.css` — nunca valores hardcoded
- **Multi-tenancy**: RLS via `cliente_id` — já configurado no schema
- **Commits**: Em português, formato `tipo: descrição`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hierarquia 2 níveis (Obra > Agrupamento > Unidade) | Simplicidade e flexibilidade para 99% dos casos | Good |
| Biblioteca FVS por construtora | Cada construtora tem seus padrões próprios | Good |
| Supabase como backend | Elimina necessidade de API layer, RLS nativo | Good |
| Schema SQL definido antes do frontend | Garante modelo de dados consistente | Good |
| Server Component + Client Wrapper pattern | Separação de data fetching e interatividade | Good |
| createStore from zustand/vanilla | App Router per-request isolation | Good |
| Zod v3.x (not v4) | RHF compatibility | Good |
| Revision stored as VARCHAR(5) zero-padded | Sortability across revisions | Good |
| primeira_ativacao_em NULL = draft mode | Edits before first activation don't create revisions | Good |
| DashboardKPIs with current/previous | Trend calculation pattern | Good |
| date-fns with ptBR locale | Relative dates in Portuguese | Good |
| Recharts for charts | Lightweight, React-native integration | Good |
| CSS Grid customizado para matriz | Controle total, economia de ~200KB vs AG Grid | Good |
| ActionResult<T> com { data } ou { error } | Nunca throw em Server Actions | Good |
| initPlan pattern em RLS policies | Caching per-statement para performance | Good |
| SECURITY DEFINER para bulk_verificar | Bypassa RLS, verifica permissões manualmente | Good |
| sessionStorage para estado da matriz | Preserva scroll + expanded groups entre navegações | Good |
| Event delegation com data attributes | Um onClick no container do grid para performance | Good |
| Feed de verificações como fluxo principal | Matriz para visão macro + seleção, feed para ação nos itens | — Pending |
| Status da verificação calculado (não setado) | Verificação é container, status deriva dos itens | — Pending |
| Verificação individual como consulta/detalhe | Feed para ação, individual para análise (fotos, disputas) | — Pending |
| Toolbar com intersecção de ações | Só mostra ações comuns a todos os itens selecionados | — Pending |

---
*Last updated: 2026-01-28 after v1.2 milestone start*
