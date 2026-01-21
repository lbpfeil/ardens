# Phase 5: Biblioteca FVS - Research

**Researched:** 2026-01-21
**Domain:** CRUD servicos + itens_servico, activation in obras
**Confidence:** HIGH

## Summary

Phase 5 implements the FVS Library management system, allowing users to create and manage construction verification services (servicos) and their verification items (itens_servico). The phase also includes activating/deactivating services per obra via the `obra_servicos` junction table.

The domain model is well-defined in the existing database schema. The implementation follows established patterns from Phases 2-4 (Obras CRUD with Server Component + Client Wrapper pattern). The sidebar already has a placeholder for `/app/biblioteca` with badge "Em breve".

**Primary recommendation:** Follow the exact patterns established in `obras-page-client.tsx` and `obras-table.tsx` for the main biblioteca page, and use the `SplitViewLayout` pattern from unidades for the servico detail page (servico + itens_servico).

## Database Schema Analysis

### Core Tables

**servicos** (FVS Services - Biblioteca do cliente)
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `cliente_id` | UUID | yes | FK to clientes (tenant isolation) |
| `codigo` | VARCHAR(50) | yes | Service code (e.g., PRC-001, REJ-003) |
| `nome` | VARCHAR(255) | yes | Service name |
| `categoria` | ENUM | no | categoria_servico (fundacao, estrutura, alvenaria, etc.) |
| `referencia_normativa` | TEXT | no | NBR, PBQP-H reference |
| `ativo` | BOOLEAN | default true | Active status |
| `arquivado` | BOOLEAN | default false | Soft delete flag |
| `created_at` | TIMESTAMPTZ | auto | |
| `updated_at` | TIMESTAMPTZ | auto | |

**UNIQUE constraint:** `(cliente_id, codigo)` - codigo must be unique per client

**itens_servico** (Verification Items)
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `servico_id` | UUID | yes | FK to servicos (CASCADE delete) |
| `observacao` | TEXT | yes | What to verify |
| `metodo` | TEXT | no | How to verify |
| `tolerancia` | TEXT | no | Acceptance criteria |
| `ordem` | INT | default 0 | Display order |
| `created_at` | TIMESTAMPTZ | auto | |
| `updated_at` | TIMESTAMPTZ | auto | |

**obra_servicos** (Services active per obra)
| Column | Type | Required | Description |
|--------|------|----------|-------------|
| `id` | UUID | auto | Primary key |
| `obra_id` | UUID | yes | FK to obras |
| `servico_id` | UUID | yes | FK to servicos (RESTRICT delete) |
| `ativo` | BOOLEAN | default true | Active in this obra |
| `created_at` | TIMESTAMPTZ | auto | |

**UNIQUE constraint:** `(obra_id, servico_id)` - one activation record per obra-servico pair

### categoria_servico ENUM Values

```sql
'fundacao'           -- Fundacao
'estrutura'          -- Estrutura
'alvenaria'          -- Alvenaria
'revestimento'       -- Revestimento
'acabamento'         -- Acabamento
'instalacoes'        -- Instalacoes (eletrica, hidraulica, etc)
'cobertura'          -- Cobertura/Telhado
'esquadrias'         -- Portas, janelas
'pintura'            -- Pintura
'impermeabilizacao'  -- Impermeabilizacao
'outros'             -- Outros servicos
```

### RLS Policies

**servicos:**
- SELECT: All users of the client can see the library (`cliente_id = get_user_cliente_id()`)
- INSERT/UPDATE/DELETE: Only admin (`is_admin()`)

**itens_servico:**
- SELECT: Follows servico visibility
- INSERT/UPDATE/DELETE: Only admin

**obra_servicos:**
- SELECT: Users with obra access
- INSERT/DELETE: Admin or Engineer with obra access (`is_admin_or_engenheiro()`)

### Key Relationships

```
clientes (1) ----< (N) servicos
servicos (1) ----< (N) itens_servico
servicos (N) >----< (N) obras (via obra_servicos)
```

## Existing Patterns to Follow

### 1. Server Component + Client Wrapper Pattern

From `arden/app/app/obras/page.tsx`:

```typescript
// page.tsx - Server Component (fetch data)
export default async function BibliotecaPage() {
  const supabase = await createClient()
  const { data: servicos, error } = await supabase
    .from('servicos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-6 bg-background min-h-full">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-normal text-foreground">Biblioteca FVS</h1>
          <p className="text-sm text-foreground-light mt-1">
            Gerencie os servicos de verificacao da construtora
          </p>
        </div>
        <BibliotecaPageClient initialServicos={servicos || []} />
      </div>
    </div>
  )
}
```

### 2. Client Wrapper State Management Pattern

From `obras-page-client.tsx`:

```typescript
export function BibliotecaPageClient({ initialServicos }: Props) {
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingServico, setEditingServico] = useState<Servico | null>(null)
  const [archivingServico, setArchivingServico] = useState<Servico | null>(null)

  const handleCreateClick = () => { setEditingServico(null); setIsModalOpen(true) }
  const handleEditClick = (s: Servico) => { setEditingServico(s); setIsModalOpen(true) }
  const handleArchiveClick = (s: Servico) => { setArchivingServico(s) }
  const handleModalSuccess = () => { setIsModalOpen(false); router.refresh() }

  return (
    <>
      <ServicosTable ... />
      <ServicoFormModal mode={editingServico ? 'edit' : 'create'} servico={editingServico} ... />
      <ArchiveConfirmation servico={archivingServico} ... />
    </>
  )
}
```

### 3. Form Modal Pattern with Mode Prop

From `obra-form-modal.tsx`:

```typescript
interface ServicoFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  mode?: 'create' | 'edit'
  servico?: Servico | null
}
```

### 4. Data Access Layer Pattern

Create `arden/lib/supabase/queries/servicos.ts`:

```typescript
// Type definitions
export interface Servico { ... }
export interface ServicoInsert { ... }
export interface ServicoUpdate { ... }

// CRUD operations
export async function listServicos(options?: { includeArchived?: boolean }): Promise<Servico[]>
export async function getServico(id: string): Promise<Servico>
export async function createServico(data: ServicoInsert): Promise<Servico>
export async function updateServico(id: string, updates: ServicoUpdate): Promise<Servico>
export async function archiveServico(id: string): Promise<Servico>
```

### 5. Split View Pattern for Master-Detail

From `unidades/` - use for Servico detail page with itens_servico:

```typescript
<SplitViewLayout
  leftPanel={<ServicoInfoPanel servico={servico} />}
  rightPanel={<ItensServicoPanel servico={servico} />}
/>
```

### 6. Table with Selection Pattern

From `unidades-panel.tsx`:

```typescript
const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())

const handleCheckAll = (checked: boolean) => {
  setCheckedIds(checked ? new Set(items.map(i => i.id)) : new Set())
}

const handleCheckOne = (id: string, checked: boolean) => {
  setCheckedIds(prev => {
    const next = new Set(prev)
    checked ? next.add(id) : next.delete(id)
    return next
  })
}
```

## Domain Model Details

### Servico Validation Rules

```typescript
// arden/lib/validations/servico.ts
export const categoriaServicoOptions = [
  { value: 'fundacao', label: 'Fundacao' },
  { value: 'estrutura', label: 'Estrutura' },
  { value: 'alvenaria', label: 'Alvenaria' },
  { value: 'revestimento', label: 'Revestimento' },
  { value: 'acabamento', label: 'Acabamento' },
  { value: 'instalacoes', label: 'Instalacoes' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'esquadrias', label: 'Esquadrias' },
  { value: 'pintura', label: 'Pintura' },
  { value: 'impermeabilizacao', label: 'Impermeabilizacao' },
  { value: 'outros', label: 'Outros' },
] as const

export const servicoFormSchema = z.object({
  codigo: requiredString(1, 50, 'Codigo'),
  nome: requiredString(3, 255, 'Nome'),
  categoria: z.enum([...categoriaServicoOptions.map(o => o.value)]).optional(),
  referencia_normativa: optionalString(500),
})
```

### ItemServico Validation Rules

```typescript
// arden/lib/validations/item-servico.ts
export const itemServicoFormSchema = z.object({
  observacao: requiredString(3, 1000, 'Observacao'),
  metodo: optionalString(1000),
  tolerancia: optionalString(500),
})
```

### Business Rules

1. **Codigo uniqueness**: codigo must be unique per cliente (UNIQUE constraint in DB)
2. **Soft delete**: servicos are archived, not hard deleted (arquivado = true)
3. **CASCADE delete**: itens_servico are deleted when servico is deleted
4. **RESTRICT delete**: servico cannot be deleted if obra_servicos exist (use archive instead)
5. **Minimum 1 item**: Business rule - servico should have at least 1 item_servico (UI validation)

## UI Component Inventory

### Available Components (No New Components Needed)

| Component | Location | Use Case |
|-----------|----------|----------|
| `Dialog` | `components/ui/dialog.tsx` | Modals for create/edit |
| `Table` | `components/ui/table.tsx` | Servicos list, Itens list |
| `Button` | `components/ui/button.tsx` | Actions |
| `Input` | `components/ui/input.tsx` | Form fields |
| `Textarea` | `components/ui/textarea.tsx` | observacao, metodo, tolerancia |
| `Select` | `components/ui/select.tsx` | categoria dropdown |
| `Checkbox` | `components/ui/checkbox.tsx` | Bulk selection |
| `Badge` | `components/ui/badge.tsx` | Status, category tags |
| `DropdownMenu` | `components/ui/dropdown-menu.tsx` | Row actions |
| `Separator` | `components/ui/separator.tsx` | Visual separation |
| `Skeleton` | `components/ui/skeleton.tsx` | Loading states |
| `AlertDialog` | `components/ui/alert-dialog.tsx` | Delete confirmations |

### Existing Pattern Components to Reuse

| Component | Source | Reuse For |
|-----------|--------|-----------|
| `StatusBadge` | `obras/_components/status-badge.tsx` | Archive status |
| `SplitViewLayout` | `unidades/_components/split-view-layout.tsx` | Servico detail |

## Navigation Integration

### Sidebar Global (Already Configured)

From `components/navigation/sidebar-global.tsx`:

```typescript
const globalNavItems = [
  { icon: Home, label: 'Home', href: '/app', exact: true },
  { icon: LayoutDashboard, label: 'Dashboard', href: '/app/dashboard', badge: 'Em breve' },
  { icon: Building2, label: 'Obras', href: '/app/obras' },
  { icon: Library, label: 'Biblioteca FVS', href: '/app/biblioteca', badge: 'Em breve' },
]
```

**Action needed:** Remove `badge: 'Em breve'` from Biblioteca FVS when implementing.

### Route Structure

```
/app/biblioteca                    - List all servicos
/app/biblioteca/novo               - Create servico (or modal)
/app/biblioteca/[id]               - Servico detail (with itens_servico)
/app/biblioteca/[id]/editar        - Edit servico (or modal)

/app/obras/[id]/servicos           - Activate/deactivate servicos for obra
```

### Sidebar Obra (Services Section)

From `components/navigation/sidebar-obra.tsx`:

```typescript
operacao: [
  { icon: Wrench, label: 'Servicos', href: `/app/obras/${obraId}/servicos`, badge: 'Em breve' },
  ...
]
```

**Action needed:** Remove `badge: 'Em breve'` when implementing obra servicos activation.

## Implementation Insights

### Page Structure Recommendation

```
arden/app/app/biblioteca/
├── page.tsx                           # Server: list servicos
├── [id]/
│   └── page.tsx                       # Server: servico detail + itens
└── _components/
    ├── biblioteca-page-client.tsx     # Client: state management
    ├── servicos-table.tsx             # Table with filters
    ├── servico-form-modal.tsx         # Create/edit servico modal
    ├── archive-confirmation.tsx       # Archive dialog
    ├── servico-detail-client.tsx      # Detail page state
    ├── servico-info-panel.tsx         # Left panel: servico info
    ├── itens-servico-panel.tsx        # Right panel: itens list
    └── item-servico-form-modal.tsx    # Create/edit item modal

arden/app/app/obras/[id]/servicos/
├── page.tsx                           # Server: obra servicos activation
└── _components/
    ├── servicos-activation-client.tsx # Client: checkbox state
    └── servicos-activation-table.tsx  # Table with checkboxes
```

### Query Files to Create

```
arden/lib/supabase/queries/
├── servicos.ts                        # Servico CRUD
├── itens-servico.ts                   # ItemServico CRUD
└── obra-servicos.ts                   # Activation/deactivation
```

### Validation Files to Create

```
arden/lib/validations/
├── servico.ts                         # Servico schema
└── item-servico.ts                    # ItemServico schema
```

### Key Implementation Notes

1. **DEV_CLIENTE_ID**: Use same pattern as `obras.ts` for development
2. **Order management**: Use same pattern as `agrupamentos.ts` for item ordering
3. **Batch operations**: Use same pattern as `createAgrupamentosBatch` for bulk item creation
4. **Category filter**: Add category filter dropdown in servicos table (similar to status filter in obras)
5. **Search**: Implement search by codigo and nome (same pattern as obras search)

### Activation UI Pattern

For obra servicos activation page:

```typescript
// Simple checkbox list approach
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[40px]">Ativo</TableHead>
      <TableHead>Codigo</TableHead>
      <TableHead>Nome</TableHead>
      <TableHead>Categoria</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {servicos.map((servico) => (
      <TableRow key={servico.id}>
        <TableCell>
          <Checkbox
            checked={activeServicoIds.has(servico.id)}
            onCheckedChange={(checked) => handleToggle(servico.id, checked)}
          />
        </TableCell>
        ...
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Error Handling Pattern

Follow existing pattern from `obra-form-modal.tsx`:

```typescript
try {
  // operation
  toast.success('Servico criado com sucesso')
  onSuccess()
} catch (error) {
  const message = error instanceof Error ? error.message : 'Erro ao criar servico'
  toast.error(message)
}
```

## Common Pitfalls

### Pitfall 1: Unique Codigo Constraint

**What goes wrong:** Duplicate codigo error from DB when creating servico
**Why it happens:** User enters codigo already used by another servico
**How to avoid:**
- Catch error code `23505` (unique_violation)
- Display friendly message: "Ja existe um servico com este codigo"
**Warning signs:** Form submission fails silently or shows generic error

### Pitfall 2: Cascading Deletes

**What goes wrong:** Accidentally deleting itens_servico when editing servico
**Why it happens:** CASCADE constraint on itens_servico
**How to avoid:**
- Always archive servicos instead of delete
- Only hard delete via admin action with explicit confirmation
**Warning signs:** Items disappearing unexpectedly

### Pitfall 3: RESTRICT on obra_servicos

**What goes wrong:** Cannot delete servico that is active in any obra
**Why it happens:** RESTRICT constraint on servico_id in obra_servicos
**How to avoid:**
- Check for active obra_servicos before attempting delete
- Show message: "Este servico esta ativo em X obras. Arquive-o em vez de excluir."
**Warning signs:** Delete operation fails with foreign key error

### Pitfall 4: Missing ordem Auto-increment

**What goes wrong:** Items created with ordem = 0, wrong order displayed
**Why it happens:** Not calculating next ordem before insert
**How to avoid:** Use same pattern as `createAgrupamento`:
```typescript
const nextOrdem = data.ordem ?? ((existing?.[0]?.ordem ?? -1) + 1)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Manual client_id passing | `get_user_cliente_id()` RLS function | Already in schema | Automatic tenant isolation |
| Hard delete | Soft delete (arquivado) | Already in schema | Data preservation |

## Sources

### Primary (HIGH confidence)
- `database/schema.sql` - Full table definitions, constraints, indexes
- `database/rls-policies.sql` - RLS policies for all tables
- `docs/product/05_DOMAIN_MODEL.md` - Domain model documentation
- `docs/product/04_NAVIGATION.md` - Navigation structure

### Secondary (HIGH confidence)
- `arden/lib/supabase/queries/obras.ts` - CRUD pattern reference
- `arden/lib/supabase/queries/agrupamentos.ts` - Order management pattern
- `arden/app/app/obras/_components/` - UI component patterns
- `arden/app/app/obras/[id]/unidades/_components/` - Split view, selection patterns

### Existing Code References
- `arden/components/navigation/sidebar-global.tsx` - Biblioteca entry exists
- `arden/components/navigation/sidebar-obra.tsx` - Servicos entry exists
- `arden/lib/validations/obra.ts` - Validation pattern
- `arden/lib/validations/common.ts` - Common validation helpers

## Metadata

**Confidence breakdown:**
- Database Schema: HIGH - Direct from schema.sql
- Existing Patterns: HIGH - Direct from codebase
- Domain Model: HIGH - From docs and schema
- UI Components: HIGH - From component inventory
- Navigation: HIGH - From sidebar components

**Research date:** 2026-01-21
**Valid until:** 2026-02-21 (stable codebase)
