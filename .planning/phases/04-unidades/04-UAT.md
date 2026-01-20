---
status: diagnosed
phase: 04-unidades
source: [04-01-SUMMARY.md, 04-02-SUMMARY.md]
started: 2026-01-20T19:25:00Z
updated: 2026-01-20T19:45:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Split-View Layout (Desktop)
expected: Navigate to /app/obras/[id]/agrupamentos on desktop. Page shows split-view with agrupamentos panel on left (~40%) and unidades panel on right (~60%).
result: issue
reported: "1. Você não está colocando os acentos pt-br nas palavras. 2. Para mim não ficou legal essa diferença no topo das 2 tabelas, gostaria que a tabela de unidades estivesse na mesma altura da de agrupamentos, o mesmo com seus botões."
severity: minor

### 2. Empty State - No Selection
expected: When no agrupamento is selected, right panel shows empty state with icon and message "Selecione um agrupamento".
result: pass

### 3. Select Agrupamento
expected: Click on an agrupamento in the left panel. It becomes highlighted (darker background, blue left border). Right panel shows unidades for that agrupamento.
result: pass

### 4. Inline Count Display
expected: Each agrupamento in the list shows its name followed by count in parentheses, e.g., "Bloco A (12)" in muted text.
result: pass

### 5. Create Single Unidade
expected: Click "Nova Unidade" button. Modal opens. Enter name (e.g., "Apto 101"). Submit. New unidade appears in the list.
result: issue
reported: "Erro ao criar unidade: new row violates row-level security policy for table 'unidades'"
severity: blocker

### 6. Batch Creation - Input Format
expected: In create modal, toggle "Criar multiplas unidades". Enter "Apto 101-105". Preview shows list of generated names: "Apto 101, Apto 102, ..., Apto 105". Button shows "Criar 5 Unidades".
result: pass

### 7. Batch Creation - Submit
expected: Submit batch creation with "Apto 101-105". All 5 unidades appear in the list after modal closes.
result: issue
reported: "Erro de RLS - mesmo problema do teste 5"
severity: blocker

### 8. Natural Sort Order
expected: Create unidades with names like "Apto 2", "Apto 10", "Apto 1". List shows them in natural order: Apto 1, Apto 2, Apto 10 (not alphabetic order where 10 comes before 2).
result: skipped
reason: Bloqueado pelo erro de RLS - não consegue criar unidades para testar

### 9. Edit Unidade
expected: Click dropdown on a unidade, select "Editar". Modal opens with current name. Change name and submit. Updated name shows in list.
result: skipped
reason: Bloqueado pelo erro de RLS - sem unidades para editar

### 10. Delete Unidade
expected: Click dropdown on a unidade, select "Excluir". Confirmation dialog appears. Click "Excluir" to confirm. Unidade is removed from list.
result: skipped
reason: Bloqueado pelo erro de RLS - sem unidades para excluir

### 11. Mobile Layout
expected: View page on mobile viewport (< lg breakpoint). Panels stack vertically: agrupamentos on top, unidades below.
result: pass
note: "Console warning: Missing Description or aria-describedby for DialogContent - logged as separate minor issue"

### 12. Drag-and-Drop Reorder (Agrupamentos)
expected: In agrupamentos panel, click "Reordenar". Drag handles appear. Drag to reorder. Click "Salvar". New order persists after page refresh.
result: pass

## Summary

total: 12
passed: 6
issues: 4
pending: 0
skipped: 3
skipped: 0

## Gaps

- truth: "Split-view layout with aligned panel headers and proper PT-BR accents"
  status: failed
  reason: "User reported: 1. Acentos pt-br faltando nas palavras. 2. Tabela de unidades não está na mesma altura da de agrupamentos."
  severity: minor
  test: 1
  root_cause: "Missing PT-BR accents in multiple component files + unidades panel header smaller than agrupamentos panel header"
  artifacts:
    - path: "arden/app/app/obras/[id]/agrupamentos/_components/unidade-form-modal.tsx"
      issue: "Missing accents: invalido, multiplas, Sera"
    - path: "arden/app/app/obras/[id]/agrupamentos/_components/unidades-panel.tsx"
      issue: "Missing accents: esquerda, comecar + header height mismatch"
    - path: "arden/app/app/obras/[id]/agrupamentos/_components/agrupamento-form-modal.tsx"
      issue: "Missing accents: Numero, Sera"
    - path: "arden/app/app/obras/[id]/agrupamentos/_components/agrupamentos-panel.tsx"
      issue: "Missing accents: comecar"
  missing:
    - "Add proper PT-BR accents to all UI strings"
    - "Align panel headers at same visual height"

- truth: "User can create a new unidade"
  status: failed
  reason: "User reported: Erro ao criar unidade: new row violates row-level security policy for table 'unidades'"
  severity: blocker
  test: 5
  root_cause: "RLS policies for unidades table use is_admin() but should use is_admin_or_engenheiro() - same fix as agrupamentos in Phase 3"
  artifacts:
    - path: "database/rls-policies.sql"
      issue: "Lines 264-292: unidades_insert, unidades_update, unidades_delete use is_admin() instead of is_admin_or_engenheiro()"
  missing:
    - "Change is_admin() to is_admin_or_engenheiro() in unidades RLS policies"
    - "Apply migration to Supabase project"

- truth: "Dialog modals should not show accessibility warnings"
  status: failed
  reason: "User reported: Console warning 'Missing Description or aria-describedby for DialogContent' when opening create modals"
  severity: minor
  test: 11
  root_cause: "Form modals use DialogTitle but no DialogDescription - Radix UI requires both for accessibility"
  artifacts:
    - path: "arden/app/app/obras/[id]/agrupamentos/_components/unidade-form-modal.tsx"
      issue: "Missing DialogDescription component"
    - path: "arden/app/app/obras/[id]/agrupamentos/_components/agrupamento-form-modal.tsx"
      issue: "Missing DialogDescription component"
  missing:
    - "Add DialogDescription (can be sr-only) to form modals"
