'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  obraFormSchema,
  type ObraFormData,
  tipologiaOptions,
} from '@/lib/validations/obra'
import { createObra, updateObra, type Obra } from '@/lib/supabase/queries/obras'
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
  mode?: 'create' | 'edit'
  obra?: Obra | null
}

export function ObraFormModal({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  obra = null,
}: ObraFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues = useMemo(() => ({
    nome: obra?.nome ?? '',
    codigo: obra?.codigo ?? '',
    tipologia: obra?.tipologia ?? undefined,
    cidade: '', // Not in DB, keep empty
    estado: '', // Not in DB, keep empty
    responsavel_tecnico: obra?.responsavel_tecnico ?? '',
  }), [obra])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ObraFormData>({
    resolver: zodResolver(obraFormSchema),
    defaultValues,
  })

  const tipologia = watch('tipologia')

  // Reset form when obra changes (switching between create/edit or editing different obra)
  useEffect(() => {
    reset(defaultValues)
  }, [obra?.id, reset, defaultValues])

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

      if (mode === 'edit' && obra) {
        await updateObra(obra.id, cleanedData)
        toast.success('Obra atualizada com sucesso')
      } else {
        await createObra(cleanedData)
        toast.success('Obra criada com sucesso')
      }
      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : (mode === 'edit' ? 'Erro ao atualizar obra' : 'Erro ao criar obra')
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEditMode = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Obra' : 'Nova Obra'}</DialogTitle>
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
              {isSubmitting
                ? (isEditMode ? 'Salvando...' : 'Criando...')
                : (isEditMode ? 'Salvar' : 'Criar Obra')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
