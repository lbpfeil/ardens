'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import type { MatrizVerificacao } from '@/lib/supabase/queries/verificacoes'
import { deriveMatrizCellStatus } from './matriz-status'

// ============================================================================
// TYPES
// ============================================================================

export interface BulkSummary {
  pendentes: string[]          // Serão criadas normalmente
  ncExistentes: string[]       // NC que receberão reinspeção (se bulk Conforme)
  conformesTravadas: string[]  // Ignoradas (imutáveis)
  excecoesTravadas: string[]   // Ignoradas (imutáveis)
}

interface BulkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  summary: BulkSummary
  mode: 'verificar' | 'excecao'
  onConfirm: (resultado: 'conforme' | 'nao_conforme' | 'excecao', descricao?: string) => void
  isPending: boolean
}

// ============================================================================
// COMPUTE SUMMARY
// ============================================================================

/**
 * Classifica as células selecionadas em 4 categorias com base no estado atual
 * de cada verificação no mapa.
 */
export function computeBulkSummary(
  selectedCells: Set<string>,
  verificacoesMap: Record<string, MatrizVerificacao>
): BulkSummary {
  const summary: BulkSummary = {
    pendentes: [],
    ncExistentes: [],
    conformesTravadas: [],
    excecoesTravadas: [],
  }

  for (const key of selectedCells) {
    const verificacao = verificacoesMap[key]
    const status = deriveMatrizCellStatus(verificacao)

    switch (status) {
      case 'pendente':
        summary.pendentes.push(key)
        break
      case 'conforme':
      case 'conforme_reinspecao':
        summary.conformesTravadas.push(key)
        break
      case 'excecao':
        summary.excecoesTravadas.push(key)
        break
      case 'nao_conforme':
      case 'nc_reinspecao':
        summary.ncExistentes.push(key)
        break
    }
  }

  return summary
}

// ============================================================================
// COMPONENT
// ============================================================================

export function BulkModal({
  open,
  onOpenChange,
  summary,
  mode,
  onConfirm,
  isPending,
}: BulkModalProps) {
  const [resultado, setResultado] = useState<'conforme' | 'nao_conforme'>('conforme')
  const [descricao, setDescricao] = useState('')

  const actionable = summary.pendentes.length + summary.ncExistentes.length
  const ignored = summary.conformesTravadas.length + summary.excecoesTravadas.length

  const handleConfirm = () => {
    if (mode === 'excecao') {
      onConfirm('excecao', descricao || undefined)
    } else {
      onConfirm(resultado, descricao || undefined)
    }
  }

  // Reset state when modal opens
  const handleOpenChange = (next: boolean) => {
    if (!next) {
      setResultado('conforme')
      setDescricao('')
    }
    onOpenChange(next)
  }

  const resultadoLabel =
    mode === 'excecao'
      ? 'Exceção'
      : resultado === 'conforme'
        ? 'Conforme'
        : 'Não Conforme'

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'verificar' ? 'Verificação em Massa' : 'Marcar como Exceção'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Seleção de resultado (apenas modo verificar) */}
          {mode === 'verificar' && (
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  resultado === 'conforme'
                    ? 'bg-brand text-white border-transparent'
                    : 'border-border text-foreground-light hover:bg-surface-200'
                }`}
                onClick={() => setResultado('conforme')}
                disabled={isPending}
              >
                <Check className="w-4 h-4" />
                Conforme
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                  resultado === 'nao_conforme'
                    ? 'bg-destructive text-white border-transparent'
                    : 'border-border text-foreground-light hover:bg-surface-200'
                }`}
                onClick={() => setResultado('nao_conforme')}
                disabled={isPending}
              >
                <X className="w-4 h-4" />
                Não Conforme
              </button>
            </div>
          )}

          {/* Resumo de conflitos */}
          <div className="text-sm space-y-1">
            {actionable > 0 && (
              <p className="text-foreground">
                <strong>{actionable}</strong>{' '}
                {actionable === 1 ? 'verificação será criada' : 'verificações serão criadas'}{' '}
                como <strong>{resultadoLabel}</strong>
              </p>
            )}
            {mode === 'verificar' && resultado === 'conforme' && summary.ncExistentes.length > 0 && (
              <p className="text-foreground-light">
                <strong>{summary.ncExistentes.length}</strong> NC existente{summary.ncExistentes.length !== 1 ? 's' : ''}{' '}
                {summary.ncExistentes.length === 1 ? 'receberá' : 'receberão'} reinspeção
              </p>
            )}
            {ignored > 0 && (
              <p className="text-foreground-muted">
                {ignored} {ignored === 1 ? 'célula será ignorada' : 'células serão ignoradas'} (já concluídas)
              </p>
            )}
            {actionable === 0 && (
              <p className="text-foreground-muted">
                Nenhuma célula pode ser verificada. Todas já estão concluídas.
              </p>
            )}
          </div>

          {/* Textarea de descrição */}
          <Textarea
            placeholder="Descrição opcional..."
            rows={3}
            value={descricao}
            onChange={e => setDescricao(e.target.value)}
            disabled={isPending}
          />

          {/* Progress indeterminado durante loading */}
          {isPending && (
            <div className="overflow-hidden">
              <Progress className="h-1 animate-pulse" />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isPending || actionable === 0}
          >
            {isPending ? 'Processando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
