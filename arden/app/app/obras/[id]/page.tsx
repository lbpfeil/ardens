import { notFound } from 'next/navigation'
import { getObra } from '@/lib/supabase/queries/obras'
import { getDashboardKPIs, getRecentNCs, getConformidadeTimeSeries } from '@/lib/supabase/queries/dashboard'
import { ObraHeader } from './_components/obra-header'
import { ObraDashboard } from './_components/obra-dashboard'

interface ObraPageProps {
  params: Promise<{ id: string }>
}

export default async function ObraPage({ params }: ObraPageProps) {
  const { id } = await params

  let obra
  try {
    obra = await getObra(id)
  } catch {
    notFound()
  }

  // Fetch all dashboard data in parallel
  const [kpis, ncs, chartData] = await Promise.all([
    getDashboardKPIs(id),
    getRecentNCs(id),
    getConformidadeTimeSeries(id)
  ])

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        <ObraHeader obra={obra} />
        <ObraDashboard obraId={id} kpis={kpis} ncs={ncs} chartData={chartData} />
      </div>
    </div>
  )
}
