import { z } from 'zod'

/**
 * Schema de validacao para formulario de agrupamento individual.
 */
export const agrupamentoFormSchema = z.object({
  nome: z
    .string({ required_error: 'Nome e obrigatorio' })
    .min(1, 'Nome e obrigatorio')
    .max(100, 'Nome deve ter no maximo 100 caracteres'),
})

export type AgrupamentoFormData = z.infer<typeof agrupamentoFormSchema>

/**
 * Schema de validacao para criacao em lote de agrupamentos.
 */
export const agrupamentoBatchSchema = z.object({
  prefixo: z
    .string({ required_error: 'Prefixo e obrigatorio' })
    .min(1, 'Prefixo e obrigatorio')
    .max(50, 'Prefixo deve ter no maximo 50 caracteres'),
  quantidade: z
    .number({ required_error: 'Quantidade e obrigatoria' })
    .int('Quantidade deve ser um numero inteiro')
    .min(1, 'Quantidade minima e 1')
    .max(100, 'Quantidade maxima e 100'),
  numeroInicial: z
    .number({ required_error: 'Numero inicial e obrigatorio' })
    .int('Numero inicial deve ser um numero inteiro')
    .min(0, 'Numero inicial deve ser 0 ou maior'),
})

export type AgrupamentoBatchData = z.infer<typeof agrupamentoBatchSchema>

/**
 * Gera nomes para criacao em lote de agrupamentos.
 * @param prefixo Prefixo do nome (ex: "Bloco", "Torre", "Casa")
 * @param quantidade Quantidade de agrupamentos a criar
 * @param numeroInicial Numero inicial da sequencia
 * @returns Array de nomes gerados (ex: ["Bloco 1", "Bloco 2", "Bloco 3"])
 *
 * @example
 * generateBatchNames("Bloco", 5, 1) // ["Bloco 1", "Bloco 2", "Bloco 3", "Bloco 4", "Bloco 5"]
 * generateBatchNames("Torre", 3, 0) // ["Torre 0", "Torre 1", "Torre 2"]
 * generateBatchNames("Casa", 4, 10) // ["Casa 10", "Casa 11", "Casa 12", "Casa 13"]
 */
export function generateBatchNames(
  prefixo: string,
  quantidade: number,
  numeroInicial: number
): string[] {
  return Array.from(
    { length: quantidade },
    (_, i) => `${prefixo} ${numeroInicial + i}`
  )
}
