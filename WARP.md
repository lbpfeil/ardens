# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

---

## 1. Repository overview

This repo currently contains **product and design documentation only**:

- `ARDEN_FVS_PRD.md` – full product requirements (source of truth for features and flows)
- `prd-continue.md` – condensed executive summary and pointers into the PRD
- `DESIGN-SYSTEM.md` – Supabase Studio–style design system and UI patterns

No application code, package manifests, or build tooling are present yet. All implementation and command guidance below is **forward-looking** and must be reconciled with whatever code and tooling exist when you run.

When you start working in this repo:

1. **Read `prd-continue.md` first** for a fast overview of the product and technical decisions.
2. Use `ARDEN_FVS_PRD.md` for detailed behavior, domain modeling, and reporting logic.
3. Use `DESIGN-SYSTEM.md` as the **single source of truth** for web UI, layout, and visual behavior.

---

## 2. High-level architecture

### 2.1 Core domain model

From the PRD, the core concepts are:

- **Cliente / Construtora** (tenant)
- **Obra** (project / site)
- **Agrupamento** (group within obra – e.g., Quadra, Torre, Pavimento)
- **Unidade** (house/apartment within agrupamento)
- **Serviço (FVS)** – service with a checklist of items (Alvenaria, Revestimento, etc.)
- **Item de verificação** – atomic checklist item (observação, método, tolerância)
- **Verificação** – inspection of a single serviço in a single unidade; composed of items
- **NC (Não-Conformidade)** – issue attached to an item; has photos, observations, status over time
- **Condições de Início (CI)** – dependencies between serviços that gate material release

Important:

- **Granularity is at item level**, not service level. Multiple inspectors can work on different items of the same serviço/unidade without conflict.
- Status models for items, verificações, NCs, and IRS (Índice de Retrabalho por Serviço) are fully specified near section 10 of `ARDEN_FVS_PRD.md`; use that as canonical behavior for reports and KPIs.

### 2.2 Data & backend – Supabase-first

Planned data/backend stack:

- **Database:** PostgreSQL 15+ via Supabase
- **Auth:** Supabase Auth (email/password, sessions)
- **Multi-tenancy:** Row Level Security (RLS) with `cliente_id` on all relevant tables
- **Storage:** Supabase Storage for photos; client-side compression and watermarking
- **Server logic:** Supabase Edge Functions (Deno) for the ~10% of logic that should not live in the client (PDF/Excel generation, email sending, image processing, heavier calculations, scheduled jobs)

Key principles:

- **No separate Node/Express backend.** 90%+ of CRUD and querying should be done directly from frontends using Supabase client libraries with RLS enforcing isolation.
- Edge Functions are used for:
  - Generating PDFs and Excel (FVS, RNC, dashboard, eficiência, etc.)
  - Sending scheduled and on-demand report emails
  - Processing images (compression + watermark)
  - Batch calculations and projections that are awkward to express in a single SQL query
  - Cron-like automations via Supabase Scheduled Functions

When adding backend behavior, prefer one of:

1. **SQL + RLS** if it can be expressed as queries/views/functions.
2. **Edge Function** if it needs multi-step workflows, external APIs, or heavy processing.
3. **Avoid introducing a traditional long-lived backend service** unless the scale or complexity grows well beyond what Supabase can handle, and that trade-off is explicitly re-evaluated.

### 2.3 Web portal (Admin / Engenheiro / Visão Global)

Planned web stack (section 13.3 of the PRD):

- **Framework:** Next.js 15+ with App Router
- **Language:** TypeScript everywhere
- **Styling:** Tailwind CSS
- **UI primitives:** Radix UI + custom components that clone Supabase Studio
- **State management:** **Zustand as the only global state solution** (no Redux, no Context API for global state)
- **Forms & validation:** React Hook Form + Zod
- **Charts:** Recharts
- **Hosting:** Vercel

Navigation architecture:

- Top-level **context selector** between "Visão Global" and a specific obra
- **Primary sidebar** (icons-only, 56px) that changes per context
- **Secondary sidebar** (240px) for sub-sections of the active module
- Content follows layout and patterns described in `ARDEN_FVS_PRD.md` (sections 4, 7, 8) and visually in `DESIGN-SYSTEM.md`.

When implementing pages or flows:

- Treat `ARDEN_FVS_PRD.md` as the canonical source for **routes, sections, dashboards, and flows**.
- Treat `DESIGN-SYSTEM.md` as canonical for **layout primitives, typography, spacing, component variants, and interaction details**.
- New UI work should first look for an existing pattern in `DESIGN-SYSTEM.md` before inventing new layout/component structures.

### 2.4 Mobile app (Inspetor – offline-first)

Planned mobile stack (section 13.4 in the PRD and summary in `prd-continue.md`):

- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Navigation:** React Navigation
- **State management:** Zustand (same mental model as web)
- **Forms & validation:** React Hook Form + Zod
- **Offline persistence:** SQLite via Expo (`expo-sqlite`) + `expo-file-system` for images
- **Camera & images:** `expo-camera` + `expo-image-manipulator` for compression/watermark
- **Build/deploy:** EAS Build / Expo services

Core constraints:

- Devices are **offline most of the workday**, with Wi-Fi only at specific times.
- Inspectors need to work entirely offline (creating/verifying items, capturing photos), with **automatic sync** when online.
- The app is **not a PWA**; offline capability and photo handling rely on native APIs.

### 2.5 Offline sync model (critical)

The mobile sync architecture is heavily specified in the PRD. Key rules:

- **Conflict strategy: first write wins.**
  - The first successfully synced change to an item becomes canonical; later conflicting writes for that same item are rejected and reported to the user.
- **Granularity:** sync and conflicts happen at **item** level, not service/verificação level.
- **Local schema (SQLite):** tables for obras, unidades, serviços, item library, verificações, offline item queue, and sync conflicts.
- Sync flow (high-level):
  1. Initial download of allowed obras/unidades/serviços and pending verificações.
  2. Offline work populates a local `itens_offline` queue and local file storage for photos.
  3. On Wi-Fi, three-step sync:
     - Download remote changes first (others’ work), updating local pending work.
     - Upload local item changes, applying first-write-wins logic.
     - Upload and then clean up compressed/watermarked photos.

Any future implementation of sync logic, conflict handling, and local caching should follow the scenarios and performance targets spelled out in `ARDEN_FVS_PRD.md` and `prd-continue.md`.

### 2.6 Reporting and automations

Reporting and scheduled automations are defined in detail in section 10 of `ARDEN_FVS_PRD.md`:

- Four MVP reports (FVS por Grupo de Unidades, RNC, Dashboard Executivo, Eficiência de Correção)
- Future reports (Tendências, Análise Preditiva de NCs)
- Exact PDF structures, summary metrics, and watermarks for photos
- Supabase Scheduled Functions triggering Edge Functions to generate/export PDFs/Excel and send email links

When implementing reports:

- **Do not redesign report content or layout**; follow the PRD’s structures so the generated documents match expectations for PBQP-H auditors and stakeholders.
- Ensure the status model and IRS formula in section 10 are treated as the authoritative contract for analytics and visualizations.

---

## 3. Development & commands

Because there is currently **no code or tooling** checked in, concrete commands will depend on how the project is bootstrapped (monorepo vs single app, package manager choice, etc.). This section defines **expected conventions**; always:

1. Locate the relevant `package.json`/config files.
2. Prefer existing `scripts` over inventing new commands.
3. Keep web, mobile, and any shared packages aligned with the stacks described above.

### 3.1 Discovering project layout

When the implementation exists, first:

- List top-level entries to see structure (e.g. `apps/`, `packages/`, `web/`, `mobile/`).
- For each app or package directory you find (e.g. `apps/web`, `apps/mobile`, `packages/ui`):
  - Open its `package.json` and note:
    - `scripts` (dev, build, lint, test, storybook, etc.)
    - tooling choices (Vite vs Next dev, Jest vs Vitest, etc.)
  - Check for workspace tooling such as Turborepo or pnpm workspaces.

### 3.2 Web / Next.js app – expected commands

Assuming a standard Next.js + TypeScript + Tailwind setup, at the web app root (where `next.config.*` and the app’s `package.json` live) you should expect scripts like:

- **Dev server (all pages):**
  - `npm run dev` or `pnpm dev`
- **Production build:**
  - `npm run build`
- **Start production build locally:**
  - `npm run start`
- **Lint:**
  - `npm run lint`
- **Unit/component tests:**
  - `npm test`
  - To run a single test file: `npm test -- path/to/file.test.tsx`

Before using any of these, confirm the exact script names in `package.json`. If the project uses pnpm or yarn, swap the CLI accordingly (`pnpm test`, `yarn test`, etc.).

### 3.3 UI/design-system package – expected commands

`DESIGN-SYSTEM.md` assumes a separate UI package (similar to `packages/ui`), developed with Vite and bundled with Rollup. For that package, expect scripts like:

- **Component dev playground / Storybook:**
  - `npm run dev` (Vite) and possibly `npm run storybook`
- **Build library:**
  - `npm run build` (Rollup-based)
- **Tests:**
  - `npm test` (Jest + React Testing Library)

Again, always use the scripts defined in that package’s `package.json` as the source of truth.

### 3.4 Mobile / Expo app – expected commands

Once an Expo app is added (likely under something like `apps/mobile`):

- **Start Metro bundler:**
  - `npx expo start`
- **Run on Android emulator or device:**
  - From the Expo dev UI, or `npx expo start --android`
- **Build binaries with EAS:**
  - `npx eas build --platform android`
- **Tests:**
  - If Jest is configured, `npm test` in the mobile app directory.

Check the Expo/EAS configuration files (`app.json`, `eas.json`) and `package.json` to confirm names and options.

### 3.5 Supabase & Edge Functions – expected workflow

When the Supabase project and CLI are wired into this repo, typical tasks will include:

- **Database migrations & local dev:** via Supabase CLI (e.g., `supabase start`, `supabase db push`, etc.).
- **Edge Functions:**
  - Develop in a functions directory (usually `supabase/functions/<name>`).
  - Deploy via Supabase CLI (e.g., `supabase functions deploy <name>`).

Follow whichever scripts or documentation are eventually added to this repo for the exact commands; the PRD enumerates **which functions should exist** (e.g., `gerar-pdf-fvs`, `gerar-pdf-rnc`, `gerar-pdf-dashboard`, `gerar-pdf-eficiencia`, `gerar-excel-dashboard`, `enviar-relatorio-email`, etc.), not how they are wired into CI or deployment.

---

## 4. Implementation rules & conventions for agents

These are project-specific rules distilled from the PRD and design system. Future Warp agents should treat them as constraints when generating or editing code.

### 4.1 Global architectural rules

- **Supabase-first backend:**
  - Use Supabase Postgres, Auth, Storage, RLS, and Edge Functions as the primary backend platform.
  - Do **not** introduce an ad-hoc Node/Express/REST server unless the user explicitly decides to change the architecture.
- **Multi-tenancy via RLS:**
  - Every multi-tenant table should carry a `cliente_id` and rely on PostgreSQL RLS policies.
  - Super Admin access for the Arden team must be handled via explicit RLS policies with full audit logging (see PRD notes).
- **TypeScript everywhere:**
  - New web, mobile, and edge function code should use TypeScript, not plain JavaScript.

### 4.2 Web portal conventions

- **Routing:**
  - Use Next.js App Router (`app/` directory) and align route structure with the navigation and module hierarchy in `ARDEN_FVS_PRD.md`.
- **State management:**
  - Use a **single Zustand store module** (or a small number of clearly separated slices) for global application state.
  - Do not introduce Redux or Context-based global stores unless the user explicitly asks for a different pattern.
- **Design system:**
  - `DESIGN-SYSTEM.md` is the canonical definition of:
    - CSS variables and theme tokens (dark mode–first)
    - Typography, spacing, border radius, shadows
    - Component APIs and layout primitives (PageContainer, PageHeader, Card, Table, etc.)
  - When adding UI, prefer composing these primitives over writing bespoke Tailwind from scratch.
- **Forms & validation:**
  - Use React Hook Form + Zod as in the examples in `DESIGN-SYSTEM.md`.
  - Surface validation and error messages following the patterns in the testing and accessibility sections.

### 4.3 Mobile app conventions

- **Offline-first by design:**
  - Any feature touching inspections, NCs, or photos must work offline with later sync.
  - Use SQLite as the primary local store for domain data (not just AsyncStorage).
- **Sync behavior:**
  - Follow the first-write-wins semantics from the PRD.
  - Sync flows should be resilient: failed syncs should not block offline work and should be surfaced to the user in a non-destructive way.
- **Shared mental model with web:**
  - Use Zustand and React Hook Form + Zod on mobile for consistency with the web stack.

### 4.4 Testing conventions

From `DESIGN-SYSTEM.md`, the expected testing stack is:

- **Component/unit testing:** React Testing Library + Jest
- **Accessibility testing:** `jest-axe`
- **Visual regression (optional):** Chromatic or similar

When adding tests:

- Use the patterns shown in the "Testing Guidelines" section of `DESIGN-SYSTEM.md` (querying by semantic roles, simulating user events, asserting on accessible names, etc.).
- Prefer testing behavior and accessibility over implementation details.

### 4.5 How to use the docs when generating code

When asked to implement or modify functionality, future agents should:

1. **Start from `prd-continue.md`** to understand the context quickly.
2. Jump to the relevant section(s) in `ARDEN_FVS_PRD.md` for precise behavior and data requirements.
3. Consult `DESIGN-SYSTEM.md` for layout, components, and styling before building or changing any UI.
4. Respect the architectural decisions documented there (Supabase-first, Next.js + Expo, Zustand, etc.) unless the user explicitly decides to change direction.
