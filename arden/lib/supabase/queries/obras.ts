import { createClient } from '@/lib/supabase/client'

// Type definitions based on database schema
// Note: Full Supabase types should be generated later with `supabase gen types`
export interface Obra {
  id: string
  cliente_id: string
  nome: string
  codigo: string | null
  tipologia: 'residencial_horizontal' | 'residencial_vertical' | 'comercial' | 'retrofit' | 'misto' | null
  latitude: number | null
  longitude: number | null
  responsavel_tecnico: string | null
  ativo: boolean
  arquivada: boolean
  config: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface ObraInsert {
  nome: string
  codigo?: string | null
  tipologia?: Obra['tipologia']
  latitude?: number | null
  longitude?: number | null
  responsavel_tecnico?: string | null
}

export interface ObraUpdate {
  nome?: string
  codigo?: string | null
  tipologia?: Obra['tipologia']
  latitude?: number | null
  longitude?: number | null
  responsavel_tecnico?: string | null
  arquivada?: boolean
}

/**
 * Lista obras do cliente atual.
 * RLS filtra automaticamente por cliente_id.
 */
export async function listObras(options?: { includeArchived?: boolean }): Promise<Obra[]> {
  const supabase = createClient()

  let query = supabase
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false })

  if (!options?.includeArchived) {
    query = query.eq('arquivada', false)
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Erro ao listar obras: ${error.message}`)
  }

  return data || []
}

/**
 * Busca uma obra pelo ID.
 */
export async function getObra(id: string): Promise<Obra> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('obras')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw new Error(`Erro ao buscar obra: ${error.message}`)
  }

  return data
}

// TODO: Replace with authenticated user's cliente_id from session
// For development/testing, using hardcoded test cliente_id
const DEV_CLIENTE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'

/**
 * Cria uma nova obra.
 * Requer permissao de admin (RLS).
 */
export async function createObra(obra: ObraInsert): Promise<Obra> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('obras')
    .insert({
      ...obra,
      cliente_id: DEV_CLIENTE_ID,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '42501') {
      throw new Error('Voce nao tem permissao para criar obras')
    }
    throw new Error(`Erro ao criar obra: ${error.message}`)
  }

  return data
}

/**
 * Atualiza uma obra existente.
 * Requer permissao de admin (RLS).
 */
export async function updateObra(id: string, updates: ObraUpdate): Promise<Obra> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('obras')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    if (error.code === '42501') {
      throw new Error('Voce nao tem permissao para editar obras')
    }
    throw new Error(`Erro ao atualizar obra: ${error.message}`)
  }

  return data
}

/**
 * Arquiva uma obra (soft delete).
 */
export async function archiveObra(id: string): Promise<Obra> {
  return updateObra(id, { arquivada: true })
}

/**
 * Restaura uma obra arquivada.
 */
export async function restoreObra(id: string): Promise<Obra> {
  return updateObra(id, { arquivada: false })
}
