'use client'

import { useMemo } from 'react'
import { ChevronRight } from 'lucide-react'
import type { MatrizAgrupamento, MatrizUnidade } from '@/lib/supabase/queries/verificacoes'

// ============================================================================
// AgrupamentoHeaders — Row 1: headers de agrupamento com expand/collapse
// ============================================================================

interface AgrupamentoHeadersProps {
  agrupamentos: MatrizAgrupamento[]
  expandedGroups: Set<string>
  onToggle: (id: string) => void
}

export function AgrupamentoHeaders({ agrupamentos, expandedGroups, onToggle }: AgrupamentoHeadersProps) {
  // Pré-calcular posições das colunas antes do render (scan funcional, sem mutação)
  const headerPositions = useMemo(() => {
    return agrupamentos.reduce<Array<{ ag: MatrizAgrupamento; isExpanded: boolean; span: number; startCol: number }>>(
      (acc, ag) => {
        const isExpanded = expandedGroups.has(ag.id)
        const span = isExpanded ? ag.unidades.length : 1
        const prevEnd = acc.length > 0 ? acc[acc.length - 1].startCol + acc[acc.length - 1].span : 2
        acc.push({ ag, isExpanded, span, startCol: prevEnd })
        return acc
      },
      []
    )
  }, [agrupamentos, expandedGroups])

  return (
    <>
      {headerPositions.map(({ ag, isExpanded, span, startCol }) => (
        <div
          key={ag.id}
          className="bg-surface-100 border-b border-r border-border flex items-center gap-1 px-2 cursor-pointer hover:bg-surface-200 select-none"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            gridRow: '1',
            gridColumn: `${startCol} / span ${span}`,
          }}
          onClick={() => onToggle(ag.id)}
        >
          <ChevronRight
            className={`w-3 h-3 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
          <span className="text-xs font-medium text-foreground-light truncate">
            {ag.nome}
          </span>
        </div>
      ))}
    </>
  )
}

// ============================================================================
// Row 2 helpers — renderizados pelo MatrizGrid para manter posicionamento correto
// ============================================================================

interface UnitHeaderCellProps {
  unidade: MatrizUnidade
  gridRow: number
}

export function UnitHeaderCell({ unidade, gridRow }: UnitHeaderCellProps) {
  return (
    <div
      className="bg-surface-100 border-b border-r border-border flex items-center justify-center"
      style={{
        position: 'sticky',
        top: 40,
        zIndex: 20,
        gridRow,
      }}
    >
      <span className="text-[10px] text-foreground-lighter text-center leading-tight">
        {unidade.nome}
      </span>
    </div>
  )
}

interface CollapsedHeaderPlaceholderProps {
  groupId: string
  gridRow: number
}

export function CollapsedHeaderPlaceholder({ groupId, gridRow }: CollapsedHeaderPlaceholderProps) {
  return (
    <div
      key={`collapsed-header-${groupId}`}
      className="bg-surface-100 border-b border-r border-border"
      style={{
        position: 'sticky',
        top: 40,
        zIndex: 20,
        gridRow,
      }}
    />
  )
}
