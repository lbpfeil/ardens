'use client'

import { Check, AlertTriangle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SelectionToolbarProps {
  selectedCount: number
  onVerificar: () => void
  onExcecao: () => void
  onCancel: () => void
}

export function SelectionToolbar({
  selectedCount,
  onVerificar,
  onExcecao,
  onCancel,
}: SelectionToolbarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-surface-100 px-6 py-3 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-center justify-between">
        {/* Contagem */}
        <p className="text-sm text-foreground-light">
          <strong className="text-foreground">{selectedCount}</strong>{' '}
          {selectedCount === 1 ? 'célula selecionada' : 'células selecionadas'}
        </p>

        {/* Ações */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <X className="w-3.5 h-3.5" />
            Cancelar
          </Button>
          <Button variant="outline" size="sm" onClick={onExcecao}>
            <AlertTriangle className="w-3.5 h-3.5" />
            Exceção
          </Button>
          <Button size="sm" onClick={onVerificar}>
            <Check className="w-3.5 h-3.5" />
            Verificar
          </Button>
        </div>
      </div>
    </div>
  )
}
