import { createClient } from '@/lib/supabase/client'

// Type definitions based on database schema
export interface Unidade {
  id: string
  agrupamento_id: string
  nome: string
  codigo: string | null
  ordem: number
  created_at: string
  updated_at: string
}

export interface UnidadeInsert {
  nome: string
  codigo?: string | null
  ordem?: number
}

export interface UnidadeUpdate {
  nome?: string
  codigo?: string | null
  ordem?: number
}

// Natural sort collator for alphanumeric ordering (Apto 2 before Apto 10)
const naturalCollator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})

/**
 * Lista unidades de um agrupamento.
 * Ordenado por ordem ASC do banco, depois natural sort pelo nome.
 */
export async function listUnidades(agrupamentoId: string): Promise<Unidade[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('unidades')
    .select('*')
    .eq('agrupamento_id', agrupamentoId)
    .order('ordem', { ascending: true })

  if (error) {
    throw new Error(`Erro ao listar unidades: ${error.message}`)
  }

  // Apply natural sort client-side for alphanumeric ordering
  return (data || []).sort((a, b) => naturalCollator.compare(a.nome, b.nome))
}

/**
 * Cria uma nova unidade.
 * Auto-assigns ordem as max(existing ordem) + 1.
 */
export async function createUnidade(
  agrupamentoId: string,
  data: UnidadeInsert
): Promise<Unidade> {
  const supabase = createClient()

  // Get current max ordem for this agrupamento
  const { data: existing } = await supabase
    .from('unidades')
    .select('ordem')
    .eq('agrupamento_id', agrupamentoId)
    .order('ordem', { ascending: false })
    .limit(1)

  const nextOrdem = data.ordem ?? ((existing?.[0]?.ordem ?? -1) + 1)

  const { data: created, error } = await supabase
    .from('unidades')
    .insert({
      agrupamento_id: agrupamentoId,
      nome: data.nome,
      codigo: data.codigo ?? null,
      ordem: nextOrdem,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar unidade: ${error.message}`)
  }

  return created
}

/**
 * Cria multiplas unidades em lote.
 * Auto-assigns ordem sequentially starting from max(existing ordem) + 1.
 */
export async function createUnidadesBatch(
  agrupamentoId: string,
  names: string[]
): Promise<Unidade[]> {
  const supabase = createClient()

  // Get current max ordem for this agrupamento
  const { data: existing } = await supabase
    .from('unidades')
    .select('ordem')
    .eq('agrupamento_id', agrupamentoId)
    .order('ordem', { ascending: false })
    .limit(1)

  const startOrdem = (existing?.[0]?.ordem ?? -1) + 1

  const records = names.map((nome, index) => ({
    agrupamento_id: agrupamentoId,
    nome,
    ordem: startOrdem + index,
  }))

  const { data, error } = await supabase
    .from('unidades')
    .insert(records)
    .select()

  if (error) {
    throw new Error(`Erro ao criar unidades: ${error.message}`)
  }

  return data || []
}

/**
 * Atualiza uma unidade existente.
 */
export async function updateUnidade(
  id: string,
  updates: UnidadeUpdate
): Promise<Unidade> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('unidades')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar unidade: ${error.message}`)
  }

  return data
}

/**
 * Deleta uma unidade (hard delete).
 */
export async function deleteUnidade(id: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('unidades')
    .delete()
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao deletar unidade: ${error.message}`)
  }
}
