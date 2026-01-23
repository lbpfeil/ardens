import { createClient } from '@/lib/supabase/client'

// Type definitions based on database schema
export interface ItemServico {
  id: string
  servico_id: string
  observacao: string
  metodo: string | null
  tolerancia: string | null
  tag_id: string | null  // Optional tag for categorization
  ordem: number
  created_at: string
  updated_at: string
}

export interface ItemServicoInsert {
  servico_id: string
  observacao: string
  metodo?: string | null
  tolerancia?: string | null
  tag_id?: string | null
  ordem?: number
}

export interface ItemServicoUpdate {
  observacao?: string
  metodo?: string | null
  tolerancia?: string | null
  tag_id?: string | null
  ordem?: number
}

/**
 * Lista itens de um servico.
 * Ordenado por ordem ASC.
 */
export async function listItensServico(servicoId: string): Promise<ItemServico[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('itens_servico')
    .select('*')
    .eq('servico_id', servicoId)
    .order('ordem', { ascending: true })

  if (error) {
    throw new Error(`Erro ao listar itens do servico: ${error.message}`)
  }

  return data || []
}

/**
 * Busca um item de servico pelo ID.
 */
export async function getItemServico(id: string): Promise<ItemServico> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('itens_servico')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Erro ao buscar item do servico: ${error.message}`)
  }

  return data
}

/**
 * Cria um novo item de servico.
 * Auto-assigns ordem as max(existing ordem) + 1 if not provided.
 */
export async function createItemServico(data: ItemServicoInsert): Promise<ItemServico> {
  const supabase = createClient()

  // Get current max ordem for this servico
  const { data: existing } = await supabase
    .from('itens_servico')
    .select('ordem')
    .eq('servico_id', data.servico_id)
    .order('ordem', { ascending: false })
    .limit(1)

  const nextOrdem = data.ordem ?? ((existing?.[0]?.ordem ?? -1) + 1)

  const { data: created, error } = await supabase
    .from('itens_servico')
    .insert({
      servico_id: data.servico_id,
      observacao: data.observacao,
      metodo: data.metodo,
      tolerancia: data.tolerancia,
      tag_id: data.tag_id,
      ordem: nextOrdem,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '42501') {
      throw new Error('Voce nao tem permissao para criar itens de servico')
    }
    throw new Error(`Erro ao criar item do servico: ${error.message}`)
  }

  return created
}

/**
 * Cria multiplos itens de servico em lote.
 * Auto-assigns ordem sequentially starting from max(existing ordem) + 1.
 */
export async function createItensServicoBatch(
  servicoId: string,
  items: Omit<ItemServicoInsert, 'servico_id' | 'ordem'>[]
): Promise<ItemServico[]> {
  const supabase = createClient()

  // Get current max ordem for this servico
  const { data: existing } = await supabase
    .from('itens_servico')
    .select('ordem')
    .eq('servico_id', servicoId)
    .order('ordem', { ascending: false })
    .limit(1)

  const startOrdem = (existing?.[0]?.ordem ?? -1) + 1

  const records = items.map((item, index) => ({
    servico_id: servicoId,
    observacao: item.observacao,
    metodo: item.metodo,
    tolerancia: item.tolerancia,
    tag_id: item.tag_id,
    ordem: startOrdem + index,
  }))

  const { data, error } = await supabase
    .from('itens_servico')
    .insert(records)
    .select()

  if (error) {
    throw new Error(`Erro ao criar itens do servico: ${error.message}`)
  }

  return data || []
}

/**
 * Atualiza um item de servico existente.
 */
export async function updateItemServico(id: string, updates: ItemServicoUpdate): Promise<ItemServico> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('itens_servico')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '42501') {
      throw new Error('Voce nao tem permissao para editar itens de servico')
    }
    throw new Error(`Erro ao atualizar item do servico: ${error.message}`)
  }

  return data
}

/**
 * Atualiza a ordem de todos os itens de um servico.
 * @param servicoId ID do servico
 * @param orderedIds Array de IDs na nova ordem desejada
 */
export async function updateItensOrder(
  servicoId: string,
  orderedIds: string[]
): Promise<void> {
  const supabase = createClient()

  // Use Promise.all for parallel updates
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('itens_servico')
      .update({ ordem: index })
      .eq('id', id)
      .eq('servico_id', servicoId) // Security: ensure belongs to servico
  )

  const results = await Promise.all(updates)
  const errors = results.filter(r => r.error)

  if (errors.length > 0) {
    throw new Error('Erro ao atualizar ordem dos itens')
  }
}

/**
 * Deleta um item de servico (hard delete).
 */
export async function deleteItemServico(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('itens_servico')
    .delete()
    .eq('id', id)

  if (error) {
    if (error.code === '42501') {
      throw new Error('Voce nao tem permissao para excluir itens de servico')
    }
    throw new Error(`Erro ao excluir item do servico: ${error.message}`)
  }
}

/**
 * Deleta multiplos itens de servico em lote (hard delete).
 */
export async function deleteItensServicoBatch(ids: string[]): Promise<void> {
  if (ids.length === 0) return

  const supabase = createClient()

  const { error } = await supabase
    .from('itens_servico')
    .delete()
    .in('id', ids)

  if (error) {
    throw new Error(`Erro ao excluir itens do servico: ${error.message}`)
  }
}
