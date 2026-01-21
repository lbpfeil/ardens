'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AgrupamentoWithCount } from '@/lib/supabase/queries/agrupamentos'

interface SortableAgrupamentoItemProps {
  id: string
  agrupamento: AgrupamentoWithCount
  isSelected: boolean
  isChecked?: boolean
  onSelect: (id: string) => void
  onCheck?: (id: string, checked: boolean) => void
  onEditClick: (agrupamento: AgrupamentoWithCount) => void
  onDeleteClick: (agrupamento: AgrupamentoWithCount) => void
  isReorderMode: boolean
}

export function SortableAgrupamentoItem({
  id,
  agrupamento,
  isSelected,
  isChecked = false,
  onSelect,
  onCheck,
  onEditClick,
  onDeleteClick,
  isReorderMode,
}: SortableAgrupamentoItemProps) {
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

  const handleClick = () => {
    if (!isReorderMode) {
      onSelect(id)
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center px-4 py-3
        ${!isReorderMode ? 'cursor-pointer hover:bg-surface-200' : ''}
        ${isSelected ? 'bg-surface-200 border-l-2 border-brand' : ''}
        ${isSelected ? 'pl-[14px]' : ''}
      `}
      onClick={handleClick}
    >
      {isReorderMode && (
        <button
          className="mr-3 cursor-grab touch-none text-foreground-muted hover:text-foreground-light"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      )}

      {!isReorderMode && onCheck && (
        <Checkbox
          checked={isChecked}
          onCheckedChange={(checked) => onCheck(id, checked === true)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Selecionar ${agrupamento.nome}`}
          className="mr-3"
        />
      )}

      <div className="flex-1 min-w-0">
        <span className="font-medium text-foreground">{agrupamento.nome}</span>
        <span className="ml-2 text-foreground-muted">
          ({agrupamento.unidades_count})
        </span>
      </div>

      {!isReorderMode && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              onEditClick(agrupamento)
            }}>
              Editar
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                onDeleteClick(agrupamento)
              }}
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </li>
  )
}
