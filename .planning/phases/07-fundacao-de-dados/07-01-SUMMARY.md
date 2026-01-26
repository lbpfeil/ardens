---
phase: 07-fundacao-de-dados
plan: 01
subsystem: data-layer
tags: [server-actions, zod, verificacoes, use-server, nextjs]
dependency-graph:
  requires: []
  provides:
    - "Server Actions para CRUD de verificações"
    - "Schemas Zod para validação de inputs"
    - "Tipo ActionResult<T> compartilhado"
    - "Padrão 'use server' estabelecido no projeto"
  affects:
    - "07-02 (bulk operations)"
    - "07-03 (query de matriz)"
    - "08 (UI de verificação individual)"
tech-stack:
  added: []
  patterns:
    - "'use server' directive para Server Actions"
    - "ActionResult<T> para retorno consistente"
    - "Imutabilidade de verificação Conforme"
    - "Delegação de contadores ao trigger PostgreSQL"
key-files:
  created:
    - arden/lib/validations/verificacao.ts
    - arden/lib/supabase/actions/verificacoes.ts
    - arden/lib/supabase/actions/itens-verificacao.ts
  modified: []
decisions:
  - id: "use-server-pattern"
    decision: "Server Actions em lib/supabase/actions/ com 'use server' no topo"
    rationale: "Separa mutations server-side de queries client-side existentes"
  - id: "action-result-type"
    decision: "Tipo ActionResult<T> genérico com { data } ou { error }"
    rationale: "Nunca throw errors em Server Actions — retorno tipado para o chamador"
  - id: "imutabilidade-conforme"
    decision: "Verificação concluída + todos itens conformes = travada"
    rationale: "Regra de negócio PBQP-H: verificação Conforme não pode ser alterada"
  - id: "na-excecao-mapping"
    decision: "UI 'NA' (Não se Aplica) mapeia para enum 'excecao' no banco"
    rationale: "Schema existente usa 'excecao' — documentado no marcarItemSchema"
metrics:
  duration: "5 min"
  completed: "2026-01-26"
---

# Phase 07 Plan 01: Server Actions de Verificações Summary

**One-liner:** Schemas Zod + 5 Server Actions (3 verificações + 2 itens) com padrão 'use server' introduzido pela primeira vez no projeto.

## What Was Done

### Task 1: Schemas Zod para validação de verificações
- Criado `arden/lib/validations/verificacao.ts` com 5 schemas:
  - `criarVerificacaoSchema` — obra_id, unidade_id, servico_id (UUIDs)
  - `atualizarResultadoSchema` — verificacao_id, resultado (enum), descrição opcional
  - `atualizarStatusSchema` — verificacao_id, status (enum)
  - `marcarItemSchema` — item_verificacao_id, status (C/NC/NA), observação opcional
  - `marcarItemReinspecaoSchema` — item_verificacao_id, status_reinspecao (4 valores), observação
- Tipo `ActionResult<T>` genérico exportado para retorno consistente
- Types inferidos exportados para cada schema
- Mapeamento NA → excecao documentado em comentário

### Task 2: Server Actions para verificações
- Criado `arden/lib/supabase/actions/verificacoes.ts` com diretiva `'use server'`
- 3 actions exportadas:
  - `criarVerificacao` — cria verificação + itens automaticamente a partir do template
  - `atualizarResultadoVerificacao` — atualiza resultado com imutabilidade
  - `atualizarStatusVerificacao` — altera status com imutabilidade
- Edge case: serviço sem itens_servico cria verificação com total_itens=0
- Erro 23505 (unique violation) tratado com mensagem amigável
- `revalidatePath` chamado em todas as actions

### Task 3: Server Actions para itens de verificação
- Criado `arden/lib/supabase/actions/itens-verificacao.ts` com diretiva `'use server'`
- 2 actions exportadas:
  - `marcarItemVerificacao` — marca C/NC/NA com data_inspecao
  - `marcarItemReinspecao` — reinspeção com incremento de ciclos
- Pré-condição: apenas itens NC podem ser reinspecionados
- Join Supabase `verificacoes(...)` para obter dados da verificação pai
- Delegação completa de contadores ao trigger `atualizar_contadores_verificacao`

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Server Actions em `lib/supabase/actions/` | Separa mutations server-side de queries client-side existentes |
| `ActionResult<T>` com `{ data }` ou `{ error }` | Nunca throw em Server Actions — retorno tipado |
| Imutabilidade = concluída + total_itens > 0 + itens_conformes === total_itens | Regra PBQP-H: Conforme é travada |
| UI "NA" → enum "excecao" | Schema existente usa 'excecao' para Não se Aplica |
| Helper `isVerificacaoTravada()` duplicado nos 2 arquivos de actions | Cada arquivo é independente; se crescer, extrair para shared |

## Deviations from Plan

None — plan executed exactly as written.

## Verification Results

| Check | Result |
|-------|--------|
| `tsc --noEmit` sem erros nos arquivos novos | PASS |
| Diretório `actions/` com 2 arquivos | PASS |
| `verificacao.ts` com 5 schemas exportados | PASS |
| `'use server'` no topo dos 2 arquivos de actions | PASS |
| Nenhum import de `@/lib/supabase/client` | PASS |

## Next Phase Readiness

- Server Actions prontas para consumo por qualquer UI
- Padrão `'use server'` + `ActionResult<T>` estabelecido para reuso nos próximos planos
- Plano 07-02 (bulk operations / RPC) pode construir sobre este padrão
- Plano 07-03 (query de matriz) pode usar o mesmo diretório de queries
