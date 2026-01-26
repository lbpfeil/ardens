---
phase: 07-fundacao-de-dados
plan: 03
subsystem: data-layer
tags: [supabase, queries, rls, typescript, performance]

dependency-graph:
  requires: []
  provides: [getMatrizData, getVerificacaoComItens, rls-initplan]
  affects: [08-matriz-verificacoes, 09-verificacao-individual, 10-dashboards]

tech-stack:
  added: []
  patterns: [initPlan-rls, parallel-queries, o1-lookup-map, supabase-client-parameter]

key-files:
  created:
    - arden/lib/supabase/queries/verificacoes.ts
  modified:
    - database/rls-policies.sql

decisions:
  - id: d07-03-01
    decision: "Nomes de colunas corrigidos para schema real (observacao/metodo/tolerancia em vez de descricao/metodo_verificacao/criterio_aceitacao)"
  - id: d07-03-02
    decision: "JOIN com tabela obras removido em itens_verificacao policies -- substituído por subselect direto mais eficiente"

metrics:
  duration: "4 min"
  completed: "2026-01-26"
---

# Phase 7 Plan 3: Query da Matriz e RLS Otimizadas Summary

**One-liner:** Queries paralelas para matriz serviço x unidade com Map O(1) e RLS policies otimizadas com initPlan caching per-statement.

## What Was Done

### Task 1: Criar query da matriz e query de verificação individual
**Commit:** `dab68a6`

Criado `arden/lib/supabase/queries/verificacoes.ts` com:

- **`getMatrizData(supabase, obraId)`**: Executa 3 queries em paralelo via `Promise.all`:
  1. Serviços ativos da obra (via `obra_servicos` -> `servicos`)
  2. Agrupamentos com unidades (ordenados por `ordem`)
  3. Verificações existentes (convertidas em `Record<string, MatrizVerificacao>`)
- **`getVerificacaoComItens(supabase, verificacaoId)`**: Busca verificação com itens nested e dados do `item_servico`, ordenados por `ordem` do template
- **6 tipos exportados**: `MatrizData`, `MatrizServico`, `MatrizAgrupamento`, `MatrizUnidade`, `MatrizVerificacao`, `VerificacaoComItens`, `ItemVerificacao`
- Ambas funções aceitam `SupabaseClient` como parâmetro (sem importar client/server) para flexibilidade

### Task 2: Otimizar RLS policies com initPlan pattern
**Commit:** `8520068`

Atualizado `database/rls-policies.sql` com 8 policies otimizadas:
- **4 policies de `verificacoes`** (SELECT, INSERT, UPDATE, DELETE)
- **4 policies de `itens_verificacao`** (SELECT, INSERT, UPDATE, DELETE)
- Padrão `(SELECT fn())` aplicado em: `get_user_cliente_id()`, `is_admin()`, `is_admin_or_engenheiro()`, `auth.uid()`
- `user_has_obra_access(obra_id)` substituído por subselect direto: `obra_id IN (SELECT obra_id FROM usuario_obras WHERE usuario_id = (SELECT auth.uid()))`
- JOIN com tabela `obras` removido em `itens_verificacao` (desnecessário quando usando subselect direto)

## Decisions Made

1. **Nomes de colunas corrigidos** -- O plano especificava `descricao`, `metodo_verificacao`, `criterio_aceitacao` para `itens_servico`, mas o schema real usa `observacao`, `metodo`, `tolerancia`. Corrigido no `ItemVerificacao.item_servico` interface.

2. **JOIN removido em itens_verificacao** -- As policies originais faziam `JOIN obras o ON o.id = v.obra_id`. Com initPlan, o subselect `WHERE v.obra_id IN (SELECT id FROM obras WHERE cliente_id = ...)` elimina a necessidade do JOIN, simplificando a query.

## Deviations from Plan

### Limitação de Ambiente

**1. [Bloqueio] Migration não aplicada via Supabase MCP**
- **Motivo:** Ferramentas MCP do Supabase não disponíveis neste ambiente de execução
- **Impacto:** As policies otimizadas estão documentadas em `database/rls-policies.sql` mas não foram aplicadas ao banco
- **Ação necessária:** Aplicar migration manualmente via `mcp__supabase__apply_migration` com o SQL das policies otimizadas
- **Arquivos afetados:** `database/rls-policies.sql`

### Auto-fixed Issues

**2. [Rule 1 - Bug] Nomes de colunas incorretos no plano**
- **Encontrado durante:** Task 1
- **Problema:** Plano referenciava `descricao`, `metodo_verificacao`, `criterio_aceitacao` que não existem na tabela `itens_servico`
- **Correção:** Usados nomes corretos do schema: `observacao`, `metodo`, `tolerancia`
- **Arquivos:** `arden/lib/supabase/queries/verificacoes.ts`

## Verification Results

1. `npx tsc --noEmit` -- sem erros em `verificacoes.ts`
2. `getMatrizData` e `getVerificacaoComItens` exportadas corretamente
3. Ambas funções aceitam `SupabaseClient` como primeiro parâmetro
4. Nenhum import de `@/lib/supabase/client` ou `@/lib/supabase/server`
5. `Promise.all` usado para 3 fetches paralelos
6. Map usa chave `servico_id:unidade_id` para lookup O(1)
7. 8 policies em `rls-policies.sql` usam padrão `(SELECT fn())`

## Next Phase Readiness

**Pronto para Fases 8-10:**
- `getMatrizData` alimenta a UI da matriz (Fase 9)
- `getVerificacaoComItens` alimenta a página de verificação individual (Fase 8)
- Tipos TypeScript exportados para consumo por componentes React
- RLS policies otimizadas para suportar operações bulk da matriz

**Bloqueio pendente:** Migration das RLS policies precisa ser aplicada ao banco antes de testar performance real.
