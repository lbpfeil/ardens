import { z } from 'zod'

/**
 * Schemas base reutilizaveis para validacao de formularios.
 * Mensagens de erro em portugues para consistencia na UI.
 */

/**
 * String obrigatoria com validacao de tamanho.
 * @param min Tamanho minimo
 * @param max Tamanho maximo
 * @param field Nome do campo para mensagens de erro
 */
export function requiredString(min: number, max: number, field: string) {
  return z
    .string({ required_error: `${field} é obrigatório` })
    .min(min, `${field} deve ter no mínimo ${min} caracteres`)
    .max(max, `${field} deve ter no máximo ${max} caracteres`)
}

/**
 * String opcional com validacao de tamanho maximo.
 * @param max Tamanho maximo
 */
export function optionalString(max: number) {
  return z.string().max(max).optional().or(z.literal(''))
}

/**
 * Valida string no formato de data YYYY-MM-DD.
 */
export function dateString() {
  return z
    .string({ required_error: 'Data é obrigatória' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD')
}

/**
 * Valida string no formato UUID.
 */
export function uuidString() {
  return z
    .string()
    .uuid('ID deve ser um UUID válido')
}
