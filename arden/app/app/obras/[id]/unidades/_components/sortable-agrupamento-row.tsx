'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TableCell, TableRow } from '@/components/ui/table'
import { GripVertical } from 'lucide-react'
import type { AgrupamentoWithCount } from '@/lib/supabase/queries/agrupamentos'

interface SortableAgrupamentoRowProps {
  id: string
  agrupamento: AgrupamentoWithCount
}

export function SortableAgrupamentoRow({
  id,
  agrupamento,
}: SortableAgrupamentoRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell className="w-[40px]">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing touch-none p-1 -m-1 rounded hover:bg-surface-200 text-foreground-muted hover:text-foreground-light"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{agrupamento.nome}</TableCell>
      <TableCell className="text-foreground-light">
        {agrupamento.unidades_count}
      </TableCell>
    </TableRow>
  )
}
