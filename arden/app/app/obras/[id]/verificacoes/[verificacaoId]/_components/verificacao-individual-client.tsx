'use client'

import { useState, useTransition } from 'react'
import { marcarItemVerificacao } from '@/lib/supabase/actions/itens-verificacao'
import {
  atualizarResultadoVerificacao,
  atualizarDescricaoVerificacao,
} from '@/lib/supabase/actions/verificacoes'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { VerificacaoHeader } from './verificacao-header'
import { ItemChecklist } from './item-checklist'
import { ExcecaoModal } from './excecao-modal'
import type {
  VerificacaoComItens,
  ItemVerificacao,
} from '@/lib/supabase/queries/verificacoes'

interface VerificacaoIndividualClientProps {
  verificacao: VerificacaoComItens
  servicoNome?: string
  servicoCodigo?: string
  unidadeNome?: string
  obraNome?: string
}

export function VerificacaoIndividualClient({
  verificacao,
  servicoNome,
  servicoCodigo,
  unidadeNome,
  obraNome,
}: VerificacaoIndividualClientProps) {
  const [itens, setItens] = useState<ItemVerificacao[]>(verificacao.itens)
  const [descricao, setDescricao] = useState<string>(verificacao.descricao || '')
  const [excecaoModalOpen, setExcecaoModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isSavingDescricao, setIsSavingDescricao] = useState(false)

  // Compute locked state (Conforme concluída = travada)
  const isLocked =
    verificacao.status === 'concluida' &&
    verificacao.total_itens > 0 &&
    verificacao.itens_conformes === verificacao.total_itens

  // Check if all items are exceção (indicates verification marked as Exceção)
  const isExcecao =
    verificacao.total_itens > 0 &&
    verificacao.itens_excecao === verificacao.total_itens

  const handleItemMark = (
    itemId: string,
    status: 'conforme' | 'nao_conforme' | 'excecao',
    observacao?: string
  ) => {
    // 1. Optimistic update
    setItens((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status,
              observacao: observacao || item.observacao,
              data_inspecao: new Date().toISOString(),
            }
          : item
      )
    )

    // 2. Server Action call with error rollback
    startTransition(async () => {
      const result = await marcarItemVerificacao({
        item_verificacao_id: itemId,
        status,
        observacao,
      })

      if (result.error) {
        toast.error(result.error)
        // Rollback to original state
        setItens(verificacao.itens)
      } else {
        toast.success('Item atualizado')
        // Server Action calls revalidatePath internally
      }
    })
  }

  const handleExcecao = (justificativa: string) => {
    // 1. Optimistic update — mark all items as exceção
    setItens((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'excecao',
        observacao: justificativa,
        data_inspecao: new Date().toISOString(),
      }))
    )

    // 2. Server Action call with error rollback
    startTransition(async () => {
      const result = await atualizarResultadoVerificacao({
        verificacao_id: verificacao.id,
        resultado: 'excecao',
        descricao: justificativa,
      })

      if (result.error) {
        toast.error(result.error)
        // Rollback to original state
        setItens(verificacao.itens)
      } else {
        toast.success('Verificação marcada como Exceção')
        // Server Action calls revalidatePath internally
      }
    })

    setExcecaoModalOpen(false)
  }

  const handleSaveDescricao = async () => {
    setIsSavingDescricao(true)

    const result = await atualizarDescricaoVerificacao({
      verificacao_id: verificacao.id,
      descricao,
    })

    setIsSavingDescricao(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Descrição salva')
      // Server Action calls revalidatePath internally
    }
  }

  const descricaoChanged = descricao !== (verificacao.descricao || '')

  return (
    <>
      {/* Header */}
      <VerificacaoHeader
        servicoNome={servicoNome}
        servicoCodigo={servicoCodigo}
        unidadeNome={unidadeNome}
        obraNome={obraNome}
        onExcecaoClick={() => setExcecaoModalOpen(true)}
        isExcecao={isExcecao}
        disabled={isLocked || isPending}
      />

      <div className="space-y-6">
        {/* Descrição geral */}
        <div>
        <label
          htmlFor="descricao"
          className="block text-sm font-medium text-foreground-light mb-2"
        >
          Descrição geral
        </label>
        <Textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Adicione observações gerais sobre esta verificação..."
          rows={3}
          disabled={isLocked || isPending}
          className="w-full"
        />
        {descricaoChanged && (
          <div className="mt-2">
            <Button
              size="sm"
              onClick={handleSaveDescricao}
              disabled={isSavingDescricao || isLocked}
            >
              {isSavingDescricao ? 'Salvando...' : 'Salvar descrição'}
            </Button>
          </div>
        )}
      </div>

      {/* Item checklist */}
      <div>
        <h2 className="text-sm font-medium text-foreground-light mb-3">
          Itens de verificação ({itens.length})
        </h2>
        <ItemChecklist
          itens={itens}
          onItemMark={handleItemMark}
          disabled={isLocked || isPending}
        />
      </div>

      {/* Locked state indicator */}
      {isLocked && (
        <div className="text-sm text-foreground-muted italic">
          Esta verificação está travada (Conforme concluída) e não pode ser
          alterada.
        </div>
      )}

      {/* Exceção Modal */}
      <ExcecaoModal
        open={excecaoModalOpen}
        onOpenChange={setExcecaoModalOpen}
        onConfirm={handleExcecao}
        isSubmitting={isPending}
      />
      </div>
    </>
  )
}
