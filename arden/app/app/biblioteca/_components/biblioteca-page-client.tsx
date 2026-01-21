'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ServicosTable } from './servicos-table'
import { ServicoFormModal } from './servico-form-modal'
import { ArchiveConfirmation } from './archive-confirmation'
import type { Servico } from '@/lib/supabase/queries/servicos'

export type StatusFilter = 'ativos' | 'arquivados' | 'todos'
export type SortField = 'codigo' | 'nome' | 'categoria' | 'created_at'
export type SortDirection = 'asc' | 'desc'

interface BibliotecaPageClientProps {
  initialServicos: Servico[]
}

export function BibliotecaPageClient({ initialServicos }: BibliotecaPageClientProps) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingServico, setEditingServico] = useState<Servico | null>(null)
  const [archivingServico, setArchivingServico] = useState<Servico | null>(null)

  // Filter and sort state
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ativos')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Filter and sort servicos
  const filteredServicos = useMemo(() => {
    let result = [...initialServicos]

    // Apply status filter
    if (statusFilter === 'ativos') {
      result = result.filter((s) => !s.arquivado)
    } else if (statusFilter === 'arquivados') {
      result = result.filter((s) => s.arquivado)
    }

    // Apply search filter (nome or codigo)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(
        (s) =>
          s.nome.toLowerCase().includes(query) || s.codigo.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      let aVal: string | null = null
      let bVal: string | null = null

      switch (sortField) {
        case 'codigo':
          aVal = a.codigo
          bVal = b.codigo
          break
        case 'nome':
          aVal = a.nome
          bVal = b.nome
          break
        case 'categoria':
          aVal = a.categoria
          bVal = b.categoria
          break
        case 'created_at':
          aVal = a.created_at
          bVal = b.created_at
          break
      }

      // Handle nulls
      if (aVal === null && bVal === null) return 0
      if (aVal === null) return sortDirection === 'asc' ? -1 : 1
      if (bVal === null) return sortDirection === 'asc' ? 1 : -1

      const comparison = aVal.localeCompare(bVal, 'pt-BR', { numeric: true })
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return result
  }, [initialServicos, statusFilter, searchQuery, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

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
        servicos={filteredServicos}
        onCreateClick={handleCreateClick}
        onEditClick={handleEditClick}
        onArchiveClick={handleArchiveClick}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        totalCount={initialServicos.length}
        hasActiveFilters={searchQuery.trim() !== '' || statusFilter !== 'ativos'}
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
