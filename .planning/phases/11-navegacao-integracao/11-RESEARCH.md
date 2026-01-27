# Phase 11: Navegação e Integração - Research

**Researched:** 2026-01-27
**Domain:** Next.js App Router navigation, state preservation, URL patterns, React animations
**Confidence:** HIGH

## Summary

Phase 11 integrates the verification system (matriz + individual page) into the existing obra app by connecting navigation flows, adding real data to the dashboard, and implementing bi-directional navigation with state preservation. The research focused on Next.js App Router navigation patterns, state preservation strategies (scroll position, expanded groups), temporary visual feedback animations, and breadcrumb enhancements.

**Key findings:**
- Next.js App Router provides built-in soft navigation with partial rendering, preserving React state between pages
- State preservation requires URL searchParams for server-safe persistence combined with sessionStorage for ephemeral UI state
- CSS keyframe animations with dynamic classes provide efficient temporary visual feedback (highlight flash)
- Existing breadcrumb component already supports dynamic routes, needs extension for verification-specific context

**Primary recommendation:** Use searchParams for critical state (filters), sessionStorage for UI state (scroll, expanded groups), CSS animations for highlight feedback, and extend existing breadcrumb with context from URL params.

## Standard Stack

The project already uses the appropriate stack for this phase. No new libraries are needed.

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js App Router | 16+ | Server/client navigation | Built-in soft navigation, searchParams support, partial rendering |
| React | 19 | Client state management | useState, useEffect for ephemeral state |
| next/navigation | built-in | Navigation hooks | useRouter, usePathname, useSearchParams for routing |
| Tailwind CSS | 4 | Animation utilities | Keyframe animations, transition classes |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| date-fns | current | Date formatting | Already used in NCFeed for relative timestamps |
| Sonner | current | Toast notifications | Already integrated for action feedback |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| searchParams | localStorage | localStorage is client-only, fails on SSR, not shareable via URL |
| CSS animations | JavaScript animation libraries | CSS is more performant, simpler for basic highlight effects |
| Extending breadcrumb | New breadcrumb | Existing component already handles dynamic routes, just needs data |

**Installation:**
No additional packages required. All dependencies are already present in the project.

## Architecture Patterns

### Pattern 1: State Preservation with URL searchParams

**What:** Store filterable/shareable state in URL search params, ephemeral UI state in sessionStorage

**When to use:**
- Filters (agrupamentos visibility) → searchParams (shareable, SSR-safe)
- UI state (scroll position, expanded groups) → sessionStorage (not shareable, persists across navigations)

**Example:**
```typescript
// arden/app/app/obras/[id]/verificacoes/page.tsx
import { Suspense } from 'react'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ grupos?: string }> // comma-separated group IDs
}

export default async function VerificacoesPage({ params, searchParams }: PageProps) {
  const { id: obraId } = await params
  const { grupos } = await searchParams

  // Pass to Client Component for initialization
  return <MatrizClient obraId={obraId} initialVisibleGroups={grupos?.split(',')} />
}

// Client Component
'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

function MatrizClient({ obraId, initialVisibleGroups }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Update URL when filter changes
  const updateFilters = (groupIds: string[]) => {
    const params = new URLSearchParams(searchParams)
    if (groupIds.length > 0) {
      params.set('grupos', groupIds.join(','))
    } else {
      params.delete('grupos')
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }
}
```

**Reference:** [Next.js useSearchParams](https://nextjs.org/docs/app/api-reference/functions/use-search-params)

### Pattern 2: Scroll Position Preservation with sessionStorage

**What:** Save scroll position and expanded groups to sessionStorage before navigation, restore on return

**When to use:** When user navigates from matriz to individual page and back, preserve exactly where they were

**Example:**
```typescript
// arden/app/app/obras/[id]/verificacoes/_components/matriz-grid.tsx
'use client'

function MatrizGrid({ obraId }) {
  const router = useRouter()
  const pathname = usePathname()

  // Restore state on mount
  useEffect(() => {
    const key = `matriz-state-${obraId}`
    const saved = sessionStorage.getItem(key)
    if (saved) {
      const { scrollY, expandedGroups } = JSON.parse(saved)
      setExpandedGroups(new Set(expandedGroups))
      // Defer scroll restoration until DOM is ready
      setTimeout(() => window.scrollTo(0, scrollY), 0)
      // Clear saved state after restoration
      sessionStorage.removeItem(key)
    }
  }, [obraId])

  const handleCellClick = (verificacaoId: string) => {
    // Save state before navigation
    const key = `matriz-state-${obraId}`
    sessionStorage.setItem(key, JSON.stringify({
      scrollY: window.scrollY,
      expandedGroups: Array.from(expandedGroups)
    }))

    router.push(`/app/obras/${obraId}/verificacoes/${verificacaoId}`)
  }
}
```

**Reference:** [Next.js Preserve Scroll History](https://jak-ch-ll.medium.com/next-js-preserve-scroll-history-334cf699802a), [Implementing scroll restoration](https://blog.logrocket.com/implementing-scroll-restoration-in-ecommerce-react-apps/)

### Pattern 3: Temporary Highlight Animation

**What:** Flash border/background on cell after returning from individual page to indicate what changed

**When to use:** Provide visual feedback showing which cell was just modified

**Example:**
```typescript
// CSS (globals.css)
@keyframes highlight-flash {
  0%, 100% {
    border-color: hsl(var(--border));
    box-shadow: none;
  }
  50% {
    border-color: hsl(var(--brand));
    box-shadow: 0 0 0 2px hsl(var(--brand) / 0.3);
  }
}

.highlight-flash {
  animation: highlight-flash 1.5s ease-in-out;
}

// Component
'use client'
import { useSearchParams } from 'next/navigation'

function MatrizGrid() {
  const searchParams = useSearchParams()
  const highlightCell = searchParams.get('highlight') // "servicoId:unidadeId"
  const [animatingCell, setAnimatingCell] = useState(highlightCell)

  useEffect(() => {
    if (highlightCell) {
      setAnimatingCell(highlightCell)
      // Remove animation class after it completes
      const timer = setTimeout(() => setAnimatingCell(null), 1500)
      return () => clearTimeout(timer)
    }
  }, [highlightCell])

  return (
    <div
      data-cell-key={cellKey}
      className={animatingCell === cellKey ? 'highlight-flash' : ''}
    />
  )
}
```

**Reference:** [CSS border animations](https://web.dev/articles/css-border-animations), [CSS Glow Effects](https://www.testmu.ai/blog/glowing-effects-in-css/)

### Pattern 4: Enhanced Breadcrumb with Context

**What:** Extend existing breadcrumb component to show context for verification individual page

**When to use:** User is on `/app/obras/[id]/verificacoes/[verificacaoId]`, breadcrumb should show "Obra > Verificações > Serviço - Unidade"

**Example:**
```typescript
// arden/components/navigation/breadcrumb.tsx (existing file, extend)
'use client'

const sectionLabels: Record<string, string> = {
  verificacoes: 'Verificações',
  // ... existing entries
}

export function Breadcrumb() {
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()

  // ... existing logic ...

  // NEW: Handle verificacao individual route
  if (section === 'verificacoes' && params.verificacaoId) {
    const servicoNome = searchParams.get('servico')
    const unidadeNome = searchParams.get('unidade')

    crumbs.push({
      label: 'Verificações',
      href: `/app/obras/${obraId}/verificacoes`
    })

    if (servicoNome && unidadeNome) {
      crumbs.push({
        label: `${servicoNome} - ${unidadeNome}`
      })
    }
  }
}
```

**Reference:** [Building Dynamic Breadcrumbs in Next.js](https://dev.to/dan_starner/building-dynamic-breadcrumbs-in-nextjs-17oa), [Dynamic Breadcrumbs Component](https://medium.com/@kcabading/creating-a-breadcrumb-component-in-a-next-js-app-router-a0ea24cdb91a)

### Anti-Patterns to Avoid

- **Don't store complex state in URL:** URLs should be shareable, not encode entire UI state (expanded groups → sessionStorage, NOT URL)
- **Don't use localStorage for navigation state:** Use sessionStorage (tab-specific) to avoid cross-tab pollution
- **Don't animate with JavaScript when CSS suffices:** CSS animations are more performant and don't require RAF/timers
- **Don't create new breadcrumb component:** Extend existing one to maintain consistency

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| URL searchParams updates | Manual string manipulation | URLSearchParams API | Handles encoding, multiple params, edge cases |
| Scroll restoration | Custom event listeners | sessionStorage + useEffect | Browser handles scroll position natively after DOM settles |
| CSS animations | JavaScript RAF loops | CSS @keyframes + classes | Hardware-accelerated, declarative, cleaner separation |
| Breadcrumb generation | Hardcoded breadcrumbs per route | Dynamic pathname parsing | Already implemented in existing component |

**Key insight:** Next.js App Router already handles most navigation complexity (soft navigation, partial rendering, state preservation between client components). Focus effort on the data flow, not reimplementing routing.

## Common Pitfalls

### Pitfall 1: Losing State on Server Component Re-render

**What goes wrong:** Storing navigation state in Server Component props causes loss on back navigation because Server Components re-render fresh

**Why it happens:** Server Components don't preserve client-side state, searchParams in layouts don't update on navigation

**How to avoid:**
- Keep navigation state in Client Components (useState, sessionStorage)
- Pass initial state from Server Component as props, but manage it client-side
- Use searchParams in page.tsx (not layout.tsx)

**Warning signs:**
- State resets to initial values when using browser back button
- Filters/expansions reset unexpectedly

**Reference:** [Next.js searchParams in layouts issue](https://github.com/vercel/next.js/discussions/65341)

### Pitfall 2: Race Condition Between Scroll Restoration and Data Load

**What goes wrong:** Attempting to restore scroll position before data finishes loading scrolls to wrong position

**Why it happens:** Scroll position is pixel-based, if content height changes during load, position is inaccurate

**How to avoid:**
- Delay scroll restoration with setTimeout(fn, 0) to wait for next tick
- Alternatively, wait for data to load (useEffect dependency on data)
- Use CSS `scroll-behavior: auto` during restoration, `smooth` for user scrolling

**Warning signs:**
- Scroll position "jumps" after restoration
- Sometimes restores correctly, sometimes doesn't (race condition)

**Reference:** [Restore scroll position gist](https://gist.github.com/claus/992a5596d6532ac91b24abe24e10ae81)

### Pitfall 3: Highlight Animation Persists After URL Change

**What goes wrong:** Highlight animation class remains on element after navigation away and back

**Why it happens:** searchParams persist in URL unless explicitly cleared

**How to avoid:**
- Use router.replace() (not router.push()) to update URL without adding history entry
- Clear highlight param after animation completes: `router.replace(pathname, { scroll: false })`
- OR rely on component unmount to clear animation state

**Warning signs:**
- Cell highlights every time user returns to matriz, even without changes
- Multiple cells highlight at once

### Pitfall 4: Breadcrumb Data Not Available

**What goes wrong:** Breadcrumb tries to show "Serviço - Unidade" but data isn't available in URL/context

**Why it happens:** Server Component fetch happened in individual page, breadcrumb renders before data arrives

**How to avoid:**
- Pass context data via searchParams: `router.push(url + ?servico=X&unidade=Y)`
- OR fetch minimal data in breadcrumb component (acceptable for small queries)
- OR show generic label ("Verificação Individual") if context unavailable

**Warning signs:**
- Breadcrumb shows "Carregando..." indefinitely
- Breadcrumb renders "undefined - undefined"

## Code Examples

Verified patterns from official sources and existing codebase:

### NC Feed Navigation to Individual Page

```typescript
// arden/app/app/obras/[id]/_components/nc-feed.tsx (modify existing)
'use client'
import { useRouter } from 'next/navigation'

export function NCFeed({ ncs, obraId }: { ncs: NCFeedItem[], obraId: string }) {
  const router = useRouter()

  const handleNCClick = (nc: NCFeedItem) => {
    // Navigate with context for breadcrumb
    const url = `/app/obras/${obraId}/verificacoes/${nc.verificacaoId}`
    const params = new URLSearchParams({
      servico: nc.servicoNome,
      unidade: nc.unidadeCodigo,
      from: 'dashboard' // optional: track entry point
    })
    router.push(`${url}?${params.toString()}`)
  }

  return (
    <div className="rounded-lg border border-border bg-surface-100 divide-y divide-border">
      {ncs.map((nc) => (
        <div
          key={nc.id}
          onClick={() => handleNCClick(nc)}
          className="p-4 hover:bg-surface-200 transition-colors cursor-pointer"
        >
          {/* existing content */}
        </div>
      ))}
    </div>
  )
}
```

### Back Button in Individual Page

```typescript
// arden/app/app/obras/[id]/verificacoes/[verificacaoId]/_components/verificacao-header.tsx
'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function VerificacaoHeader({ obraId, verificacaoId }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')

  const handleBack = () => {
    if (from === 'dashboard') {
      // Return to dashboard
      router.push(`/app/obras/${obraId}`)
    } else {
      // Return to matriz with highlight
      const servicoId = searchParams.get('servicoId')
      const unidadeId = searchParams.get('unidadeId')
      const highlight = servicoId && unidadeId ? `${servicoId}:${unidadeId}` : null

      const params = new URLSearchParams()
      if (highlight) params.set('highlight', highlight)

      const url = `/app/obras/${obraId}/verificacoes`
      router.push(highlight ? `${url}?${params.toString()}` : url)
    }
  }

  return (
    <div className="border-b border-border pb-4 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="mb-2 -ml-2"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar à matriz
      </Button>
      {/* rest of header */}
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router scroll restoration | App Router soft navigation | Next.js 13+ (2022) | Automatic state preservation between client components |
| localStorage for all state | searchParams + sessionStorage | App Router era | Better SSR compatibility, URL shareability |
| JavaScript animations | CSS animations with Tailwind | Modern CSS (2020+) | Hardware acceleration, better performance |
| Custom breadcrumb per route | Dynamic pathname parsing | React Router patterns | Single component handles all routes |

**Deprecated/outdated:**
- `next/router` (Pages Router): Replaced by `next/navigation` in App Router
- Experimental scrollRestoration config: Still experimental, manual solutions more reliable
- Global state for all navigation state: Use URL-first approach (searchParams)

## Open Questions

Things that couldn't be fully resolved:

1. **Should matriz state persist across sessions?**
   - What we know: sessionStorage clears on tab close, localStorage persists
   - What's unclear: User expectation - fresh state or remember preferences?
   - Recommendation: Start with sessionStorage (fresh state), add "Remember filters" toggle later if requested

2. **Should highlight animation trigger on all returns or only after modification?**
   - What we know: Context says "highlight temporarily to indicate change"
   - What's unclear: How to detect "change" vs just viewing?
   - Recommendation: Highlight on return from individual page (any reason), assume user may have changed something even if just viewed

3. **Should feed navigation include agrupamento in breadcrumb?**
   - What we know: NC feed shows "Unidade" but not which agrupamento it belongs to
   - What's unclear: Is agrupamento important context for user?
   - Recommendation: Query for agrupamento in breadcrumb if showing full path, or just show "Obra > Verificações > Serviço - Unidade" (agrupamento implicit)

## Sources

### Primary (HIGH confidence)
- [Next.js useSearchParams Documentation](https://nextjs.org/docs/app/api-reference/functions/use-search-params) - Official API reference
- [Next.js Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating) - Official navigation guide
- [CSS border animations on web.dev](https://web.dev/articles/css-border-animations) - Official Google resource

### Secondary (MEDIUM confidence)
- [Next.js Preserve Scroll History](https://jak-ch-ll.medium.com/next-js-preserve-scroll-history-334cf699802a) - Community pattern
- [Building Dynamic Breadcrumbs in Next.js](https://dev.to/dan_starner/building-dynamic-breadcrumbs-in-nextjs-17oa) - DEV Community guide
- [Implementing scroll restoration in React apps](https://blog.logrocket.com/implementing-scroll-restoration-in-ecommerce-react-apps/) - LogRocket pattern
- [Creating Dynamic Breadcrumb in App Router](https://medium.com/@kcabading/creating-a-breadcrumb-component-in-a-next-js-app-router-a0ea24cdb91a) - Medium pattern

### Tertiary (LOW confidence)
- [CSS Glow Effects](https://www.testmu.ai/blog/glowing-effects-in-css/) - Animation examples
- [Restore scroll position gist](https://gist.github.com/claus/992a5596d6532ac91b24abe24e10ae81) - GitHub gist

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - No new libraries needed, existing stack is appropriate
- Architecture: HIGH - Next.js patterns are well-documented, existing breadcrumb component works
- Pitfalls: MEDIUM - Based on community reports, not all edge cases tested in this codebase
- Code examples: HIGH - Based on existing codebase patterns + official Next.js docs

**Research date:** 2026-01-27
**Valid until:** ~60 days (Next.js is stable, patterns unlikely to change rapidly)

## Additional Context from Codebase

### Existing Implementations to Leverage

1. **Sidebar Navigation (INTEG-01):** Already exists at `arden/components/navigation/sidebar-obra.tsx`
   - "Verificações" item present with correct route (`/app/obras/${obraId}/verificacoes`)
   - Icon: ClipboardCheck
   - Position: Third in "Operação" section (after Serviços, Unidades)
   - NO ACTION NEEDED for INTEG-01

2. **Dashboard KPIs (INTEG-02):** Already implemented with real data
   - `arden/lib/supabase/queries/dashboard.ts` provides `getDashboardKPIs()`
   - Calculates Taxa Conformidade, IRS, Pendentes, Concluídas from real verification data
   - Used in `arden/app/app/obras/[id]/page.tsx`
   - NO ACTION NEEDED for INTEG-02

3. **NC Feed (INTEG-03):** Already implemented with real data
   - `arden/lib/supabase/queries/dashboard.ts` provides `getRecentNCs()`
   - Fetches open NCs with servico nome, unidade codigo
   - Displayed in `arden/app/app/obras/[id]/_components/nc-feed.tsx`
   - NEEDS: Remove "Ver todas as NCs" button, add click handler for navigation, add agrupamento to query

4. **Breadcrumb Component:** Already handles dynamic routes
   - `arden/components/navigation/breadcrumb.tsx` uses usePathname + useParams
   - Fetches obra name dynamically
   - Maps section paths to labels (sectionLabels)
   - NEEDS: Extend for verification individual context

### Key Data Structures

```typescript
// Already defined in dashboard.ts
interface NCFeedItem {
  id: string
  servicoNome: string
  unidadeCodigo: string
  observacao: string | null
  createdAt: string
}

// Need to extend query to include:
interface NCFeedItemExtended extends NCFeedItem {
  verificacaoId: string  // For navigation
  agrupamentoNome?: string  // For display (optional)
}
```

### Navigation Flow Map

```
Dashboard (obra/[id]/page.tsx)
  ├─> NCFeed item click
  │   └─> Individual (/verificacoes/[verificacaoId]?from=dashboard&servico=X&unidade=Y)
  │       └─> "Voltar" → Dashboard
  │
  └─> Sidebar "Verificações" click
      └─> Matriz (/verificacoes)
          ├─> Cell click
          │   └─> Individual (/verificacoes/[verificacaoId]?servicoId=X&unidadeId=Y)
          │       └─> "Voltar à matriz" → Matriz (with ?highlight=X:Y)
          │
          └─> State preserved in sessionStorage:
              - scrollY
              - expandedGroups (Set<string>)
```
