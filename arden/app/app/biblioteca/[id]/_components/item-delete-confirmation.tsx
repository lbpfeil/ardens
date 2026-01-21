'use client'

import { useState } from 'react'
import { deleteItemServico, type ItemServico } from '@/lib/supabase/queries/itens-servico'
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
import { toast } from 'sonner'

interface ItemDeleteConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ItemServico | null
  onSuccess: () => void
}

export function ItemDeleteConfirmation({
  open,
  onOpenChange,
  item,
  onSuccess,
}: ItemDeleteConfirmationProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!item) return

    setIsDeleting(true)
    try {
      await deleteItemServico(item.id)
      toast.success('Item excluido com sucesso')
      onSuccess()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao excluir item'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  // Truncate observacao for display
  const truncatedObservacao = item?.observacao
    ? item.observacao.length > 100
      ? item.observacao.slice(0, 100) + '...'
      : item.observacao
    : ''

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir item de verificacao?</AlertDialogTitle>
          <AlertDialogDescription>
            Este item sera excluido permanentemente. Esta acao nao pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Show item observacao for context */}
        {item && (
          <div className="rounded-md bg-surface-100 p-3 my-2">
            <p className="text-sm text-foreground-light">{truncatedObservacao}</p>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
