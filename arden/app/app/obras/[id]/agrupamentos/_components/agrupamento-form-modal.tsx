'use client'

import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  agrupamentoFormSchema,
  agrupamentoBatchSchema,
  generateBatchNames,
  type AgrupamentoFormData,
  type AgrupamentoBatchData,
} from '@/lib/validations/agrupamento'
import {
  createAgrupamento,
  createAgrupamentosBatch,
  updateAgrupamento,
  type Agrupamento,
} from '@/lib/supabase/queries/agrupamentos'
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
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'

interface AgrupamentoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  mode?: 'create' | 'edit'
  agrupamento?: Agrupamento | null
  obraId: string
}

export function AgrupamentoFormModal({
  open,
  onOpenChange,
  onSuccess,
  mode = 'create',
  agrupamento = null,
  obraId,
}: AgrupamentoFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isBatchMode, setIsBatchMode] = useState(false)

  const isEditMode = mode === 'edit'

  // Single form
  const singleDefaultValues = useMemo(
    () => ({
      nome: agrupamento?.nome ?? '',
    }),
    [agrupamento]
  )

  const singleForm = useForm<AgrupamentoFormData>({
    resolver: zodResolver(agrupamentoFormSchema),
    defaultValues: singleDefaultValues,
  })

  // Batch form
  const batchDefaultValues = useMemo(
    () => ({
      prefixo: '',
      quantidade: 5,
      numeroInicial: 1,
    }),
    []
  )

  const batchForm = useForm<AgrupamentoBatchData>({
    resolver: zodResolver(agrupamentoBatchSchema),
    defaultValues: batchDefaultValues,
  })

  // Reset forms when modal opens/closes or agrupamento changes
  useEffect(() => {
    if (open) {
      singleForm.reset(singleDefaultValues)
      batchForm.reset(batchDefaultValues)
      setIsBatchMode(false)
    }
  }, [open, agrupamento?.id, singleForm, batchForm, singleDefaultValues, batchDefaultValues])

  // Watch batch values for preview
  const prefixo = batchForm.watch('prefixo')
  const quantidade = batchForm.watch('quantidade')
  const numeroInicial = batchForm.watch('numeroInicial')

  // Generate preview names
  const previewNames = useMemo(() => {
    if (!prefixo || !quantidade || numeroInicial === undefined) return []
    const names = generateBatchNames(prefixo, Math.min(quantidade, 5), numeroInicial)
    if (quantidade > 5) {
      return [...names, '...']
    }
    return names
  }, [prefixo, quantidade, numeroInicial])

  const onSingleSubmit = async (data: AgrupamentoFormData) => {
    setIsSubmitting(true)
    try {
      if (isEditMode && agrupamento) {
        await updateAgrupamento(agrupamento.id, { nome: data.nome })
        toast.success('Agrupamento atualizado com sucesso')
      } else {
        await createAgrupamento(obraId, { nome: data.nome })
        toast.success('Agrupamento criado com sucesso')
      }
      onSuccess()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : isEditMode
          ? 'Erro ao atualizar agrupamento'
          : 'Erro ao criar agrupamento'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onBatchSubmit = async (data: AgrupamentoBatchData) => {
    setIsSubmitting(true)
    try {
      const names = generateBatchNames(data.prefixo, data.quantidade, data.numeroInicial)
      await createAgrupamentosBatch(obraId, names)
      toast.success(`${data.quantidade} agrupamentos criados com sucesso`)
      onSuccess()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar agrupamentos'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Determine dialog title
  const getTitle = () => {
    if (isEditMode) return 'Editar Agrupamento'
    if (isBatchMode) return 'Novos Agrupamentos (Lote)'
    return 'Novo Agrupamento'
  }

  // Determine submit button text
  const getSubmitText = () => {
    if (isSubmitting) {
      return isEditMode ? 'Salvando...' : 'Criando...'
    }
    if (isEditMode) return 'Salvar'
    if (isBatchMode) return `Criar ${quantidade || 0} Agrupamentos`
    return 'Criar Agrupamento'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
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
              Criar em lote
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
                placeholder="Ex: Bloco A"
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
              <Label htmlFor="prefixo">Prefixo *</Label>
              <Input
                id="prefixo"
                placeholder="Ex: Bloco"
                {...batchForm.register('prefixo')}
                className={batchForm.formState.errors.prefixo ? 'border-destructive' : ''}
              />
              {batchForm.formState.errors.prefixo && (
                <p className="text-destructive text-xs">
                  {batchForm.formState.errors.prefixo.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade *</Label>
                <Input
                  id="quantidade"
                  type="number"
                  placeholder="Ex: 5"
                  {...batchForm.register('quantidade', { valueAsNumber: true })}
                  className={batchForm.formState.errors.quantidade ? 'border-destructive' : ''}
                />
                {batchForm.formState.errors.quantidade && (
                  <p className="text-destructive text-xs">
                    {batchForm.formState.errors.quantidade.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroInicial">Número Inicial *</Label>
                <Input
                  id="numeroInicial"
                  type="number"
                  placeholder="Ex: 1"
                  {...batchForm.register('numeroInicial', { valueAsNumber: true })}
                  className={batchForm.formState.errors.numeroInicial ? 'border-destructive' : ''}
                />
                {batchForm.formState.errors.numeroInicial && (
                  <p className="text-destructive text-xs">
                    {batchForm.formState.errors.numeroInicial.message}
                  </p>
                )}
              </div>
            </div>

            {/* Preview */}
            {previewNames.length > 0 && (
              <div className="rounded-md bg-surface-100 p-3">
                <p className="text-xs text-foreground-muted mb-1">Será criado:</p>
                <p className="text-sm text-foreground-light">{previewNames.join(', ')}</p>
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
