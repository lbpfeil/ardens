'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'

interface BreadcrumbProps {
  obraName?: string | null
}

const sectionLabels: Record<string, string> = {
  unidades: 'Unidades',
  servicos: 'Servicos',
  verificacoes: 'Verificacoes',
  ncs: 'Nao-Conformidades',
  relatorios: 'Relatorios',
  equipe: 'Equipe',
  configuracoes: 'Configuracoes',
}

interface BreadcrumbItem {
  label: string
  href?: string
}

export function Breadcrumb({ obraName }: BreadcrumbProps) {
  const pathname = usePathname()
  const params = useParams<{ id?: string }>()

  // TODO: Get construtora name from auth context
  const construtoraName = 'Pfeil'

  const crumbs: BreadcrumbItem[] = []

  // Always add construtora as first crumb
  crumbs.push({
    label: construtoraName,
    href: '/app',
  })

  // If we're in an obra context
  if (params.id && obraName) {
    crumbs.push({
      label: obraName,
      href: `/app/obras/${params.id}`,
    })

    // Check for section in pathname
    const pathSegments = pathname.split('/').filter(Boolean)
    // Expected: ['app', 'obras', '{id}', '{section}']
    const sectionIndex = pathSegments.indexOf(params.id) + 1
    const section = pathSegments[sectionIndex]

    if (section && sectionLabels[section]) {
      crumbs.push({
        label: sectionLabels[section],
        // No href for current page (last crumb)
      })
    }
  }

  // Last crumb has no href (current page)
  if (crumbs.length > 0) {
    delete crumbs[crumbs.length - 1].href
  }

  return (
    <nav className="flex items-center text-sm">
      {crumbs.map((crumb, index) => (
        <span key={index} className="flex items-center">
          {index > 0 && (
            <span className="text-foreground-muted mx-1">/</span>
          )}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className="text-foreground-light hover:text-foreground px-1 transition-colors"
            >
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground px-1">
              {crumb.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
