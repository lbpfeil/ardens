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
import { archiveServico } from '@/lib/supabase/queries/servicos'
import { toast } from 'sonner'

interface ArchiveConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  servico: { id: string; nome: string } | null
  onSuccess: () => void
}

export function ArchiveConfirmation({
  open,
  onOpenChange,
  servico,
  onSuccess,
}: ArchiveConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (!servico) return

    setIsLoading(true)
    try {
      await archiveServico(servico.id)
      toast.success('Servico arquivado com sucesso')
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao arquivar servico')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Arquivar servico?</AlertDialogTitle>
          <AlertDialogDescription>
            O servico &quot;{servico?.nome}&quot; sera arquivado e nao aparecera mais na lista ativa. Voce podera restaura-lo depois.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            variant="destructive"
          >
            {isLoading ? 'Arquivando...' : 'Arquivar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
