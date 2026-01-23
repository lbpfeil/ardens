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
        toast.success('Serviço restaurado com sucesso')
      } else {
        await archiveServico(servico.id)
        toast.success('Serviço arquivado com sucesso')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      const action = isRestoring ? 'restaurar' : 'arquivar'
      toast.error(error instanceof Error ? error.message : `Erro ao ${action} serviço`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isRestoring ? 'Restaurar serviço?' : 'Arquivar serviço?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isRestoring
              ? `O serviço "${servico?.nome}" será restaurado e voltará a aparecer na lista ativa.`
              : `O serviço "${servico?.nome}" será arquivado e não aparecerá mais na lista ativa. Você poderá restaurá-lo depois.`}
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
