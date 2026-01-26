---
phase: 07-fundacao-de-dados
plan: 02
subsystem: data-layer
tags: [postgresql, rpc, bulk-operations, server-actions, plpgsql, security-definer]

dependency-graph:
  requires:
    - "07-01 (ActionResult<T>, padrão 'use server')"
  provides:
    - "RPC bulk_verificar para verificações em massa"
    - "Server Action bulkVerificar() com validação Zod"
    - "Transação atômica para operações bulk na matriz"
  affects:
    - "09 (UI da matriz de verificações)"
    - "08 (verificação individual pode usar como fallback)"

tech-stack:
  added: []
  patterns:
    - "SECURITY DEFINER com autorização interna"
    - "supabase.rpc() para chamar funções PostgreSQL"
    - "Zod max(500) para batch safety"
    - "Lógica de conflito: skip Conforme, reinspeção NC"

key-files:
  created:
    - arden/lib/supabase/actions/bulk-verificar.ts
  modified:
    - database/schema.sql

decisions:
  - id: "security-definer-auth-interna"
    decision: "bulk_verificar é SECURITY DEFINER com autorização interna via auth.uid() e usuario_obras"
    rationale: "Bypassa RLS para performance em operações bulk, mas verifica permissões manualmente"
  - id: "batch-limit-500"
    decision: "Limite de 500 pares por operação no RPC e no Zod"
    rationale: "Proteção contra timeout — tamanhos típicos de construção (50 serviços x 10 unidades = 500)"

metrics:
  duration: "2 min"
  completed: "2026-01-26"
---

# Phase 07 Plan 02: RPC Bulk Verificar e Server Action Summary

**One-liner:** Função PL/pgSQL SECURITY DEFINER para verificações em massa com lógica de conflito (skip Conforme, reinspeção NC) + Server Action wrapper com validação Zod max 500 pares.

## What Was Done

### Task 1: Criar e documentar função bulk_verificar
**Commit:** `a1d2085`

Adicionada função `bulk_verificar` em `database/schema.sql` (PARTE 12 - Funções Auxiliares):

- **Assinatura:** `bulk_verificar(p_obra_id UUID, p_resultado TEXT, p_pares JSONB, p_descricao TEXT DEFAULT NULL) RETURNS JSONB`
- **SECURITY DEFINER** com autorização interna:
  1. `auth.uid()` para identificar usuário
  2. `usuario_obras` para verificar acesso à obra
- **Validação:**
  - Resultado deve ser 'conforme', 'nao_conforme' ou 'excecao'
  - Máximo 500 pares por chamada
- **Lógica de conflito por par:**
  - Verificação `concluida` (Conforme travada): skip, incrementa `skipped`
  - Verificação `com_nc`: reinspeção dos itens NC abertos, incrementa `reinspected`
  - Verificação `pendente`/`em_andamento`: atualiza todos os itens com novo status
  - Verificação inexistente: cria verificação + itens do template (`itens_servico`)
- **Retorno:** `jsonb_build_object('created', N, 'skipped', N, 'reinspected', N)`
- Trigger `tr_itens_verificacao_contadores` é mantido ativo (roda PER ROW após cada INSERT/UPDATE)

### Task 2: Criar Server Action wrapper
**Commit:** `f9b41fc`

Criado `arden/lib/supabase/actions/bulk-verificar.ts`:

- Diretiva `'use server'` no topo
- Importa `createClient` de `@/lib/supabase/server` (não client)
- Importa `ActionResult` de `@/lib/validations/verificacao` (Plan 01, sem duplicação)
- Schema Zod `bulkVerificarSchema` com:
  - `obra_id`: UUID válido
  - `resultado`: enum ['conforme', 'nao_conforme', 'excecao']
  - `pares`: array min(1) max(500) de { servico_id: UUID, unidade_id: UUID }
  - `descricao`: string max(1000) opcional
- `bulkVerificar()` exportada com:
  1. Validação Zod do input
  2. Chamada `supabase.rpc('bulk_verificar', ...)` com parâmetros nomeados
  3. `revalidatePath` da obra
  4. Retorno `ActionResult<BulkVerificarResult>`
- Tipo `BulkVerificarInput` exportado para consumo pela UI

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| SECURITY DEFINER com auth interna | Bypassa RLS para performance bulk, autorização feita dentro da função |
| Limite 500 pares (RPC + Zod) | Tamanho típico: 50 serviços x 10 unidades = 500 triggers |
| Reinspeção bulk aplica conforme_apos_reinspecao ou reprovado_apos_retrabalho | Simplifica decisão: conforme = sem problema, outros = reprovado |
| Trigger de contadores mantido ativo | Para tamanhos típicos (500 rows), overhead aceitável vs. complexidade de desabilitar |

## Deviations from Plan

### Limitação de Ambiente

**1. [Bloqueio] Migration não aplicada via Supabase MCP**
- **Motivo:** Ferramentas MCP do Supabase não disponíveis neste ambiente de execução
- **Impacto:** A função `bulk_verificar` está documentada em `database/schema.sql` mas não foi aplicada ao banco
- **Ação necessária:** Aplicar migration via `mcp__supabase__apply_migration` com o SQL da função
- **Arquivo:** `database/schema.sql` (PARTE 12, bloco bulk_verificar)

### Auto-fixed Issues

None -- lógica e nomes de colunas verificados contra schema.sql antes da implementação.

## Verification Results

| Check | Result |
|-------|--------|
| `database/schema.sql` contém `bulk_verificar` | PASS |
| Função tem SECURITY DEFINER + auth.uid() | PASS |
| Limite 500 pares validado no RPC | PASS |
| `bulk-verificar.ts` tem `'use server'` | PASS |
| Importa de `@/lib/supabase/server` | PASS |
| Importa `ActionResult` de `@/lib/validations/verificacao` | PASS |
| `export async function bulkVerificar` existe | PASS |
| Zod schema com min(1) max(500) pares | PASS |
| `tsc --noEmit` sem erros no arquivo novo | PASS |

## Next Phase Readiness

- `bulkVerificar()` pronta para chamada pela UI da matriz (Fase 9)
- Padrão RPC + Server Action wrapper estabelecido para futuras operações bulk
- **Bloqueio pendente:** Migration da função `bulk_verificar` precisa ser aplicada ao banco via MCP antes de uso real
