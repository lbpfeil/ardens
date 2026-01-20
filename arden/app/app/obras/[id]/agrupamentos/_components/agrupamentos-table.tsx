'use client'

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
import { MoreVertical, Plus } from 'lucide-react'
import type { AgrupamentoWithCount } from '@/lib/supabase/queries/agrupamentos'

interface AgrupamentosTableProps {
  agrupamentos: AgrupamentoWithCount[]
  obraNome: string
  onCreateClick: () => void
  onEditClick: (agrupamento: AgrupamentoWithCount) => void
  onDeleteClick: (agrupamento: AgrupamentoWithCount) => void
}

export function AgrupamentosTable({
  agrupamentos,
  obraNome,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: AgrupamentosTableProps) {
  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-foreground">Agrupamentos</h1>
        <p className="text-sm text-foreground-light mt-1">{obraNome}</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
          Novo Agrupamento
        </Button>
      </div>

      {/* Table / Empty State */}
      {agrupamentos.length === 0 ? (
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-foreground-light mb-2">Nenhum agrupamento cadastrado</p>
            <p className="text-sm text-foreground-muted mb-4">
              Clique em &quot;Novo Agrupamento&quot; para comecar.
            </p>
            <Button onClick={onCreateClick} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
              Criar primeiro agrupamento
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[120px]">Unidades</TableHead>
                <TableHead className="w-[50px]">Acoes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agrupamentos.map((agrupamento) => (
                <TableRow key={agrupamento.id}>
                  <TableCell className="font-medium">{agrupamento.nome}</TableCell>
                  <TableCell className="text-foreground-light">
                    {agrupamento.unidades_count}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditClick(agrupamento)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => onDeleteClick(agrupamento)}
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
