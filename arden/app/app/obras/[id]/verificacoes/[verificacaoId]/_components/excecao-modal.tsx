'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const excecaoSchema = z.object({
  justificativa: z.string().min(1, 'Justificativa é obrigatória'),
})

type ExcecaoFormData = z.infer<typeof excecaoSchema>

interface ExcecaoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (justificativa: string) => void
  isSubmitting?: boolean
}

export function ExcecaoModal({
  open,
  onOpenChange,
  onConfirm,
  isSubmitting = false,
}: ExcecaoModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ExcecaoFormData>({
    resolver: zodResolver(excecaoSchema),
  })

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = (data: ExcecaoFormData) => {
    onConfirm(data.justificativa)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Marcar como Exceção</AlertDialogTitle>
            <AlertDialogDescription>
              Este serviço não se aplica a esta unidade. Informe a
              justificativa abaixo.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="py-4">
            <Label htmlFor="justificativa" className="text-sm">
              Justificativa
            </Label>
            <Textarea
              id="justificativa"
              {...register('justificativa')}
              placeholder="Explique por que este serviço não se aplica..."
              className="mt-1.5"
              rows={4}
              disabled={isSubmitting}
            />
            {errors.justificativa && (
              <p className="text-xs text-destructive mt-1">
                {errors.justificativa.message}
              </p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              variant="default"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Confirmando...' : 'Confirmar Exceção'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
