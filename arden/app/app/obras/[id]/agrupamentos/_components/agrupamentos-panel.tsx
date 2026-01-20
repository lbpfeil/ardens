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
import { ArrowUpDown, Plus } from 'lucide-react'
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
  isReorderMode,
  onReorderStart,
  onReorderSave,
  onReorderCancel,
}: AgrupamentosPanelProps) {
  const [pendingOrder, setPendingOrder] = useState<string[]>([])

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
      <div className="flex items-center justify-end gap-2">
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

      {/* List / Empty State */}
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
          <ul className="divide-y divide-border">
            {agrupamentos.map((agrupamento) => (
              <SortableAgrupamentoItem
                key={agrupamento.id}
                id={agrupamento.id}
                agrupamento={agrupamento}
                isSelected={selectedId === agrupamento.id}
                onSelect={onSelect}
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
