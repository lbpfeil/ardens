---
phase: 09-matriz-verificacoes
plan: 02
subsystem: verificacoes-ui
tags: [css-grid, sticky-headers, heatmap, tooltip, react, next.js, matrix]

dependency-graph:
  requires:
    - phase: 09-01
      provides: [tem_reinspecao-column, matriz-status-utility, tooltip-component, extended-query]
    - phase: 07-fundacao-dados
      provides: [getMatrizData-query, MatrizData-types, Server-Actions]
  provides:
    - Pagina de verificacoes com matriz servico x unidade
    - CSS Grid com sticky headers multinivel e agrupamentos colapsiveis
    - Celulas heatmap com 6 cores e tooltips
    - Progresso por servico com fracao e mini barra
    - Navegacao por clique para verificacao individual ou nova
  affects: [10-relatorios, 11-exportacao]

tech-stack:
  added: []
  patterns: [css-grid-sticky-matrix, event-delegation-data-attributes, collapse-state-useState-Set, functional-column-position-calc]

key-files:
  created:
    - arden/app/app/obras/[id]/verificacoes/page.tsx
    - arden/app/app/obras/[id]/verificacoes/_components/matriz-client.tsx
    - arden/app/app/obras/[id]/verificacoes/_components/matriz-grid.tsx
    - arden/app/app/obras/[id]/verificacoes/_components/matriz-header.tsx
  modified: []

key-decisions:
  - "max-w-full em vez de max-w-6xl para a pagina da matriz — precisa de largura total"
  - "useState<Set<string>> para colapso de agrupamentos — estado transiente local de UI"
  - "Event delegation com data-cell/data-servico-id/data-unidade-id — performance com muitas celulas"
  - "useMemo + reduce funcional para posicoes de coluna — evita mutacao durante render (React Compiler)"
  - "UnitHeaderCell e CollapsedHeaderPlaceholder como componentes separados — decomposicao modular"

patterns-established:
  - "CSS Grid matrix: gridTemplateColumns com primeira coluna fixa + repeat para dados"
  - "z-index 3 niveis: z-30 corner, z-20 headers, z-10 service column"
  - "Event delegation: onClick no container pai com closest('[data-cell]')"
  - "Collapse via Set<string>: primeiro grupo expandido, toggle via new Set(prev)"

duration: 6.3 min
completed: 2026-01-27
---

# Phase 09 Plan 02: Pagina da Matriz de Verificacoes - Summary

**CSS Grid interativo com sticky headers multinivel, agrupamentos colapsiveis, celulas heatmap de 6 cores com tooltips, progresso por servico, e navegacao por clique para verificacao individual.**

## Performance

- **Duration:** 6.3 min
- **Started:** 2026-01-27T14:52:47Z
- **Completed:** 2026-01-27T14:59:02Z
- **Tasks:** 2/2
- **Files created:** 4

## Accomplishments

- Pagina completa da Matriz de Verificacoes em /app/obras/[id]/verificacoes
- CSS Grid com sticky headers multinivel (agrupamento + unidades) e coluna de servico fixa
- Celulas heatmap com 6 cores derivadas do status da verificacao + tooltips
- Agrupamentos colapsiveis com chevron animado (primeiro expandido por padrao)
- Progresso por servico com fracao numerica e mini barra de progresso
- Navegacao por clique: verificacao existente -> pagina individual, pendente -> /nova
- Legenda de cores com 6 status visivel acima do grid

## Task Commits

Each task was committed atomically:

1. **Task 1: Server Component page.tsx + Client Orchestrator com legenda e estado de colapso** - `08afc05` (feat)
2. **Task 2: CSS Grid com sticky headers, celulas heatmap, tooltips, progresso e navegacao** - `e2e8d55` (feat)

## Files Created

- `arden/app/app/obras/[id]/verificacoes/page.tsx` - Server Component que busca dados via getMatrizData e renderiza MatrizClient
- `arden/app/app/obras/[id]/verificacoes/_components/matriz-client.tsx` - Client orchestrator com estado de colapso, unidades visiveis, legenda de cores, empty state
- `arden/app/app/obras/[id]/verificacoes/_components/matriz-grid.tsx` - CSS Grid container com sticky headers, z-index 3 niveis, celulas heatmap, tooltips, progresso, event delegation
- `arden/app/app/obras/[id]/verificacoes/_components/matriz-header.tsx` - AgrupamentoHeaders com expand/collapse, UnitHeaderCell, CollapsedHeaderPlaceholder

## Decisions Made

### 1. max-w-full para pagina da matriz
A pagina da matriz usa `max-w-full` em vez do padrao `max-w-6xl` porque a matriz precisa de toda a largura disponivel para acomodar obras com muitas unidades.

### 2. Event delegation com data attributes
Em vez de um onClick por celula (potencialmente centenas/milhares), um unico onClick no container do grid usa `closest('[data-cell]')` para encontrar a celula clicada e extrair servicoId/unidadeId dos data attributes.

### 3. Reduce funcional para posicoes de coluna
O calculo de posicoes de coluna dos agrupamentos usa `reduce` em vez de `let` + mutacao para satisfazer o React Compiler (linting do Next.js detecta mutacao durante render).

### 4. Decomposicao UnitHeaderCell + CollapsedHeaderPlaceholder
Em vez de um unico componente UnitHeaders, a logica de row 2 foi decomposta em componentes granulares chamados pelo MatrizGrid para intercalar headers de unidades com placeholders de grupos collapsed.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Mutacao durante render detectada pelo React Compiler**

- **Found during:** Task 2 (AgrupamentoHeaders)
- **Issue:** `let currentCol = 2` com mutacao `currentCol += span` dentro do `.map()` no JSX foi detectado como erro pelo React Compiler do Next.js ("Cannot reassign variable after render completes")
- **Fix:** Refatorado para `useMemo` + `reduce` funcional que calcula posicoes sem mutacao
- **Files modified:** arden/app/app/obras/[id]/verificacoes/_components/matriz-header.tsx
- **Verification:** `npm run lint` passa sem erros nos novos arquivos
- **Committed in:** e2e8d55 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Fix necessario para compatibilidade com React Compiler. Sem mudanca de escopo.

## Issues Encountered

- Turbopack panic durante `npm run build` (erro interno do Next.js 16.1.1 no Windows) — nao relacionado ao codigo; verificacao feita via `npx tsc --noEmit` e `npm run lint`

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

A fase 09 (Matriz de Verificacoes) esta completa. Todos os 5 requisitos MATRZ-01 a MATRZ-05 implementados:

- **MATRZ-01:** Matriz servico x unidade com CSS Grid
- **MATRZ-02:** Celulas com status visual (6 cores heatmap)
- **MATRZ-03:** Scroll com sticky headers e coluna fixa
- **MATRZ-04:** Headers multinivel com agrupamentos colapsiveis
- **MATRZ-05:** Progresso por servico (fracao + mini barra)

**Blocker persistente:** Migration SQL de `tem_reinspecao` precisa ser aplicada via MCP para funcionamento em runtime (documentado em 09-01-SUMMARY).

---
*Phase: 09-matriz-verificacoes*
*Completed: 2026-01-27*
