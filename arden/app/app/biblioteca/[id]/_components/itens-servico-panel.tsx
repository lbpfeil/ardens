'use client'

import { useMemo, useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus, ListChecks, MoreVertical, Trash2, GripVertical, ArrowUpDown, Undo2 } from 'lucide-react'
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
import {
  updateItemTag,
  updateItensOrder,
  type ItemServico,
} from '@/lib/supabase/queries/itens-servico'
import { updateTagsOrder, type Tag } from '@/lib/supabase/queries/tags'
import { TagSectionsReorderModal } from './tag-sections-reorder-modal'
import { toast } from 'sonner'

// Sortable item row component
interface SortableItemRowProps {
  item: ItemServico
  onEditClick: (item: ItemServico) => void
  onDeleteClick: (item: ItemServico) => void
  isDragMode: boolean
}

function SortableItemRow({ item, onEditClick, onDeleteClick, isDragMode }: SortableItemRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`group hover:bg-surface-200/50 ${isDragging ? 'opacity-50 bg-surface-200' : ''}`}
    >
      {isDragMode && (
        <TableCell className="w-[40px]">
          <button
            type="button"
            className="touch-none cursor-grab active:cursor-grabbing text-foreground-muted hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </TableCell>
      )}
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
      {!isDragMode && (
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
      )}
    </TableRow>
  )
}

interface ItensServicoPanelProps {
  itens: ItemServico[]
  tags: Tag[]
  servicoId: string
  onCreateClick: () => void
  onEditClick: (item: ItemServico) => void
  onDeleteClick: (item: ItemServico) => void
  onRefresh: () => void
}

interface GroupedItems {
  tagId: string  // 'untagged' for items without tag
  tag: Tag | null
  items: ItemServico[]
}

export function ItensServicoPanel({
  itens: initialItens,
  tags,
  servicoId,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  onRefresh,
}: ItensServicoPanelProps) {
  const [isDragMode, setIsDragMode] = useState(false)
  const [isTagReorderModalOpen, setIsTagReorderModalOpen] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)

  // Local state for optimistic updates
  const [localItens, setLocalItens] = useState<ItemServico[]>(initialItens)
  const [originalItens, setOriginalItens] = useState<ItemServico[]>([])
  const [hasChanges, setHasChanges] = useState(false)

  // Sync local state when prop changes (but not during drag mode)
  const itens = isDragMode ? localItens : initialItens

  // Enter drag mode - save original state
  const enterDragMode = () => {
    setLocalItens([...initialItens])
    setOriginalItens([...initialItens])
    setHasChanges(false)
    setIsDragMode(true)
  }

  // Exit drag mode - sync with server
  const exitDragMode = () => {
    setIsDragMode(false)
    setHasChanges(false)
    onRefresh() // Refresh to ensure consistency
  }

  // Revert changes
  const revertChanges = () => {
    setLocalItens([...originalItens])
    setHasChanges(false)
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px drag before activating
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Group items by tag
  const groupedItems = useMemo((): GroupedItems[] => {
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

    const result: GroupedItems[] = []

    if (untagged.length > 0) {
      result.push({
        tagId: 'untagged',
        tag: null,
        items: untagged.sort((a, b) => a.ordem - b.ordem),
      })
    }

    const sortedTags = [...tags].sort((a, b) => a.ordem - b.ordem)
    for (const tag of sortedTags) {
      const tagItems = byTag.get(tag.id)
      if (tagItems && tagItems.length > 0) {
        result.push({
          tagId: tag.id,
          tag,
          items: tagItems.sort((a, b) => a.ordem - b.ordem),
        })
      }
    }

    return result
  }, [itens, tags])

  // Find which group an item belongs to
  const findItemGroup = useCallback((itemId: string): string | null => {
    for (const group of groupedItems) {
      if (group.items.some(i => i.id === itemId)) {
        return group.tagId
      }
    }
    return null
  }, [groupedItems])

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeItemId = active.id as string
    const overItemId = over.id as string

    // Find source and destination groups
    const sourceGroupId = findItemGroup(activeItemId)
    const destGroupId = findItemGroup(overItemId)

    if (!sourceGroupId || !destGroupId) return

    // Same group - reorder within group
    if (sourceGroupId === destGroupId) {
      const group = groupedItems.find(g => g.tagId === sourceGroupId)
      if (!group) return

      const oldIndex = group.items.findIndex(i => i.id === activeItemId)
      const newIndex = group.items.findIndex(i => i.id === overItemId)

      if (oldIndex === newIndex) return

      // Calculate new order
      const newOrderedIds = [...group.items.map(i => i.id)]
      newOrderedIds.splice(oldIndex, 1)
      newOrderedIds.splice(newIndex, 0, activeItemId)

      // Optimistic update - update local state immediately
      const updatedItens = localItens.map(item => {
        const newOrdem = newOrderedIds.indexOf(item.id)
        if (newOrdem !== -1) {
          return { ...item, ordem: newOrdem }
        }
        return item
      })
      setLocalItens(updatedItens)
      setHasChanges(true)

      try {
        await updateItensOrder(servicoId, newOrderedIds)
      } catch (error) {
        toast.error('Erro ao reordenar itens')
        // Revert on error
        setLocalItens([...originalItens])
      }
    } else {
      // Different group - change tag
      const newTagId = destGroupId === 'untagged' ? null : destGroupId

      // Optimistic update
      const updatedItens = localItens.map(item =>
        item.id === activeItemId ? { ...item, tag_id: newTagId } : item
      )
      setLocalItens(updatedItens)
      setHasChanges(true)

      try {
        await updateItemTag(activeItemId, newTagId)
        toast.success('Item movido para outra tag')
      } catch (error) {
        toast.error('Erro ao mover item')
        // Revert on error
        setLocalItens([...originalItens])
      }
    }
  }

  const handleTagsReorderSave = async (reorderedTagIds: string[]) => {
    try {
      // Build full ordered list: include ALL tags, not just reordered ones
      // Tags not in the reordered list keep their relative positions
      const reorderedSet = new Set(reorderedTagIds)
      const tagsNotReordered = tags
        .filter(t => !reorderedSet.has(t.id))
        .sort((a, b) => a.ordem - b.ordem)

      // Interleave: reordered tags first, then others
      const fullOrderedIds = [...reorderedTagIds, ...tagsNotReordered.map(t => t.id)]

      await updateTagsOrder(fullOrderedIds)
      setIsTagReorderModalOpen(false)
      onRefresh()
      toast.success('Ordem das tags atualizada')
    } catch (error) {
      toast.error('Erro ao reordenar tags')
    }
  }

  const activeItem = activeId ? itens.find(i => i.id === activeId) : null

  // Empty state
  if (itens.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-foreground">
            Itens de Verificação
          </h2>
          <Button onClick={onCreateClick}>
            <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
            Novo Item
          </Button>
        </div>

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
        <div className="flex items-center gap-2">
          {isDragMode ? (
            <>
              {hasChanges && (
                <Button variant="ghost" onClick={revertChanges}>
                  <Undo2 className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                  Reverter
                </Button>
              )}
              <Button variant="outline" onClick={exitDragMode}>
                Concluir
              </Button>
            </>
          ) : (
            <>
              {tags.length > 1 && (
                <Button variant="outline" onClick={() => setIsTagReorderModalOpen(true)}>
                  <ArrowUpDown className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                  Reordenar Tags
                </Button>
              )}
              {itens.length > 1 && (
                <Button variant="outline" onClick={enterDragMode}>
                  <GripVertical className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                  Organizar
                </Button>
              )}
              <Button onClick={onCreateClick}>
                <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
                Novo Item
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Drag mode instruction */}
      {isDragMode && (
        <div className="flex items-center gap-2 p-3 rounded-md bg-surface-100 border border-border">
          <GripVertical className="h-4 w-4 text-foreground-muted" />
          <span className="text-sm text-foreground-light">
            Arraste itens para reordenar ou mover entre tags
          </span>
        </div>
      )}

      {/* Grouped items with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          {groupedItems.map((group, groupIndex) => (
            <SortableContext
              key={group.tagId}
              items={group.items.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="rounded-md border border-border bg-surface-100 overflow-hidden">
                {/* Tag header (only for tagged groups) */}
                {group.tag && (
                  <div
                    className="flex items-center gap-2 px-3 py-2 border-b border-border"
                    style={{ borderLeftWidth: '3px', borderLeftColor: group.tag.cor }}
                  >
                    <span className="text-sm font-medium text-foreground">
                      {group.tag.nome}
                    </span>
                  </div>
                )}

                <Table>
                  {groupIndex === 0 && (
                    <TableHeader>
                      <TableRow>
                        {isDragMode && <TableHead className="w-[40px]"></TableHead>}
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Observação</TableHead>
                        <TableHead className="hidden md:table-cell">Método</TableHead>
                        {!isDragMode && <TableHead className="w-[50px]">Ações</TableHead>}
                      </TableRow>
                    </TableHeader>
                  )}
                  <TableBody>
                    {group.items.map((item) => (
                      <SortableItemRow
                        key={item.id}
                        item={item}
                        onEditClick={onEditClick}
                        onDeleteClick={onDeleteClick}
                        isDragMode={isDragMode}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            </SortableContext>
          ))}
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeItem ? (
            <div className="bg-surface-100 border border-border rounded px-3 py-2 shadow-lg">
              <span className="text-sm font-medium text-foreground">
                {activeItem.observacao.slice(0, 50)}
                {activeItem.observacao.length > 50 ? '...' : ''}
              </span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Tag sections reorder modal */}
      <TagSectionsReorderModal
        open={isTagReorderModalOpen}
        onOpenChange={setIsTagReorderModalOpen}
        tags={tags.filter(t => itens.some(i => i.tag_id === t.id))} // Only tags with items
        onSave={handleTagsReorderSave}
      />
    </div>
  )
}
