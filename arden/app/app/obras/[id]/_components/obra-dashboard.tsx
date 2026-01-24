'use client'

import { KPISection } from './kpi-section'
import type { DashboardKPIs } from '@/lib/supabase/queries/dashboard'

interface ObraDashboardProps {
  kpis: DashboardKPIs
  // Future props for NC feed and chart data:
  // ncs?: NCFeedItem[]
  // chartData?: ChartDataPoint[]
}

/**
 * Client component for the obra dashboard.
 * Receives pre-fetched data from Server Component and renders interactive UI.
 */
export function ObraDashboard({ kpis }: ObraDashboardProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <KPISection kpis={kpis} />

      {/* NC Feed - Plan 06-02 */}
      <div className="rounded-lg border border-dashed border-border p-6">
        <h3 className="text-sm font-medium text-foreground mb-2">Ultimas NCs</h3>
        <p className="text-sm text-foreground-muted">Em breve</p>
      </div>

      {/* Chart - Plan 06-03 */}
      <div className="rounded-lg border border-dashed border-border p-6">
        <h3 className="text-sm font-medium text-foreground mb-2">Evolucao Temporal</h3>
        <p className="text-sm text-foreground-muted">Em breve</p>
      </div>
    </div>
  )
}
