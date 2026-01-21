import { createClient } from '@/lib/supabase/server'
import { BibliotecaPageClient } from './_components/biblioteca-page-client'
import type { Servico } from '@/lib/supabase/queries/servicos'

export default async function BibliotecaPage() {
  const supabase = await createClient()

  // Load all servicos (including archived) for client-side filtering
  const { data: servicos, error } = await supabase
    .from('servicos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching servicos:', error)
  }

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-foreground">Biblioteca FVS</h1>
          <p className="text-sm text-foreground-light mt-1">
            Gerencie os servicos de verificacao da construtora
          </p>
        </div>
        <BibliotecaPageClient initialServicos={(servicos as Servico[]) || []} />
      </div>
    </div>
  )
}
