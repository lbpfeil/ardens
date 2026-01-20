---
status: testing
phase: 02-obras
source: [02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md, 02-04-SUMMARY.md]
started: 2026-01-19T19:20:00Z
updated: 2026-01-19T19:20:00Z
---

## Current Test

[All tests complete]

## Tests

### 1. View Obras List
expected: Navigate to /app/obras. See page with "Gerenciar Obras" title, table with columns (Nome, Status, Progresso, Data, Acoes), and "Nova Obra" button.
result: PASS

### 2. Create New Obra
expected: Click "Nova Obra" button. Modal opens with title "Nova Obra". Fill nome field (required). Click "Criar Obra". Toast shows "Obra criada com sucesso". Modal closes. New obra appears in table.
result: PASS

### 3. Search Obras
expected: Type text in search box. Table filters to show only obras whose nome contains the search text.
result: PASS

### 4. Filter by Status
expected: Click status filter dropdown. Select "Arquivadas". Table shows only archived obras. Select "Ativas". Table shows only active obras.
result: PASS

### 5. Edit Existing Obra
expected: Click three-dot menu on obra row. Click "Editar". Modal opens with title "Editar Obra" and pre-filled data. Change nome. Click "Salvar". Toast shows "Obra atualizada com sucesso". Table shows updated nome.
result: PASS

### 6. Archive Obra
expected: Click three-dot menu on active obra. Click "Arquivar". AlertDialog asks "Arquivar obra?". Confirm. Toast shows "Obra arquivada com sucesso". Obra disappears from list (filter is Ativas by default).
result: PASS

### 7. Restore Archived Obra
expected: Set filter to "Arquivadas". Click three-dot menu on archived obra. Click "Restaurar". AlertDialog asks "Restaurar obra?". Confirm. Toast shows "Obra restaurada com sucesso". Obra moves back to Ativas list.
result: PASS

### 8. View Obra Details
expected: Click anywhere on obra row (not the dropdown). Navigate to /app/obras/[id]. See ObraHeader with obra name and status badge. See ObraInfoCard with tipologia, responsavel, and dates.
result: PASS

### 9. Invalid Obra ID
expected: Navigate to /app/obras/invalid-uuid manually. See 404 Not Found page.
result: PASS

## Summary

total: 9
passed: 9
issues: 1
pending: 0
skipped: 0

## Issues Fixed

### Issue 1: Arquivada badge color
severity: cosmetic
description: Badge variant "secondary" (purple) looked out of place for archived status
fix: Changed to "outline" variant for neutral/muted appearance
file: arden/app/app/obras/_components/status-badge.tsx

## Gaps

[none]
