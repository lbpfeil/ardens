import { notFound } from 'next/navigation'
import { getObra } from '@/lib/supabase/queries/obras'
import { ServicosActivationClient } from './_components/servicos-activation-client'
import { createClient } from '@/lib/supabase/server'
import type { ServicoWithRevisionStatus } from '@/lib/supabase/queries/obra-servicos'

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

  const supabase = await createClient()

  // Fetch all non-archived servicos with revision info
  const { data: servicos, error: servicosError } = await supabase
    .from('servicos')
    .select('*')
    .eq('arquivado', false)
    .order('categoria', { ascending: true })
    .order('nome', { ascending: true })

  if (servicosError) {
    console.error('Error fetching servicos:', servicosError)
  }

  // Fetch obra_servicos with revision info for this obra
  const { data: obraServicos, error: obraServicosError } = await supabase
    .from('obra_servicos')
    .select('id, servico_id, ativo, revisao_ativa')
    .eq('obra_id', obraId)

  if (obraServicosError) {
    console.error('Error fetching obra_servicos:', obraServicosError)
  }

  // Merge to get activation and revision status
  const obraServicoMap = new Map(
    (obraServicos || []).map(os => [os.servico_id, {
      id: os.id,
      ativo: os.ativo,
      revisao_ativa: os.revisao_ativa || '00',
    }])
  )

  const servicosWithRevision: ServicoWithRevisionStatus[] = (servicos || []).map(s => {
    const obraServico = obraServicoMap.get(s.id)
    const revisaoAtiva = obraServico?.revisao_ativa ?? null
    const revisaoAtual = s.revisao || '00'
    // Compare as integers to handle "09" < "10" correctly
    const hasNewer = revisaoAtiva !== null &&
      parseInt(revisaoAtiva, 10) < parseInt(revisaoAtual, 10)

    return {
      ...s,
      obra_servico_id: obraServico?.id || null,
      ativo_na_obra: !!obraServico?.ativo,
      revisao_ativa: revisaoAtiva,
      revisao_atual: revisaoAtual,
      has_newer_revision: hasNewer,
    }
  })

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-foreground">Servicos da Obra</h1>
          <p className="text-sm text-foreground-light mt-1">
            Selecione os servicos que serao verificados nesta obra
          </p>
        </div>
        <ServicosActivationClient
          obraId={obraId}
          initialServicos={servicosWithRevision}
        />
      </div>
    </div>
  )
}
