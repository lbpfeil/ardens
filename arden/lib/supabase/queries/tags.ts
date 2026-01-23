import { createClient } from '@/lib/supabase/client'

export interface Tag {
  id: string
  cliente_id: string
  nome: string
  cor: string
  ordem: number
  created_at: string
}

export interface TagInsert {
  nome: string
  cor: string
}

export interface TagUpdate {
  nome?: string
  cor?: string
}

// TODO: Replace with authenticated user's cliente_id from session
// For development/testing, using hardcoded test cliente_id
const DEV_CLIENTE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

// Preset colors for tag picker
export const TAG_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F97316', // Orange
] as const

/**
 * Lista tags do cliente atual.
 * Ordenado por ordem ASC.
 */
export async function listTags(): Promise<Tag[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('cliente_id', DEV_CLIENTE_ID)
    .order('ordem', { ascending: true })

  if (error) throw new Error(`Erro ao listar tags: ${error.message}`)
  return data || []
}

/**
 * Cria uma nova tag.
 * Auto-assigns ordem as max(existing ordem) + 1.
 */
export async function createTag(tag: TagInsert): Promise<Tag> {
  const supabase = createClient()

  // Get max ordem
  const { data: existing } = await supabase
    .from('tags')
    .select('ordem')
    .eq('cliente_id', DEV_CLIENTE_ID)
    .order('ordem', { ascending: false })
    .limit(1)

  const nextOrdem = (existing?.[0]?.ordem ?? -1) + 1

  const { data, error } = await supabase
    .from('tags')
    .insert({
      ...tag,
      cliente_id: DEV_CLIENTE_ID,
      ordem: nextOrdem,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Já existe uma tag com este nome')
    }
    throw new Error(`Erro ao criar tag: ${error.message}`)
  }
  return data
}

/**
 * Atualiza uma tag existente.
 */
export async function updateTag(id: string, updates: TagUpdate): Promise<Tag> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('tags')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Já existe uma tag com este nome')
    }
    throw new Error(`Erro ao atualizar tag: ${error.message}`)
  }
  return data
}

/**
 * Atualiza a ordem de todas as tags.
 * @param orderedIds Array de IDs na nova ordem desejada
 */
export async function updateTagsOrder(orderedIds: string[]): Promise<void> {
  const supabase = createClient()
  const updates = orderedIds.map((id, index) =>
    supabase.from('tags').update({ ordem: index }).eq('id', id)
  )
  const results = await Promise.all(updates)
  const errors = results.filter(r => r.error)
  if (errors.length > 0) {
    throw new Error('Erro ao atualizar ordem das tags')
  }
}

/**
 * Deleta uma tag (hard delete).
 * Itens de servico com esta tag terao tag_id setado para NULL.
 */
export async function deleteTag(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao excluir tag: ${error.message}`)
  }
}
