import { z } from 'zod'
import { requiredString, optionalString } from './common'

/**
 * Schema de validacao para formulario de item de servico.
 * Alinhado com tabela itens_servico no banco de dados.
 *
 * Campos obrigatorios: observacao
 * Campos opcionais: metodo, tolerancia
 */
export const itemServicoFormSchema = z.object({
  observacao: requiredString(3, 1000, 'Observação'),
  metodo: optionalString(1000),
  tolerancia: optionalString(500),
  tag_id: z.string().uuid().nullable().optional(),
})

export type ItemServicoFormData = z.infer<typeof itemServicoFormSchema>
