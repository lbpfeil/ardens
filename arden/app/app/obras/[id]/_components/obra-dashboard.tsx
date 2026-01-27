'use client'

import { KPISection } from './kpi-section'
import { NCFeed } from './nc-feed'
import { ConformidadeChart } from './conformidade-chart'
import type { DashboardKPIs, NCFeedItem, ChartDataPoint } from '@/lib/supabase/queries/dashboard'

interface ObraDashboardProps {
  obraId: string
  kpis: DashboardKPIs
  ncs: NCFeedItem[]
  chartData: ChartDataPoint[]
}

/**
 * Client component for the obra dashboard.
 * Receives pre-fetched data from Server Component and renders interactive UI.
 */
export function ObraDashboard({ obraId, kpis, ncs, chartData }: ObraDashboardProps) {
  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <KPISection kpis={kpis} />

      {/* NC Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Últimas Não-Conformidades</h3>
        <NCFeed ncs={ncs} obraId={obraId} />
      </div>

      {/* Conformidade Chart */}
      <ConformidadeChart data={chartData} />
    </div>
  )
}
