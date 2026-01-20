'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  unidadeFormSchema,
  unidadeBatchSchema,
  parseNumericRange,
  generateUnidadeNames,
  type UnidadeFormData,
  type UnidadeBatchData,
} from '@/lib/validations/unidade'
import {
  createUnidade,
  createUnidadesBatch,
  updateUnidade,
  type Unidade,
} from '@/lib/supabase/queries/unidades'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface UnidadeFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  mode: 'create' | 'edit'
  unidade: Unidade | null
  agrupamentoId: string
}

export function UnidadeFormModal({
  open,
  onOpenChange,
  onSuccess,
  mode,
  unidade,
  agrupamentoId,
}: UnidadeFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBatchMode, setIsBatchMode] = useState(false)

  const isEditMode = mode === 'edit'

  // Single form
  const singleDefaultValues = useMemo(
    () => ({
      nome: unidade?.nome ?? '',
    }),
    [unidade]
  )

  const singleForm = useForm<UnidadeFormData>({
    resolver: zodResolver(unidadeFormSchema),
    defaultValues: singleDefaultValues,
  })

  // Batch form
  const batchDefaultValues = useMemo(
    () => ({
      rangeInput: '',
    }),
    []
  )

  const batchForm = useForm<UnidadeBatchData>({
    resolver: zodResolver(unidadeBatchSchema),
    defaultValues: batchDefaultValues,
  })

  // Reset forms when modal opens/closes or unidade changes
  useEffect(() => {
    if (open) {
      singleForm.reset(singleDefaultValues)
      batchForm.reset(batchDefaultValues)
      setIsBatchMode(false)
    }
  }, [open, unidade?.id, singleForm, batchForm, singleDefaultValues, batchDefaultValues])

  // Watch batch values for preview
  const rangeInput = batchForm.watch('rangeInput')

  // Generate preview names
  const previewData = useMemo((): { preview: string[]; total: number; hasMore: boolean } | null => {
    if (!rangeInput) return null
    const parsed = parseNumericRange(rangeInput)
    if (!parsed) return null

    const names = generateUnidadeNames(parsed)
    const preview = names.slice(0, 5)
    const hasMore = names.length > 5

    return { preview, total: names.length, hasMore }
  }, [rangeInput])

  const onSingleSubmit = async (data: UnidadeFormData) => {
    setIsSubmitting(true)
    try {
      if (isEditMode && unidade) {
        await updateUnidade(unidade.id, { nome: data.nome })
        toast.success('Unidade atualizada com sucesso')
      } else {
        await createUnidade(agrupamentoId, { nome: data.nome })
        toast.success('Unidade criada com sucesso')
      }
      onSuccess()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isEditMode
          ? 'Erro ao atualizar unidade'
          : 'Erro ao criar unidade'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onBatchSubmit = async (data: UnidadeBatchData) => {
    setIsSubmitting(true)
    try {
      const parsed = parseNumericRange(data.rangeInput)
      if (!parsed) {
        toast.error('Formato inválido')
        return
      }

      const names = generateUnidadeNames(parsed)
      await createUnidadesBatch(agrupamentoId, names)
      toast.success(`${names.length} unidades criadas com sucesso`)
      onSuccess()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar unidades'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine dialog title
  const getTitle = () => {
    if (isEditMode) return 'Editar Unidade'
    if (isBatchMode) return 'Novas Unidades (Lote)'
    return 'Nova Unidade'
  }

  // Determine submit button text
  const getSubmitText = () => {
    if (isSubmitting) {
      return isEditMode ? 'Salvando...' : 'Criando...'
    }
    if (isEditMode) return 'Salvar'
    if (isBatchMode && previewData) {
      return `Criar ${previewData.total} Unidades`
    }
    return 'Criar Unidade'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription className="sr-only">
            {isEditMode ? 'Formulário para editar unidade' : 'Formulário para criar nova unidade'}
          </DialogDescription>
        </DialogHeader>

        {/* Batch mode toggle (only in create mode) */}
        {!isEditMode && (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="batch-mode"
              checked={isBatchMode}
              onCheckedChange={(checked) => setIsBatchMode(checked === true)}
            />
            <Label htmlFor="batch-mode" className="text-sm font-normal cursor-pointer">
              Criar múltiplas unidades
            </Label>
          </div>
        )}

        {/* Single mode form */}
        {!isBatchMode && (
          <form onSubmit={singleForm.handleSubmit(onSingleSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                placeholder="Ex: Apto 101"
                {...singleForm.register('nome')}
                className={singleForm.formState.errors.nome ? 'border-destructive' : ''}
              />
              {singleForm.formState.errors.nome && (
                <p className="text-destructive text-xs">
                  {singleForm.formState.errors.nome.message}
                </p>
              )}
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
                {getSubmitText()}
              </Button>
            </DialogFooter>
          </form>
        )}

        {/* Batch mode form */}
        {isBatchMode && (
          <form onSubmit={batchForm.handleSubmit(onBatchSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rangeInput">Intervalo *</Label>
              <Input
                id="rangeInput"
                placeholder="Apto 101-110"
                {...batchForm.register('rangeInput')}
                className={batchForm.formState.errors.rangeInput ? 'border-destructive' : ''}
              />
              {batchForm.formState.errors.rangeInput && (
                <p className="text-destructive text-xs">
                  {batchForm.formState.errors.rangeInput.message}
                </p>
              )}
              <p className="text-xs text-foreground-muted">
                Formato: &quot;Prefixo inicio-fim&quot; (ex: Apto 101-110) ou &quot;inicio-fim&quot; (ex: 101-110)
              </p>
            </div>

            {/* Preview */}
            {previewData && previewData.preview.length > 0 && (
              <div className="rounded-md bg-surface-100 p-3">
                <p className="text-xs text-foreground-muted mb-1">Será criado:</p>
                <p className="text-sm text-foreground-light">
                  {previewData.preview.join(', ')}
                  {previewData.hasMore && `, ... (${previewData.total} unidades)`}
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
                {getSubmitText()}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
