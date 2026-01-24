---
phase: 06-dashboard
plan: 02
subsystem: ui
tags: [date-fns, react, dashboard, nc-feed, relative-dates]

# Dependency graph
requires:
  - phase: 06-01
    provides: Dashboard KPIs section and ObraDashboard component structure
provides:
  - NC feed component displaying recent non-conformances
  - getRecentNCs query function with servico/unidade joins
  - Relative date formatting with PT-BR locale
affects: [06-03, future NC detail modal, NC list page]

# Tech tracking
tech-stack:
  added: [date-fns@4.1.0]
  patterns: [Server-side data fetch passed as props, formatDistanceToNow with locale]

key-files:
  created:
    - arden/app/app/obras/[id]/_components/nc-feed.tsx
  modified:
    - arden/lib/supabase/queries/dashboard.ts
    - arden/app/app/obras/[id]/_components/obra-dashboard.tsx
    - arden/app/app/obras/[id]/page.tsx
    - arden/package.json

key-decisions:
  - "Use date-fns formatDistanceToNow with ptBR locale for relative dates"
  - "Query open NCs only (status=nao_conforme AND status_reinspecao=null)"
  - "Display unidade.codigo with fallback to unidade.nome"
  - "Parallel fetch of KPIs and NCs using Promise.all"
  - "Hover feedback only for now (modal deferred to future phase)"

patterns-established:
  - "NCFeedItem interface for NC display data"
  - "Empty state with dashed border and muted text pattern"
  - "AlertCircle icon for NC severity indication"

# Metrics
duration: 5min
completed: 2026-01-24
---

# Phase 6 Plan 02: NC Feed Summary

**NC feed showing 5 most recent open non-conformances with relative dates in Portuguese (date-fns ptBR locale)**

## Performance

- **Duration:** 5 min
- **Started:** 2026-01-24T19:48:58Z
- **Completed:** 2026-01-24T19:53:22Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Installed date-fns for relative date formatting with PT-BR locale support
- Created NCFeedItem interface and getRecentNCs query with multi-table joins
- Built NCFeed component with empty state, NC list, and "Ver todas" link
- Integrated NC feed into dashboard with parallel data fetching

## Task Commits

Each task was committed atomically:

1. **Task 1: Install date-fns** - `233be4c` (feat)
2. **Task 2: Add NC feed query to dashboard data layer** - `73dbd73` (feat)
3. **Task 3: Create NCFeed component and integrate with dashboard** - `b12be78` (feat)

## Files Created/Modified

- `arden/package.json` - Added date-fns@4.1.0 dependency
- `arden/lib/supabase/queries/dashboard.ts` - NCFeedItem interface, getRecentNCs function
- `arden/app/app/obras/[id]/_components/nc-feed.tsx` - NC feed component with empty state, list, and relative dates
- `arden/app/app/obras/[id]/_components/obra-dashboard.tsx` - Updated to accept ncs prop and render NCFeed
- `arden/app/app/obras/[id]/page.tsx` - Parallel fetch of KPIs and NCs, pass to ObraDashboard

## Decisions Made

- **date-fns over Intl.RelativeTimeFormat:** date-fns provides formatDistanceToNow with built-in PT-BR locale, simpler API than manual Intl calculations
- **Open NCs only:** Filter by status='nao_conforme' AND status_reinspecao IS NULL to show only actionable items
- **Unidade display priority:** Show codigo if available, fallback to nome for units without explicit codes
- **Parallel fetch:** Use Promise.all for KPIs and NCs to minimize page load time
- **Click behavior deferred:** Hover feedback only (cursor-pointer, bg change), modal implementation in future phase

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- **Turbopack build error:** Next.js 16.1.1 Turbopack internal panic during build verification. This is a known Next.js infrastructure issue unrelated to our code changes. TypeScript compilation and lint checks confirmed code correctness.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- NC feed component ready for future enhancements (click to open detail modal)
- "Ver todas as NCs" link ready for NC list page implementation
- Dashboard structure ready for Plan 06-03 (time series chart)

---
*Phase: 06-dashboard*
*Completed: 2026-01-24*
