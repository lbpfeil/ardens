# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

---

## 1. Repository overview

This repo contains **product, design, and technical documentation** organized in a modular structure:

### Documentation Structure

```
docs/
├── 00_INDEX.md              # Main index - START HERE
├── product/                 # Product requirements (10 files)
├── tech/                    # Technical specifications (8 files)
├── design/                  # Design system references
└── process/                 # Decisions, open questions, glossary
```

### Key Files

| File | Purpose |
|------|---------|
| `docs/00_INDEX.md` | **Main documentation index** |
| `DESIGN-SYSTEM.md` | **SSOT** for UI/UX patterns |
| `database/schema.sql` | **SSOT** for database schema |
| `database/rls-policies.sql` | **SSOT** for RLS policies |
| `PRD_INDEX.md` | Legacy PRD navigation |

No application code, package manifests, or build tooling are present yet. All implementation guidance below is **forward-looking**.

### When you start working in this repo:

1. **Read `docs/00_INDEX.md`** for the documentation map
2. **Read `docs/product/01_OVERVIEW.md`** for product vision
3. **Use `docs/product/`** for feature requirements and flows
4. **Use `docs/tech/`** for technical implementation details
5. **Use `DESIGN-SYSTEM.md`** as the **SSOT** for web UI

---

## 2. High-level architecture

### 2.1 Core domain model

From `docs/product/05_DOMAIN_MODEL.md`, the core concepts are:

- **Cliente / Construtora** (tenant)
- **Obra** (project / site)
- **Agrupamento** (group within obra – e.g., Quadra, Torre, Pavimento)
- **Unidade** (house/apartment within agrupamento)
- **Serviço (FVS)** – service with a checklist of items
- **Item de verificação** – atomic checklist item (observação, método, tolerância)
- **Verificação** – inspection of a single serviço in a single unidade
- **NC (Não-Conformidade)** – issue attached to an item
- **Condições de Início (CI)** – dependencies between serviços

Important:

- **Granularity is at item level**, not service level
- Status models and IRS formula are in `docs/product/05_DOMAIN_MODEL.md`

### 2.2 Data & backend – Supabase-first

See `docs/tech/01_ARCHITECTURE.md` for full details.

**Stack:**
- **Database:** PostgreSQL 15+ via Supabase
- **Auth:** Supabase Auth (email/password, sessions)
- **Multi-tenancy:** Row Level Security (RLS) with `cliente_id`
- **Storage:** Supabase Storage for photos
- **Server logic:** Supabase Edge Functions (Deno) + GCP Cloud Functions

**Key principles:**
- **No separate Node/Express backend**
- 90%+ of CRUD via Supabase client libraries with RLS
- Edge Functions for emails, image processing, scheduled jobs
- **GCP Cloud Functions + Puppeteer** for PDF generation (high visual quality)

### 2.3 Web portal

See `docs/tech/05_FRONTEND_WEB.md` for full details.

**Stack:**
- **Framework:** Next.js 15+ with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI primitives:** Radix UI
- **State management:** **Zustand only** (no Redux, no Context API)
- **Forms & validation:** React Hook Form + Zod
- **Charts:** Recharts
- **Hosting:** Vercel

**Navigation:** See `docs/product/04_NAVIGATION.md`

### 2.4 Mobile app (offline-first)

> **Note:** Offline mode is **mobile-only**. Web portal requires internet connection.

See `docs/tech/06_MOBILE_TECH.md` for full details.

**Stack:**
- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State management:** Zustand
- **Forms & validation:** React Hook Form + Zod
- **Offline persistence:** SQLite via Expo
- **Camera:** expo-camera + expo-image-manipulator
- **Build/deploy:** EAS Build

### 2.5 Offline sync model

See `docs/tech/04_OFFLINE_SYNC.md` for full details.

**Key rules:**
- **Conflict strategy: first write wins**
- **Granularity:** item level, not service level
- **Local schema:** SQLite tables for obras, unidades, serviços, verificações, offline queue
- **Sync flow:** Download → Upload items → Upload photos → Cleanup

### 2.6 Reporting

See `docs/product/09_REPORTS.md` for specifications and `docs/tech/07_REPORTING_PIPELINE.md` for implementation.

**MVP Reports:**
- FVS por Grupo de Unidades
- RNC (Relatório de Não Conformidades)
- Dashboard Executivo
- Eficiência de Correção

---

## 3. Development & commands

Because there is currently **no code or tooling** checked in, concrete commands depend on how the project is bootstrapped.

### 3.1 Discovering project layout

When implementation exists:

- List top-level entries to see structure (e.g. `apps/`, `packages/`)
- Check `package.json` for scripts
- Check for workspace tooling (Turborepo, pnpm workspaces)

### 3.2 Web / Next.js app

Expected scripts:
- `npm run dev` - Dev server
- `npm run build` - Production build
- `npm run lint` - Lint
- `npm test` - Tests

### 3.3 Mobile / Expo app

Expected commands:
- `npx expo start` - Start Metro bundler
- `npx expo start --android` - Run on Android
- `npx eas build --platform android` - Build with EAS

### 3.4 Supabase

Expected workflow:
- `supabase start` - Local dev
- `supabase db push` - Push migrations
- `supabase functions deploy <name>` - Deploy Edge Functions

---

## 4. Implementation rules for agents

### 4.1 Global architectural rules

- **Supabase-first backend:** No ad-hoc Node/Express server
- **Multi-tenancy via RLS:** `cliente_id` on all relevant tables
- **TypeScript everywhere:** No plain JavaScript

### 4.2 Web portal conventions

- **Routing:** Next.js App Router, follow `docs/product/04_NAVIGATION.md`
- **State:** Zustand only (no Redux, no Context API for global state)
- **Design:** Follow `DESIGN-SYSTEM.md` patterns
- **Forms:** React Hook Form + Zod

### 4.3 Mobile app conventions

- **Offline-first:** SQLite for domain data
- **Sync:** First-write-wins semantics from `docs/tech/04_OFFLINE_SYNC.md`
- **Consistency:** Same tools as web (Zustand, RHF + Zod)

### 4.4 Testing conventions

- **Component testing:** React Testing Library + Jest
- **Accessibility:** jest-axe
- **Patterns:** Follow `DESIGN-SYSTEM.md` testing section

### 4.5 How to use the docs

When implementing functionality:

1. **Start from `docs/00_INDEX.md`** to find the right document
2. **Product requirements:** `docs/product/` directory
3. **Technical details:** `docs/tech/` directory
4. **UI patterns:** `DESIGN-SYSTEM.md`
5. **Database:** `database/schema.sql` and `database/rls-policies.sql`
6. **Decisions:** `docs/process/DECISIONS.md`

### 4.6 Document hierarchy

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
| UI/UX | `DESIGN-SYSTEM.md` |
| Glossary | `docs/process/GLOSSARY.md` |
