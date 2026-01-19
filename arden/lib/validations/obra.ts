import { z } from 'zod'
import { requiredString, optionalString } from './common'

/**
 * Opcoes de tipologia de obra conforme enum do banco de dados.
 */
export const tipologiaOptions = [
  { value: 'residencial_horizontal', label: 'Residencial Horizontal' },
  { value: 'residencial_vertical', label: 'Residencial Vertical' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'retrofit', label: 'Retrofit' },
  { value: 'misto', label: 'Misto' },
] as const

export type TipologiaObra = typeof tipologiaOptions[number]['value']

/**
 * Schema de validacao para formulario de obra.
 * Alinhado com tabela obras no banco de dados.
 *
 * Campos obrigatorios: nome
 * Campos opcionais: codigo, tipologia, cidade, estado, responsavel_tecnico
 */
export const obraFormSchema = z.object({
  nome: requiredString(3, 255, 'Nome'),
  codigo: optionalString(50),
  tipologia: z.enum([
    'residencial_horizontal',
    'residencial_vertical',
    'comercial',
    'retrofit',
    'misto'
  ]).optional(),
  cidade: optionalString(100),
  estado: z.string()
    .length(2, 'Estado deve ter 2 caracteres (UF)')
    .optional()
    .or(z.literal('')),
  responsavel_tecnico: optionalString(255),
})

export type ObraFormData = z.infer<typeof obraFormSchema>

// Keep old export for backwards compatibility with ObraForm example
export const obraSchema = obraFormSchema
