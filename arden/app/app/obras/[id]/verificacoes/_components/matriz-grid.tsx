'use client'

import React, { memo, useCallback } from 'react'
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
  totalDataColumns: number
}

export const MatrizGrid = memo(function MatrizGrid({
  servicos,
  visibleUnits,
  agrupamentos,
  expandedGroups,
  verificacoesMap,
  onToggleGroup,
  obraId,
  totalDataColumns,
}: MatrizGridProps) {
  const router = useRouter()

  // Event delegation para cliques nas células
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const cell = (e.target as HTMLElement).closest('[data-cell]') as HTMLElement | null
      if (!cell) return

      const servicoId = cell.dataset.servicoId
      const unidadeId = cell.dataset.unidadeId
      if (!servicoId || !unidadeId) return

      const key = `${servicoId}:${unidadeId}`
      const verificacao = verificacoesMap[key]

      if (verificacao) {
        router.push(`/app/obras/${obraId}/verificacoes/${verificacao.id}`)
      } else {
        router.push(`/app/obras/${obraId}/verificacoes/nova?servico=${servicoId}&unidade=${unidadeId}`)
      }
    },
    [verificacoesMap, obraId, router]
  )

  return (
    <div
      className="overflow-auto rounded-md border border-border"
      style={{ maxHeight: 'calc(100vh - 280px)' }}
    >
      <TooltipProvider delayDuration={200}>
        <div
          onClick={handleClick}
          style={{
            display: 'grid',
            gridTemplateColumns: `280px repeat(${totalDataColumns}, 40px)`,
            gridTemplateRows: `40px 32px repeat(${servicos.length}, 56px)`,
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
                  className="bg-surface-100 border-b border-r border-border px-3 py-1 flex flex-col justify-center"
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
                    <span className="text-[10px] text-foreground-lighter whitespace-nowrap">
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

                      const cellDiv = (
                        <div
                          key={`${servico.id}-${unidade.id}`}
                          data-cell=""
                          data-servico-id={servico.id}
                          data-unidade-id={unidade.id}
                          className={`${colorClass} cursor-pointer hover:opacity-80 transition-opacity border-r border-b border-border/30`}
                          style={{ gridRow }}
                        />
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
