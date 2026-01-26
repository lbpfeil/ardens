'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionResult } from '@/lib/validations/verificacao'

// ============================================================================
// TYPES
// ============================================================================

/**
 * Resultado retornado pelo RPC bulk_verificar.
 * - created: verificações criadas ou atualizadas (pendente/em_andamento)
 * - skipped: verificações Conformes ignoradas (travadas)
 * - reinspected: verificações com NC que receberam reinspeção
 */
interface BulkVerificarResult {
  created: number
  skipped: number
  reinspected: number
}

// ============================================================================
// SCHEMA DE VALIDAÇÃO
// ============================================================================

/**
 * Schema Zod para validação do input de verificação em massa.
 * - obra_id: UUID da obra
 * - resultado: tipo de resultado a aplicar em todos os pares
 * - pares: array de { servico_id, unidade_id } com min 1, max 500
 * - descricao: texto opcional para o lote
 */
const bulkVerificarSchema = z.object({
  obra_id: z.string().uuid('ID da obra deve ser um UUID válido'),
  resultado: z.enum(['conforme', 'nao_conforme', 'excecao'], {
    required_error: 'Resultado é obrigatório',
    invalid_type_error: 'Resultado inválido',
  }),
  pares: z
    .array(
      z.object({
        servico_id: z.string().uuid('ID do serviço deve ser um UUID válido'),
        unidade_id: z.string().uuid('ID da unidade deve ser um UUID válido'),
      })
    )
    .min(1, 'Selecione pelo menos um par serviço/unidade')
    .max(500, 'Máximo de 500 pares por operação'),
  descricao: z.string().max(1000).optional(),
})

export type BulkVerificarInput = z.infer<typeof bulkVerificarSchema>

// ============================================================================
// SERVER ACTION
// ============================================================================

/**
 * Executa verificações em massa chamando o RPC PostgreSQL bulk_verificar.
 *
 * A função RPC roda numa única transação atômica:
 * - Cria verificações novas + itens a partir do template
 * - Ignora verificações Conformes (travadas)
 * - Aplica reinspeção em verificações com NC
 * - Atualiza itens de verificações pendentes/em_andamento
 *
 * @param input - Dados validados pelo schema bulkVerificarSchema
 * @returns ActionResult com contagens { created, skipped, reinspected }
 */
export async function bulkVerificar(
  input: BulkVerificarInput
): Promise<ActionResult<BulkVerificarResult>> {
  // 1. Validar input
  const parsed = bulkVerificarSchema.safeParse(input)
  if (!parsed.success) {
    return { error: 'Dados inválidos' }
  }

  // 2. Chamar RPC
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('bulk_verificar', {
    p_obra_id: parsed.data.obra_id,
    p_resultado: parsed.data.resultado,
    p_pares: parsed.data.pares,
    p_descricao: parsed.data.descricao ?? null,
  })

  if (error) {
    return { error: `Erro na verificação em massa: ${error.message}` }
  }

  // 3. Revalidar cache da obra
  revalidatePath(`/app/obras/${parsed.data.obra_id}`)

  return { data: data as BulkVerificarResult }
}
