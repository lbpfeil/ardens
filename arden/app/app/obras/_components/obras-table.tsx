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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from './status-badge'
import { MoreVertical, Plus, Search } from 'lucide-react'
import type { Obra } from '@/lib/supabase/queries/obras'

interface ObrasTableProps {
  obras: Obra[]
  onCreateClick: () => void
  onEditClick: (obra: Obra) => void
  onArchiveClick: (obra: Obra) => void
  isLoading?: boolean
}

type StatusFilter = 'ativas' | 'arquivadas' | 'todas'

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function ObrasTable({ obras, onCreateClick, onEditClick, onArchiveClick, isLoading = false }: ObrasTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ativas')

  const filteredObras = useMemo(() => {
    return obras.filter((obra) => {
      // Search filter (case-insensitive)
      const matchesSearch = obra.nome
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

      // Status filter
      let matchesStatus = true
      if (statusFilter === 'ativas') {
        matchesStatus = !obra.arquivada
      } else if (statusFilter === 'arquivadas') {
        matchesStatus = obra.arquivada
      }

      return matchesSearch && matchesStatus
    })
  }, [obras, searchQuery, statusFilter])

  const handleRowClick = (obraId: string) => {
    router.push(`/app/obras/${obraId}`)
  }

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
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              placeholder="Buscar por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>

          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as StatusFilter)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativas">Ativas</SelectItem>
              <SelectItem value="arquivadas">Arquivadas</SelectItem>
              <SelectItem value="todas">Todas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Create button */}
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
          Nova Obra
        </Button>
      </div>

      {/* Table */}
      {filteredObras.length === 0 ? (
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-foreground-light mb-2">Nenhuma obra encontrada</p>
            <p className="text-sm text-foreground-muted mb-4">
              {searchQuery || statusFilter !== 'todas'
                ? 'Tente ajustar os filtros de busca'
                : 'Crie sua primeira obra para comecar'}
            </p>
            {!searchQuery && statusFilter === 'todas' && (
              <Button onClick={onCreateClick} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                Criar primeira obra
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-surface-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[120px]">Progresso</TableHead>
                <TableHead className="w-[120px]">Data Criacao</TableHead>
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
                  <TableCell className="font-medium">{obra.nome}</TableCell>
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
