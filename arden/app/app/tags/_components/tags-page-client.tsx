'use client'

import { useState, useCallback } from 'react'
import { Tag, listTags, updateTagsOrder } from '@/lib/supabase/queries/tags'
import { Button } from '@/components/ui/button'
import { Plus, ArrowUpDown, Tags as TagsIcon, MoreVertical } from 'lucide-react'
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TagFormModal } from './tag-form-modal'
import { TagsReorderModal } from './tags-reorder-modal'
import { toast } from 'sonner'

interface TagsPageClientProps {
  initialTags: Tag[]
}

export function TagsPageClient({ initialTags }: TagsPageClientProps) {
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isReorderModalOpen, setIsReorderModalOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)

  const refreshTags = useCallback(async () => {
    const updated = await listTags()
    setTags(updated)
  }, [])

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
    refreshTags()
  }

  const handleEditSuccess = () => {
    setEditingTag(null)
    refreshTags()
  }

  const handleReorderSave = async (orderedIds: string[]) => {
    try {
      await updateTagsOrder(orderedIds)
      setIsReorderModalOpen(false)
      await refreshTags()
      toast.success('Ordem das tags atualizada')
    } catch (error) {
      toast.error('Erro ao atualizar ordem das tags')
    }
  }

  // Empty state
  if (tags.length === 0) {
    return (
      <>
        <div className="rounded-md border border-border bg-surface-100">
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <TagsIcon className="h-12 w-12 text-foreground-muted mb-4" />
            <p className="text-foreground-light mb-2">Nenhuma tag cadastrada</p>
            <p className="text-sm text-foreground-muted mb-4">
              Tags permitem agrupar itens de verificação por etapa ou categoria.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
              Criar primeira tag
            </Button>
          </div>
        </div>

        <TagFormModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSuccess={handleCreateSuccess}
          mode="create"
        />
      </>
    )
  }

  return (
    <>
      {/* Toolbar */}
      <div className="flex items-center justify-end gap-2 mb-4">
        {tags.length > 1 && (
          <Button variant="outline" onClick={() => setIsReorderModalOpen(true)}>
            <ArrowUpDown className="h-4 w-4 mr-1.5" data-icon="inline-start" />
            Reordenar
          </Button>
        )}
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
          Nova Tag
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-border bg-surface-100">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">Cor</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="w-[60px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id} className="group hover:bg-surface-200/50">
                <TableCell>
                  <div
                    className="h-6 w-6 rounded-md"
                    style={{ backgroundColor: tag.cor }}
                  />
                </TableCell>
                <TableCell>
                  <span className="font-medium text-foreground">{tag.nome}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTag(tag)}>
                        Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      <TagFormModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={handleCreateSuccess}
        mode="create"
      />

      <TagFormModal
        open={!!editingTag}
        onOpenChange={(open) => !open && setEditingTag(null)}
        onSuccess={handleEditSuccess}
        mode="edit"
        tag={editingTag}
      />

      <TagsReorderModal
        open={isReorderModalOpen}
        onOpenChange={setIsReorderModalOpen}
        tags={tags}
        onSave={handleReorderSave}
      />
    </>
  )
}
