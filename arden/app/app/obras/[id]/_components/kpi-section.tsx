'use client'

import { KPICard } from '@/components/ui/kpi-card'
import type { DashboardKPIs } from '@/lib/supabase/queries/dashboard'

interface KPISectionProps {
  kpis: DashboardKPIs
}

/**
 * Renders a responsive grid of 4 KPI cards for the obra dashboard.
 *
 * KPIs displayed:
 * 1. Taxa de Conformidade (percentage)
 * 2. IRS - Indice de Retrabalho (percentage)
 * 3. Verificacoes Pendentes (count)
 * 4. Verificacoes Concluidas (count)
 *
 * Each card shows current value and trend indicator vs previous month.
 */
export function KPISection({ kpis }: KPISectionProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Taxa de Conformidade"
        value={kpis.taxaConformidade.current}
        previousValue={kpis.taxaConformidade.previous}
        format="percent"
        description="Itens conformes vs total verificado"
      />
      <KPICard
        title="IRS"
        value={kpis.irs.current}
        previousValue={kpis.irs.previous}
        format="percent"
        description="Indice de Retrabalho"
      />
      <KPICard
        title="Verificacoes Pendentes"
        value={kpis.pendentes.current}
        previousValue={kpis.pendentes.previous}
        format="number"
        description="NCs aguardando reinspecao"
      />
      <KPICard
        title="Verificacoes Concluidas"
        value={kpis.concluidas.current}
        previousValue={kpis.concluidas.previous}
        format="number"
        description="Itens verificados no mes"
      />
    </div>
  )
}
