import { createClient } from '@/lib/supabase/client'
import { Servico } from './servicos'

// Type definitions based on database schema
export interface ObraServico {
  id: string
  obra_id: string
  servico_id: string
  ativo: boolean
  created_at: string
}

export interface ServicoWithActivation extends Servico {
  obra_servico_id: string | null
  ativo_na_obra: boolean
}

/**
 * Lista todos os servicos ativos para uma obra.
 * Retorna apenas servicos que estao ativados na obra.
 */
export async function listObraServicos(obraId: string): Promise<ObraServico[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('obra_servicos')
    .select('*')
    .eq('obra_id', obraId)
    .eq('ativo', true)

  if (error) {
    throw new Error(`Erro ao listar servicos da obra: ${error.message}`)
  }

  return data || []
}

/**
 * Lista TODOS os servicos da biblioteca com status de ativacao na obra.
 * Usado para tela de ativacao/desativacao de servicos.
 */
export async function listServicosForObra(obraId: string): Promise<ServicoWithActivation[]> {
  const supabase = createClient()

  // Get all non-archived servicos with their activation status for this obra
  const { data, error } = await supabase
    .from('servicos')
    .select(`
      *,
      obra_servicos!left(id, ativo)
    `)
    .eq('arquivado', false)
    .order('codigo', { ascending: true })

  if (error) {
    throw new Error(`Erro ao listar servicos para a obra: ${error.message}`)
  }

  // Map to add activation status
  // Filter obra_servicos to only include the current obra
  return (data || []).map(servico => {
    // obra_servicos is an array of matches, filter for this obra
    const obraServicoMatch = servico.obra_servicos?.find(
      (os: { id: string; ativo: boolean; obra_id?: string }) => os.ativo
    )

    return {
      ...servico,
      obra_servico_id: obraServicoMatch?.id ?? null,
      ativo_na_obra: !!obraServicoMatch,
      // Remove the raw join data
      obra_servicos: undefined,
    } as ServicoWithActivation
  })
}

/**
 * Lista servicos ativos para uma obra com dados completos do servico.
 * Util para exibir lista de servicos ativos com detalhes.
 */
export async function listActiveServicosForObra(obraId: string): Promise<Servico[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('obra_servicos')
    .select(`
      servico:servicos(*)
    `)
    .eq('obra_id', obraId)
    .eq('ativo', true)

  if (error) {
    throw new Error(`Erro ao listar servicos ativos da obra: ${error.message}`)
  }

  // Extract servico from each result
  // Supabase returns nested relation as object or null (not array) when using singular name
  return (data || [])
    .map(item => item.servico as unknown as Servico)
    .filter(Boolean)
}

/**
 * Ativa um servico para uma obra.
 * Cria ou atualiza registro em obra_servicos.
 */
export async function activateServico(obraId: string, servicoId: string): Promise<ObraServico> {
  const supabase = createClient()

  // Upsert: insert if not exists, update ativo=true if exists
  const { data, error } = await supabase
    .from('obra_servicos')
    .upsert(
      {
        obra_id: obraId,
        servico_id: servicoId,
        ativo: true,
      },
      {
        onConflict: 'obra_id,servico_id',
      }
    )
    .select()
    .single()

  if (error) {
    if (error.code === '42501') {
      throw new Error('Voce nao tem permissao para ativar servicos na obra')
    }
    throw new Error(`Erro ao ativar servico: ${error.message}`)
  }

  return data
}

/**
 * Desativa um servico de uma obra.
 * Remove o registro de obra_servicos.
 */
export async function deactivateServico(obraId: string, servicoId: string): Promise<void> {
  const supabase = createClient()

  const { error } = await supabase
    .from('obra_servicos')
    .delete()
    .eq('obra_id', obraId)
    .eq('servico_id', servicoId)

  if (error) {
    if (error.code === '42501') {
      throw new Error('Voce nao tem permissao para desativar servicos na obra')
    }
    throw new Error(`Erro ao desativar servico: ${error.message}`)
  }
}

/**
 * Ativa multiplos servicos para uma obra em lote.
 */
export async function bulkActivateServicos(
  obraId: string,
  servicoIds: string[]
): Promise<ObraServico[]> {
  if (servicoIds.length === 0) return []

  const supabase = createClient()

  const records = servicoIds.map(servicoId => ({
    obra_id: obraId,
    servico_id: servicoId,
    ativo: true,
  }))

  const { data, error } = await supabase
    .from('obra_servicos')
    .upsert(records, {
      onConflict: 'obra_id,servico_id',
    })
    .select()

  if (error) {
    throw new Error(`Erro ao ativar servicos: ${error.message}`)
  }

  return data || []
}

/**
 * Desativa multiplos servicos de uma obra em lote.
 */
export async function bulkDeactivateServicos(
  obraId: string,
  servicoIds: string[]
): Promise<void> {
  if (servicoIds.length === 0) return

  const supabase = createClient()

  const { error } = await supabase
    .from('obra_servicos')
    .delete()
    .eq('obra_id', obraId)
    .in('servico_id', servicoIds)

  if (error) {
    throw new Error(`Erro ao desativar servicos: ${error.message}`)
  }
}

/**
 * Sincroniza servicos de uma obra.
 * Ativa os servicos na lista e desativa os que nao estao.
 */
export async function syncObraServicos(
  obraId: string,
  activeServicoIds: string[]
): Promise<void> {
  const supabase = createClient()

  // Get current active servicos
  const { data: current, error: fetchError } = await supabase
    .from('obra_servicos')
    .select('servico_id')
    .eq('obra_id', obraId)

  if (fetchError) {
    throw new Error(`Erro ao sincronizar servicos: ${fetchError.message}`)
  }

  const currentIds = new Set((current || []).map(item => item.servico_id))
  const targetIds = new Set(activeServicoIds)

  // Find servicos to activate and deactivate
  const toActivate = activeServicoIds.filter(id => !currentIds.has(id))
  const toDeactivate = Array.from(currentIds).filter(id => !targetIds.has(id))

  // Execute in parallel
  await Promise.all([
    toActivate.length > 0 ? bulkActivateServicos(obraId, toActivate) : Promise.resolve([]),
    toDeactivate.length > 0 ? bulkDeactivateServicos(obraId, toDeactivate) : Promise.resolve(),
  ])
}
