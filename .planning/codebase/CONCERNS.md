# Codebase Concerns

**Analysis Date:** 2026-01-19

## Tech Debt

**Mock Data in Production Components:**
- Issue: Dashboard and app layout use hardcoded mock data instead of real data
- Files: `arden/app/app/page.tsx` (lines 5-59), `arden/app/app/layout.tsx` (lines 34-61)
- Impact: UI shows fake data; no actual data fetching implemented
- Fix approach: Create hooks to fetch real data from Supabase, replace mocks with dynamic queries

**Placeholder Components:**
- Issue: Charts and activity feeds are placeholder text, not functional
- Files: `arden/app/app/page.tsx` (lines 144-146, 156-157)
- Impact: Dashboard lacks core functionality; Recharts not yet integrated
- Fix approach: Implement Recharts components for conformance evolution chart; build activity feed component

**Example/Demo Components in Production:**
- Issue: `component-example.tsx` and `example.tsx` are test/demo files committed to production
- Files: `arden/components/component-example.tsx` (495 lines), `arden/components/example.tsx` (53 lines)
- Impact: Unused code in production bundle; potential confusion about usage
- Fix approach: Move to `__examples__` folder or remove; keep only if used for documentation

**Non-functional Navigation:**
- Issue: Sidebar navigation items trigger state changes but no actual routing
- Files: `arden/app/app/layout.tsx` (lines 70-78)
- Impact: Clicking nav items does not navigate; routes like `/app/verificacoes` do not exist
- Fix approach: Create actual page routes; implement proper Next.js navigation with `useRouter`

**Hardcoded Secondary Menu:**
- Issue: Secondary sidebar always shows "Verificacoes" submenu regardless of selection
- Files: `arden/app/app/layout.tsx` (line 74)
- Impact: Submenu is static; selecting "Relatorios" still shows "Verificacoes" items
- Fix approach: Create submenu configuration per nav item; dynamically render based on activeItem

## Known Bugs

**"Esqueci a senha" Link Broken:**
- Symptoms: Link points to `/forgot-password` which does not exist
- Files: `arden/app/login/page.tsx` (line 81)
- Trigger: Click "Esqueci a senha" on login page
- Workaround: None - page returns 404

**Search Button Non-functional:**
- Symptoms: Search button in app header does nothing when clicked
- Files: `arden/app/app/layout.tsx` (lines 116-122)
- Trigger: Click search button or use Ctrl+K
- Workaround: None - feature not implemented

**"Ver detalhes" Buttons Do Nothing:**
- Symptoms: NC detail buttons have no onClick handler
- Files: `arden/app/app/page.tsx` (lines 121-122)
- Trigger: Click "Ver detalhes" on any NC item
- Workaround: None - feature not implemented

## Security Considerations

**Supabase Credentials in .env.local:**
- Risk: `.env.local` contains actual Supabase credentials; file is gitignored but keys visible
- Files: `arden/.env.local`
- Current mitigation: File is gitignored (`.gitignore` exists)
- Recommendations: Verify `.env.local` is in `.gitignore`; rotate keys if accidentally committed; use Vercel/deployment env vars for production

**Non-null Assertions on Environment Variables:**
- Risk: TypeScript `!` assertions bypass null checks; app crashes if env vars undefined
- Files: `arden/lib/supabase/client.ts` (lines 5-6), `arden/lib/supabase/server.ts` (lines 8-9), `arden/middleware.ts` (lines 10-11)
- Current mitigation: None
- Recommendations: Add runtime validation at app startup; use Zod schema for env validation

**Silent Error Swallowing:**
- Risk: Server-side Supabase client catches errors silently
- Files: `arden/lib/supabase/server.ts` (lines 16-22)
- Current mitigation: Comment says "Server Component - ignorar"
- Recommendations: Add error logging to understand failures; consider Sentry integration

## Performance Bottlenecks

**No Data Fetching Implementation:**
- Problem: Currently not measurable - all data is mocked
- Files: `arden/app/app/page.tsx`, `arden/app/app/layout.tsx`
- Cause: No Supabase queries implemented yet
- Improvement path: When implementing, use proper caching (React Query/SWR); optimize RLS policies

**Large UI Components:**
- Problem: `component-example.tsx` is 495 lines; complex dropdown menu trees
- Files: `arden/components/component-example.tsx`
- Cause: Demo component with deep nesting
- Improvement path: Split into smaller components if kept; remove if unused

## Fragile Areas

**App Layout State Management:**
- Files: `arden/app/app/layout.tsx`
- Why fragile: Multiple useState hooks managing related state (activeItem, showSecondary, secondaryItems, sidebarExpanded); no Zustand yet
- Safe modification: Consider refactoring to single state object or Zustand store before adding features
- Test coverage: None

**Authentication Flow:**
- Files: `arden/app/login/page.tsx`, `arden/app/signup/page.tsx`, `arden/middleware.ts`
- Why fragile: Manual state management for loading/error; no form library (React Hook Form planned but not used)
- Safe modification: Test auth flows manually after changes; consider adding Playwright E2E tests
- Test coverage: None

## Scaling Limits

**Not Applicable (Early Development):**
- Current capacity: Local development only
- Limit: No production deployment yet
- Scaling path: Use Supabase's built-in scaling; monitor query performance with RLS

## Dependencies at Risk

**None Critical:**
- All dependencies are current and actively maintained
- Next.js 16, React 19, Supabase latest versions
- Risk: None identified at this time

## Missing Critical Features

**No Data Layer:**
- Problem: No Supabase queries; no data fetching hooks
- Blocks: All dashboard functionality, verification management, reports
- Priority: High - core functionality depends on this

**No Form Validation:**
- Problem: Login/signup use basic HTML validation; Zod not integrated
- Blocks: Robust error handling, complex form flows
- Priority: Medium - works for auth, needed for verification forms

**No State Management:**
- Problem: Zustand listed in CLAUDE.md but not installed or used
- Blocks: Complex state sharing, offline capabilities
- Priority: Medium - needed before adding complex features

**No Testing Infrastructure:**
- Problem: No test files in project; Jest/Vitest not configured; Playwright not set up
- Blocks: Confidence in deployments, regression prevention
- Priority: High - DECISIONS.md mentions E2E tests for critical flows

**No Error Monitoring:**
- Problem: Sentry mentioned in decisions but not integrated
- Blocks: Proactive error detection in production
- Priority: Medium - needed before production launch

**No Routing for Most Pages:**
- Problem: Only `/`, `/login`, `/signup`, `/app` exist; other routes 404
- Blocks: All in-app navigation beyond home dashboard
- Priority: High - core navigation broken

## Test Coverage Gaps

**Zero Test Coverage:**
- What's not tested: Everything
- Files: All files in `arden/app/`, `arden/components/`, `arden/lib/`
- Risk: Any change could introduce undetected regressions
- Priority: High

**Critical Flows Without Tests:**
1. Authentication (login, signup, logout)
2. Middleware route protection
3. Supabase client initialization

---

*Concerns audit: 2026-01-19*
