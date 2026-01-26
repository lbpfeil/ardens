# CLAUDE.md - Arden FVS

> Contexto para agentes de IA trabalhando neste projeto.

## O que e este projeto

**Arden FVS** e uma plataforma SaaS para gestao de qualidade na construcao civil, focada em verificacoes de servicos (FVS) para certificacao PBQP-H.

**Missao:** Trazer extrema rapidez e praticidade na verificacao de servicos, tornando a qualidade uma aliada da obra.

**Publico-alvo:** Construtoras pequenas/medias (4-1000 unidades) com certificacao PBQP-H.

---

## Stack Tecnica

| Camada | Tecnologia |
|--------|------------|
| **Backend** | Supabase (PostgreSQL + RLS + Edge Functions) |
| **Web** | Next.js 16+ (App Router) + React 19 |
| **Mobile** | Expo (React Native) - futuro |
| **UI** | shadcn/ui + Tailwind CSS 4 + Radix UI |
| **Estado** | Zustand |
| **Forms** | React Hook Form + Zod |
| **Graficos** | Recharts |
| **PDF** | Google Cloud Functions + Puppeteer |
| **Email** | Resend |
| **Monitoramento** | Sentry |

---

## Estrutura do Projeto

```
ardens/
├── arden/                    # App Next.js (portal web)
│   ├── app/                  # App Router pages
│   ├── components/ui/        # Componentes shadcn (SSOT)
│   └── lib/supabase/         # Cliente Supabase
├── docs/                     # Documentacao completa
│   ├── 00_INDEX.md           # Indice geral (comece aqui)
│   ├── product/              # PRD fragmentado
│   ├── tech/                 # Documentacao tecnica
│   ├── design/               # Design system
│   └── process/              # Decisoes e glossario
└── database/                 # Schema SQL e RLS
```

---

## Documentacao Essencial

### Antes de Qualquer Tarefa

| Documento | Quando Consultar |
|-----------|------------------|
| `docs/00_INDEX.md` | Mapa geral da documentacao |
| `docs/product/01_OVERVIEW.md` | Entender o produto |
| `docs/design/README.md` | **OBRIGATORIO** antes de modificar UI |
| `docs/design/DESIGN-SYSTEM.md` | Tokens, componentes, padroes |

### Por Tema

| Tema | Documento |
|------|-----------|
| Navegacao/Layouts | `docs/product/04_NAVIGATION.md` |
| Entidades/Dominio | `docs/product/05_DOMAIN_MODEL.md` |
| Arquitetura | `docs/tech/01_ARCHITECTURE.md` |
| Database Schema | `database/schema.sql` |
| Politicas RLS | `database/rls-policies.sql` |
| Decisoes Tomadas | `docs/process/DECISIONS.md` |
| Roadmap | `docs/product/10_ROADMAP.md` |

---

## OBRIGATÓRIO: Alterações no Banco de Dados

**SEMPRE use o MCP do Supabase para alterações no banco de dados.**

### Ferramentas Disponíveis (MCP Supabase)

| Ferramenta | Quando Usar |
|------------|-------------|
| `mcp__supabase__list_tables` | Ver tabelas existentes |
| `mcp__supabase__list_extensions` | Ver extensões habilitadas |
| `mcp__supabase__list_migrations` | Ver histórico de migrations |
| `mcp__supabase__apply_migration` | **Aplicar DDL (CREATE, ALTER, DROP)** |
| `mcp__supabase__execute_sql` | Queries de leitura ou DML simples |

### Regras de Uso

1. **DDL (schema changes)** → SEMPRE usar `apply_migration`
   - CREATE TABLE, ALTER TABLE, DROP TABLE
   - CREATE INDEX, CREATE POLICY
   - Qualquer mudança estrutural

2. **DML (data changes)** → Usar `execute_sql`
   - INSERT, UPDATE, DELETE
   - SELECT para debug/verificação

3. **Nunca editar diretamente** `database/schema.sql` sem aplicar via MCP
   - O arquivo é documentação, não fonte de verdade
   - A fonte de verdade é o banco via migrations

### Fluxo de Alteração de Schema

```
1. Verificar estado atual
   → mcp__supabase__list_tables
   → mcp__supabase__list_migrations

2. Aplicar migration
   → mcp__supabase__apply_migration
     - name: "add_campo_x_to_tabela_y"
     - query: "ALTER TABLE..."

3. Atualizar documentação
   → Editar database/schema.sql para refletir mudança
   → Editar database/rls-policies.sql se necessário

4. Verificar aplicação
   → mcp__supabase__execute_sql (SELECT para confirmar)
```

### Exemplo de Migration

```
mcp__supabase__apply_migration(
  project_id: "seu-project-id",
  name: "add_ordem_to_tags",
  query: "ALTER TABLE tags ADD COLUMN ordem INTEGER DEFAULT 0;"
)
```

### Checklist Alteração de Banco

- [ ] Verificou migrations existentes antes de criar nova?
- [ ] Usou `apply_migration` para DDL (não `execute_sql`)?
- [ ] Nome da migration é descritivo em snake_case?
- [ ] Atualizou `database/schema.sql` após aplicar?
- [ ] Adicionou RLS policies se criou nova tabela?

---

## Regras de Desenvolvimento UI

### OBRIGATORIO

1. **Consulte `docs/design/README.md`** antes de qualquer mudanca visual
2. **Use APENAS componentes shadcn existentes** em `arden/components/ui/`
3. **Use variaveis CSS do `globals.css`** - nunca valores hardcoded

### Componentes Disponiveis

```
arden/components/ui/
├── alert-dialog.tsx
├── badge.tsx
├── button.tsx
├── card.tsx
├── combobox.tsx
├── dropdown-menu.tsx
├── field.tsx
├── input.tsx
├── input-group.tsx
├── label.tsx
├── list-page-toolbar.tsx    # Toolbar para paginas de listagem
├── select.tsx
├── separator.tsx
├── sortable-table-header.tsx # Headers ordenaveis para tabelas
├── table.tsx
└── textarea.tsx
```

### Paginas de Listagem (Padrao Obrigatorio)

Para paginas que listam entidades (obras, servicos, etc), usar:

1. **ListPageToolbar** - Toolbar com busca, tabs de status, botao de acao
2. **SortableTableHeader** - Headers ordenaveis (icone no hover)

Ver `docs/design/DESIGN-SYSTEM.md` secao "List Page Components" para uso completo.

### Variaveis CSS Principais

```css
/* Backgrounds */
bg-background        /* Shell: #1C1C1C */
bg-surface-100       /* Containers: #232323 */
bg-surface-200       /* Hover/Selection */
bg-overlay           /* Dropdowns/Modais */

/* Texto */
text-foreground      /* Texto principal */
text-foreground-light    /* Texto secundario */
text-foreground-lighter  /* Metadata */
text-foreground-muted    /* Texto sutil */

/* Bordas */
border-border        /* Borda padrao */
border-strong        /* Borda enfatizada */
border-overlay       /* Borda em overlays */

/* Brand (Verde Supabase) */
bg-brand             /* Botoes primarios */
text-brand           /* Texto brand */
text-brand-link      /* Links */

/* Estados */
bg-destructive       /* Erro/Perigo */
bg-warning           /* Alerta */
```

### Se Precisar de Novo Componente

**PARE e pergunte ao usuario antes de criar.** Descreva:
- O que precisa
- Por que os componentes existentes nao atendem
- Proposta de implementacao

---

## Comandos Uteis

```bash
# Desenvolvimento
cd arden && npm run dev      # Inicia servidor dev (localhost:3000)
cd arden && npm run build    # Build de producao
cd arden && npm run lint     # Verifica lint

# Supabase (quando configurado)
npx supabase start           # Inicia Supabase local
npx supabase db push         # Aplica migrations
npx supabase gen types       # Gera tipos TypeScript
```

---

## IMPORTANTE: Deteccao de Padroes Duplicados

**Ao implementar qualquer feature, SEMPRE verifique:**

1. **O padrao ja existe em outro lugar?** Busque implementacoes similares no codebase
2. **Estou duplicando codigo?** Se sim, considere criar componente reutilizavel
3. **Ha inconsistencias visuais?** Compare com paginas semelhantes

**Se detectar duplicacao ou inconsistencia:**
- PARE e informe o usuario antes de continuar
- Liste os arquivos afetados
- Proponha criacao de componente compartilhado
- Aguarde aprovacao antes de implementar

**Padroes comuns que devem ser componentes:**

| Padrao | Componente | Quando Usar |
|--------|------------|-------------|
| Empty states | `EmptyState` | Listas/tabelas vazias |
| Dialogs de confirmacao | `ConfirmationDialog` | Arquivar/excluir/restaurar |
| Modais de formulario | `FormModal` | Criar/editar entidades |
| Menu de acoes | `RowActionsMenu` | Dropdown com Editar/Arquivar |
| Headers de pagina | `PageHeader` | Titulo + descricao de pagina |
| Headers de painel | `PanelHeader` | Titulo + acoes de secao |
| Toolbar de listagem | `ListPageToolbar` | Busca + filtros + acao |
| Headers ordenaveis | `SortableTableHeader` | Colunas de tabela |

---

## Checklist Antes de Implementar

- [ ] Li a documentacao relevante para a tarefa?
- [ ] A UI segue o design system (`docs/design/DESIGN-SYSTEM.md`)?
- [ ] Estou usando componentes existentes (`arden/components/ui/`)?
- [ ] Estou usando variaveis CSS (nao valores hardcoded)?
- [ ] Se criei algo novo, pedi permissao ao usuario?
- [ ] **Verifiquei se ha padroes duplicados no codebase?**

---

## OBRIGATÓRIO: Novas Páginas

**Ao criar qualquer nova página em `/app/app/`, DEVE seguir este padrão:**

### 1. Estrutura de Página (Server Component)

```tsx
// arden/app/app/{feature}/page.tsx
export default async function FeaturePage() {
  const supabase = await createClient()

  // Fetch com filtro de cliente
  const { data, error } = await supabase
    .from('tabela')
    .select('*')
    .eq('cliente_id', DEV_CLIENTE_ID)  // SEMPRE filtrar

  return (
    <div className="p-6 bg-background min-h-full">      {/* WRAPPER OBRIGATÓRIO */}
      <div className="max-w-6xl mx-auto">              {/* CONTAINER CENTRALIZADO */}
        <div className="mb-6">                          {/* HEADER */}
          <h1 className="text-2xl font-normal text-foreground">Título</h1>
          <p className="text-sm text-foreground-light mt-1">Descrição</p>
        </div>
        <FeaturePageClient initialData={data || []} />
      </div>
    </div>
  )
}
```

### 2. Página Template

**SEMPRE copiar estrutura de:** `arden/app/app/biblioteca/page.tsx`

### 3. Checklist Nova Página

- [ ] Wrapper `bg-background min-h-full` no page.tsx
- [ ] Header (h1 + descrição) no Server Component
- [ ] Filtro `cliente_id` nas queries server-side
- [ ] RLS policies adicionadas em `database/rls-policies.sql`
- [ ] Constante `DEV_CLIENTE_ID` importada/declarada

### 4. Checklist Nova Tabela

Ao criar nova tabela no banco:

- [ ] Schema adicionado em `database/schema.sql`
- [ ] `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` incluído
- [ ] Políticas RLS em `database/rls-policies.sql` (SELECT, INSERT, UPDATE, DELETE)

---

## IMPORTANTE: Atualizacao de Documentacao

**Sempre recomende ao usuario atualizar a documentacao quando:**

1. **Novas decisoes forem tomadas** -> `docs/process/DECISIONS.md`
2. **Features forem implementadas** -> Atualizar roadmap ou doc relevante
3. **Novos componentes forem criados** -> `docs/design/DESIGN-SYSTEM.md`
4. **Schema do banco mudar** -> `database/schema.sql`
5. **Questoes forem resolvidas** -> Remover de `docs/process/OPEN_QUESTIONS.md`

**Formato sugerido para decisoes:**

```markdown
### [YYYY-MM] Titulo da Decisao

**Contexto:** Por que essa decisao foi necessaria
**Decisao:** O que foi decidido
**Alternativas:** O que foi considerado e descartado
**Impacto:** O que muda com essa decisao
```

---

## OBRIGATÓRIO: Português Brasileiro com Acentuação Correta

**TODO texto em português DEVE usar acentuação correta, sem exceção.**

Isso vale para QUALQUER contexto:
- Código-fonte (labels, placeholders, mensagens, toasts, empty states)
- Arquivos de documentação (`.md`, comentários, READMEs)
- Arquivos de planning (`.planning/`, roadmaps, requirements, state)
- Commits e mensagens git
- Comunicação com o usuário no chat

**Exemplos corretos:**
- "Descrição da mudança" ✓
- "Código do serviço" ✓
- "Não há itens cadastrados" ✓
- "Gestão de obras" ✓
- "Navegação contextual" ✓
- "Verificações pendentes" ✓

**Exemplos incorretos:**
- "Descricao da mudanca" ✗
- "Codigo do servico" ✗
- "Gestao de obras" ✗
- "Navegacao contextual" ✗

**Não existe contexto onde omitir acentos seja aceitável ao escrever em português.**

---

## Convencoes de Codigo

### TypeScript
- Tipagem estrita sempre
- Interfaces sobre types para objetos
- Zod para validacao de forms

### React
- Function components apenas
- Hooks customizados em `lib/hooks/`
- Sem prop drilling - use Zustand para estado global

### Tailwind
- Mobile-first (sm: md: lg: xl:)
- Preferir composicao inline
- Evitar abstracoes desnecessarias (nao criar HeroSection.tsx)

### Git
- Commits em portugues
- Formato: `tipo: descricao` (feat:, fix:, docs:, style:, refactor:)

---

## Contexto de Negocio

### Personas Principais

| Persona | Responsabilidade |
|---------|------------------|
| **Engenheiro** | Configura obras, define servicos, analisa relatorios |
| **Inspetor** | Executa verificacoes no campo (app mobile) |
| **Almoxarife** | Libera materiais com base em Condicoes de Inicio |
| **Admin** | Gerencia construtora, usuarios, configuracoes |

### Fluxo Core

```
Engenheiro configura obra
    ↓
Engenheiro define servicos FVS por unidade
    ↓
Inspetor executa verificacoes no app (offline-first)
    ↓
Sistema sincroniza quando online
    ↓
Engenheiro analisa relatorios/dashboards
    ↓
Auditor PBQP-H valida documentacao
```

---

## Links Rapidos

- **Indice Docs:** `docs/00_INDEX.md`
- **Design System:** `docs/design/DESIGN-SYSTEM.md`
- **Regras UI:** `docs/design/README.md`
- **Decisoes:** `docs/process/DECISIONS.md`
- **Roadmap:** `docs/product/10_ROADMAP.md`

---

*Atualizado em: 2026-01-23*
