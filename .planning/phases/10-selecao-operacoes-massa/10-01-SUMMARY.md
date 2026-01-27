---
phase: 10-selecao-operacoes-massa
plan: 01
subsystem: ui
tags: [react, selection-mode, css-grid, event-delegation, useState, useCallback]

# Dependency graph
requires:
  - phase: 09-matriz-verificacoes
    provides: "CSS Grid da matriz com event delegation e heatmap de 6 estados"
provides:
  - "Modo de seleção explícito com toggle via botão na toolbar"
  - "Toggle individual de células com feedback visual (ring brand)"
  - "Seleção de linha inteira via click no nome do serviço"
  - "Seleção de coluna inteira via click no header da unidade"
  - "Esc key listener para sair do modo de seleção"
  - "Dual-mode handleClick: navegação (normal) ou seleção (modo seleção)"
affects: [10-02 toolbar-flutuante-modal-bulk, 10-03 operacoes-massa]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dual-mode event delegation: isSelectionMode branching no handleClick"
    - "data-header-servico / data-header-unidade para seleção via headers"
    - "Set<string> com updater form para estado de seleção sem stale closures"
    - "ring-2 ring-brand ring-offset-1 para feedback visual de seleção"

key-files:
  created: []
  modified:
    - "arden/app/app/obras/[id]/verificacoes/_components/matriz-client.tsx"
    - "arden/app/app/obras/[id]/verificacoes/_components/matriz-grid.tsx"
    - "arden/app/app/obras/[id]/verificacoes/_components/matriz-header.tsx"

key-decisions:
  - "Modo de seleção explícito via botão (não automático) -- preserva navegação normal"
  - "Set<string> com chave servicoId:unidadeId para O(1) lookup por célula"
  - "data attributes condicionais (isSelectionMode ? id : undefined) -- headers só selecionáveis no modo ativo"
  - "Agrupamento headers mantêm expand/collapse em todos os modos (Pitfall 4)"
  - "cursor-cell no modo de seleção, cursor-pointer no modo normal"

patterns-established:
  - "Dual-mode event delegation: check isSelectionMode first, then branch"
  - "Selection state via Set<string> com updater form em useCallback"
  - "Conditional data attributes para headers selecionáveis"

# Metrics
duration: 3.8min
completed: 2026-01-27
---

# Phase 10 Plan 01: Infraestrutura de Seleção na Matriz Summary

**Modo de seleção explícito com toggle individual, seleção por headers (linha/coluna), e feedback visual via ring brand nas células selecionadas**

## Performance

- **Duration:** 3.8 min
- **Started:** 2026-01-27T19:11:55Z
- **Completed:** 2026-01-27T19:15:44Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- Botão "Selecionar" na toolbar alterna modo de seleção (variant default quando ativo, outline quando inativo)
- Dual-mode handleClick: navegação para verificação individual (modo normal) ou toggle de seleção (modo seleção)
- Seleção de linha inteira (click no nome do serviço) e coluna inteira (click no header da unidade)
- Feedback visual: ring-2 ring-brand ring-offset-1 nas células selecionadas
- Esc key listener sai do modo e limpa seleção

## Task Commits

Each task was committed atomically:

1. **Task 1: Estado de seleção no orchestrador + botão Selecionar** - `a489e03` (feat)
2. **Task 2: Dual-mode click handler + feedback visual + seleção por headers** - `d37bdb9` (feat)

## Files Created/Modified

- `arden/app/app/obras/[id]/verificacoes/_components/matriz-client.tsx` - Estados isSelectionMode/selectedCells, handlers toggle/row/column/exit, Esc listener, botão Selecionar, props para MatrizGrid
- `arden/app/app/obras/[id]/verificacoes/_components/matriz-grid.tsx` - Interface expandida com selection props, dual-mode handleClick, data-header-servico, feedback visual ring nas células, cursor-cell condicional
- `arden/app/app/obras/[id]/verificacoes/_components/matriz-header.tsx` - UnitHeaderCell com data-header-unidade e cursor-cell condicionais, import cn()

## Decisions Made

- **Modo de seleção explícito via botão** -- preserva o fluxo de navegação individual existente, conforme decisão do CONTEXT
- **Set<string> com chave "servicoId:unidadeId"** -- O(1) lookup por célula, consistente com verificacoesMap
- **data attributes condicionais** -- data-header-servico e data-header-unidade só existem quando isSelectionMode=true, evitando seleção acidental no modo normal
- **Agrupamento headers inalterados** -- mantêm expand/collapse em todos os modos (Pitfall 4 do RESEARCH)
- **cursor-cell** -- diferencia visualmente o modo de seleção do modo de navegação (cursor-pointer)
- **ring-2 ring-brand** -- feedback visual claro sem obscurecer a cor do heatmap, usando ring-offset para separação

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- **Turbopack build panic** -- `npm run build` falha com erro interno do Turbopack (bug do Next.js 16.1.1 no Windows, não relacionado ao código). Verificação feita via `npx tsc --noEmit` que compilou sem erros. Este é um problema pré-existente do ambiente.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Infraestrutura de seleção completa e funcional
- Plan 10-02 pode implementar a toolbar flutuante (bottom bar) e o modal de verificação em massa
- selectedCells Set está pronto para ser consumido pela toolbar (contagem) e pelo modal (pares para bulkVerificar)
- O backend (bulk_verificar RPC + bulkVerificar Server Action) já existe da Fase 7

---
*Phase: 10-selecao-operacoes-massa*
*Completed: 2026-01-27*
