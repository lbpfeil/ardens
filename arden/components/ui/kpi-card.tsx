import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: string | number
  description?: string
  loading?: boolean
  className?: string
}

export function KPICard({ title, value, description, loading, className }: KPICardProps) {
  if (loading) {
    return (
      <div className={cn('rounded-lg border border-border bg-surface-100 p-4', className)}>
        <div className="h-3 w-24 bg-surface-200 rounded animate-pulse" />
        <div className="h-7 w-16 bg-surface-200 rounded animate-pulse mt-2" />
        {description && <div className="h-3 w-32 bg-surface-200 rounded animate-pulse mt-2" />}
      </div>
    )
  }

  return (
    <div className={cn('rounded-lg border border-border bg-surface-100 p-4', className)}>
      <p className="text-xs text-foreground-muted uppercase tracking-wide">{title}</p>
      <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
      {description && (
        <p className="text-xs text-foreground-muted mt-1">{description}</p>
      )}
    </div>
  )
}
