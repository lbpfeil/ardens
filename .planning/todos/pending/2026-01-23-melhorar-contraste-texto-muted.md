---
created: 2026-01-23T13:16
title: Melhorar contraste de textos muted/secundários
area: ui
files:
  - arden/components/biblioteca/servico-form-modal.tsx
---

## Problem

Textos secundários/informativos na plataforma estão com baixa visibilidade. A cor cinza do texto (`text-foreground-muted` ou similar) não tem contraste suficiente com o fundo cinza escuro dos containers.

**Exemplo concreto:**
- Modal de editar serviço: o texto "Uma nova revisão será criada ao salvar" está difícil de ler

Este padrão provavelmente se repete em outros lugares que usam textos de ajuda, descrições ou notas informativas.

## Solution

1. Identificar a variável CSS usada para esses textos (provavelmente `text-foreground-muted`)
2. Ajustar o valor em `globals.css` para uma tonalidade mais clara
3. Verificar se a mudança não quebra outros usos legítimos
4. Alternativa: criar uma nova variável específica para textos de ajuda em overlays/modais se o contexto de fundo for diferente
5. Testar contraste com ferramenta de acessibilidade (WCAG AA mínimo: 4.5:1 para texto normal)
