'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ServicoRevisao } from '@/lib/supabase/queries/servico-revisoes'

interface RevisionHistoryPanelProps {
  revisoes: ServicoRevisao[]
  isLoading?: boolean
}

/**
 * Formata data para exibicao: "15 jan 2026, 14:30"
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function RevisionHistoryPanel({
  revisoes,
  isLoading = false,
}: RevisionHistoryPanelProps) {
  return (
    <Card className="bg-surface-100 border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-foreground">
          Historico de Revisoes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="h-5 w-14 bg-surface-200 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 bg-surface-200 rounded" />
                    <div className="h-3 w-1/3 bg-surface-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : revisoes.length === 0 ? (
          <p className="text-sm text-foreground-muted">
            Nenhuma revisao registrada
          </p>
        ) : (
          <div className="space-y-4">
            {revisoes.map((rev, index) => (
              <div
                key={rev.id}
                className={`flex items-start gap-3 ${
                  index !== revisoes.length - 1 ? 'pb-4 border-b border-border' : ''
                }`}
              >
                <Badge
                  variant={index === 0 ? 'secondary' : 'outline'}
                  className="font-mono text-xs shrink-0"
                >
                  Rev. {rev.revisao}
                </Badge>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{rev.descricao}</p>
                  <p className="text-xs text-foreground-muted mt-1">
                    {formatDate(rev.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
