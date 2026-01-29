---
phase: 12-modelo-de-status
plan: 01
subsystem: database
tags: [postgresql, enum, trigger, plpgsql, supabase, migration]

requires:
  - phase: v1.1
    provides: Schema com verificacoes, itens_verificacao, trigger atualizar_contadores_verificacao
provides:
  - ENUM status_verificacao com 4 valores de negócio (pendente, em_andamento, verificado_com_pendencias, verificacao_finalizada)
  - Trigger refatorado com lógica de prioridade NC > Finalizado > Em Andamento > Pendente
  - RPC bulk_verificar atualizada com novos nomes de ENUM
  - RLS policy verificacoes_update com verificacao_finalizada
affects: [12-02, 13-matriz, 14-feed, 15-consulta]

tech-stack:
  added: []
  patterns:
    - "FILTER aggregation em trigger para contadores denormalizados"
    - "ALTER TYPE RENAME VALUE para migração segura de ENUM"
    - "Prioridade NC-first no cálculo de status"

key-files:
  created:
    - supabase/migrations/20260128221307_refactor_status_model_v12.sql
    - database/migrations/refactor_status_model_v12.sql
    - database/migrations/README-refactor_status_model_v12.md
  modified:
    - database/schema.sql
    - database/rls-policies.sql

key-decisions:
  - "Exceção NÃO conta como progresso — verificação com apenas Exceção + Não Verificado permanece Pendente"
  - "NC aberta = nao_conforme sem reinspeção OU reprovado_apos_retrabalho"
  - "Verificações órfãs (sem itens) corrigidas para status pendente"
  - "Recálculo forçado via UPDATE itens_verificacao (não verificacoes) para disparar trigger"

patterns-established:
  - "Status de verificação sempre calculado pelo trigger, nunca setado manualmente"
  - "Contadores denormalizados calculados com FILTER aggregation em query única"
  - "Prioridade estrita: NC > Todos finalizados > Progresso > Pendente"

duration: ~15min
completed: 2026-01-28
---

# Plan 12-01: Migration de ENUM + Trigger + bulk_verificar + Dados

**ENUM renomeado para 4 estados de negócio, trigger refatorado com prioridade NC-first, bulk_verificar e RLS atualizados, dados recalculados**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-01-28
- **Completed:** 2026-01-28
- **Tasks:** 1
- **Files modified:** 5

## Accomplishments
- ENUM status_verificacao migrado: com_nc → verificado_com_pendencias, concluida → verificacao_finalizada
- Trigger atualizar_contadores_verificacao refatorado com lógica de 4 estados e prioridade NC-first
- RPC bulk_verificar atualizada com referências aos novos nomes de ENUM
- RLS policy verificacoes_update atualizada
- Dados existentes recalculados (21 verificações)
- 3 verificações órfãs (sem itens) corrigidas para status pendente

## Task Commits

1. **Task 1: Migration de ENUM + Trigger + bulk_verificar + Dados** - `89fe978` (feat) — preparação da migration + documentação
   - Migration aplicada via Supabase MCP (4 migrations: rename_status_verificacao_enum, refactor_trigger_status_4_estados, update_bulk_verificar_enum_names, update_rls_verificacoes_new_enum)
   - Dados recalculados via execute_sql

## Files Created/Modified
- `supabase/migrations/20260128221307_refactor_status_model_v12.sql` - Migration completa (referência)
- `database/migrations/refactor_status_model_v12.sql` - Cópia da migration para documentação
- `database/migrations/README-refactor_status_model_v12.md` - Guia de aplicação
- `database/schema.sql` - ENUM e trigger atualizados
- `database/rls-policies.sql` - Policy atualizada com verificacao_finalizada

## Decisions Made
- Exceção NÃO conta como progresso (regra de negócio confirmada nos testes)
- Verificações órfãs (sem itens) recebem status pendente e contadores zerados
- Recálculo deve ser feito via UPDATE itens_verificacao (dispara trigger), não via UPDATE verificacoes

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug Fix] Recálculo de dados via tabela errada**
- **Found during:** Passo 4 (recalcular dados existentes)
- **Issue:** O plano especificava `UPDATE verificacoes SET updated_at = updated_at` para forçar recálculo, mas o trigger dispara em `itens_verificacao`, não em `verificacoes`
- **Fix:** Usar `UPDATE itens_verificacao SET updated_at = updated_at` para disparar o trigger corretamente
- **Verification:** Query de consistência NC retornou 0 linhas após correção

**2. [Rule 1 - Bug Fix] Verificações órfãs com status inconsistente**
- **Found during:** Verificação de consistência NC
- **Issue:** 3 verificações sem itens (total_itens=0) estavam com status `verificado_com_pendencias` — impossível de corrigir via trigger porque sem itens não há trigger
- **Fix:** UPDATE direto setando status=pendente e contadores zerados
- **Verification:** Query de consistência NC retornou 0 linhas

**3. [Rule 3 - Blocker] RLS policy com função inexistente**
- **Found during:** Passo 5 (atualizar RLS policy)
- **Issue:** A migration preparada pelo executor usava `get_user_obras()` que não existe no banco
- **Fix:** Verificou-se que o ALTER TYPE RENAME VALUE já atualizou automaticamente a policy existente (PostgreSQL atualiza referências de ENUM automaticamente). Nenhuma ação adicional necessária.
- **Verification:** `pg_get_expr` da policy mostra `verificacao_finalizada` corretamente

---

**Total deviations:** 3 auto-fixed (2 bug fixes, 1 blocker)
**Impact on plan:** Correções essenciais para consistência de dados. Sem impacto no escopo.

## Verification Results

### ENUM Values
- pendente, em_andamento, verificacao_finalizada, verificado_com_pendencias ✓

### Status Distribution
- pendente: 9, verificacao_finalizada: 10, verificado_com_pendencias: 2 ✓

### Consistency Check
- 0 inconsistências NC ✓

### Trigger Tests (STAT-03)
- 5b: Item → NC → verificado_com_pendencias ✓
- 5c: NC resolvida → verificacao_finalizada ✓
- 5d: Todos conforme → verificacao_finalizada ✓
- 5e: Exceção NÃO gera progresso (permanece pendente) ✓
- 5f: Dados restaurados ✓

## Issues Encountered
- Supabase MCP tools inicialmente indisponíveis (resolvido com autenticação do plugin)

## User Setup Required
None - migration aplicada via Supabase MCP.

## Next Phase Readiness
- Banco de dados opera com novo modelo de 4 estados
- Plan 12-02 pode atualizar tipos TypeScript e lógica frontend para os novos ENUMs
- Trigger está ativo e calculando status automaticamente

---
*Phase: 12-modelo-de-status*
*Plan: 01*
*Completed: 2026-01-28*
