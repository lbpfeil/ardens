import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { ClipboardCheck, BarChart3, FileText } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-border flex items-center px-6">
        <Link href="/" className="text-lg font-medium text-foreground">
          ARDEN FVS
        </Link>
        <nav className="ml-auto flex items-center gap-4">
          <Link href="/login" className="text-sm text-foreground-light hover:text-foreground">
            Entrar
          </Link>
          <Button asChild size="sm">
            <Link href="/login">Começar Grátis</Link>
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-normal text-foreground mb-6">
              Controle de Qualidade para Construção Civil
            </h1>
            <p className="text-lg text-foreground-light mb-8 max-w-2xl mx-auto">
              Gerencie verificações de serviços, acompanhe não-conformidades e
              gere relatórios profissionais para atender ao PBQP-H.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/login">Começar Grátis</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#features">Conhecer Recursos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-6 bg-surface-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-normal text-foreground text-center mb-12">
              Tudo que você precisa para gestão da qualidade
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <Card>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-2">
                    <ClipboardCheck className="w-5 h-5 text-brand" />
                  </div>
                  <CardTitle>Verificações de Serviços</CardTitle>
                  <CardDescription>
                    Inspecione serviços diretamente no canteiro com app mobile ou portal web.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-foreground-light space-y-1">
                    <li>Checklist personalizado por serviço</li>
                    <li>Registro fotográfico</li>
                    <li>Sincronização offline</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 2 */}
              <Card>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-2">
                    <BarChart3 className="w-5 h-5 text-brand" />
                  </div>
                  <CardTitle>Dashboard em Tempo Real</CardTitle>
                  <CardDescription>
                    Acompanhe KPIs de qualidade e identifique problemas antes que escalem.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-foreground-light space-y-1">
                    <li>Taxa de conformidade</li>
                    <li>Índice de retrabalho</li>
                    <li>Comparativo entre obras</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Feature 3 */}
              <Card>
                <CardHeader>
                  <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center mb-2">
                    <FileText className="w-5 h-5 text-brand" />
                  </div>
                  <CardTitle>Relatórios PBQP-H</CardTitle>
                  <CardDescription>
                    Gere documentos prontos para auditoria com um clique.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-foreground-light space-y-1">
                    <li>FVS por grupo de unidades</li>
                    <li>Relatório de Não-Conformidades</li>
                    <li>Dashboard Executivo</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-foreground-muted">
            ARDEN FVS - Sistema de Controle de Qualidade
          </p>
          <div className="flex items-center gap-6 text-sm text-foreground-light">
            <Link href="#" className="hover:text-foreground">Termos</Link>
            <Link href="#" className="hover:text-foreground">Privacidade</Link>
            <Link href="#" className="hover:text-foreground">Contato</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
