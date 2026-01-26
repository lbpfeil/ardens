# Fase 7: Fundação de Dados e Server Actions - Research

**Researched:** 2026-01-26
**Domain:** Next.js 16 Server Actions + Supabase PostgreSQL RPC + RLS Performance
**Confidence:** HIGH

## Summary

This phase creates the data foundation layer for verificacoes (construction quality inspections). It involves Server Actions for CRUD operations on verificacoes and itens_verificacao, a PostgreSQL RPC function for atomic bulk operations, and optimized queries for the matrix view.

The existing codebase uses client-side queries (`lib/supabase/queries/`) that call `createClient()` from `@/lib/supabase/client`. There are NO Server Actions in the project yet. This phase introduces `'use server'` files for the first time, using `createClient()` from `@/lib/supabase/server` for server-side Supabase access. The database schema already has all necessary tables (`verificacoes`, `itens_verificacao`), enum types, triggers for counter updates, and RLS policies. No schema migrations are needed.

**Primary recommendation:** Create Server Actions in `lib/supabase/actions/verificacoes.ts` and `lib/supabase/actions/itens-verificacao.ts` using `'use server'` directive. Create the `bulk_verificar` PostgreSQL RPC function via Supabase migration. Create matrix query in `lib/supabase/queries/verificacoes.ts`. Apply initPlan pattern to RLS policies for performance.

## Standard Stack

The established libraries/tools for this domain:

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.1 | Server Actions via `'use server'` directive | Framework provides server-side execution |
| @supabase/ssr | 0.8.0 | Server-side Supabase client | Official SSR package for Next.js |
| @supabase/supabase-js | 2.90.1 | Supabase client (browser + `.rpc()`) | Official client, used for RPC calls |
| Zod | 3.25.76 | Input validation for Server Actions | Already used in `lib/validations/` |
| React | 19.2.3 | `useActionState` for action state management | Built-in hook for Server Actions |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| sonner | 2.0.7 | Toast notifications for action feedback | Error/success toasts from UI consuming actions |
| react-hook-form | 7.71.1 | Form state management | If verification forms are needed (future UI phase) |

### No New Dependencies Needed
This phase requires zero new npm packages. Everything needed is already in the project.

**Installation:** N/A - all dependencies already installed.

## Architecture Patterns

### Existing Codebase Pattern (Client-Side Queries)
```
arden/lib/supabase/
├── client.ts              # Browser client (createBrowserClient)
├── server.ts              # Server client (createServerClient)
└── queries/               # Client-side query functions (existing)
    ├── obras.ts           # import { createClient } from '@/lib/supabase/client'
    ├── servicos.ts        # All use browser client
    ├── obra-servicos.ts
    ├── itens-servico.ts
    ├── agrupamentos.ts
    ├── unidades.ts
    ├── tags.ts
    ├── servico-revisoes.ts
    └── dashboard.ts
```

**Key observation:** All existing queries use the BROWSER client (`@/lib/supabase/client`). They are called from Client Components directly. There are NO Server Actions in the project yet.

### New Pattern: Server Actions + Server Queries
```
arden/lib/supabase/
├── client.ts              # Browser client (existing - unchanged)
├── server.ts              # Server client (existing - unchanged)
├── queries/               # Existing client-side queries (unchanged)
│   └── ...
├── actions/               # NEW: Server Actions ('use server')
│   ├── verificacoes.ts    # CRUD for verificacoes
│   └── itens-verificacao.ts # CRUD for itens_verificacao
└── queries/
    └── verificacoes.ts    # NEW: Read queries (matrix data)
```

### Pattern 1: Server Action File Convention
**What:** Dedicated `'use server'` files in `lib/supabase/actions/`
**When to use:** All write operations (create, update, delete)
**Why this pattern:** Separates server-only mutation logic from client-side read queries. Follows Next.js convention and Supabase recommendation. Allows Client Components to import and call these directly.

```typescript
// lib/supabase/actions/verificacoes.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Zod schema for input validation
const criarVerificacaoSchema = z.object({
  obra_id: z.string().uuid(),
  unidade_id: z.string().uuid(),
  servico_id: z.string().uuid(),
})

export async function criarVerificacao(input: z.infer<typeof criarVerificacaoSchema>) {
  // 1. Validate input
  const parsed = criarVerificacaoSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos', details: parsed.error.flatten() }
  }

  // 2. Execute with server client
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('verificacoes')
    .insert({ ...parsed.data, status: 'pendente' })
    .select()
    .single()

  if (error) {
    return { error: `Erro ao criar verificação: ${error.message}` }
  }

  // 3. Revalidate relevant paths
  revalidatePath(`/app/obras/${parsed.data.obra_id}`)

  return { data }
}
```

### Pattern 2: Action Return Type Convention
**What:** Consistent return type for all actions `{ data?, error?, details? }`
**When to use:** Every Server Action must return this shape
**Why:** Allows UI to handle success/error uniformly

```typescript
// Standard action result type
type ActionResult<T> =
  | { data: T; error?: never }
  | { error: string; details?: unknown; data?: never }
```

### Pattern 3: RPC Call for Bulk Operations
**What:** PostgreSQL function called via `supabase.rpc()`
**When to use:** Atomic multi-row operations that need transaction guarantees

```typescript
// Calling the RPC from a Server Action
export async function bulkVerificar(input: BulkVerificarInput) {
  const supabase = await createClient()

  const { data, error } = await supabase.rpc('bulk_verificar', {
    p_obra_id: input.obra_id,
    p_resultado: input.resultado,
    p_pares: input.pares, // JSON array of {servico_id, unidade_id}
  })

  if (error) {
    return { error: `Erro na verificação em massa: ${error.message}` }
  }

  return { data }
}
```

### Pattern 4: Matrix Query with O(1) Lookup
**What:** Query that returns verificacoes as a Map keyed by `servico_id:unidade_id`
**When to use:** Matrix view needs instant lookup per cell

```typescript
// Query returns data optimized for the matrix
export async function getMatrizData(obraId: string) {
  // ... fetch servicos, agrupamentos with unidades, verificacoes
  // Build lookup map
  const verificacoesMap = new Map<string, Verificacao>()
  for (const v of verificacoes) {
    verificacoesMap.set(`${v.servico_id}:${v.unidade_id}`, v)
  }
  return { servicos, agrupamentos, verificacoesMap }
}
```

### Anti-Patterns to Avoid
- **Calling browser client from Server Actions:** Always use `createClient()` from `@/lib/supabase/server` in `'use server'` files. The browser client uses cookies differently.
- **Missing Zod validation:** Never trust input in Server Actions - always validate with Zod first. Server Actions are public endpoints.
- **Throwing errors from Server Actions:** Return `{ error }` instead. Thrown errors cause the nearest error boundary to trigger, which is usually not desired for form validation.
- **Revalidating too broadly:** Use specific paths in `revalidatePath()`, not `revalidatePath('/')`.
- **Running bulk operations without RPC:** Individual Supabase `.insert()` calls from JavaScript do NOT run in a transaction. Use PostgreSQL RPC for atomicity.

## Existing Schema Analysis

### Tables Already Created (NO migrations needed)

#### `verificacoes` table
```sql
-- Already exists in schema.sql
CREATE TABLE verificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  unidade_id UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,
  status status_verificacao DEFAULT 'pendente',
  inspetor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  data_inicio TIMESTAMPTZ,
  data_conclusao TIMESTAMPTZ,
  total_itens INT DEFAULT 0,
  itens_verificados INT DEFAULT 0,
  itens_conformes INT DEFAULT 0,
  itens_nc INT DEFAULT 0,
  itens_excecao INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(unidade_id, servico_id)  -- ONE verification per unit+service pair
);
```

**Key constraint:** `UNIQUE(unidade_id, servico_id)` means only ONE verification per service/unit pair. Bulk operations must handle ON CONFLICT.

#### `itens_verificacao` table
```sql
-- Already exists in schema.sql
CREATE TABLE itens_verificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verificacao_id UUID NOT NULL REFERENCES verificacoes(id) ON DELETE CASCADE,
  item_servico_id UUID NOT NULL REFERENCES itens_servico(id) ON DELETE RESTRICT,
  status status_inspecao DEFAULT 'nao_verificado',
  inspetor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  data_inspecao TIMESTAMPTZ,
  observacao TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  status_reinspecao status_reinspecao,
  inspetor_reinspecao_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  data_reinspecao TIMESTAMPTZ,
  observacao_reinspecao TEXT,
  ciclos_reinspecao INT DEFAULT 0,
  sync_id UUID,
  sync_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(verificacao_id, item_servico_id)  -- ONE item per verificacao+item_servico pair
);
```

### Enum Types Already Created
```sql
-- status_inspecao: nao_verificado | conforme | nao_conforme | excecao
-- status_reinspecao: conforme_apos_reinspecao | retrabalho | aprovado_com_concessao | reprovado_apos_retrabalho
-- status_verificacao: pendente | em_andamento | concluida | com_nc
```

### Trigger Already Created
```sql
-- atualizar_contadores_verificacao() trigger on itens_verificacao
-- AFTER INSERT OR UPDATE OR DELETE
-- Automatically recalculates: total_itens, itens_verificados, itens_conformes, itens_nc, itens_excecao
-- Automatically derives status: pendente | em_andamento | concluida | com_nc
```

**Critical implication:** The trigger recalculates ALL counters on EVERY insert/update/delete of itens_verificacao. For bulk operations inserting many items, this trigger fires PER ROW. The RPC function should consider temporarily disabling the trigger or doing a single final update.

### RLS Policies Already Created
Verificacoes and itens_verificacao already have RLS policies (SELECT, INSERT, UPDATE, DELETE). However, the RPC function runs as SECURITY DEFINER and bypasses RLS, so it must implement its own authorization checks.

### Related Tables for Matrix Query
- `obra_servicos` - which servicos are active in an obra
- `servicos` - servico details (nome, codigo, categoria)
- `agrupamentos` - grouping of unidades (quadras, torres)
- `unidades` - individual units within agrupamentos
- `itens_servico` - template items for each servico (needed when creating verificacao items)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Transaction atomicity | Multiple `.insert()` calls with try/catch | PostgreSQL RPC function (`plpgsql`) | PostgREST wraps RPC in transaction automatically; JS client has no transaction support |
| Counter updates | Manual counter increment after each item change | Existing `atualizar_contadores_verificacao()` trigger | Already fires on INSERT/UPDATE/DELETE of itens_verificacao |
| Status derivation | JavaScript logic to compute verificacao status | The trigger already computes it | Status is derived from item states automatically |
| Input validation | Manual `if` checks in actions | Zod schemas (already in `lib/validations/`) | Consistent with existing codebase pattern |
| UUID generation | `crypto.randomUUID()` in JavaScript | PostgreSQL `gen_random_uuid()` DEFAULT | Let the database generate IDs |
| Supabase server client | New client setup | Existing `createClient()` from `@/lib/supabase/server` | Already configured with cookie handling |

**Key insight:** The database trigger does the heavy lifting for counter/status management. Server Actions should NOT try to compute or set status/counters - just insert/update items and let the trigger handle the rest.

## Common Pitfalls

### Pitfall 1: Trigger Performance on Bulk Insert
**What goes wrong:** The `atualizar_contadores_verificacao()` trigger fires FOR EACH ROW on itens_verificacao. Inserting 100 items for a verificacao means 100 trigger executions, each doing 5 COUNT queries.
**Why it happens:** The trigger is designed for individual item updates, not bulk operations.
**How to avoid:** In the RPC function, either:
  - Option A: Disable the trigger temporarily with `ALTER TABLE itens_verificacao DISABLE TRIGGER tr_itens_verificacao_contadores` then re-enable and manually update counters once. **Requires SUPERUSER or table owner.**
  - Option B: Accept the per-row triggers (simpler, still fast for reasonable batch sizes). For a typical verificacao with 5-15 items, 5-15 trigger fires is acceptable.
  - Option C: The RPC function runs all inserts, then does one final manual counter update, overriding whatever the triggers computed (wasteful but correct).
**Recommendation:** Option B for simplicity. The trigger recalculates the entire verificacao each time, so the final state is always correct regardless of intermediate states. For bulk_verificar creating N verificacoes with M items each, total trigger fires = N*M which is acceptable for typical construction sizes (e.g., 50 verificacoes * 10 items = 500 triggers).

### Pitfall 2: RLS Bypass in RPC Functions
**What goes wrong:** RPC functions marked SECURITY DEFINER bypass all RLS policies. If authorization is not checked inside the function, any user can operate on any data.
**Why it happens:** SECURITY DEFINER runs as the function creator (usually postgres superuser).
**How to avoid:** The RPC function MUST:
  1. Accept `auth.uid()` from the session (not as a parameter)
  2. Verify the user has access to the obra via `usuario_obras`
  3. Verify the obra belongs to the user's cliente via `usuario_clientes`
**Warning signs:** Tests pass with service_role key but fail with anon key + auth.

### Pitfall 3: Conforme Immutability Not Enforced
**What goes wrong:** A Server Action allows changing a verificacao that is already "concluida" with result "Conforme".
**Why it happens:** The RLS policies don't enforce business logic immutability.
**How to avoid:** Server Actions must check: if verificacao status is 'concluida' AND all items are 'conforme', reject any update attempt. This is a business rule, not a database constraint.
**Warning signs:** Users editing completed inspections.

### Pitfall 4: Missing Itens When Creating Verificacao
**What goes wrong:** A verificacao is created but itens_verificacao rows are not populated from itens_servico.
**Why it happens:** The verificacao table doesn't auto-create items. They must be explicitly inserted based on the servico's item templates.
**How to avoid:** When creating a verificacao, ALWAYS also create itens_verificacao rows for ALL itens_servico of that servico. The bulk RPC function must do this atomically.

### Pitfall 5: UNIQUE Constraint on Bulk Insert
**What goes wrong:** Bulk insert fails because a verificacao already exists for a servico+unidade pair.
**Why it happens:** `UNIQUE(unidade_id, servico_id)` constraint on verificacoes table.
**How to avoid:** The RPC function must use `INSERT ... ON CONFLICT (unidade_id, servico_id) DO UPDATE` or check for existing records and handle according to business rules (skip if Conforme, reinspect if NC).

### Pitfall 6: Server Action Called from Wrong Client
**What goes wrong:** Server Action uses `createClient()` from browser module instead of server module.
**Why it happens:** Both files export a function named `createClient()`, easy to import wrong one.
**How to avoid:** In `'use server'` files, ALWAYS import from `@/lib/supabase/server`. Use ESLint rule or code review.

## Code Examples

### Server Action: Create Verificacao with Items
```typescript
// Source: Combines existing codebase patterns with Next.js 16 Server Actions
// File: lib/supabase/actions/verificacoes.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const criarVerificacaoSchema = z.object({
  obra_id: z.string().uuid(),
  unidade_id: z.string().uuid(),
  servico_id: z.string().uuid(),
})

type ActionResult<T> =
  | { data: T; error?: never }
  | { error: string; data?: never }

export async function criarVerificacao(
  input: z.infer<typeof criarVerificacaoSchema>
): Promise<ActionResult<{ id: string }>> {
  const parsed = criarVerificacaoSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  const supabase = await createClient()

  // 1. Create verificacao
  const { data: verificacao, error: vError } = await supabase
    .from('verificacoes')
    .insert({
      obra_id: parsed.data.obra_id,
      unidade_id: parsed.data.unidade_id,
      servico_id: parsed.data.servico_id,
      status: 'pendente',
    })
    .select('id')
    .single()

  if (vError) {
    if (vError.code === '23505') {
      return { error: 'Já existe uma verificação para este serviço/unidade' }
    }
    return { error: `Erro ao criar verificação: ${vError.message}` }
  }

  // 2. Fetch itens_servico template items
  const { data: itensServico } = await supabase
    .from('itens_servico')
    .select('id')
    .eq('servico_id', parsed.data.servico_id)
    .order('ordem', { ascending: true })

  // 3. Create itens_verificacao from template
  if (itensServico && itensServico.length > 0) {
    const itensToInsert = itensServico.map(item => ({
      verificacao_id: verificacao.id,
      item_servico_id: item.id,
      status: 'nao_verificado' as const,
    }))

    await supabase.from('itens_verificacao').insert(itensToInsert)
  }

  revalidatePath(`/app/obras/${parsed.data.obra_id}`)
  return { data: { id: verificacao.id } }
}
```

### Server Action: Update Item Status
```typescript
// File: lib/supabase/actions/itens-verificacao.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const marcarItemSchema = z.object({
  item_verificacao_id: z.string().uuid(),
  status: z.enum(['conforme', 'nao_conforme', 'excecao']),
  observacao: z.string().optional(),
})

export async function marcarItemVerificacao(
  input: z.infer<typeof marcarItemSchema>
): Promise<ActionResult<{ id: string }>> {
  const parsed = marcarItemSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  const supabase = await createClient()

  // Business rule: check if item's verificacao is locked (all items conforme)
  // ... immutability check logic here

  const { data, error } = await supabase
    .from('itens_verificacao')
    .update({
      status: parsed.data.status,
      observacao: parsed.data.observacao ?? null,
      data_inspecao: new Date().toISOString(),
    })
    .eq('id', parsed.data.item_verificacao_id)
    .select('id')
    .single()

  if (error) {
    return { error: `Erro ao marcar item: ${error.message}` }
  }

  // Trigger automatically recalculates verificacao counters + status
  return { data: { id: data.id } }
}
```

### PostgreSQL RPC: bulk_verificar
```sql
-- Migration: create_bulk_verificar_rpc
-- This function creates verificacoes + itens for multiple servico/unidade pairs atomically

CREATE OR REPLACE FUNCTION bulk_verificar(
  p_obra_id UUID,
  p_resultado TEXT,         -- 'conforme' | 'nao_conforme' | 'excecao'
  p_pares JSONB             -- [{"servico_id": "...", "unidade_id": "..."}, ...]
) RETURNS JSONB AS $$
DECLARE
  v_par JSONB;
  v_servico_id UUID;
  v_unidade_id UUID;
  v_verificacao_id UUID;
  v_existing_status TEXT;
  v_item_status TEXT;
  v_count_created INT := 0;
  v_count_skipped INT := 0;
  v_count_reinspected INT := 0;
  v_user_id UUID;
BEGIN
  -- Get authenticated user
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  -- Verify user has access to this obra
  IF NOT EXISTS (
    SELECT 1 FROM usuario_obras
    WHERE usuario_id = v_user_id AND obra_id = p_obra_id
  ) THEN
    RAISE EXCEPTION 'Usuário não tem acesso a esta obra';
  END IF;

  -- Validate resultado
  IF p_resultado NOT IN ('conforme', 'nao_conforme', 'excecao') THEN
    RAISE EXCEPTION 'Resultado inválido: %', p_resultado;
  END IF;

  -- Map resultado to item status
  v_item_status := CASE p_resultado
    WHEN 'conforme' THEN 'conforme'
    WHEN 'nao_conforme' THEN 'nao_conforme'
    WHEN 'excecao' THEN 'excecao'
  END;

  -- Process each pair
  FOR v_par IN SELECT * FROM jsonb_array_elements(p_pares)
  LOOP
    v_servico_id := (v_par->>'servico_id')::UUID;
    v_unidade_id := (v_par->>'unidade_id')::UUID;

    -- Check if verificacao already exists
    SELECT id, status INTO v_verificacao_id, v_existing_status
    FROM verificacoes
    WHERE unidade_id = v_unidade_id AND servico_id = v_servico_id;

    IF v_verificacao_id IS NOT NULL THEN
      -- Existing verificacao
      IF v_existing_status = 'concluida' THEN
        -- Skip: already completed/conforme (LOCKED)
        v_count_skipped := v_count_skipped + 1;
        CONTINUE;
      ELSIF v_existing_status = 'com_nc' THEN
        -- Reinspection flow
        -- Update items based on resultado
        -- ... reinspection logic
        v_count_reinspected := v_count_reinspected + 1;
      ELSE
        -- pendente or em_andamento: update items
        UPDATE itens_verificacao
        SET status = v_item_status::status_inspecao,
            data_inspecao = NOW(),
            inspetor_id = v_user_id
        WHERE verificacao_id = v_verificacao_id;
        v_count_created := v_count_created + 1;
      END IF;
    ELSE
      -- Create new verificacao
      INSERT INTO verificacoes (obra_id, unidade_id, servico_id, inspetor_id, data_inicio)
      VALUES (p_obra_id, v_unidade_id, v_servico_id, v_user_id, NOW())
      RETURNING id INTO v_verificacao_id;

      -- Create itens from servico template
      INSERT INTO itens_verificacao (verificacao_id, item_servico_id, status, inspetor_id, data_inspecao)
      SELECT v_verificacao_id, is2.id, v_item_status::status_inspecao, v_user_id, NOW()
      FROM itens_servico is2
      WHERE is2.servico_id = v_servico_id
      ORDER BY is2.ordem;

      v_count_created := v_count_created + 1;
    END IF;
  END LOOP;

  -- Return summary
  RETURN jsonb_build_object(
    'created', v_count_created,
    'skipped', v_count_skipped,
    'reinspected', v_count_reinspected
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Matrix Query
```typescript
// File: lib/supabase/queries/verificacoes.ts
// This is a READ query, can use browser client like existing queries

import { createClient } from '@/lib/supabase/client'

export interface MatrizData {
  servicos: MatrizServico[]
  agrupamentos: MatrizAgrupamento[]
  verificacoesMap: Record<string, MatrizVerificacao> // key: "servico_id:unidade_id"
}

export async function getMatrizData(obraId: string): Promise<MatrizData> {
  const supabase = createClient()

  // Parallel fetches for performance
  const [servicosResult, agrupamentosResult, verificacoesResult] = await Promise.all([
    // Active servicos for this obra
    supabase
      .from('obra_servicos')
      .select('servico:servicos(id, codigo, nome, categoria)')
      .eq('obra_id', obraId)
      .eq('ativo', true),

    // Agrupamentos with their unidades
    supabase
      .from('agrupamentos')
      .select('id, nome, ordem, unidades(id, nome, codigo, ordem)')
      .eq('obra_id', obraId)
      .order('ordem', { ascending: true }),

    // All verificacoes for this obra
    supabase
      .from('verificacoes')
      .select('id, unidade_id, servico_id, status, itens_conformes, itens_nc, itens_excecao, total_itens')
      .eq('obra_id', obraId),
  ])

  // Build O(1) lookup map
  const verificacoesMap: Record<string, MatrizVerificacao> = {}
  for (const v of verificacoesResult.data || []) {
    verificacoesMap[`${v.servico_id}:${v.unidade_id}`] = v
  }

  return {
    servicos: /* mapped servicos */,
    agrupamentos: /* mapped with nested unidades */,
    verificacoesMap,
  }
}
```

## RLS Performance Optimization

### initPlan Pattern for Existing Policies

The existing RLS policies call functions like `get_user_cliente_id()`, `is_admin()`, `is_admin_or_engenheiro()`, and `user_has_obra_access()` repeatedly. For bulk operations, these are evaluated PER ROW. The initPlan pattern wraps function calls in `(SELECT ...)` to cache the result per-statement.

**Current (slow for bulk):**
```sql
CREATE POLICY "verificacoes_select" ON verificacoes
  FOR SELECT USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = get_user_cliente_id()
    )
    AND (
      is_admin_or_engenheiro()
      OR inspetor_id = auth.uid()
    )
    AND user_has_obra_access(obra_id)
  );
```

**Optimized with initPlan:**
```sql
CREATE POLICY "verificacoes_select" ON verificacoes
  FOR SELECT USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
    )
    AND (
      (SELECT is_admin_or_engenheiro())
      OR inspetor_id = (SELECT auth.uid())
    )
    AND (SELECT user_has_obra_access(obra_id))
  );
```

**Note:** `user_has_obra_access(obra_id)` cannot be cached with initPlan because it depends on row data (`obra_id`). Consider replacing it with a pre-computed set: `obra_id IN (SELECT obra_id FROM usuario_obras WHERE usuario_id = (SELECT auth.uid()))`.

**Fully optimized:**
```sql
CREATE POLICY "verificacoes_select_optimized" ON verificacoes
  FOR SELECT USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
    )
    AND (
      (SELECT is_admin_or_engenheiro())
      OR inspetor_id = (SELECT auth.uid())
    )
    AND obra_id IN (
      SELECT obra_id FROM usuario_obras WHERE usuario_id = (SELECT auth.uid())
    )
  );
```

### RPC Bypasses RLS Entirely
The `bulk_verificar` function uses `SECURITY DEFINER`, meaning it runs as the function owner (postgres) and bypasses ALL RLS. The function contains its own authorization checks. This is the correct approach for bulk operations.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-side queries only | Server Actions for mutations | Next.js 13+ (stable in 14+) | Better security, Zod validation on server |
| `useActionState` (from `react-dom`) | `useActionState` (from `react`) | React 19 | Hook moved to `react` package |
| `revalidateTag()` for cache | `updateTag()` for read-your-writes | Next.js 16 | New API for immediate consistency |
| Manual transaction handling | PostgREST auto-wraps RPC in transaction | Always (Supabase) | plpgsql functions are automatically atomic |
| RLS function calls per-row | initPlan `(SELECT fn())` caching | PostgreSQL optimizer | 10-100x performance on bulk operations |

**Deprecated/outdated:**
- `useFormState` from `react-dom`: Renamed to `useActionState` in React 19. Use `useActionState` from `react`.
- N/A on client-side queries: The existing `lib/supabase/queries/` pattern remains valid for READ operations. Only WRITE operations move to Server Actions.

## What Already Exists vs What Needs to Be Created

### Already Exists (Do NOT recreate)
- `verificacoes` table with all columns and indexes
- `itens_verificacao` table with all columns and indexes
- `status_inspecao` enum (nao_verificado, conforme, nao_conforme, excecao)
- `status_reinspecao` enum (4 values)
- `status_verificacao` enum (pendente, em_andamento, concluida, com_nc)
- `atualizar_contadores_verificacao()` trigger function
- `tr_itens_verificacao_contadores` trigger
- `update_updated_at()` trigger function
- All RLS policies for verificacoes and itens_verificacao
- RLS helper functions (`get_user_cliente_id()`, `is_admin()`, etc.)
- Supabase server client (`lib/supabase/server.ts`)
- Supabase browser client (`lib/supabase/client.ts`)
- Zod validation infrastructure (`lib/validations/`)

### Needs to Be Created
1. **Server Action files** (NEW pattern for this project):
   - `lib/supabase/actions/verificacoes.ts` - CRUD operations
   - `lib/supabase/actions/itens-verificacao.ts` - Item marking
2. **PostgreSQL RPC function**:
   - `bulk_verificar` - via Supabase migration
3. **Query file**:
   - `lib/supabase/queries/verificacoes.ts` - Matrix data query
4. **Zod validation schemas**:
   - `lib/validations/verificacao.ts` - Input validation for actions
5. **TypeScript types**:
   - Interfaces for verificacao, item_verificacao, matrix data
6. **RLS optimization** (optional but recommended):
   - Updated policies with initPlan `(SELECT ...)` wrapping

## Open Questions

Things that couldn't be fully resolved:

1. **Trigger performance on bulk operations**
   - What we know: The trigger fires PER ROW. For N verificacoes * M items, that's N*M fires.
   - What's unclear: Exact performance impact for typical construction sizes (e.g., 200 units * 15 services * 10 items per service = 30,000 trigger fires).
   - Recommendation: Start with existing trigger. If performance is a problem, the RPC can disable/re-enable the trigger or do a final manual counter update. Measure first.

2. **Reinspection flow in bulk**
   - What we know: Cells with NC should enter reinspection. Conforme maps to "conforme_apos_reinspecao", NC maps to appropriate reinspection status.
   - What's unclear: Exact status_reinspecao value for "NC after reinspection" in bulk mode. The CONTEXT.md says "NC após Reinspeção, mapeado ao status mais apropriado".
   - Recommendation: Map bulk NC-on-existing-NC to `reprovado_apos_retrabalho` (the NC persists). Map bulk Conforme-on-existing-NC to `conforme_apos_reinspecao`. Increment `ciclos_reinspecao` counter.

3. **Batch size limits for bulk_verificar**
   - What we know: Supabase has default request size limits and statement timeouts.
   - What's unclear: Maximum safe batch size.
   - Recommendation: Implement a batch size limit (e.g., 500 pairs max) in the RPC function. If the UI needs more, split into multiple calls.

4. **revalidatePath scope for matrix**
   - What we know: Next.js 16 has `updateTag()` and `revalidatePath()`.
   - What's unclear: Whether the matrix page (future) will be a Server Component or Client Component, affecting cache strategy.
   - Recommendation: Use `revalidatePath()` on the obra detail path. The matrix page design will clarify this in a later phase.

## Sources

### Primary (HIGH confidence)
- **Codebase analysis** - Direct examination of:
  - `database/schema.sql` - Full schema with verificacoes tables, triggers, enums
  - `database/rls-policies.sql` - Complete RLS policy definitions
  - `arden/lib/supabase/queries/*.ts` - All 9 existing query files (pattern analysis)
  - `arden/lib/supabase/server.ts` - Server client setup
  - `arden/lib/supabase/client.ts` - Browser client setup
  - `arden/package.json` - Dependency versions confirmed

### Secondary (MEDIUM confidence)
- [Next.js 16 Docs - Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16)
- [Supabase RPC Docs](https://supabase.com/docs/reference/javascript/rpc)
- [Supabase RLS Performance Discussion](https://github.com/orgs/supabase/discussions/14576)
- [Supabase Database Functions](https://supabase.com/docs/guides/database/functions)

### Tertiary (LOW confidence)
- [DEV Community - PostgREST transactions](https://dev.to/voboda/gotcha-supabase-postgrest-rpc-with-transactions-45a7)
- [Scott Pierce - Optimizing RLS](https://scottpierce.dev/posts/optimizing-postgres-rls/)
- [Gary Austin - RLS Performance](https://github.com/GaryAustin1/RLS-Performance)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All dependencies verified in package.json, versions confirmed
- Architecture: HIGH - Based on direct codebase analysis of 9 existing query files + Next.js 16 Server Actions docs
- Schema: HIGH - Verified directly from schema.sql, including triggers and enums
- RLS: HIGH - Verified directly from rls-policies.sql
- RPC pattern: MEDIUM - Based on Supabase docs + community patterns, not yet tested
- initPlan optimization: MEDIUM - Well-documented pattern but not yet applied to this project
- Pitfalls: HIGH - Derived from codebase analysis + established PostgreSQL patterns

**Research date:** 2026-01-26
**Valid until:** 2026-02-25 (30 days - stable stack, no rapid changes expected)
