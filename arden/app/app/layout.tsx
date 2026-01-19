"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { StoreProvider } from "@/lib/stores"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  LayoutDashboard,
  ClipboardCheck,
  Wrench,
  AlertTriangle,
  FileText,
  Package,
  Users,
  Settings,
  Search,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Mock data for breadcrumb
const mockOrg = "Pfeil"
const mockProject = "Residencial Aurora"
const mockBranch = "main"

// Primary sidebar navigation items
const primaryNav = [
  { icon: Home, label: "Home", href: "/app" },
  { icon: LayoutDashboard, label: "Dashboard", href: "/app/dashboard" },
  { icon: ClipboardCheck, label: "Verificações", href: "/app/verificacoes", hasSubmenu: true },
  { icon: Wrench, label: "Serviços", href: "/app/servicos", hasSubmenu: true },
  { icon: AlertTriangle, label: "Não-Conformidades", href: "/app/ncs" },
  { icon: FileText, label: "Relatórios", href: "/app/relatorios", hasSubmenu: true },
  { icon: Package, label: "Almoxarifado", href: "/app/almoxarifado" },
  { icon: Users, label: "Equipe", href: "/app/equipe" },
]

const bottomNav = [
  { icon: Settings, label: "Configurações", href: "/app/configuracoes" },
]

// Secondary sidebar items (example for Verificações)
const verificacoesSubmenu = [
  { label: "Visão Geral", href: "/app/verificacoes" },
  { label: "Tabela S x U", href: "/app/verificacoes/tabela" },
  { label: "Inspeção em Massa", href: "/app/verificacoes/massa" },
  { label: "Histórico", href: "/app/verificacoes/historico" },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("/app")
  const [showSecondary, setShowSecondary] = useState(false)
  const [secondaryItems, setSecondaryItems] = useState<typeof verificacoesSubmenu>([])
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNavClick = (href: string, hasSubmenu?: boolean) => {
    setActiveItem(href)
    if (hasSubmenu) {
      setShowSecondary(true)
      setSecondaryItems(verificacoesSubmenu)
    } else {
      setShowSecondary(false)
    }
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <StoreProvider>
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        {/* Top Bar - 56px */}
      <header className="h-14 min-h-14 border-b border-border bg-background flex items-center px-4 gap-4">
        {/* Left: Logo + Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-sm font-medium text-foreground">
            ARDEN
          </Link>

          {/* Breadcrumb - Supabase style */}
          <nav className="flex items-center text-sm">
            <ChevronRight className="w-4 h-4 text-foreground-muted mx-1" />
            <button className="text-foreground-light hover:text-foreground px-1">
              {mockOrg}
            </button>
            <span className="text-foreground-muted mx-1">/</span>
            <button className="text-foreground-light hover:text-foreground px-1">
              {mockProject}
            </button>
            <span className="text-foreground-muted mx-1">/</span>
            <span className="text-foreground px-1.5 py-0.5 rounded bg-surface-200 text-xs font-mono">
              {mockBranch}
            </span>
          </nav>
        </div>

        {/* Right: Search, Help, Avatar */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 text-foreground-light">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Buscar...</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-surface-200 px-1.5 text-xs text-foreground-muted">
              Ctrl K
            </kbd>
          </Button>
          <Button variant="ghost" size="icon-sm">
            <HelpCircle className="w-4 h-4 text-foreground-light" />
          </Button>

          {/* User Dropdown - render only after mount to avoid hydration mismatch */}
          {mounted ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="rounded-full">
                  <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-xs font-medium text-foreground-contrast">
                    U
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <div className="w-6 h-6 rounded-full bg-brand flex items-center justify-center text-xs font-medium text-foreground-contrast">
                U
              </div>
            </Button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Primary Sidebar - 56px */}
        <aside
          className={`${sidebarExpanded ? 'w-56' : 'w-14'} min-w-14 border-r border-border bg-sidebar flex flex-col transition-all duration-200`}
          onMouseEnter={() => setSidebarExpanded(true)}
          onMouseLeave={() => setSidebarExpanded(false)}
        >
          {/* Toggle button (mobile) */}
          <div className="p-2 flex justify-center md:hidden">
            <Button variant="ghost" size="icon-sm" onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              {sidebarExpanded ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {/* Main nav items */}
          <nav className="flex-1 py-2">
            <ul className="space-y-1 px-2">
              {primaryNav.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.href
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavClick(item.href, item.hasSubmenu)}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-sidebar-accent text-foreground'
                          : 'text-foreground-light hover:text-foreground hover:bg-surface-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {sidebarExpanded && <span className="truncate">{item.label}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Status indicator */}
          <div className="px-2 py-2">
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-brand" />
              {sidebarExpanded && <span className="text-xs text-foreground-light">Online</span>}
            </div>
          </div>

          {/* Bottom nav items */}
          <nav className="border-t border-border py-2">
            <ul className="space-y-1 px-2">
              {bottomNav.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.href
                return (
                  <li key={item.href}>
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${
                        isActive
                          ? 'bg-sidebar-accent text-foreground'
                          : 'text-foreground-light hover:text-foreground hover:bg-surface-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {sidebarExpanded && <span className="truncate">{item.label}</span>}
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </aside>

        {/* Secondary Sidebar - 240px (conditional) */}
        {showSecondary && (
          <aside className="w-60 border-r border-border bg-background flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-sm font-medium text-foreground">Verificações</h2>
            </div>
            <nav className="flex-1 py-2">
              <ul className="space-y-0.5 px-2">
                {secondaryItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="block px-3 py-2 rounded-md text-sm text-foreground-light hover:text-foreground hover:bg-surface-100 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-surface-100">
          {children}
        </main>
      </div>
      </div>
    </StoreProvider>
  )
}
