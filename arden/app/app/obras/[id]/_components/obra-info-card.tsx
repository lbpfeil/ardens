import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Obra } from '@/lib/supabase/queries/obras'

interface ObraInfoCardProps {
  obra: Obra
}

const tipologiaLabels: Record<string, string> = {
  residencial_horizontal: 'Residencial Horizontal',
  residencial_vertical: 'Residencial Vertical',
  comercial: 'Comercial',
  retrofit: 'Retrofit',
  misto: 'Misto',
}

export function ObraInfoCard({ obra }: ObraInfoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informacoes da Obra</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {obra.tipologia && (
            <div>
              <dt className="text-sm font-medium text-foreground-light">
                Tipologia
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {tipologiaLabels[obra.tipologia] ?? obra.tipologia}
              </dd>
            </div>
          )}

          {obra.responsavel_tecnico && (
            <div>
              <dt className="text-sm font-medium text-foreground-light">
                Responsavel Tecnico
              </dt>
              <dd className="mt-1 text-sm text-foreground">
                {obra.responsavel_tecnico}
              </dd>
            </div>
          )}

          <div>
            <dt className="text-sm font-medium text-foreground-light">
              Data de Criacao
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {formatDate(obra.created_at)}
            </dd>
          </div>

          <div>
            <dt className="text-sm font-medium text-foreground-light">
              Ultima Atualizacao
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {formatDate(obra.updated_at)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
