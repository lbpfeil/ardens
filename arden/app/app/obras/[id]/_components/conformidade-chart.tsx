'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { ChartDataPoint } from '@/lib/supabase/queries/dashboard'

interface ConformidadeChartProps {
  data: ChartDataPoint[]
}

/**
 * Custom tooltip component for dark theme styling.
 */
function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (active && payload && payload.length && label) {
    return (
      <div className="bg-overlay border border-overlay rounded-lg p-3 shadow-lg">
        <p className="text-xs text-foreground-muted">
          {format(parseISO(label), 'PPP', { locale: ptBR })}
        </p>
        <p className="text-sm font-medium text-foreground">
          {payload[0].value.toFixed(1)}% conforme
        </p>
      </div>
    )
  }
  return null
}

/**
 * Line chart showing Taxa de Conformidade evolution over time.
 * Uses Recharts with dark theme styling matching design system.
 */
export function ConformidadeChart({ data }: ConformidadeChartProps) {
  // Empty state
  if (data.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center h-[300px] flex items-center justify-center">
        <p className="text-sm text-foreground-muted">
          Sem dados de verificação no período
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-border bg-surface-100 p-4">
      <h3 className="text-sm font-medium text-foreground mb-4">
        Evolução da Taxa de Conformidade
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border-default))"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => format(parseISO(value), 'dd/MMM', { locale: ptBR })}
              stroke="hsl(var(--foreground-muted))"
              tick={{ fill: 'hsl(var(--foreground-muted))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border-default))' }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
              stroke="hsl(var(--foreground-muted))"
              tick={{ fill: 'hsl(var(--foreground-muted))', fontSize: 12 }}
              tickLine={{ stroke: 'hsl(var(--border-default))' }}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="taxa"
              stroke="hsl(var(--brand-default))"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: 'hsl(var(--brand-default))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
