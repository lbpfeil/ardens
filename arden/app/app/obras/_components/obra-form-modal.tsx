'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  obraFormSchema,
  type ObraFormData,
  tipologiaOptions,
} from '@/lib/validations/obra'
import { createObra } from '@/lib/supabase/queries/obras'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface ObraFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ObraFormModal({
  open,
  onOpenChange,
  onSuccess,
}: ObraFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ObraFormData>({
    resolver: zodResolver(obraFormSchema),
    defaultValues: {
      nome: '',
      codigo: '',
      tipologia: undefined,
      cidade: '',
      estado: '',
      responsavel_tecnico: '',
    },
  })

  const tipologia = watch('tipologia')

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        nome: '',
        codigo: '',
        tipologia: undefined,
        cidade: '',
        estado: '',
        responsavel_tecnico: '',
      })
    }
  }, [open, reset])

  const onSubmit = async (data: ObraFormData) => {
    setIsSubmitting(true)
    try {
      // Clean empty strings to null/undefined for optional fields
      const cleanedData = {
        nome: data.nome,
        codigo: data.codigo || null,
        tipologia: data.tipologia || null,
        responsavel_tecnico: data.responsavel_tecnico || null,
        // Note: cidade/estado are not in the DB schema per ObraInsert type
        // They would need to be stored via coordinates or config in the future
      }

      await createObra(cleanedData)
      toast.success('Obra criada com sucesso')
      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar obra'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Obra</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome (required) */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              placeholder="Ex: Residencial Aurora"
              {...register('nome')}
              className={errors.nome ? 'border-destructive' : ''}
            />
            {errors.nome && (
              <p className="text-destructive text-xs">{errors.nome.message}</p>
            )}
          </div>

          {/* Tipologia (optional) */}
          <div className="space-y-2">
            <Label htmlFor="tipologia">Tipologia</Label>
            <Select
              value={tipologia || ''}
              onValueChange={(value) =>
                setValue('tipologia', value as ObraFormData['tipologia'])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a tipologia" />
              </SelectTrigger>
              <SelectContent>
                {tipologiaOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cidade / Estado */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="Ex: Sao Paulo"
                {...register('cidade')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">UF</Label>
              <Input
                id="estado"
                placeholder="SP"
                maxLength={2}
                {...register('estado')}
                className={errors.estado ? 'border-destructive' : ''}
              />
              {errors.estado && (
                <p className="text-destructive text-xs">{errors.estado.message}</p>
              )}
            </div>
          </div>

          {/* Responsavel Tecnico (optional) */}
          <div className="space-y-2">
            <Label htmlFor="responsavel_tecnico">Responsavel Tecnico</Label>
            <Input
              id="responsavel_tecnico"
              placeholder="Ex: Eng. Joao Silva"
              {...register('responsavel_tecnico')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Criando...' : 'Criar Obra'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
