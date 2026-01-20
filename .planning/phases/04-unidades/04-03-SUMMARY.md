---
phase: 04-unidades
plan: 03
subsystem: database
tags: [rls, supabase, postgres, security, permissions]

# Dependency graph
requires:
  - phase: 04-01
    provides: "unidades data access layer and schema"
  - phase: 03-04
    provides: "is_admin_or_engenheiro() pattern for structure entities"
provides:
  - "RLS policies allowing engenheiros to manage unidades"
  - "Unblocked unidades CRUD for engenheiro role"
affects: [05-biblioteca-fvs, testing]

# Tech tracking
tech-stack:
  added: []
  patterns: ["is_admin_or_engenheiro() for obra structure entities (agrupamentos, unidades)"]

key-files:
  created: []
  modified: ["database/rls-policies.sql"]

key-decisions:
  - "Engenheiros can manage unidades (not just admins) per PRD"
  - "Comment updated to document policy intent"

patterns-established:
  - "Use is_admin_or_engenheiro() for obra structure entities (agrupamentos, unidades)"

# Metrics
duration: 2min
completed: 2026-01-20
---

# Phase 04 Plan 03: Fix RLS Policies for Unidades Summary

**Updated unidades RLS policies to allow engenheiros (not just admins) to create, update, and delete unidades**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-20T17:00:00Z
- **Completed:** 2026-01-20T17:02:00Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Fixed RLS policy blocker preventing engenheiros from creating unidades
- Updated all three unidades CRUD policies (INSERT, UPDATE, DELETE)
- Aligned policies with PRD where engenheiros configure obra structure
- Consistent with agrupamentos fix from Phase 03-04

## Task Commits

Each task was committed atomically:

1. **Task 1: Update unidades RLS policies** - `b804fbf` (fix)

## Files Created/Modified

- `database/rls-policies.sql` - Changed is_admin() to is_admin_or_engenheiro() for unidades INSERT/UPDATE/DELETE policies

## Decisions Made

- **Use is_admin_or_engenheiro() for unidades:** Per PRD, engenheiros are responsible for configuring obras, which includes managing unidades (apartments, houses, etc.). This aligns with agrupamentos policies which already use the same pattern since 03-04.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

**Database migration required.** The RLS policy changes must be applied to the Supabase instance:

```bash
# Option 1: Using Supabase CLI with linked project
npx supabase db push

# Option 2: Run SQL directly in Supabase Dashboard > SQL Editor
# Copy the unidades policies section from database/rls-policies.sql (lines 263-292)
```

**SQL to apply directly:**

```sql
-- INSERT/UPDATE/DELETE: Admin ou engenheiro (engenheiro configura estrutura da obra)
DROP POLICY IF EXISTS "unidades_insert" ON unidades;
CREATE POLICY "unidades_insert" ON unidades
  FOR INSERT WITH CHECK (
    agrupamento_id IN (
      SELECT a.id FROM agrupamentos a
      JOIN obras o ON o.id = a.obra_id
      WHERE o.cliente_id = get_user_cliente_id() AND is_admin_or_engenheiro()
    )
  );

DROP POLICY IF EXISTS "unidades_update" ON unidades;
CREATE POLICY "unidades_update" ON unidades
  FOR UPDATE USING (
    agrupamento_id IN (
      SELECT a.id FROM agrupamentos a
      JOIN obras o ON o.id = a.obra_id
      WHERE o.cliente_id = get_user_cliente_id() AND is_admin_or_engenheiro()
    )
  );

DROP POLICY IF EXISTS "unidades_delete" ON unidades;
CREATE POLICY "unidades_delete" ON unidades
  FOR DELETE USING (
    agrupamento_id IN (
      SELECT a.id FROM agrupamentos a
      JOIN obras o ON o.id = a.obra_id
      WHERE o.cliente_id = get_user_cliente_id() AND is_admin_or_engenheiro()
    )
  );
```

## Next Phase Readiness

- RLS blocker resolved for unidades
- Phase 4 gap closure complete (plans 03-06)
- Ready for Phase 5 (Biblioteca FVS) after all gap closure plans verified

---
*Phase: 04-unidades*
*Completed: 2026-01-20*
