# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

> **Ver tambem:** `CLAUDE.md` para contexto completo de agentes IA.

---

## 1. Repository overview

**Arden FVS** e uma plataforma SaaS para gestao de qualidade na construcao civil, focada em verificacoes de servicos (FVS) para certificacao PBQP-H.

### Documentation Structure

```
ardens/
├── arden/                    # App Next.js (portal web)
│   ├── app/                  # App Router pages
│   ├── components/ui/        # Componentes shadcn (SSOT)
│   └── lib/supabase/         # Cliente Supabase
├── docs/                     # Documentacao completa
│   ├── 00_INDEX.md           # Indice geral (START HERE)
│   ├── product/              # PRD fragmentado (10 files)
│   ├── tech/                 # Technical specs (8 files)
│   ├── design/               # Design system references
│   └── process/              # Decisions, open questions, glossary
└── database/                 # Schema SQL e RLS
```

### Key Files

| File | Purpose |
|------|---------|
| `docs/00_INDEX.md` | **Main documentation index** |
| `docs/design/DESIGN-SYSTEM.md` | **SSOT** for UI/UX patterns |
| `docs/design/README.md` | **OBRIGATORIO** antes de modificar UI |
| `database/schema.sql` | **SSOT** for database schema |
| `database/rls-policies.sql` | **SSOT** for RLS policies |
| `CLAUDE.md` | Contexto completo para agentes IA |

### When you start working in this repo:

1. **Read `docs/00_INDEX.md`** for the documentation map
2. **Read `docs/product/01_OVERVIEW.md`** for product vision
3. **Read `docs/design/README.md`** before any UI changes
4. **Use `docs/product/`** for feature requirements and flows
5. **Use `docs/tech/`** for technical implementation details

---

## 2. Regras de Desenvolvimento UI (OBRIGATORIO)

### Regras Irrevogaveis

1. **Consulte `docs/design/README.md`** antes de qualquer mudanca visual
2. **Use APENAS componentes shadcn existentes** em `arden/components/ui/`
3. **Use variaveis CSS do `globals.css`** - nunca valores hardcoded
4. **Se precisar de novo componente: PARE e pergunte ao usuario**

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
├── select.tsx
├── separator.tsx
└── textarea.tsx
```

### Variaveis CSS Principais

```css
/* Backgrounds */
bg-background        /* Shell: #1C1C1C */
bg-surface-100       /* Containers: #232323 */
bg-surface-200       /* Hover/Selection */
bg-overlay           /* Dropdowns/Modais */

/* Texto */
text-foreground          /* Texto principal */
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

---

## 3. IMPORTANTE: Atualizacao de Documentacao

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

## 4. High-level architecture

### 4.1 Stack Tecnica

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

### 4.2 Core domain model

From `docs/product/05_DOMAIN_MODEL.md`, the core concepts are:

- **Cliente / Construtora** (tenant)
- **Obra** (project / site)
- **Agrupamento** (group within obra – e.g., Quadra, Torre, Pavimento)
- **Unidade** (house/apartment within agrupamento)
- **Servico (FVS)** – service with a checklist of items
- **Item de verificacao** – atomic checklist item (observacao, metodo, tolerancia)
- **Verificacao** – inspection of a single servico in a single unidade
- **NC (Nao-Conformidade)** – issue attached to an item
- **Condicoes de Inicio (CI)** – dependencies between servicos

Important:

- **Granularity is at item level**, not service level
- Status models and IRS formula are in `docs/product/05_DOMAIN_MODEL.md`

### 4.3 Data & backend – Supabase-first

See `docs/tech/01_ARCHITECTURE.md` for full details.

**Key principles:**
- **No separate Node/Express backend**
- 90%+ of CRUD via Supabase client libraries with RLS
- Edge Functions for emails, image processing, scheduled jobs
- **GCP Cloud Functions + Puppeteer** for PDF generation

### 4.4 Offline sync model (Mobile only)

See `docs/tech/04_OFFLINE_SYNC.md` for full details.

**Key rules:**
- **Conflict strategy: first write wins**
- **Granularity:** item level, not service level
- **Local schema:** SQLite tables for obras, unidades, servicos, verificacoes, offline queue

---

## 5. Development & commands

### 5.1 Web / Next.js app

```bash
cd arden && npm run dev      # Dev server (localhost:3000)
cd arden && npm run build    # Production build
cd arden && npm run lint     # Lint
```

### 5.2 Supabase

```bash
npx supabase start           # Local dev
npx supabase db push         # Push migrations
npx supabase gen types       # Generate TypeScript types
npx supabase functions deploy <name>  # Deploy Edge Functions
```

### 5.3 Mobile / Expo (futuro)

```bash
npx expo start               # Start Metro bundler
npx expo start --android     # Run on Android
npx eas build --platform android  # Build with EAS
```

---

## 6. Implementation rules for agents

### 6.1 Global architectural rules

- **Supabase-first backend:** No ad-hoc Node/Express server
- **Multi-tenancy via RLS:** `cliente_id` on all relevant tables
- **TypeScript everywhere:** No plain JavaScript

### 6.2 Web portal conventions

- **Routing:** Next.js App Router, follow `docs/product/04_NAVIGATION.md`
- **State:** Zustand only (no Redux, no Context API for global state)
- **Design:** Follow `docs/design/DESIGN-SYSTEM.md` patterns
- **Forms:** React Hook Form + Zod

### 6.3 Code conventions

**TypeScript:**
- Tipagem estrita sempre
- Interfaces sobre types para objetos
- Zod para validacao de forms

**React:**
- Function components apenas
- Hooks customizados em `lib/hooks/`
- Sem prop drilling - use Zustand para estado global

**Tailwind:**
- Mobile-first (sm: md: lg: xl:)
- Preferir composicao inline
- Evitar abstracoes desnecessarias (nao criar HeroSection.tsx)

**Git:**
- Commits em portugues
- Formato: `tipo: descricao` (feat:, fix:, docs:, style:, refactor:)

### 6.4 Checklist antes de implementar

- [ ] Li a documentacao relevante para a tarefa?
- [ ] A UI segue o design system (`docs/design/DESIGN-SYSTEM.md`)?
- [ ] Estou usando componentes existentes (`arden/components/ui/`)?
- [ ] Estou usando variaveis CSS (nao valores hardcoded)?
- [ ] Se criei algo novo, pedi permissao ao usuario?

---

## 7. Document hierarchy

| Topic | Primary Document |
|-------|------------------|
| Domain model | `docs/product/05_DOMAIN_MODEL.md` |
| Navigation | `docs/product/04_NAVIGATION.md` |
| Web portal | `docs/product/07_WEB_PORTAL.md` |
| Mobile app | `docs/product/06_MOBILE_APP.md` |
| Reports | `docs/product/09_REPORTS.md` |
| Architecture | `docs/tech/01_ARCHITECTURE.md` |
| Database | `docs/tech/02_DATABASE.md` + `database/schema.sql` |
| Permissions | `docs/tech/03_RLS_PERMISSIONS.md` |
| Offline sync | `docs/tech/04_OFFLINE_SYNC.md` |
| UI/UX | `docs/design/DESIGN-SYSTEM.md` |
| Glossary | `docs/process/GLOSSARY.md` |
| Decisions | `docs/process/DECISIONS.md` |

---

## 8. Links Rapidos

- **Contexto IA Completo:** `CLAUDE.md`
- **Indice Docs:** `docs/00_INDEX.md`
- **Design System:** `docs/design/DESIGN-SYSTEM.md`
- **Regras UI:** `docs/design/README.md`
- **Decisoes:** `docs/process/DECISIONS.md`
- **Roadmap:** `docs/product/10_ROADMAP.md`

---

*Atualizado em: 2026-01-15*
