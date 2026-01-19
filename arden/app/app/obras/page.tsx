import { createClient } from '@/lib/supabase/server'
import { ObrasPageClient } from './_components/obras-page-client'
import type { Obra } from '@/lib/supabase/queries/obras'

export default async function ObrasPage() {
  const supabase = await createClient()

  // Fetch all obras (including archived) - client will filter
  const { data: obras, error } = await supabase
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching obras:', error)
  }

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-foreground">Gerenciar Obras</h1>
          <p className="text-sm text-foreground-light mt-1">
            Visualize e gerencie todas as obras da construtora
          </p>
        </div>

        {/* Content */}
        <ObrasPageClient initialObras={(obras as Obra[]) || []} />
      </div>
    </div>
  )
}
