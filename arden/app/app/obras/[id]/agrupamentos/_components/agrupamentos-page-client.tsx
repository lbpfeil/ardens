'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AgrupamentosTable } from './agrupamentos-table'
import { AgrupamentoFormModal } from './agrupamento-form-modal'
import { DeleteConfirmation } from './delete-confirmation'
import type { AgrupamentoWithCount } from '@/lib/supabase/queries/agrupamentos'

interface AgrupamentosPageClientProps {
  obraId: string
  obraNome: string
  initialAgrupamentos: AgrupamentoWithCount[]
}

export function AgrupamentosPageClient({
  obraId,
  obraNome,
  initialAgrupamentos,
}: AgrupamentosPageClientProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgrupamento, setEditingAgrupamento] = useState<AgrupamentoWithCount | null>(null)
  const [deletingAgrupamento, setDeletingAgrupamento] = useState<AgrupamentoWithCount | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const handleCreateClick = () => {
    setEditingAgrupamento(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (agrupamento: AgrupamentoWithCount) => {
    setEditingAgrupamento(agrupamento)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (agrupamento: AgrupamentoWithCount) => {
    setDeletingAgrupamento(agrupamento)
    setIsDeleteOpen(true)
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setEditingAgrupamento(null)
    }
  }

  const handleModalSuccess = () => {
    setIsModalOpen(false)
    setEditingAgrupamento(null)
    router.refresh()
  }

  const handleDeleteClose = (open: boolean) => {
    setIsDeleteOpen(open)
    if (!open) {
      setDeletingAgrupamento(null)
    }
  }

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false)
    setDeletingAgrupamento(null)
    router.refresh()
  }

  return (
    <>
      <AgrupamentosTable
        agrupamentos={initialAgrupamentos}
        obraNome={obraNome}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onDeleteClick={handleDeleteClick}
      />
      <AgrupamentoFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={handleModalSuccess}
        mode={editingAgrupamento ? 'edit' : 'create'}
        agrupamento={editingAgrupamento}
        obraId={obraId}
      />
      <DeleteConfirmation
        open={isDeleteOpen}
        onOpenChange={handleDeleteClose}
        agrupamento={deletingAgrupamento}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
