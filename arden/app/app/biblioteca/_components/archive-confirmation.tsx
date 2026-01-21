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
import { archiveServico, restoreServico } from '@/lib/supabase/queries/servicos'
import { toast } from 'sonner'

interface ArchiveConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  servico: { id: string; nome: string; arquivado: boolean } | null
  onSuccess: () => void
}

export function ArchiveConfirmation({
  open,
  onOpenChange,
  servico,
  onSuccess,
}: ArchiveConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isRestoring = servico?.arquivado ?? false

  const handleConfirm = async () => {
    if (!servico) return

    setIsLoading(true)
    try {
      if (isRestoring) {
        await restoreServico(servico.id)
        toast.success('Servico restaurado com sucesso')
      } else {
        await archiveServico(servico.id)
        toast.success('Servico arquivado com sucesso')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      const action = isRestoring ? 'restaurar' : 'arquivar'
      toast.error(error instanceof Error ? error.message : `Erro ao ${action} servico`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRestoring ? 'Restaurar servico?' : 'Arquivar servico?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isRestoring
              ? `O servico "${servico?.nome}" sera restaurado e voltara a aparecer na lista ativa.`
              : `O servico "${servico?.nome}" sera arquivado e nao aparecera mais na lista ativa. Voce podera restaura-lo depois.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            variant={isRestoring ? 'default' : 'destructive'}
          >
            {isLoading
              ? isRestoring
                ? 'Restaurando...'
                : 'Arquivando...'
              : isRestoring
                ? 'Restaurar'
                : 'Arquivar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
