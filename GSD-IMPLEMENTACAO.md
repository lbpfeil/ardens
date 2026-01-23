# GSD: Guia de Implementação de Convenções por Projeto

Este documento explica como configurar regras específicas de projeto para o GSD (Get Shit Done), garantindo que planos e execuções sigam padrões consistentes.

---

## Problema

O GSD planner e executor são agentes genéricos. Eles não conhecem automaticamente:
- Padrões de UI do projeto
- Estrutura de páginas esperada
- Convenções de código específicas
- Arquivos template a serem copiados

**Resultado:** Agentes podem criar código funcional mas inconsistente com o resto do projeto.

---

## Solução: 3 Camadas de Proteção

### Camada 1: CLAUDE.md (Raiz do Projeto)

O `CLAUDE.md` é lido por **todos** os agentes Claude, incluindo executores GSD.

**Adicione uma seção obrigatória:**

```markdown
## OBRIGATÓRIO: Novas Páginas

**Ao criar qualquer nova página em `/app/`, DEVE seguir este padrão:**

### Estrutura de Página (Server Component)

\`\`\`tsx
export default async function FeaturePage() {
  return (
    <div className="p-6 bg-background min-h-full">      {/* WRAPPER */}
      <div className="max-w-6xl mx-auto">              {/* CONTAINER */}
        <div className="mb-6">                          {/* HEADER */}
          <h1>Título</h1>
          <p>Descrição</p>
        </div>
        <FeaturePageClient initialData={data} />
      </div>
    </div>
  )
}
\`\`\`

### Página Template

**SEMPRE copiar estrutura de:** `app/[página-referência]/page.tsx`

### Checklist

- [ ] Wrapper padrão aplicado
- [ ] Header no Server Component
- [ ] Filtros de segurança nas queries
- [ ] Políticas de acesso configuradas
```

**Por que funciona:** Todo agente Claude lê CLAUDE.md antes de executar.

---

### Camada 2: .planning/CONVENTIONS.md

Arquivo específico para o **planner** com regras de como criar planos.

**Crie o arquivo:**

```markdown
# Project Conventions

Regras obrigatórias para planejamento e execução.

## Novas Páginas

**Todo plano que cria nova página DEVE incluir nos `must_haves`:**

\`\`\`yaml
must_haves:
  truths:
    - "Page wrapper uses [padrão do projeto]"
    - "Header is in Server Component, not Client"
    - "Queries include security filters"
\`\`\`

**Template obrigatório:** `app/[página-referência]/page.tsx`

## Novas Tabelas/Entidades

**Todo plano que cria nova entidade DEVE incluir tasks para:**

1. Schema/model
2. Políticas de acesso
3. Validações

## Padrões de Código

| Padrão | Arquivo Template |
|--------|------------------|
| Página de listagem | `app/[ref]/page.tsx` |
| Client component | `app/[ref]/_components/[ref]-page-client.tsx` |
| Data access | `lib/[framework]/queries/[entity].ts` |
| Validação | `lib/validations/[entity].ts` |
```

---

### Camada 3: Referência no STATE.md

O planner **sempre** lê `STATE.md`. Adicione referência ao CONVENTIONS.md:

```markdown
# Project State

## Project Reference

See: .planning/PROJECT.md
See: .planning/CONVENTIONS.md (regras obrigatórias para novas páginas/tabelas)
```

**Por que funciona:** O planner vê a referência e sabe que deve ler CONVENTIONS.md.

---

## Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                    /gsd:plan-phase N                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  gsd-planner lê STATE.md                                    │
│  → Vê referência ao CONVENTIONS.md                          │
│  → Lê CONVENTIONS.md                                        │
│  → Cria planos com must_haves obrigatórios                  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    /gsd:execute-phase N                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  gsd-executor lê CLAUDE.md                                  │
│  → Vê seção "OBRIGATÓRIO: Novas Páginas"                    │
│  → Segue template especificado                              │
│  → Aplica checklist antes de completar                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  gsd-verifier valida must_haves                             │
│  → Verifica se padrões foram seguidos                       │
│  → Falha se convenções não aplicadas                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Exemplo Real: Este Projeto (Arden FVS)

### Problema Encontrado

A página `/app/tags` foi criada sem:
- Wrapper `bg-background min-h-full`
- Header no Server Component
- Filtro `cliente_id` na query
- Políticas RLS

**Resultado:** Página com visual inconsistente e erro de fetch.

### Solução Aplicada

1. **CLAUDE.md** - Adicionada seção com template de página e checklists
2. **CONVENTIONS.md** - Criado com must_haves obrigatórios para planos
3. **STATE.md** - Adicionada referência ao CONVENTIONS.md

### Arquivos Template Definidos

| Tipo | Template |
|------|----------|
| Página de listagem | `arden/app/app/biblioteca/page.tsx` |
| Client component | `arden/app/app/biblioteca/_components/biblioteca-page-client.tsx` |
| Data access layer | `arden/lib/supabase/queries/servicos.ts` |
| Validação | `arden/lib/validations/servico.ts` |
| RLS policies | `database/rls-policies.sql` (seção SERVICOS) |

---

## Checklist: Configurando GSD em Novo Projeto

- [ ] Criar `CLAUDE.md` com seção "OBRIGATÓRIO" para padrões críticos
- [ ] Criar `.planning/CONVENTIONS.md` com regras para planner
- [ ] Adicionar referência ao CONVENTIONS.md no STATE.md
- [ ] Identificar arquivos template para cada tipo de artefato
- [ ] Documentar must_haves obrigatórios para planos de páginas/entidades

---

## Dicas

1. **Seja específico** - "Use bg-background" é melhor que "siga o padrão"
2. **Indique templates** - Caminho exato do arquivo a copiar
3. **Use checklists** - Fácil de verificar antes de completar
4. **must_haves verificáveis** - O verifier precisa conseguir checar no código

---

## Integração com MCP Tools

Se o projeto usa ferramentas MCP (Model Context Protocol) para interagir com serviços externos, documente o uso obrigatório nas convenções.

### Exemplo: Supabase MCP

Para projetos com Supabase, adicione ao CLAUDE.md:

```markdown
## OBRIGATÓRIO: Alterações no Banco de Dados

**SEMPRE use o MCP do Supabase para alterações no banco.**

| Ferramenta | Quando Usar |
|------------|-------------|
| `mcp__supabase__apply_migration` | DDL (CREATE, ALTER, DROP) |
| `mcp__supabase__execute_sql` | DML e queries de verificação |
| `mcp__supabase__list_tables` | Verificar estado atual |
| `mcp__supabase__list_migrations` | Ver histórico |

### Regras

1. **DDL** → SEMPRE usar `apply_migration` (não `execute_sql`)
2. **Documentação** → Atualizar `database/schema.sql` após migration
3. **RLS** → Adicionar policies para novas tabelas
```

E adicione ao CONVENTIONS.md para o planner:

```markdown
## Alterações de Schema

**must_haves para planos com banco:**

\`\`\`yaml
must_haves:
  truths:
    - "Migration applied via mcp__supabase__apply_migration"
    - "database/schema.sql updated to match migration"
    - "RLS policies added for new tables"
\`\`\`
```

### Outros MCPs Comuns

| MCP | Documentar Para |
|-----|-----------------|
| GitHub | Criação de PRs, issues |
| Slack | Notificações, webhooks |
| Stripe | Pagamentos, subscriptions |
| Vercel | Deploy, environment variables |

**Princípio:** Se existe um MCP para a operação, use-o em vez de código/CLI manual.

---

*Documento criado: 2026-01-23*
*Atualizado: 2026-01-23 (adicionado seção MCP)*
*Baseado em: Inconsistência detectada na fase 5.2 do projeto Arden FVS*
