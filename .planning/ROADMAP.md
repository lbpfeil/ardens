# Roadmap: Arden FVS Mes 1 MVP

## Overview

Este roadmap cobre o Mes 1 do MVP do Arden FVS, focando na gestao de entidades do dominio (Obras, Agrupamentos, Unidades, Servicos) e no dashboard do engenheiro. A estrutura segue a hierarquia natural do modelo de dominio: Foundation para infraestrutura de forms/state, depois as entidades em ordem de dependencia (Obras > Agrupamentos > Unidades), Biblioteca FVS para servicos, e finalmente o Dashboard que consolida dados de todas as entidades.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation** - Infraestrutura de state management e validacao de forms
- [x] **Phase 2: Obras** - CRUD completo de obras com listagem, criacao, edicao e arquivamento
- [x] **Phase 3: Agrupamentos** - Gestao de agrupamentos vinculados a obras
- [x] **Phase 4: Unidades** - Gestao de unidades vinculadas a agrupamentos
- [x] **Phase 4.1: Navegacao Contextual** - Sidebar global vs sidebar de obra (INSERTED)
- [x] **Phase 5: Biblioteca FVS** - Gestao de servicos e itens de verificacao
- [x] **Phase 5.1: Revisoes de Servicos** - Sistema de controle de revisoes FVS (INSERTED)
- [x] **Phase 5.2: Tags e Revisao Condicional** - Tags para itens e revisao apenas quando servico ja foi ativado (INSERTED)
- [x] **Phase 6: Dashboard** - Home do engenheiro com KPIs e feed de NCs

## Phase Details

### Phase 1: Foundation
**Goal**: Infraestrutura de forms e state management configurada e pronta para uso em todas as features
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02
**Success Criteria** (what must be TRUE):
  1. Zustand store existe e pode ser usado para gerenciar estado global da aplicacao
  2. Forms criados com React Hook Form validam dados automaticamente via schemas Zod
  3. Pattern de uso documentado em codigo exemplo funcional
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — Zustand setup e primeiro store (app-store com UI state)
- [x] 01-02-PLAN.md — React Hook Form + Zod setup e form exemplo (ObraForm)

### Phase 2: Obras
**Goal**: Usuario pode gerenciar o ciclo completo de obras (criar, visualizar, editar, arquivar)
**Depends on**: Phase 1
**Requirements**: OBRA-01, OBRA-02, OBRA-03, OBRA-04, OBRA-05
**Success Criteria** (what must be TRUE):
  1. Usuario ve lista de todas as obras do cliente na pagina /app/obras
  2. Usuario cria nova obra preenchendo formulario e obra aparece na lista
  3. Usuario edita dados de obra existente e alteracoes persistem
  4. Usuario arquiva obra e ela desaparece da lista principal
  5. Usuario clica em obra e ve pagina de detalhes com todas informacoes
**Plans**: 4 plans

Plans:
- [x] 02-01-PLAN.md — Setup: shadcn components, obra schema, data access layer
- [x] 02-02-PLAN.md — List page with table and create obra modal
- [x] 02-03-PLAN.md — Edit and archive obra functionality
- [x] 02-04-PLAN.md — Obra detail page

### Phase 3: Agrupamentos
**Goal**: Usuario pode gerenciar agrupamentos dentro de uma obra (blocos, torres, etc.)
**Depends on**: Phase 2
**Requirements**: AGRU-01, AGRU-02, AGRU-03, AGRU-04, AGRU-05
**Success Criteria** (what must be TRUE):
  1. Usuario ve lista de agrupamentos na pagina /app/obras/[id]/agrupamentos
  2. Usuario cria novo agrupamento e ele aparece na lista da obra
  3. Usuario edita nome/ordem de agrupamento existente
  4. Usuario exclui agrupamento (com confirmacao e aviso sobre unidades)
  5. Usuario cria multiplos agrupamentos de uma vez (ex: "Bloco 1-10")
  6. Usuario pode reordenar agrupamentos via drag-and-drop
**Plans**: 4 plans

Plans:
- [x] 03-01-PLAN.md — Setup: data access layer, Zod schema, @dnd-kit installation
- [x] 03-02-PLAN.md — List page with table and create/edit modal with batch support
- [x] 03-03-PLAN.md — Delete confirmation and drag-and-drop reorder
- [x] 03-04-PLAN.md — Fix RLS policies for engenheiro access (gap closure)

### Phase 4: Unidades
**Goal**: Usuario pode gerenciar unidades dentro de agrupamentos (apartamentos, casas, etc.)
**Depends on**: Phase 3
**Requirements**: UNID-01, UNID-02, UNID-03, UNID-04, UNID-05
**Success Criteria** (what must be TRUE):
  1. Usuario ve lista de unidades ao expandir/clicar em agrupamento
  2. Usuario cria nova unidade e ela aparece na lista do agrupamento
  3. Usuario edita nome/codigo/ordem de unidade existente
  4. Usuario exclui unidade sem verificacoes
  5. Usuario cria multiplas unidades de uma vez (ex: "Apto 101-110")
**Plans**: 4 plans

Plans:
- [x] 04-01-PLAN.md — Data access layer and validation schemas with numeric range batch
- [x] 04-02-PLAN.md — Split-view UI with unidades panel and CRUD modals
- [x] 04-03-PLAN.md — Fix RLS policies for engenheiro access (gap closure)
- [x] 04-04-PLAN.md — Fix PT-BR accents and dialog accessibility (gap closure)

### Phase 4.1: Navegacao Contextual (INSERTED)
**Goal**: Implementar sistema de navegacao contextual com sidebar global (visao geral) e sidebar de obra (contexto especifico), atualizando documentacao e integrando com features existentes
**Depends on**: Phase 4
**Requirements**: Derivado de 04_NAVIGATION.md (arquitetura de navegacao)
**Success Criteria** (what must be TRUE):
  1. Sidebar global exibe: Home, Obras, Biblioteca FVS (com navegacao funcional)
  2. Sidebar de obra exibe: Dashboard, Agrupamentos/Unidades, Servicos habilitados
  3. Alternancia de contexto funciona (clicar em obra muda para sidebar de obra)
  4. Botao "Voltar para Visao Global" na sidebar de obra
  5. Documentacao 04_NAVIGATION.md atualizada com diretrizes MVP
  6. Features existentes (obras, agrupamentos, unidades) acessiveis via sidebar
**Plans**: 4 plans

Plans:
- [x] 04.1-01-PLAN.md — Create navigation components (SidebarItem, SidebarGlobal, SidebarObra, Breadcrumb)
- [x] 04.1-02-PLAN.md — Rename route /agrupamentos to /unidades with redirect
- [x] 04.1-03-PLAN.md — Update layout for context-aware sidebar switching
- [x] 04.1-04-PLAN.md — Transform obra page to dashboard, create configuracoes page, update docs

### Phase 5: Biblioteca FVS
**Goal**: Usuario pode gerenciar biblioteca de servicos e ativar servicos por obra
**Depends on**: Phase 2 (precisa de obras para ativar servicos)
**Requirements**: SERV-01, SERV-02, SERV-03, SERV-04, SERV-05, SERV-06, SERV-07, SERV-08
**Success Criteria** (what must be TRUE):
  1. Usuario ve lista de todos os servicos do cliente na pagina /app/biblioteca
  2. Usuario cria novo servico com codigo, nome e categoria
  3. Usuario edita servico existente e alteracoes persistem
  4. Usuario arquiva servico e ele desaparece da lista ativa
  5. Usuario adiciona itens de verificacao a um servico (observacao, metodo, tolerancia)
  6. Usuario edita e exclui itens de verificacao
  7. Usuario ativa servicos especificos para uma obra na pagina de detalhes da obra
  8. Usuario desativa servicos de uma obra
**Plans**: 4 plans

Plans:
- [x] 05-01-PLAN.md — Setup: data access layer, validation schemas, navigation update
- [x] 05-02-PLAN.md — Biblioteca page with servicos table and CRUD modals
- [x] 05-03-PLAN.md — Servico detail page with itens de verificacao CRUD
- [x] 05-04-PLAN.md — Obra servicos activation page

### Phase 5.1: Revisoes de Servicos (INSERTED)
**Goal**: Implementar sistema de controle de revisoes para servicos FVS, permitindo rastrear mudancas e gerenciar atualizacoes por obra
**Depends on**: Phase 5
**Requirements**: REV-01, REV-02, REV-03, REV-04, REV-05
**Success Criteria** (what must be TRUE):
  1. Servico mostra revisao atual na lista e detalhe (ex: "Rev. 02")
  2. Ao editar servico, modal exige descricao da mudanca e incrementa revisao
  3. Historico de revisoes acessivel na pagina de detalhe do servico
  4. Obra mostra qual revisao esta usando de cada servico
  5. Indicador visual quando ha revisao mais nova disponivel
  6. Botao "Atualizar revisao" na pagina de servicos da obra
**Plans**: 4 plans

Plans:
- [x] 05.1-01-PLAN.md — Schema changes + data access layer for revisions
- [x] 05.1-02-PLAN.md — Service edit with revision increment and description
- [x] 05.1-03-PLAN.md — Revision history on service detail page
- [x] 05.1-04-PLAN.md — Obra revision tracking and update indicator

### Phase 5.2: Tags e Revisao Condicional (INSERTED)
**Goal**: Implementar tags para organizar itens de verificacao e tornar revisao condicional (apenas quando servico ja foi ativado)
**Depends on**: Phase 5.1
**Requirements**: REQ-01 a REQ-07 (ver REQUIREMENTS.md)
**Success Criteria** (what must be TRUE):
  1. Engenheiro edita servico nao-ativado sem gerar revisao
  2. Engenheiro edita servico ja-ativado e revisao e incrementada
  3. Engenheiro cria/edita tags na pagina /app/tags
  4. Engenheiro associa tag a item de verificacao no modal
  5. Tabela de itens mostra agrupamento por tags com borda colorida
  6. Engenheiro arrasta item de uma tag para outra
  7. Engenheiro reordena sequencia de tags via modal
**Plans**: 5 plans

Plans:
- [x] 05.2-01-PLAN.md — Schema (tags table ordem, primeira_ativacao_em, tag_id em itens) + data access
- [x] 05.2-02-PLAN.md — Pagina de Tags com CRUD e reordenacao
- [x] 05.2-03-PLAN.md — Revisao condicional (logica + UI adaptativa)
- [x] 05.2-04-PLAN.md — Tags em itens (modal + tabela agrupada)
- [x] 05.2-05-PLAN.md — Drag-and-drop de itens entre tags

### Phase 6: Dashboard
**Goal**: Engenheiro tem visao consolidada da qualidade com KPIs e feed de nao-conformidades
**Depends on**: Phase 5.1 (precisa de todas entidades para calcular metricas)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06
**Success Criteria** (what must be TRUE):
  1. Usuario ve card com Taxa de Conformidade Geral (percentual)
  2. Usuario ve card com IRS - Indice de Retrabalho (percentual)
  3. Usuario ve card com contagem de Verificacoes Pendentes
  4. Usuario ve card com contagem de Verificacoes Concluidas
  5. Usuario ve feed com ultimas NCs abertas (titulo, obra, data)
  6. Usuario ve grafico de linha mostrando evolucao temporal das metricas
**Plans**: 3 plans

Plans:
- [x] 06-01-PLAN.md — Data access layer + KPI cards with trend indicators
- [x] 06-02-PLAN.md — NC feed with relative dates (date-fns)
- [x] 06-03-PLAN.md — Temporal chart (Recharts LineChart)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 > 2 > 3 > 4 > 4.1 > 5 > 5.1 > 5.2 > 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 2/2 | Complete | 2026-01-19 |
| 2. Obras | 4/4 | Complete | 2026-01-19 |
| 3. Agrupamentos | 4/4 | Complete | 2026-01-20 |
| 4. Unidades | 4/4 | Complete | 2026-01-20 |
| 4.1. Navegacao Contextual | 4/4 | Complete | 2026-01-21 |
| 5. Biblioteca FVS | 4/4 | Complete | 2026-01-21 |
| 5.1. Revisoes de Servicos | 4/4 | Complete | 2026-01-22 |
| 5.2. Tags e Revisao Condicional | 5/5 | Complete | 2026-01-23 |
| 6. Dashboard | 3/3 | Complete | 2026-01-24 |

---
*Roadmap created: 2026-01-19*
*Phase 1 planned: 2026-01-19*
*Phase 2 planned: 2026-01-19*
*Phase 3 planned: 2026-01-20*
*Phase 4 planned: 2026-01-20*
*Phase 4 gap closure: 2026-01-20*
*Phase 4.1 inserted: 2026-01-21 (navegacao contextual)*
*Phase 4.1 planned: 2026-01-21*
*Phase 4.1 complete: 2026-01-21*
*Phase 5 planned: 2026-01-21*
*Phase 5.1 inserted: 2026-01-22 (revisoes de servicos)*
*Phase 5.1 complete: 2026-01-22*
*Phase 5.2 inserted: 2026-01-23 (tags e revisao condicional)*
*Phase 5.2 planned: 2026-01-23*
*Phase 5.2 complete: 2026-01-23*
*Phase 6 planned: 2026-01-24*
*Depth: standard (6 phases + 3 insertions)*
*Coverage: 31/31 v1 requirements mapped + 5 REV + 7 TAG requirements + 6 DASH requirements*
