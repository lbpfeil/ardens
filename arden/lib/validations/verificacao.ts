import { z } from 'zod'
import { uuidString, optionalString } from './common'

/**
 * Tipo de retorno padronizado para Server Actions.
 * Todas as actions retornam { data } em sucesso ou { error } em falha.
 * Nunca throw errors — o chamador sempre recebe um objeto tipado.
 */
export type ActionResult<T> =
  | { data: T; error?: never }
  | { error: string; data?: never }

// ============================================================================
// SCHEMAS DE VERIFICAÇÕES
// ============================================================================

/**
 * Schema para criar uma nova verificação (par serviço/unidade).
 * A action busca os itens_servico e cria itens_verificacao automaticamente.
 */
export const criarVerificacaoSchema = z.object({
  obra_id: uuidString(),
  unidade_id: uuidString(),
  servico_id: uuidString(),
})

export type CriarVerificacaoInput = z.infer<typeof criarVerificacaoSchema>

/**
 * Schema para atualizar o resultado de uma verificação.
 * Resultados possíveis: conforme, não conforme, exceção.
 */
export const atualizarResultadoSchema = z.object({
  verificacao_id: uuidString(),
  resultado: z.enum(['conforme', 'nao_conforme', 'excecao'], {
    required_error: 'Resultado é obrigatório',
    invalid_type_error: 'Resultado inválido',
  }),
  descricao: optionalString(1000),
})

export type AtualizarResultadoInput = z.infer<typeof atualizarResultadoSchema>

/**
 * Schema para alterar o status de uma verificação.
 * Status: pendente, em_andamento, concluida, com_nc.
 */
export const atualizarStatusSchema = z.object({
  verificacao_id: uuidString(),
  status: z.enum(['pendente', 'em_andamento', 'concluida', 'com_nc'], {
    required_error: 'Status é obrigatório',
    invalid_type_error: 'Status inválido',
  }),
})

export type AtualizarStatusInput = z.infer<typeof atualizarStatusSchema>

// ============================================================================
// SCHEMAS DE ITENS DE VERIFICAÇÃO
// ============================================================================

/**
 * Schema para marcar o status de um item individual de verificação.
 *
 * MAPEAMENTO UI → BANCO:
 * Na interface o usuário vê "C / NC / NA" (Não se Aplica), mas no banco
 * o enum `status_inspecao` usa 'excecao' para representar NA:
 *   - C  (Conforme)       → 'conforme'
 *   - NC (Não Conforme)   → 'nao_conforme'
 *   - NA (Não se Aplica)  → 'excecao'
 *
 * O status 'nao_verificado' não é aceito aqui — é apenas o estado inicial
 * de um item recém-criado. Marcar um item significa escolher C, NC ou NA.
 */
export const marcarItemSchema = z.object({
  item_verificacao_id: uuidString(),
  status: z.enum(['conforme', 'nao_conforme', 'excecao'], {
    required_error: 'Status é obrigatório',
    invalid_type_error: 'Status inválido',
  }),
  observacao: optionalString(1000),
})

export type MarcarItemInput = z.infer<typeof marcarItemSchema>

/**
 * Schema para reinspeção de um item que estava Não Conforme.
 * Apenas itens com status 'nao_conforme' podem ser reinspecionados.
 *
 * Status de reinspeção:
 *   - conforme_apos_reinspecao: não havia problema real
 *   - retrabalho: correção executada (impacta IRS)
 *   - aprovado_com_concessao: defeito tolerável aceito
 *   - reprovado_apos_retrabalho: correção insuficiente
 */
export const marcarItemReinspecaoSchema = z.object({
  item_verificacao_id: uuidString(),
  status_reinspecao: z.enum([
    'conforme_apos_reinspecao',
    'retrabalho',
    'aprovado_com_concessao',
    'reprovado_apos_retrabalho',
  ], {
    required_error: 'Status de reinspeção é obrigatório',
    invalid_type_error: 'Status de reinspeção inválido',
  }),
  observacao_reinspecao: optionalString(1000),
})

export type MarcarItemReinspecaoInput = z.infer<typeof marcarItemReinspecaoSchema>
