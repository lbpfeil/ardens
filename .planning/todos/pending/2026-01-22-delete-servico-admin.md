---
created: 2026-01-22T10:00
title: Excluir servico permanentemente (admin only)
area: biblioteca
files:
  - arden/lib/supabase/queries/servicos.ts
  - arden/app/app/biblioteca/_components/servicos-table.tsx
  - database/schema.sql
---

## Problem

Atualmente só existe arquivar (soft delete) para serviços. Admin precisa poder excluir permanentemente serviços criados por engano ou para teste.

## Solution

### Backend
- [ ] Adicionar `deleteServico(id)` em `servicos.ts`
- [ ] Verificar/ajustar FK constraints para CASCADE DELETE em:
  - `itens_servico` (ON DELETE CASCADE)
  - `obra_servicos` (ON DELETE CASCADE)
  - Futuro: `verificacoes`
- [ ] RLS policy: apenas role admin pode executar DELETE

### Frontend
- [ ] Adicionar "Excluir permanentemente" no dropdown (apenas para admin)
- [ ] Confirmação reforçada: digitar nome do serviço para confirmar
- [ ] Warning explícito: "Todas as verificações serão excluídas"

### Considerações
- Verificar se usuário logado é admin antes de mostrar opção
- Logs de auditoria para exclusões permanentes (futuro)

## Notes

- Cascade delete é seguro se usuário entende consequências
- Caso de uso: limpar FVS de teste, templates não utilizados
