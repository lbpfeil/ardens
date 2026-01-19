# Codebase Structure

**Analysis Date:** 2026-01-19

## Directory Layout

```
ardens/
├── .claude/                  # Claude Code configuration
├── .planning/                # GSD planning documents
│   └── codebase/             # Codebase analysis (this directory)
├── arden/                    # Next.js web application
│   ├── app/                  # App Router pages and layouts
│   │   ├── app/              # Protected dashboard area (/app/*)
│   │   ├── login/            # Login page
│   │   └── signup/           # Signup page
│   ├── components/           # React components
│   │   └── ui/               # shadcn/ui design system components
│   ├── lib/                  # Shared utilities and clients
│   │   └── supabase/         # Supabase client factories
│   ├── public/               # Static assets
│   ├── middleware.ts         # Route protection middleware
│   ├── next.config.ts        # Next.js configuration
│   └── package.json          # Dependencies and scripts
├── database/                 # Database schema and policies
├── docs/                     # Project documentation
│   ├── design/               # Design system documentation
│   ├── process/              # Decisions, glossary, questions
│   ├── product/              # PRD and feature specs
│   └── tech/                 # Technical architecture docs
├── CLAUDE.md                 # AI agent instructions
└── WARP.md                   # Additional development rules
```

## Directory Purposes

**`arden/`:**
- Purpose: Main Next.js 16 web application
- Contains: All frontend code, components, utilities
- Key files: `package.json`, `middleware.ts`, `next.config.ts`

**`arden/app/`:**
- Purpose: Next.js App Router pages and layouts
- Contains: Route segments, page components, layouts
- Key files: `layout.tsx` (root), `page.tsx` (landing), `globals.css`

**`arden/app/app/`:**
- Purpose: Protected authenticated dashboard area
- Contains: Dashboard pages, nested layouts
- Key files: `layout.tsx` (app shell with sidebar), `page.tsx` (home dashboard)

**`arden/app/login/` and `arden/app/signup/`:**
- Purpose: Authentication pages
- Contains: Login/signup forms with Supabase auth
- Key files: `page.tsx` in each directory

**`arden/components/ui/`:**
- Purpose: shadcn/ui component library (SSOT for UI)
- Contains: 13 reusable UI components
- Key files: `button.tsx`, `card.tsx`, `input.tsx`, `dropdown-menu.tsx`

**`arden/lib/`:**
- Purpose: Shared utilities and service clients
- Contains: Utility functions, Supabase client factories
- Key files: `utils.ts` (cn function), `supabase/client.ts`, `supabase/server.ts`

**`database/`:**
- Purpose: PostgreSQL schema and RLS policies for Supabase
- Contains: SQL files defining database structure
- Key files: `schema.sql`, `rls-policies.sql`

**`docs/`:**
- Purpose: Comprehensive project documentation
- Contains: PRD, technical specs, design system docs
- Key files: `00_INDEX.md` (start here), `design/DESIGN-SYSTEM.md`

## Key File Locations

**Entry Points:**
- `arden/app/layout.tsx`: Root layout (fonts, global CSS)
- `arden/app/page.tsx`: Landing page (marketing)
- `arden/app/app/layout.tsx`: App shell (sidebar, navigation)
- `arden/app/app/page.tsx`: Dashboard home
- `arden/middleware.ts`: Auth middleware

**Configuration:**
- `arden/package.json`: Dependencies, scripts
- `arden/next.config.ts`: Next.js config (currently empty)
- `arden/app/globals.css`: CSS custom properties, Tailwind config
- `CLAUDE.md`: AI agent instructions and codebase rules

**Core Logic:**
- `arden/lib/supabase/client.ts`: Browser Supabase client
- `arden/lib/supabase/server.ts`: Server Supabase client (for SSR)
- `arden/lib/utils.ts`: `cn()` class merging utility

**UI Components:**
- `arden/components/ui/button.tsx`: Button with variants
- `arden/components/ui/card.tsx`: Card container components
- `arden/components/ui/input.tsx`: Form input
- `arden/components/ui/dropdown-menu.tsx`: Dropdown menus

**Database:**
- `database/schema.sql`: Full PostgreSQL schema (900+ lines)
- `database/rls-policies.sql`: Row Level Security policies

## Naming Conventions

**Files:**
- Page components: `page.tsx` (Next.js convention)
- Layout components: `layout.tsx` (Next.js convention)
- UI components: `kebab-case.tsx` (e.g., `dropdown-menu.tsx`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`)

**Directories:**
- Routes: `kebab-case` (e.g., `login/`, `signup/`)
- Feature areas: `camelCase` (e.g., `supabase/`)
- Component groups: `kebab-case` (e.g., `ui/`)

**Components:**
- React components: `PascalCase` (e.g., `Button`, `CardHeader`)
- Exported functions: `PascalCase` for components, `camelCase` for utilities

**CSS Variables:**
- Use `--kebab-case` naming (e.g., `--foreground-light`, `--surface-100`)
- Tailwind classes: Use CSS variable mappings (e.g., `bg-surface-100`)

## Where to Add New Code

**New Page/Route:**
- Create directory in `arden/app/` matching the URL path
- Add `page.tsx` for the page component
- Add `layout.tsx` if custom layout needed
- Protected routes go under `arden/app/app/`

**New UI Component:**
- STOP: Ask user first per CLAUDE.md rules
- If approved: Add to `arden/components/ui/`
- Follow shadcn pattern: Radix primitive + CVA variants + cn()

**New Feature Component:**
- Add to `arden/components/` (not in `ui/` subdirectory)
- Use existing UI components from `arden/components/ui/`

**New Utility Function:**
- Add to `arden/lib/utils.ts` or create new file in `arden/lib/`

**New Supabase Integration:**
- Use existing clients from `arden/lib/supabase/`
- Server Components: Use `createClient()` from `server.ts`
- Client Components: Use `createClient()` from `client.ts`

**New Database Table:**
- Add to `database/schema.sql`
- Add RLS policies to `database/rls-policies.sql`
- Document in `docs/tech/02_DATABASE.md`

## Special Directories

**`arden/components/ui/`:**
- Purpose: shadcn/ui component library (Single Source of Truth)
- Generated: Partially (shadcn CLI), then customized
- Committed: Yes
- Note: Do NOT add components without user permission

**`arden/.next/`:**
- Purpose: Next.js build output
- Generated: Yes (by `npm run build` or `npm run dev`)
- Committed: No (in .gitignore)

**`.planning/`:**
- Purpose: GSD planning and analysis documents
- Generated: By GSD commands
- Committed: Yes

**`docs/`:**
- Purpose: Human-readable project documentation
- Generated: No (manual)
- Committed: Yes
- Note: Update when making significant changes

**`arden/node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in .gitignore)

---

*Structure analysis: 2026-01-19*
