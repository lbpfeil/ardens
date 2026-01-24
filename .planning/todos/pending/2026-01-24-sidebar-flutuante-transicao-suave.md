---
created: 2026-01-24T12:00
title: Sidebar flutuante com transição suave
area: ui
files:
  - arden/components/layout/sidebar-global.tsx
  - arden/components/layout/sidebar-obra.tsx
  - arden/components/layout/sidebar-item.tsx
---

## Problem

A barra lateral atual tem dois problemas de UX:

1. **Comportamento de layout:** A sidebar empurra o conteúdo da página quando expande. Deveria "flutuar" sobre o conteúdo (overlay) mantendo o layout estável.

2. **Inconsistência visual na transição:**
   - Altura dos ícones muda entre estado retraído e expandido
   - Espaço reservado para títulos de seções não existe na versão retraída
   - Ícones se movem durante a transição (devem permanecer fixos)
   - Transição não é suave/agradável

## Solution

1. Usar `position: fixed` ou `absolute` para sidebar expandida (overlay sobre conteúdo)
2. Manter sidebar retraída como parte do layout normal (reservando espaço)
3. Garantir que ícones tenham posição absoluta consistente nos dois estados
4. Reservar espaço para labels de seção mesmo quando retraída (altura zero com overflow hidden)
5. Aplicar `transition-all` com easing suave para animação
