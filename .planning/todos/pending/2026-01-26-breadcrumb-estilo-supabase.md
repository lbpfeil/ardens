---
created: 2026-01-26T00:00
title: Breadcrumb estilo Supabase com troca rápida de contexto
area: ui
files:
  - arden/components/topbar.tsx
---

## Problem

O breadcrumb atual do app não permite troca rápida de contexto. Precisa ser reformulado para seguir o padrão do Supabase: espaçamento adequado entre itens, badges de status ao lado dos nomes, e setinhas para cima/baixo (chevrons) que abrem dropdown para troca rápida de contexto (ex: trocar de obra sem voltar à listagem).

Referência visual: breadcrumb do dashboard do Supabase com itens clicáveis que abrem popover com busca e lista de opções (organização, projeto, branch).

## Solution

- Redesenhar breadcrumb com separadores `/` e espaçamento generoso
- Cada segmento clicável abre Popover com lista pesquisável (Combobox pattern)
- Adicionar ChevronUpDown (ícone de setas) ao lado de cada segmento navegável
- Badges opcionais ao lado dos nomes (ex: status da obra)
- Menus contextuais: trocar obra, trocar seção dentro da obra
- Usar componentes existentes: Popover + Command (ou Combobox) do shadcn
