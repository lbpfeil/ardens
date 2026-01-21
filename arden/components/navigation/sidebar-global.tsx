'use client'

import {
  Home,
  LayoutDashboard,
  Building2,
  Library,
  Users,
  Settings,
} from 'lucide-react'
import { SidebarItem } from './sidebar-item'
import { StatusIndicator } from './status-indicator'
import { Separator } from '@/components/ui/separator'

interface SidebarGlobalProps {
  expanded: boolean
}

const globalNavItems = [
  { icon: Home, label: 'Home', href: '/app', exact: true },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/app/dashboard', badge: 'Em breve' },
  { icon: Building2, label: 'Obras', href: '/app/obras' },
  { icon: Library, label: 'Biblioteca FVS', href: '/app/biblioteca', badge: 'Em breve' },
]

const secondaryNavItems = [
  { icon: Users, label: 'Usuarios', href: '/app/usuarios', badge: 'Em breve' },
]

const bottomNavItems = [
  { icon: Settings, label: 'Configuracoes', href: '/app/configuracoes', badge: 'Em breve' },
]

export function SidebarGlobal({ expanded }: SidebarGlobalProps) {
  return (
    <>
      {/* Main nav items */}
      <nav className="flex-1 py-2">
        <ul className="space-y-1 px-2">
          {globalNavItems.map((item) => (
            <li key={item.href}>
              <SidebarItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                expanded={expanded}
                badge={item.badge}
                exact={item.exact}
              />
            </li>
          ))}
        </ul>

        <Separator className="my-2 mx-2" />

        <ul className="space-y-1 px-2">
          {secondaryNavItems.map((item) => (
            <li key={item.href}>
              <SidebarItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                expanded={expanded}
                badge={item.badge}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Status indicator */}
      <StatusIndicator expanded={expanded} />

      {/* Bottom nav items */}
      <nav className="border-t border-border py-2">
        <ul className="space-y-1 px-2">
          {bottomNavItems.map((item) => (
            <li key={item.href}>
              <SidebarItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                expanded={expanded}
                badge={item.badge}
              />
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
