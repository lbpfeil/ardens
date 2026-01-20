'use client'

import { useEffect, useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowUpDown, Plus, Trash2 } from 'lucide-react'
import { SortableAgrupamentoItem } from './sortable-agrupamento-item'
import type { AgrupamentoWithCount } from '@/lib/supabase/queries/agrupamentos'

interface AgrupamentosPanelProps {
  agrupamentos: AgrupamentoWithCount[]
  obraNome: string
  selectedId: string | null
  onSelect: (id: string) => void
  onCreateClick: () => void
  onEditClick: (agrupamento: AgrupamentoWithCount) => void
  onDeleteClick: (agrupamento: AgrupamentoWithCount) => void
  onBulkDeleteClick: (ids: string[]) => void
  isReorderMode: boolean
  onReorderStart: () => void
  onReorderSave: (orderedIds: string[]) => void
  onReorderCancel: () => void
}

export function AgrupamentosPanel({
  agrupamentos,
  obraNome,
  selectedId,
  onSelect,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onBulkDeleteClick,
  isReorderMode,
  onReorderStart,
  onReorderSave,
  onReorderCancel,
}: AgrupamentosPanelProps) {
  const [pendingOrder, setPendingOrder] = useState<string[]>([])
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

  // Initialize pending order when entering reorder mode
  useEffect(() => {
    if (isReorderMode) {
      setPendingOrder(agrupamentos.map(a => a.id))
    }
  }, [isReorderMode, agrupamentos])

  // Configure dnd-kit sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setPendingOrder((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over.id as string)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const handleSave = () => {
    onReorderSave(pendingOrder)
  }

  // Selection handlers for bulk delete
  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setCheckedIds(new Set(agrupamentos.map(a => a.id)))
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

  // Clear checked when agrupamentos change (after delete, etc.)
  useEffect(() => {
    setCheckedIds(prev => {
      const validIds = new Set(agrupamentos.map(a => a.id))
      const next = new Set([...prev].filter(id => validIds.has(id)))
      return next.size !== prev.size ? next : prev
    })
  }, [agrupamentos])

  const isAllChecked = agrupamentos.length > 0 && checkedIds.size === agrupamentos.length
  const isSomeChecked = checkedIds.size > 0 && checkedIds.size < agrupamentos.length

  // Get agrupamentos in pending order
  const orderedAgrupamentos = isReorderMode
    ? pendingOrder
        .map(id => agrupamentos.find(a => a.id === id))
        .filter((a): a is AgrupamentoWithCount => a !== undefined)
    : agrupamentos

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-normal text-foreground">Agrupamentos</h1>
        <p className="text-sm text-foreground-light mt-1">{obraNome}</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div>
          {checkedIds.size > 0 && !isReorderMode && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-1.5" data-icon="inline-start" />
              Excluir {checkedIds.size} selecionado{checkedIds.size > 1 ? 's' : ''}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isReorderMode ? (
            <>
              <Button variant="outline" onClick={onReorderCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Salvar Ordem
              </Button>
            </>
          ) : (
            <>
              {agrupamentos.length > 1 && (
                <Button variant="outline" onClick={onReorderStart}>
                  <ArrowUpDown className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                  Reordenar
                </Button>
              )}
              <Button onClick={onCreateClick}>
                <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                Novo Agrupamento
              </Button>
            </>
          )}
        </div>
      </div>

      {/* List / Empty State */}
      {agrupamentos.length === 0 ? (
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="text-foreground-light mb-2">Nenhum agrupamento cadastrado</p>
            <p className="text-sm text-foreground-muted mb-4">
              Clique em &quot;Novo Agrupamento&quot; para começar.
            </p>
            <Button onClick={onCreateClick} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
              Criar primeiro agrupamento
            </Button>
          </div>
        </div>
      ) : isReorderMode ? (
        <div className="rounded-md border border-border bg-surface-100 overflow-hidden">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={pendingOrder}
              strategy={verticalListSortingStrategy}
            >
              <ul className="divide-y divide-border">
                {orderedAgrupamentos.map((agrupamento) => (
                  <SortableAgrupamentoItem
                    key={agrupamento.id}
                    id={agrupamento.id}
                    agrupamento={agrupamento}
                    isSelected={false}
                    onSelect={() => {}}
                    onEditClick={onEditClick}
                    onDeleteClick={onDeleteClick}
                    isReorderMode={true}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-surface-100 overflow-hidden">
          {/* Select all header */}
          {agrupamentos.length > 0 && (
            <div className="flex items-center gap-3 px-3 py-2 border-b border-border bg-surface-200/50">
              <Checkbox
                checked={isSomeChecked ? 'indeterminate' : isAllChecked}
                onCheckedChange={handleCheckAll}
                aria-label="Selecionar todos"
              />
              <span className="text-xs text-foreground-muted">
                {checkedIds.size > 0 ? `${checkedIds.size} selecionado${checkedIds.size > 1 ? 's' : ''}` : 'Selecionar todos'}
              </span>
            </div>
          )}
          <ul className="divide-y divide-border">
            {agrupamentos.map((agrupamento) => (
              <SortableAgrupamentoItem
                key={agrupamento.id}
                id={agrupamento.id}
                agrupamento={agrupamento}
                isSelected={selectedId === agrupamento.id}
                isChecked={checkedIds.has(agrupamento.id)}
                onSelect={onSelect}
                onCheck={handleCheckOne}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}
                isReorderMode={false}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
