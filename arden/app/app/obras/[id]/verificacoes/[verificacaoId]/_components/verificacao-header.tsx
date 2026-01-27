'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
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
  obraId: string
}

export function VerificacaoHeader({
  servicoNome,
  servicoCodigo,
  unidadeNome,
  obraNome,
  onExcecaoClick,
  isExcecao = false,
  disabled = false,
  obraId,
}: VerificacaoHeaderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const servicoId = searchParams.get('servicoId')
  const unidadeId = searchParams.get('unidadeId')

  const handleBack = () => {
    if (from === 'dashboard') {
      router.push(`/app/obras/${obraId}`)
    } else {
      // Default: go back to matriz with highlight
      const highlight = servicoId && unidadeId ? `${servicoId}:${unidadeId}` : null
      const params = new URLSearchParams()
      if (highlight) params.set('highlight', highlight)
      const url = `/app/obras/${obraId}/verificacoes`
      router.push(highlight ? `${url}?${params.toString()}` : url)
    }
  }

  return (
    <div className="border-b border-border pb-4 mb-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="mb-2 -ml-2 gap-1.5 text-foreground-light hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        {from === 'dashboard' ? 'Voltar ao painel' : 'Voltar à matriz'}
      </Button>

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
