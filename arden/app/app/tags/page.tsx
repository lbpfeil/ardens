import { createClient } from '@/lib/supabase/server'
import { TagsPageClient } from './_components/tags-page-client'
import type { Tag } from '@/lib/supabase/queries/tags'

export default async function TagsPage() {
  const supabase = await createClient()

  // Load all tags for the client
  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .order('ordem', { ascending: true })

  if (error) {
    console.error('Error fetching tags:', error)
  }

  return <TagsPageClient initialTags={(tags as Tag[]) || []} />
}
