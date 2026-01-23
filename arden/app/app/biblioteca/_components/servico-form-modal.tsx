'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  servicoFormSchema,
  servicoEditFormSchema,
  type ServicoFormData,
  type ServicoEditFormData,
  categoriaServicoOptions,
} from '@/lib/validations/servico'
import { createServico, updateServicoWithRevision, type Servico } from '@/lib/supabase/queries/servicos'
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

  const isEditMode = mode === 'edit'

  // Type for form data that works for both modes
  type FormData = ServicoFormData | ServicoEditFormData

  const defaultValues = useMemo(() => ({
    codigo: servico?.codigo ?? '',
    nome: servico?.nome ?? '',
    categoria: servico?.categoria ?? undefined,
    referencia_normativa: servico?.referencia_normativa ?? '',
    ...(mode === 'edit' ? { descricao_mudanca: '' } : {}),
  }), [servico, mode])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(isEditMode ? servicoEditFormSchema : servicoFormSchema),
    defaultValues,
  })

  const categoria = watch('categoria')

  // Reset form when servico changes (switching between create/edit or editing different servico)
  useEffect(() => {
    const newDefaults = {
      codigo: servico?.codigo ?? '',
      nome: servico?.nome ?? '',
      categoria: servico?.categoria ?? undefined,
      referencia_normativa: servico?.referencia_normativa ?? '',
      ...(mode === 'edit' ? { descricao_mudanca: '' } : {}),
    }
    reset(newDefaults)
  }, [servico?.id, mode, reset])

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'edit' && servico) {
        // Edit mode: use revision-aware update
        const editData = data as ServicoEditFormData
        await updateServicoWithRevision(servico.id, {
          codigo: editData.codigo,
          nome: editData.nome,
          categoria: editData.categoria || null,
          referencia_normativa: editData.referencia_normativa || null,
          descricao_mudanca: editData.descricao_mudanca,
        })
        toast.success('Serviço atualizado com sucesso')
      } else {
        // Create mode: normal create
        const createData = data as ServicoFormData
        await createServico({
          codigo: createData.codigo,
          nome: createData.nome,
          categoria: createData.categoria || null,
          referencia_normativa: createData.referencia_normativa || null,
        })
        toast.success('Serviço criado com sucesso')
      }
      onSuccess()
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : (mode === 'edit' ? 'Erro ao atualizar serviço' : 'Erro ao criar serviço')
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Serviço' : 'Novo Serviço'}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEditMode ? 'Edite as informações do serviço' : 'Preencha as informações do novo serviço'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Codigo (required) */}
          <div className="space-y-2">
            <Label htmlFor="codigo">Código *</Label>
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
              placeholder="Ex: Execução de Alvenaria de Vedação"
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
            <Label htmlFor="referencia_normativa">Referência Normativa</Label>
            <Textarea
              id="referencia_normativa"
              placeholder="Ex: NBR 15575, PBQP-H SiAC"
              {...register('referencia_normativa')}
            />
          </div>

          {/* Descricao da Mudanca (only in edit mode, required) */}
          {isEditMode && (
            <div className="space-y-2">
              <Label htmlFor="descricao_mudanca">Descrição da Mudança *</Label>
              <Textarea
                id="descricao_mudanca"
                placeholder="Descreva o que foi alterado nesta revisão"
                {...register('descricao_mudanca' as keyof FormData)}
                className={(errors as Record<string, { message?: string }>).descricao_mudanca ? 'border-destructive' : ''}
              />
              {(errors as Record<string, { message?: string }>).descricao_mudanca && (
                <p className="text-destructive text-xs">{(errors as Record<string, { message?: string }>).descricao_mudanca.message}</p>
              )}
              <p className="text-xs text-foreground-muted">
                Uma nova revisão será criada ao salvar
              </p>
            </div>
          )}

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
                : (isEditMode ? 'Salvar' : 'Criar Serviço')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
