'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SplitViewLayout } from './split-view-layout'
import { AgrupamentosPanel } from './agrupamentos-panel'
import { UnidadesPanel } from './unidades-panel'
import { AgrupamentoFormModal } from './agrupamento-form-modal'
import { DeleteConfirmation } from './delete-confirmation'
import { UnidadeFormModal } from './unidade-form-modal'
import { UnidadeDeleteConfirmation } from './unidade-delete-confirmation'
import { updateAgrupamentosOrder } from '@/lib/supabase/queries/agrupamentos'
import type { AgrupamentoWithCount } from '@/lib/supabase/queries/agrupamentos'
import type { Unidade } from '@/lib/supabase/queries/unidades'
import { toast } from 'sonner'

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

  // Agrupamento state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAgrupamento, setEditingAgrupamento] = useState<AgrupamentoWithCount | null>(null)
  const [deletingAgrupamento, setDeletingAgrupamento] = useState<AgrupamentoWithCount | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isReorderMode, setIsReorderMode] = useState(false)
  const [selectedAgrupamentoId, setSelectedAgrupamentoId] = useState<string | null>(null)

  // Unidade state
  const [isUnidadeModalOpen, setIsUnidadeModalOpen] = useState(false)
  const [editingUnidade, setEditingUnidade] = useState<Unidade | null>(null)
  const [deletingUnidade, setDeletingUnidade] = useState<Unidade | null>(null)
  const [isUnidadeDeleteOpen, setIsUnidadeDeleteOpen] = useState(false)
  const [unidadesRefreshKey, setUnidadesRefreshKey] = useState(0)

  // Get selected agrupamento object
  const selectedAgrupamento = selectedAgrupamentoId
    ? initialAgrupamentos.find(a => a.id === selectedAgrupamentoId) ?? null
    : null

  // Agrupamento handlers
  const handleSelectAgrupamento = (id: string) => {
    setSelectedAgrupamentoId(id)
  }

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
    // Clear selection if deleted agrupamento was selected
    if (deletingAgrupamento?.id === selectedAgrupamentoId) {
      setSelectedAgrupamentoId(null)
    }
    router.refresh()
  }

  const handleReorderStart = () => {
    setIsReorderMode(true)
  }

  const handleReorderSave = async (orderedIds: string[]) => {
    try {
      await updateAgrupamentosOrder(obraId, orderedIds)
      toast.success('Ordem salva com sucesso')
      setIsReorderMode(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar ordem')
    }
  }

  const handleReorderCancel = () => {
    setIsReorderMode(false)
  }

  // Unidade handlers
  const handleUnidadeCreateClick = () => {
    setEditingUnidade(null)
    setIsUnidadeModalOpen(true)
  }

  const handleUnidadeEditClick = (unidade: Unidade) => {
    setEditingUnidade(unidade)
    setIsUnidadeModalOpen(true)
  }

  const handleUnidadeDeleteClick = (unidade: Unidade) => {
    setDeletingUnidade(unidade)
    setIsUnidadeDeleteOpen(true)
  }

  const handleUnidadeModalClose = (open: boolean) => {
    setIsUnidadeModalOpen(open)
    if (!open) {
      setEditingUnidade(null)
    }
  }

  const handleUnidadeModalSuccess = () => {
    setIsUnidadeModalOpen(false)
    setEditingUnidade(null)
    setUnidadesRefreshKey(k => k + 1)
    router.refresh() // Also refresh to update unidades_count
  }

  const handleUnidadeDeleteClose = (open: boolean) => {
    setIsUnidadeDeleteOpen(open)
    if (!open) {
      setDeletingUnidade(null)
    }
  }

  const handleUnidadeDeleteSuccess = () => {
    setIsUnidadeDeleteOpen(false)
    setDeletingUnidade(null)
    setUnidadesRefreshKey(k => k + 1)
    router.refresh() // Also refresh to update unidades_count
  }

  return (
    <>
      <SplitViewLayout
        leftPanel={
          <AgrupamentosPanel
            agrupamentos={initialAgrupamentos}
            obraNome={obraNome}
            selectedId={selectedAgrupamentoId}
            onSelect={handleSelectAgrupamento}
            onCreateClick={handleCreateClick}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
            isReorderMode={isReorderMode}
            onReorderStart={handleReorderStart}
            onReorderSave={handleReorderSave}
            onReorderCancel={handleReorderCancel}
          />
        }
        rightPanel={
          <UnidadesPanel
            agrupamento={selectedAgrupamento}
            onCreateClick={handleUnidadeCreateClick}
            onEditClick={handleUnidadeEditClick}
            onDeleteClick={handleUnidadeDeleteClick}
            refreshKey={unidadesRefreshKey}
          />
        }
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
      <UnidadeFormModal
        open={isUnidadeModalOpen}
        onOpenChange={handleUnidadeModalClose}
        onSuccess={handleUnidadeModalSuccess}
        mode={editingUnidade ? 'edit' : 'create'}
        unidade={editingUnidade}
        agrupamentoId={selectedAgrupamentoId ?? ''}
      />
      <UnidadeDeleteConfirmation
        open={isUnidadeDeleteOpen}
        onOpenChange={handleUnidadeDeleteClose}
        unidade={deletingUnidade}
        onSuccess={handleUnidadeDeleteSuccess}
      />
    </>
  )
}
