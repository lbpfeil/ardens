'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { deleteAgrupamento } from '@/lib/supabase/queries/agrupamentos'
import type { AgrupamentoWithCount } from '@/lib/supabase/queries/agrupamentos'
import { toast } from 'sonner'

interface DeleteConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agrupamento: AgrupamentoWithCount | null
  onSuccess: () => void
}

export function DeleteConfirmation({
  open,
  onOpenChange,
  agrupamento,
  onSuccess,
}: DeleteConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!agrupamento) return

    setIsLoading(true)
    try {
      await deleteAgrupamento(agrupamento.id)
      toast.success('Agrupamento excluído com sucesso')
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir agrupamento')
    } finally {
      setIsLoading(false)
    }
  }

  const getDescription = () => {
    if (!agrupamento) return ''

    if (agrupamento.unidades_count === 0) {
      return `Tem certeza que deseja excluir o agrupamento "${agrupamento.nome}"?`
    }

    return `Tem certeza que deseja excluir o agrupamento "${agrupamento.nome}" e suas ${agrupamento.unidades_count} unidade(s)? Esta ação não pode ser desfeita.`
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Agrupamento</AlertDialogTitle>
          <AlertDialogDescription>
            {getDescription()}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
