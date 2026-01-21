# Phase 5: RLS Policy Fixes

**Applied:** 2026-01-21
**Issue:** Permission errors when creating servicos, itens_servico, and obra_servicos

## Problem

The RLS policies for Phase 5 tables were incomplete:
- `servicos`: Only had SELECT policy
- `itens_servico`: Had RLS enabled but no policies
- `obra_servicos`: Had RLS enabled but no policies

## Solution

Applied 3 migrations via Supabase MCP:

### Migration 1: add_servicos_rls_policies
```sql
CREATE POLICY "admin_engenheiro_inserem_servicos" ON public.servicos FOR INSERT
CREATE POLICY "admin_engenheiro_editam_servicos" ON public.servicos FOR UPDATE
CREATE POLICY "admin_engenheiro_deletam_servicos" ON public.servicos FOR DELETE
```

### Migration 2: add_itens_servico_rls_policies
```sql
CREATE POLICY "usuarios_veem_itens_servico" ON public.itens_servico FOR SELECT
CREATE POLICY "admin_engenheiro_inserem_itens_servico" ON public.itens_servico FOR INSERT
CREATE POLICY "admin_engenheiro_editam_itens_servico" ON public.itens_servico FOR UPDATE
CREATE POLICY "admin_engenheiro_deletam_itens_servico" ON public.itens_servico FOR DELETE
```

### Migration 3: add_obra_servicos_rls_policies
```sql
CREATE POLICY "usuarios_veem_obra_servicos" ON public.obra_servicos FOR SELECT
CREATE POLICY "admin_engenheiro_inserem_obra_servicos" ON public.obra_servicos FOR INSERT
CREATE POLICY "admin_engenheiro_editam_obra_servicos" ON public.obra_servicos FOR UPDATE
CREATE POLICY "admin_engenheiro_deletam_obra_servicos" ON public.obra_servicos FOR DELETE
```

## Verification

All CRUD operations tested successfully via browser automation:
- Create servico: ✓
- Edit servico: ✓
- Create item verificacao: ✓
- Activate/deactivate servico in obra: ✓

## Pattern Used

Consistent with Phase 3 and 4 RLS patterns:
- SELECT: All users in same cliente_id
- INSERT/UPDATE/DELETE: Only admin and engenheiro roles (via `is_admin_or_engenheiro()` function)
- Cross-table validation via EXISTS subquery (itens_servico → servicos, obra_servicos → obras)
