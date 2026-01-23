# Project Conventions

Regras obrigatórias para planejamento e execução. Leia antes de criar planos.

## Novas Páginas

**Todo plano que cria nova página DEVE incluir nos `must_haves`:**

```yaml
must_haves:
  truths:
    - "Page wrapper uses bg-background min-h-full pattern"
    - "Header (h1 + description) is in Server Component, not Client"
    - "Server-side queries filter by cliente_id"
```

**Template obrigatório:** `arden/app/app/biblioteca/page.tsx`

## Novas Tabelas

**Todo plano que cria nova tabela DEVE incluir tasks para:**

1. Schema em `database/schema.sql`
2. `ENABLE ROW LEVEL SECURITY` no schema
3. Políticas RLS em `database/rls-policies.sql`

## Padrões de Código

| Padrão | Arquivo Template | Quando Usar |
|--------|------------------|-------------|
| Página de listagem | `arden/app/app/biblioteca/page.tsx` | Toda página nova |
| Client component | `arden/app/app/biblioteca/_components/biblioteca-page-client.tsx` | Páginas com state |
| Data access layer | `arden/lib/supabase/queries/servicos.ts` | Novo CRUD |
| Validação | `arden/lib/validations/servico.ts` | Novo form schema |

## Verificação Obrigatória

Antes de marcar plano como completo, executor DEVE verificar:

1. **UI consistente** - Comparar visualmente com página existente similar
2. **Fetch funciona** - Página carrega sem erros no console
3. **RLS aplicado** - Queries retornam apenas dados do cliente

## Decisões Acumuladas

Ver `STATE.md` seção "Decisions" para padrões já estabelecidos.

---
*Criado: 2026-01-23*
*Motivo: Garantir consistência entre páginas após inconsistência na página de Tags*
