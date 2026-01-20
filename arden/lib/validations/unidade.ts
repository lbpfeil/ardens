import { z } from 'zod'

/**
 * Schema de validacao para formulario de unidade individual.
 */
export const unidadeFormSchema = z.object({
  nome: z
    .string({ required_error: 'Nome e obrigatorio' })
    .min(1, 'Nome e obrigatorio')
    .max(100, 'Nome deve ter no maximo 100 caracteres'),
})

export type UnidadeFormData = z.infer<typeof unidadeFormSchema>

/**
 * Parsed numeric range result.
 */
export interface ParsedNumericRange {
  prefix: string
  start: number
  end: number
}

/**
 * Parses a numeric range input string.
 * Formats: "Prefixo inicio-fim" (e.g., "Apto 101-110") or "inicio-fim" (e.g., "101-110")
 *
 * @param input The input string to parse
 * @returns ParsedNumericRange if valid, null otherwise
 *
 * @example
 * parseNumericRange("Apto 101-103") // { prefix: "Apto", start: 101, end: 103 }
 * parseNumericRange("101-105") // { prefix: "", start: 101, end: 105 }
 * parseNumericRange("invalid") // null
 */
export function parseNumericRange(input: string): ParsedNumericRange | null {
  const trimmed = input.trim()

  // Regex: optional prefix (non-greedy, followed by space), then start-end numbers
  const regex = /^(.+?\s)?(\d+)-(\d+)$/
  const match = trimmed.match(regex)

  if (!match) {
    return null
  }

  const prefix = match[1]?.trim() ?? ''
  const start = parseInt(match[2], 10)
  const end = parseInt(match[3], 10)

  // Validate: start must be <= end
  if (start > end) {
    return null
  }

  // Validate: max 500 units per batch
  if (end - start + 1 > 500) {
    return null
  }

  return { prefix, start, end }
}

/**
 * Generates unidade names from a parsed numeric range.
 *
 * @param parsed The parsed numeric range
 * @returns Array of generated names
 *
 * @example
 * generateUnidadeNames({ prefix: "Apto", start: 101, end: 103 })
 * // ["Apto 101", "Apto 102", "Apto 103"]
 *
 * generateUnidadeNames({ prefix: "", start: 1, end: 3 })
 * // ["1", "2", "3"]
 */
export function generateUnidadeNames(parsed: ParsedNumericRange): string[] {
  const { prefix, start, end } = parsed
  const names: string[] = []

  for (let i = start; i <= end; i++) {
    if (prefix) {
      names.push(`${prefix} ${i}`)
    } else {
      names.push(`${i}`)
    }
  }

  return names
}

/**
 * Schema de validacao para criacao em lote de unidades.
 * Campos separados: prefixo (opcional), quantidade, numeroInicial
 */
export const unidadeBatchSchema = z.object({
  prefixo: z
    .string()
    .max(50, 'Prefixo deve ter no maximo 50 caracteres')
    .optional()
    .default(''),
  quantidade: z
    .number({ required_error: 'Quantidade e obrigatoria' })
    .min(1, 'Quantidade minima e 1')
    .max(500, 'Quantidade maxima e 500'),
  numeroInicial: z
    .number({ required_error: 'Numero inicial e obrigatorio' })
    .min(0, 'Numero inicial deve ser >= 0')
    .max(99999, 'Numero inicial deve ser <= 99999'),
})

export type UnidadeBatchData = z.infer<typeof unidadeBatchSchema>

/**
 * Generates unidade names from batch parameters.
 *
 * @param prefixo Optional prefix (e.g., "Apto")
 * @param quantidade Number of units to create
 * @param numeroInicial Starting number
 * @returns Array of generated names
 *
 * @example
 * generateBatchNames("Apto", 3, 101)
 * // ["Apto 101", "Apto 102", "Apto 103"]
 *
 * generateBatchNames("", 3, 1)
 * // ["1", "2", "3"]
 */
export function generateBatchNames(
  prefixo: string | undefined,
  quantidade: number,
  numeroInicial: number
): string[] {
  const names: string[] = []
  const prefix = prefixo?.trim() || ''

  for (let i = 0; i < quantidade; i++) {
    const num = numeroInicial + i
    if (prefix) {
      names.push(`${prefix} ${num}`)
    } else {
      names.push(`${num}`)
    }
  }

  return names
}
