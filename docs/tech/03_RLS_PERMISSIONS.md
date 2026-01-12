# Permissoes e RLS - ARDEN FVS

## SSOT

O arquivo **`database/rls-policies.sql`** e a fonte de verdade das politicas RLS.

---

## Filosofia

Toda seguranca de dados e implementada no nivel do banco (PostgreSQL RLS), nao na aplicacao. Isso garante que mesmo com bugs no codigo, os dados ficam protegidos.

---

## Matriz de Permissoes

### Visao Geral por Perfil

| Recurso | Admin | Engenheiro | Inspetor | Almoxarife |
|---------|-------|------------|----------|------------|
| Portal Web | Completo | Obras dele | Nao | Simplificado |
| App Mobile | Nao | Sim | Sim | Nao |
| Visao Global | Sim | Nao | Nao | Nao |

### Permissoes Detalhadas

| Acao | Admin | Engenheiro | Inspetor |
|------|-------|------------|----------|
| **CLIENTES** |
| Editar dados da construtora | Sim | Nao | Nao |
| Ver plano/faturamento | Sim | Nao | Nao |
| **USUARIOS** |
| Criar/convidar usuarios | Sim | Nao | Nao |
| Editar perfil de outros | Sim | Nao | Nao |
| Remover usuarios | Sim | Nao | Nao |
| Editar proprio perfil | Sim | Sim | Sim |
| **OBRAS** |
| Criar obras | Sim | Nao | Nao |
| Editar obras | Sim | Nao | Nao |
| Excluir obras | Sim | Nao | Nao |
| Ver todas obras | Sim | So atribuidas | So atribuidas |
| **BIBLIOTECA FVS** |
| Criar servicos | Sim | Nao | Nao |
| Editar servicos | Sim | Nao | Nao |
| Arquivar servicos | Sim | Nao | Nao |
| Adicionar servico a obra | Sim | Sim | Nao |
| **VERIFICACOES** |
| Criar verificacoes | Sim | Sim | Sim |
| Ver verificacoes (obra) | Todas | Todas | So dele |
| Editar verificacoes concluidas | Sim | Nao | Nao |
| Excluir verificacoes | Sim | Nao | Nao |
| **RELATORIOS** |
| Gerar relatorios | Sim | Sim | Nao |
| Configurar agendamentos | Sim | Nao | Nao |
| **AUDITORIA** |
| Ver logs de auditoria | Sim | Nao | Nao |

---

## Super Admin (Equipe Arden)

| Acao | Permitido | Observacao |
|------|-----------|------------|
| Criar/suspender contas | Sim | Via dashboard interno |
| Acessar conta de cliente | Sim | Log automatico obrigatorio |
| Alterar dados de verificacao | **NAO** | Compliance - nunca permitido |
| Ver logs de auditoria | Sim | Todas as contas |
| Gerenciar templates FVS | Sim | Biblioteca global |

---

## Funcoes Auxiliares SQL

```sql
-- Retorna cliente_id do usuario atual
get_user_cliente_id() -> UUID

-- Retorna perfil do usuario no cliente atual
get_user_perfil() -> perfil_usuario

-- Verifica acesso a obra especifica
user_has_obra_access(obra_id) -> BOOLEAN

-- Atalhos
is_admin() -> BOOLEAN
is_admin_or_engenheiro() -> BOOLEAN
```

---

## Regras RLS por Tabela

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| `clientes` | Seus clientes | - | Admin | - |
| `usuarios` | Mesmo cliente | - | Proprio | - |
| `obras` | Admin: todas / Outros: atribuidas | Admin | Admin | Admin |
| `servicos` | Todos do cliente | Admin | Admin | Admin |
| `obra_servicos` | Acesso a obra | Admin/Eng | - | Admin/Eng |
| `verificacoes` | Admin/Eng: todas / Insp: proprias | Todos | Admin: todas / Outros: proprias | Admin |
| `itens_verificacao` | Segue verificacao | Todos | Admin: todas / Outros: proprias | Admin |
| `notificacoes` | Proprias | Sistema | Proprias (lida) | Sistema |
| `audit_log` | Admin | Sistema | - | - |

---

## Autenticacao

### Estrategia

| Aspecto | Decisao |
|---------|---------|
| Provider | Supabase Auth |
| Metodo primario | Email + Senha |
| Tokens | JWT (gerenciado pelo Supabase) |
| Duracao sessao | 30 dias de inatividade |
| Refresh token | Automatico pelo Supabase |

### Fluxos

**Login:**
1. Usuario informa email + senha
2. Supabase valida e retorna JWT
3. JWT armazenado no cliente
4. Requisicoes incluem JWT no header Authorization

**Recuperacao de senha:**
1. Usuario solicita reset
2. Email com magic link
3. Define nova senha
4. Sessoes anteriores invalidadas

### Roadmap

| Feature | Fase |
|---------|------|
| Email + Senha | MVP |
| Recuperacao senha | MVP |
| 2FA (TOTP) | Fase 2 |
| SSO Google | Fase 2 |
| SSO Microsoft | Fase 2 |

---

## Auditoria

### Eventos Logados (Criticos)

| Evento | Dados Capturados |
|--------|------------------|
| Excluir verificacao | usuario_id, verificacao_id, dados completos |
| Editar verificacao concluida | usuario_id, antes/depois |
| Excluir usuario | admin_id, usuario_excluido_id |
| Alterar permissoes | admin_id, perfil anterior/novo |
| Super Admin acessou conta | super_admin_id, cliente_id, timestamp |

### Estrutura do Log

```sql
audit_log (
  id UUID,
  usuario_id UUID,
  cliente_id UUID,
  obra_id UUID,
  tabela VARCHAR,
  operacao VARCHAR,
  registro_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ
)
```

### Retencao

- **Periodo:** Mesmo da conta (ativo + 90 dias apos cancelamento)
- **Acesso:** Apenas Admin do cliente
- **Imutabilidade:** Logs nao podem ser editados via app

---

## Checklist de Seguranca

### MVP
- [x] RLS em todas tabelas
- [x] Autenticacao via Supabase Auth
- [x] HTTPS obrigatorio
- [x] Senhas com bcrypt
- [x] JWT com expiracao
- [x] Logs de acoes criticas

### Fase 2
- [ ] 2FA opcional
- [ ] SSO (Google/Microsoft)
- [ ] Triggers automaticos de auditoria
- [ ] Dashboard de logs para Admin

---

## Referencias

- Politicas SQL: `database/rls-policies.sql`
- LGPD e compliance: [08_SECURITY_LGPD.md](08_SECURITY_LGPD.md)
