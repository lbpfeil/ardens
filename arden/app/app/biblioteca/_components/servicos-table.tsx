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
import {
  ListPageToolbar,
  type StatusFilter,
} from '@/components/ui/list-page-toolbar'
import {
  SortableTableHeader,
  type SortDirection,
} from '@/components/ui/sortable-table-header'
import { MoreVertical, Plus } from 'lucide-react'
import { categoriaServicoOptions } from '@/lib/validations/servico'
import type { Servico } from '@/lib/supabase/queries/servicos'

// Re-export types for use by parent component
export type { StatusFilter } from '@/components/ui/list-page-toolbar'
export type { SortDirection } from '@/components/ui/sortable-table-header'
export type SortField = 'codigo' | 'nome' | 'categoria' | 'created_at'

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
}

function getCategoryLabel(categoria: string | null): string {
  if (!categoria) return '-'
  const option = categoriaServicoOptions.find((opt) => opt.value === categoria)
  return option?.label || categoria
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
      <ListPageToolbar
        searchPlaceholder="Buscar por codigo ou nome..."
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        primaryActionLabel="Novo Servico"
        onPrimaryAction={onCreateClick}
        filteredCount={servicos.length}
        totalCount={totalCount}
        itemLabel="servico"
      />

      {/* Table */}
      {servicos.length === 0 ? (
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {searchQuery.trim() !== '' ? (
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
                <SortableTableHeader
                  field="codigo"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={onSort}
                  className="w-[120px]"
                >
                  Codigo
                </SortableTableHeader>
                <SortableTableHeader
                  field="nome"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={onSort}
                >
                  Nome
                </SortableTableHeader>
                <SortableTableHeader
                  field="categoria"
                  currentField={sortField}
                  currentDirection={sortDirection}
                  onSort={onSort}
                  className="w-[150px]"
                >
                  Categoria
                </SortableTableHeader>
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
