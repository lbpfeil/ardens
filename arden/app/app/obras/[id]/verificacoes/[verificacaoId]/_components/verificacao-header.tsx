interface VerificacaoHeaderProps {
  servicoNome?: string
  servicoCodigo?: string
  unidadeNome?: string
  obraNome?: string
}

export function VerificacaoHeader({
  servicoNome,
  servicoCodigo,
  unidadeNome,
  obraNome,
}: VerificacaoHeaderProps) {
  return (
    <div className="border-b border-border pb-4 mb-6">
      {/* Breadcrumb */}
      <div className="text-sm text-foreground-muted mb-2">
        {obraNome && unidadeNome && `${obraNome} / ${unidadeNome}`}
      </div>

      {/* Title */}
      <h1 className="text-xl font-normal text-foreground">
        {servicoCodigo ? `${servicoCodigo} — ${servicoNome}` : servicoNome}
      </h1>
    </div>
  )
}
