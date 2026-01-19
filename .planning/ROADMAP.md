# Roadmap: Arden FVS Mes 1 MVP

## Overview

Este roadmap cobre o Mes 1 do MVP do Arden FVS, focando na gestao de entidades do dominio (Obras, Agrupamentos, Unidades, Servicos) e no dashboard do engenheiro. A estrutura segue a hierarquia natural do modelo de dominio: Foundation para infraestrutura de forms/state, depois as entidades em ordem de dependencia (Obras > Agrupamentos > Unidades), Biblioteca FVS para servicos, e finalmente o Dashboard que consolida dados de todas as entidades.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation** - Infraestrutura de state management e validacao de forms
- [ ] **Phase 2: Obras** - CRUD completo de obras com listagem, criacao, edicao e arquivamento
- [ ] **Phase 3: Agrupamentos** - Gestao de agrupamentos vinculados a obras
- [ ] **Phase 4: Unidades** - Gestao de unidades vinculadas a agrupamentos
- [ ] **Phase 5: Biblioteca FVS** - Gestao de servicos e itens de verificacao
- [ ] **Phase 6: Dashboard** - Home do engenheiro com KPIs e feed de NCs

## Phase Details

### Phase 1: Foundation
**Goal**: Infraestrutura de forms e state management configurada e pronta para uso em todas as features
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02
**Success Criteria** (what must be TRUE):
  1. Zustand store existe e pode ser usado para gerenciar estado global da aplicacao
  2. Forms criados com React Hook Form validam dados automaticamente via schemas Zod
  3. Pattern de uso documentado em codigo exemplo funcional
**Plans**: TBD

Plans:
- [ ] 01-01: Zustand setup e primeiro store (ex: UI state)
- [ ] 01-02: React Hook Form + Zod setup e form exemplo

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
**Plans**: TBD

Plans:
- [ ] 02-01: Listagem de obras (pagina, fetch, tabela)
- [ ] 02-02: Criar obra (form, validacao, submit)
- [ ] 02-03: Editar e arquivar obra (modal/pagina, acoes)
- [ ] 02-04: Detalhes da obra (pagina, layout)

### Phase 3: Agrupamentos
**Goal**: Usuario pode gerenciar agrupamentos dentro de uma obra (blocos, torres, etc.)
**Depends on**: Phase 2
**Requirements**: AGRU-01, AGRU-02, AGRU-03, AGRU-04, AGRU-05
**Success Criteria** (what must be TRUE):
  1. Usuario ve lista de agrupamentos na pagina de detalhes da obra
  2. Usuario cria novo agrupamento e ele aparece na lista da obra
  3. Usuario edita nome/ordem de agrupamento existente
  4. Usuario exclui agrupamento vazio (sem unidades)
  5. Usuario cria multiplos agrupamentos de uma vez (ex: "Bloco 1-10")
**Plans**: TBD

Plans:
- [ ] 03-01: Listagem de agrupamentos (componente na pagina de obra)
- [ ] 03-02: CRUD de agrupamento (criar, editar, excluir)
- [ ] 03-03: Criacao em lote de agrupamentos

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
**Plans**: TBD

Plans:
- [ ] 04-01: Listagem de unidades (componente em agrupamento)
- [ ] 04-02: CRUD de unidade (criar, editar, excluir)
- [ ] 04-03: Criacao em lote de unidades

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
**Plans**: TBD

Plans:
- [ ] 05-01: Listagem de servicos (pagina biblioteca)
- [ ] 05-02: CRUD de servico (criar, editar, arquivar)
- [ ] 05-03: Itens de verificacao (CRUD dentro de servico)
- [ ] 05-04: Ativacao de servicos por obra (pagina obra, selecao)

### Phase 6: Dashboard
**Goal**: Engenheiro tem visao consolidada da qualidade com KPIs e feed de nao-conformidades
**Depends on**: Phase 5 (precisa de todas entidades para calcular metricas)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06
**Success Criteria** (what must be TRUE):
  1. Usuario ve card com Taxa de Conformidade Geral (percentual)
  2. Usuario ve card com IRS - Indice de Retrabalho (percentual)
  3. Usuario ve card com contagem de Verificacoes Pendentes
  4. Usuario ve card com contagem de Verificacoes Concluidas
  5. Usuario ve feed com ultimas NCs abertas (titulo, obra, data)
  6. Usuario ve grafico de linha mostrando evolucao temporal das metricas
**Plans**: TBD

Plans:
- [ ] 06-01: Cards de KPIs (4 metricas principais)
- [ ] 06-02: Feed de NCs abertas (lista com detalhes)
- [ ] 06-03: Grafico de evolucao temporal (Recharts)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 > 2 > 3 > 4 > 5 > 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Obras | 0/4 | Not started | - |
| 3. Agrupamentos | 0/3 | Not started | - |
| 4. Unidades | 0/3 | Not started | - |
| 5. Biblioteca FVS | 0/4 | Not started | - |
| 6. Dashboard | 0/3 | Not started | - |

---
*Roadmap created: 2026-01-19*
*Depth: standard (6 phases)*
*Coverage: 31/31 v1 requirements mapped*
