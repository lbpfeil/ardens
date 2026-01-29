# Roadmap: Arden FVS v1.2 -- Feed de Verificações e Novo Modelo de Status

## Milestones

- v1.0 MVP -- Phases 1-6 (shipped 2026-01-24)
- v1.1 Verificações no Portal Web -- Phases 7-11 (shipped 2026-01-27)
- **v1.2 Feed de Verificações e Novo Modelo de Status** -- Phases 12-15 (in progress)

## Overview

Este milestone refatora o fluxo de verificação: a matriz se torna ferramenta de seleção (sem navegação para verificação individual), uma nova página de feed com mini-matrizes por serviço (itens x unidades) permite aplicar status em massa com toolbar inteligente, o modelo de status migra para 3 estados calculados no nível da verificação com status granulares exclusivos do item, e a página de verificação individual vira consulta/detalhe com histórico de transições. A construção segue ordem de dependência: novo modelo de dados, refatoração da matriz, feed com toolbar, e página de consulta.

## Phases

- [x] **Phase 12: Modelo de Status** -- Migration de banco e lógica de cálculo para o novo modelo de 4 estados
- [ ] **Phase 13: Refatoração da Matriz** -- Matriz como ferramenta de seleção com heatmap de 3 estados
- [ ] **Phase 14: Feed de Verificações e Toolbar** -- Nova página de feed com mini-matrizes e toolbar inteligente
- [ ] **Phase 15: Consulta de Verificação** -- Página de detalhe read-only com histórico de transições

## Phase Details

### Phase 12: Modelo de Status

**Goal:** O banco de dados reflete o novo modelo onde o status da verificação é calculado automaticamente a partir dos itens, e as transições de status no nível de item seguem o fluxograma definido.
**Depends on:** Nenhuma (usa schema existente, altera-o)
**Requirements:** STAT-01, STAT-02, STAT-03, STAT-04
**Success Criteria** (what must be TRUE):
  1. Verificações no banco possuem status calculado automaticamente: Pendente, Verificado com Pendências, ou Verificação Finalizada
  2. Itens de verificação possuem os status granulares (Conforme, NC, Exceção, Retrabalho, etc.) e a verificação-pai calcula seu status a partir deles
  3. As transições de status de item obedecem ao fluxograma: Pendente pode ir para C/NC/Exceção; NC pode ter 4 outcomes; NC após Retrabalho pode ter 2 outcomes
  4. Dashboard e matriz existentes continuam funcionando com o novo modelo (sem regressão)
**Plans:** 2 plans

Plans:
- [x] 12-01-PLAN.md — Migration de ENUM, trigger, bulk_verificar e recálculo de dados
- [x] 12-02-PLAN.md — Atualização de tipos e lógica TypeScript para novos ENUMs

---

### Phase 13: Refatoração da Matriz

**Goal:** A matriz funciona exclusivamente como ferramenta de visualização macro e seleção em massa, com heatmap refletindo os 3 novos estados, e o botão "Verificar" navega para o feed.
**Depends on:** Phase 12 (novo modelo de status para heatmap de 3 estados)
**Requirements:** MAT-01, MAT-02, MAT-03, MAT-04, MAT-05
**Success Criteria** (what must be TRUE):
  1. Clicar em uma célula da matriz ativa o modo de seleção (hachura) em vez de navegar para verificação individual
  2. O heatmap da matriz exibe 3 cores correspondentes a Pendente, Com Pendências e Finalizada
  3. O botão "Verificar" na toolbar navega para a página de feed com as células selecionadas
  4. O botão Exceção na toolbar tem cor amarela diferenciada dos demais botões
  5. Ao retornar do feed, a matriz exibe dados atualizados e a seleção anterior está limpa
**Plans:** TBD

Plans:
- [ ] 13-01: [TBD]
- [ ] 13-02: [TBD]

---

### Phase 14: Feed de Verificações e Toolbar

**Goal:** O engenheiro trabalha no feed de verificações aplicando status em massa nos itens de verificação, com mini-matrizes por serviço, seleção multi-nível e toolbar inteligente que mostra apenas ações compatíveis.
**Depends on:** Phase 12 (modelo de status), Phase 13 (navegação da matriz para o feed)
**Requirements:** FEED-01, FEED-02, FEED-03, FEED-04, FEED-05, FEED-06, FEED-07, FEED-08, FEED-09, TOOL-01, TOOL-02, TOOL-03, TOOL-04
**Success Criteria** (what must be TRUE):
  1. A página de feed exibe serviços empilhados verticalmente, cada um como mini-matriz com linhas de itens (mostrando método e tolerância) e colunas de unidades
  2. O scroll horizontal funciona com headers sticky no mesmo padrão da matriz principal
  3. O engenheiro pode selecionar itens por célula individual, por header de serviço, por header de unidade ou por header de item
  4. Itens com status finalizado aparecem com opacidade reduzida e não podem ser selecionados
  5. A toolbar exibe o contador de itens selecionados e mostra apenas ações compatíveis com todos os itens na seleção (intersecção de status); se a intersecção é vazia, exibe aviso de incompatibilidade
  6. Ao confirmar uma ação, um modal de confirmação com resumo aparece antes da aplicação efetiva do status
**Plans:** TBD

Plans:
- [ ] 14-01: [TBD]
- [ ] 14-02: [TBD]
- [ ] 14-03: [TBD]

---

### Phase 15: Consulta de Verificação

**Goal:** A página de verificação individual funciona como consulta read-only com histórico completo de transições de status, acessível a partir do feed e do dashboard.
**Depends on:** Phase 14 (feed de verificações para navegação)
**Requirements:** DET-01, DET-02, DET-03, DET-04
**Success Criteria** (what must be TRUE):
  1. A página de verificação individual exibe os itens e seus status sem permitir ações de alteração (read-only)
  2. Cada item exibe histórico de transições de status (quem alterou, quando, de qual status para qual)
  3. O engenheiro acessa a página de consulta a partir do feed de verificações clicando em um item específico
  4. O engenheiro acessa a página de consulta a partir do feed de NCs no dashboard
**Plans:** TBD

Plans:
- [ ] 15-01: [TBD]
- [ ] 15-02: [TBD]

---

## Progress

**Execution Order:** 12 → 13 → 14 → 15

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 12. Modelo de Status | v1.2 | 2/2 | ✓ Verified | 2026-01-28 |
| 13. Refatoração da Matriz | v1.2 | 0/TBD | Not started | - |
| 14. Feed e Toolbar | v1.2 | 0/TBD | Not started | - |
| 15. Consulta de Verificação | v1.2 | 0/TBD | Not started | - |

---
*Roadmap created: 2026-01-28*
*Last updated: 2026-01-28 (Phase 12 complete)*
