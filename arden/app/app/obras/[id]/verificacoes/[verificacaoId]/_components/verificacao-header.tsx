'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface VerificacaoHeaderProps {
  servicoNome?: string
  servicoCodigo?: string
  unidadeNome?: string
  obraNome?: string
  onExcecaoClick?: () => void
  isExcecao?: boolean
  disabled?: boolean
}

export function VerificacaoHeader({
  servicoNome,
  servicoCodigo,
  unidadeNome,
  obraNome,
  onExcecaoClick,
  isExcecao = false,
  disabled = false,
}: VerificacaoHeaderProps) {
  return (
    <div className="border-b border-border pb-4 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Breadcrumb */}
          <div className="text-sm text-foreground-muted mb-2">
            {obraNome && unidadeNome && `${obraNome} / ${unidadeNome}`}
          </div>

          {/* Title */}
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-normal text-foreground">
              {servicoCodigo ? `${servicoCodigo} — ${servicoNome}` : servicoNome}
            </h1>
            {isExcecao && (
              <Badge variant="secondary" className="bg-warning-200 text-warning-600 border-warning-400">
                Exceção
              </Badge>
            )}
          </div>
        </div>

        {/* Exceção button */}
        {!isExcecao && onExcecaoClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExcecaoClick}
            disabled={disabled}
          >
            Marcar como Exceção
          </Button>
        )}
      </div>
    </div>
  )
}
