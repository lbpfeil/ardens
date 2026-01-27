// Tipos e utilitarios para status visual das celulas da matriz heatmap

import type { MatrizVerificacao } from '@/lib/supabase/queries/verificacoes'

export type MatrizCellStatus =
  | 'pendente'
  | 'conforme'
  | 'nao_conforme'
  | 'excecao'
  | 'conforme_reinspecao'
  | 'nc_reinspecao'

// Cores de fundo para cada status (CSS variables do design system)
export const STATUS_COLORS: Record<MatrizCellStatus, string> = {
  pendente: 'bg-surface-200',
  conforme: 'bg-brand',
  nao_conforme: 'bg-destructive',
  excecao: 'bg-warning',
  conforme_reinspecao: 'bg-brand-600',
  nc_reinspecao: 'bg-destructive-600',
}

// Labels em português para tooltip
export const STATUS_LABELS: Record<MatrizCellStatus, string> = {
  pendente: 'Pendente',
  conforme: 'Conforme',
  nao_conforme: 'Não Conforme',
  excecao: 'Exceção',
  conforme_reinspecao: 'Conforme após Reinspeção',
  nc_reinspecao: 'NC após Reinspeção',
}

/**
 * Deriva o status visual da celula a partir dos dados da verificacao.
 * Combina status_verificacao + contadores + tem_reinspecao para
 * produzir um dos 6 estados visuais do heatmap.
 */
export function deriveMatrizCellStatus(
  verificacao: MatrizVerificacao | undefined
): MatrizCellStatus {
  if (!verificacao) return 'pendente'

  const { status, itens_conformes, itens_nc, itens_excecao, total_itens, tem_reinspecao } = verificacao

  if (status === 'pendente') return 'pendente'

  if (status === 'concluida') {
    if (itens_excecao === total_itens) return 'excecao'
    if (tem_reinspecao) return 'conforme_reinspecao'
    return 'conforme'
  }

  if (status === 'com_nc') {
    if (tem_reinspecao) return 'nc_reinspecao'
    return 'nao_conforme'
  }

  // em_andamento: tratar como pendente visualmente
  return 'pendente'
}
