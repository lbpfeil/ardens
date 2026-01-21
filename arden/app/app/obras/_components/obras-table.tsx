'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ListPageToolbar,
  type StatusFilter,
} from '@/components/ui/list-page-toolbar'
import {
  SortableTableHeader,
  type SortDirection,
} from '@/components/ui/sortable-table-header'
import { StatusBadge } from './status-badge'
import { MoreVertical, Plus } from 'lucide-react'
import type { Obra } from '@/lib/supabase/queries/obras'

type SortField = 'nome' | 'arquivada' | 'created_at'

interface ObrasTableProps {
  obras: Obra[]
  onCreateClick: () => void
  onEditClick: (obra: Obra) => void
  onArchiveClick: (obra: Obra) => void
  isLoading?: boolean
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ObrasTable({
  obras,
  onCreateClick,
  onEditClick,
  onArchiveClick,
  isLoading = false,
}: ObrasTableProps) {
  const router = useRouter()

  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ativos')

  // Sort state
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const filteredObras = useMemo(() => {
    let result = [...obras]

    // Apply status filter (note: Obra uses 'arquivada' not 'arquivado')
    if (statusFilter === 'ativos') {
      result = result.filter((o) => !o.arquivada)
    } else if (statusFilter === 'arquivados') {
      result = result.filter((o) => o.arquivada)
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter((o) => o.nome.toLowerCase().includes(query))
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0

      switch (sortField) {
        case 'nome':
          comparison = a.nome.localeCompare(b.nome, 'pt-BR', { numeric: true })
          break
        case 'arquivada':
          comparison = (a.arquivada ? 1 : 0) - (b.arquivada ? 1 : 0)
          break
        case 'created_at':
          comparison = a.created_at.localeCompare(b.created_at)
          break
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [obras, searchQuery, statusFilter, sortField, sortDirection])

  const handleRowClick = (obraId: string) => {
    router.push(`/app/obras/${obraId}`)
  }

  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'ativos'

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Toolbar skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-8 w-28" />
        </div>
        {/* Table skeleton */}
        <div className="rounded-md border border-border">
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <ListPageToolbar
        searchPlaceholder="Buscar por nome..."
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusTabs={[
          { value: 'ativos', label: 'Ativas' },
          { value: 'arquivados', label: 'Arquivadas' },
          { value: 'todos', label: 'Todas' },
        ]}
        primaryActionLabel="Nova Obra"
        onPrimaryAction={onCreateClick}
        filteredCount={filteredObras.length}
        totalCount={obras.length}
        itemLabel="obra"
      />

      {/* Table */}
      {filteredObras.length === 0 ? (
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {searchQuery.trim() !== '' ? (
              <>
                <p className="text-foreground-light mb-2">Nenhuma obra encontrada</p>
                <p className="text-sm text-foreground-muted">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </>
            ) : obras.length === 0 ? (
              <>
                <p className="text-foreground-light mb-2">Nenhuma obra cadastrada</p>
                <p className="text-sm text-foreground-muted mb-4">
                  Crie sua primeira obra para comecar
                </p>
                <Button onClick={onCreateClick} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                  Criar primeira obra
                </Button>
              </>
            ) : statusFilter === 'arquivados' ? (
              <>
                <p className="text-foreground-light mb-2">Nenhuma obra arquivada</p>
                <p className="text-sm text-foreground-muted">
                  Obras arquivadas aparecerao aqui
                </p>
              </>
            ) : (
              <>
                <p className="text-foreground-light mb-2">Nenhuma obra ativa</p>
                <p className="text-sm text-foreground-muted mb-4">
                  Crie uma nova obra para comecar
                </p>
                <Button onClick={onCreateClick} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                  Criar primeira obra
                </Button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-surface-100">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHeader
                  field="nome"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                >
                  Nome
                </SortableTableHeader>
                <SortableTableHeader
                  field="arquivada"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[100px]"
                >
                  Status
                </SortableTableHeader>
                <TableHead className="w-[120px]">Progresso</TableHead>
                <SortableTableHeader
                  field="created_at"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={handleSort}
                  className="w-[120px]"
                >
                  Data Criacao
                </SortableTableHeader>
                <TableHead className="w-[50px]">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredObras.map((obra) => (
                <TableRow
                  key={obra.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(obra.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <span className={obra.arquivada ? 'text-foreground-muted' : ''}>
                        {obra.nome}
                      </span>
                      {obra.arquivada && (
                        <Badge variant="outline" className="text-xs">
                          Arquivada
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge arquivada={obra.arquivada} />
                  </TableCell>
                  <TableCell>
                    <span className="text-foreground-muted text-sm">0%</span>
                  </TableCell>
                  <TableCell className="text-foreground-light">
                    {formatDate(obra.created_at)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onEditClick(obra)
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant={obra.arquivada ? 'default' : 'destructive'}
                          onClick={(e) => {
                            e.stopPropagation()
                            onArchiveClick(obra)
                          }}
                        >
                          {obra.arquivada ? 'Restaurar' : 'Arquivar'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
