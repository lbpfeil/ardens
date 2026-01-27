'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ItemVerificacao } from '@/lib/supabase/queries/verificacoes'

interface ItemDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: ItemVerificacao | null
}

export function ItemDetailModal({
  open,
  onOpenChange,
  item,
}: ItemDetailModalProps) {
  if (!item) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalhes do Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* O que verificar */}
          <div>
            <div className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-1.5">
              O que verificar
            </div>
            <div className="text-sm text-foreground">
              {item.item_servico.observacao}
            </div>
          </div>

          {/* Como verificar */}
          {item.item_servico.metodo && (
            <div>
              <div className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-1.5">
                Como verificar
              </div>
              <div className="text-sm text-foreground">
                {item.item_servico.metodo}
              </div>
            </div>
          )}

          {/* Critério de aceitação */}
          {item.item_servico.tolerancia && (
            <div>
              <div className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-1.5">
                Critério de aceitação
              </div>
              <div className="text-sm text-foreground">
                {item.item_servico.tolerancia}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
