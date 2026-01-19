import { z } from 'zod'
import { requiredString, optionalString, dateString } from './common'

/**
 * Schema de validacao para formulario de obra.
 *
 * Campos:
 * - nome: Nome da obra (3-100 caracteres)
 * - codigo: Codigo interno opcional (max 20 caracteres)
 * - endereco: Endereco completo (min 5 caracteres)
 * - dataInicio: Data de inicio no formato YYYY-MM-DD
 * - responsavel: Nome do responsavel (min 2 caracteres)
 */
export const obraSchema = z.object({
  nome: requiredString(3, 100, 'Nome'),
  codigo: optionalString(20),
  endereco: requiredString(5, 200, 'Endereço'),
  dataInicio: dateString(),
  responsavel: requiredString(2, 100, 'Responsável'),
})

/**
 * Tipo inferido do schema de obra.
 * Use este tipo para tipar dados de formulario e props de componentes.
 */
export type ObraFormData = z.infer<typeof obraSchema>
