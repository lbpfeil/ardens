'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

// Status filter types
export type StatusFilter = 'ativos' | 'arquivados' | 'todos'

export interface StatusTab {
  value: StatusFilter
  label: string
}

const defaultStatusTabs: StatusTab[] = [
  { value: 'ativos', label: 'Ativos' },
  { value: 'arquivados', label: 'Arquivados' },
  { value: 'todos', label: 'Todos' },
]

export interface ListPageToolbarProps {
  // Search
  searchPlaceholder?: string
  searchQuery: string
  onSearchChange: (query: string) => void

  // Status filter
  statusFilter: StatusFilter
  onStatusFilterChange: (filter: StatusFilter) => void
  statusTabs?: StatusTab[]

  // Primary action
  primaryActionLabel: string
  onPrimaryAction: () => void

  // Results info
  filteredCount: number
  totalCount: number
  itemLabel?: string // e.g., "servico", "obra"
}

export function ListPageToolbar({
  searchPlaceholder = 'Buscar...',
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  statusTabs = defaultStatusTabs,
  primaryActionLabel,
  onPrimaryAction,
  filteredCount,
  totalCount,
  itemLabel = 'item',
}: ListPageToolbarProps) {
  const pluralLabel = filteredCount !== 1 ? `${itemLabel}s` : itemLabel

  return (
    <div className="space-y-3">
      {/* Toolbar row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Search + Status tabs */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8 w-64"
            />
          </div>

          {/* Status tabs */}
          <div className="flex items-center gap-1 p-1 bg-surface-100 rounded-lg border border-border w-fit">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => onStatusFilterChange(tab.value)}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                  statusFilter === tab.value
                    ? 'bg-surface-200 text-foreground'
                    : 'text-foreground-light hover:text-foreground hover:bg-surface-200/50'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Primary action */}
        <Button onClick={onPrimaryAction}>
          <Plus className="h-4 w-4 mr-1.5" data-icon="inline-start" />
          {primaryActionLabel}
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-foreground-muted">
        {filteredCount === totalCount
          ? `${totalCount} ${pluralLabel}`
          : `${filteredCount} de ${totalCount} ${pluralLabel}`}
      </div>
    </div>
  )
}
