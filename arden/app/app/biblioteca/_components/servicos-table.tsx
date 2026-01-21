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
import { MoreVertical, Plus } from 'lucide-react'
import { categoriaServicoOptions } from '@/lib/validations/servico'
import type { Servico } from '@/lib/supabase/queries/servicos'

interface ServicosTableProps {
  servicos: Servico[]
  onCreateClick: () => void
  onEditClick: (servico: Servico) => void
  onArchiveClick: (servico: Servico) => void
  onRowClick?: (servico: Servico) => void
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
      <div className="flex items-center justify-end">
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
          Novo Servico
        </Button>
      </div>

      {/* Table */}
      {servicos.length === 0 ? (
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-foreground-light mb-2">Nenhum servico cadastrado</p>
            <p className="text-sm text-foreground-muted mb-4">
              Clique em &apos;Novo Servico&apos; para comecar
            </p>
            <Button onClick={onCreateClick} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
              Criar primeiro servico
            </Button>
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-surface-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Codigo</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[150px]">Categoria</TableHead>
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
                  <TableCell className="font-medium">{servico.codigo}</TableCell>
                  <TableCell>{servico.nome}</TableCell>
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
                          variant="destructive"
                          onClick={(e) => {
                            e.stopPropagation()
                            onArchiveClick(servico)
                          }}
                        >
                          Arquivar
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
