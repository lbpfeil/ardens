'use client'

import {
  LayoutDashboard,
  Wrench,
  Building2,
  ClipboardCheck,
  AlertTriangle,
  FileText,
  Users,
  Settings,
} from 'lucide-react'
import { SidebarItem } from './sidebar-item'
import { StatusIndicator } from './status-indicator'
import { BackToGlobal } from './back-to-global'
import { Separator } from '@/components/ui/separator'

interface SidebarObraProps {
  obraId: string
  expanded: boolean
}

function getObraNavItems(obraId: string) {
  return {
    overview: [
      { icon: LayoutDashboard, label: 'Dashboard', href: `/app/obras/${obraId}`, exact: true },
    ],
    operacao: [
      { icon: Wrench, label: 'Serviços', href: `/app/obras/${obraId}/servicos` },
      { icon: Building2, label: 'Unidades', href: `/app/obras/${obraId}/unidades` },
      { icon: ClipboardCheck, label: 'Verificações', href: `/app/obras/${obraId}/verificacoes`, badge: 'Em breve' },
      { icon: AlertTriangle, label: 'NCs', href: `/app/obras/${obraId}/ncs`, badge: 'Em breve' },
    ],
    admin: [
      { icon: FileText, label: 'Relatórios', href: `/app/obras/${obraId}/relatorios`, badge: 'Em breve' },
      { icon: Users, label: 'Equipe', href: `/app/obras/${obraId}/equipe`, badge: 'Em breve' },
      { icon: Settings, label: 'Configurações', href: `/app/obras/${obraId}/configuracoes`, badge: 'Em breve' },
    ],
  }
}

function SectionLabel({ label, expanded }: { label: string; expanded: boolean }) {
  if (!expanded) return null
  return (
    <span className="px-2 py-1 text-[10px] font-medium text-foreground-muted uppercase tracking-wider">
      {label}
    </span>
  )
}

export function SidebarObra({ obraId, expanded }: SidebarObraProps) {
  const navItems = getObraNavItems(obraId)

  return (
    <>
      {/* Main nav items */}
      <nav className="flex-1 py-2">
        {/* Overview section */}
        <ul className="space-y-1 px-2">
          {navItems.overview.map((item) => (
            <li key={item.href}>
              <SidebarItem
                href={item.href}
                icon={item.icon}
                label={item.label}
                expanded={expanded}
                exact={item.exact}
              />
            </li>
          ))}
        </ul>

        <Separator className="my-2 mx-2" />

        {/* Operacao section */}
        <div className="px-2">
          <SectionLabel label="Operação" expanded={expanded} />
        </div>
        <ul className="space-y-1 px-2">
          {navItems.operacao.map((item) => (
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

        <Separator className="my-2 mx-2" />

        {/* Admin section */}
        <div className="px-2">
          <SectionLabel label="Admin" expanded={expanded} />
        </div>
        <ul className="space-y-1 px-2">
          {navItems.admin.map((item) => (
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

      {/* Back to global */}
      <nav className="border-t border-border py-2">
        <div className="px-2">
          <BackToGlobal expanded={expanded} />
        </div>
      </nav>
    </>
  )
}
