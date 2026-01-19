import { notFound } from 'next/navigation'
import { getObra } from '@/lib/supabase/queries/obras'
import { ObraHeader } from './_components/obra-header'
import { ObraInfoCard } from './_components/obra-info-card'

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

  return (
    <div className="space-y-6 p-6">
      <ObraHeader obra={obra} />

      <div className="grid gap-6 md:grid-cols-2">
        <ObraInfoCard obra={obra} />

        {/* Placeholder for future content */}
        <div className="rounded-lg border border-dashed border-border p-6">
          <p className="text-center text-sm text-foreground-muted">
            KPIs e dashboard serao adicionados na Phase 6
          </p>
        </div>
      </div>

      {/* Placeholder for agrupamentos/unidades */}
      <div className="rounded-lg border border-dashed border-border p-6">
        <p className="text-center text-sm text-foreground-muted">
          Agrupamentos e unidades serao adicionados nas Phases 3 e 4
        </p>
      </div>
    </div>
  )
}
