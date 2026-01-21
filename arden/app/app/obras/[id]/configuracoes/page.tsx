import { notFound } from 'next/navigation'
import { getObra } from '@/lib/supabase/queries/obras'
import { ObraInfoCard } from '../_components/obra-info-card'

interface ConfiguracoesPageProps {
  params: Promise<{ id: string }>
}

export default async function ConfiguracoesPage({ params }: ConfiguracoesPageProps) {
  const { id } = await params

  let obra
  try {
    obra = await getObra(id)
  } catch {
    notFound()
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Configuracoes</h1>
        <p className="text-sm text-foreground-muted">Gerencie as informacoes da obra</p>
      </div>

      {/* Cadastral Info */}
      <div className="max-w-xl">
        <ObraInfoCard obra={obra} />
      </div>

      {/* Placeholders for future settings */}
      <div className="rounded-lg border border-dashed border-border p-6">
        <h3 className="text-sm font-medium text-foreground mb-2">Servicos Habilitados</h3>
        <p className="text-sm text-foreground-muted">
          Configuracao de servicos FVS sera adicionada na Phase 5.
        </p>
      </div>

      <div className="rounded-lg border border-dashed border-border p-6">
        <h3 className="text-sm font-medium text-foreground mb-2">Estrutura da Obra</h3>
        <p className="text-sm text-foreground-muted">
          Configuracoes de agrupamentos e unidades. Acesse pelo menu "Unidades".
        </p>
      </div>
    </div>
  )
}
