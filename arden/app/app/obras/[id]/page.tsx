import { notFound } from 'next/navigation'
import { getObra } from '@/lib/supabase/queries/obras'
import { ObraHeader } from './_components/obra-header'

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

      {/* KPI Cards - Placeholders */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Taxa de Conformidade"
          value="--"
          description="Sera calculado com verificacoes"
        />
        <KPICard
          title="IRS"
          value="--"
          description="Indice de Retrabalho"
        />
        <KPICard
          title="Verificacoes Pendentes"
          value="--"
          description="Aguardando inspecao"
        />
        <KPICard
          title="Verificacoes Concluidas"
          value="--"
          description="Ultimos 30 dias"
        />
      </div>

      {/* Recent NCs placeholder */}
      <div className="rounded-lg border border-dashed border-border p-6">
        <h3 className="text-sm font-medium text-foreground mb-2">Ultimas NCs</h3>
        <p className="text-sm text-foreground-muted">
          Nenhuma nao-conformidade registrada ainda.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-dashed border-border p-6">
        <h3 className="text-sm font-medium text-foreground mb-2">Acoes Rapidas</h3>
        <p className="text-sm text-foreground-muted">
          Links para unidades, servicos e verificacoes serao adicionados.
        </p>
      </div>
    </div>
  )
}

// Simple KPI card component (inline for now)
function KPICard({ title, value, description }: { title: string; value: string; description: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-100 p-4">
      <p className="text-xs text-foreground-muted uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
      <p className="text-xs text-foreground-muted mt-1">{description}</p>
    </div>
  )
}
