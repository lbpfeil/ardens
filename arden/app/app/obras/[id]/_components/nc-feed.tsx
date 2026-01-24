'use client'

import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertCircle } from 'lucide-react'
import type { NCFeedItem } from '@/lib/supabase/queries/dashboard'

interface NCFeedProps {
  ncs: NCFeedItem[]
}

/**
 * NC Feed component showing recent non-conformances.
 * Displays servico name, unidade code, observacao, and relative timestamp.
 */
export function NCFeed({ ncs }: NCFeedProps) {
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
                {nc.servicoNome} - {nc.unidadeCodigo}
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

      {/* Ver todas link */}
      <div className="p-3 border-t border-border text-center">
        <button className="text-sm text-brand-link hover:underline">
          Ver todas as NCs
        </button>
      </div>
    </div>
  )
}
