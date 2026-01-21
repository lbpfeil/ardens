import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { KPICard } from "@/components/ui/kpi-card"

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
        <KPICard title="Taxa de Conformidade" value="87.2%" description="+2.1% vs semana passada" />
        <KPICard title="NCs Abertas" value="5" description="-2 vs semana passada" />
        <KPICard title="Verificacoes Pendentes" value="12" />
        <KPICard title="Verificacoes Concluidas" value="248" description="+15 hoje" />
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
