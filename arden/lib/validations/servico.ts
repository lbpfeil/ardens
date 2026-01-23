import { z } from 'zod'
import { requiredString, optionalString } from './common'

/**
 * Opcoes de categoria de servico conforme enum do banco de dados.
 */
export const categoriaServicoOptions = [
  { value: 'fundacao', label: 'Fundação' },
  { value: 'estrutura', label: 'Estrutura' },
  { value: 'alvenaria', label: 'Alvenaria' },
  { value: 'revestimento', label: 'Revestimento' },
  { value: 'acabamento', label: 'Acabamento' },
  { value: 'instalacoes', label: 'Instalações' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'esquadrias', label: 'Esquadrias' },
  { value: 'pintura', label: 'Pintura' },
  { value: 'impermeabilizacao', label: 'Impermeabilização' },
  { value: 'outros', label: 'Outros' },
] as const

export type CategoriaServicoOption = typeof categoriaServicoOptions[number]['value']

/**
 * Schema de validacao para formulario de servico.
 * Alinhado com tabela servicos no banco de dados.
 *
 * Campos obrigatorios: codigo, nome
 * Campos opcionais: categoria, referencia_normativa
 */
export const servicoFormSchema = z.object({
  codigo: requiredString(1, 50, 'Código'),
  nome: requiredString(3, 255, 'Nome'),
  categoria: z.enum([
    'fundacao',
    'estrutura',
    'alvenaria',
    'revestimento',
    'acabamento',
    'instalacoes',
    'cobertura',
    'esquadrias',
    'pintura',
    'impermeabilizacao',
    'outros',
  ]).optional().nullable(),
  referencia_normativa: optionalString(500),
})

export type ServicoFormData = z.infer<typeof servicoFormSchema>

/**
 * Schema de validacao para edicao de servico.
 * Requer descricao da mudanca para controle de revisao.
 */
export const servicoEditFormSchema = z.object({
  codigo: requiredString(1, 50, 'Código'),
  nome: requiredString(3, 255, 'Nome'),
  categoria: z.enum([
    'fundacao',
    'estrutura',
    'alvenaria',
    'revestimento',
    'acabamento',
    'instalacoes',
    'cobertura',
    'esquadrias',
    'pintura',
    'impermeabilizacao',
    'outros',
  ]).optional().nullable(),
  referencia_normativa: optionalString(500),
  descricao_mudanca: requiredString(3, 500, 'Descrição da mudança'),
})

export type ServicoEditFormData = z.infer<typeof servicoEditFormSchema>
