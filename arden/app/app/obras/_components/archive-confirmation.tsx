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
import { archiveObra, restoreObra } from '@/lib/supabase/queries/obras'
import { toast } from 'sonner'

interface ArchiveConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  obra: { id: string; nome: string; arquivada: boolean } | null
  onSuccess: () => void
}

export function ArchiveConfirmation({
  open,
  onOpenChange,
  obra,
  onSuccess,
}: ArchiveConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isArchived = obra?.arquivada ?? false

  const handleConfirm = async () => {
    if (!obra) return

    setIsLoading(true)
    try {
      if (isArchived) {
        await restoreObra(obra.id)
        toast.success('Obra restaurada com sucesso')
      } else {
        await archiveObra(obra.id)
        toast.success('Obra arquivada com sucesso')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao processar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isArchived ? 'Restaurar obra?' : 'Arquivar obra?'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isArchived
              ? `Tem certeza que deseja restaurar a obra "${obra?.nome}"? Ela voltara a aparecer na lista de obras ativas.`
              : `Tem certeza que deseja arquivar a obra "${obra?.nome}"? A obra sera removida da lista principal, mas podera ser restaurada posteriormente.`
            }
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            variant={!isArchived ? 'destructive' : 'default'}
          >
            {isLoading
              ? (isArchived ? 'Restaurando...' : 'Arquivando...')
              : (isArchived ? 'Restaurar' : 'Arquivar')
            }
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
