import { Badge } from '@/components/ui/badge'
import type { Obra } from '@/lib/supabase/queries/obras'

interface ObraHeaderProps {
  obra: Obra
}

export function ObraHeader({ obra }: ObraHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          {obra.nome}
        </h1>
        {obra.codigo && (
          <p className="text-sm text-foreground-light">
            Codigo: {obra.codigo}
          </p>
        )}
      </div>
      <Badge variant={obra.arquivada ? 'secondary' : 'default'}>
        {obra.arquivada ? 'Arquivada' : 'Ativa'}
      </Badge>
    </div>
  )
}
