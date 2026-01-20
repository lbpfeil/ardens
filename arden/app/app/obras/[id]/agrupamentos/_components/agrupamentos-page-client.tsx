'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AgrupamentosTable } from './agrupamentos-table'
import { AgrupamentoFormModal } from './agrupamento-form-modal'
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

  const handleCreateClick = () => {
    setEditingAgrupamento(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (agrupamento: AgrupamentoWithCount) => {
    setEditingAgrupamento(agrupamento)
    setIsModalOpen(true)
  }

  const handleDeleteClick = (agrupamento: AgrupamentoWithCount) => {
    // TODO: Implement delete confirmation in Plan 03
    console.log('Delete requested for:', agrupamento.id)
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
    </>
  )
}
