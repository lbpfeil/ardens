'use client'

import { useState, useCallback, useMemo } from 'react'
import { Filter, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import type { MatrizData } from '@/lib/supabase/queries/verificacoes'
import { MatrizGrid } from './matriz-grid'
import { STATUS_COLORS, STATUS_LABELS, type MatrizCellStatus } from './matriz-status'

interface MatrizClientProps {
  initialData: MatrizData
  obraId: string
}

export function MatrizClient({ initialData, obraId }: MatrizClientProps) {
  const { servicos, agrupamentos, verificacoesMap } = initialData

  // Filtro de agrupamentos — todos visíveis por padrão
  const [visibleGroupIds, setVisibleGroupIds] = useState<Set<string>>(() => {
    return new Set(agrupamentos.map(ag => ag.id))
  })

  // Agrupamentos filtrados
  const filteredAgrupamentos = useMemo(() => {
    return agrupamentos.filter(ag => visibleGroupIds.has(ag.id))
  }, [agrupamentos, visibleGroupIds])

  const handleToggleFilter = useCallback((groupId: string) => {
    setVisibleGroupIds(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) {
        // Não permitir desmarcar todos
        if (next.size > 1) {
          next.delete(groupId)
        }
      } else {
        next.add(groupId)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    setVisibleGroupIds(new Set(agrupamentos.map(ag => ag.id)))
  }, [agrupamentos])

  // Estado do dropdown de filtro
  const [filterOpen, setFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilterOpenChange = useCallback((open: boolean) => {
    setFilterOpen(open)
    if (!open) setSearchTerm('')
  }, [])

  const searchedAgrupamentos = useMemo(() => {
    if (!searchTerm.trim()) return agrupamentos
    const term = searchTerm.toLowerCase().trim()
    return agrupamentos.filter(ag => ag.nome.toLowerCase().includes(term))
  }, [agrupamentos, searchTerm])

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

  // Unidades visíveis = unidades de agrupamentos filtrados e expandidos
  const visibleUnits = useMemo(() => {
    return filteredAgrupamentos.flatMap(ag =>
      expandedGroups.has(ag.id) ? ag.unidades : []
    )
  }, [filteredAgrupamentos, expandedGroups])

  // Template dinâmico: 48px por unidade expandida, 80px por grupo colapsado
  const gridTemplateColumns = useMemo(() => {
    const parts = ['280px']
    for (const ag of filteredAgrupamentos) {
      if (expandedGroups.has(ag.id)) {
        parts.push(`repeat(${ag.unidades.length}, 48px)`)
      } else {
        parts.push('80px')
      }
    }
    return parts.join(' ')
  }, [filteredAgrupamentos, expandedGroups])

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
      {/* Toolbar: filtro de agrupamentos + legenda */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        {/* Filtro de agrupamentos (dropdown escalável) */}
        {agrupamentos.length > 1 && (
          <DropdownMenu open={filterOpen} onOpenChange={handleFilterOpenChange}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5">
                <Filter className="w-3.5 h-3.5" />
                <span>Agrupamentos</span>
                {visibleGroupIds.size < agrupamentos.length && (
                  <span className="bg-brand/20 text-brand rounded px-1.5 text-xs font-medium leading-none">
                    {visibleGroupIds.size}/{agrupamentos.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {/* Barra de pesquisa */}
              <div className="px-2 pt-1.5 pb-1">
                <div className="flex items-center gap-1.5 h-7 rounded-md border border-border bg-surface-200 px-2">
                  <Search className="w-3 h-3 text-foreground-muted shrink-0" />
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => e.stopPropagation()}
                    className="flex-1 bg-transparent text-xs text-foreground placeholder:text-foreground-muted outline-none"
                  />
                </div>
              </div>

              {/* Selecionar todos + contagem */}
              <div className="flex items-center justify-between px-2 pb-1">
                <span className="text-xs text-foreground-muted">
                  {visibleGroupIds.size} de {agrupamentos.length}
                </span>
                {visibleGroupIds.size < agrupamentos.length && (
                  <button
                    type="button"
                    className="text-xs text-brand hover:underline"
                    onClick={handleSelectAll}
                  >
                    Selecionar todos
                  </button>
                )}
              </div>

              <DropdownMenuSeparator />

              {/* Lista de agrupamentos */}
              {searchedAgrupamentos.map(ag => (
                <DropdownMenuCheckboxItem
                  key={ag.id}
                  checked={visibleGroupIds.has(ag.id)}
                  onCheckedChange={() => handleToggleFilter(ag.id)}
                  onSelect={(e) => e.preventDefault()}
                >
                  {ag.nome}
                </DropdownMenuCheckboxItem>
              ))}
              {searchedAgrupamentos.length === 0 && (
                <div className="px-2 py-3 text-center text-xs text-foreground-muted">
                  Nenhum resultado
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Legenda de cores */}
        <div className="flex items-center gap-4 flex-wrap ml-auto">
          {(Object.entries(STATUS_COLORS) as [MatrizCellStatus, string][]).map(([status, colorClass]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-sm ${colorClass}`} />
              <span className="text-xs text-foreground-lighter">{STATUS_LABELS[status]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid da Matriz */}
      <MatrizGrid
        servicos={servicos}
        visibleUnits={visibleUnits}
        agrupamentos={filteredAgrupamentos}
        expandedGroups={expandedGroups}
        verificacoesMap={verificacoesMap}
        onToggleGroup={handleToggleGroup}
        obraId={obraId}
        gridTemplateColumns={gridTemplateColumns}
      />
    </>
  )
}
