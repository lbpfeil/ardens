import { ArrowUp, ArrowDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  previousValue?: number // For trend calculation
  format?: 'percent' | 'number' // How to format value
  description?: string
  loading?: boolean
  className?: string
}

/**
 * Format value based on format prop
 */
function formatValue(value: string | number, format?: 'percent' | 'number'): string {
  if (typeof value === 'string') {
    return value
  }

  if (format === 'percent') {
    return `${value}%`
  }

  return String(value)
}

/**
 * Calculate trend percentage
 * Returns null if previous value is 0 or undefined
 */
function calculateTrend(current: number, previous?: number): number | null {
  if (previous === undefined || previous === 0) {
    return null
  }

  return ((current - previous) / previous) * 100
}

export function KPICard({
  title,
  value,
  previousValue,
  format,
  description,
  loading,
  className
}: KPICardProps) {
  if (loading) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface-100 p-4', className)}>
        <div className="h-3 w-24 bg-surface-200 rounded animate-pulse" />
        <div className="h-7 w-16 bg-surface-200 rounded animate-pulse mt-2" />
        {description && <div className="h-3 w-32 bg-surface-200 rounded animate-pulse mt-2" />}
      </div>
    )
  }

  // Get numeric value for trend calculation
  const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value

  // Calculate trend when previousValue is provided
  const trend = previousValue !== undefined ? calculateTrend(numericValue, previousValue) : null

  // Determine trend direction
  const isPositive = trend !== null && trend > 0
  const isNegative = trend !== null && trend < 0
  const isNeutral = trend !== null && trend === 0

  return (
    <div className={cn('rounded-lg border border-border bg-surface-100 p-4', className)}>
      <p className="text-xs text-foreground-muted uppercase tracking-wide">{title}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <p className="text-2xl font-semibold text-foreground">
          {formatValue(value, format)}
        </p>
        {trend !== null && (
          <span
            className={cn(
              'text-xs flex items-center gap-0.5',
              isPositive && 'text-brand',
              isNegative && 'text-destructive',
              isNeutral && 'text-foreground-muted'
            )}
          >
            {isPositive && <ArrowUp className="h-3 w-3" />}
            {isNegative && <ArrowDown className="h-3 w-3" />}
            {isNeutral && <Minus className="h-3 w-3" />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-foreground-muted mt-1">{description}</p>
      )}
    </div>
  )
}
