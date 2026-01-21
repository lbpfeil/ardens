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
import { deleteAgrupamentosBatch } from '@/lib/supabase/queries/agrupamentos'
import { deleteUnidadesBatch } from '@/lib/supabase/queries/unidades'
import { toast } from 'sonner'

interface BulkDeleteConfirmationProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids: string[]
  type: 'agrupamentos' | 'unidades'
  onSuccess: () => void
}

export function BulkDeleteConfirmation({
  open,
  onOpenChange,
  ids,
  type,
  onSuccess,
}: BulkDeleteConfirmationProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    if (ids.length === 0) return

    setIsLoading(true)
    try {
      if (type === 'agrupamentos') {
        await deleteAgrupamentosBatch(ids)
        toast.success(`${ids.length} agrupamento${ids.length > 1 ? 's' : ''} excluido${ids.length > 1 ? 's' : ''} com sucesso`)
      } else {
        await deleteUnidadesBatch(ids)
        toast.success(`${ids.length} unidade${ids.length > 1 ? 's' : ''} excluida${ids.length > 1 ? 's' : ''} com sucesso`)
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `Erro ao excluir ${type}`)
    } finally {
      setIsLoading(false)
    }
  }

  const getTitle = () => {
    if (type === 'agrupamentos') {
      return ids.length === 1 ? 'Excluir Agrupamento' : 'Excluir Agrupamentos'
    }
    return ids.length === 1 ? 'Excluir Unidade' : 'Excluir Unidades'
  }

  const getDescription = () => {
    if (type === 'agrupamentos') {
      if (ids.length === 1) {
        return 'Tem certeza que deseja excluir este agrupamento e todas as suas unidades? Esta acao nao pode ser desfeita.'
      }
      return `Tem certeza que deseja excluir ${ids.length} agrupamentos e todas as suas unidades? Esta acao nao pode ser desfeita.`
    }
    if (ids.length === 1) {
      return 'Tem certeza que deseja excluir esta unidade? Esta acao nao pode ser desfeita.'
    }
    return `Tem certeza que deseja excluir ${ids.length} unidades? Esta acao nao pode ser desfeita.`
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{getTitle()}</AlertDialogTitle>
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
