'use client'

import { useState, useCallback, useMemo } from 'react'
import type { MatrizData } from '@/lib/supabase/queries/verificacoes'
import { MatrizGrid } from './matriz-grid'
import { STATUS_COLORS, STATUS_LABELS, type MatrizCellStatus } from './matriz-status'

interface MatrizClientProps {
  initialData: MatrizData
  obraId: string
}

export function MatrizClient({ initialData, obraId }: MatrizClientProps) {
  const { servicos, agrupamentos, verificacoesMap } = initialData

  // Estado de colapso de agrupamentos — primeiro expandido por padrão
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    if (agrupamentos.length > 0) {
      return new Set([agrupamentos[0].id])
    }
    return new Set()
  })

  const handleToggleGroup = useCallback((groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        next.delete(groupId)
      } else {
        next.add(groupId)
      }
      return next
    })
  }, [])

  // Unidades visíveis = unidades de agrupamentos expandidos
  const visibleUnits = useMemo(() => {
    return agrupamentos.flatMap(ag =>
      expandedGroups.has(ag.id) ? ag.unidades : []
    )
  }, [agrupamentos, expandedGroups])

  // Total de colunas = unidades visíveis + 1 coluna placeholder por grupo collapsed
  const collapsedGroupCount = useMemo(() => {
    return agrupamentos.filter(ag => !expandedGroups.has(ag.id)).length
  }, [agrupamentos, expandedGroups])

  const totalDataColumns = visibleUnits.length + collapsedGroupCount

  // Empty state
  if (servicos.length === 0 || agrupamentos.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-foreground-light">
          Nenhum serviço ou unidade configurada nesta obra.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Legenda de cores */}
      <div className="flex items-center gap-4 mb-4 flex-wrap justify-end">
        {(Object.entries(STATUS_COLORS) as [MatrizCellStatus, string][]).map(([status, colorClass]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-sm ${colorClass}`} />
            <span className="text-xs text-foreground-lighter">{STATUS_LABELS[status]}</span>
          </div>
        ))}
      </div>

      {/* Grid da Matriz */}
      <MatrizGrid
        servicos={servicos}
        visibleUnits={visibleUnits}
        agrupamentos={agrupamentos}
        expandedGroups={expandedGroups}
        verificacoesMap={verificacoesMap}
        onToggleGroup={handleToggleGroup}
        obraId={obraId}
        totalDataColumns={totalDataColumns}
      />
    </>
  )
}
