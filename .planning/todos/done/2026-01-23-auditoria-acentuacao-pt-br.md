---
created: 2026-01-23T13:13
title: Auditoria de acentuação PT-BR na plataforma
area: ui
files: []
---

## Problem

A plataforma pode conter textos visíveis ao usuário (labels, placeholders, mensagens de erro, títulos, botões, toasts, empty states) sem acentuação correta do português brasileiro.

O CLAUDE.md define que TODOS os textos devem usar acentuação PT-BR correta, mas não há garantia de que todos os arquivos existentes seguem essa regra.

Precisa de uma verificação completa em:
- `arden/app/` - páginas e layouts
- `arden/components/` - componentes reutilizáveis
- `arden/lib/` - schemas Zod com mensagens de erro

## Solution

1. Grep recursivo por palavras comuns sem acento (ex: "Descricao", "nao ", "codigo", "servico", "unidade", "acao", etc.)
2. Revisar cada arquivo encontrado
3. Corrigir textos para usar acentuação correta
4. Considerar criar um script de lint ou CI check para evitar regressões futuras
