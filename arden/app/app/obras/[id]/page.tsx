import { notFound } from 'next/navigation'
import { getObra } from '@/lib/supabase/queries/obras'
import { getDashboardKPIs } from '@/lib/supabase/queries/dashboard'
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

  // Fetch dashboard KPIs
  const kpis = await getDashboardKPIs(id)

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-6xl mx-auto space-y-6">
        <ObraHeader obra={obra} />
        <ObraDashboard kpis={kpis} />
      </div>
    </div>
  )
}
