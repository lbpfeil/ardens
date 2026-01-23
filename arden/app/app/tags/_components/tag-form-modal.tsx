'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tagFormSchema, type TagFormData } from '@/lib/validations/tag'
import { createTag, updateTag, TAG_COLORS, type Tag } from '@/lib/supabase/queries/tags'
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
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TagFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  mode?: 'create' | 'edit'
  tag?: Tag | null
}

export function TagFormModal({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  tag = null,
}: TagFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isEditMode = mode === 'edit'

  const defaultValues = useMemo(() => ({
    nome: tag?.nome ?? '',
    cor: tag?.cor ?? TAG_COLORS[0],
  }), [tag])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TagFormData>({
    resolver: zodResolver(tagFormSchema),
    defaultValues,
  })

  const selectedColor = watch('cor')

  // Reset form when tag changes
  useEffect(() => {
    reset(defaultValues)
  }, [tag?.id, mode, reset, defaultValues])

  const onSubmit = async (data: TagFormData) => {
    setIsSubmitting(true)
    try {
      if (mode === 'edit' && tag) {
        await updateTag(tag.id, data)
        toast.success('Tag atualizada com sucesso')
      } else {
        await createTag(data)
        toast.success('Tag criada com sucesso')
      }
      onSuccess()
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : (mode === 'edit' ? 'Erro ao atualizar tag' : 'Erro ao criar tag')
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Tag' : 'Nova Tag'}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEditMode ? 'Edite as informações da tag' : 'Preencha as informações da nova tag'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              placeholder="Ex: Alvenaria, Pintura, Etapa 1"
              {...register('nome')}
              className={errors.nome ? 'border-destructive' : ''}
            />
            {errors.nome && (
              <p className="text-destructive text-xs">{errors.nome.message}</p>
            )}
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Cor *</Label>
            <div className="flex flex-wrap gap-2">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setValue('cor', color)}
                  className={cn(
                    "h-8 w-8 rounded-md border-2 transition-all",
                    selectedColor === color
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Selecionar cor ${color}`}
                />
              ))}
            </div>
            {errors.cor && (
              <p className="text-destructive text-xs">{errors.cor.message}</p>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="flex items-center gap-2 p-3 rounded-md bg-surface-100 border border-border">
              <div
                className="h-4 w-1 rounded-full"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-foreground text-sm">
                {watch('nome') || 'Nome da tag'}
              </span>
            </div>
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
                : (isEditMode ? 'Salvar' : 'Criar Tag')
              }
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
