import { createClient } from '@/lib/supabase/client'
import { format, startOfDay } from 'date-fns'

/**
 * Data point for conformidade chart (time series).
 */
export interface ChartDataPoint {
  date: string  // ISO date string (YYYY-MM-DD)
  taxa: number  // Conformity rate percentage
}

/**
 * NC feed item for dashboard display.
 */
export interface NCFeedItem {
  id: string
  servicoNome: string
  unidadeCodigo: string
  observacao: string | null
  createdAt: string  // ISO date string
}

/**
 * Dashboard KPI metrics with current and previous values for trend calculation.
 */
export interface DashboardKPIs {
  taxaConformidade: { current: number; previous: number }
  irs: { current: number; previous: number }
  pendentes: { current: number; previous: number }
  concluidas: { current: number; previous: number }
}

/**
 * Raw metrics from database query
 */
interface RawMetrics {
  total_verificados: number
  conformes: number
  retrabalhos: number
  pendentes: number
  concluidas: number
}

/**
 * Default metrics when no data exists
 */
const DEFAULT_METRICS: RawMetrics = {
  total_verificados: 0,
  conformes: 0,
  retrabalhos: 0,
  pendentes: 0,
  concluidas: 0
}

/**
 * Fetches dashboard KPI metrics for a specific obra.
 *
 * Calculates:
 * - Taxa de Conformidade: (Conformes / Total verificados) * 100
 * - IRS: (Retrabalhos / Total verificados) * 100
 * - Pendentes: Count of open NCs
 * - Concluidas: Count of completed verifications
 *
 * Returns current month and previous month data for trend indicators.
 *
 * @param obraId - The obra ID to fetch metrics for
 * @returns Dashboard KPIs with current and previous period values
 */
export async function getDashboardKPIs(obraId: string): Promise<DashboardKPIs> {
  const supabase = createClient()

  // Query current month metrics
  // Uses date_trunc to get first day of current month
  const { data: currentData, error: currentError } = await supabase.rpc(
    'get_dashboard_metrics',
    {
      p_obra_id: obraId,
      p_period: 'current'
    }
  ).single()

  // Query previous month metrics
  const { data: previousData, error: previousError } = await supabase.rpc(
    'get_dashboard_metrics',
    {
      p_obra_id: obraId,
      p_period: 'previous'
    }
  ).single()

  // If RPC doesn't exist, fall back to direct query
  if (currentError || previousError) {
    return getDashboardKPIsDirect(obraId)
  }

  const current = (currentData as RawMetrics) || DEFAULT_METRICS
  const previous = (previousData as RawMetrics) || DEFAULT_METRICS

  return calculateKPIs(current, previous)
}

/**
 * Direct query fallback when RPC is not available.
 * Queries itens_verificacao through verificacoes join.
 */
async function getDashboardKPIsDirect(obraId: string): Promise<DashboardKPIs> {
  const supabase = createClient()

  // Current month: from first day of this month to now
  // Previous month: from first day of last month to first day of this month
  const now = new Date()
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Format dates for PostgreSQL
  const currentMonthStartISO = currentMonthStart.toISOString()
  const previousMonthStartISO = previousMonthStart.toISOString()

  // Fetch all verification items for this obra
  // RLS will filter based on user's obra access
  const { data: allItems, error } = await supabase
    .from('itens_verificacao')
    .select(`
      status,
      status_reinspecao,
      created_at,
      verificacao:verificacoes!inner(
        obra_id
      )
    `)
    .eq('verificacao.obra_id', obraId)

  if (error) {
    console.error('Error fetching dashboard metrics:', error.message)
    // Return zeros on error
    return {
      taxaConformidade: { current: 0, previous: 0 },
      irs: { current: 0, previous: 0 },
      pendentes: { current: 0, previous: 0 },
      concluidas: { current: 0, previous: 0 }
    }
  }

  const items = allItems || []

  // Filter items by period
  const currentItems = items.filter(item => {
    const createdAt = new Date(item.created_at)
    return createdAt >= currentMonthStart
  })

  const previousItems = items.filter(item => {
    const createdAt = new Date(item.created_at)
    return createdAt >= previousMonthStart && createdAt < currentMonthStart
  })

  // Calculate metrics for each period
  const currentMetrics = calculateRawMetrics(currentItems)
  const previousMetrics = calculateRawMetrics(previousItems)

  return calculateKPIs(currentMetrics, previousMetrics)
}

/**
 * Calculate raw metrics from verification items
 */
function calculateRawMetrics(items: Array<{
  status: string | null
  status_reinspecao: string | null
}>): RawMetrics {
  if (items.length === 0) {
    return DEFAULT_METRICS
  }

  // Total verificados: items that have been inspected (not 'nao_verificado')
  const verificados = items.filter(item => item.status !== 'nao_verificado')
  const total_verificados = verificados.length

  // Conformes: items that are OK
  // - status = 'conforme' (first inspection OK)
  // - OR status_reinspecao IN ('conforme_apos_reinspecao', 'aprovado_com_concessao')
  const conformes = items.filter(item =>
    item.status === 'conforme' ||
    item.status_reinspecao === 'conforme_apos_reinspecao' ||
    item.status_reinspecao === 'aprovado_com_concessao'
  ).length

  // Retrabalhos: items where correction was executed
  // - status_reinspecao = 'retrabalho'
  const retrabalhos = items.filter(item =>
    item.status_reinspecao === 'retrabalho'
  ).length

  // Pendentes: open NCs (not yet reinspected)
  // - status = 'nao_conforme' AND status_reinspecao IS NULL
  const pendentes = items.filter(item =>
    item.status === 'nao_conforme' &&
    item.status_reinspecao === null
  ).length

  // Concluidas: verified items (not pending)
  // - status != 'nao_verificado' AND (
  //     status = 'conforme' OR
  //     status = 'excecao' OR
  //     status_reinspecao IS NOT NULL
  //   )
  const concluidas = items.filter(item =>
    item.status !== 'nao_verificado' && (
      item.status === 'conforme' ||
      item.status === 'excecao' ||
      item.status_reinspecao !== null
    )
  ).length

  return {
    total_verificados,
    conformes,
    retrabalhos,
    pendentes,
    concluidas
  }
}

/**
 * Calculate KPIs from raw metrics
 */
function calculateKPIs(current: RawMetrics, previous: RawMetrics): DashboardKPIs {
  // Taxa de Conformidade = (Conformes / Total verificados) * 100
  const taxaConformidadeCurrent = current.total_verificados > 0
    ? (current.conformes / current.total_verificados) * 100
    : 0

  const taxaConformidadePrevious = previous.total_verificados > 0
    ? (previous.conformes / previous.total_verificados) * 100
    : 0

  // IRS = (Retrabalhos / Total verificados) * 100
  const irsCurrent = current.total_verificados > 0
    ? (current.retrabalhos / current.total_verificados) * 100
    : 0

  const irsPrevious = previous.total_verificados > 0
    ? (previous.retrabalhos / previous.total_verificados) * 100
    : 0

  return {
    taxaConformidade: {
      current: Math.round(taxaConformidadeCurrent * 10) / 10, // 1 decimal place
      previous: Math.round(taxaConformidadePrevious * 10) / 10
    },
    irs: {
      current: Math.round(irsCurrent * 10) / 10,
      previous: Math.round(irsPrevious * 10) / 10
    },
    pendentes: {
      current: current.pendentes,
      previous: previous.pendentes
    },
    concluidas: {
      current: current.concluidas,
      previous: previous.concluidas
    }
  }
}

/**
 * Fetches recent non-conformances (NCs) for a specific obra.
 *
 * Returns open NCs (status = 'nao_conforme' AND status_reinspecao IS NULL)
 * sorted by creation date descending.
 *
 * @param obraId - The obra ID to fetch NCs for
 * @param limit - Maximum number of NCs to return (default: 5)
 * @returns Array of NCFeedItem with servico name, unidade code, and timestamp
 */
export async function getRecentNCs(obraId: string, limit: number = 5): Promise<NCFeedItem[]> {
  const supabase = createClient()

  // Query itens_verificacao with joins to get servico nome and unidade codigo
  // Join path: itens_verificacao -> verificacoes -> servicos/unidades
  const { data, error } = await supabase
    .from('itens_verificacao')
    .select(`
      id,
      observacao,
      created_at,
      verificacao:verificacoes!inner(
        obra_id,
        servico:servicos(
          nome
        ),
        unidade:unidades(
          nome,
          codigo
        )
      )
    `)
    .eq('verificacao.obra_id', obraId)
    .eq('status', 'nao_conforme')
    .is('status_reinspecao', null)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent NCs:', error.message)
    return []
  }

  if (!data) {
    return []
  }

  // Map results to NCFeedItem format
  return data.map(item => {
    // Type assertion for nested joins (Supabase returns objects for singular relations)
    const verificacao = item.verificacao as unknown as {
      servico: { nome: string } | null
      unidade: { nome: string; codigo: string | null } | null
    }

    return {
      id: item.id,
      servicoNome: verificacao.servico?.nome || 'Serviço desconhecido',
      unidadeCodigo: verificacao.unidade?.codigo || verificacao.unidade?.nome || 'Unidade desconhecida',
      observacao: item.observacao,
      createdAt: item.created_at
    }
  })
}

/**
 * Fetches time series data for conformidade chart.
 *
 * Returns daily conformity rate for the specified number of days.
 * Uses JavaScript grouping for MVP (avoids PostgreSQL function).
 *
 * @param obraId - The obra ID to fetch data for
 * @param days - Number of days to include (default: 90 for 3 months)
 * @returns Array of ChartDataPoint sorted oldest to newest
 */
export async function getConformidadeTimeSeries(
  obraId: string,
  days: number = 90
): Promise<ChartDataPoint[]> {
  const supabase = createClient()

  // Calculate date threshold
  const threshold = new Date()
  threshold.setDate(threshold.getDate() - days)
  const thresholdISO = threshold.toISOString()

  // Fetch all verification items for this obra in date range
  // Filter: status != 'nao_verificado' (only verified items)
  const { data, error } = await supabase
    .from('itens_verificacao')
    .select(`
      id,
      status,
      status_reinspecao,
      created_at,
      verificacao:verificacoes!inner(
        obra_id
      )
    `)
    .eq('verificacao.obra_id', obraId)
    .neq('status', 'nao_verificado')
    .gte('created_at', thresholdISO)

  if (error) {
    console.error('Error fetching conformidade time series:', error.message)
    return []
  }

  if (!data || data.length === 0) {
    return []
  }

  // Group items by date using JavaScript
  const byDate = data.reduce((acc, item) => {
    const dateKey = format(startOfDay(new Date(item.created_at)), 'yyyy-MM-dd')
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(item)
    return acc
  }, {} as Record<string, typeof data>)

  // Calculate taxa per day
  const dataPoints: ChartDataPoint[] = Object.entries(byDate).map(([date, dayItems]) => {
    const total = dayItems.length
    const conformes = dayItems.filter(item =>
      item.status === 'conforme' ||
      item.status_reinspecao === 'conforme_apos_reinspecao' ||
      item.status_reinspecao === 'aprovado_com_concessao'
    ).length

    return {
      date,
      taxa: total > 0 ? (conformes / total) * 100 : 0
    }
  })

  // Sort by date (oldest to newest)
  return dataPoints.sort((a, b) => a.date.localeCompare(b.date))
}
