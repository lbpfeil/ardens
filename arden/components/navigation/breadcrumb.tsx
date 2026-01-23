'use client'

import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getObra } from '@/lib/supabase/queries/obras'

const sectionLabels: Record<string, string> = {
  obras: 'Obras',
  biblioteca: 'Biblioteca FVS',
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

export function Breadcrumb() {
  const pathname = usePathname()
  const params = useParams<{ id?: string }>()
  const [obraName, setObraName] = useState<string | null>(null)

  // TODO: Get construtora name from auth context
  const construtoraName = 'Pfeil'

  // Fetch obra name when in obra context
  useEffect(() => {
    if (params.id) {
      getObra(params.id)
        .then((obra) => setObraName(obra.nome))
        .catch(() => setObraName(null))
    } else {
      setObraName(null)
    }
  }, [params.id])

  const crumbs: BreadcrumbItem[] = []

  // Always add construtora as first crumb
  crumbs.push({
    label: construtoraName,
    href: '/app',
  })

  const pathSegments = pathname.split('/').filter(Boolean)
  // pathSegments examples:
  // /app -> ['app']
  // /app/obras -> ['app', 'obras']
  // /app/obras/123 -> ['app', 'obras', '123']
  // /app/obras/123/unidades -> ['app', 'obras', '123', 'unidades']
  // /app/biblioteca -> ['app', 'biblioteca']

  // Check if we're in obras list or biblioteca or tags (global sections)
  if (pathSegments[1] === 'obras' && !params.id) {
    crumbs.push({ label: 'Obras' })
  } else if (pathSegments[1] === 'biblioteca') {
    crumbs.push({ label: 'Biblioteca FVS' })
  } else if (pathSegments[1] === 'tags') {
    crumbs.push({ label: 'Tags' })
  } else if (params.id) {
    // We're in an obra context
    crumbs.push({
      label: obraName || 'Carregando...',
      href: `/app/obras/${params.id}`,
    })

    // Check for section in pathname (after obra id)
    const idIndex = pathSegments.indexOf(params.id)
    const section = pathSegments[idIndex + 1]

    if (section && sectionLabels[section]) {
      crumbs.push({
        label: sectionLabels[section],
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
