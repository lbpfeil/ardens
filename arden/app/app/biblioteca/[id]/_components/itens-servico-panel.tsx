'use client'

import { Plus, ListChecks, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import type { Servico } from '@/lib/supabase/queries/servicos'
import type { ItemServico } from '@/lib/supabase/queries/itens-servico'

interface ItensServicoPanelProps {
  servico: Servico
  itens: ItemServico[]
  onCreateClick: () => void
  onEditClick: (item: ItemServico) => void
  onDeleteClick: (item: ItemServico) => void
}

export function ItensServicoPanel({
  servico,
  itens,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: ItensServicoPanelProps) {
  // Empty state
  if (itens.length === 0) {
    return (
      <div className="space-y-4">
        {/* Panel header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">
            Itens de Verificacao
          </h2>
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
            Novo Item
          </Button>
        </div>

        {/* Empty state */}
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <ListChecks className="h-12 w-12 text-foreground-muted mb-4" />
            <p className="text-foreground-light mb-2">
              Nenhum item de verificacao cadastrado
            </p>
            <p className="text-sm text-foreground-muted mb-4">
              Adicione itens que definem o que verificar neste servico.
            </p>
            <Button onClick={onCreateClick} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
              Criar primeiro item
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-foreground">
          Itens de Verificacao
        </h2>
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
          Novo Item
        </Button>
      </div>

      {/* Itens table */}
      <div className="rounded-md border border-border bg-surface-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Observacao</TableHead>
              <TableHead className="hidden md:table-cell">Metodo</TableHead>
              <TableHead className="w-[50px]">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {itens.map((item) => (
              <TableRow key={item.id} className="group hover:bg-surface-200/50">
                <TableCell className="text-foreground-muted">
                  {item.ordem + 1}
                </TableCell>
                <TableCell>
                  <p className="font-medium text-foreground max-w-[300px] truncate">
                    {item.observacao}
                  </p>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <p className="text-sm text-foreground-light max-w-[200px] truncate">
                    {item.metodo || '-'}
                  </p>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditClick(item)}>
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => onDeleteClick(item)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
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
    </div>
  )
}
