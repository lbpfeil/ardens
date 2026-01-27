'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

// Zod schema for NC observation (required)
const ncObservacaoSchema = z.object({
  observacao: z.string().min(1, 'Observação é obrigatória para itens NC'),
})

type NCObservacaoFormData = z.infer<typeof ncObservacaoSchema>

interface ItemNCModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemNome: string
  onConfirm: (observacao: string) => void
  onCancel: () => void
}

export function ItemNCModal({
  open,
  onOpenChange,
  itemNome,
  onConfirm,
  onCancel,
}: ItemNCModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NCObservacaoFormData>({
    resolver: zodResolver(ncObservacaoSchema),
  })

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = (data: NCObservacaoFormData) => {
    onConfirm(data.observacao)
    reset()
    onOpenChange(false)
  }

  const handleCancel = () => {
    onCancel()
    reset()
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleCancel()
    } else {
      onOpenChange(newOpen)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Não Conformidade</DialogTitle>
          <p className="text-sm text-foreground-light mt-2">{itemNome}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="observacao">Observação</Label>
              <Textarea
                id="observacao"
                placeholder="Descreva o problema encontrado..."
                rows={4}
                {...register('observacao')}
              />
              {errors.observacao && (
                <p className="text-sm text-destructive mt-1">
                  {errors.observacao.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive">
              Marcar NC
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
