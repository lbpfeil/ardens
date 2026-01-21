---
created: 2026-01-21T17:45
title: Standardize duplicated UI patterns
area: ui
files:
  - arden/app/app/biblioteca/_components/archive-confirmation.tsx
  - arden/app/app/obras/_components/archive-confirmation.tsx
  - arden/app/app/biblioteca/[id]/_components/item-delete-confirmation.tsx
  - arden/app/app/obras/[id]/unidades/_components/delete-confirmation.tsx
  - arden/app/app/obras/[id]/unidades/_components/bulk-delete-confirmation.tsx
  - arden/app/app/biblioteca/_components/servicos-table.tsx
  - arden/app/app/obras/_components/obras-table.tsx
---

## Problem

Codebase analysis revealed multiple duplicated UI patterns implemented inconsistently:

### Priority 1 - High Impact

1. **Empty States** (6+ files)
   - Same structure copy-pasted with minor variations
   - Some use icons, others don't
   - Different conditional logic patterns

2. **Confirmation Dialogs** (6 files)
   - Nearly identical AlertDialog implementations
   - archive-confirmation.tsx duplicated between biblioteca and obras
   - Could be one generic component

### Priority 2 - Medium Impact

3. **Form Modals** (4 files)
   - Same Dialog + form + footer structure
   - 70% similar code
   - Different field configurations

4. **Action Dropdowns** (6 files)
   - MoreVertical + Edit + Archive/Delete pattern
   - Minor variations in menu items

### Priority 3 - Lower Impact

5. **Page Headers** - Title + description (consistent, but could be component)
6. **Panel Headers** - Title + action buttons
7. **Loading States** - Inconsistent skeleton patterns

## Solution

Create shared components in order of priority:

### Dashboard Components (Priority - created during brainstorm)
- [x] `KPICard` - title, value, description, loading (2026-01-21)
- [ ] `NCFeed` - feed de nao-conformidades (criar durante Phase 6)
- [ ] `DashboardSection` - card wrapper com header/action (criar se necessario)

### Generic Components (Lower priority - funcionam, apenas duplicados)
- [ ] `EmptyState` - icon, title, description, action button
- [ ] `ConfirmationDialog` - generic with loading state
- [ ] `FormModal` - wrapper for dialog + form pattern
- [ ] `RowActionsMenu` - standard Edit/Archive dropdown
- [ ] `PageHeader` - title + description
- [ ] `PanelHeader` - title + actions

## Decision (2026-01-21)

**Estrategia escolhida: Incremental**
- Criar componentes de dashboard conforme Phase 6 precisa
- Deixar refatoracao de ConfirmationDialog/EmptyState para depois
- Razao: Dashboard e deliverable visivel, duplicacao e code smell mas nao bug

## Notes

- ListPageToolbar and SortableTableHeader already created (2026-01-21)
- KPICard documented in DESIGN-SYSTEM.md (2026-01-21)
- Each component should be documented in DESIGN-SYSTEM.md
- Update existing pages to use new components after creation
