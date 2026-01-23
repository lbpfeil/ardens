import { z } from 'zod'
import { requiredString } from './common'

export const tagFormSchema = z.object({
  nome: requiredString(1, 50, 'Nome'),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor deve ser um código hex válido'),
})

export type TagFormData = z.infer<typeof tagFormSchema>
