'use client'

import { cn } from '@/lib/utils'

interface StatusIndicatorProps {
  expanded: boolean
}

export function StatusIndicator({ expanded }: StatusIndicatorProps) {
  // TODO: Implement real connection detection (navigator.onLine, Supabase realtime status)
  const isOnline = true

  return (
    <div className="px-2 py-2">
      <div className="flex items-center gap-2 px-2">
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            isOnline ? 'bg-brand' : 'bg-destructive'
          )}
        />
        {expanded && (
          <span className="text-xs text-foreground-light">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        )}
      </div>
    </div>
  )
}
