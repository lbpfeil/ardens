'use client'

import { Library } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { ServicoWithActivation } from '@/lib/supabase/queries/obra-servicos'
import { categoriaServicoOptions } from '@/lib/validations/servico'

interface ServicosActivationTableProps {
  servicos: ServicoWithActivation[]
  onToggle: (servico: ServicoWithActivation, checked: boolean) => void
  updatingId: string | null
}

function getCategoryLabel(categoria: string | null): string {
  if (!categoria) return 'Sem categoria'
  const option = categoriaServicoOptions.find(opt => opt.value === categoria)
  return option?.label ?? categoria
}

export function ServicosActivationTable({
  servicos,
  onToggle,
  updatingId,
}: ServicosActivationTableProps) {
  const activeCount = servicos.filter(s => s.ativo_na_obra).length

  // Empty state: no servicos available
  if (servicos.length === 0) {
    return (
      <div className="rounded-md border border-border bg-surface-100">
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <Library className="h-12 w-12 text-foreground-muted mb-4" />
          <p className="text-foreground-light mb-2">Nenhum servico disponivel</p>
          <p className="text-sm text-foreground-muted mb-4">
            Crie servicos na Biblioteca FVS primeiro.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/app/biblioteca">
              Ir para Biblioteca FVS
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Active count summary */}
      <p className="text-sm text-foreground-light">
        {activeCount} de {servicos.length} servicos ativos nesta obra
      </p>

      {/* Servicos table */}
      <div className="rounded-md border border-border bg-surface-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Ativo</TableHead>
              <TableHead className="w-[120px]">Codigo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[150px]">Categoria</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicos.map((servico) => (
              <TableRow key={servico.id}>
                <TableCell>
                  <Checkbox
                    checked={servico.ativo_na_obra}
                    onCheckedChange={(checked) => onToggle(servico, checked === true)}
                    disabled={updatingId === servico.id}
                    aria-label={`Ativar ${servico.nome}`}
                    className={updatingId === servico.id ? 'disabled:cursor-wait' : ''}
                  />
                </TableCell>
                <TableCell className="font-mono text-sm text-foreground-light">
                  {servico.codigo}
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {servico.nome}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getCategoryLabel(servico.categoria)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
