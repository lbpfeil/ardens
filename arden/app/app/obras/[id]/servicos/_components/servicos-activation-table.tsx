'use client'

import { Library, RefreshCw } from 'lucide-react'
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
import type { ServicoWithRevisionStatus } from '@/lib/supabase/queries/obra-servicos'
import { categoriaServicoOptions } from '@/lib/validations/servico'

interface ServicosActivationTableProps {
  servicos: ServicoWithRevisionStatus[]
  onToggle: (servico: ServicoWithRevisionStatus, checked: boolean) => void
  onUpdateRevision: (servico: ServicoWithRevisionStatus) => void
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
  onUpdateRevision,
  updatingId,
}: ServicosActivationTableProps) {
  const activeCount = servicos.filter(s => s.ativo_na_obra).length
  const outdatedCount = servicos.filter(s => s.ativo_na_obra && s.has_newer_revision).length

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
      {/* Summary */}
      <div className="flex items-center gap-4 text-sm text-foreground-light">
        <span>{activeCount} de {servicos.length} servicos ativos nesta obra</span>
        {outdatedCount > 0 && (
          <Badge className="text-xs bg-warning/20 text-warning border-warning/30">
            {outdatedCount} com revisao desatualizada
          </Badge>
        )}
      </div>

      {/* Servicos table */}
      <div className="rounded-md border border-border bg-surface-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Ativo</TableHead>
              <TableHead className="w-[100px]">Codigo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[130px]">Categoria</TableHead>
              <TableHead className="w-[80px]">Rev. Obra</TableHead>
              <TableHead className="w-[80px]">Rev. Atual</TableHead>
              <TableHead className="w-[100px]">Acoes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicos.map((servico) => {
              const isUpdating = updatingId === servico.id
              const showUpdateButton = servico.ativo_na_obra && servico.has_newer_revision

              return (
                <TableRow
                  key={servico.id}
                  className={servico.has_newer_revision && servico.ativo_na_obra ? 'bg-warning/5' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={servico.ativo_na_obra}
                      onCheckedChange={(checked) => onToggle(servico, checked === true)}
                      disabled={isUpdating}
                      aria-label={`Ativar ${servico.nome}`}
                      className={isUpdating ? 'disabled:cursor-wait' : ''}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm text-foreground-light">
                    {servico.codigo}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {servico.nome}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {getCategoryLabel(servico.categoria)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {servico.ativo_na_obra ? (
                      <Badge
                        variant={servico.has_newer_revision ? 'outline' : 'secondary'}
                        className={`font-mono text-xs ${
                          servico.has_newer_revision ? 'text-foreground-muted' : ''
                        }`}
                      >
                        Rev. {servico.revisao_ativa || '00'}
                      </Badge>
                    ) : (
                      <span className="text-xs text-foreground-muted">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      Rev. {servico.revisao_atual}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {showUpdateButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onUpdateRevision(servico)}
                        disabled={isUpdating}
                        className="text-brand-link hover:text-brand h-7 px-2"
                      >
                        <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isUpdating ? 'animate-spin' : ''}`} />
                        Atualizar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
