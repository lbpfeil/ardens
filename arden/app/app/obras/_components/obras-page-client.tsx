'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ObrasTable } from './obras-table'
import { ObraFormModal } from './obra-form-modal'
import { ArchiveConfirmation } from './archive-confirmation'
import type { Obra } from '@/lib/supabase/queries/obras'

interface ObrasPageClientProps {
  initialObras: Obra[]
}

export function ObrasPageClient({ initialObras }: ObrasPageClientProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingObra, setEditingObra] = useState<Obra | null>(null)
  const [archivingObra, setArchivingObra] = useState<Obra | null>(null)

  const handleCreateClick = () => {
    setEditingObra(null)
    setIsModalOpen(true)
  }

  const handleEditClick = (obra: Obra) => {
    setEditingObra(obra)
    setIsModalOpen(true)
  }

  const handleArchiveClick = (obra: Obra) => {
    setArchivingObra(obra)
  }

  const handleModalClose = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setEditingObra(null)
    }
  }

  const handleModalSuccess = () => {
    setIsModalOpen(false)
    setEditingObra(null)
    router.refresh()
  }

  const handleArchiveClose = (open: boolean) => {
    if (!open) {
      setArchivingObra(null)
    }
  }

  const handleArchiveSuccess = () => {
    setArchivingObra(null)
    router.refresh()
  }

  return (
    <>
      <ObrasTable
        obras={initialObras}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onArchiveClick={handleArchiveClick}
      />
      <ObraFormModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        onSuccess={handleModalSuccess}
        mode={editingObra ? 'edit' : 'create'}
        obra={editingObra}
      />
      <ArchiveConfirmation
        open={archivingObra !== null}
        onOpenChange={handleArchiveClose}
        obra={archivingObra}
        onSuccess={handleArchiveSuccess}
      />
    </>
  )
}
