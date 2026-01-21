'use client'

import * as React from 'react'
import { TableHead } from '@/components/ui/table'
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SortDirection = 'asc' | 'desc'

export interface SortableTableHeaderProps<T extends string> {
  field: T
  currentField: T | null
  currentDirection: SortDirection
  onSort: (field: T) => void
  children: React.ReactNode
  className?: string
}

export function SortableTableHeader<T extends string>({
  field,
  currentField,
  currentDirection,
  onSort,
  children,
  className,
}: SortableTableHeaderProps<T>) {
  const isActive = field === currentField

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className="group flex items-center gap-1 hover:text-foreground transition-colors -ml-1 px-1 py-0.5 rounded"
      >
        {children}
        <span
          className={cn(
            'transition-opacity',
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
          )}
        >
          {isActive ? (
            currentDirection === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5" />
          )}
        </span>
      </button>
    </TableHead>
  )
}

/**
 * Hook to manage sort state for tables
 */
export function useSortState<T extends string>(
  defaultField: T,
  defaultDirection: SortDirection = 'asc'
) {
  const [sortField, setSortField] = React.useState<T>(defaultField)
  const [sortDirection, setSortDirection] = React.useState<SortDirection>(defaultDirection)

  const handleSort = React.useCallback((field: T) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField])

  return {
    sortField,
    sortDirection,
    handleSort,
  }
}

/**
 * Generic sort function for arrays
 */
export function sortItems<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T,
  direction: SortDirection,
  options?: { locale?: string }
): T[] {
  const locale = options?.locale ?? 'pt-BR'

  return [...items].sort((a, b) => {
    const aVal = a[field]
    const bVal = b[field]

    // Handle nulls/undefined
    if (aVal == null && bVal == null) return 0
    if (aVal == null) return direction === 'asc' ? -1 : 1
    if (bVal == null) return direction === 'asc' ? 1 : -1

    // Compare strings with locale
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      const comparison = aVal.localeCompare(bVal, locale, { numeric: true })
      return direction === 'asc' ? comparison : -comparison
    }

    // Compare numbers/dates
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}
