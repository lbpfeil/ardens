'use client'

import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  arquivada: boolean
}

export function StatusBadge({ arquivada }: StatusBadgeProps) {
  return (
    <Badge variant={arquivada ? 'secondary' : 'default'}>
      {arquivada ? 'Arquivada' : 'Ativa'}
    </Badge>
  )
}
