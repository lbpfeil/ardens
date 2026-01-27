'use client'

import React, { memo } from 'react'
import type {
  MatrizServico,
  MatrizUnidade,
  MatrizAgrupamento,
  MatrizVerificacao,
} from '@/lib/supabase/queries/verificacoes'

interface MatrizGridProps {
  servicos: MatrizServico[]
  visibleUnits: MatrizUnidade[]
  agrupamentos: MatrizAgrupamento[]
  expandedGroups: Set<string>
  verificacoesMap: Record<string, MatrizVerificacao>
  onToggleGroup: (groupId: string) => void
  obraId: string
  totalDataColumns: number
}

export const MatrizGrid = memo(function MatrizGrid({
  servicos,
  visibleUnits,
  totalDataColumns,
}: MatrizGridProps) {
  return (
    <div className="overflow-auto rounded-md border border-border p-4">
      <p className="text-foreground-lighter text-sm">
        Matriz: {servicos.length} serviços x {visibleUnits.length} unidades ({totalDataColumns} colunas)
      </p>
    </div>
  )
})
