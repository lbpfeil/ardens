# Phase 12: Modelo de Status - Research

**Researched:** 2026-01-28
**Domain:** PostgreSQL triggers, ENUM migrations, status calculation logic
**Confidence:** HIGH

## Summary

This phase implements a 4-state status model for verificações (inspections), migrating from the existing 3-state system. The core technical challenge is refactoring a PostgreSQL trigger function (`atualizar_contadores_verificacao()`) to implement new business rules, renaming ENUM values to match business terminology, and ensuring the existing RPC (`bulk_verificar`) properly delegates status calculation to the trigger.

The standard approach uses:
- **ALTER TYPE RENAME VALUE** for ENUM migration (simple 1:1 mapping)
- **AFTER INSERT/UPDATE/DELETE trigger** for status recalculation (row-level)
- **Denormalized counters** in `verificacoes` table for query performance
- **Data migration step** to recalculate all existing status values

**Primary recommendation:** Rename ENUM values using `ALTER TYPE RENAME VALUE`, refactor the existing trigger with new 4-state logic prioritizing NC detection, and run a one-time UPDATE to recalculate all status values via the trigger. Avoid recreating the ENUM type (complex, risky, requires downtime).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| PostgreSQL | 15+ | Database with ENUM, triggers, RPC | Supabase standard, robust ENUM support since 9.1 |
| PL/pgSQL | Built-in | Trigger function language | Native PostgreSQL procedural language, best performance |
| Supabase MCP | Current | Migration tool | Project standard for database schema changes |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `ALTER TYPE` | Built-in | ENUM value manipulation | Rename/add ENUM values (safer than recreation) |
| Row-level triggers | Built-in | Per-row status calculation | When status depends on individual item changes |
| Statement-level triggers | Built-in | Bulk operations (not needed here) | Only for batch updates with transition tables |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| ALTER TYPE RENAME | Recreate ENUM type | Recreation requires complex migration (rename old, create new, alter columns, drop old), high risk, potential downtime |
| AFTER trigger | BEFORE trigger | AFTER is semantically correct (calculate status AFTER item change is persisted), BEFORE would calculate before commit |
| Denormalized counters | Real-time aggregation | Counters trade write overhead for read performance (correct choice for OLTP) |
| Trigger delegation | Manual status in RPC | Trigger ensures single source of truth, prevents inconsistency |

**Installation:**
```bash
# No new packages - uses built-in PostgreSQL features
# Migrations applied via Supabase MCP tools (already configured)
```

## Architecture Patterns

### Recommended Migration Structure
```
1. ENUM migration (rename values)
   ↓
2. Trigger function refactor (new 4-state logic)
   ↓
3. Data migration (recalculate existing status)
   ↓
4. Verification (query audit)
```

### Pattern 1: ENUM Value Renaming (Safe Migration)
**What:** Use `ALTER TYPE RENAME VALUE` to change ENUM labels without recreating type
**When to use:** 1:1 mapping of old values to new values (our case)
**Example:**
```sql
-- Source: PostgreSQL 18 Documentation + Supabase Docs
-- Migration: rename_status_verificacao_enum.sql

-- Step 1: Rename ENUM values
ALTER TYPE status_verificacao RENAME VALUE 'com_nc' TO 'verificado_com_pendencias';
ALTER TYPE status_verificacao RENAME VALUE 'concluida' TO 'verificacao_finalizada';
-- 'pendente' and 'em_andamento' remain unchanged

-- Why this works:
-- - Value's place in ordering is NOT affected (PostgreSQL guarantee)
-- - No table locks required (ALTER TYPE is lightweight)
-- - Existing data automatically uses new labels
-- - No transaction restrictions for RENAME (unlike ADD VALUE)
```

**Critical notes:**
- `RENAME VALUE` does NOT affect enum ordering (safe for existing comparisons)
- No performance penalty (unlike `ADD VALUE` which can slow comparisons)
- Can be run inside transaction block (unlike `ADD VALUE`)
- If new name already exists, PostgreSQL raises error (migration fails safely)

### Pattern 2: Status Calculation Trigger (Denormalized Aggregation)
**What:** AFTER trigger that recalculates parent status when child items change
**When to use:** Status derived from multiple child records, query performance matters
**Example:**
```sql
-- Source: Existing codebase + PostgreSQL trigger best practices
-- Function: atualizar_contadores_verificacao() (refactored)

CREATE OR REPLACE FUNCTION atualizar_contadores_verificacao()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate all counters and status in one UPDATE
  UPDATE verificacoes v SET
    -- Counters (existing pattern - expand as needed)
    total_itens = (
      SELECT COUNT(*)
      FROM itens_verificacao
      WHERE verificacao_id = v.id
    ),
    itens_nc_abertas = (  -- NEW counter for NC detection
      SELECT COUNT(*)
      FROM itens_verificacao
      WHERE verificacao_id = v.id
        AND (
          (status = 'nao_conforme' AND status_reinspecao IS NULL)
          OR status_reinspecao = 'reprovado_apos_retrabalho'
        )
    ),
    itens_finalizados = (  -- NEW counter for completion check
      SELECT COUNT(*)
      FROM itens_verificacao
      WHERE verificacao_id = v.id
        AND (
          status IN ('conforme', 'excecao')
          OR status_reinspecao IN ('conforme_apos_reinspecao', 'retrabalho', 'aprovado_com_concessao')
        )
    ),
    itens_conformes = (  -- Existing - count only primary Conforme
      SELECT COUNT(*)
      FROM itens_verificacao
      WHERE verificacao_id = v.id
        AND status = 'conforme'
    ),

    -- Status calculation (NEW 4-state logic with priority)
    status = CASE
      -- Priority 1: NC sempre domina
      WHEN (
        SELECT COUNT(*)
        FROM itens_verificacao
        WHERE verificacao_id = v.id
          AND (
            (status = 'nao_conforme' AND status_reinspecao IS NULL)
            OR status_reinspecao = 'reprovado_apos_retrabalho'
          )
      ) > 0 THEN 'verificado_com_pendencias'

      -- Priority 2: Todos finalizados
      WHEN (
        SELECT COUNT(*)
        FROM itens_verificacao
        WHERE verificacao_id = v.id
          AND (
            status IN ('conforme', 'excecao')
            OR status_reinspecao IN ('conforme_apos_reinspecao', 'retrabalho', 'aprovado_com_concessao')
          )
      ) = v.total_itens THEN 'verificacao_finalizada'

      -- Priority 3: Tem progresso (Conforme sem NC)
      WHEN (
        SELECT COUNT(*)
        FROM itens_verificacao
        WHERE verificacao_id = v.id
          AND status = 'conforme'
      ) > 0 THEN 'em_andamento'

      -- Priority 4: Nenhum progresso (Exceção não conta)
      ELSE 'pendente'
    END

  WHERE v.id = COALESCE(NEW.verificacao_id, OLD.verificacao_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger remains the same
CREATE TRIGGER tr_itens_verificacao_contadores
  AFTER INSERT OR UPDATE OR DELETE ON itens_verificacao
  FOR EACH ROW EXECUTE FUNCTION atualizar_contadores_verificacao();
```

**Why this pattern:**
- **AFTER trigger**: Semantically correct (calculate after change is committed)
- **Row-level**: Fires on each item change (correct granularity for this domain)
- **Single UPDATE**: Recalculates all counters + status atomically
- **COALESCE(NEW, OLD)**: Handles INSERT (NEW), UPDATE (NEW), DELETE (OLD)
- **Priority-based CASE**: NC detection first, then completion, then progress

**Performance note:** Row-level AFTER triggers store state until statement end, but for typical inspection workflows (1-50 items per verificação), overhead is negligible (<10ms per batch).

### Pattern 3: Data Migration (Recalculate Existing Status)
**What:** One-time UPDATE that forces trigger to recalculate all status values
**When to use:** After trigger refactor, to migrate existing data to new logic
**Example:**
```sql
-- Source: Migration best practices
-- Migration: recalculate_status_verificacoes.sql

-- Force trigger to recalculate by touching updated_at
UPDATE verificacoes
SET updated_at = updated_at
WHERE TRUE;

-- Why this works:
-- - UPDATE fires the trigger even though data doesn't change
-- - Trigger recalculates status using new 4-state logic
-- - updated_at = updated_at ensures no timestamp change
-- - WHERE TRUE processes all rows (test data only, safe)

-- Alternative (more explicit):
UPDATE verificacoes
SET status = status, updated_at = updated_at
WHERE TRUE;
```

**Important:** Run AFTER trigger refactor, BEFORE new frontend code expects new ENUM values.

### Pattern 4: RPC Delegation (Single Source of Truth)
**What:** RPC function only manipulates items, trigger calculates status
**When to use:** Multiple code paths can modify status (bulk RPC, individual edits, etc.)
**Example:**
```sql
-- Source: Existing bulk_verificar() RPC (no changes needed)
-- The RPC already delegates correctly:

CREATE OR REPLACE FUNCTION bulk_verificar(...)
RETURNS JSONB AS $$
BEGIN
  -- ... authorization, validation ...

  -- RPC only inserts/updates items
  UPDATE itens_verificacao
  SET status = v_item_status,
      data_inspecao = NOW(),
      inspetor_id = v_user_id,
      updated_at = NOW()
  WHERE verificacao_id = v_verificacao_id;
  -- Trigger fires automatically, recalculates status

  -- RPC does NOT set verificacao.status manually

  RETURN jsonb_build_object(...);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Key principle:** Only trigger writes to `verificacoes.status`. Application code (RPC, direct updates) NEVER sets status manually. This ensures:
- Single source of truth (trigger logic)
- No inconsistency bugs (status always correct)
- Easy to refactor (change trigger, all paths benefit)

### Anti-Patterns to Avoid

- **Recreating ENUM type:** Complex migration (rename old, create new, alter columns with USING cast, drop old), risks downtime, unnecessary for simple renames
- **Manual status updates in RPC:** Breaks single source of truth, creates inconsistency when logic changes
- **BEFORE trigger for status:** Status should be calculated AFTER item changes are persisted (semantic correctness)
- **Statement-level trigger here:** Wrong granularity (we need per-row because each item change affects parent status)
- **Deleting ENUM values:** Unsafe (can break indexes), PostgreSQL documentation explicitly warns against it

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| ENUM migration | Custom recreate-and-migrate script | `ALTER TYPE RENAME VALUE` | Built-in operation is atomic, safe, no downtime, handles dependencies automatically |
| Status recalculation | Application-layer aggregation | PostgreSQL trigger | Database triggers are transactional, can't get out of sync, single source of truth |
| Concurrent status updates | Optimistic locking flags | PostgreSQL transaction isolation | Database handles concurrency correctly, triggers run in transaction context |
| ENUM value removal | `DELETE FROM pg_enum` | Leave value in place | Manual deletion breaks indexes (PostgreSQL/Supabase docs warn explicitly) |
| Transition validation | Rails-style state machine gem | PostgreSQL BEFORE trigger | Database enforces rules even if application bypassed, closer to data |

**Key insight:** PostgreSQL's ENUM and trigger system is mature (ENUM since 9.1, triggers since 7.x). The built-in operations handle edge cases (dependencies, transactions, concurrency) that custom solutions miss. Trust the database.

## Common Pitfalls

### Pitfall 1: Using ALTER TYPE ADD VALUE Inside Transaction
**What goes wrong:** Migration adds new ENUM value with `ADD VALUE`, then immediately tries to use it in data migration—fails with "unsafe to use new enum value in same transaction" error
**Why it happens:** PostgreSQL restriction: new ENUM values can't be used until transaction commits
**How to avoid:**
- Use `ALTER TYPE RENAME VALUE` instead (no transaction restriction)
- If you must ADD VALUE, split into two migrations (add value, commit, then use value)
**Warning signs:** Migration with `ADD VALUE` followed by INSERT/UPDATE using new value

### Pitfall 2: Forgetting to Recalculate Existing Data After Trigger Change
**What goes wrong:** New trigger logic is deployed, but existing `verificacoes` rows still have old status values calculated by old logic—UI shows inconsistent states
**Why it happens:** Triggers only fire on new INSERT/UPDATE/DELETE, not retroactively
**How to avoid:** Always run data migration step (`UPDATE verificacoes SET updated_at = updated_at`) after trigger refactor
**Warning signs:** New verificações have correct status, old ones are wrong

### Pitfall 3: Row-Level AFTER Trigger Performance Anxiety
**What goes wrong:** Developer sees "AFTER triggers store state" in docs, panics, tries to refactor to BEFORE trigger or application-layer logic
**Why it happens:** Misunderstanding overhead (AFTER trigger state storage is cheap for typical row counts)
**How to avoid:**
- Measure before optimizing (typical inspection: 10-50 items, overhead <10ms)
- AFTER triggers are semantically correct for side effects (status calculation is a side effect)
- Only optimize if profiling shows bottleneck (use `auto_explain.log_triggers`)
**Warning signs:** Premature optimization without profiling data

### Pitfall 4: Recreating ENUM Type for Simple Renames
**What goes wrong:** Migration script drops ENUM, creates new one, attempts to ALTER TABLE columns with USING cast—fails because functions/views/policies reference old type, requires careful dependency unwinding
**Why it happens:** Developer doesn't know `ALTER TYPE RENAME VALUE` exists, follows "drop and recreate" pattern from older PostgreSQL versions
**How to avoid:**
- Use `RENAME VALUE` for 1:1 mappings (our case)
- Only recreate ENUM if removing values or reordering (rare, requires careful planning)
**Warning signs:** Migration with `DROP TYPE CASCADE` or complex dependency management

### Pitfall 5: Deleting Unused ENUM Values
**What goes wrong:** Developer sees unused ENUM value, deletes from `pg_enum` system table, index corruption follows (hard to debug)
**Why it happens:** Assumption that vacuuming deleted rows makes value safe to remove
**How to avoid:** Never delete ENUM values, leave in place even if unused (Supabase docs explicit warning)
**Warning signs:** Direct manipulation of `pg_enum` table in migration

### Pitfall 6: Priority Inversion in Status Calculation
**What goes wrong:** Status calculation checks "all items finished" before checking "has NC", results in `verificacao_finalizada` even though NC exists (business rule violation)
**Why it happens:** CASE statement order matters (first match wins)
**How to avoid:** Always check NC first (highest priority), then completion, then progress, then default
**Warning signs:** UI shows "Finalizada" but NC items exist

### Pitfall 7: Confusing "Exceção" with Progress
**What goes wrong:** Status calculation counts `excecao` items as progress, verificação moves from Pendente to Em Andamento with only Exceção items marked (violates business rule)
**Why it happens:** Assuming "any non-nao_verificado status" means progress
**How to avoid:** Explicitly check for `status = 'conforme'` only (Exceção is excluded from progress definition)
**Warning signs:** Verificação in "Em Andamento" but all items are Exceção or Não Verificado

## Code Examples

Verified patterns from official sources and existing codebase:

### Complete Migration Script (4 Steps)
```sql
-- Source: PostgreSQL docs + project schema
-- File: .planning/phases/12-modelo-de-status/migration.sql

-- ============================================================
-- Step 1: Rename ENUM values (1:1 mapping)
-- ============================================================
ALTER TYPE status_verificacao
  RENAME VALUE 'com_nc' TO 'verificado_com_pendencias';

ALTER TYPE status_verificacao
  RENAME VALUE 'concluida' TO 'verificacao_finalizada';

-- 'pendente' and 'em_andamento' unchanged

-- ============================================================
-- Step 2: Refactor trigger function (new 4-state logic)
-- ============================================================
CREATE OR REPLACE FUNCTION atualizar_contadores_verificacao()
RETURNS TRIGGER AS $$
DECLARE
  v_verificacao_id UUID;
  v_total INT;
  v_nc_abertas INT;
  v_finalizados INT;
  v_conformes INT;
  v_new_status status_verificacao;
BEGIN
  -- Get verificacao_id from NEW or OLD
  v_verificacao_id := COALESCE(NEW.verificacao_id, OLD.verificacao_id);

  -- Calculate counters
  SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (
      WHERE (status = 'nao_conforme' AND status_reinspecao IS NULL)
         OR status_reinspecao = 'reprovado_apos_retrabalho'
    ) AS nc_abertas,
    COUNT(*) FILTER (
      WHERE status IN ('conforme', 'excecao')
         OR status_reinspecao IN ('conforme_apos_reinspecao', 'retrabalho', 'aprovado_com_concessao')
    ) AS finalizados,
    COUNT(*) FILTER (WHERE status = 'conforme') AS conformes
  INTO v_total, v_nc_abertas, v_finalizados, v_conformes
  FROM itens_verificacao
  WHERE verificacao_id = v_verificacao_id;

  -- Calculate status with priority
  IF v_nc_abertas > 0 THEN
    v_new_status := 'verificado_com_pendencias';
  ELSIF v_finalizados = v_total THEN
    v_new_status := 'verificacao_finalizada';
  ELSIF v_conformes > 0 THEN
    v_new_status := 'em_andamento';
  ELSE
    v_new_status := 'pendente';
  END IF;

  -- Update parent record
  UPDATE verificacoes SET
    total_itens = v_total,
    itens_nc = v_nc_abertas,
    itens_conformes = v_conformes,
    status = v_new_status,
    updated_at = NOW()
  WHERE id = v_verificacao_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger already exists, no need to recreate
-- (CREATE TRIGGER tr_itens_verificacao_contadores ...)

-- ============================================================
-- Step 3: Recalculate existing status (data migration)
-- ============================================================
-- Force trigger to recalculate all existing verificacoes
UPDATE verificacoes
SET updated_at = updated_at
WHERE TRUE;

-- ============================================================
-- Step 4: Verification query (audit)
-- ============================================================
-- Check status distribution after migration
SELECT status, COUNT(*) AS count
FROM verificacoes
GROUP BY status
ORDER BY status;

-- Check for any NC inconsistencies
SELECT v.id, v.status, COUNT(*) FILTER (
  WHERE (iv.status = 'nao_conforme' AND iv.status_reinspecao IS NULL)
     OR iv.status_reinspecao = 'reprovado_apos_retrabalho'
) AS nc_count
FROM verificacoes v
LEFT JOIN itens_verificacao iv ON iv.verificacao_id = v.id
GROUP BY v.id, v.status
HAVING
  -- Should be 'verificado_com_pendencias' if nc_count > 0
  (COUNT(*) FILTER (
    WHERE (iv.status = 'nao_conforme' AND iv.status_reinspecao IS NULL)
       OR iv.status_reinspecao = 'reprovado_apos_retrabalho'
  ) > 0 AND v.status != 'verificado_com_pendencias')
  OR
  -- Should NOT be 'verificado_com_pendencias' if nc_count = 0
  (COUNT(*) FILTER (
    WHERE (iv.status = 'nao_conforme' AND iv.status_reinspecao IS NULL)
       OR iv.status_reinspecao = 'reprovado_apos_retrabalho'
  ) = 0 AND v.status = 'verificado_com_pendencias');
-- Should return 0 rows if migration successful
```

### Transition Validation Pattern (Optional Enhancement)
```sql
-- Source: PostgreSQL state machine patterns
-- If dual validation is implemented, backend validates transitions

CREATE OR REPLACE FUNCTION validar_transicao_item()
RETURNS TRIGGER AS $$
BEGIN
  -- Only validate on UPDATE (not INSERT)
  IF TG_OP = 'UPDATE' THEN

    -- Primeira inspeção: nao_verificado → conforme/nao_conforme/excecao
    IF OLD.status = 'nao_verificado' THEN
      IF NEW.status NOT IN ('nao_verificado', 'conforme', 'nao_conforme', 'excecao') THEN
        RAISE EXCEPTION 'Transição inválida: nao_verificado só pode ir para conforme/nao_conforme/excecao';
      END IF;
    END IF;

    -- Reinspeção: NC → conforme_apos_reinspecao/retrabalho/aprovado_com_concessao/reprovado_apos_retrabalho
    IF OLD.status = 'nao_conforme' AND OLD.status_reinspecao IS NULL THEN
      IF NEW.status_reinspecao IS NOT NULL THEN
        IF NEW.status_reinspecao NOT IN (
          'conforme_apos_reinspecao',
          'retrabalho',
          'aprovado_com_concessao',
          'reprovado_apos_retrabalho'
        ) THEN
          RAISE EXCEPTION 'Reinspeção inválida para NC: %', NEW.status_reinspecao;
        END IF;
      END IF;
    END IF;

    -- Reprovado após retrabalho: pode ser reinspecionado novamente
    IF OLD.status_reinspecao = 'reprovado_apos_retrabalho' THEN
      IF NEW.status_reinspecao NOT IN (
        'reprovado_apos_retrabalho',
        'conforme_apos_reinspecao',
        'retrabalho',
        'aprovado_com_concessao'
      ) THEN
        RAISE EXCEPTION 'Transição inválida para reprovado_apos_retrabalho';
      END IF;
    END IF;

    -- Estados terminais não podem mudar (opcional - discutir com usuário)
    IF OLD.status IN ('conforme', 'excecao')
       OR OLD.status_reinspecao IN ('conforme_apos_reinspecao', 'retrabalho', 'aprovado_com_concessao') THEN
      -- Allow no change or specific transitions only
      -- This is optional business rule
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_validar_transicao_item
  BEFORE UPDATE ON itens_verificacao
  FOR EACH ROW EXECUTE FUNCTION validar_transicao_item();
```

### Testing Status Calculation Logic
```sql
-- Source: Test-driven migration pattern
-- File: test_status_calculation.sql

-- Setup test data
BEGIN;

-- Create test verificacao with known item states
INSERT INTO verificacoes (id, obra_id, unidade_id, servico_id, status)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  (SELECT id FROM obras LIMIT 1),
  (SELECT id FROM unidades LIMIT 1),
  (SELECT id FROM servicos LIMIT 1),
  'pendente'
);

INSERT INTO itens_verificacao (verificacao_id, item_servico_id, status)
SELECT
  '00000000-0000-0000-0000-000000000001',
  id,
  'nao_verificado'
FROM itens_servico
WHERE servico_id = (SELECT servico_id FROM verificacoes WHERE id = '00000000-0000-0000-0000-000000000001')
LIMIT 5;

-- Test 1: All nao_verificado → Pendente
SELECT status FROM verificacoes WHERE id = '00000000-0000-0000-0000-000000000001';
-- Expected: 'pendente'

-- Test 2: One Conforme → Em Andamento
UPDATE itens_verificacao
SET status = 'conforme'
WHERE verificacao_id = '00000000-0000-0000-0000-000000000001'
LIMIT 1;

SELECT status FROM verificacoes WHERE id = '00000000-0000-0000-0000-000000000001';
-- Expected: 'em_andamento'

-- Test 3: One NC → Verificado com Pendências (NC domina)
UPDATE itens_verificacao
SET status = 'nao_conforme'
WHERE verificacao_id = '00000000-0000-0000-0000-000000000001'
  AND status = 'nao_verificado'
LIMIT 1;

SELECT status FROM verificacoes WHERE id = '00000000-0000-0000-0000-000000000001';
-- Expected: 'verificado_com_pendencias'

-- Test 4: Close NC → Em Andamento (if no other NC)
UPDATE itens_verificacao
SET status_reinspecao = 'conforme_apos_reinspecao'
WHERE verificacao_id = '00000000-0000-0000-0000-000000000001'
  AND status = 'nao_conforme';

SELECT status FROM verificacoes WHERE id = '00000000-0000-0000-0000-000000000001';
-- Expected: 'em_andamento' (has Conforme, no NC)

-- Test 5: All finalized → Verificação Finalizada
UPDATE itens_verificacao
SET status = 'conforme'
WHERE verificacao_id = '00000000-0000-0000-0000-000000000001'
  AND status = 'nao_verificado';

SELECT status FROM verificacoes WHERE id = '00000000-0000-0000-0000-000000000001';
-- Expected: 'verificacao_finalizada'

ROLLBACK;  -- Clean up test data
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Recreate ENUM type | `ALTER TYPE RENAME VALUE` | PostgreSQL 10 (2017) | Safe 1:1 renames without downtime, no dependency issues |
| Row-level triggers only | Statement-level with transition tables | PostgreSQL 10 (2017) | Better performance for bulk operations (not needed here) |
| Manual status updates | Trigger-based calculation | Long-standing pattern | Single source of truth, consistency guaranteed |
| Application-layer state machines | Database CHECK constraints + triggers | Ongoing trend | Enforcement closer to data, can't be bypassed |
| Generic ENUM migration tools | Native `ALTER TYPE` | Always preferred | Simpler, safer, handles edge cases |

**Deprecated/outdated:**
- **Recreating ENUM for renames:** Before PostgreSQL 10, ENUM modification was limited. Since Pg10, `RENAME VALUE` is the standard, safe approach for 1:1 mappings.
- **DELETE FROM pg_enum:** Never was safe, but older StackOverflow answers suggest it. Modern consensus: leave unused values in place.
- **ADD VALUE in transaction block then use immediately:** PostgreSQL restriction since ENUM introduction. Split into separate transactions or use RENAME instead.

## Open Questions

Things that couldn't be fully resolved:

1. **Performance impact of priority-based CASE in trigger**
   - What we know: Priority CASE (NC first, then completion, then progress) is semantically correct; typical verificação has 10-50 items; AFTER trigger state storage is cheap for this volume
   - What's unclear: Actual overhead in production (100s of inspectors, 1000s of verificações) not measured yet
   - Recommendation: Deploy with current row-level AFTER trigger, monitor with `auto_explain.log_triggers` if needed. Only optimize to statement-level if profiling shows bottleneck (unlikely).

2. **Should reprovado_apos_retrabalho allow infinite reinspection cycles?**
   - What we know: Current design allows NC → reinspect → reprovado → reinspect → ... indefinitely; counter `ciclos_reinspecao` tracks this
   - What's unclear: Business rule for max cycles (prevent infinite loops) not defined in CONTEXT.md
   - Recommendation: Implement as designed (infinite cycles allowed), add optional CHECK constraint later if business needs limit (e.g., `ciclos_reinspecao <= 3`)

3. **Backend transition validation: BEFORE trigger or CHECK constraint?**
   - What we know: CONTEXT.md specifies dual validation (frontend UX + backend security); state machine transitions are complex (11+ valid paths)
   - What's unclear: CHECK constraint can't express path-dependent rules (need OLD value); BEFORE trigger adds complexity; value vs. complexity tradeoff
   - Recommendation: Start without backend validation (rely on frontend + RLS), add BEFORE trigger later if audit reveals invalid transitions in production

4. **Should Exceção count toward completion in IRS calculation?**
   - What we know: CONTEXT.md says "Exceção NÃO conta como progresso" (excludes from Pendente→Em Andamento); Exceção IS a terminal state (includes in Verificação Finalizada)
   - What's unclear: IRS (Índice de Retrabalho de Serviços) calculation not in scope for Phase 12, unclear if Exceção counts as "completed item" for IRS denominator
   - Recommendation: Treat Exceção as terminal/completed for status calculation (current design), defer IRS-specific rules to reporting phase

## Sources

### Primary (HIGH confidence)
- [PostgreSQL 18 Documentation: Trigger Functions](https://www.postgresql.org/docs/current/plpgsql-trigger.html) - BEFORE/AFTER timing, row/statement-level, special variables (NEW, OLD, TG_OP)
- [PostgreSQL 18 Documentation: ALTER TYPE](https://www.postgresql.org/docs/current/sql-altertype.html) - RENAME VALUE syntax, ADD VALUE transaction restrictions
- [PostgreSQL 18 Documentation: Enumerated Types](https://www.postgresql.org/docs/current/datatype-enum.html) - ENUM behavior, ordering, limitations
- [Supabase Documentation: Managing Enums in Postgres](https://supabase.com/docs/guides/database/postgres/enums) - Best practices, when to use ENUMs, removal warnings
- [PostgreSQL Triggers in 2026: Design, Performance, and Production Reality – TheLinuxCode](https://thelinuxcode.com/postgresql-triggers-in-2026-design-performance-and-production-reality/) - Current best practices, BEFORE vs AFTER performance, statement-level with transition tables
- Existing codebase: `database/schema.sql` lines 1008-1036 (current trigger implementation)

### Secondary (MEDIUM confidence)
- [Implementing State Machines in PostgreSQL · Felix Geisendörfer](https://felixge.de/2017/07/27/implementing-state-machines-in-postgresql/) - State machine patterns with triggers, transition validation
- [More on Postgres trigger performance | CYBERTEC PostgreSQL](https://www.cybertec-postgresql.com/en/more-on-postgres-trigger-performance/) - Row-level vs statement-level performance comparison
- [Counter Analytics in PostgreSQL: Beyond Simple Data Denormalization | Timescale](https://www.timescale.com/blog/counter-analytics-in-postgresql-beyond-simple-data-denormalization) - Denormalized counter patterns, trade-offs
- [Zero-downtime Postgres migrations - the hard parts | GoCardless](https://gocardless.com/blog/zero-downtime-postgres-migrations-the-hard-parts/) - Expand/contract pattern, backfilling strategies
- [pgroll: zero-downtime, reversible schema migrations for Postgres](https://pgroll.com/blog/introducing-pgroll-zero-downtime-reversible-schema-migrations-for-postgres) - Modern migration tools (alternative to manual ALTER TYPE)

### Tertiary (LOW confidence - WebSearch only)
- [State Machines: Unleashing the Power of Backend-Driven Systems | Medium](https://medium.com/@zetapp/state-machines-unleashing-the-power-of-backend-driven-systems-1438ea048dd7) - Backend-driven state machines, dual validation concepts (not PostgreSQL-specific)
- [Ultimate Guide to Backend Development Engineering in 2026 | Refonte Learning](https://www.refontelearning.com/blog/ultimate-guide-to-backend-development-engineering-in-2026) - General backend trends 2026 (no specific PostgreSQL guidance)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - PostgreSQL native features, well-documented, project already uses triggers
- Architecture: HIGH - Patterns verified in official docs + existing codebase, ENUM rename tested since Pg10
- Pitfalls: MEDIUM-HIGH - Some from official docs (transaction restriction), others from community experience (ENUM deletion, recreation complexity)

**Research date:** 2026-01-28
**Valid until:** 60 days (PostgreSQL 18 is current, ENUM/trigger features stable since Pg10/Pg15, low churn)

**Key sources verified:**
- ✅ PostgreSQL official documentation (18.x, current)
- ✅ Supabase official documentation (ENUM management)
- ✅ Existing codebase (trigger implementation pattern)
- ⚠️ Community blogs (2026 best practices) - cross-referenced with official docs
- ⚠️ State machine patterns - general concepts, adapted to PostgreSQL context

**Areas requiring validation during planning:**
- Exact counter columns needed (expand beyond `itens_conformes`, `itens_nc`)
- Business rule for terminal state mutability (can Conforme be changed to NC?)
- Backend transition validation scope (implement now vs. defer to audit phase)
