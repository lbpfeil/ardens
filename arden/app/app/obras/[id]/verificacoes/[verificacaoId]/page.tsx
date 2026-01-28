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

  // Fetch context names using FK IDs from the verification
  const [servicoRes, unidadeRes, obraRes] = await Promise.all([
    supabase.from('servicos').select('nome, codigo').eq('id', verificacao.servico_id).single(),
    supabase.from('unidades').select('nome').eq('id', verificacao.unidade_id).single(),
    supabase.from('obras').select('nome').eq('id', verificacao.obra_id).single(),
  ])

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-4xl mx-auto">
        <VerificacaoIndividualClient
          verificacao={verificacao}
          servicoNome={servicoRes.data?.nome}
          servicoCodigo={servicoRes.data?.codigo}
          unidadeNome={unidadeRes.data?.nome}
          obraNome={obraRes.data?.nome}
          obraId={obraId}
        />
      </div>
    </div>
  )
}
