---
created: 2026-01-20T10:30
title: Refatorar modal batch de unidades para formato prefixo/quantidade
area: ui
files:
  - arden/app/app/obras/[id]/agrupamentos/_components/unidade-form-modal.tsx
  - arden/lib/validations/unidade.ts
  - arden/lib/supabase/queries/unidades.ts
---

## Problem

O modal de criacao em lote de unidades usa um campo unico de intervalo (ex: "Apto 101-110") que requer parsing complexo. O usuario solicitou que seja similar ao modal de agrupamentos que usa campos separados para:
- Prefixo
- Quantidade
- Numero inicial

Diferenca chave: em unidades, o prefixo deve ser **opcional** (pode criar apenas numeros como "101", "102", etc).

Modal atual: campo rangeInput com formato "Prefixo inicio-fim"
Modal desejado: campos separados prefixo (opcional), quantidade, numeroInicial

## Solution

1. Atualizar `unidade.ts` validation schema:
   - Criar novo schema `unidadeBatchSchemaV2` com campos: prefixo (optional), quantidade, numeroInicial
   - Criar funcao `generateUnidadeBatchNames(prefixo?: string, quantidade: number, numeroInicial: number)`

2. Atualizar `unidade-form-modal.tsx`:
   - Trocar form batch de rangeInput para os 3 campos separados
   - Prefixo sem asterisco (opcional)
   - Preview funciona igual ao de agrupamentos

3. Possivelmente criar `createUnidadesBatchV2` em queries se assinatura mudar
