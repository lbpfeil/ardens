'use client'

import { useState } from 'react'
import { ToggleGroup as ToggleGroupPrimitive } from 'radix-ui'
import { Check, X, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ItemNCModal } from './item-nc-modal'
import { ItemDetailModal } from './item-detail-modal'
import type { ItemVerificacao } from '@/lib/supabase/queries/verificacoes'
import { cn } from '@/lib/utils'

interface ItemChecklistProps {
  itens: ItemVerificacao[]
  onItemMark: (
    itemId: string,
    status: 'conforme' | 'nao_conforme' | 'excecao',
    observacao?: string
  ) => void
  onReinspecionar?: (item: ItemVerificacao) => void
  disabled?: boolean
  onItemClick?: (item: ItemVerificacao) => void
}

interface PendingNC {
  itemId: string
  itemNome: string
  previousStatus: string
}

// Helper function to get label for status_reinspecao
function getStatusReinspecaoLabel(status: string): string {
  const labels: Record<string, string> = {
    conforme_apos_reinspecao: 'Não havia problema',
    retrabalho: 'Retrabalho executado',
    aprovado_com_concessao: 'Aprovado com concessão',
    reprovado_apos_retrabalho: 'Reprovado após retrabalho',
  }
  return labels[status] || status
}

export function ItemChecklist({
  itens,
  onItemMark,
  onReinspecionar,
  disabled = false,
  onItemClick,
}: ItemChecklistProps) {
  const [pendingNC, setPendingNC] = useState<PendingNC | null>(null)
  const [selectedItem, setSelectedItem] = useState<ItemVerificacao | null>(null)

  const handleValueChange = (
    itemId: string,
    itemNome: string,
    previousStatus: string,
    value: string
  ) => {
    // Guard: prevent deselection
    if (!value) return

    // If NC, open modal (don't call onItemMark yet)
    if (value === 'nao_conforme') {
      setPendingNC({ itemId, itemNome, previousStatus })
      return
    }

    // For C and NA, call onItemMark directly
    onItemMark(itemId, value as 'conforme' | 'excecao', undefined)
  }

  const handleNCConfirm = (observacao: string) => {
    if (!pendingNC) return
    onItemMark(pendingNC.itemId, 'nao_conforme', observacao)
    setPendingNC(null)
  }

  const handleNCCancel = () => {
    // Rollback — since we never updated itens state, toggle will revert automatically
    setPendingNC(null)
  }

  return (
    <>
      <div className="space-y-2">
        {itens.map((item, index) => {
          // Convert status to toggle value
          const toggleValue =
            item.status === 'nao_verificado' ? '' : item.status

          // Determine status indicator color
          const statusBorderClass =
            item.status === 'conforme'
              ? 'border-l-2 border-l-brand'
              : item.status === 'nao_conforme'
                ? 'border-l-2 border-l-destructive'
                : item.status === 'excecao'
                  ? 'border-l-2 border-l-warning'
                  : ''

          // Check if item needs reinspeção button (NC without status_reinspecao)
          const needsReinspecao =
            item.status === 'nao_conforme' && !item.status_reinspecao

          // Check if item was reinspected
          const wasReinspected = !!item.status_reinspecao

          return (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-md border border-border hover:bg-surface-100 transition-colors',
                statusBorderClass
              )}
            >
              {/* Item number */}
              <div className="text-xs text-foreground-muted w-6 flex-shrink-0">
                {index + 1}
              </div>

              {/* Item name (clickable) */}
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="text-sm text-foreground hover:text-brand-link transition-colors text-left w-full"
                  disabled={disabled}
                >
                  {item.item_servico.observacao}
                </button>
              </div>

              {/* Reinspeção badge (if reinspected) */}
              {wasReinspected && (
                <Badge variant="secondary" className="text-xs">
                  {getStatusReinspecaoLabel(item.status_reinspecao!)}
                </Badge>
              )}

              {/* Reinspeção button (if NC and not yet reinspected) */}
              {needsReinspecao && onReinspecionar && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReinspecionar(item)}
                  disabled={disabled}
                  className="text-xs"
                >
                  Reinspecionar
                </Button>
              )}

              {/* C/NC/NA Toggle */}
              <ToggleGroupPrimitive.Root
                type="single"
                value={toggleValue}
                onValueChange={(value) =>
                  handleValueChange(
                    item.id,
                    item.item_servico.observacao,
                    item.status,
                    value
                  )
                }
                disabled={disabled}
                className="inline-flex"
              >
                {/* Conforme (C) */}
                <ToggleGroupPrimitive.Item
                  value="conforme"
                  className={cn(
                    'px-2.5 py-1.5 text-xs rounded-none first:rounded-l-md border border-border transition-colors',
                    'hover:bg-surface-100',
                    'data-[state=on]:bg-brand data-[state=on]:text-white data-[state=on]:border-brand',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <Check className="h-3.5 w-3.5" />
                </ToggleGroupPrimitive.Item>

                {/* Não Conforme (NC) */}
                <ToggleGroupPrimitive.Item
                  value="nao_conforme"
                  className={cn(
                    'px-2.5 py-1.5 text-xs border border-l-0 border-border transition-colors',
                    'hover:bg-surface-100',
                    'data-[state=on]:bg-destructive data-[state=on]:text-white data-[state=on]:border-destructive',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <X className="h-3.5 w-3.5" />
                </ToggleGroupPrimitive.Item>

                {/* Exceção (NA) */}
                <ToggleGroupPrimitive.Item
                  value="excecao"
                  className={cn(
                    'px-2.5 py-1.5 text-xs rounded-none last:rounded-r-md border border-l-0 border-border transition-colors',
                    'hover:bg-surface-100',
                    'data-[state=on]:bg-warning data-[state=on]:text-foreground data-[state=on]:border-warning',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  <Minus className="h-3.5 w-3.5" />
                </ToggleGroupPrimitive.Item>
              </ToggleGroupPrimitive.Root>
            </div>
          )
        })}
      </div>

      {/* NC Modal */}
      {pendingNC && (
        <ItemNCModal
          open={pendingNC !== null}
          onOpenChange={(open) => {
            if (!open) handleNCCancel()
          }}
          itemNome={pendingNC.itemNome}
          onConfirm={handleNCConfirm}
          onCancel={handleNCCancel}
        />
      )}

      {/* Item Detail Modal */}
      <ItemDetailModal
        open={selectedItem !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedItem(null)
        }}
        item={selectedItem}
      />
    </>
  )
}
