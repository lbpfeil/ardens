import { notFound } from 'next/navigation'
import { listAgrupamentos } from '@/lib/supabase/queries/agrupamentos'
import { getObra } from '@/lib/supabase/queries/obras'
import { AgrupamentosPageClient } from './_components/agrupamentos-page-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AgrupamentosPage({ params }: PageProps) {
  const { id } = await params

  try {
    const [obra, agrupamentos] = await Promise.all([
      getObra(id),
      listAgrupamentos(id),
    ])

    return (
      <div className="p-6 bg-background min-h-full">
        <div className="max-w-6xl mx-auto">
          <AgrupamentosPageClient
            obraId={id}
            obraNome={obra.nome}
            initialAgrupamentos={agrupamentos}
          />
        </div>
      </div>
    )
  } catch {
    notFound()
  }
}
