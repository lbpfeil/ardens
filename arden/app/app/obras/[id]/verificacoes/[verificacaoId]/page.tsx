import { createClient } from '@/lib/supabase/server'
import { getVerificacaoComItens } from '@/lib/supabase/queries/verificacoes'
import { VerificacaoIndividualClient } from './_components/verificacao-individual-client'

interface PageProps {
  params: Promise<{
    id: string
    verificacaoId: string
  }>
}

export default async function VerificacaoIndividualPage({ params }: PageProps) {
  const { id: obraId, verificacaoId } = await params
  const supabase = await createClient()

  // Fetch verification with items
  const verificacao = await getVerificacaoComItens(supabase, verificacaoId)

  if (!verificacao) {
    return (
      <div className="p-6 bg-background min-h-full">
        <div className="max-w-4xl mx-auto">
          <p className="text-foreground-light">Verificação não encontrada</p>
        </div>
      </div>
    )
  }

  // Fetch context (service name, unit name, obra name)
  const { data: context } = await supabase
    .from('verificacoes')
    .select('servicos(nome, codigo), unidades(nome), obras(nome)')
    .eq('id', verificacaoId)
    .single()

  // Extract single objects from arrays (Supabase many-to-one relationships)
  const servico = (context?.servicos as any)?.[0]
  const unidade = (context?.unidades as any)?.[0]
  const obra = (context?.obras as any)?.[0]

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-4xl mx-auto">
        <VerificacaoIndividualClient
          verificacao={verificacao}
          servicoNome={servico?.nome}
          servicoCodigo={servico?.codigo}
          unidadeNome={unidade?.nome}
          obraNome={obra?.nome}
        />
      </div>
    </div>
  )
}
