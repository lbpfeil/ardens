'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ObrasTable } from './obras-table'
import type { Obra } from '@/lib/supabase/queries/obras'

interface ObrasPageClientProps {
  initialObras: Obra[]
}

export function ObrasPageClient({ initialObras }: ObrasPageClientProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateClick = () => {
    setIsModalOpen(true)
  }

  const handleModalSuccess = () => {
    setIsModalOpen(false)
    router.refresh()
  }

  return (
    <>
      <ObrasTable obras={initialObras} onCreateClick={handleCreateClick} />
      {/* ObraFormModal will be added in Task 2 */}
      {/* Placeholder for modal - controlled by isModalOpen state */}
    </>
  )
}
