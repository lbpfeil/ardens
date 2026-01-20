import { createClient } from '@/lib/supabase/client'

// Type definitions based on database schema
export interface Agrupamento {
  id: string
  obra_id: string
  nome: string
  ordem: number
  created_at: string
  updated_at: string
}

export interface AgrupamentoWithCount extends Agrupamento {
  unidades_count: number
}

export interface AgrupamentoInsert {
  nome: string
  ordem?: number
}

export interface AgrupamentoUpdate {
  nome?: string
  ordem?: number
}

/**
 * Lista agrupamentos de uma obra com contagem de unidades.
 * Ordenado por ordem ASC.
 */
export async function listAgrupamentos(obraId: string): Promise<AgrupamentoWithCount[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('agrupamentos')
    .select(`
      *,
      unidades_count:unidades(count)
    `)
    .eq('obra_id', obraId)
    .order('ordem', { ascending: true })

  if (error) {
    throw new Error(`Erro ao listar agrupamentos: ${error.message}`)
  }

  // Transform the count result from Supabase aggregation
  return (data || []).map(item => ({
    ...item,
    unidades_count: item.unidades_count?.[0]?.count ?? 0,
  }))
}

/**
 * Busca um agrupamento pelo ID.
 */
export async function getAgrupamento(id: string): Promise<Agrupamento> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('agrupamentos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Erro ao buscar agrupamento: ${error.message}`)
  }

  return data
}

/**
 * Cria um novo agrupamento.
 * Auto-assigns ordem as max(existing ordem) + 1.
 */
export async function createAgrupamento(obraId: string, data: AgrupamentoInsert): Promise<Agrupamento> {
  const supabase = createClient()

  // Get current max ordem for this obra
  const { data: existing } = await supabase
    .from('agrupamentos')
    .select('ordem')
    .eq('obra_id', obraId)
    .order('ordem', { ascending: false })
    .limit(1)

  const nextOrdem = data.ordem ?? ((existing?.[0]?.ordem ?? -1) + 1)

  const { data: created, error } = await supabase
    .from('agrupamentos')
    .insert({
      obra_id: obraId,
      nome: data.nome,
      ordem: nextOrdem,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar agrupamento: ${error.message}`)
  }

  return created
}

/**
 * Cria multiplos agrupamentos em lote.
 * Auto-assigns ordem sequentially starting from max(existing ordem) + 1.
 */
export async function createAgrupamentosBatch(
  obraId: string,
  names: string[]
): Promise<Agrupamento[]> {
  const supabase = createClient()

  // Get current max ordem for this obra
  const { data: existing } = await supabase
    .from('agrupamentos')
    .select('ordem')
    .eq('obra_id', obraId)
    .order('ordem', { ascending: false })
    .limit(1)

  const startOrdem = (existing?.[0]?.ordem ?? -1) + 1

  const records = names.map((nome, index) => ({
    obra_id: obraId,
    nome,
    ordem: startOrdem + index,
  }))

  const { data, error } = await supabase
    .from('agrupamentos')
    .insert(records)
    .select()

  if (error) {
    throw new Error(`Erro ao criar agrupamentos: ${error.message}`)
  }

  return data || []
}

/**
 * Atualiza um agrupamento existente.
 */
export async function updateAgrupamento(id: string, updates: AgrupamentoUpdate): Promise<Agrupamento> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('agrupamentos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar agrupamento: ${error.message}`)
  }

  return data
}

/**
 * Atualiza a ordem de todos os agrupamentos de uma obra.
 * @param obraId ID da obra
 * @param orderedIds Array de IDs na nova ordem desejada
 */
export async function updateAgrupamentosOrder(
  obraId: string,
  orderedIds: string[]
): Promise<void> {
  const supabase = createClient()

  // Use Promise.all for parallel updates
  const updates = orderedIds.map((id, index) =>
    supabase
      .from('agrupamentos')
      .update({ ordem: index })
      .eq('id', id)
      .eq('obra_id', obraId) // Security: ensure belongs to obra
  )

  const results = await Promise.all(updates)
  const errors = results.filter(r => r.error)

  if (errors.length > 0) {
    throw new Error('Erro ao atualizar ordem dos agrupamentos')
  }
}

/**
 * Deleta um agrupamento (hard delete).
 * Cascade deletes unidades per DB schema.
 */
export async function deleteAgrupamento(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('agrupamentos')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao deletar agrupamento: ${error.message}`)
  }
}
