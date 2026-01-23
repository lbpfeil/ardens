'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ServicoInfoPanel } from './servico-info-panel'
import { ItensServicoPanel } from './itens-servico-panel'
import { ItemServicoFormModal } from './item-servico-form-modal'
import { ItemDeleteConfirmation } from './item-delete-confirmation'
import { RevisionHistoryPanel } from './revision-history-panel'
import { ServicoFormModal } from '../../_components/servico-form-modal'
import type { Servico } from '@/lib/supabase/queries/servicos'
import { listItensServico, type ItemServico } from '@/lib/supabase/queries/itens-servico'
import type { Tag } from '@/lib/supabase/queries/tags'
import { listServicoRevisoes, type ServicoRevisao } from '@/lib/supabase/queries/servico-revisoes'

interface ServicoDetailClientProps {
  servico: Servico
  initialItens: ItemServico[]
  tags: Tag[]
}

export function ServicoDetailClient({ servico, initialItens, tags }: ServicoDetailClientProps) {
  const router = useRouter()

  // Itens state for refresh capability
  const [itens, setItens] = useState<ItemServico[]>(initialItens)

  // Revision history state
  const [revisoes, setRevisoes] = useState<ServicoRevisao[]>([])
  const [isLoadingRevisoes, setIsLoadingRevisoes] = useState(true)

  // Load revision history
  const loadRevisoes = useCallback(async () => {
    setIsLoadingRevisoes(true)
    try {
      const data = await listServicoRevisoes(servico.id)
      setRevisoes(data)
    } catch (error) {
      console.error('Error loading revisoes:', error)
    } finally {
      setIsLoadingRevisoes(false)
    }
  }, [servico.id])

  // Refresh itens (used after drag-and-drop operations)
  const refreshItens = useCallback(async () => {
    try {
      const updated = await listItensServico(servico.id)
      setItens(updated)
    } catch (error) {
      console.error('Error refreshing itens:', error)
    }
  }, [servico.id])

  // Load revisions on mount
  useEffect(() => {
    loadRevisoes()
  }, [loadRevisoes])

  // Servico edit modal state
  const [isServicoModalOpen, setIsServicoModalOpen] = useState(false)

  // Item modal state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ItemServico | null>(null)

  // Delete confirmation state
  const [deletingItem, setDeletingItem] = useState<ItemServico | null>(null)

  // Handlers for servico
  const handleServicoEditClick = () => {
    setIsServicoModalOpen(true)
  }

  const handleServicoModalClose = (open: boolean) => {
    setIsServicoModalOpen(open)
  }

  const handleServicoModalSuccess = () => {
    setIsServicoModalOpen(false)
    router.refresh()
    // Reload revisions to show new entry
    loadRevisoes()
  }

  // Handlers for itens
  const handleCreateItemClick = () => {
    setEditingItem(null)
    setIsItemModalOpen(true)
  }

  const handleEditItemClick = (item: ItemServico) => {
    setEditingItem(item)
    setIsItemModalOpen(true)
  }

  const handleDeleteItemClick = (item: ItemServico) => {
    setDeletingItem(item)
  }

  const handleItemModalClose = (open: boolean) => {
    setIsItemModalOpen(open)
    if (!open) {
      setEditingItem(null)
    }
  }

  const handleItemModalSuccess = async () => {
    setIsItemModalOpen(false)
    setEditingItem(null)
    await refreshItens()
  }

  const handleDeleteConfirmationClose = (open: boolean) => {
    if (!open) {
      setDeletingItem(null)
    }
  }

  const handleDeleteSuccess = async () => {
    setDeletingItem(null)
    await refreshItens()
  }

  return (
    <>
      {/* Split view layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column: Info + History */}
        <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-6">
          <ServicoInfoPanel servico={servico} onEditClick={handleServicoEditClick} />
          <RevisionHistoryPanel
            revisoes={revisoes}
            isLoading={isLoadingRevisoes}
          />
        </div>

        {/* Right panel: Itens de verificação */}
        <div className="flex-1 min-w-0">
          <ItensServicoPanel
            itens={itens}
            tags={tags}
            servicoId={servico.id}
            onCreateClick={handleCreateItemClick}
            onEditClick={handleEditItemClick}
            onDeleteClick={handleDeleteItemClick}
            onRefresh={refreshItens}
          />
        </div>
      </div>

      {/* Servico edit modal */}
      <ServicoFormModal
        open={isServicoModalOpen}
        onOpenChange={handleServicoModalClose}
        onSuccess={handleServicoModalSuccess}
        mode="edit"
        servico={servico}
      />

      {/* Item create/edit modal */}
      <ItemServicoFormModal
        open={isItemModalOpen}
        onOpenChange={handleItemModalClose}
        onSuccess={handleItemModalSuccess}
        servicoId={servico.id}
        mode={editingItem ? 'edit' : 'create'}
        item={editingItem}
        tags={tags}
      />

      {/* Item delete confirmation */}
      <ItemDeleteConfirmation
        open={deletingItem !== null}
        onOpenChange={handleDeleteConfirmationClose}
        item={deletingItem}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
