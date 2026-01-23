'use client'

import { useMemo } from 'react'
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
import type { Tag } from '@/lib/supabase/queries/tags'

interface ItensServicoPanelProps {
  servico: Servico
  itens: ItemServico[]
  tags: Tag[]
  onCreateClick: () => void
  onEditClick: (item: ItemServico) => void
  onDeleteClick: (item: ItemServico) => void
}

interface GroupedItems {
  tag: Tag | null
  items: ItemServico[]
}

export function ItensServicoPanel({
  servico,
  itens,
  tags,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}: ItensServicoPanelProps) {

  // Group items by tag
  const groupedItems = useMemo((): GroupedItems[] => {
    // Build tag map for quick lookup
    const tagMap = new Map(tags.map(t => [t.id, t]))

    // Group items
    const untagged: ItemServico[] = []
    const byTag = new Map<string, ItemServico[]>()

    for (const item of itens) {
      if (!item.tag_id) {
        untagged.push(item)
      } else {
        const existing = byTag.get(item.tag_id) || []
        existing.push(item)
        byTag.set(item.tag_id, existing)
      }
    }

    // Build result: untagged first, then tags in ordem
    const result: GroupedItems[] = []

    // Add untagged group if any
    if (untagged.length > 0) {
      result.push({ tag: null, items: untagged.sort((a, b) => a.ordem - b.ordem) })
    }

    // Add tagged groups in tag ordem
    const sortedTags = [...tags].sort((a, b) => a.ordem - b.ordem)
    for (const tag of sortedTags) {
      const tagItems = byTag.get(tag.id)
      if (tagItems && tagItems.length > 0) {
        result.push({
          tag,
          items: tagItems.sort((a, b) => a.ordem - b.ordem),
        })
      }
    }

    return result
  }, [itens, tags])

  // Empty state
  if (itens.length === 0) {
    return (
      <div className="space-y-4">
        {/* Panel header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">
            Itens de Verificação
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
              Nenhum item de verificação cadastrado
            </p>
            <p className="text-sm text-foreground-muted mb-4">
              Adicione itens que definem o que verificar neste serviço.
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
          Itens de Verificação
        </h2>
        <Button onClick={onCreateClick}>
          <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
          Novo Item
        </Button>
      </div>

      {/* Grouped items */}
      <div className="space-y-4">
        {groupedItems.map((group, groupIndex) => (
          <div
            key={group.tag?.id ?? 'untagged'}
            className="rounded-md border border-border bg-surface-100 overflow-hidden"
          >
            {/* Tag header (only for tagged groups) */}
            {group.tag && (
              <div
                className="flex items-center gap-2 px-3 py-2 border-b border-border"
                style={{ borderLeftWidth: '3px', borderLeftColor: group.tag.cor }}
              >
                <span className="text-sm font-medium text-foreground">
                  {group.tag.nome}
                </span>
                <span className="text-xs text-foreground-muted">
                  ({group.items.length} {group.items.length === 1 ? 'item' : 'itens'})
                </span>
              </div>
            )}

            {/* Items table */}
            <Table>
              {groupIndex === 0 && (
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Observação</TableHead>
                    <TableHead className="hidden md:table-cell">Método</TableHead>
                    <TableHead className="w-[50px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
              )}
              <TableBody>
                {group.items.map((item) => (
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
        ))}
      </div>
    </div>
  )
}
