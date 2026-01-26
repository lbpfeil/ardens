'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import {
  marcarItemSchema,
  marcarItemReinspecaoSchema,
  type MarcarItemInput,
  type MarcarItemReinspecaoInput,
  type ActionResult,
} from '@/lib/validations/verificacao'

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Busca um item de verificação com dados da verificação pai.
 * Retorna o item com a verificação aninhada para checagens de imutabilidade.
 */
async function buscarItemComVerificacao(
  supabase: Awaited<ReturnType<typeof createClient>>,
  itemVerificacaoId: string
) {
  const { data, error } = await supabase
    .from('itens_verificacao')
    .select('id, status, ciclos_reinspecao, verificacao_id, verificacoes(obra_id, status, itens_conformes, total_itens)')
    .eq('id', itemVerificacaoId)
    .single()

  if (error || !data) {
    return { item: null, error: 'Item de verificação não encontrado' }
  }

  return { item: data, error: null }
}

/**
 * Verifica se a verificação pai está travada (Conforme concluída).
 */
function isVerificacaoTravada(verificacao: {
  status: string
  itens_conformes: number
  total_itens: number
}): boolean {
  return (
    verificacao.status === 'concluida' &&
    verificacao.total_itens > 0 &&
    verificacao.itens_conformes === verificacao.total_itens
  )
}

// ============================================================================
// SERVER ACTIONS
// ============================================================================

/**
 * Marca o status de um item individual de verificação (C / NC / NA).
 *
 * Checagens:
 * - Verificação pai não pode estar travada (Conforme concluída)
 *
 * O trigger `atualizar_contadores_verificacao` recalcula automaticamente
 * os contadores da verificação após o update.
 */
export async function marcarItemVerificacao(
  input: MarcarItemInput
): Promise<ActionResult<{ id: string }>> {
  // 1. Validar input
  const parsed = marcarItemSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { item_verificacao_id, status, observacao } = parsed.data

  // 2. Buscar item com verificação pai
  const { item, error: fetchError } = await buscarItemComVerificacao(
    supabase,
    item_verificacao_id
  )

  if (!item) {
    return { error: fetchError! }
  }

  // 3. Checar imutabilidade da verificação pai
  // O Supabase retorna a relação many-to-one como objeto (não array)
  const verificacao = item.verificacoes as unknown as {
    obra_id: string
    status: string
    itens_conformes: number
    total_itens: number
  }

  if (isVerificacaoTravada(verificacao)) {
    return { error: 'Verificação Conforme é travada e não pode ser alterada' }
  }

  // 4. Atualizar item
  const { error: updateError } = await supabase
    .from('itens_verificacao')
    .update({
      status,
      observacao: observacao || null,
      data_inspecao: new Date().toISOString(),
    })
    .eq('id', item_verificacao_id)

  if (updateError) {
    return { error: `Erro ao marcar item: ${updateError.message}` }
  }

  // O trigger atualizar_contadores_verificacao recalcula automaticamente

  // 5. Revalidar cache da obra
  revalidatePath(`/app/obras/${verificacao.obra_id}`)

  return { data: { id: item_verificacao_id } }
}

/**
 * Marca a reinspeção de um item que estava Não Conforme.
 *
 * Pré-condição: item deve ter status 'nao_conforme'.
 * Incrementa ciclos_reinspecao em 1.
 *
 * O trigger `atualizar_contadores_verificacao` recalcula automaticamente
 * os contadores após o update.
 */
export async function marcarItemReinspecao(
  input: MarcarItemReinspecaoInput
): Promise<ActionResult<{ id: string }>> {
  // 1. Validar input
  const parsed = marcarItemReinspecaoSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  const supabase = await createClient()
  const { item_verificacao_id, status_reinspecao, observacao_reinspecao } = parsed.data

  // 2. Buscar item com verificação pai
  const { item, error: fetchError } = await buscarItemComVerificacao(
    supabase,
    item_verificacao_id
  )

  if (!item) {
    return { error: fetchError! }
  }

  // 3. Checar pré-condição: item deve ser NC
  if (item.status !== 'nao_conforme') {
    return { error: 'Apenas itens Não Conforme podem ser reinspecionados' }
  }

  // 4. Obter dados da verificação pai para revalidação
  const verificacao = item.verificacoes as unknown as {
    obra_id: string
    status: string
    itens_conformes: number
    total_itens: number
  }

  // 5. Atualizar item com dados de reinspeção
  const { error: updateError } = await supabase
    .from('itens_verificacao')
    .update({
      status_reinspecao,
      observacao_reinspecao: observacao_reinspecao || null,
      data_reinspecao: new Date().toISOString(),
      ciclos_reinspecao: (item.ciclos_reinspecao ?? 0) + 1,
    })
    .eq('id', item_verificacao_id)

  if (updateError) {
    return { error: `Erro ao registrar reinspeção: ${updateError.message}` }
  }

  // O trigger atualizar_contadores_verificacao recalcula automaticamente

  // 6. Revalidar cache da obra
  revalidatePath(`/app/obras/${verificacao.obra_id}`)

  return { data: { id: item_verificacao_id } }
}
