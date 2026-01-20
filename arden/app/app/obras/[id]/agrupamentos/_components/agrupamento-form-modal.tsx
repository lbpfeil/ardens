'use client'

import type { Agrupamento } from '@/lib/supabase/queries/agrupamentos'

interface AgrupamentoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  mode?: 'create' | 'edit'
  agrupamento?: Agrupamento | null
  obraId: string
}

// Placeholder - will be implemented in Task 2
export function AgrupamentoFormModal({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  agrupamento = null,
  obraId,
}: AgrupamentoFormModalProps) {
  if (!open) return null
  return null
}
