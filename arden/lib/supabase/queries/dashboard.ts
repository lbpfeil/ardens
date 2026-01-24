import { createClient } from '@/lib/supabase/client'

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
