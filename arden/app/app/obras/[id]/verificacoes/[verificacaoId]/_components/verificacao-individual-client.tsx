'use client'

import { useState, useTransition } from 'react'
import { marcarItemVerificacao } from '@/lib/supabase/actions/itens-verificacao'
import { toast } from 'sonner'
import { ItemChecklist } from './item-checklist'
import type {
  VerificacaoComItens,
  ItemVerificacao,
} from '@/lib/supabase/queries/verificacoes'

interface VerificacaoIndividualClientProps {
  verificacao: VerificacaoComItens
}

export function VerificacaoIndividualClient({
  verificacao,
}: VerificacaoIndividualClientProps) {
  const [itens, setItens] = useState<ItemVerificacao[]>(verificacao.itens)
  const [isPending, startTransition] = useTransition()

  // Compute locked state (Conforme concluída = travada)
  const isLocked =
    verificacao.status === 'concluida' &&
    verificacao.total_itens > 0 &&
    verificacao.itens_conformes === verificacao.total_itens

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

  return (
    <div className="space-y-6">
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
    </div>
  )
}
