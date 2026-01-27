'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertCircle } from 'lucide-react'
import type { NCFeedItem } from '@/lib/supabase/queries/dashboard'

interface NCFeedProps {
  ncs: NCFeedItem[]
  obraId: string
}

/**
 * NC Feed component showing recent non-conformances.
 * Displays servico name, unidade code, observacao, and relative timestamp.
 * Clicking an NC navigates to the verification page.
 */
export function NCFeed({ ncs, obraId }: NCFeedProps) {
  const router = useRouter()

  const handleNCClick = (nc: NCFeedItem) => {
    const params = new URLSearchParams({
      servico: nc.servicoNome,
      unidade: nc.unidadeCodigo,
      from: 'dashboard',
    })
    router.push(`/app/obras/${obraId}/verificacoes/${nc.verificacaoId}?${params.toString()}`)
  }

  // Empty state
  if (ncs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center">
        <p className="text-sm text-foreground-muted">
          Nenhuma não-conformidade registrada
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-surface-100 divide-y divide-border">
      {ncs.map((nc) => (
        <div
          key={nc.id}
          onClick={() => handleNCClick(nc)}
          className="p-4 hover:bg-surface-200 transition-colors cursor-pointer"
        >
          <div className="flex gap-3">
            {/* NC Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">
                {nc.agrupamentoNome ? `${nc.agrupamentoNome} > ${nc.unidadeCodigo}` : nc.unidadeCodigo}
              </p>
              <p className="text-xs text-foreground-lighter mt-0.5">
                {nc.servicoNome}
              </p>
              {nc.observacao && (
                <p className="text-sm text-foreground-muted mt-1 line-clamp-2">
                  {nc.observacao}
                </p>
              )}
            </div>

            {/* Timestamp */}
            <div className="flex-shrink-0">
              <span className="text-xs text-foreground-muted whitespace-nowrap">
                {formatDistanceToNow(new Date(nc.createdAt), {
                  addSuffix: true,
                  locale: ptBR
                })}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
