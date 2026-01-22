import { createClient } from '@/lib/supabase/client'
import type { CategoriaServico } from './servicos'

export interface ServicoRevisao {
  id: string
  servico_id: string
  revisao: string
  descricao: string
  snapshot_codigo: string
  snapshot_nome: string
  snapshot_categoria: CategoriaServico | null
  snapshot_referencia_normativa: string | null
  created_at: string
  created_by: string | null
}

export interface ServicoRevisaoInsert {
  servico_id: string
  revisao: string
  descricao: string
  snapshot_codigo: string
  snapshot_nome: string
  snapshot_categoria?: CategoriaServico | null
  snapshot_referencia_normativa?: string | null
}

/**
 * Lista historico de revisoes de um servico.
 * Ordenado do mais recente para o mais antigo.
 */
export async function listServicoRevisoes(servicoId: string): Promise<ServicoRevisao[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('servico_revisoes')
    .select('*')
    .eq('servico_id', servicoId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erro ao listar revisoes: ${error.message}`)
  }

  return data || []
}

/**
 * Cria registro de revisao no historico.
 * Chamado internamente por updateServicoWithRevision.
 */
export async function createServicoRevisao(
  data: ServicoRevisaoInsert
): Promise<ServicoRevisao> {
  const supabase = createClient()

  const { data: revisao, error } = await supabase
    .from('servico_revisoes')
    .insert(data)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar revisao: ${error.message}`)
  }

  return revisao
}

/**
 * Busca ultima revisao de um servico.
 */
export async function getLatestServicoRevisao(
  servicoId: string
): Promise<ServicoRevisao | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('servico_revisoes')
    .select('*')
    .eq('servico_id', servicoId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned
    throw new Error(`Erro ao buscar revisao: ${error.message}`)
  }

  return data || null
}
