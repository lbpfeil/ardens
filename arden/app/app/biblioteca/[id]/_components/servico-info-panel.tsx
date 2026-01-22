'use client'

import Link from 'next/link'
import { ArrowLeft, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { categoriaServicoOptions } from '@/lib/validations/servico'
import type { Servico } from '@/lib/supabase/queries/servicos'

interface ServicoInfoPanelProps {
  servico: Servico
  onEditClick: () => void
}

/**
 * Helper para obter o label da categoria a partir do valor
 */
function getCategoryLabel(value: string | null): string {
  if (!value) return ''
  const option = categoriaServicoOptions.find((o) => o.value === value)
  return option?.label ?? value
}

export function ServicoInfoPanel({ servico, onEditClick }: ServicoInfoPanelProps) {
  return (
    <div className="space-y-4">
      {/* Back link */}
      <Link
        href="/app/biblioteca"
        className="inline-flex items-center gap-2 text-sm text-foreground-light hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Biblioteca
      </Link>

      {/* Servico info card */}
      <Card className="bg-surface-100 border-border">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono text-xs">
                {servico.codigo}
              </Badge>
              <Badge variant="secondary" className="font-mono text-xs">
                Rev. {servico.revisao || '00'}
              </Badge>
            </div>
            <CardTitle className="text-lg font-medium text-foreground">
              {servico.nome}
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon-sm" onClick={onEditClick}>
            <Pencil className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Categoria */}
          {servico.categoria && (
            <div className="space-y-1">
              <p className="text-xs text-foreground-muted">Categoria</p>
              <Badge variant="secondary">
                {getCategoryLabel(servico.categoria)}
              </Badge>
            </div>
          )}

          {/* Referencia Normativa */}
          {servico.referencia_normativa && (
            <div className="space-y-1">
              <p className="text-xs text-foreground-muted">Referencia Normativa</p>
              <p className="text-sm text-foreground-light">
                {servico.referencia_normativa}
              </p>
            </div>
          )}

          {/* Ultima Revisao */}
          {servico.revisao_descricao && (
            <div className="space-y-1">
              <p className="text-xs text-foreground-muted">Ultima Alteracao</p>
              <p className="text-sm text-foreground-light">
                {servico.revisao_descricao}
              </p>
            </div>
          )}

          {/* Status */}
          {servico.arquivado && (
            <div className="pt-2 border-t border-border">
              <Badge variant="outline" className="text-foreground-muted">
                Arquivado
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
