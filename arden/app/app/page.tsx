import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react"

// Mock KPIs
const mockKPIs = [
  {
    title: "Taxa de Conformidade",
    value: "87.2%",
    change: "+2.1%",
    icon: TrendingUp,
    color: "text-brand",
  },
  {
    title: "NCs Abertas",
    value: "5",
    change: "-2",
    icon: AlertTriangle,
    color: "text-warning",
  },
  {
    title: "Verificações Pendentes",
    value: "12",
    change: "",
    icon: Clock,
    color: "text-foreground-light",
  },
  {
    title: "Verificações Concluídas",
    value: "248",
    change: "+15 hoje",
    icon: CheckCircle2,
    color: "text-brand",
  },
]

// Mock recent NCs
const mockRecentNCs = [
  {
    id: 1,
    unit: "Apto 301",
    service: "Revestimento Cerâmico",
    item: "Planicidade",
    time: "2h",
  },
  {
    id: 2,
    unit: "Apto 205",
    service: "Pintura",
    item: "Acabamento",
    time: "5h",
  },
  {
    id: 3,
    unit: "Área Comum - Hall",
    service: "Piso Vinílico",
    item: "Nivelamento",
    time: "1d",
  },
]

export default function AppHomePage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-normal text-foreground">Home</h1>
        <p className="text-sm text-foreground-light mt-1">
          Residencial Aurora - Etapa 1
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {mockKPIs.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-foreground-light">{kpi.title}</span>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-medium text-foreground">{kpi.value}</span>
                  {kpi.change && (
                    <span className="text-xs text-foreground-lighter">{kpi.change}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent NCs */}
      <Card>
        <CardHeader>
          <CardTitle>Não-Conformidades Recentes</CardTitle>
          <CardDescription>
            Últimas NCs abertas que requerem atenção
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentNCs.map((nc) => (
              <div
                key={nc.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <div>
                    <p className="text-sm text-foreground">{nc.unit}</p>
                    <p className="text-xs text-foreground-light">
                      {nc.service} - {nc.item}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-foreground-muted">há {nc.time}</span>
                  <button className="text-xs text-brand-link hover:text-brand-link/80">
                    Ver detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <button className="text-sm text-brand-link hover:text-brand-link/80">
              Ver todas (5) →
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Activity Feed and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolução da Conformidade</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-foreground-muted text-sm">
              [Grafico de linha - placeholder]
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>Ações da equipe</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center text-foreground-muted text-sm">
              [Feed de atividades - placeholder]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
