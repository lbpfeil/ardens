# Technology Stack

**Analysis Date:** 2026-01-19

## Languages

**Primary:**
- TypeScript 5.x - All application code (`arden/app/`, `arden/components/`, `arden/lib/`)
- SQL (PostgreSQL 15+) - Database schema and RLS policies (`database/schema.sql`, `database/rls-policies.sql`)

**Secondary:**
- CSS - Styling via Tailwind (`arden/app/globals.css`)

## Runtime

**Environment:**
- Node.js (implied by Next.js 16)
- Browser (React 19 client components)

**Package Manager:**
- npm
- Lockfile: `arden/package-lock.json` (present)

## Frameworks

**Core:**
- Next.js 16.1.1 - App Router, React Server Components
- React 19.2.3 - UI library
- React DOM 19.2.3 - DOM rendering

**UI/Styling:**
- Tailwind CSS 4.x - Utility-first CSS framework
- shadcn/ui 3.6.3 - Component library (radix-nova style)
- Radix UI 1.4.3 - Accessible primitives
- Base UI React 1.0.0 - Low-level UI primitives
- class-variance-authority 0.7.1 - Variant styling
- clsx 2.1.1 - Class name utility
- tailwind-merge 3.4.0 - Tailwind class merging
- tw-animate-css 1.4.0 - Animation utilities
- lucide-react 0.562.0 - Icon library

**Backend-as-a-Service:**
- Supabase SSR 0.8.0 - Server-side auth handling
- Supabase JS 2.90.1 - Client SDK

**Build/Dev:**
- PostCSS with @tailwindcss/postcss - CSS processing
- ESLint 9.x with eslint-config-next - Linting
- TypeScript 5.x - Type checking

## Key Dependencies

**Critical:**
- `@supabase/ssr` 0.8.0 - Handles auth tokens in SSR context, cookie management
- `@supabase/supabase-js` 2.90.1 - All database operations, auth, storage
- `next` 16.1.1 - Application framework, routing, SSR
- `react` 19.2.3 - UI rendering

**Infrastructure:**
- `shadcn` 3.6.3 - Component scaffolding CLI
- `tailwindcss` 4.x - Styling engine

## Configuration

**Environment:**
- `.env.local` for Supabase credentials
- Required variables:
  - `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

**TypeScript:**
- `arden/tsconfig.json` - Strict mode enabled
- Target: ES2017
- Module: ESNext with bundler resolution
- Path alias: `@/*` maps to `arden/*`

**Next.js:**
- `arden/next.config.ts` - Minimal config (no custom settings)

**PostCSS:**
- `arden/postcss.config.mjs` - Tailwind CSS plugin only

**ESLint:**
- `arden/eslint.config.mjs` - Next.js Core Web Vitals + TypeScript rules

**shadcn/ui:**
- `arden/components.json` - radix-nova style, RSC enabled, lucide icons
- CSS: `app/globals.css`
- Components: `@/components/ui`
- Utils: `@/lib/utils`

## Platform Requirements

**Development:**
- Node.js (LTS recommended)
- npm for package management
- Git for version control

**Production:**
- Vercel (planned) - Next.js hosting
- Supabase Cloud - Database, auth, storage
- Google Cloud Functions (planned) - PDF generation with Puppeteer

## Build Commands

```bash
# Development
cd arden && npm run dev      # Start dev server on localhost:3000

# Production
cd arden && npm run build    # Build for production
cd arden && npm run start    # Start production server

# Quality
cd arden && npm run lint     # Run ESLint
```

## Future Stack (Planned per CLAUDE.md)

**Not Yet Implemented:**
- Zustand - State management
- React Hook Form + Zod - Form handling and validation
- Recharts - Data visualization
- Resend - Email delivery
- Sentry - Error monitoring
- Expo (React Native) - Mobile app

---

*Stack analysis: 2026-01-19*
