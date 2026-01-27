import { createClient } from '@/lib/supabase/server'
import { getMatrizData } from '@/lib/supabase/queries/verificacoes'
import { MatrizClient } from './_components/matriz-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VerificacoesPage({ params }: PageProps) {
  const { id: obraId } = await params
  const supabase = await createClient()

  const matrizData = await getMatrizData(supabase, obraId)

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-full mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-foreground">Verificações</h1>
          <p className="text-sm text-foreground-light mt-1">
            Matriz de verificações da obra
          </p>
        </div>
        <MatrizClient initialData={matrizData} obraId={obraId} />
      </div>
    </div>
  )
}
