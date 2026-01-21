import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ServicoDetailClient } from './_components/servico-detail-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ServicoDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch servico
  const { data: servico, error: servicoError } = await supabase
    .from('servicos')
    .select('*')
    .eq('id', id)
    .single()

  if (servicoError || !servico) {
    notFound()
  }

  // Fetch itens
  const { data: itens, error: itensError } = await supabase
    .from('itens_servico')
    .select('*')
    .eq('servico_id', id)
    .order('ordem', { ascending: true })

  if (itensError) {
    console.error('Error fetching itens:', itensError)
  }

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-6xl mx-auto">
        <ServicoDetailClient servico={servico} initialItens={itens || []} />
      </div>
    </div>
  )
}
