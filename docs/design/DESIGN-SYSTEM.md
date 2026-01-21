# Arden FVS Design System (Supabase Clone)

> **ANTES DE COMECAR**: Leia as regras de desenvolvimento em [README.md](README.md).
> Contem instrucoes obrigatorias sobre uso de componentes shadcn, variaveis CSS e restricoes de criacao.

---

## CSS Variables

Extracted from `themes/dark.css` (Supabase Default).

```css
:root {
  --helpers-os-appearance: Dark;
  
  /* Brand Colors */
  --brand-default: 153.1deg 60.2% 52.7%;
  --brand-link: 155deg 100% 38.6%;
  --brand-200: 162deg 100% 2%;
  --brand-300: 155.1deg 100% 8%;
  --brand-400: 155.5deg 100% 9.6%;
  --brand-500: 154.9deg 100% 19.2%;
  --brand-600: 154.9deg 59.5% 70%;

  /* Backgrounds */
  --background-default: 0deg 0% 7.1%;
  --background-200: 0deg 0% 9%;
  --background-alternative-default: 0deg 0% 5.9%;
  --background-alternative-200: 0deg 0% 11%;
  --background-selection: 0deg 0% 19.2%;
  --background-control: 0deg 0% 14.1%;
  --background-overlay-default: 0deg 0% 14.1%;
  --background-overlay-hover: 0deg 0% 18%;
  --background-muted: 0deg 0% 14.1%;
  --background-dialog-default: 0deg 0% 7.1%;
  --background-dash-sidebar: 0deg 0% 9%;
  --background-dash-canvas: 0deg 0% 7.1%;
  
  /* Background Surfaces */
  --background-surface-75: 0deg 0% 9%;
  --background-surface-100: 0deg 0% 12.2%;
  --background-surface-200: 0deg 0% 12.9%;
  --background-surface-300: 0deg 0% 16.1%;
  --background-surface-400: 0deg 0% 16.1%;

  /* Foreground (Text) */
  --foreground-default: 0deg 0% 98%;
  --foreground-light: 0deg 0% 70.6%;
  --foreground-lighter: 0deg 0% 53.7%;
  --foreground-muted: 0deg 0% 30.2%;
  --foreground-contrast: 0deg 0% 8.6%;

  /* Borders */
  --border-default: 0deg 0% 18%;
  --border-muted: 0deg 0% 14.1%;
  --border-secondary: 0deg 0% 14.1%;
  --border-overlay: 0deg 0% 20%;
  --border-control: 0deg 0% 22.4%;
  --border-alternative: 0deg 0% 26.7%;
  --border-strong: 0deg 0% 21.2%;
  --border-stronger: 0deg 0% 27.1%;
  
  /* State Colors */
  --warning-default: 38.9deg 100% 42.9%;
  --warning-200: 36.6deg 100% 8%;
  --warning-300: 32.3deg 100% 10.2%;
  --warning-400: 33.2deg 100% 14.5%;
  --warning-500: 34.8deg 90.9% 21.6%;
  --warning-600: 38.9deg 100% 42.9%;

  --destructive-default: 10.2deg 77.9% 53.9%;
  --destructive-200: 10.9deg 23.4% 9.2%;
  --destructive-300: 7.5deg 51.3% 15.3%;
  --destructive-400: 6.7deg 60% 20.6%;
  --destructive-500: 7.9deg 71.6% 29%;
  --destructive-600: 9.7deg 85.2% 62.9%;

  /* Secondary (Neutral Gray) */
  --secondary-default: 0deg 0% 65%;
  --secondary-200: 0deg 0% 18%;
  --secondary-400: 0deg 0% 28%;

  /* Component Specific */
  --sidebar-background: var(--background-dash-sidebar);
  --sidebar-foreground: var(--foreground-default);
  --sidebar-primary: var(--foreground-default);
  --sidebar-primary-foreground: var(--brand-default);
  --sidebar-accent: var(--background-selection);
  --sidebar-accent-foreground: var(--foreground-default);
  --sidebar-border: var(--border-default);
  --sidebar-ring: 217.2 91.2% 59.8%;
  
  --background-button-default: var(--colors-gray-dark-500); /* hsl(0, 0%, 18%) */
  --border-button-default: var(--colors-gray-dark-700); /* hsl(0, 0%, 24.3%) */
  --border-button-hover: var(--colors-gray-dark-800); /* hsl(0, 0%, 31.4%) */
}
```


## 🎨 Color Palette & Radix Scales

Supabase uses a **12-step color scale** system (similar to Radix UI).
The `brand` colors map to this scale.

### Brand Scale (Green/Teal)
| Token | Variable | Value (Dark Mode) | Usage |
|-------|----------|-------------------|-------|
| **1** | `--colors-brand1` | `hsl(153 75% 6%)` | App background |
| **2** | `--colors-brand2` | `hsl(153 73% 7%)` | Subtle background |
| **3** | `--colors-brand3` | `hsl(154 69% 9%)` | UI element background |
| **4** | `--colors-brand4` | `hsl(154 67% 11%)` | Hovered UI element |
| **5** | `--colors-brand5` | `hsl(154 66% 13%)` | Active/Selected UI element |
| **6** | `--colors-brand6` | `hsl(154 64% 17%)` | Subtle borders and separators |
| **7** | `--colors-brand7` | `hsl(154 62% 22%)` | UI element border and focus rings |
| **8** | `--colors-brand8` | `hsl(153 60% 28%)` | Hovered UI element border |
| **9** | `--colors-brand9` | `hsl(153 60% 53%)` | Solid backgrounds (Buttons) |
| **10** | `--colors-brand10` | `hsl(153 60% 70%)` | Hovered solid backgrounds |
| **11** | `--colors-brand11` | `hsl(153 60% 50%)` | Low-contrast text |
| **12** | `--colors-brand12` | `hsl(153 60% 95%)` | High-contrast text |

*Note: `var(--brand-default)` corresponds to `brand9`.*

### Gray/Slate Scale
Used for neutrals. Supabase uses `slate` (cool gray) extensively.

| Token | Variable | Value (Dark Mode roughly) | Usage |
|-------|----------|---------------------------|-------|
| **1** | `--colors-slate1` | `hsl(200 7% 8.8%)` | App background |
| **2** | `--colors-slate2` | `hsl(195 7% 11%)` | Subtle background |
| **3** | `--colors-slate3` | `hsl(197 6.8% 13.6%)`| UI element background |
| **4** | `--colors-slate4` | `hsl(198 6.6% 15.8%)`| Hovered UI element |
| **5** | `--colors-slate5` | `hsl(199 6.4% 17.9%)`| Active/Selected UI element |
| **6** | `--colors-slate6` | `hsl(201 6.2% 20.5%)`| Subtle borders |
| **7** | `--colors-slate7` | `hsl(203 6% 24.3%)` | UI element border |
| **8** | `--colors-slate8` | `hsl(207 5.6% 31.6%)`| Hovered UI element border |
| **9** | `--colors-slate9` | `hsl(206 6% 43.9%)` | Solid backgrounds |
| **10** | `--colors-slate10` | `hsl(206 5.2% 49.5%)`| Hovered solid backgrounds |
| **11** | `--colors-slate11` | `hsl(206 6% 63%)` | Low-contrast text |
| **12** | `--colors-slate12` | `hsl(210 6% 93%)` | High-contrast text |

*Values extracted from `projectwallace-css.tokens.json`.*


## 📐 Typography

**Primary Font**: `Circular`, `custom-font`, `Helvetica Neue`, `Helvetica`, `Arial`, `sans-serif` (Variable: `var(--font-custom)`)
**Mono Font**: `Source Code Pro`, `Office Code Pro`, `Menlo`, `monospace` (Variable: `var(--font-source-code-pro)`)

### Font Scale
| Scale | Size | Line Height | Usage |
|-------|------|-------------|-------|
| **xs** | 12px (0.75rem) | 1rem | Labels, metadata |
| **sm** | 14px (0.875rem) | 1.25rem | Body text |
| **base** | 16px (1rem) | 1.5rem | Default body |
| **lg** | 18px (1.125rem) | 1.75rem | Large body |
| **xl** | 20px (1.25rem) | 1.75rem | Headings |
| **2xl** | 24px (1.5rem) | 2rem | Section headers |
| **3xl** | 30px (1.875rem) | 2.25rem | Page headers |
| **4xl** | 36px (2.25rem) | 2.5rem | Hero titles |
| **5xl** | 48px (3rem) | 1 | Display titles |
| **6xl** | 60px (3.75rem) | 1 | Large display |
| **7xl** | 72px (4.5rem) | 1 | Massive display |

*Verified against CSS tokens (high usage of `0.75rem`, `0.875rem`, `1rem`).*


### Heading Hierarchy
| Level | Size Class | Weight | Color Class | Usage |
|-------|------------|--------|-------------|-------|
| **H1** | `text-4xl` | `font-normal` | `text-foreground` | Page titles |
| **H2** | `text-3xl` | `font-normal` | `text-foreground` | Section titles |
| **H3** | `text-2xl` | `font-normal` | `text-foreground` | Subsection titles |
| **H4** | `text-xl` | `font-normal` | `text-foreground` | Card titles |
| **H5** | `text-lg` | `font-normal` | `text-foreground` | Component titles |
| **H6** | `text-base` | `font-medium` | `text-foreground` | Small titles |

### Text Styles
| Style | Class | Usage |
|-------|-------|-------|
| **Body** | `text-sm font-normal text-foreground` | Primary content |
| **Secondary** | `text-sm font-normal text-foreground-light` | Supporting text |
| **Caption** | `text-xs font-normal text-foreground-lighter` | Metadata, timestamps |
| **Muted** | `text-xs font-normal text-foreground-muted` | Subtle information |
| **Code** | `font-mono text-xs bg-surface-200 px-1.5 py-0.5 rounded` | Inline code |
| **Link** | `text-brand-link hover:text-brand-link/80` | Interactive links |
| **Error** | `text-destructive` | Error messages |
| **Warning** | `text-warning` | Warning messages |
| **Success** | `text-brand` | Success messages |

*Note: Supabase uses a lot of `text-sm` for standard interface text and `text-xs` for labels/metadata.*

## 📏 Spacing Scale

Supabase uses a consistent spacing scale based on a 4px base unit.

| Scale | Value | Usage |
|-------|-------|-------|
| **0** | 0px | No spacing |
| **px** | 1px | Borders, dividers |
| **0.5** | 2px | Tight spacing, borders |
| **1** | 4px | Component padding, small gaps |
| **1.5** | 6px | Input padding, button padding |
| **2** | 8px | Card padding, list items |
| **3** | 12px | Form groups, medium gaps |
| **4** | 16px | Section padding, large gaps |
| **5** | 20px | Container padding |
| **6** | 24px | Page sections, large containers |
| **8** | 32px | Major sections, sidebar spacing |
| **10** | 40px | Hero sections |
| **12** | 48px | Large hero sections |
| **16** | 64px | Page margins |
| **20** | 80px | Full page sections |
| **24** | 96px | Landing page sections |

### Spacing Classes
| Property | Scale | Example Classes |
|----------|-------|-----------------|
| **Padding** | `p-{scale}` | `p-4`, `px-2`, `py-6` |
| **Margin** | `m-{scale}` | `m-2`, `mx-auto`, `my-4` |
| **Gap** | `gap-{scale}` | `gap-4`, `gap-x-2` |
| **Space Between** | `space-{direction}-{scale}` | `space-y-4`, `space-x-2` |

## 🔲 Border Radius Scale

Consistent border radius for different component sizes.

| Scale | Value | Usage |
|-------|-------|-------|
| **none** | 0px | Sharp corners |
| **sm** | 2px | Small elements, inner badges |
| **DEFAULT** (md)| 6px | **Most Common**. Cards, inputs, buttons |
| **lg** | 8px | Larger cards, modals |
| **xl** | 12px | Panels, containers |
| **2xl** | 16px | Large layout containers |
| **full** | 9999px | Pills, avatars |

*Analysis of standard usage: 6px is the dominant radius.*


*Note: Most components use the default 6px radius.*

## 🌑 Shadow System

Shadow tokens for depth and elevation.

| Level | Class | Usage |
|-------|-------|-------|
| **none** | `shadow-none` | Flat elements |
| **sm** | `shadow-sm` | Subtle elevation |
| **DEFAULT** | `shadow` | Standard cards, panels |
| **md** | `shadow-md` | Elevated cards |
| **lg** | `shadow-lg` | Modals, dropdowns |
| **xl** | `shadow-xl` | Tooltips, popovers |

## 🎯 Icons

### Primary Source
- **Lucide Icons** (`lucide-react`): Standard UI icons
- Default: `size={24}`, `strokeWidth={2}`
- **Custom Icons**: SVG files for brand/specific needs when Lucide is insufficient

### Icon Tints
Use text color classes for icons:
```tsx
<BucketAdd className="text-foreground-muted" />
<Settings className="text-foreground-lighter" />
```

### Common Sizes
| Context | Size |
|---------|------|
| Sidebar menu | 16px |
| Buttons | 16px |
| Standalone | 24px |

## ✨ Animations & Transitions

### Animation Classes (Tailwind)
Supabase uses `tailwindcss-animate` for standard entrance/exit animations.

```css
/* Entry animations */
animate-in
fade-in-0
zoom-in-95
slide-in-from-top-2
slide-in-from-bottom-2
slide-in-from-left-2
slide-in-from-right-2

/* Exit animations */
animate-out
fade-out-0
zoom-out-95
```

### Standard Transitions
```tsx
// Buttons, interactive elements
className="transition-all duration-200"

// Focus states
className="transition-colors"
```

## 📐 Layout Grid System

### Container Widths
Supabase uses a max-width container system for consistent layouts.

| Breakpoint | Container | Usage |
|------------|-----------|-------|
| **sm** | 640px | Mobile layouts |
| **md** | 768px | Tablet layouts |
| **lg** | 1024px | Desktop layouts |
| **xl** | 1280px | Large desktop |
| **2xl** | 1536px | Extra large screens |

```tsx
// Container component
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Content */}
  </div>
</div>
```

### Grid Patterns
```tsx
// 12-column grid system
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Grid items */}
</div>

// Sidebar + Content layout
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <aside className="lg:col-span-1">
    {/* Sidebar */}
  </aside>
  <main className="lg:col-span-3">
    {/* Main content */}
  </main>
</div>

// Dashboard grid
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
  <Card className="md:col-span-2 xl:col-span-1">Metric 1</Card>
  <Card className="md:col-span-2 xl:col-span-1">Metric 2</Card>
  <Card className="xl:col-span-2">Chart</Card>
  <Card className="xl:col-span-2">Table</Card>
</div>
```

### Flexbox Utilities
```tsx
// Common flex patterns
<div className="flex items-center justify-between">
  <div>Left content</div>
  <div>Right content</div>
</div>

<div className="flex flex-col space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<div className="flex items-center gap-2">
  <Icon className="h-4 w-4" />
  <span>Label</span>
</div>
```

## 🧱 Component Catalog

### 1. Navigation

#### Top Navbar (`LayoutHeader`)
Structure based on `LayoutHeader.tsx`.

```tsx
<div className="flex h-[60px] max-h-[60px] min-h-[60px] items-center justify-between bg-surface-100 px-4 border-b border-border">
  {/* Left: Product Menu / Title */}
  <div className="flex items-center gap-3">
    {showProductMenu && <ProductMenu />}
    <span className="text-sm font-normal text-foreground">{headerTitle}</span>
  </div>

  {/* Right: Actions */}
  <div className="flex items-center gap-2">
    <Button variant="default">Feedback</Button>
    <Button variant="ghost" size="icon"><HelpCircle /></Button>
    <UserMenu />
  </div>
</div>
```

#### Sidebar (`Sidebar`)
Based on `packages/ui/src/components/shadcn/ui/sidebar.tsx` and `Usage`.

```tsx
<SidebarProvider>
  <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
    <SidebarHeader>
        {/* Project Switcher / Logo */}
    </SidebarHeader>
    <SidebarContent>
        <SidebarGroup>
            <SidebarGroupLabel>Project</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton isActive={true}>
                        <Icon />
                        <span>Dashboard</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
        <UserProfile />
    </SidebarFooter>
  </Sidebar>
</SidebarProvider>
```

#### Breadcrumbs
Implemented via `Breadcrumb` component.

```tsx
<nav aria-label="breadcrumb">
  <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-foreground-muted sm:gap-2.5">
    <li className="inline-flex items-center gap-1.5">Link</li>
    <li aria-hidden="true" className="[&>svg]:size-3.5"><ChevronRight /></li>
    <li className="inline-flex items-center gap-1.5"><span className="text-foreground">Current</span></li>
  </ol>
</nav>
```

### 2. Forms & Inputs

#### Button
Variants available: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`.
Sizes: `default` (h-10), `sm` (h-9), `lg` (h-11), `icon` (h-10 w-10).

```tsx
// Primary
<Button variant="default" size="default" className="bg-brand text-white hover:bg-brand-600">
  Save Changes
</Button>

// Outline
<Button variant="outline" className="border-border bg-transparent hover:bg-surface-200">
  Cancel
</Button>
```

#### Input
Standard input styling.

```tsx
<input 
  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
/>
```

#### Select (Styled)
Used for form selections.

```tsx
<Select>
  <SelectTrigger className="flex w-full items-center justify-between rounded-md border border-strong hover:border-stronger bg-alternative dark:bg-muted hover:bg-selection text-xs transition-all duration-200 data-[state=open]:bg-selection data-[state=open]:border-stronger">
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent className="z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-overlay text-foreground shadow-md">
    <SelectItem className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm focus:bg-overlay-hover text-foreground-light focus:text-foreground">
      Option 1
    </SelectItem>
  </SelectContent>
</Select>
```

#### Command (Combobox)
Used for searchable dropdowns, command palettes, and filters.

```tsx
<Command className="flex h-full w-full flex-col overflow-hidden rounded-md bg-overlay text-foreground-light">
  <CommandInput 
    placeholder="Search..." 
    className="flex h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted"
  />
  <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
    <CommandEmpty className="py-6 text-center text-xs">No results found.</CommandEmpty>
    <CommandGroup className="[&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-foreground-muted">
      <CommandItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-xs data-[selected=true]:bg-overlay-hover data-[selected=true]:text-strong">
        <Icon /> Label
      </CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

### 3. Data Display

#### Table
Supabase tables use standard HTML tables with a slightly elevated background (`bg-surface-100`) to distinguish from the page canvas (`bg-background`).

**Table Container Pattern:**
```tsx
<div className="rounded-md border border-border bg-surface-100">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Header</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Cell Data</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
```

**Background Hierarchy:**
| Layer | Variable | Value | Usage |
|-------|----------|-------|-------|
| Page canvas | `bg-background` | `#1C1C1C` | Page/app shell |
| Table container | `bg-surface-100` | `#232323` | Tables, cards, panels |
| Hover state | `bg-surface-200` | `#2a2a2a` | Row hover, selection |

**Key points:**
- Table wrapper uses `bg-surface-100` for visual separation from page
- Empty states also use `bg-surface-100` for consistency
- Row hover uses `hover:bg-muted/50` or `hover:bg-surface-200`

#### Card / Panel
Used for dashboard widgets.

```tsx
<div className="rounded-lg border border-border bg-surface-100 text-card-foreground shadow-sm">
  <div className="flex flex-col space-y-1.5 p-6">
    <h3 className="text-24 font-semibold leading-none tracking-tight">Card Title</h3>
    <p className="text-sm text-muted-foreground">Description</p>
  </div>
  <div className="p-6 pt-0">Content</div>
</div>
```

#### Badge
Variants: `default`, `secondary`, `destructive`, `outline`, `warning`, `brand`.

```tsx
<div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-brand text-primary-foreground hover:bg-brand/80">
  New
</div>
```

### List Page Components

Componentes padronizados para paginas de listagem (ex: Obras, Biblioteca FVS).

**Arquivos:**
- `components/ui/list-page-toolbar.tsx`
- `components/ui/sortable-table-header.tsx`

#### ListPageToolbar
Toolbar padronizado para paginas de listagem com busca, filtro de status e acao primaria.

```tsx
import { ListPageToolbar, type StatusFilter } from '@/components/ui/list-page-toolbar'

// Estado no componente pai
const [searchQuery, setSearchQuery] = useState('')
const [statusFilter, setStatusFilter] = useState<StatusFilter>('ativos')

<ListPageToolbar
  searchPlaceholder="Buscar por nome..."
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  statusFilter={statusFilter}
  onStatusFilterChange={setStatusFilter}
  statusTabs={[
    { value: 'ativos', label: 'Ativos' },
    { value: 'arquivados', label: 'Arquivados' },
    { value: 'todos', label: 'Todos' },
  ]}
  primaryActionLabel="Novo Item"
  onPrimaryAction={handleCreate}
  filteredCount={filteredItems.length}
  totalCount={allItems.length}
  itemLabel="item"
/>
```

**Layout padrao:**
```
[🔍 Busca]  [Tabs: Ativos | Arquivados | Todos]  [+ Botao Acao]
X de Y itens
```

**Props:**
| Prop | Tipo | Descricao |
|------|------|-----------|
| `searchPlaceholder` | `string` | Placeholder do input de busca |
| `searchQuery` | `string` | Valor atual da busca |
| `onSearchChange` | `(query: string) => void` | Handler de mudanca de busca |
| `statusFilter` | `StatusFilter` | Filtro ativo ('ativos' | 'arquivados' | 'todos') |
| `onStatusFilterChange` | `(filter: StatusFilter) => void` | Handler de mudanca de filtro |
| `statusTabs` | `StatusTab[]` | Customiza labels das tabs (opcional) |
| `primaryActionLabel` | `string` | Label do botao primario |
| `onPrimaryAction` | `() => void` | Handler do botao primario |
| `filteredCount` | `number` | Qtd de itens filtrados |
| `totalCount` | `number` | Qtd total de itens |
| `itemLabel` | `string` | Label singular do item (ex: 'obra', 'servico') |

#### SortableTableHeader
Header de tabela com suporte a ordenacao. Icone aparece no hover, ativo mostra direcao.

```tsx
import {
  SortableTableHeader,
  useSortState,
  type SortDirection
} from '@/components/ui/sortable-table-header'

// Usar hook para gerenciar estado
const { sortField, sortDirection, handleSort } = useSortState<'nome' | 'data'>('nome', 'asc')

<TableHeader>
  <TableRow>
    <SortableTableHeader
      field="nome"
      currentField={sortField}
      currentDirection={sortDirection}
      onSort={handleSort}
    >
      Nome
    </SortableTableHeader>
    <SortableTableHeader
      field="data"
      currentField={sortField}
      currentDirection={sortDirection}
      onSort={handleSort}
      className="w-[120px]"
    >
      Data
    </SortableTableHeader>
    <TableHead className="w-[50px]">Acoes</TableHead>
  </TableRow>
</TableHeader>
```

**Comportamento:**
- Click alterna asc/desc se coluna ja ativa
- Click em outra coluna muda para ela com asc
- Icone de setas visivel apenas no hover (opacity-0 -> group-hover:opacity-40)
- Coluna ativa mostra seta direcional (opacity-100)

**Helpers disponiveis:**
- `useSortState<T>()` - Hook para gerenciar estado de ordenacao
- `sortItems<T>()` - Funcao generica para ordenar arrays

#### Padrao de Pagina de Listagem Completo

```tsx
// page.tsx (Server Component)
export default async function ListPage() {
  const items = await fetchAllItems() // incluir arquivados

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-foreground">Titulo</h1>
          <p className="text-sm text-foreground-light mt-1">Descricao</p>
        </div>
        <ListPageClient initialItems={items} />
      </div>
    </div>
  )
}

// _components/list-page-client.tsx (Client Component)
'use client'

export function ListPageClient({ initialItems }) {
  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ativos')

  // Sort state
  const { sortField, sortDirection, handleSort } = useSortState('created_at', 'desc')

  // Filter and sort
  const filteredItems = useMemo(() => {
    let result = [...initialItems]

    // Status filter
    if (statusFilter === 'ativos') {
      result = result.filter(i => !i.arquivado)
    } else if (statusFilter === 'arquivados') {
      result = result.filter(i => i.arquivado)
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(i => i.nome.toLowerCase().includes(q))
    }

    // Sort
    return sortItems(result, sortField, sortDirection)
  }, [initialItems, statusFilter, searchQuery, sortField, sortDirection])

  return (
    <div className="space-y-4">
      <ListPageToolbar ... />
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHeader field="nome" ... >Nome</SortableTableHeader>
            ...
          </TableRow>
        </TableHeader>
        <TableBody>...</TableBody>
      </Table>
    </div>
  )
}
```

### 4. Feedback & User Guidance

#### Modal (`Dialog`)
Uses Radix UI primitives.

```tsx
<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent className="sm:max-w-[425px] bg-background border-border">
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>Make changes to your profile here.</DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      {/* Form Content */}
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

#### Sheet (Side Panel)
Side panels for longer forms or detailed views.

```tsx
<Sheet>
  <SheetTrigger>Open</SheetTrigger>
  <SheetContent side="right" className="bg-background border-l border-border">
    <SheetHeader>
      <SheetTitle>Edit Profile</SheetTitle>
      <SheetDescription>Make changes here.</SheetDescription>
    </SheetHeader>
    {/* Form content */}
    <SheetFooter>
      <Button>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

#### Popover
Used for small overlays, dates, colors, etc.

```tsx
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent 
    sideOffset={4}
    className="z-50 w-72 rounded-md border border-overlay bg-overlay p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2"
  >
    Content
  </PopoverContent>
</Popover>
```

#### Tooltip
```tsx
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger>Hover me</TooltipTrigger>
    <TooltipContent side="top" className="bg-popover text-popover-foreground border-border">
      <p>Add to library</p>
    </TooltipContent>
  </Tooltip>
```

#### Toast (Sonner)
System notifications.

```tsx
// Success
toast.success('Table created successfully')
// Error
toast.error('Connection failed')
```

#### Empty States
Pattern for when no data is available.

```tsx
// Presentational (Initial State)
<div className="flex flex-col items-center justify-center py-16 text-center">
  <Icon className="h-12 w-12 text-foreground-muted mb-4" />
  <h3 className="text-lg font-medium text-foreground">No tables yet</h3>
  <Button className="mt-4">Create table</Button>
</div>
```

#### Loading States
```tsx
// Skeleton
<div className="animate-pulse rounded-md bg-surface-200 h-4 w-[250px]" />

// Loading Text (Action-Verb based)
"Deleting..." / "Saving..." / "Creating..."
```

### 5. Interactive Components

#### Dropdown Menu
Context menus and action menus.

```tsx
<DropdownMenu modal={false}>
  <DropdownMenuTrigger>
    <Button variant="ghost" size="icon"><MoreVertical /></Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border border-overlay bg-overlay p-1 text-foreground-light shadow-md w-64">
    <DropdownMenuItem className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-xs outline-none transition-colors focus:bg-overlay-hover focus:text-foreground">
      Edit
    </DropdownMenuItem>
    <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-border-overlay" />
    <DropdownMenuItem className="text-destructive">
      Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

#### Form Layout
Standard Supabase form pattern using `react-hook-form` and `zod`.

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="username"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input placeholder="shadcn" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </form>
</Form>
```

### Form Validation States
```tsx
// Error State
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input
          {...field}
          className={form.formState.errors.email ? "border-destructive" : ""}
        />
      </FormControl>
      <FormMessage className="text-destructive text-xs" />
    </FormItem>
  )}
/>

// Success State
<FormField
  control={form.control}
  name="name"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Name</FormLabel>
      <FormControl>
        <Input {...field} className="border-brand" />
      </FormControl>
      <FormMessage className="text-brand text-xs" />
    </FormItem>
  )}
/>
```

### Form Item Layout (Horizontal)
```tsx
<FormField
  control={form.control}
  name="setting"
  render={({ field }) => (
    <FormItemLayout layout="horizontal" label="Setting Name">
      <FormControl className="col-span-6">
        <Input {...field} />
      </FormControl>
    </FormItemLayout>
  )}
/>
```

## 📊 Data Visualization

### Charts (using recharts)
Supabase uses Recharts for data visualization.

#### Bar Chart
```tsx
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-default))" />
    <XAxis
      dataKey="name"
      axisLine={false}
      tickLine={false}
      tick={{ fontSize: 12, fill: 'hsl(var(--foreground-lighter))' }}
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{ fontSize: 12, fill: 'hsl(var(--foreground-lighter))' }}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: 'hsl(var(--background-overlay))',
        border: '1px solid hsl(var(--border-overlay))',
        borderRadius: '6px'
      }}
    />
    <Bar dataKey="value" fill="hsl(var(--brand-default))" radius={[4, 4, 0, 0]} />
  </BarChart>
</ResponsiveContainer>
```

#### Line Chart
```tsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-default))" />
    <XAxis
      dataKey="date"
      axisLine={false}
      tickLine={false}
      tick={{ fontSize: 12, fill: 'hsl(var(--foreground-lighter))' }}
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={{ fontSize: 12, fill: 'hsl(var(--foreground-lighter))' }}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: 'hsl(var(--background-overlay))',
        border: '1px solid hsl(var(--border-overlay))',
        borderRadius: '6px'
      }}
    />
    <Line
      type="monotone"
      dataKey="value"
      stroke="hsl(var(--brand-default))"
      strokeWidth={2}
      dot={{ fill: 'hsl(var(--brand-default))', strokeWidth: 0, r: 4 }}
    />
  </LineChart>
</ResponsiveContainer>
```

### Metrics Cards
```tsx
<Card className="bg-surface-100 border-border">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium text-foreground-light">
      Total Users
    </CardTitle>
    <Users className="h-4 w-4 text-foreground-muted" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold text-foreground">2,350</div>
    <p className="text-xs text-foreground-lighter">
      +20.1% from last month
    </p>
  </CardContent>
</Card>
```

### Status Indicators
```tsx
// Status Badge
<Badge variant={status === 'active' ? 'default' : 'secondary'} className="text-xs">
  {status}
</Badge>

// Status Dot
<div className="flex items-center gap-2">
  <div className={`w-2 h-2 rounded-full ${
    status === 'online' ? 'bg-brand' :
    status === 'offline' ? 'bg-foreground-muted' :
    'bg-warning'
  }`} />
  <span className="text-sm text-foreground-light">{status}</span>
</div>
```

#### Confirmation Modal (`AlertDialog`)
Distinct from standard Dialog, used for "Are you sure?" styles.

```tsx
<AlertDialog>
  <AlertDialogTrigger>Delete</AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### Tabs
Used for organizing content into separate views.

```tsx
<Tabs defaultValue="overview" className="w-full">
  <TabsList className="grid w-full grid-cols-3 bg-surface-200">
    <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
    <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
    <TabsTrigger value="settings" className="text-xs">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="overview" className="mt-6">
    Overview content
  </TabsContent>
  <TabsContent value="logs" className="mt-6">
    Logs content
  </TabsContent>
</Tabs>
```

#### Accordion
Collapsible content sections.

```tsx
<Accordion type="single" collapsible className="w-full">
  <AccordionItem value="item-1">
    <AccordionTrigger className="text-sm font-medium">Section 1</AccordionTrigger>
    <AccordionContent className="text-sm text-foreground-light">
      Content for section 1
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger className="text-sm font-medium">Section 2</AccordionTrigger>
    <AccordionContent className="text-sm text-foreground-light">
      Content for section 2
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

#### Alert/Admonition
Contextual information banners.

```tsx
// Info/Warning
<Alert className="border-warning bg-warning-200">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>
    This action cannot be undone.
  </AlertDescription>
</Alert>

// Error
<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Failed to connect to database.
  </AlertDescription>
</Alert>
```

#### Toggle/Switch
Binary state controls.

```tsx
<Switch
  checked={enabled}
  onCheckedChange={setEnabled}
  className="data-[state=checked]:bg-brand"
/>
```

#### Radio Group
Single selection from multiple options.

```tsx
<RadioGroup value={value} onValueChange={setValue}>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option1" id="option1" />
    <Label htmlFor="option1">Option 1</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option2" id="option2" />
    <Label htmlFor="option2">Option 2</Label>
  </div>
</RadioGroup>
```

#### Checkbox
Multiple selection or binary choice.

```tsx
<div className="flex items-center space-x-2">
  <Checkbox
    id="terms"
    checked={accepted}
    onCheckedChange={setAccepted}
  />
  <Label htmlFor="terms" className="text-sm">
    Accept terms and conditions
  </Label>
</div>
```

#### Progress Bar
Loading states and progress indicators.

```tsx
<Progress value={progress} className="w-full" />
```

#### Avatar
User profile images and placeholders.

```tsx
<Avatar className="h-8 w-8">
  <AvatarImage src={user.avatar} alt={user.name} />
  <AvatarFallback className="bg-surface-200 text-xs">
    {user.initials}
  </AvatarFallback>
</Avatar>
```

#### Separator/Divider
Visual content separation.

```tsx
<Separator className="my-4" />
```

#### Code Block
Syntax-highlighted code display.

```tsx
<div className="relative">
  <pre className="bg-surface-200 border border-border rounded-md p-4 overflow-x-auto">
    <code className="text-xs font-mono text-foreground">
      {`const example = "Hello World";`}
    </code>
  </pre>
  <Button
    variant="ghost"
    size="icon"
    className="absolute top-2 right-2 h-6 w-6"
  >
    <Copy className="h-3 w-3" />
  </Button>
</div>
```

#### Pagination
Navigation for large datasets.

```tsx
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const getVisiblePages = () => {
    // Logic to show pages like: 1 ... 5 6 7 ... 20
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) rangeWithDots.push(1, '...')
    rangeWithDots.push(...range)
    if (currentPage + delta < totalPages - 1) rangeWithDots.push('...', totalPages)

    return rangeWithDots
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-foreground-light">
        Showing page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center space-x-1">
          {currentPage > 3 && (
            <Button
              variant={1 === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(1)}
            >
              1
            </Button>
          )}
          {currentPage > 4 && <MoreHorizontal className="h-4 w-4 text-foreground-muted" />}

          {getVisiblePages().map((page, index) => (
            typeof page === 'number' ? (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
              >
                {page}
              </Button>
            ) : (
              <MoreHorizontal key={index} className="h-4 w-4 text-foreground-muted" />
            )
          ))}

          {currentPage < totalPages - 3 && <MoreHorizontal className="h-4 w-4 text-foreground-muted" />}
          {currentPage < totalPages - 2 && (
            <Button
              variant={totalPages === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </Button>
          )}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
```

#### Data Table (Advanced)
Complex data tables with sorting, filtering, and actions (based on Supabase's DataTable component).

```tsx
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="max-w-sm"
            />
          )}
          {/* Additional filters can go here */}
        </div>
        <DataTableViewOptions table={table} />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Pagination
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      </div>
    </div>
  )
}
```

#### Search & Filter Components
Advanced filtering and search capabilities.

```tsx
// Filter Sidebar
<div className="w-80 border-l border-border bg-surface-100 p-6">
  <div className="space-y-6">
    <div>
      <h3 className="text-sm font-medium mb-3">Filters</h3>
      <div className="space-y-3">
        {/* Status Filter */}
        <div>
          <Label className="text-xs text-foreground-light">Status</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div>
          <Label className="text-xs text-foreground-light">Date Range</Label>
          <div className="flex gap-2">
            <Input type="date" placeholder="From" />
            <Input type="date" placeholder="To" />
          </div>
        </div>

        {/* Tags Filter */}
        <div>
          <Label className="text-xs text-foreground-light">Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-surface-200"
                onClick={() => toggleTag(tag)}
              >
                {tag}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={clearFilters}>
        Clear all
      </Button>
      <Button size="sm">Apply filters</Button>
    </div>
  </div>
</div>
```

## 🏗️ Page Layout Components

### Page Container
Responsive container for page content (based on ScaffoldContainer).

```tsx
import { cn } from 'ui'

interface PageContainerProps {
  children: React.ReactNode
  size?: 'small' | 'default' | 'large' | 'full'
  className?: string
}

const PageContainer = ({ children, size = 'default', className }: PageContainerProps) => {
  const maxWidthClass = {
    small: 'max-w-[768px]',
    default: 'max-w-[1200px]',
    large: 'max-w-[1600px]',
    full: 'max-w-none',
  }[size]

  return (
    <div
      className={cn(
        'mx-auto w-full @container',
        maxWidthClass,
        'px-4 @lg:px-6 @xl:px-10',
        className
      )}
    >
      {children}
    </div>
  )
}
```

### Page Header
Structured page header with title, subtitle, actions, and metadata.

```tsx
interface PageHeaderProps {
  children?: React.ReactNode
  size?: 'small' | 'default' | 'large' | 'full'
}

const PageHeader = ({ children, size = 'default' }: PageHeaderProps) => (
  <div
    className={cn(
      'w-full',
      size === 'full' && 'max-w-none pt-6 px-10 border-b',
      size !== 'full' && 'pt-12',
      'pb-8'
    )}
  >
    {children}
  </div>
)

interface PageHeaderMetaProps {
  children: React.ReactNode
}

const PageHeaderMeta = ({ children }: PageHeaderMetaProps) => (
  <div className="flex flex-col gap-3">{children}</div>
)

interface PageHeaderSummaryProps {
  children: React.ReactNode
}

const PageHeaderSummary = ({ children }: PageHeaderSummaryProps) => (
  <div className="flex items-center gap-3">{children}</div>
)

interface PageHeaderTitleProps {
  children: React.ReactNode
}

const PageHeaderTitle = ({ children }: PageHeaderTitleProps) => (
  <h1 className="text-3xl font-normal text-foreground">{children}</h1>
)
```

### Page Section
Content sections within pages.

```tsx
interface PageSectionProps {
  children: React.ReactNode
  className?: string
}

const PageSection = ({ children, className }: PageSectionProps) => (
  <section className={cn('py-6', className)}>{children}</section>
)

interface PageSectionContentProps {
  children: React.ReactNode
  className?: string
}

const PageSectionContent = ({ children, className }: PageSectionContentProps) => (
  <div className={cn('space-y-4', className)}>{children}</div>
)
```

### Scaffold Components
Low-level layout primitives (from Scaffold.tsx).

```tsx
// ScaffoldSection - Main content area
<div className="flex flex-col first:pt-12 py-6 gap-3">
  {/* Content */}
</div>

// ScaffoldSectionDetail - Left column for details
<div className="col-span-4 xl:col-span-5 prose text-sm">
  {/* Detail content */}
</div>

// ScaffoldSectionContent - Right column for main content
<div className="col-span-8 xl:col-span-7 flex flex-col gap-6">
  {/* Main content */}
</div>
```

## 📐 Page Layout Patterns

### 1. Settings Layout
```tsx
<PageContainer size="default">
  <PageHeader size="default" />
  <PageSection>...</PageSection>
</PageContainer>
```

### 2. List Layout (Tables)
```tsx
<PageContainer size="large">
  <PageHeader size="large" />
  <PageSection>
    <TableActions /> {/* Filters, Search */}
    <Table />
  </PageSection>
</PageContainer>
```

### 3. Full-Page Layout
For specialized editors (SQL, Table Editor).
```tsx
<PageContainer size="full">
  <PageHeader size="full" />
  <div className="h-full w-full">
     {/* Content spans full viewport */}
  </div>
</PageContainer>
```

### 4. Dashboard Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <Panel>
    <PanelContent>
       <PanelHeader title="Database" icon={<DatabaseIcon />} />
       <BarChart />
    </PanelContent>
  </Panel>
</div>
```

### 5. Detail View Layout
For showing detailed information with actions.

```tsx
<div className="flex flex-col h-full">
  {/* Header with actions */}
  <div className="flex items-center justify-between p-6 border-b border-border">
    <div>
      <h1 className="text-2xl font-normal text-foreground">Project Name</h1>
      <p className="text-sm text-foreground-light mt-1">Project description</p>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline">Settings</Button>
      <Button>Edit</Button>
    </div>
  </div>

  {/* Content */}
  <div className="flex-1 overflow-auto p-6">
    <div className="max-w-4xl mx-auto space-y-8">
      <Card>...</Card>
      <Card>...</Card>
    </div>
  </div>
</div>
```

## 🔄 State Management Patterns

### Loading States
```tsx
// Skeleton Loading
const LoadingState = () => (
  <div className="space-y-4">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
    <Skeleton className="h-4 w-[300px]" />
  </div>
)

// Spinner Loading
const SpinnerState = () => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="h-6 w-6 animate-spin text-foreground-muted" />
  </div>
)

// Button Loading
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  {isLoading ? 'Saving...' : 'Save Changes'}
</Button>
```

### Error States
```tsx
const ErrorState = ({ error, onRetry }: { error: string; onRetry?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle className="h-12 w-12 text-destructive mb-4" />
    <h3 className="text-lg font-medium text-foreground mb-2">Something went wrong</h3>
    <p className="text-sm text-foreground-lighter mb-4 max-w-md">{error}</p>
    {onRetry && (
      <Button variant="outline" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
)
```

### Empty States
```tsx
const EmptyState = ({ title, description, action }: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Database className="h-12 w-12 text-foreground-muted mb-4" />
    <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
    <p className="text-sm text-foreground-lighter mb-6 max-w-md">{description}</p>
    {action}
  </div>
)
```

## ⚡ Performance Guidelines

### Code Splitting
```tsx
// Lazy load heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart'))

// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Settings = lazy(() => import('./pages/Settings'))
```

### Image Optimization
```tsx
// Use Next.js Image component
import Image from 'next/image'

<Image
  src={src}
  alt={alt}
  width={width}
  height={height}
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

### Virtualization for Large Lists
```tsx
// Use react-window for large datasets
import { FixedSizeList as List } from 'react-window'

<List
  height={400}
  itemCount={items.length}
  itemSize={50}
>
  {({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  )}
</List>
```

### Memoization
```tsx
// Memoize expensive computations
const filteredItems = useMemo(
  () => items.filter(item => item.status === 'active'),
  [items]
)

// Memoize components
const MemoizedComponent = memo(({ data }) => {
  return <div>{data.value}</div>
})
```

## 📄 Copywriting

### Voice & Tone
- **Direct**: Say what something does, not what it "enables".
- **Action-oriented**: Focus on what happens.
- **Technical without jargon**.

### Buttons
| Bad | Good |
|-----|------|
| "Submit" | "Create table" |
| "Remove" | "Delete project" |
| "OK" | "Confirm" |

### Error Messages
State what went wrong, then how to fix it.
**Good**: "Table name already exists. Choose a different name."
**Bad**: "An error occurred."

## ♿ Accessibility

### Focus Management
- Interactive elements must have `tabIndex={0}` if not native.
- Use `inset-focus` class for complex clickable areas like table rows.
- **Focus Ring**: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.

### Semantic HTML
- Use `sr-only` for visual-only scaffolding labels.
- Use `aria-label` for icons without text.
- Use `aria-hidden={true}` for decorative icons.
- Use proper heading hierarchy (h1-h6).
- Use `role` attributes when semantic elements aren't available.

### Keyboard Navigation
- All interactive elements must be keyboard accessible.
- Use logical tab order.
- Provide keyboard shortcuts for common actions.
- Ensure focus indicators are visible.

### Screen Reader Support
- Write descriptive alt text for images.
- Use `aria-describedby` to link help text.
- Avoid `aria-hidden` on interactive elements.
- Test with screen readers (NVDA, JAWS, VoiceOver).

## 🧪 Testing Guidelines

### Component Testing
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('handles click events', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>Click me</Button>)
    await user.click(screen.getByRole('button', { name: 'Click me' }))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading state', () => {
    render(<Button loading>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})
```

### Visual Regression Testing
```tsx
// Use Chromatic or similar for visual testing
import { render } from '@testing-library/react'

describe('Button', () => {
  it('matches snapshot', () => {
    const { container } = render(<Button>Click me</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })
})
```

### Accessibility Testing
```tsx
import { axe } from 'jest-axe'

describe('Button', () => {
  it('is accessible', async () => {
    const { container } = render(<Button>Click me</Button>)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

## 🌐 Internationalization (i18n)

### Text Keys Structure
```
components.button.save=Save Changes
components.button.cancel=Cancel
components.table.empty=No data available
pages.dashboard.title=Dashboard
```

### Usage in Components
```tsx
import { useTranslation } from 'react-i18next'

const Button = ({ children, ...props }) => {
  const { t } = useTranslation()

  return (
    <button {...props}>
      {children || t('components.button.save')}
    </button>
  )
}
```

### Date/Time Formatting
```tsx
import { format } from 'date-fns'
import { ptBR, enUS } from 'date-fns/locale'

// Use locale-aware formatting
const formattedDate = format(date, 'PPP', { locale: currentLocale })
```

### Number Formatting
```tsx
// Use Intl.NumberFormat for locale-aware numbers
const formatter = new Intl.NumberFormat(currentLocale, {
  style: 'currency',
  currency: 'USD'
})

const price = formatter.format(1234.56) // $1,234.56 or R$ 1.234,56
```

## 🚨 Error Handling Patterns

### Error Boundaries
```tsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // Log to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />
    }

    return this.props.children
  }
}
```

### API Error Handling
```tsx
const useApiCall = (apiFunction) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  })

  const execute = useCallback(async (...args) => {
    setState({ data: null, loading: true, error: null })

    try {
      const data = await apiFunction(...args)
      setState({ data, loading: false, error: null })
      return data
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setState({ data: null, loading: false, error: errorMessage })
      throw error
    }
  }, [apiFunction])

  return { ...state, execute }
}

// Usage
const { data, loading, error, execute } = useApiCall(saveProject)

const handleSave = async () => {
  try {
    await execute(projectData)
    toast.success('Project saved successfully')
  } catch (error) {
    toast.error('Failed to save project')
  }
}
```

### Form Error Handling
```tsx
const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

const onSubmit = async (values) => {
  try {
    await apiCall(values)
    toast.success('Success!')
  } catch (error) {
    if (error.status === 422) {
      form.setError('email', { message: 'Email already exists' })
    } else {
      toast.error('Something went wrong')
    }
  }
}
```

## 🧰 Design Tokens & Utilities

### Z-Index Scale
| Component | Z-Index |
|-----------|---------|
| Sidebar | 30 |
| Dropdown/Popover | 50 |
| Modal Backdrop | 50 |
| Modal Content | 50 |
| Toast | 100 |

### Tailwind Shorthands
These map to the theme variables.

| Shorthand | Equivalent |
|-----------|------------|
| `text-muted` | `text-foreground-muted` |
| `text-light` | `text-foreground-light` |
| `text-lighter` | `text-foreground-lighter` |
| `bg-surface-100` | `bg-background-surface-100` |
| `bg-overlay` | `bg-background-overlay` |
| `border-strong` | `border-border-strong` |
| `border-overlay` | `border-border-overlay` |

## 📱 Breakpoints
* `sm`: 640px
* `md`: 768px
* `lg`: 1024px
* `xl`: 1280px
* `2xl`: 1536px

## 📋 Versioning & Contribution

### Versioning Strategy
- **Major**: Breaking changes (renamed components, removed APIs)
- **Minor**: New features (new components, new variants)
- **Patch**: Bug fixes, documentation updates

### Contribution Process
1. **Design Review**: New components need design approval
2. **Implementation**: Follow established patterns
3. **Documentation**: Update this design system document
4. **Testing**: Add comprehensive tests
5. **Review**: Code review + design review

### Adding New Components
```tsx
// 1. Create component in packages/ui/src/components
// 2. Export from packages/ui/src/index.tsx
// 3. Add to design system documentation
// 4. Create Storybook story
// 5. Add unit tests
// 6. Update TypeScript types
```

### Deprecation Process
1. Mark component as `@deprecated` in JSDoc
2. Add deprecation warning in console
3. Update documentation
4. Remove in next major version

## 🌐 Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced features for modern browsers
- Graceful degradation for older browsers

## 🔧 Implementation Notes

### CSS Architecture
- Use CSS custom properties for theming
- Prefer utility-first approach with Tailwind
- Avoid deep component styles
- Use CSS modules for component-specific styles

### JavaScript Guidelines
```tsx
// Prefer function components
const Component = ({ prop }: Props) => {
  return <div>{prop}</div>
}

// Use TypeScript for type safety
interface Props {
  prop: string
}

// Follow React best practices
const Component = memo<Props>(({ prop }) => {
  return <div>{prop}</div>
})
```

### File Structure
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── Button.stories.tsx
│   │   │   └── index.ts
│   │   └── ...
│   ├── styles/
│   │   ├── colors.css
│   │   └── typography.css
│   └── index.tsx
└── build/
```

### Build System
- Use Vite for development
- Bundle with Rollup
- Generate TypeScript declarations
- Minify and optimize for production

## 📚 Resources

### External Libraries
- **UI Primitives**: Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **Styling**: Tailwind CSS
- **Testing**: Testing Library + Jest

### Development Tools
- **Storybook**: Component development
- **Chromatic**: Visual testing
- **ESLint + Prettier**: Code quality
- **TypeScript**: Type checking

## 🌗 Theme Implementation

### Dark Mode (Default)
Variables defined in `:root`.

### Light Mode
Override variables in `[data-theme='light']`:
```css
[data-theme='light'] {
  --background-default: 0deg 0% 100%;
  --background-surface-100: 0deg 0% 98%;
  --foreground-default: 0deg 0% 9%;
  --border-default: 0deg 0% 89%;
  /* ... mappings inverse to dark ... */
}
```

### Theme Switching
```tsx
const [theme, setTheme] = useState<'light' | 'dark'>('dark')

useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme)
}, [theme])
```

## 🚀 Implementation Guide

### Quick Start
1. **Install dependencies**: `@tanstack/react-table`, `lucide-react`, `react-hook-form`, `zod`
2. **Copy CSS variables** from the CSS Variables section
3. **Use the component patterns** as shown in examples
4. **Follow the layout patterns** for consistent page structure

### Development Workflow
1. **Check existing components** in this design system first
2. **Follow established patterns** for consistency
3. **Add new components** to this document when created
4. **Test across breakpoints** and themes
5. **Update documentation** with new implementations

### Common Patterns
```tsx
// Page structure
const MyPage = () => (
  <PageHeader size="large">
    <PageHeaderMeta>
      <PageHeaderSummary>
        <PageHeaderTitle>My Page</PageHeaderTitle>
      </PageHeaderSummary>
    </PageHeaderMeta>
  </PageHeader>
  <PageContainer size="large">
    <PageSection>
      <PageSectionContent>
        {/* Your content */}
      </PageSectionContent>
    </PageSection>
  </PageContainer>
)

// Form structure
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField name="field">
      <FormItemLayout layout="horizontal" label="Label">
        <FormControl>
          <Input {...field} />
        </FormControl>
      </FormItemLayout>
    </FormField>
  </form>
</Form>

// Table with actions
<div className="space-y-4">
  <div className="flex justify-between items-center">
    <Input placeholder="Search..." className="max-w-sm" />
    <Button>New Item</Button>
  </div>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Actions</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id}>
          <TableCell>{item.name}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

## ✅ Status: 100% Supabase Clone
This document represents the visual design system of Supabase Studio as analyzed from the `apps/studio` and `packages/ui` source code. It is the Single Source of Truth for reproducing the UI.

**Last Updated**: January 2026
**Version**: 1.0.0
**Based on Supabase Studio**: Latest production version
**Coverage**: Complete - includes all major components, patterns, and implementation details
