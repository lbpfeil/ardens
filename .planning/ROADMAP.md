# Roadmap: v1.1 Verificacoes no Portal Web

## Visao Geral

Este milestone transforma o portal web de ferramenta de cadastro em ferramenta de execucao de qualidade. O nucleo e uma matriz interativa Servicos x Unidades onde engenheiros visualizam o estado de verificacoes da obra inteira e executam verificacoes individuais ou em lote. A construcao segue ordem de dependencia: fundacao de dados, verificacao individual (valida fluxo end-to-end), matriz visual, selecao/bulk, e integracao com o app existente.

**Milestone:** v1.1
**Fases:** 5 (Fases 7-11)
**Profundidade:** Standard
**Requisitos:** 28 v1.1 mapeados

---

## Fase 7: Fundacao de Dados e Server Actions

**Objetivo:** Todas as operacoes de leitura e escrita de verificacoes estao disponiveis como Server Actions e queries reutilizaveis, prontas para qualquer UI consumir.

**Dependencias:** Nenhuma (usa schema existente)

**Requisitos:** DADOS-01, DADOS-02, DADOS-03, DADOS-04

**Plans:** 3 plans

Plans:
- [ ] 07-01-PLAN.md -- Server Actions para CRUD de verificacoes e itens (DADOS-01, DADOS-02)
- [ ] 07-02-PLAN.md -- RPC PostgreSQL bulk_verificar + Server Action wrapper (DADOS-03)
- [ ] 07-03-PLAN.md -- Query otimizada da matriz + otimizacao RLS (DADOS-04)

**Criterios de Sucesso:**

1. Server Action cria uma verificacao para um par servico/unidade, atualiza seu resultado (Conforme/NC/Excecao), e altera seu status -- e os dados persistem no banco corretamente
2. Server Action marca itens individuais de verificacao como C/NC/NA e o trigger de contadores do banco atualiza os totais na verificacao automaticamente
3. RPC PostgreSQL `bulk_verificar` recebe uma lista de pares servico/unidade e cria todas as verificacoes + itens em transacao atomica, sem registros parciais em caso de erro
4. Query da matriz retorna servicos ativos, unidades agrupadas por agrupamento, e verificacoes existentes em formato otimizado para lookup O(1) por chave `servico_id:unidade_id`

**Armadilhas a evitar:** RLS lenta em operacoes bulk (aplicar initPlan pattern nas policies)

---

## Fase 8: Verificacao Individual

**Objetivo:** O engenheiro consegue abrir uma verificacao de 1 servico em 1 unidade, avaliar cada item individualmente, e o sistema determina o resultado final automaticamente.

**Dependencias:** Fase 7 (Server Actions e queries)

**Requisitos:** VERIF-01, VERIF-02, VERIF-03, VERIF-04, VERIF-05, VERIF-06

**Criterios de Sucesso:**

1. O engenheiro acessa a pagina de verificacao individual (`/app/obras/[id]/verificacoes/[verificacaoId]`) e ve a lista completa de itens de verificacao do servico, cada um com toggle C/NC/NA
2. Ao marcar qualquer item como NC, o resultado da verificacao automaticamente muda para NC; quando todos sao C ou NA, o resultado e Conforme
3. O engenheiro pode escrever uma descricao geral na verificacao e marcar o servico como Excecao (nao se aplica a esta unidade)
4. Uma verificacao com status NC pode ser reinspecionada, resultando em "Conforme apos Reinspecao" ou "NC apos Reinspecao" dependendo do novo resultado dos itens

**Armadilhas a evitar:** Sem state machine de status (usar enum); Canvas crash em Safari ao processar fotos (diferido para v1.2)

---

## Fase 9: Matriz de Verificacoes

**Objetivo:** O engenheiro visualiza o estado de todas as verificacoes da obra em uma unica tela, com colunas de unidades agrupadas por agrupamento e indicadores visuais de status.

**Dependencias:** Fase 7 (queries da matriz), Fase 8 (verificacao individual para navegacao)

**Requisitos:** MATRZ-01, MATRZ-02, MATRZ-03, MATRZ-04, MATRZ-05

**Criterios de Sucesso:**

1. A pagina de verificacoes da obra exibe uma grade com servicos nas linhas e unidades nas colunas, onde cada celula mostra o status visual da verificacao (cor + icone) para aquele par
2. O scroll horizontal mantem a coluna de servicos fixa a esquerda e o header de unidades fixo no topo, permitindo navegar obras com muitas unidades sem perder contexto
3. As colunas de unidades sao agrupadas sob headers do agrupamento correspondente (Torre A, Torre B, etc.) com headers multinivel
4. Cada linha de servico exibe um indicador de progresso (ex: "12/50 verificadas") mostrando quantas unidades ja foram verificadas para aquele servico

**Armadilhas a evitar:** Performance com 5000+ celulas (filtrar por agrupamento como default); re-renders em cascata (React.memo + event delegation); sticky headers quebrados (z-index em 3 niveis, border-collapse: separate)

**Pesquisa adicional recomendada:** Prototipar CSS Grid + sticky headers antes de planejar tickets detalhados

---

## Fase 10: Selecao e Operacoes em Massa

**Objetivo:** O engenheiro seleciona multiplas celulas na matriz e executa verificacoes em lote com um unico clique, com resolucao inteligente de conflitos.

**Dependencias:** Fase 9 (matriz renderizada), Fase 7 (RPC de bulk insert)

**Requisitos:** BULK-01, BULK-02, BULK-03, BULK-04, BULK-05, BULK-06, BULK-07, BULK-08, BULK-09

**Criterios de Sucesso:**

1. O engenheiro seleciona celulas na matriz via Click (individual), Shift+Click (range contiguos), e Ctrl+Click (celulas nao-adjacentes), com feedback visual claro nas celulas selecionadas
2. Clicar no header de um servico seleciona toda a linha; clicar no header de uma unidade seleciona toda a coluna
3. Uma toolbar flutuante aparece ao selecionar celulas, mostrando a contagem de selecionados e o botao "Verificar" para abrir o modal de verificacao em massa
4. O modal de verificacao em massa permite escolher resultado (Conforme/NC/Excecao) e descricao, e ao confirmar, todas as celulas selecionadas sao verificadas com marcacao automatica de todos os itens conforme o resultado
5. Conflitos sao resolvidos automaticamente: celulas ja Conformes sao ignoradas, celulas NC existentes passam para "apos Reinspecao" em vez de sobrescrever

**Armadilhas a evitar:** Drag vs click (keyboard-first approach); limite de payload em bulk (batch em grupos); race conditions (ON CONFLICT); perda de selecao apos operacao (indexar por IDs)

**Pesquisa adicional recomendada:** Edge cases de selecao de celulas (accessibility, drag threshold, focus vs selection)

---

## Fase 11: Navegacao e Integracao

**Objetivo:** As verificacoes estao completamente integradas ao app existente, com navegacao fluida entre matriz e verificacao individual, e o dashboard reflete dados reais.

**Dependencias:** Fases 8, 9, 10 (todas as features de verificacao)

**Requisitos:** INTEG-01, INTEG-02, INTEG-03, INTEG-04

**Criterios de Sucesso:**

1. O item "Verificacoes" aparece na sidebar da obra e leva diretamente a pagina da matriz de verificacoes
2. O dashboard do engenheiro exibe KPIs (total de verificacoes, taxa de conformidade, NCs pendentes) alimentados por dados reais de verificacoes, substituindo dados mock
3. O feed de atividades no dashboard mostra verificacoes realizadas recentemente com dados reais
4. Clicar em uma celula da matriz navega para a pagina de verificacao individual daquele par servico/unidade, e a pagina individual oferece botao "Voltar a matriz" para retornar

---

## Progresso

| Fase | Nome | Requisitos | Status |
|------|------|------------|--------|
| 7 | Fundacao de Dados | DADOS-01, DADOS-02, DADOS-03, DADOS-04 | Planejado |
| 8 | Verificacao Individual | VERIF-01, VERIF-02, VERIF-03, VERIF-04, VERIF-05, VERIF-06 | Pendente |
| 9 | Matriz de Verificacoes | MATRZ-01, MATRZ-02, MATRZ-03, MATRZ-04, MATRZ-05 | Pendente |
| 10 | Selecao e Operacoes em Massa | BULK-01 a BULK-09 | Pendente |
| 11 | Navegacao e Integracao | INTEG-01, INTEG-02, INTEG-03, INTEG-04 | Pendente |

**Cobertura:** 28/28 requisitos v1.1 mapeados

---
*Roadmap criado: 2026-01-26*
*Milestone: v1.1 Verificacoes no Portal Web*
