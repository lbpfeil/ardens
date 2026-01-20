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
import { ArrowUpDown, MoreVertical, Plus } from 'lucide-react'
import { SortableAgrupamentoRow } from './sortable-agrupamento-row'
import type { AgrupamentoWithCount } from '@/lib/supabase/queries/agrupamentos'

interface AgrupamentosTableProps {
  agrupamentos: AgrupamentoWithCount[]
  obraNome: string
  onCreateClick: () => void
  onEditClick: (agrupamento: AgrupamentoWithCount) => void
  onDeleteClick: (agrupamento: AgrupamentoWithCount) => void
  isReorderMode: boolean
  onReorderStart: () => void
  onReorderSave: (orderedIds: string[]) => void
  onReorderCancel: () => void
}

export function AgrupamentosTable({
  agrupamentos,
  obraNome,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  isReorderMode,
  onReorderStart,
  onReorderSave,
  onReorderCancel,
}: AgrupamentosTableProps) {
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

      {/* Table / Empty State */}
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
        <div className="rounded-md border border-border bg-surface-100">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40px]"></TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-[120px]">Unidades</TableHead>
                </TableRow>
              </TableHeader>
              <SortableContext
                items={pendingOrder}
                strategy={verticalListSortingStrategy}
              >
                <TableBody>
                  {orderedAgrupamentos.map((agrupamento) => (
                    <SortableAgrupamentoRow
                      key={agrupamento.id}
                      id={agrupamento.id}
                      agrupamento={agrupamento}
                    />
                  ))}
                </TableBody>
              </SortableContext>
            </Table>
          </DndContext>
        </div>
      ) : (
        <div className="rounded-md border border-border bg-surface-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="w-[120px]">Unidades</TableHead>
                <TableHead className="w-[50px]">Ações</TableHead>
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
