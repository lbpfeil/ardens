---
created: 2026-01-20T11:00
title: Adicionar bulk delete para agrupamentos e unidades
area: ui
files:
  - arden/app/app/obras/[id]/agrupamentos/_components/agrupamentos-table.tsx
  - arden/app/app/obras/[id]/agrupamentos/_components/unidades-panel.tsx
  - arden/lib/supabase/queries/agrupamentos.ts
  - arden/lib/supabase/queries/unidades.ts
---

## Problem

Atualmente, para deletar multiplos agrupamentos ou unidades, o usuario precisa deletar um por um clicando no menu de acoes de cada item. Isso e lento e tedioso quando se precisa limpar muitos registros.

Seria util ter:
- Checkboxes de selecao em cada linha da tabela
- Checkbox "selecionar todos" no header
- Botao "Excluir selecionados" que aparece quando ha itens selecionados
- Confirmacao antes de excluir em massa

## Solution

1. **Agrupamentos (agrupamentos-table.tsx):**
   - Adicionar coluna de checkbox
   - Estado de selecao (selectedIds: Set<string>)
   - Botao bulk delete no header quando ha selecao
   - Funcao deleteAgrupamentosBatch em queries

2. **Unidades (unidades-panel.tsx):**
   - Mesmo padrao do agrupamentos
   - Funcao deleteUnidadesBatch em queries

3. **Consideracoes:**
   - RLS ja permite delete para admin/engenheiro
   - Confirmar com AlertDialog mostrando contagem
   - Cascade delete: agrupamento deleta unidades filhas (ja configurado no DB)
