---
phase: 09-matriz-verificacoes
plan: 01
subsystem: verificacoes-data
tags: [database, migration, trigger, typescript, tooltip, heatmap, status]

dependency-graph:
  requires: [07-fundacao-dados]
  provides: [tem_reinspecao-column, matriz-status-utility, tooltip-component, extended-query]
  affects: [09-02]

tech-stack:
  added: []
  patterns: [heatmap-status-derivation, denormalized-boolean-via-trigger]

file-tracking:
  key-files:
    created:
      - database/migrations/002_add_tem_reinspecao_to_verificacoes.sql
      - arden/app/app/obras/[id]/verificacoes/_components/matriz-status.ts
      - arden/components/ui/tooltip.tsx
    modified:
      - database/schema.sql
      - arden/lib/supabase/queries/verificacoes.ts
      - arden/app/globals.css

decisions:
  - id: MATRIZ-STATUS-6
    summary: "6 estados visuais do heatmap derivados de status + tem_reinspecao"
  - id: CSS-THEME-600
    summary: "Mapeamento bg-brand-600 e bg-destructive-600 adicionado ao @theme inline"

metrics:
  duration: 5.6 min
  completed: 2026-01-27
  tasks: 2/2
---

# Phase 09 Plan 01: Camada de Dados e Utilitarios da Matriz - Summary

**Preparar campo tem_reinspecao no banco, estender query da matriz, instalar tooltip e criar utilitario de mapeamento status-para-cor com 6 estados visuais.**

## Tasks Completed

| # | Task | Commit | Key Changes |
|---|------|--------|-------------|
| 1 | Adicionar campo tem_reinspecao ao banco e atualizar trigger | a37038a | Migration SQL, schema.sql atualizado |
| 2 | Estender query, instalar tooltip, criar utilitario de status | c682860 | MatrizVerificacao + tooltip + matriz-status.ts + globals.css |

## What Was Built

### 1. Campo tem_reinspecao na tabela verificacoes

- Coluna `BOOLEAN DEFAULT FALSE` adicionada a `verificacoes`
- Trigger `atualizar_contadores_verificacao` atualizado com `EXISTS(SELECT 1 FROM itens_verificacao WHERE ... AND status_reinspecao IS NOT NULL)`
- Migration SQL pronta em `database/migrations/002_add_tem_reinspecao_to_verificacoes.sql`
- Backfill de registros existentes incluso na migration
- **Nota:** Migration deve ser aplicada via MCP (`mcp__supabase__apply_migration`) -- artefato SQL criado mas nao aplicado nesta sessao (sem acesso MCP)

### 2. Query getMatrizData estendida

- Interface `MatrizVerificacao` agora inclui `tem_reinspecao: boolean`
- SELECT da query de verificacoes atualizado para incluir `tem_reinspecao`
- Lookup O(1) via map continua funcional com o campo adicional

### 3. Componente Tooltip (shadcn/ui)

- Instalado via `npx shadcn@latest add tooltip`
- Exporta: `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger`
- Usa Radix UI Tooltip primitive (ja instalado via `radix-ui@1.4.3`)

### 4. Utilitario de Status da Matriz

- 6 estados visuais: `pendente`, `conforme`, `nao_conforme`, `excecao`, `conforme_reinspecao`, `nc_reinspecao`
- `STATUS_COLORS` mapeia para classes Tailwind do design system
- `STATUS_LABELS` mapeia para labels em portugues com acentuacao
- `deriveMatrizCellStatus()` deriva estado visual a partir de `MatrizVerificacao`
- Mapeamento CSS `bg-brand-600` e `bg-destructive-600` adicionado ao `@theme inline`

## Decisions Made

### 1. Mapeamento de 6 estados visuais
- pendente -> bg-surface-200 (cinza neutro)
- conforme -> bg-brand (verde padrao)
- nao_conforme -> bg-destructive (vermelho)
- excecao -> bg-warning (laranja/amarelo)
- conforme_reinspecao -> bg-brand-600 (verde claro, distingue de conforme puro)
- nc_reinspecao -> bg-destructive-600 (vermelho claro, distingue de NC pura)

### 2. CSS Theme extension
- Adicionado `--color-brand-600` e `--color-destructive-600` ao bloco `@theme inline` do globals.css
- Necessario para Tailwind v4 gerar as classes `bg-brand-600` e `bg-destructive-600`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Mapeamento CSS theme para cores -600**

- **Found during:** Task 2
- **Issue:** CSS variables `--brand-600` e `--destructive-600` existiam em `:root` mas nao estavam mapeadas no `@theme inline`, impedindo Tailwind de gerar classes `bg-brand-600` e `bg-destructive-600`
- **Fix:** Adicionado `--color-brand-600: var(--brand-600)` e `--color-destructive-600: var(--destructive-600)` ao bloco `@theme inline`
- **Files modified:** arden/app/globals.css
- **Commit:** c682860

## Authentication Gates

Nenhum gate de autenticacao encontrado. No entanto, a migration SQL nao foi aplicada ao banco de dados remoto porque MCP tools nao estavam disponiveis nesta sessao. A migration deve ser aplicada manualmente:

```
mcp__supabase__apply_migration(
  project_id: "rspjiwkbwfikxqjmcolr",
  name: "add_tem_reinspecao_to_verificacoes",
  query: <conteudo de database/migrations/002_add_tem_reinspecao_to_verificacoes.sql>
)
```

## Next Phase Readiness

O plano 09-02 pode iniciar imediatamente apos aplicar a migration. Todos os artefatos TypeScript estao prontos:
- `MatrizVerificacao` com `tem_reinspecao`
- `deriveMatrizCellStatus()` para mapear dados -> cores
- `Tooltip` para hover nas celulas
- CSS classes do heatmap registradas no theme

**Blocker:** Migration SQL precisa ser aplicada via MCP antes que a feature funcione em runtime.
