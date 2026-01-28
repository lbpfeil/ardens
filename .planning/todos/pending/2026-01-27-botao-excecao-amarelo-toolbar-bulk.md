---
created: 2026-01-27T19:55
title: Botão Exceção amarelo na toolbar de seleção em massa
area: ui
files:
  - arden/app/app/obras/[id]/verificacoes/_components/matriz-selection-toolbar.tsx
---

## Problem

Na toolbar flutuante que aparece ao selecionar células na matriz de verificações, o botão "Exceção" usa o estilo padrão (ghost/outline). O usuário gostaria que esse botão fosse amarelo para diferenciá-lo visualmente dos outros botões (Verificar e Cancelar), reforçando que Exceção é uma ação distinta — não é Conforme nem NC.

## Solution

Aplicar variante warning/amarela ao botão "Exceção" na `matriz-selection-toolbar.tsx`. Verificar se já existe variante `warning` no Button do shadcn ou se é necessário usar classes Tailwind diretas (ex: `bg-warning text-warning-foreground` ou `bg-amber-500 text-white`).
