'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ServicosActivationTable } from './servicos-activation-table'
import type { ServicoWithActivation } from '@/lib/supabase/queries/obra-servicos'
import { activateServico, deactivateServico } from '@/lib/supabase/queries/obra-servicos'
import { toast } from 'sonner'

interface ServicosActivationClientProps {
  obraId: string
  initialServicos: ServicoWithActivation[]
}

export function ServicosActivationClient({
  obraId,
  initialServicos,
}: ServicosActivationClientProps) {
  const router = useRouter()
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleToggle = async (servico: ServicoWithActivation, checked: boolean) => {
    setIsUpdating(servico.id)
    try {
      if (checked) {
        await activateServico(obraId, servico.id)
        toast.success(`Servico "${servico.nome}" ativado`)
      } else {
        await deactivateServico(obraId, servico.id)
        toast.success(`Servico "${servico.nome}" desativado`)
      }
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar servico'
      toast.error(message)
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <ServicosActivationTable
      servicos={initialServicos}
      onToggle={handleToggle}
      updatingId={isUpdating}
    />
  )
}
