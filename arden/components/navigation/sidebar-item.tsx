'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarItemProps {
  href: string
  icon: LucideIcon
  label: string
  expanded: boolean
  badge?: string
  exact?: boolean
}

export function SidebarItem({
  href,
  icon: Icon,
  label,
  expanded,
  badge,
  exact = false,
}: SidebarItemProps) {
  const pathname = usePathname()

  const isActive = exact
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors',
        isActive
          ? 'bg-sidebar-accent text-foreground'
          : 'text-foreground-light hover:text-foreground hover:bg-surface-100'
      )}
    >
      <Icon className="w-4 h-4 shrink-0" />
      {expanded && (
        <>
          <span className="truncate">{label}</span>
          {badge && (
            <span className="text-xs bg-surface-200 px-1.5 py-0.5 rounded text-foreground-muted whitespace-nowrap ml-auto">
              {badge}
            </span>
          )}
        </>
      )}
    </Link>
  )
}
