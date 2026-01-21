"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, usePathname, useParams } from "next/navigation"
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
  Search,
  HelpCircle,
  ChevronRight,
  Menu,
  X,
  LogOut,
  User,
  Settings,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SidebarGlobal, SidebarObra, Breadcrumb } from "@/components/navigation"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams<{ id?: string }>()

  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Detect obra context: URL matches /app/obras/[id] or deeper
  // Examples: /app/obras/123, /app/obras/123/unidades, /app/obras/123/servicos
  // NOT: /app/obras (list page)
  const isObraContext = pathname.startsWith('/app/obras/') &&
    params.id !== undefined &&
    pathname !== '/app/obras'

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
            <ChevronRight className="w-4 h-4 text-foreground-muted" />
            <Breadcrumb obraName={null} />
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
                    Configuracoes
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
          {/* Sidebar */}
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

            {/* Context-aware sidebar content */}
            {isObraContext ? (
              <SidebarObra obraId={params.id!} expanded={sidebarExpanded} />
            ) : (
              <SidebarGlobal expanded={sidebarExpanded} />
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-surface-100">
            {children}
          </main>
        </div>
      </div>
    </StoreProvider>
  )
}
