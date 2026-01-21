import { createClient } from '@/lib/supabase/client'

// Type definitions based on database schema
export type CategoriaServico =
  | 'fundacao'
  | 'estrutura'
  | 'alvenaria'
  | 'revestimento'
  | 'acabamento'
  | 'instalacoes'
  | 'cobertura'
  | 'esquadrias'
  | 'pintura'
  | 'impermeabilizacao'
  | 'outros'

export interface Servico {
  id: string
  cliente_id: string
  codigo: string
  nome: string
  categoria: CategoriaServico | null
  referencia_normativa: string | null
  ativo: boolean
  arquivado: boolean
  created_at: string
  updated_at: string
}

export interface ServicoInsert {
  codigo: string
  nome: string
  categoria?: CategoriaServico | null
  referencia_normativa?: string | null
}

export interface ServicoUpdate {
  codigo?: string
  nome?: string
  categoria?: CategoriaServico | null
  referencia_normativa?: string | null
  arquivado?: boolean
}

// TODO: Replace with authenticated user's cliente_id from session
// For development/testing, using hardcoded test cliente_id
const DEV_CLIENTE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

/**
 * Lista servicos do cliente atual.
 * RLS filtra automaticamente por cliente_id.
 */
export async function listServicos(options?: { includeArchived?: boolean }): Promise<Servico[]> {
  const supabase = createClient()

  let query = supabase
    .from('servicos')
    .select('*')
    .order('created_at', { ascending: false })

  if (!options?.includeArchived) {
    query = query.eq('arquivado', false)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Erro ao listar servicos: ${error.message}`)
  }

  return data || []
}

/**
 * Busca um servico pelo ID.
 */
export async function getServico(id: string): Promise<Servico> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('servicos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Erro ao buscar servico: ${error.message}`)
  }

  return data
}

/**
 * Cria um novo servico.
 * Requer permissao de admin (RLS).
 */
export async function createServico(servico: ServicoInsert): Promise<Servico> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('servicos')
    .insert({
      ...servico,
      cliente_id: DEV_CLIENTE_ID,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ja existe um servico com este codigo')
    }
    if (error.code === '42501') {
      throw new Error('Voce nao tem permissao para criar servicos')
    }
    throw new Error(`Erro ao criar servico: ${error.message}`)
  }

  return data
}

/**
 * Atualiza um servico existente.
 * Requer permissao de admin (RLS).
 */
export async function updateServico(id: string, updates: ServicoUpdate): Promise<Servico> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('servicos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      throw new Error('Ja existe um servico com este codigo')
    }
    if (error.code === '42501') {
      throw new Error('Voce nao tem permissao para editar servicos')
    }
    throw new Error(`Erro ao atualizar servico: ${error.message}`)
  }

  return data
}

/**
 * Arquiva um servico (soft delete).
 */
export async function archiveServico(id: string): Promise<Servico> {
  return updateServico(id, { arquivado: true })
}

/**
 * Restaura um servico arquivado.
 */
export async function restoreServico(id: string): Promise<Servico> {
  return updateServico(id, { arquivado: false })
}
