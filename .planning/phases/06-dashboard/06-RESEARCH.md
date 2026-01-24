# Phase 6: Dashboard - Research

**Researched:** 2026-01-24
**Domain:** Dashboard de qualidade por obra com KPIs, métricas temporais e visualização de dados
**Confidence:** HIGH

## Summary

Pesquisa sobre implementação de dashboard de qualidade para construção civil com foco em KPIs (Taxa de Conformidade, IRS, Pendentes, Concluídas), feed de não-conformidades e gráficos temporais usando Recharts.

**Stack atual já possui:**
- Skeleton component (shadcn/ui) para loading states
- KPICard component básico com suporte a loading
- Página dashboard em `/app/obras/[id]` com placeholders
- Design system completo (Supabase dark theme)

**Gap principal:**
- Recharts não está instalado (precisa adicionar)
- Fórmula IRS precisa ser definida
- Agregações temporais PostgreSQL precisam de queries otimizadas
- date-fns para formatação de datas relativas (PT-BR)

**Primary recommendation:** Use Recharts v3.7+ para gráficos temporais, PostgreSQL `date_trunc` com indexes para agregações diárias, e implemente IRS como razão homens-hora de retrabalho sobre total trabalhado (fórmula padrão PBQP-H).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Recharts | 3.7+ | Charts/gráficos | Biblioteca React mais usada, integração nativa com React 19, leve, SVG nativo, ideal para dashboards SaaS |
| react-is | (match React) | Peer dep Recharts | Requerido pelo Recharts para funcionar corretamente |
| date-fns | latest | Formatação datas | Já é padrão do ecossistema, suporta PT-BR, leve, tree-shakeable |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | (já instalado) | Ícones trend arrows | Já no projeto, tem ArrowUp/ArrowDown/TrendingUp |
| shadcn/ui Skeleton | (já instalado) | Loading states | Já implementado, usar para KPIs e gráfico |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Recharts | Chart.js | Chart.js requer wrapper React, mais complexo, menos idiomático |
| Recharts | Victory | Victory mais pesado, API menos intuitiva |
| Recharts | Nivo | Nivo bom mas overkill para line charts simples |
| date-fns | moment.js | moment.js deprecated, muito pesado |
| date-fns | day.js | day.js menor mas date-fns tem melhor TS support |

**Installation:**
```bash
npm install recharts react-is date-fns
```

## Architecture Patterns

### Recommended Project Structure
```
app/app/obras/[id]/
├── page.tsx                    # Server Component (data fetching)
├── _components/
│   ├── obra-dashboard.tsx      # Client Component (interatividade)
│   ├── kpi-section.tsx         # Grid 2x2 dos KPIs
│   ├── kpi-card-with-trend.tsx # KPICard + trend indicator
│   ├── nc-feed.tsx             # Feed últimas 5 NCs
│   └── conformidade-chart.tsx  # Recharts LineChart
```

### Pattern 1: Server Component Data Fetching
**What:** Buscar todos os dados no Server Component, passar como props para Client Components
**When to use:** Sempre que possível para aproveitar server-side rendering
**Example:**
```typescript
// app/app/obras/[id]/page.tsx
import { getDashboardData } from '@/lib/supabase/queries/dashboard'

export default async function ObraPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dashboardData = await getDashboardData(id) // Server-side fetch

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-6xl mx-auto">
        <ObraDashboard data={dashboardData} /> {/* Client Component */}
      </div>
    </div>
  )
}
```

### Pattern 2: PostgreSQL Aggregation com date_trunc
**What:** Usar `date_trunc('day', created_at)` + GROUP BY para agregar métricas diárias
**When to use:** Charts temporais, métricas por período
**Example:**
```sql
-- Taxa de conformidade diária (últimos 3 meses)
SELECT
  date_trunc('day', iv.created_at)::date as data,
  COUNT(*) FILTER (WHERE iv.status IN ('conforme', 'conforme_apos_reinspecao', 'aprovado_com_concessao')) * 100.0 / COUNT(*) as taxa_conformidade
FROM itens_verificacao iv
JOIN verificacoes v ON v.id = iv.verificacao_id
WHERE v.obra_id = $1
  AND iv.created_at >= NOW() - INTERVAL '3 months'
  AND iv.status != 'nao_verificado'
GROUP BY date_trunc('day', iv.created_at)
ORDER BY data;
```

**Optimization:** Criar index em `created_at` para performance:
```sql
CREATE INDEX idx_itens_verificacao_created_at ON itens_verificacao(created_at);
CREATE INDEX idx_verificacoes_obra_created ON verificacoes(obra_id, created_at);
```

### Pattern 3: Recharts ResponsiveContainer + LineChart
**What:** Wrapper responsivo com LineChart para dados temporais
**When to use:** Qualquer gráfico de linha temporal
**Example:**
```typescript
// Source: Official Recharts docs + PostHog tutorial
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function ConformidadeChart({ data }: { data: Array<{ data: string; taxa: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-default))" />
        <XAxis
          dataKey="data"
          tickFormatter={(value) => format(parseISO(value), 'dd/MMM', { locale: ptBR })}
          stroke="hsl(var(--foreground-muted))"
        />
        <YAxis
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
          stroke="hsl(var(--foreground-muted))"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background-overlay-default))',
            border: '1px solid hsl(var(--border-overlay))',
            borderRadius: '8px'
          }}
          labelFormatter={(label) => format(parseISO(label), 'PPP', { locale: ptBR })}
          formatter={(value: number) => [`${value.toFixed(1)}%`, 'Taxa de Conformidade']}
        />
        <Line
          type="monotone"
          dataKey="taxa"
          stroke="hsl(var(--brand-default))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

### Pattern 4: KPI com Trend Indicator
**What:** Mostrar valor atual + arrow + % de variação vs período anterior
**When to use:** Todos os 4 KPIs do dashboard
**Example:**
```typescript
// Expandir KPICard existente
import { ArrowUp, ArrowDown, Minus } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  previousValue?: number  // Para calcular trend
  description?: string
  loading?: boolean
}

export function KPICardWithTrend({ title, value, previousValue, description, loading }: KPICardProps) {
  if (loading) {
    // Usar skeleton existente
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value
  const trend = previousValue ? ((numValue - previousValue) / previousValue) * 100 : null
  const isPositive = trend && trend > 0
  const isNegative = trend && trend < 0

  return (
    <div className="rounded-lg border border-border bg-surface-100 p-4">
      <p className="text-xs text-foreground-muted uppercase tracking-wide">{title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-2xl font-semibold text-foreground">{value}</p>
        {trend !== null && (
          <span className={cn(
            "text-xs flex items-center gap-1",
            isPositive && "text-brand",
            isNegative && "text-destructive"
          )}>
            {isPositive && <ArrowUp className="h-3 w-3" />}
            {isNegative && <ArrowDown className="h-3 w-3" />}
            {!isPositive && !isNegative && <Minus className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {description && <p className="text-xs text-foreground-muted mt-1">{description}</p>}
    </div>
  )
}
```

### Pattern 5: Data Relativa PT-BR com date-fns
**What:** Formatar datas como "há 2 horas", "ontem", "há 3 dias" em português
**When to use:** NC feed, timestamps
**Example:**
```typescript
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// NC feed item
<div className="flex justify-between items-start">
  <div>
    <p className="text-sm font-medium">{nc.servico} - {nc.unidade}</p>
    <p className="text-xs text-foreground-muted">{nc.descricao}</p>
  </div>
  <span className="text-xs text-foreground-lighter">
    {formatDistanceToNow(new Date(nc.created_at), { addSuffix: true, locale: ptBR })}
  </span>
</div>
```

### Pattern 6: Responsive Grid Layout
**What:** Grid 2x2 em desktop, 1 coluna em mobile
**When to use:** Layout dos 4 KPIs
**Example:**
```typescript
// Grid responsivo Tailwind
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 4 cols */}
  <KPICardWithTrend {...kpi1} />
  <KPICardWithTrend {...kpi2} />
  <KPICardWithTrend {...kpi3} />
  <KPICardWithTrend {...kpi4} />
</div>
```

### Anti-Patterns to Avoid

- **Fetching data in Client Component:** Use Server Components para data fetching inicial, não useEffect + fetch
- **Recharts sem ResponsiveContainer:** Sempre usar ResponsiveContainer para responsividade
- **Calcular métricas no frontend:** Agregações devem ser feitas no PostgreSQL (performance + consistência)
- **date_trunc sem index:** Sempre indexar colunas de data usadas em agregações
- **Hardcoded colors:** Sempre usar CSS variables do design system (`hsl(var(--brand-default))`)
- **Skeleton diferente do conteúdo real:** Skeleton deve ter mesma estrutura do componente carregado

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Charts/gráficos | Canvas custom, D3 raw | Recharts | Recharts abstrai complexidade do D3, responsivo out-of-box, manutenção |
| Date formatting | Regex/split custom | date-fns | Internacionalização, timezones, edge cases (leap years, DST) |
| Trend calculations | Custom math | PostgreSQL window functions | Consistência, performance, menos código JS |
| Relative time | Custom "X ago" logic | date-fns formatDistanceToNow | Pluralização correta, locale PT-BR, edge cases |
| Skeleton loaders | Custom pulse animations | shadcn/ui Skeleton | Consistência visual, acessibilidade (prefers-reduced-motion) |
| Responsive charts | Media queries manuais | ResponsiveContainer | Recharts gerencia resize automaticamente |

**Key insight:** Dashboard é domain onde bibliotecas especializadas economizam semanas de desenvolvimento. Não reinventar charting, date formatting ou aggregations — são problemas resolvidos com edge cases complexos.

## Common Pitfalls

### Pitfall 1: Recharts Performance com Muitos Data Points
**What goes wrong:** LineChart com 1000+ pontos fica lento, especialmente em mobile
**Why it happens:** Recharts renderiza todos os pontos como SVG DOM nodes
**How to avoid:**
- Limitar data points (max 90 pontos para 3 meses = daily granularity)
- Para períodos longos, usar granularidade semanal ou mensal
- Usar `dot={false}` na Line (não renderizar círculos em cada ponto)
**Warning signs:** Chart demora >500ms para renderizar, scrolling travado

### Pitfall 2: RLS Performance com Aggregations
**What goes wrong:** Queries de agregação lentas quando RLS policies fazem joins complexos
**Why it happens:** RLS policies executam por row, multiplicando custo
**How to avoid:**
- Wrap `auth.uid()` em subquery: `(SELECT auth.uid())` para "cache" do valor
- Usar indexes em colunas de RLS (obra_id, cliente_id)
- Considerar materialized view para métricas se ficarem lentas
**Warning signs:** Dashboard demora >2s para carregar, queries >1s no explain analyze

### Pitfall 3: Timezone Consistency
**What goes wrong:** Datas mudam de dia dependendo do timezone do usuário
**Why it happens:** Browser converte timestamps UTC para timezone local
**How to avoid:**
- Usar `date_trunc('day', created_at AT TIME ZONE 'America/Sao_Paulo')` para garantir timezone BR
- Armazenar datas importantes como `date` type (sem timezone) se apropriado
- date-fns: usar UTC functions ou fixar timezone
**Warning signs:** Métricas mudam dependendo do timezone, gráfico mostra dia errado

### Pitfall 4: Null/Empty States no Recharts
**What goes wrong:** Chart quebra ou fica vazio quando não há dados
**Why it happens:** Recharts não renderiza nada se data array vazio
**How to avoid:**
- Verificar `data.length > 0` antes de renderizar chart
- Mostrar empty state com mensagem clara ("Sem dados no período")
- Fornecer dados mock/placeholder se necessário
**Warning signs:** Chart desaparece em obras novas, console errors

### Pitfall 5: Date Formatting Inconsistente
**What goes wrong:** Datas aparecem em formatos diferentes (ISO, locale US, PT-BR misturados)
**Why it happens:** Mix de `new Date().toLocaleDateString()`, `toISOString()`, date-fns
**How to avoid:**
- SEMPRE usar date-fns com locale ptBR
- Criar utility functions centralizadas para formatos comuns
- Evitar métodos nativos Date (exceto parse/constructor)
**Warning signs:** Datas em inglês, formatos MM/DD/YYYY aparecendo

### Pitfall 6: Fórmula IRS Incorreta
**What goes wrong:** IRS não bate com expectativa PBQP-H, auditores reclamam
**Why it happens:** Confundir retrabalho (correção executada) com NC simples
**How to avoid:**
- IRS = (Homens-hora de retrabalho) / (Total homens-hora) × 100
- Retrabalho = `status_reinspecao = 'retrabalho'` (não contar NCs ainda abertas)
- Documentar fórmula no código e em docs
**Warning signs:** IRS muito alto/baixo, não alinha com percepção da obra

## Code Examples

Verified patterns from official sources:

### Date Aggregation with RLS Optimization
```sql
-- Source: Supabase RLS best practices + PostgreSQL date_trunc docs
-- Taxa de conformidade por dia (últimos 90 dias)
-- Optimized: wrap auth.uid() para caching, index em created_at

CREATE INDEX IF NOT EXISTS idx_itens_verificacao_created_at
  ON itens_verificacao(created_at);
CREATE INDEX IF NOT EXISTS idx_verificacoes_obra_created
  ON verificacoes(obra_id, created_at);

WITH obra_verificacoes AS (
  SELECT iv.*
  FROM itens_verificacao iv
  JOIN verificacoes v ON v.id = iv.verificacao_id
  WHERE v.obra_id = $1
    AND v.cliente_id = (SELECT auth.uid()::uuid)  -- RLS optimization
    AND iv.created_at >= CURRENT_DATE - INTERVAL '90 days'
    AND iv.status != 'nao_verificado'
)
SELECT
  date_trunc('day', created_at)::date as data,
  COUNT(*) FILTER (
    WHERE status IN ('conforme', 'conforme_apos_reinspecao', 'aprovado_com_concessao')
  ) * 100.0 / NULLIF(COUNT(*), 0) as taxa_conformidade
FROM obra_verificacoes
GROUP BY date_trunc('day', created_at)
ORDER BY data;
```

### IRS Calculation Query
```sql
-- Source: Biblioteca de Indicadores + PBQP-H guidelines
-- IRS = (Homens-hora retrabalho / Total homens-hora) × 100

-- Simplified version (sem tracking de homens-hora):
-- IRS = (Itens com retrabalho / Total itens verificados) × 100

SELECT
  COUNT(*) FILTER (WHERE status_reinspecao = 'retrabalho') * 100.0
    / NULLIF(COUNT(*) FILTER (WHERE status != 'nao_verificado'), 0) as irs
FROM itens_verificacao iv
JOIN verificacoes v ON v.id = iv.verificacao_id
WHERE v.obra_id = $1
  AND v.cliente_id = (SELECT auth.uid()::uuid)
  AND iv.created_at >= date_trunc('month', CURRENT_DATE);  -- Mês atual
```

### Recharts with Tailwind CSS Variables
```typescript
// Source: Recharts docs + Supabase design system
// IMPORTANTE: Usar hsl(var(--css-var)) para cores do design system

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartProps {
  data: Array<{ date: string; value: number }>
}

export function ConformidadeChart({ data }: ChartProps) {
  // Custom tooltip para theme escuro
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-overlay border border-overlay rounded-lg p-3 shadow-lg">
          <p className="text-xs text-foreground-muted">{label}</p>
          <p className="text-sm font-medium text-foreground">
            {payload[0].value.toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="hsl(var(--border-default))"
          opacity={0.3}
        />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--foreground-muted))"
          tick={{ fill: 'hsl(var(--foreground-muted))' }}
          tickLine={{ stroke: 'hsl(var(--border-default))' }}
        />
        <YAxis
          domain={[0, 100]}
          stroke="hsl(var(--foreground-muted))"
          tick={{ fill: 'hsl(var(--foreground-muted))' }}
          tickLine={{ stroke: 'hsl(var(--border-default))' }}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="hsl(var(--brand-default))"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: 'hsl(var(--brand-default))' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

### NC Feed Component
```typescript
// Source: date-fns docs + design system patterns
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertCircle } from 'lucide-react'

interface NCFeedProps {
  ncs: Array<{
    id: string
    servico_nome: string
    unidade_codigo: string
    descricao: string
    created_at: string
  }>
}

export function NCFeed({ ncs }: NCFeedProps) {
  if (ncs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-foreground-muted">
          Nenhuma não-conformidade registrada
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-surface-100 divide-y divide-border">
      {ncs.map((nc) => (
        <div key={nc.id} className="p-4 hover:bg-surface-200 transition-colors cursor-pointer">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {nc.servico_nome} - {nc.unidade_codigo}
              </p>
              <p className="text-xs text-foreground-light mt-1 line-clamp-2">
                {nc.descricao}
              </p>
            </div>
            <span className="text-xs text-foreground-lighter whitespace-nowrap">
              {formatDistanceToNow(new Date(nc.created_at), {
                addSuffix: true,
                locale: ptBR
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
```

### Skeleton Loading State
```typescript
// Source: shadcn/ui Skeleton docs
import { Skeleton } from '@/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* KPI Cards Skeleton */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-surface-100 p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-7 w-16 mt-2" />
            <Skeleton className="h-3 w-32 mt-2" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="rounded-lg border border-border bg-surface-100 p-6">
        <Skeleton className="h-4 w-40 mb-4" />
        <Skeleton className="h-[300px] w-full" />
      </div>

      {/* NC Feed Skeleton */}
      <div className="rounded-lg border border-border bg-surface-100 divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex items-start gap-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-full mt-2" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Client-side data fetching (useEffect) | Server Components data fetching | Next.js 13+ (2023) | Melhor performance, SEO, menos JavaScript |
| Chart.js com wrapper | Recharts nativo React | Recharts 2.0+ (2021) | API mais React-idiomática, TypeScript-first |
| moment.js | date-fns | 2020+ | moment.js deprecated, date-fns tree-shakeable, menor bundle |
| Custom aggregations no frontend | PostgreSQL window functions + date_trunc | Sempre recomendado | Performance, consistência, menos bugs |
| TimescaleDB hypertables | PostgreSQL nativo com indexes | Supabase 2024+ | TimescaleDB features limitadas no Supabase, native PG suficiente |
| Spinners/loading | Skeleton screens | 2020+ UX best practice | Melhor perceived performance, evita layout shift |

**Deprecated/outdated:**
- **moment.js**: Deprecated oficialmente, usar date-fns ou day.js
- **TimescaleDB continuous aggregates no Supabase**: Feature não disponível (Apache 2 limitation), usar materialized views
- **Chart.js para React**: Não é idiomático, requer wrapper react-chartjs-2, preferir Recharts
- **Auth.uid() direto em RLS policies**: Performance ruim, usar `(SELECT auth.uid())` para caching

## Open Questions

Things that couldn't be fully resolved:

1. **Tracking de Homens-Hora para IRS**
   - What we know: Fórmula ideal IRS usa homens-hora de retrabalho / total homens-hora
   - What's unclear: Sistema atual não rastreia homens-hora por item/serviço
   - Recommendation:
     - **MVP:** Usar aproximação: `(Itens retrabalho / Total itens) × 100`
     - **Futuro:** Adicionar campo `horas_estimadas` em `itens_servico` e `horas_reais` em `itens_verificacao`
   - Confidence: MEDIUM - fórmula simplificada é aceitável para PBQP-H fase inicial

2. **Period Selector Implementation**
   - What we know: Precisa suportar 30d, 3m, 6m, 1a, Todo
   - What's unclear: Como implementar "Todo" (desde início da obra) com performance
   - Recommendation:
     - Limitar "Todo" a max 2 anos ou 365 pontos
     - Usar granularidade adaptativa (diária <3m, semanal 3-12m, mensal >12m)
   - Confidence: HIGH - pattern comum em dashboards

3. **Materialized View Necessity**
   - What we know: PostgreSQL 17+ tem melhor performance para concurrent refresh
   - What's unclear: Se agregações diárias precisarão de materialized view ou index é suficiente
   - Recommendation:
     - **Começar:** Queries diretas com indexes
     - **Se lento (>2s):** Implementar materialized view refreshada por cron
   - Confidence: HIGH - otimização prematura é má ideia, começar simples

## Sources

### Primary (HIGH confidence)
- [Recharts GitHub](https://github.com/recharts/recharts) - v3.7.0, React 19 compatible
- [Recharts API Docs](https://recharts.org/en-US/api) - LineChart, ResponsiveContainer
- [Supabase RLS Performance](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv) - Optimization techniques
- [PostgreSQL date_trunc Function](https://www.geeksforgeeks.org/postgresql/postgresql-date_trunc-function/) - Aggregation syntax
- [date-fns Documentation](https://date-fns.org/docs/format) - PT-BR locale support
- [shadcn/ui Skeleton](https://ui.shadcn.com/docs/components/skeleton) - Loading states

### Secondary (MEDIUM confidence)
- [PostHog Recharts Tutorial](https://posthog.com/tutorials/recharts) - Real-world examples
- [Biblioteca de Indicadores - IRS](http://bibliotecadeindicadores.com.br/indicador/%C3%8Dndice%20de%20retrabalho?cod=255) - Fórmula IRS construção civil
- [Sienge - Indicadores de Qualidade](https://sienge.com.br/blog/indicadores-de-qualidade-na-construcao-civil/) - Context PBQP-H
- [Medium - Recharts Best Practices](https://codeparrot.ai/blogs/recharts-the-ultimate-react-charting-library) - Chart patterns
- [Tremor Components](https://www.tremor.so/) - KPI card design patterns
- [Shadcn Dashboard Widgets](https://shadcnstore.com/blocks/application/widgets) - Trend indicators

### Tertiary (LOW confidence - for validation)
- [WebSearch: React chart libraries 2026](https://technostacks.com/blog/react-chart-libraries/) - Ecosystem overview
- [WebSearch: Responsive dashboard layouts](https://medium.com/codetodeploy/css-grid-responsive-design-the-mobile-first-approach-that-actually-works-194bdab9bc52) - Grid patterns
- [WebSearch: Next.js Server Actions 2026](https://medium.com/@beenakumawat002/next-js-app-router-advanced-patterns-for-2026-server-actions-ppr-streaming-edge-first-b76b1b3dcac7) - Data fetching patterns

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Recharts, date-fns são escolhas estabelecidas, verificadas com docs oficiais
- Architecture: HIGH - Patterns verificados com docs Recharts, Supabase, Next.js 16
- Pitfalls: MEDIUM-HIGH - Baseados em docs oficiais + experiência comum (RLS, Recharts performance)
- IRS formula: MEDIUM - Fórmula padrão verificada, mas implementação simplificada (sem homens-hora)

**Research date:** 2026-01-24
**Valid until:** ~60 days (stable tech stack, slow-moving domain)

**Notes:**
- Recharts v3.7 released January 2026, muito recente mas stable release
- PostgreSQL 18 (2026) tem 10% improvement em GROUP BY, mas não disponível no Supabase ainda
- date-fns locale pt-BR verificado como funcional
- Codebase já tem Skeleton, KPICard, página placeholder - base sólida para build
