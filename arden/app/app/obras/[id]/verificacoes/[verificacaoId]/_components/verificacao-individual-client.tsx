'use client'

import { useState, useTransition } from 'react'
import { marcarItemVerificacao } from '@/lib/supabase/actions/itens-verificacao'
import { marcarItemReinspecao } from '@/lib/supabase/actions/itens-verificacao'
import {
  atualizarResultadoVerificacao,
  atualizarDescricaoVerificacao,
} from '@/lib/supabase/actions/verificacoes'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Lock, AlertTriangle, Check } from 'lucide-react'
import { VerificacaoHeader } from './verificacao-header'
import { ItemChecklist } from './item-checklist'
import { ExcecaoModal } from './excecao-modal'
import { ReinspecaoModal } from './reinspecao-modal'
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
  const [reinspecaoItem, setReinspecaoItem] = useState<ItemVerificacao | null>(
    null
  )
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

  // Compute verification result state
  const allItemsMarked =
    verificacao.itens_verificados === verificacao.total_itens &&
    verificacao.total_itens > 0

  const hasAnyNC =
    verificacao.itens_nc > 0 &&
    itens.some(
      (item) => item.status === 'nao_conforme' && !item.status_reinspecao
    )

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

  const handleReinspecao = (
    statusReinspecao:
      | 'conforme_apos_reinspecao'
      | 'retrabalho'
      | 'aprovado_com_concessao'
      | 'reprovado_apos_retrabalho',
    observacao?: string
  ) => {
    if (!reinspecaoItem) return

    // 1. Optimistic update
    setItens((prev) =>
      prev.map((item) =>
        item.id === reinspecaoItem.id
          ? {
              ...item,
              status_reinspecao: statusReinspecao,
              observacao_reinspecao: observacao || null,
              data_reinspecao: new Date().toISOString(),
              ciclos_reinspecao: (item.ciclos_reinspecao ?? 0) + 1,
            }
          : item
      )
    )

    // 2. Server Action call with error rollback
    startTransition(async () => {
      const result = await marcarItemReinspecao({
        item_verificacao_id: reinspecaoItem.id,
        status_reinspecao: statusReinspecao,
        observacao_reinspecao: observacao,
      })

      if (result.error) {
        toast.error(result.error)
        // Rollback to original state
        setItens(verificacao.itens)
      } else {
        toast.success('Reinspeção registrada')
        // Server Action calls revalidatePath internally
      }
    })

    setReinspecaoItem(null)
  }

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
        {/* Locked state banner */}
        {isLocked && (
          <div className="flex items-center gap-3 p-4 rounded-md bg-brand-200 border border-brand">
            <Lock className="h-5 w-5 text-brand-600" />
            <div>
              <div className="text-sm font-medium text-brand-600">
                Verificação travada
              </div>
              <div className="text-xs text-brand-600 mt-0.5">
                Esta verificação está Conforme e concluída. Não pode ser
                alterada.
              </div>
            </div>
          </div>
        )}

        {/* NC result banner */}
        {!isLocked && allItemsMarked && hasAnyNC && (
          <div className="flex items-center gap-3 p-4 rounded-md bg-destructive-200 border border-destructive">
            <AlertTriangle className="h-5 w-5 text-destructive-600" />
            <div>
              <div className="text-sm font-medium text-destructive-600">
                Verificação Não Conforme
              </div>
              <div className="text-xs text-destructive-600 mt-0.5">
                Esta verificação possui itens não conformes pendentes de
                reinspeção.
              </div>
            </div>
          </div>
        )}

        {/* Conforme result banner */}
        {!isLocked && allItemsMarked && !hasAnyNC && (
          <div className="flex items-center gap-3 p-4 rounded-md bg-brand-200 border border-brand">
            <Check className="h-5 w-5 text-brand-600" />
            <div>
              <div className="text-sm font-medium text-brand-600">
                Verificação Conforme
              </div>
              <div className="text-xs text-brand-600 mt-0.5">
                Todos os itens foram verificados e estão conformes ou com
                reinspeção concluída.
              </div>
            </div>
          </div>
        )}

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
          onReinspecionar={(item) => setReinspecaoItem(item)}
          disabled={isLocked || isPending}
        />
      </div>

      {/* Exceção Modal */}
      <ExcecaoModal
        open={excecaoModalOpen}
        onOpenChange={setExcecaoModalOpen}
        onConfirm={handleExcecao}
        isSubmitting={isPending}
      />

      {/* Reinspeção Modal */}
      {reinspecaoItem && (
        <ReinspecaoModal
          open={reinspecaoItem !== null}
          onOpenChange={(open) => {
            if (!open) setReinspecaoItem(null)
          }}
          itemNome={reinspecaoItem.item_servico.observacao}
          onConfirm={handleReinspecao}
        />
      )}
      </div>
    </>
  )
}
