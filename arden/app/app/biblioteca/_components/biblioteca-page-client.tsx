'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ServicosTable } from './servicos-table'
import { ServicoFormModal } from './servico-form-modal'
import { ArchiveConfirmation } from './archive-confirmation'
import type { Servico } from '@/lib/supabase/queries/servicos'

interface BibliotecaPageClientProps {
  initialServicos: Servico[]
}

export function BibliotecaPageClient({ initialServicos }: BibliotecaPageClientProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingServico, setEditingServico] = useState<Servico | null>(null)
  const [archivingServico, setArchivingServico] = useState<Servico | null>(null)

  const handleCreateClick = () => {
    setEditingServico(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (servico: Servico) => {
    setEditingServico(servico)
    setIsModalOpen(true)
  }

  const handleArchiveClick = (servico: Servico) => {
    setArchivingServico(servico)
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setEditingServico(null)
    }
  }

  const handleModalSuccess = () => {
    setIsModalOpen(false)
    setEditingServico(null)
    router.refresh()
  }

  const handleArchiveClose = (open: boolean) => {
    if (!open) {
      setArchivingServico(null)
    }
  }

  const handleArchiveSuccess = () => {
    setArchivingServico(null)
    router.refresh()
  }

  return (
    <>
      <ServicosTable
        servicos={initialServicos}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onArchiveClick={handleArchiveClick}
      />
      <ServicoFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={handleModalSuccess}
        mode={editingServico ? 'edit' : 'create'}
        servico={editingServico}
      />
      <ArchiveConfirmation
        open={archivingServico !== null}
        onOpenChange={handleArchiveClose}
        servico={archivingServico}
        onSuccess={handleArchiveSuccess}
      />
    </>
  )
}
