'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ServicoInfoPanel } from './servico-info-panel'
import { ItensServicoPanel } from './itens-servico-panel'
import { ItemServicoFormModal } from './item-servico-form-modal'
import { ItemDeleteConfirmation } from './item-delete-confirmation'
import { ServicoFormModal } from '../../_components/servico-form-modal'
import type { Servico } from '@/lib/supabase/queries/servicos'
import type { ItemServico } from '@/lib/supabase/queries/itens-servico'

interface ServicoDetailClientProps {
  servico: Servico
  initialItens: ItemServico[]
}

export function ServicoDetailClient({ servico, initialItens }: ServicoDetailClientProps) {
  const router = useRouter()

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

  const handleItemModalSuccess = () => {
    setIsItemModalOpen(false)
    setEditingItem(null)
    router.refresh()
  }

  const handleDeleteConfirmationClose = (open: boolean) => {
    if (!open) {
      setDeletingItem(null)
    }
  }

  const handleDeleteSuccess = () => {
    setDeletingItem(null)
    router.refresh()
  }

  return (
    <>
      {/* Split view layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left panel: Servico info */}
        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <ServicoInfoPanel servico={servico} onEditClick={handleServicoEditClick} />
        </div>

        {/* Right panel: Itens de verificacao */}
        <div className="flex-1 min-w-0">
          <ItensServicoPanel
            servico={servico}
            itens={initialItens}
            onCreateClick={handleCreateItemClick}
            onEditClick={handleEditItemClick}
            onDeleteClick={handleDeleteItemClick}
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
