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

## Novas Tabelas / Alterações de Schema

**OBRIGATÓRIO: Usar MCP Supabase para alterações no banco.**

### Tasks obrigatórias em planos com alteração de banco:

```yaml
tasks:
  - name: "Apply migration for [descrição]"
    action: "Use mcp__supabase__apply_migration"
    details: |
      - name: "[snake_case_descritivo]"
      - query: "[SQL DDL]"

  - name: "Update schema documentation"
    action: "Edit database/schema.sql to reflect changes"

  - name: "Add RLS policies"
    action: "Edit database/rls-policies.sql with new policies"
    condition: "If new table created"
```

### must_haves para planos com banco:

```yaml
must_haves:
  truths:
    - "Migration applied via mcp__supabase__apply_migration"
    - "database/schema.sql updated to match migration"
    - "RLS policies added for new tables"
```

### Ferramentas MCP Supabase

| Ferramenta | Usar Para |
|------------|-----------|
| `mcp__supabase__apply_migration` | DDL (CREATE, ALTER, DROP) |
| `mcp__supabase__execute_sql` | DML e queries de verificação |
| `mcp__supabase__list_tables` | Verificar estado atual |
| `mcp__supabase__list_migrations` | Ver histórico |

### NUNCA fazer:

- Editar `database/schema.sql` sem aplicar migration via MCP
- Usar `execute_sql` para DDL (usar `apply_migration`)
- Criar tabela sem RLS policies

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
