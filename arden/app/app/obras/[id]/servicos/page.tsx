import { notFound } from 'next/navigation'
import { getObra } from '@/lib/supabase/queries/obras'
import { ServicosActivationClient } from './_components/servicos-activation-client'
import { createClient } from '@/lib/supabase/server'
import type { ServicoWithActivation } from '@/lib/supabase/queries/obra-servicos'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ObraServicosPage({ params }: PageProps) {
  const { id: obraId } = await params

  // Verify obra exists
  try {
    await getObra(obraId)
  } catch {
    notFound()
  }

  // Fetch all servicos
  const supabase = await createClient()
  const { data: servicos, error: servicosError } = await supabase
    .from('servicos')
    .select('*')
    .eq('arquivado', false)
    .order('categoria', { ascending: true })
    .order('nome', { ascending: true })

  if (servicosError) {
    console.error('Error fetching servicos:', servicosError)
  }

  // Fetch obra_servicos for this obra
  const { data: obraServicos, error: obraServicosError } = await supabase
    .from('obra_servicos')
    .select('id, servico_id, ativo')
    .eq('obra_id', obraId)

  if (obraServicosError) {
    console.error('Error fetching obra_servicos:', obraServicosError)
  }

  // Merge to get activation status
  const activeMap = new Map(
    (obraServicos || []).map(os => [os.servico_id, { id: os.id, ativo: os.ativo }])
  )
  const servicosWithActivation: ServicoWithActivation[] = (servicos || []).map(s => ({
    ...s,
    obra_servico_id: activeMap.get(s.id)?.id || null,
    ativo_na_obra: activeMap.get(s.id)?.ativo ?? false,
  }))

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-foreground">Servicos da Obra</h1>
          <p className="text-sm text-foreground-light mt-1">
            Selecione os servicos que serao verificados nesta obra
          </p>
        </div>
        <ServicosActivationClient
          obraId={obraId}
          initialServicos={servicosWithActivation}
        />
      </div>
    </div>
  )
}
