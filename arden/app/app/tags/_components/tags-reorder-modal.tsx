'use client'

import { useState, useEffect } from 'react'
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
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { GripVertical } from 'lucide-react'
import type { Tag } from '@/lib/supabase/queries/tags'

interface SortableTagItemProps {
  tag: Tag
}

function SortableTagItem({ tag }: SortableTagItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tag.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 px-3 py-2.5 bg-surface-100 border border-border rounded-md ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <button
        type="button"
        className="touch-none cursor-grab active:cursor-grabbing text-foreground-muted hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div
        className="h-4 w-4 rounded-sm flex-shrink-0"
        style={{ backgroundColor: tag.cor }}
      />
      <span className="text-foreground text-sm">{tag.nome}</span>
    </li>
  )
}

interface TagsReorderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tags: Tag[]
  onSave: (orderedIds: string[]) => Promise<void>
}

export function TagsReorderModal({
  open,
  onOpenChange,
  tags,
  onSave,
}: TagsReorderModalProps) {
  const [pendingOrder, setPendingOrder] = useState<string[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Initialize order when modal opens
  useEffect(() => {
    if (open) {
      setPendingOrder(tags.map(t => t.id))
    }
  }, [open, tags])

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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave(pendingOrder)
    } finally {
      setIsSaving(false)
    }
  }

  // Get tags in pending order
  const orderedTags = pendingOrder
    .map(id => tags.find(t => t.id === id))
    .filter((t): t is Tag => t !== undefined)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Reordenar Tags</DialogTitle>
          <DialogDescription>
            Arraste para definir a ordem de exibição das tags.
          </DialogDescription>
        </DialogHeader>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pendingOrder}
            strategy={verticalListSortingStrategy}
          >
            <ul className="space-y-2 max-h-[300px] overflow-y-auto py-2">
              {orderedTags.map((tag) => (
                <SortableTagItem key={tag.id} tag={tag} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Ordem'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
