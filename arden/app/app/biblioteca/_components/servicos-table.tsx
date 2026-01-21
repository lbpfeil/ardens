'use client'

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
import { Input } from '@/components/ui/input'
import { MoreVertical, Plus, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { categoriaServicoOptions } from '@/lib/validations/servico'
import type { Servico } from '@/lib/supabase/queries/servicos'
import type { StatusFilter, SortField, SortDirection } from './biblioteca-page-client'
import { cn } from '@/lib/utils'

interface ServicosTableProps {
  servicos: Servico[]
  onCreateClick: () => void
  onEditClick: (servico: Servico) => void
  onArchiveClick: (servico: Servico) => void
  onRowClick?: (servico: Servico) => void
  // Filter props
  statusFilter: StatusFilter
  onStatusFilterChange: (filter: StatusFilter) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  // Sort props
  sortField: SortField
  sortDirection: SortDirection
  onSort: (field: SortField) => void
  // Info props
  totalCount: number
  hasActiveFilters: boolean
}

function getCategoryLabel(categoria: string | null): string {
  if (!categoria) return '-'
  const option = categoriaServicoOptions.find((opt) => opt.value === categoria)
  return option?.label || categoria
}

const statusTabs: { value: StatusFilter; label: string }[] = [
  { value: 'ativos', label: 'Ativos' },
  { value: 'arquivados', label: 'Arquivados' },
  { value: 'todos', label: 'Todos' },
]

function SortableHeader({
  field,
  currentField,
  currentDirection,
  onSort,
  children,
  className,
}: {
  field: SortField
  currentField: SortField
  currentDirection: SortDirection
  onSort: (field: SortField) => void
  children: React.ReactNode
  className?: string
}) {
  const isActive = field === currentField

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="flex items-center gap-1 hover:text-foreground transition-colors -ml-1 px-1 py-0.5 rounded"
      >
        {children}
        {isActive ? (
          currentDirection === 'asc' ? (
            <ArrowUp className="h-3.5 w-3.5" />
          ) : (
            <ArrowDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
        )}
      </button>
    </TableHead>
  )
}

export function ServicosTable({
  servicos,
  onCreateClick,
  onEditClick,
  onArchiveClick,
  onRowClick,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchChange,
  sortField,
  sortDirection,
  onSort,
  totalCount,
  hasActiveFilters,
}: ServicosTableProps) {
  const router = useRouter()

  const handleRowClick = (servico: Servico) => {
    if (onRowClick) {
      onRowClick(servico)
    } else {
      router.push(`/app/biblioteca/${servico.id}`)
    }
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-lg border border-border w-fit">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => onStatusFilterChange(tab.value)}
              className={cn(
                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                statusFilter === tab.value
                  ? 'bg-surface-200 text-foreground'
                  : 'text-foreground-light hover:text-foreground hover:bg-surface-200/50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search and create */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              type="text"
              placeholder="Buscar por codigo ou nome..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
            Novo Servico
          </Button>
        </div>
      </div>

      {/* Results info */}
      <div className="text-sm text-foreground-muted">
        {servicos.length === totalCount
          ? `${totalCount} servico${totalCount !== 1 ? 's' : ''}`
          : `${servicos.length} de ${totalCount} servico${totalCount !== 1 ? 's' : ''}`}
      </div>

      {/* Table */}
      {servicos.length === 0 ? (
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {hasActiveFilters ? (
              <>
                <p className="text-foreground-light mb-2">Nenhum servico encontrado</p>
                <p className="text-sm text-foreground-muted">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </>
            ) : totalCount === 0 ? (
              <>
                <p className="text-foreground-light mb-2">Nenhum servico cadastrado</p>
                <p className="text-sm text-foreground-muted mb-4">
                  Clique em &apos;Novo Servico&apos; para comecar
                </p>
                <Button onClick={onCreateClick} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                  Criar primeiro servico
                </Button>
              </>
            ) : statusFilter === 'arquivados' ? (
              <>
                <p className="text-foreground-light mb-2">Nenhum servico arquivado</p>
                <p className="text-sm text-foreground-muted">
                  Servicos arquivados aparecerao aqui
                </p>
              </>
            ) : (
              <>
                <p className="text-foreground-light mb-2">Nenhum servico ativo</p>
                <p className="text-sm text-foreground-muted mb-4">
                  Clique em &apos;Novo Servico&apos; para comecar
                </p>
                <Button onClick={onCreateClick} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                  Criar primeiro servico
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
                <SortableHeader
                  field="codigo"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={onSort}
                  className="w-[120px]"
                >
                  Codigo
                </SortableHeader>
                <SortableHeader
                  field="nome"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={onSort}
                >
                  Nome
                </SortableHeader>
                <SortableHeader
                  field="categoria"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={onSort}
                  className="w-[150px]"
                >
                  Categoria
                </SortableHeader>
                <TableHead className="w-[50px]">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicos.map((servico) => (
                <TableRow
                  key={servico.id}
                  className="cursor-pointer"
                  onClick={() => handleRowClick(servico)}
                >
                  <TableCell className="font-medium">
                    <span className={servico.arquivado ? 'text-foreground-muted' : ''}>
                      {servico.codigo}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={servico.arquivado ? 'text-foreground-muted' : ''}>
                        {servico.nome}
                      </span>
                      {servico.arquivado && (
                        <Badge variant="outline" className="text-xs">
                          Arquivado
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {servico.categoria ? (
                      <Badge variant="secondary">
                        {getCategoryLabel(servico.categoria)}
                      </Badge>
                    ) : (
                      <span className="text-foreground-muted">-</span>
                    )}
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
                            onEditClick(servico)
                          }}
                        >
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant={servico.arquivado ? 'default' : 'destructive'}
                          onClick={(e) => {
                            e.stopPropagation()
                            onArchiveClick(servico)
                          }}
                        >
                          {servico.arquivado ? 'Restaurar' : 'Arquivar'}
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
