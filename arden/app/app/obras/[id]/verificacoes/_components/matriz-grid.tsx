'use client'

import React, { memo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { Progress } from '@/components/ui/progress'
import { deriveMatrizCellStatus, STATUS_COLORS, STATUS_LABELS } from './matriz-status'
import {
  AgrupamentoHeaders,
  UnitHeaderCell,
  CollapsedHeaderPlaceholder,
} from './matriz-header'
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
  gridTemplateColumns: string
  isSelectionMode: boolean
  selectedCells: Set<string>
  onToggleCell: (key: string) => void
  onSelectRow: (servicoId: string) => void
  onSelectColumn: (unidadeId: string) => void
}

export const MatrizGrid = memo(function MatrizGrid({
  servicos,
  visibleUnits,
  agrupamentos,
  expandedGroups,
  verificacoesMap,
  onToggleGroup,
  obraId,
  gridTemplateColumns,
  isSelectionMode,
  selectedCells,
  onToggleCell,
  onSelectRow,
  onSelectColumn,
}: MatrizGridProps) {
  const router = useRouter()

  // Event delegation para cliques nas células (dual-mode: navegação ou seleção)
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // No modo de seleção, checar headers de serviço e unidade primeiro
      if (isSelectionMode) {
        const headerRow = (e.target as HTMLElement).closest('[data-header-servico]') as HTMLElement | null
        if (headerRow) {
          onSelectRow(headerRow.dataset.headerServico!)
          return
        }
        const headerCol = (e.target as HTMLElement).closest('[data-header-unidade]') as HTMLElement | null
        if (headerCol) {
          onSelectColumn(headerCol.dataset.headerUnidade!)
          return
        }
      }

      const cell = (e.target as HTMLElement).closest('[data-cell]') as HTMLElement | null
      if (!cell) return

      const servicoId = cell.dataset.servicoId
      const unidadeId = cell.dataset.unidadeId
      if (!servicoId || !unidadeId) return

      if (isSelectionMode) {
        // Modo de seleção: toggle da célula
        onToggleCell(`${servicoId}:${unidadeId}`)
      } else {
        // Modo normal: navegação
        const key = `${servicoId}:${unidadeId}`
        const verificacao = verificacoesMap[key]

        if (verificacao) {
          router.push(`/app/obras/${obraId}/verificacoes/${verificacao.id}`)
        } else {
          router.push(`/app/obras/${obraId}/verificacoes/nova?servico=${servicoId}&unidade=${unidadeId}`)
        }
      }
    },
    [isSelectionMode, verificacoesMap, obraId, router, onToggleCell, onSelectRow, onSelectColumn]
  )

  return (
    <div
      className="overflow-auto rounded-md border border-border"
      style={{ maxHeight: 'calc(100vh - 280px)' }}
    >
      <TooltipProvider delayDuration={200}>
        <div
          onClick={handleClick}
          data-selection-mode={isSelectionMode || undefined}
          style={{
            display: 'grid',
            gridTemplateColumns,
            gridTemplateRows: `40px 32px repeat(${servicos.length}, 48px)`,
          }}
        >
          {/* 1. CORNER CELL — z-30, sticky top+left */}
          <div
            className="bg-surface-100 border-b border-r border-border flex items-end pb-1 pl-3"
            style={{
              position: 'sticky',
              top: 0,
              left: 0,
              zIndex: 30,
              gridRow: '1 / 3',
              gridColumn: '1',
            }}
          >
            <span className="text-xs font-medium text-foreground-lighter">Serviço</span>
          </div>

          {/* 2. AGRUPAMENTO HEADERS — z-20, sticky top:0, row 1 */}
          <AgrupamentoHeaders
            agrupamentos={agrupamentos}
            expandedGroups={expandedGroups}
            onToggle={onToggleGroup}
          />

          {/* 3. ROW 2 — Unit name headers + collapsed placeholders */}
          {agrupamentos.map(ag => {
            if (expandedGroups.has(ag.id)) {
              return ag.unidades.map(unidade => (
                <UnitHeaderCell
                  key={`unit-header-${unidade.id}`}
                  unidade={unidade}
                  gridRow={2}
                  isSelectionMode={isSelectionMode}
                />
              ))
            }
            return (
              <CollapsedHeaderPlaceholder
                key={`collapsed-header-${ag.id}`}
                groupId={ag.id}
                gridRow={2}
              />
            )
          })}

          {/* 4. SERVICE ROWS: name+progress (sticky left) + data cells */}
          {servicos.map((servico, rowIndex) => {
            // Progresso: contar verificações existentes entre unidades visíveis
            const verificadas = visibleUnits.filter(
              u => verificacoesMap[`${servico.id}:${u.id}`]
            ).length
            const total = visibleUnits.length
            const pct = total > 0 ? (verificadas / total) * 100 : 0

            // Grid row: 1=agrupamento, 2=unidades, 3+=serviços
            const gridRow = rowIndex + 3

            return (
              <React.Fragment key={servico.id}>
                {/* Service name cell — sticky left, z-10 */}
                <div
                  data-header-servico={isSelectionMode ? servico.id : undefined}
                  className={cn(
                    "bg-surface-100 border-b border-r border-border px-3 py-1 flex flex-col justify-center",
                    isSelectionMode && "cursor-cell hover:bg-surface-200"
                  )}
                  style={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 10,
                    gridRow,
                    gridColumn: '1',
                  }}
                >
                  <span
                    className="text-xs font-medium text-foreground truncate"
                    title={servico.nome}
                  >
                    {servico.nome}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-foreground-lighter whitespace-nowrap">
                      {verificadas}/{total}
                    </span>
                    <Progress value={pct} className="h-0.5 w-16" />
                  </div>
                </div>

                {/* Data cells for this service row */}
                {agrupamentos.map(ag => {
                  if (expandedGroups.has(ag.id)) {
                    // Expandido: render cell for each unit
                    return ag.unidades.map(unidade => {
                      const key = `${servico.id}:${unidade.id}`
                      const verificacao = verificacoesMap[key]
                      const cellStatus = deriveMatrizCellStatus(verificacao)
                      const colorClass = STATUS_COLORS[cellStatus]
                      const isSelected = isSelectionMode && selectedCells.has(key)

                      const cellDiv = (
                        <div
                          key={`${servico.id}-${unidade.id}`}
                          data-cell=""
                          data-servico-id={servico.id}
                          data-unidade-id={unidade.id}
                          className={cn(
                            "transition-opacity border-r border-b border-border/30 flex items-center justify-center",
                            isSelectionMode ? "cursor-cell" : "cursor-pointer hover:opacity-80"
                          )}
                          style={{ gridRow }}
                        >
                          <div className={cn(
                            "w-7 h-7 rounded-md",
                            colorClass,
                            isSelected && "ring-2 ring-brand ring-offset-1 ring-offset-surface-100"
                          )} />
                        </div>
                      )

                      // Tooltip somente para células não-pendentes
                      if (cellStatus === 'pendente') return cellDiv

                      return (
                        <Tooltip key={`${servico.id}-${unidade.id}`}>
                          <TooltipTrigger asChild>{cellDiv}</TooltipTrigger>
                          <TooltipContent side="top" className="text-xs">
                            {STATUS_LABELS[cellStatus]}
                          </TooltipContent>
                        </Tooltip>
                      )
                    })
                  } else {
                    // Collapsed: render single empty placeholder cell
                    return (
                      <div
                        key={`collapsed-${ag.id}-${servico.id}`}
                        className="bg-surface-100/50 border-r border-b border-border/30"
                        style={{ gridRow }}
                      />
                    )
                  }
                })}
              </React.Fragment>
            )
          })}
        </div>
      </TooltipProvider>
    </div>
  )
})
