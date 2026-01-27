'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Check, Wrench, AlertTriangle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type StatusReinspecao =
  | 'conforme_apos_reinspecao'
  | 'retrabalho'
  | 'aprovado_com_concessao'
  | 'reprovado_apos_retrabalho'

interface OutcomeOption {
  value: StatusReinspecao
  label: string
  description: string
  icon: React.ReactNode
  colorClass: string
}

const OUTCOME_OPTIONS: OutcomeOption[] = [
  {
    value: 'conforme_apos_reinspecao',
    label: 'Não havia problema real',
    description: 'O item não conforme foi reavaliado e está conforme',
    icon: <Check className="h-5 w-5" />,
    colorClass: 'border-brand text-brand',
  },
  {
    value: 'retrabalho',
    label: 'Correção executada',
    description: 'Defeito foi corrigido e aprovado',
    icon: <Wrench className="h-5 w-5" />,
    colorClass: 'border-blue-500 text-blue-500',
  },
  {
    value: 'aprovado_com_concessao',
    label: 'Defeito tolerável aceito',
    description: 'Não conforme permanece mas foi aprovado com concessão',
    icon: <AlertTriangle className="h-5 w-5" />,
    colorClass: 'border-warning text-warning',
  },
  {
    value: 'reprovado_apos_retrabalho',
    label: 'Correção insuficiente',
    description: 'Retrabalho foi executado mas não atende aos critérios',
    icon: <X className="h-5 w-5" />,
    colorClass: 'border-destructive text-destructive',
  },
]

interface ReinspecaoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemNome: string
  onConfirm: (statusReinspecao: StatusReinspecao, observacao?: string) => void
}

export function ReinspecaoModal({
  open,
  onOpenChange,
  itemNome,
  onConfirm,
}: ReinspecaoModalProps) {
  const [selectedOutcome, setSelectedOutcome] =
    useState<StatusReinspecao | null>(null)
  const [observacao, setObservacao] = useState('')

  const handleConfirm = () => {
    if (!selectedOutcome) return
    onConfirm(selectedOutcome, observacao || undefined)
    // Reset state
    setSelectedOutcome(null)
    setObservacao('')
  }

  const handleCancel = () => {
    setSelectedOutcome(null)
    setObservacao('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Reinspeção: {itemNome}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Outcome selection */}
          <div>
            <Label className="text-sm font-medium text-foreground-light mb-3 block">
              Resultado da reinspeção
            </Label>
            <div className="space-y-2">
              {OUTCOME_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedOutcome(option.value)}
                  className={cn(
                    'w-full p-3 rounded-md border transition-all text-left',
                    'hover:bg-surface-100 cursor-pointer',
                    selectedOutcome === option.value
                      ? 'border-2 bg-surface-100'
                      : 'border-border',
                    selectedOutcome === option.value && option.colorClass
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'mt-0.5',
                        selectedOutcome === option.value && option.colorClass
                      )}
                    >
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-foreground">
                        {option.label}
                      </div>
                      <div className="text-xs text-foreground-light mt-0.5">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional observation */}
          <div>
            <Label htmlFor="observacao" className="text-sm">
              Observações (opcional)
            </Label>
            <Textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Adicione detalhes sobre a reinspeção..."
              rows={3}
              className="mt-1.5"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedOutcome}>
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
