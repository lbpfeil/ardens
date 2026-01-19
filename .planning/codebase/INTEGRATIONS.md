# External Integrations

**Analysis Date:** 2026-01-19

## APIs & External Services

**Supabase (Primary Backend):**
- PostgreSQL database with Row Level Security
- Authentication (email/password)
- Storage (planned for photos)
- Edge Functions (planned for scheduled tasks)
- SDK/Client: `@supabase/supabase-js`, `@supabase/ssr`
- Auth: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Google Cloud Functions (Planned):**
- Purpose: PDF generation with Puppeteer
- Functions planned:
  - `gerar-pdf-fvs` - FVS reports
  - `gerar-pdf-rnc` - Non-conformance reports
  - `gerar-pdf-dashboard` - Executive dashboard
  - `gerar-pdf-eficiencia` - Correction efficiency
  - `gerar-excel-dashboard` - Excel export

## Data Storage

**Databases:**
- PostgreSQL 15+ via Supabase Cloud
  - Connection: `NEXT_PUBLIC_SUPABASE_URL`
  - Client: `@supabase/supabase-js` (no ORM)
  - Schema: `database/schema.sql`
  - RLS Policies: `database/rls-policies.sql`

**Key Tables:**
- `clientes` - Multi-tenant root (construtoras)
- `usuarios` - User profiles linked to auth.users
- `obras` - Construction projects
- `verificacoes` - FVS inspections
- `itens_verificacao` - Individual inspection items
- `servicos` - FVS service library
- `notificacoes` - User notifications

**File Storage:**
- Supabase Storage (planned)
  - Purpose: NC photos, reference images
  - Compression: Client-side (3-5 MB to 500-800 KB)
  - Limit: 1 MB per photo, 5 photos per NC

**Caching:**
- None currently implemented

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (built-in)
  - Email/password authentication
  - Session management via cookies

**Implementation:**
- Browser client: `arden/lib/supabase/client.ts`
  - Uses `createBrowserClient` from `@supabase/ssr`
- Server client: `arden/lib/supabase/server.ts`
  - Uses `createServerClient` from `@supabase/ssr`
  - Cookie-based session handling
- Middleware: `arden/middleware.ts`
  - Protects `/app/*` routes
  - Redirects unauthenticated users to `/login`
  - Redirects authenticated users from `/login` to `/app`

**Auth Flow:**
1. User submits credentials at `/login` or `/signup`
2. Client calls `supabase.auth.signInWithPassword()` or `supabase.auth.signUp()`
3. Supabase sets session cookies
4. Middleware validates session on protected routes
5. Server components use `createClient()` from server.ts

## Monitoring & Observability

**Error Tracking:**
- Sentry (planned, not implemented)

**Logs:**
- Console logging (development)
- No production logging service configured

## CI/CD & Deployment

**Hosting:**
- Vercel (planned) - Next.js deployment
- Supabase Cloud - Database hosting

**CI Pipeline:**
- None configured

**Current Setup:**
- Local development only
- Manual deployment

## Environment Configuration

**Required env vars:**
```bash
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

**Secrets location:**
- `arden/.env.local` (gitignored)

**Planned env vars (per docs):**
- `SUPABASE_SERVICE_ROLE_KEY` - For Edge Functions
- GCP credentials for Cloud Functions
- Resend API key for emails

## Webhooks & Callbacks

**Incoming:**
- None implemented
- Planned: Supabase webhook for auth events

**Outgoing:**
- None implemented
- Planned: Email notifications via Resend

## Multi-Tenancy Architecture

**Strategy:** Row Level Security (RLS)

**Tenant Identification:**
- `cliente_id` column on most tables
- Helper functions in `database/rls-policies.sql`:
  - `get_user_cliente_id()` - Returns current user's tenant
  - `get_user_perfil()` - Returns user's role in tenant
  - `user_has_obra_access(obra_id)` - Checks project access
  - `is_admin()` - Checks admin role
  - `is_admin_or_engenheiro()` - Checks elevated roles

**User Roles:**
- `admin` - Full access to tenant
- `engenheiro` - Dashboards, reports, verifications
- `inspetor` - Mobile app, field verifications
- `almoxarife` - Material release (optional feature)

## API Patterns

**Direct Supabase Queries (90% of operations):**
```typescript
// From arden/app/login/page.tsx
const supabase = createClient()
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
})
```

**Server-Side Data Fetching:**
```typescript
// Pattern from arden/lib/supabase/server.ts
import { createClient } from '@/lib/supabase/server'

const supabase = await createClient()
const { data, error } = await supabase.from('obras').select('*')
```

## Integration Status

| Integration | Status | Implementation |
|-------------|--------|----------------|
| Supabase Auth | Active | `lib/supabase/`, `middleware.ts` |
| Supabase Database | Active | Direct queries via SDK |
| Supabase Storage | Planned | Schema references `fotos_nc`, `fotos_referencia` |
| Supabase Edge Functions | Planned | Documented in `docs/tech/01_ARCHITECTURE.md` |
| Google Cloud Functions | Planned | For PDF generation |
| Resend (Email) | Planned | Documented in CLAUDE.md |
| Sentry | Planned | Documented in CLAUDE.md |

---

*Integration audit: 2026-01-19*
