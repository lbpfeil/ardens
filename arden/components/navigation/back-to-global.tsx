'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackToGlobalProps {
  expanded: boolean
}

export function BackToGlobal({ expanded }: BackToGlobalProps) {
  return (
    <Link
      href="/app/obras"
      className={cn(
        'flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors',
        'text-foreground-light hover:text-foreground hover:bg-surface-100'
      )}
    >
      <ArrowLeft className="w-4 h-4 shrink-0" />
      {expanded && <span className="truncate">Visao Global</span>}
    </Link>
  )
}
