import { createClient } from '@/lib/supabase/server'
import { TagsPageClient } from './_components/tags-page-client'
import type { Tag } from '@/lib/supabase/queries/tags'

// TODO: Replace with authenticated user's cliente_id from session
const DEV_CLIENTE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

export default async function TagsPage() {
  const supabase = await createClient()

  // Load all tags for the client
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .eq('cliente_id', DEV_CLIENTE_ID)
    .order('ordem', { ascending: true })

  if (error) {
    console.error('Error fetching tags:', error)
  }

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-foreground">Tags</h1>
          <p className="text-sm text-foreground-light mt-1">
            Organize itens de verificação em grupos
          </p>
        </div>
        <TagsPageClient initialTags={(tags as Tag[]) || []} />
      </div>
    </div>
  )
}
