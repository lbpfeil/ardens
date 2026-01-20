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
import { deleteUnidade, type Unidade } from '@/lib/supabase/queries/unidades'
import { toast } from 'sonner'

interface UnidadeDeleteConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  unidade: Unidade | null
  onSuccess: () => void
}

export function UnidadeDeleteConfirmation({
  open,
  onOpenChange,
  unidade,
  onSuccess,
}: UnidadeDeleteConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!unidade) return

    setIsLoading(true)
    try {
      await deleteUnidade(unidade.id)
      toast.success('Unidade excluida com sucesso')
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir unidade')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Unidade</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a unidade &quot;{unidade?.nome}&quot;? Esta acao nao pode ser desfeita.
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
