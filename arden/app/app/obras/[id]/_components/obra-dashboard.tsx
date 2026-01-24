'use client'

import { KPISection } from './kpi-section'
import { NCFeed } from './nc-feed'
import type { DashboardKPIs, NCFeedItem } from '@/lib/supabase/queries/dashboard'

interface ObraDashboardProps {
  kpis: DashboardKPIs
  ncs: NCFeedItem[]
  // Future props for chart data:
  // chartData?: ChartDataPoint[]
}

/**
 * Client component for the obra dashboard.
 * Receives pre-fetched data from Server Component and renders interactive UI.
 */
export function ObraDashboard({ kpis, ncs }: ObraDashboardProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <KPISection kpis={kpis} />

      {/* NC Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Últimas Não-Conformidades</h3>
        <NCFeed ncs={ncs} />
      </div>

      {/* Chart - Plan 06-03 */}
      <div className="rounded-lg border border-dashed border-border p-6">
        <h3 className="text-sm font-medium text-foreground mb-2">Evolução Temporal</h3>
        <p className="text-sm text-foreground-muted">Em breve</p>
      </div>
    </div>
  )
}
