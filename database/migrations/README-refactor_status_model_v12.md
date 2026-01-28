# Migration: refactor_status_model_v12

## Como Aplicar Esta Migration

Esta migration está localizada em: `supabase/migrations/20260128221307_refactor_status_model_v12.sql`

### Opção 1: Supabase Dashboard (Recomendado)

1. Acesse: https://supabase.com/dashboard/project/atouuwhkefrxueznedtc/sql/new
2. Cole o conteúdo do arquivo `supabase/migrations/20260128221307_refactor_status_model_v12.sql`
3. Clique em "Run" para executar
4. Verifique os resultados das queries de auditoria no final

### Opção 2: Supabase CLI com Credenciais

Se você tiver a senha do banco de dados:

```bash
npx supabase db push --db-url "postgresql://postgres.atouuwhkefrxueznedtc:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

### Opção 3: Link Local + Push

Se o projeto estiver linkado localmente:

```bash
npx supabase link --project-ref atouuwhkefrxueznedtc
npx supabase db push
```

## O Que Esta Migration Faz

1. **Renomeia valores do ENUM** `status_verificacao`:
   - `com_nc` → `verificado_com_pendencias`
   - `concluida` → `verificacao_finalizada`
   - Mantém: `pendente`, `em_andamento`

2. **Refatora trigger** `atualizar_contadores_verificacao()`:
   - Nova lógica de 4 estados com prioridade
   - NC aberta domina (verificado_com_pendencias)
   - Exceção NÃO conta como progresso
   - Todos finalizados → verificacao_finalizada

3. **Atualiza RPC** `bulk_verificar`:
   - Substitui referências aos nomes antigos de ENUM
   - Lógica permanece a mesma

4. **Recalcula dados existentes**:
   - Força trigger a recalcular status de todas as verificações
   - Garante consistência com nova lógica

5. **Atualiza RLS policy** `verificacoes_update`:
   - Substitui `concluida` por `verificacao_finalizada`

## Verificação Após Aplicar

A migration inclui queries de auditoria que exibem:

1. Distribuição de status após migração
2. Contagem de inconsistências (deve ser 0)

Se houver inconsistências, execute novamente:

```sql
UPDATE verificacoes SET updated_at = updated_at WHERE TRUE;
```

## Rollback (Se Necessário)

NÃO é possível fazer rollback de `ALTER TYPE RENAME VALUE` diretamente. Se precisar reverter:

```sql
-- Reverter nomes de ENUM (cuidado: pode quebrar se frontend já usa novos nomes)
ALTER TYPE status_verificacao RENAME VALUE 'verificado_com_pendencias' TO 'com_nc';
ALTER TYPE status_verificacao RENAME VALUE 'verificacao_finalizada' TO 'concluida';

-- Reverter trigger para versão antiga (copiar do git history de schema.sql)
```

## Arquivos Atualizados

- `database/schema.sql` - Documentação do ENUM e trigger
- `database/rls-policies.sql` - Policy verificacoes_update
- `supabase/migrations/20260128221307_refactor_status_model_v12.sql` - Migration aplicável
