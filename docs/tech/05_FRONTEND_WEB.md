# Frontend Web - ARDEN FVS

## Stack Completa

| Categoria | Tecnologia |
|-----------|------------|
| Framework | Next.js 15+ (App Router) |
| Linguagem | TypeScript |
| Estilizacao | Tailwind CSS |
| Componentes | Radix UI |
| Estado Global | Zustand |
| Formularios | React Hook Form + Zod |
| Graficos | Recharts |
| Hospedagem | Vercel |

---

## Next.js 15+ (App Router)

### Razoes da Escolha

- Supabase usa Next.js no proprio dashboard
- Roteamento automatico baseado em pastas
- SEO otimizado (landing page)
- Deploy gratuito na Vercel
- TypeScript de primeira classe

### Estrutura de Pastas

```
/app
  /(auth)
    /login
    /cadastro
  /(portal)
    /dashboard
    /obras
      /[id]
    /relatorios
  /api (opcional)
/components
  /ui (botoes, inputs, cards - Radix UI)
  /layouts (sidebar, header)
/lib
  /supabase (client, queries)
```

---

## Zustand (Estado Global)

### Decisao

**Zustand para TODO estado global** - sem excecoes.

### Razoes

- Zero ambiguidade (sempre usar Zustand)
- Codigo consistente
- Leve (4KB) e performatico
- TypeScript de primeira classe
- DevTools inclusos
- Sem boilerplate

### Estrutura da Store

```typescript
// lib/store.ts - UNICA fonte de estado global
import { create } from 'zustand'

export const useStore = create((set) => ({
  // Auth
  user: null,
  session: null,
  setUser: (user) => set({ user }),

  // App state
  obraSelecionada: null,
  setObra: (obra) => set({ obraSelecionada: obra }),

  // UI state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Filtros
  filtros: { periodo: '30d', status: 'todas' },
  setFiltros: (filtros) => set({ filtros })
}))
```

**Regra:** Context API NAO sera utilizado para evitar ambiguidade.

---

## React Hook Form + Zod

### Decisao

**React Hook Form + Zod** para todos formularios - sem excecoes.

### Razoes

- Integracao nativa perfeita
- TypeScript automatico (Zod infere tipos)
- Performance excelente (usa refs)
- Padrao no ecossistema Next.js
- Reutilizacao de schemas

### Exemplo

```typescript
// Schema Zod define validacao + tipos
const obraSchema = z.object({
  nome: z.string().min(3, 'Minimo 3 caracteres'),
  tipologia: z.enum(['residencial', 'comercial', 'retrofit']),
  responsavel: z.string().email('Email invalido').optional()
})

type ObraForm = z.infer<typeof obraSchema> // Tipo inferido

// React Hook Form com Zod resolver
const { register, handleSubmit, formState: { errors } } = useForm<ObraForm>({
  resolver: zodResolver(obraSchema)
})
```

**Regra:** Validacao nativa HTML5 NAO sera utilizada.

---

## Recharts (Graficos)

### Decisao

**Recharts** como biblioteca unica de graficos.

### Razoes

- Componentes declarativos (JSX)
- TypeScript excelente
- Responsivo por padrao
- Leve e performatico (SVG)
- Documentacao clara

### Tipos Disponiveis

- `<BarChart>` - Progresso por obra, comparativos
- `<LineChart>` - Evolucao temporal, tendencias
- `<PieChart>` - Distribuicao de status
- `<RadarChart>` - Comparativo multi-dimensional
- `<AreaChart>` - Areas de tendencia

### Exemplo

```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

function GraficoConformidade({ data }) {
  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="obra" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="conformidade" fill="#3ecf8e" />
      <Bar dataKey="naoConformidade" fill="#ef4444" />
    </BarChart>
  )
}
```

**Regra:** Outras bibliotecas (Chart.js, Victory, Nivo) NAO serao utilizadas.

---

## Hospedagem

### Vercel

- Gratis ate 100K requests/mes
- Deploy automatico via Git
- Otimizado para Next.js
- SSL automatico
- Preview deployments

---

## Principios

1. **Zero ambiguidade** - Uma unica forma de fazer cada coisa
2. **Praticidade** - Facilidade de gestao
3. **Padroes da industria** - Next.js + Vercel
4. **Minimo de decisoes** - Para IA desenvolver

---

## Referencias

- Design System: `DESIGN-SYSTEM.md` (raiz)
- Arquitetura: [01_ARCHITECTURE.md](01_ARCHITECTURE.md)
