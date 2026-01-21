'use client'

import { useEffect, useState } from 'react'
import { Database, Plus, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { listUnidades, type Unidade } from '@/lib/supabase/queries/unidades'
import type { AgrupamentoWithCount } from '@/lib/supabase/queries/agrupamentos'
import { toast } from 'sonner'

interface UnidadesPanelProps {
  agrupamento: AgrupamentoWithCount | null
  onCreateClick: () => void
  onEditClick: (unidade: Unidade) => void
  onDeleteClick: (unidade: Unidade) => void
  onBulkDeleteClick: (ids: string[]) => void
  refreshKey?: number
}

export function UnidadesPanel({
  agrupamento,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onBulkDeleteClick,
  refreshKey = 0,
}: UnidadesPanelProps) {
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!agrupamento) {
      setUnidades([])
      setCheckedIds(new Set())
      return
    }

    setIsLoading(true)
    listUnidades(agrupamento.id)
      .then(setUnidades)
      .catch((error) => toast.error(error instanceof Error ? error.message : 'Erro ao carregar unidades'))
      .finally(() => setIsLoading(false))
  }, [agrupamento?.id, refreshKey])

  // Clear checked when unidades change
  useEffect(() => {
    setCheckedIds(prev => {
      const validIds = new Set(unidades.map(u => u.id))
      const next = new Set([...prev].filter(id => validIds.has(id)))
      return next.size !== prev.size ? next : prev
    })
  }, [unidades])

  // Selection handlers
  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setCheckedIds(new Set(unidades.map(u => u.id)))
    } else {
      setCheckedIds(new Set())
    }
  }

  const handleCheckOne = (id: string, checked: boolean) => {
    setCheckedIds(prev => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }

  const handleBulkDelete = () => {
    onBulkDeleteClick(Array.from(checkedIds))
  }

  const isAllChecked = unidades.length > 0 && checkedIds.size === unidades.length
  const isSomeChecked = checkedIds.size > 0 && checkedIds.size < unidades.length

  // Empty state: no agrupamento selected
  if (!agrupamento) {
    return (
      <div className="rounded-md border border-border bg-surface-100 h-full min-h-[400px]">
        <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
          <Database className="h-12 w-12 text-foreground-muted mb-4" />
          <p className="text-foreground-light mb-2">Selecione um agrupamento</p>
          <p className="text-sm text-foreground-muted">
            Clique em um agrupamento à esquerda para ver suas unidades.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-medium text-foreground">
            Unidades de {agrupamento.nome}
          </h2>
          {checkedIds.size > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-1.5" data-icon="inline-start" />
              Excluir {checkedIds.size}
            </Button>
          )}
        </div>
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
          Nova Unidade
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex items-center justify-center py-16">
            <p className="text-foreground-muted">Carregando unidades...</p>
          </div>
        </div>
      )}

      {/* Empty state: no unidades */}
      {!isLoading && unidades.length === 0 && (
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-foreground-light mb-2">Nenhuma unidade cadastrada</p>
            <p className="text-sm text-foreground-muted mb-4">
              Clique em &quot;Nova Unidade&quot; para começar.
            </p>
            <Button onClick={onCreateClick} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
              Criar primeira unidade
            </Button>
          </div>
        </div>
      )}

      {/* Unidades table */}
      {!isLoading && unidades.length > 0 && (
        <div className="rounded-md border border-border bg-surface-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox
                    checked={isSomeChecked ? 'indeterminate' : isAllChecked}
                    onCheckedChange={handleCheckAll}
                    aria-label="Selecionar todos"
                  />
                </TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[50px]">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unidades.map((unidade) => (
                <TableRow key={unidade.id}>
                  <TableCell>
                    <Checkbox
                      checked={checkedIds.has(unidade.id)}
                      onCheckedChange={(checked) => handleCheckOne(unidade.id, checked === true)}
                      aria-label={`Selecionar ${unidade.nome}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{unidade.nome}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditClick(unidade)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDeleteClick(unidade)}
                        >
                          Excluir
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
