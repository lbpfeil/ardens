'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  criarVerificacaoSchema,
  atualizarResultadoSchema,
  atualizarStatusSchema,
  atualizarDescricaoSchema,
  type CriarVerificacaoInput,
  type AtualizarResultadoInput,
  type AtualizarStatusInput,
  type AtualizarDescricaoInput,
  type ActionResult,
} from '@/lib/validations/verificacao'

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Verifica se uma verificação está travada (Conforme concluída).
 * Uma verificação concluída com todos os itens conformes não pode ser alterada.
 */
function isVerificacaoTravada(verif: {
  status: string
  itens_conformes: number
  total_itens: number
}): boolean {
  return (
    verif.status === 'concluida' &&
    verif.total_itens > 0 &&
    verif.itens_conformes === verif.total_itens
  )
}

// ============================================================================
// SERVER ACTIONS
// ============================================================================

/**
 * Cria uma verificação para um par serviço/unidade.
 * Automaticamente cria itens_verificacao a partir dos itens_servico do serviço.
 *
 * Se o serviço tem zero itens_servico, a verificação é criada com total_itens=0.
 * O trigger `atualizar_contadores_verificacao` cuida dos contadores automaticamente.
 */
export async function criarVerificacao(
  input: CriarVerificacaoInput
): Promise<ActionResult<{ id: string }>> {
  // 1. Validar input
  const parsed = criarVerificacaoSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { obra_id, unidade_id, servico_id } = parsed.data

  // 2. Inserir verificação com status pendente
  const { data: verificacao, error: vError } = await supabase
    .from('verificacoes')
    .insert({
      obra_id,
      unidade_id,
      servico_id,
      status: 'pendente',
      data_inicio: new Date().toISOString(),
    })
    .select('id')
    .single()

  if (vError) {
    if (vError.code === '23505') {
      return { error: 'Já existe uma verificação para este serviço/unidade' }
    }
    return { error: `Erro ao criar verificação: ${vError.message}` }
  }

  // 3. Buscar itens_servico do serviço (template de itens)
  const { data: itensServico } = await supabase
    .from('itens_servico')
    .select('id')
    .eq('servico_id', servico_id)
    .order('ordem', { ascending: true })

  // 4. Criar itens_verificacao para todos os itens encontrados
  if (itensServico && itensServico.length > 0) {
    const itensToInsert = itensServico.map((item) => ({
      verificacao_id: verificacao.id,
      item_servico_id: item.id,
      status: 'nao_verificado' as const,
    }))

    const { error: itensError } = await supabase
      .from('itens_verificacao')
      .insert(itensToInsert)

    if (itensError) {
      return { error: `Erro ao criar itens da verificação: ${itensError.message}` }
    }
  }
  // Se não há itens_servico, a verificação é criada com total_itens=0 (válido)

  // 5. Revalidar cache da obra
  revalidatePath(`/app/obras/${obra_id}`)

  return { data: { id: verificacao.id } }
}

/**
 * Atualiza o resultado de uma verificação.
 * Verifica imutabilidade: verificação Conforme travada não pode ser alterada.
 */
export async function atualizarResultadoVerificacao(
  input: AtualizarResultadoInput
): Promise<ActionResult<{ id: string }>> {
  // 1. Validar input
  const parsed = atualizarResultadoSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { verificacao_id, resultado, descricao } = parsed.data

  // 2. Buscar verificação atual para checar imutabilidade
  const { data: verif, error: fetchError } = await supabase
    .from('verificacoes')
    .select('id, obra_id, status, itens_conformes, total_itens')
    .eq('id', verificacao_id)
    .single()

  if (fetchError || !verif) {
    return { error: 'Verificação não encontrada' }
  }

  // 3. Checar imutabilidade
  if (isVerificacaoTravada(verif)) {
    return { error: 'Verificação Conforme é travada e não pode ser alterada' }
  }

  // 4. Montar dados de atualização
  const updateData: Record<string, unknown> = {}

  if (resultado === 'excecao') {
    // Exceção: armazenar descrição/observação na verificação
    updateData.observacao = descricao || null
  }

  // 5. Atualizar verificação (se há dados para atualizar)
  if (Object.keys(updateData).length > 0) {
    const { error: updateError } = await supabase
      .from('verificacoes')
      .update(updateData)
      .eq('id', verificacao_id)

    if (updateError) {
      return { error: `Erro ao atualizar verificação: ${updateError.message}` }
    }
  }

  // 6. Se resultado é exceção, marcar todos os itens como exceção em lote
  if (resultado === 'excecao') {
    const { error: itensError } = await supabase
      .from('itens_verificacao')
      .update({
        status: 'excecao',
        observacao: descricao || null,
        data_inspecao: new Date().toISOString(),
      })
      .eq('verificacao_id', verificacao_id)

    if (itensError) {
      return {
        error: `Erro ao atualizar itens para exceção: ${itensError.message}`,
      }
    }
  }

  // 7. Revalidar cache da obra
  revalidatePath(`/app/obras/${verif.obra_id}`)

  return { data: { id: verificacao_id } }
}

/**
 * Altera o status de uma verificação.
 * Verifica imutabilidade: verificação Conforme travada não pode ser alterada.
 */
export async function atualizarStatusVerificacao(
  input: AtualizarStatusInput
): Promise<ActionResult<{ id: string }>> {
  // 1. Validar input
  const parsed = atualizarStatusSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { verificacao_id, status } = parsed.data

  // 2. Buscar verificação atual para checar imutabilidade e obter obra_id
  const { data: verif, error: fetchError } = await supabase
    .from('verificacoes')
    .select('id, obra_id, status, itens_conformes, total_itens')
    .eq('id', verificacao_id)
    .single()

  if (fetchError || !verif) {
    return { error: 'Verificação não encontrada' }
  }

  // 3. Checar imutabilidade
  if (isVerificacaoTravada(verif)) {
    return { error: 'Verificação Conforme é travada e não pode ser alterada' }
  }

  // 4. Atualizar status
  const { error: updateError } = await supabase
    .from('verificacoes')
    .update({ status })
    .eq('id', verificacao_id)

  if (updateError) {
    return { error: `Erro ao atualizar status: ${updateError.message}` }
  }

  // 5. Revalidar cache da obra
  revalidatePath(`/app/obras/${verif.obra_id}`)

  return { data: { id: verificacao_id } }
}

/**
 * Atualiza a descrição geral de uma verificação.
 * Verifica imutabilidade: verificação Conforme travada não pode ser alterada.
 */
export async function atualizarDescricaoVerificacao(
  input: AtualizarDescricaoInput
): Promise<ActionResult<{ id: string }>> {
  // 1. Validar input
  const parsed = atualizarDescricaoSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { verificacao_id, descricao } = parsed.data

  // 2. Buscar verificação atual para checar imutabilidade
  const { data: verif, error: fetchError } = await supabase
    .from('verificacoes')
    .select('id, obra_id, status, itens_conformes, total_itens')
    .eq('id', verificacao_id)
    .single()

  if (fetchError || !verif) {
    return { error: 'Verificação não encontrada' }
  }

  // 3. Checar imutabilidade
  if (isVerificacaoTravada(verif)) {
    return { error: 'Verificação Conforme é travada e não pode ser alterada' }
  }

  // 4. Atualizar descrição
  const { error: updateError } = await supabase
    .from('verificacoes')
    .update({ descricao: descricao || null })
    .eq('id', verificacao_id)

  if (updateError) {
    return { error: `Erro ao atualizar descrição: ${updateError.message}` }
  }

  // 5. Revalidar cache da obra
  revalidatePath(`/app/obras/${verif.obra_id}`)

  return { data: { id: verificacao_id } }
}
