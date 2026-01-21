'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  servicoFormSchema,
  type ServicoFormData,
  categoriaServicoOptions,
} from '@/lib/validations/servico'
import { createServico, updateServico, type Servico } from '@/lib/supabase/queries/servicos'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface ServicoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  mode?: 'create' | 'edit'
  servico?: Servico | null
}

export function ServicoFormModal({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  servico = null,
}: ServicoFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues = useMemo(() => ({
    codigo: servico?.codigo ?? '',
    nome: servico?.nome ?? '',
    categoria: servico?.categoria ?? undefined,
    referencia_normativa: servico?.referencia_normativa ?? '',
  }), [servico])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ServicoFormData>({
    resolver: zodResolver(servicoFormSchema),
    defaultValues,
  })

  const categoria = watch('categoria')

  // Reset form when servico changes (switching between create/edit or editing different servico)
  useEffect(() => {
    reset(defaultValues)
  }, [servico?.id, reset, defaultValues])

  const onSubmit = async (data: ServicoFormData) => {
    setIsSubmitting(true)
    try {
      // Clean empty strings to null/undefined for optional fields
      const cleanedData = {
        codigo: data.codigo,
        nome: data.nome,
        categoria: data.categoria || null,
        referencia_normativa: data.referencia_normativa || null,
      }

      if (mode === 'edit' && servico) {
        await updateServico(servico.id, cleanedData)
        toast.success('Servico atualizado com sucesso')
      } else {
        await createServico(cleanedData)
        toast.success('Servico criado com sucesso')
      }
      onSuccess()
    } catch (error) {
      const message = error instanceof Error ? error.message : (mode === 'edit' ? 'Erro ao atualizar servico' : 'Erro ao criar servico')
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
          <DialogTitle>{isEditMode ? 'Editar Servico' : 'Novo Servico'}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEditMode ? 'Edite as informacoes do servico' : 'Preencha as informacoes do novo servico'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Codigo (required) */}
          <div className="space-y-2">
            <Label htmlFor="codigo">Codigo *</Label>
            <Input
              id="codigo"
              placeholder="Ex: ALV-001"
              {...register('codigo')}
              className={errors.codigo ? 'border-destructive' : ''}
            />
            {errors.codigo && (
              <p className="text-destructive text-xs">{errors.codigo.message}</p>
            )}
          </div>

          {/* Nome (required) */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              placeholder="Ex: Execucao de Alvenaria de Vedacao"
              {...register('nome')}
              className={errors.nome ? 'border-destructive' : ''}
            />
            {errors.nome && (
              <p className="text-destructive text-xs">{errors.nome.message}</p>
            )}
          </div>

          {/* Categoria (optional) */}
          <div className="space-y-2">
            <Label htmlFor="categoria">Categoria</Label>
            <Select
              value={categoria || ''}
              onValueChange={(value) =>
                setValue('categoria', value as ServicoFormData['categoria'])
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categoriaServicoOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Referencia Normativa (optional) */}
          <div className="space-y-2">
            <Label htmlFor="referencia_normativa">Referencia Normativa</Label>
            <Textarea
              id="referencia_normativa"
              placeholder="Ex: NBR 15575, PBQP-H SiAC"
              {...register('referencia_normativa')}
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
                : (isEditMode ? 'Salvar' : 'Criar Servico')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
