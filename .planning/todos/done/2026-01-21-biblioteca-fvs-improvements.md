---
created: 2026-01-21T17:07
title: Biblioteca FVS improvements discussion
area: ui
files:
  - arden/app/app/biblioteca/*
  - arden/lib/supabase/queries/servicos.ts
---

## Problem

A Biblioteca FVS foi implementada (Phase 5) mas existem oportunidades de melhoria para UX:

1. **Filtros de tabela** - Atualmente não há como acessar serviços arquivados. Precisa de filtros para status (ativo/arquivado/todos).

2. **Outras melhorias potenciais** - Discussão necessária sobre:
   - Busca/filtro por categoria
   - Busca por nome/código
   - Ordenação por colunas
   - Paginação para bibliotecas grandes
   - Bulk actions (arquivar múltiplos)
   - Importação/exportação de templates

## Solution

TBD - Requer discussão com usuário para priorizar melhorias e definir escopo.

Sugestões iniciais para discutir:
- Filtro de status como dropdown ou tabs
- Search input acima da tabela
- Column sorting nativo do DataTable
- Batch selection com checkbox column
