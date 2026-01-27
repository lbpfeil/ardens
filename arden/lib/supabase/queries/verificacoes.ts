import { SupabaseClient } from '@supabase/supabase-js'

// ============================================================================
// TIPOS: Matriz de Verificações (serviço x unidade)
// ============================================================================

export interface MatrizServico {
  id: string
  codigo: string
  nome: string
  categoria: string | null
}

export interface MatrizUnidade {
  id: string
  nome: string
  codigo: string | null
  ordem: number
}

export interface MatrizAgrupamento {
  id: string
  nome: string
  ordem: number
  unidades: MatrizUnidade[]
}

export interface MatrizVerificacao {
  id: string
  unidade_id: string
  servico_id: string
  status: 'pendente' | 'em_andamento' | 'concluida' | 'com_nc'
  total_itens: number
  itens_verificados: number
  itens_conformes: number
  itens_nc: number
  itens_excecao: number
  tem_reinspecao: boolean
}

export interface MatrizData {
  servicos: MatrizServico[]
  agrupamentos: MatrizAgrupamento[]
  verificacoesMap: Record<string, MatrizVerificacao> // chave: "servico_id:unidade_id"
}

// ============================================================================
// TIPOS: Verificação individual com itens
// ============================================================================

export interface ItemVerificacao {
  id: string
  item_servico_id: string
  status: string
  observacao: string | null
  data_inspecao: string | null
  status_reinspecao: string | null
  observacao_reinspecao: string | null
  data_reinspecao: string | null
  ciclos_reinspecao: number
  item_servico: {
    id: string
    observacao: string
    metodo: string | null
    tolerancia: string | null
    ordem: number
  }
}

export interface VerificacaoComItens {
  id: string
  obra_id: string
  unidade_id: string
  servico_id: string
  status: string
  descricao: string | null
  total_itens: number
  itens_verificados: number
  itens_conformes: number
  itens_nc: number
  itens_excecao: number
  data_inicio: string | null
  data_conclusao: string | null
  created_at: string
  itens: ItemVerificacao[]
}

// ============================================================================
// QUERY: Dados da Matriz (3 fetches paralelos)
// ============================================================================

/**
 * Busca todos os dados necessários para renderizar a matriz serviço x unidade.
 *
 * Executa 3 queries em paralelo via Promise.all:
 * 1. Serviços ativos da obra (via obra_servicos -> servicos)
 * 2. Agrupamentos com unidades (ordenados por ordem)
 * 3. Verificações existentes (convertidas em Map para lookup O(1))
 *
 * Aceita SupabaseClient como parâmetro para flexibilidade server/client.
 */
export async function getMatrizData(
  supabase: SupabaseClient,
  obraId: string
): Promise<MatrizData> {
  const [servicosResult, agrupamentosResult, verificacoesResult] =
    await Promise.all([
      // 1. Serviços ativos da obra
      supabase
        .from('obra_servicos')
        .select('servico:servicos(id, codigo, nome, categoria)')
        .eq('obra_id', obraId)
        .eq('ativo', true),

      // 2. Agrupamentos com unidades
      supabase
        .from('agrupamentos')
        .select('id, nome, ordem, unidades(id, nome, codigo, ordem)')
        .eq('obra_id', obraId)
        .order('ordem', { ascending: true }),

      // 3. Verificações da obra
      supabase
        .from('verificacoes')
        .select(
          'id, unidade_id, servico_id, status, total_itens, itens_verificados, itens_conformes, itens_nc, itens_excecao, tem_reinspecao'
        )
        .eq('obra_id', obraId),
    ])

  // Extrair serviços do resultado nested e ordenar por categoria + nome
  const servicos: MatrizServico[] = (servicosResult.data || [])
    .map((item: any) => item.servico as MatrizServico)
    .filter(Boolean)
    .sort((a: MatrizServico, b: MatrizServico) => {
      const catA = a.categoria || ''
      const catB = b.categoria || ''
      if (catA !== catB) return catA.localeCompare(catB)
      return a.nome.localeCompare(b.nome)
    })

  // Ordenar unidades dentro de cada agrupamento por ordem
  const agrupamentos: MatrizAgrupamento[] = (agrupamentosResult.data || []).map(
    (ag: any) => ({
      ...ag,
      unidades: (ag.unidades || []).sort(
        (a: MatrizUnidade, b: MatrizUnidade) => a.ordem - b.ordem
      ),
    })
  )

  // Construir Map de lookup O(1) por chave "servico_id:unidade_id"
  const verificacoesMap: Record<string, MatrizVerificacao> = {}
  for (const v of (verificacoesResult.data || []) as MatrizVerificacao[]) {
    verificacoesMap[`${v.servico_id}:${v.unidade_id}`] = v
  }

  return { servicos, agrupamentos, verificacoesMap }
}

// ============================================================================
// QUERY: Verificação individual com itens
// ============================================================================

/**
 * Busca uma verificação com todos os seus itens e dados do item_servico.
 * Itens são ordenados pela ordem definida no template (itens_servico.ordem).
 *
 * Aceita SupabaseClient como parâmetro para flexibilidade server/client.
 */
export async function getVerificacaoComItens(
  supabase: SupabaseClient,
  verificacaoId: string
): Promise<VerificacaoComItens | null> {
  const { data, error } = await supabase
    .from('verificacoes')
    .select(
      `
      id, obra_id, unidade_id, servico_id, status, descricao,
      total_itens, itens_verificados, itens_conformes, itens_nc, itens_excecao,
      data_inicio, data_conclusao, created_at,
      itens_verificacao(
        id, item_servico_id, status, observacao, data_inspecao,
        status_reinspecao, observacao_reinspecao, data_reinspecao, ciclos_reinspecao,
        item_servico:itens_servico(id, observacao, metodo, tolerancia, ordem)
      )
    `
    )
    .eq('id', verificacaoId)
    .single()

  if (error || !data) return null

  // Mapear e ordenar itens por ordem do item_servico
  const itens = ((data as any).itens_verificacao || [])
    .map((iv: any) => ({
      ...iv,
      item_servico: iv.item_servico,
    }))
    .sort(
      (a: any, b: any) =>
        (a.item_servico?.ordem ?? 0) - (b.item_servico?.ordem ?? 0)
    )

  return {
    ...(data as any),
    itens,
  } as VerificacaoComItens
}
