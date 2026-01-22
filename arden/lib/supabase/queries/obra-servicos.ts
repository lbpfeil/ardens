import { createClient } from '@/lib/supabase/client'
import { Servico } from './servicos'

// Type definitions based on database schema
export interface ObraServico {
  id: string
  obra_id: string
  servico_id: string
  ativo: boolean
  revisao_ativa: string
  created_at: string
}

export interface ServicoWithActivation extends Servico {
  obra_servico_id: string | null
  ativo_na_obra: boolean
}

export interface ServicoWithRevisionStatus extends Servico {
  obra_servico_id: string | null
  ativo_na_obra: boolean
  revisao_ativa: string | null      // Revision this obra is using
  revisao_atual: string             // Current revision in biblioteca
  has_newer_revision: boolean       // True if biblioteca has newer
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
 * Captura a revisao atual do servico no momento da ativacao.
 */
export async function activateServico(obraId: string, servicoId: string): Promise<ObraServico> {
  const supabase = createClient()

  // Get current revision of the servico
  const { data: servico, error: servicoError } = await supabase
    .from('servicos')
    .select('revisao')
    .eq('id', servicoId)
    .single()

  if (servicoError) throw new Error(`Erro ao buscar servico: ${servicoError.message}`)

  // Upsert: insert if not exists, update ativo=true if exists
  const { data, error } = await supabase
    .from('obra_servicos')
    .upsert(
      {
        obra_id: obraId,
        servico_id: servicoId,
        ativo: true,
        revisao_ativa: servico.revisao || '00',
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
 * Captura a revisao atual de cada servico no momento da ativacao.
 */
export async function bulkActivateServicos(
  obraId: string,
  servicoIds: string[]
): Promise<ObraServico[]> {
  if (servicoIds.length === 0) return []

  const supabase = createClient()

  // Get current revisions for all servicos
  const { data: servicos, error: servicosError } = await supabase
    .from('servicos')
    .select('id, revisao')
    .in('id', servicoIds)

  if (servicosError) throw new Error(`Erro ao buscar servicos: ${servicosError.message}`)

  // Build revision map
  const revisionMap = new Map((servicos || []).map(s => [s.id, s.revisao]))

  const records = servicoIds.map(servicoId => ({
    obra_id: obraId,
    servico_id: servicoId,
    ativo: true,
    revisao_ativa: revisionMap.get(servicoId) || '00',
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

/**
 * Atualiza revisao de um servico na obra para a versao mais recente.
 */
export async function updateObraServicoRevision(
  obraId: string,
  servicoId: string
): Promise<ObraServico> {
  const supabase = createClient()

  // Get current servico revision
  const { data: servico, error: servicoError } = await supabase
    .from('servicos')
    .select('revisao')
    .eq('id', servicoId)
    .single()

  if (servicoError) throw new Error(`Erro ao buscar servico: ${servicoError.message}`)

  // Update obra_servicos to latest revision
  const { data, error } = await supabase
    .from('obra_servicos')
    .update({ revisao_ativa: servico.revisao })
    .eq('obra_id', obraId)
    .eq('servico_id', servicoId)
    .select()
    .single()

  if (error) throw new Error(`Erro ao atualizar revisao: ${error.message}`)

  return data
}

/**
 * Lista servicos para obra com status de revisao.
 * Inclui indicador se ha revisao mais nova disponivel.
 */
export async function listServicosForObraWithRevision(
  obraId: string
): Promise<ServicoWithRevisionStatus[]> {
  const supabase = createClient()

  // Get all non-archived servicos
  const { data: servicos, error: servicosError } = await supabase
    .from('servicos')
    .select('*')
    .eq('arquivado', false)
    .order('categoria', { ascending: true })
    .order('nome', { ascending: true })

  if (servicosError) throw new Error(`Erro ao listar servicos: ${servicosError.message}`)

  // Get obra_servicos for this obra
  const { data: obraServicos, error: obraServicosError } = await supabase
    .from('obra_servicos')
    .select('id, servico_id, ativo, revisao_ativa')
    .eq('obra_id', obraId)

  if (obraServicosError) throw new Error(`Erro ao listar obra_servicos: ${obraServicosError.message}`)

  // Build map for quick lookup
  const obraServicoMap = new Map(
    (obraServicos || []).map(os => [os.servico_id, os])
  )

  // Merge with revision status
  return (servicos || []).map(servico => {
    const obraServico = obraServicoMap.get(servico.id)
    const revisaoAtiva = obraServico?.revisao_ativa ?? null
    const revisaoAtual = servico.revisao || '00'
    const hasNewer = revisaoAtiva !== null &&
      parseInt(revisaoAtiva, 10) < parseInt(revisaoAtual, 10)

    return {
      ...servico,
      obra_servico_id: obraServico?.id ?? null,
      ativo_na_obra: !!obraServico?.ativo,
      revisao_ativa: revisaoAtiva,
      revisao_atual: revisaoAtual,
      has_newer_revision: hasNewer,
    } as ServicoWithRevisionStatus
  })
}
