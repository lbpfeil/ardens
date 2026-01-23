'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  itemServicoFormSchema,
  type ItemServicoFormData,
} from '@/lib/validations/item-servico'
import {
  createItemServico,
  updateItemServico,
  type ItemServico,
} from '@/lib/supabase/queries/itens-servico'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import type { Tag } from '@/lib/supabase/queries/tags'

interface ItemServicoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  servicoId: string
  mode?: 'create' | 'edit'
  item?: ItemServico | null
  tags: Tag[]
}

export function ItemServicoFormModal({
  open,
  onOpenChange,
  onSuccess,
  servicoId,
  mode = 'create',
  item = null,
  tags,
}: ItemServicoFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const defaultValues = useMemo(
    () => ({
      observacao: item?.observacao ?? '',
      metodo: item?.metodo ?? '',
      tolerancia: item?.tolerancia ?? '',
      tag_id: item?.tag_id ?? null,
    }),
    [item]
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ItemServicoFormData>({
    resolver: zodResolver(itemServicoFormSchema),
    defaultValues,
  })

  const tagId = watch('tag_id')

  // Reset form when item changes
  useEffect(() => {
    reset(defaultValues)
  }, [item?.id, reset, defaultValues])

  const onSubmit = async (data: ItemServicoFormData) => {
    setIsSubmitting(true)
    try {
      // Clean empty strings to null for optional fields
      const cleanedData = {
        observacao: data.observacao,
        metodo: data.metodo || null,
        tolerancia: data.tolerancia || null,
        tag_id: data.tag_id || null,
      }

      if (mode === 'edit' && item) {
        await updateItemServico(item.id, cleanedData)
        toast.success('Item atualizado com sucesso')
      } else {
        await createItemServico({
          servico_id: servicoId,
          ...cleanedData,
        })
        toast.success('Item criado com sucesso')
      }
      onSuccess()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : mode === 'edit'
          ? 'Erro ao atualizar item'
          : 'Erro ao criar item'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isEditMode = mode === 'edit'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Item de Verificação' : 'Novo Item de Verificação'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {isEditMode
              ? 'Edite as informações do item de verificação'
              : 'Preencha as informações do novo item de verificação'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Observacao (required) */}
          <div className="space-y-2">
            <Label htmlFor="observacao">Observação *</Label>
            <Textarea
              id="observacao"
              placeholder="O que deve ser verificado"
              rows={3}
              {...register('observacao')}
              className={errors.observacao ? 'border-destructive' : ''}
            />
            {errors.observacao && (
              <p className="text-destructive text-xs">{errors.observacao.message}</p>
            )}
          </div>

          {/* Metodo (optional) */}
          <div className="space-y-2">
            <Label htmlFor="metodo">Método</Label>
            <Textarea
              id="metodo"
              placeholder="Como verificar (medição, visual, etc.)"
              rows={2}
              {...register('metodo')}
            />
          </div>

          {/* Tolerancia (optional) */}
          <div className="space-y-2">
            <Label htmlFor="tolerancia">Critério de Aceitação</Label>
            <Input
              id="tolerancia"
              placeholder="Ex: +/- 5mm, nivelado, sem falhas"
              {...register('tolerancia')}
            />
          </div>

          {/* Tag Selector */}
          <div className="space-y-2">
            <Label htmlFor="tag_id">Tag</Label>
            <Select
              value={tagId ?? 'none'}
              onValueChange={(value) => setValue('tag_id', value === 'none' ? null : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sem tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem tag</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-sm flex-shrink-0"
                        style={{ backgroundColor: tag.cor }}
                      />
                      {tag.nome}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-foreground-muted">
              Tags agrupam itens na tabela de verificação
            </p>
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
                ? isEditMode
                  ? 'Salvando...'
                  : 'Criando...'
                : isEditMode
                ? 'Salvar'
                : 'Criar Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
