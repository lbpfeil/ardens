# Architecture Research: v1.1 Verificacoes no Portal Web

**Dominio:** Execucao de verificacoes FVS no portal web (complemento ao app mobile)
**Pesquisado:** 2026-01-26
**Confianca geral:** HIGH (schema existente, padroes consolidados no codebase)

---

## 1. Schema do Banco de Dados - Estado Atual e Adicoes

### 1.1 Tabelas ja existentes (nenhuma adicao necessaria)

O schema v1.0 **ja contem todas as tabelas necessarias** para verificacoes. Nao ha necessidade de migrations para a estrutura core:

| Tabela | Status | Funcao |
|--------|--------|--------|
| `verificacoes` | Existente | Verificacao = servico + unidade. Contadores denormalizados. |
| `itens_verificacao` | Existente | Items individuais com status_inspecao e status_reinspecao. |
| `fotos_nc` | Existente | Fotos de nao-conformidade, path no Storage. |

**Confianca: HIGH** - Verificado diretamente em `database/schema.sql` linhas 522-636.

### 1.2 Schema detalhado das tabelas de verificacao

#### Tabela `verificacoes` (existente)

```sql
CREATE TABLE verificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES obras(id),
  unidade_id UUID NOT NULL REFERENCES unidades(id),
  servico_id UUID NOT NULL REFERENCES servicos(id),
  status status_verificacao DEFAULT 'pendente',
  -- 'pendente' | 'em_andamento' | 'concluida' | 'com_nc'
  inspetor_id UUID REFERENCES usuarios(id),
  data_inicio TIMESTAMPTZ,
  data_conclusao TIMESTAMPTZ,
  -- Contadores denormalizados (trigger automatico)
  total_itens INT DEFAULT 0,
  itens_verificados INT DEFAULT 0,
  itens_conformes INT DEFAULT 0,
  itens_nc INT DEFAULT 0,
  itens_excecao INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(unidade_id, servico_id)  -- 1 verificacao por par
);
```

**Ponto critico:** A constraint `UNIQUE(unidade_id, servico_id)` garante que so existe uma verificacao por par servico-unidade. Isso simplifica a matriz -- cada celula corresponde a no maximo 1 registro.

#### Tabela `itens_verificacao` (existente)

```sql
CREATE TABLE itens_verificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verificacao_id UUID NOT NULL REFERENCES verificacoes(id),
  item_servico_id UUID NOT NULL REFERENCES itens_servico(id),
  status status_inspecao DEFAULT 'nao_verificado',
  -- 'nao_verificado' | 'conforme' | 'nao_conforme' | 'excecao'
  inspetor_id UUID REFERENCES usuarios(id),
  data_inspecao TIMESTAMPTZ,
  observacao TEXT,  -- obrigatorio se NC
  -- Reinspecao
  status_reinspecao status_reinspecao,
  inspetor_reinspecao_id UUID REFERENCES usuarios(id),
  data_reinspecao TIMESTAMPTZ,
  observacao_reinspecao TEXT,
  ciclos_reinspecao INT DEFAULT 0,
  -- Sync (mobile)
  sync_id UUID,
  sync_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(verificacao_id, item_servico_id)
);
```

#### Tabela `fotos_nc` (existente)

```sql
CREATE TABLE fotos_nc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_verificacao_id UUID NOT NULL REFERENCES itens_verificacao(id),
  path TEXT NOT NULL,          -- Caminho no Supabase Storage
  ordem INT DEFAULT 0,
  latitude DECIMAL(10, 8),     -- GPS opcional
  longitude DECIMAL(11, 8),
  watermark_texto TEXT,
  sync_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 1.3 Trigger existente para contadores

O schema ja inclui a funcao `atualizar_contadores_verificacao()` que automaticamente recalcula os contadores (`total_itens`, `itens_verificados`, `itens_conformes`, `itens_nc`, `itens_excecao`) e o `status` da verificacao sempre que um `itens_verificacao` e inserido, atualizado ou deletado.

**Implicacao para a arquitetura:** O front-end NAO precisa gerenciar status/contadores -- basta inserir/atualizar `itens_verificacao` e o trigger cuida do resto. Ao recarregar `verificacoes`, os contadores estarao corretos.

### 1.4 Possivel migration necessaria: View materializada para a matriz

Para o caso de obras grandes (25 servicos x 200 unidades), uma **view** pode ser util para evitar montar a matriz no client:

```sql
-- View para a matriz (servicos x unidades) com status
CREATE OR REPLACE VIEW view_matriz_verificacoes AS
SELECT
  os.obra_id,
  os.servico_id,
  s.nome AS servico_nome,
  s.codigo AS servico_codigo,
  s.categoria AS servico_categoria,
  u.id AS unidade_id,
  u.nome AS unidade_nome,
  u.ordem AS unidade_ordem,
  a.id AS agrupamento_id,
  a.nome AS agrupamento_nome,
  a.ordem AS agrupamento_ordem,
  v.id AS verificacao_id,
  v.status AS verificacao_status,
  v.total_itens,
  v.itens_verificados,
  v.itens_conformes,
  v.itens_nc,
  v.itens_excecao
FROM obra_servicos os
JOIN servicos s ON s.id = os.servico_id
CROSS JOIN (
  SELECT u.*, a.obra_id AS agrup_obra_id
  FROM unidades u
  JOIN agrupamentos a ON a.id = u.agrupamento_id
) u_with_obra ON u_with_obra.agrup_obra_id = os.obra_id
JOIN agrupamentos a ON a.id = u_with_obra.agrupamento_id
LEFT JOIN verificacoes v
  ON v.obra_id = os.obra_id
  AND v.servico_id = os.servico_id
  AND v.unidade_id = u_with_obra.id
WHERE os.ativo = true;
```

**Recomendacao:** Comecar SEM a view, usando queries diretas no Server Component. Se a performance for insuficiente (>500ms para obras grandes), criar a view como otimizacao.

**Confianca: MEDIUM** - A view e uma otimizacao que pode ou nao ser necessaria. A abordagem "queries separadas + montar no JS" pode ser suficiente.

---

## 2. Supabase Storage - Bucket e Organizacao de Fotos

### 2.1 Estrutura do Bucket

**Recomendacao: Um unico bucket privado com organizacao hierarquica por path.**

```
Bucket: "verificacoes" (privado)

Estrutura de paths:
  {cliente_id}/{obra_id}/{verificacao_id}/{item_verificacao_id}/{timestamp}-{random}.jpg

Exemplo concreto:
  abc123/obra456/verif789/item012/1706300000-x7k9m.jpg
```

**Justificativa para bucket unico:**
- Supabase cobra por bucket apos certo numero; 1 bucket e mais economico
- RLS pode filtrar por path prefix usando `storage.foldername()`
- A hierarquia no path garante isolamento e organizabilidade
- Incluir `cliente_id` no path facilita limpeza e auditoria futura

**Alternativas descartadas:**
- Bucket por obra: proliferacao de buckets, dificil gerenciar
- Bucket publico: inaceitavel para fotos de obra (dados sensiveis)

### 2.2 Storage RLS Policies

```sql
-- Bucket privado - nenhum acesso publico
INSERT INTO storage.buckets (id, name, public)
VALUES ('verificacoes', 'verificacoes', false);

-- SELECT: Usuarios com acesso a obra podem ver fotos
CREATE POLICY "verificacoes_storage_select"
ON storage.objects FOR SELECT USING (
  bucket_id = 'verificacoes'
  AND (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM clientes c
    JOIN usuario_clientes uc ON uc.cliente_id = c.id
    WHERE uc.usuario_id = auth.uid() AND uc.ativo = true
  )
);

-- INSERT: Usuarios com acesso a obra podem enviar fotos
CREATE POLICY "verificacoes_storage_insert"
ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'verificacoes'
  AND (storage.foldername(name))[1] IN (
    SELECT c.id::text FROM clientes c
    JOIN usuario_clientes uc ON uc.cliente_id = c.id
    WHERE uc.usuario_id = auth.uid() AND uc.ativo = true
  )
);

-- DELETE: Apenas admin
CREATE POLICY "verificacoes_storage_delete"
ON storage.objects FOR DELETE USING (
  bucket_id = 'verificacoes'
  AND (storage.foldername(name))[1] IN (
    SELECT get_user_cliente_id()::text
  )
  AND is_admin()
);
```

**Confianca: HIGH** - Padrao documentado oficialmente pelo Supabase para Storage RLS com `storage.foldername()`.

### 2.3 Limites e Compressao

| Aspecto | Valor |
|---------|-------|
| Tamanho maximo por foto (pre-compressao) | Sem limite |
| Tamanho maximo por foto (pos-compressao) | 1 MB |
| Fotos por item NC | 5 (conforme schema existente) |
| Formato | JPEG (compressao no cliente) |
| Qualidade | 80% (configuravel) |

**Compressao no cliente:** Usar canvas API ou biblioteca como `browser-image-compression` para redimensionar/comprimir antes do upload. Isso evita upload de fotos RAW de 5-10 MB.

---

## 3. Arquitetura de Componentes

### 3.1 Pagina da Matriz de Verificacoes

**Rota:** `/app/obras/[id]/verificacoes`

Componentes (seguindo padrao existente: Server Component page + Client Component):

```
verificacoes/
  page.tsx                          # Server Component - fetch dados
  _components/
    verificacoes-matrix-client.tsx   # Client Component wrapper
    matrix-toolbar.tsx               # Filtros: agrupamento, status, busca
    matrix-grid.tsx                  # Grid CSS: servicos (linhas) x unidades (colunas)
    matrix-cell.tsx                  # Celula individual com cor de status
    matrix-header-row.tsx            # Header com nomes das unidades
    matrix-service-label.tsx         # Label lateral com nome do servico
    bulk-verification-modal.tsx      # Modal para verificacao em lote
    cell-selection-indicator.tsx     # Indicador visual de celulas selecionadas
```

**Fluxo de dados da pagina:**

```
page.tsx (Server Component)
  |
  |-- fetch: obra_servicos ativos (JOIN servicos)
  |-- fetch: unidades da obra (JOIN agrupamentos, ordenadas)
  |-- fetch: verificacoes existentes (LEFT JOIN para status)
  |
  v
verificacoes-matrix-client.tsx (Client Component)
  |
  |-- Props: { obraId, servicos[], unidades[], verificacoes[] }
  |-- State: selectedCells (Set), filters, sortOrder
  |
  |-- Renders:
  |     matrix-toolbar.tsx (filtros de agrupamento, status, busca)
  |     matrix-grid.tsx
  |       |-- matrix-header-row.tsx (unidades como colunas)
  |       |-- Para cada servico:
  |           matrix-service-label.tsx + matrix-cell.tsx[] (1 por unidade)
  |     bulk-verification-modal.tsx (aberto ao clicar "Verificar Selecionados")
```

### 3.2 Pagina de Verificacao Individual

**Rota:** `/app/obras/[id]/verificacoes/[verificacaoId]`

Alternativamente, como a verificacao e unica por par (servico, unidade):
**Rota alternativa:** `/app/obras/[id]/verificacoes/nova?servico={sid}&unidade={uid}`

**Recomendacao:** Usar a rota com `verificacaoId` quando ja existe, e query params para criar nova.

```
verificacoes/
  [verificacaoId]/
    page.tsx                           # Server Component
    _components/
      verificacao-detail-client.tsx     # Client Component wrapper
      verificacao-header.tsx            # Servico, unidade, status geral
      item-verificacao-card.tsx         # Card de cada item com toggle de status
      item-status-toggle.tsx            # Botoes: Conforme | NC | Excecao
      nc-detail-panel.tsx              # Panel expandido ao marcar NC
      nc-photo-upload.tsx              # Upload de fotos para NC
      nc-observation-input.tsx         # Input de observacao (obrigatorio)
      reinspecao-panel.tsx             # Panel de reinspecao (quando NC existente)
```

**Fluxo de dados:**

```
page.tsx (Server Component)
  |
  |-- fetch: verificacao com servico e unidade (JOIN)
  |-- fetch: itens_verificacao com item_servico (JOIN)
  |-- fetch: fotos_nc para itens NC
  |
  v
verificacao-detail-client.tsx
  |
  |-- Props: { verificacao, itens[], fotos{} }
  |-- Para cada item:
  |     item-verificacao-card.tsx
  |       |-- item-status-toggle.tsx (3 botoes)
  |       |-- Se NC: nc-detail-panel.tsx
  |           |-- nc-observation-input.tsx
  |           |-- nc-photo-upload.tsx
  |       |-- Se NC existente + reinspecao: reinspecao-panel.tsx
```

### 3.3 Modal de Verificacao em Lote (Bulk)

O modal e aberto a partir da matriz quando celulas estao selecionadas.

```
bulk-verification-modal.tsx
  |
  |-- Props: { obraId, selectedCells: {servicoId, unidadeId}[], onComplete }
  |-- Mostra: lista de pares selecionados
  |-- Acao: "Marcar todas como Conforme" (caso mais comum)
  |-- Alternativa: Abrir verificacao individual para cada par
```

**Logica do bulk:**
1. Para cada par (servico_id, unidade_id) selecionado:
   a. Criar/buscar `verificacao` (upsert-like)
   b. Buscar `itens_servico` do servico
   c. Criar `itens_verificacao` com status = 'conforme'
2. Usar funcao PostgreSQL RPC para eficiencia

---

## 4. Estrategia de Data Fetching para a Matriz

### 4.1 Problema: Escala dos dados

Para uma obra com 25 servicos e 200 unidades:
- **Celulas na matriz:** 25 x 200 = 5.000
- **Verificacoes existentes:** 0 a 5.000 (provavelmente 500-2000 em obras ativas)
- **Itens por verificacao:** 5-15 (nao carregados na matriz, so na pagina individual)

### 4.2 Estrategia recomendada: 3 queries paralelas no Server Component

```typescript
// page.tsx - Server Component
const [servicos, unidades, verificacoes] = await Promise.all([
  // 1. Servicos ativos na obra (25 registros)
  supabase
    .from('obra_servicos')
    .select('servico_id, servicos(id, nome, codigo, categoria)')
    .eq('obra_id', obraId)
    .eq('ativo', true)
    .order('servicos(categoria)', { ascending: true }),

  // 2. Unidades da obra agrupadas (200 registros)
  supabase
    .from('unidades')
    .select('id, nome, codigo, ordem, agrupamento:agrupamentos!inner(id, nome, ordem, obra_id)')
    .eq('agrupamento.obra_id', obraId)
    .order('agrupamento(ordem)', { ascending: true })
    .order('ordem', { ascending: true }),

  // 3. Verificacoes existentes (0-5000 registros, so campos necessarios)
  supabase
    .from('verificacoes')
    .select('id, servico_id, unidade_id, status, itens_verificados, total_itens, itens_nc')
    .eq('obra_id', obraId),
])
```

**Montagem da matriz no Server Component:**

```typescript
// Criar Map para lookup O(1)
const verificacaoMap = new Map(
  verificacoes.map(v => [`${v.servico_id}-${v.unidade_id}`, v])
)

// Montar grid data
const matrixData = servicos.map(s => ({
  servico: s,
  cells: unidades.map(u => ({
    unidadeId: u.id,
    verificacao: verificacaoMap.get(`${s.servico_id}-${u.id}`) || null,
  })),
}))
```

### 4.3 Performance estimada

| Obra | Servicos | Unidades | Celulas | Queries | Tempo estimado |
|------|----------|----------|---------|---------|----------------|
| Pequena | 10 | 20 | 200 | 3 | <100ms |
| Media | 20 | 80 | 1.600 | 3 | <200ms |
| Grande | 25 | 200 | 5.000 | 3 | <300ms |
| Muito grande | 30 | 500 | 15.000 | 3 | ~500ms |

Para obras "muito grandes" (raro no dominio -- 500 unidades sao excepcionais), considerar:
- Paginacao por agrupamento (mostrar 1 agrupamento por vez)
- Filtro de servico/categoria

### 4.4 Renderizacao: CSS Grid puro vs. Virtualizacao

**Recomendacao: CSS Grid puro sem virtualizacao, com filtros por agrupamento.**

**Justificativa:**
- O caso tipico (20 servicos x 80 unidades = 1.600 celulas) e perfeitamente renderizavel sem virtualizacao
- Cada celula e pequena (~40x40px com cor de status), DOM leve
- Filtrar por agrupamento reduz dramaticamente o numero visivel
- Virtualizacao adiciona complexidade significativa para scroll 2D (horizontal + vertical)
- Bibliotecas de grid pesadas (AG Grid, MUI X) sao overkill para uma matriz de status com cores

**Se necessario futuramente:** `@tanstack/react-virtual` para virtualizacao leve, sem trocar de abordagem.

**Confianca: MEDIUM** - Depende de testes reais de performance. A filtragem por agrupamento e a mitigacao principal.

---

## 5. Gerenciamento de Estado para Selecao de Celulas

### 5.1 Estado LOCAL (useState), NAO Zustand

A selecao de celulas e estado transiente de UI da pagina da matriz. Nao deve ir para o app-store global.

```typescript
// verificacoes-matrix-client.tsx
interface MatrixSelection {
  cells: Set<string>  // "servicoId-unidadeId"
  isSelecting: boolean
  selectionStart: string | null
}

const [selection, setSelection] = useState<MatrixSelection>({
  cells: new Set(),
  isSelecting: false,
  selectionStart: null,
})
```

### 5.2 Interacao de selecao

| Acao | Comportamento |
|------|---------------|
| Click em celula | Seleciona/deseleciona uma celula |
| Ctrl+Click | Adiciona/remove celula da selecao |
| Click+Drag | Seleciona retangulo de celulas |
| Shift+Click | Estende selecao ate a celula clicada |
| Escape | Limpa selecao |
| Click em header de servico | Seleciona toda a linha |
| Click em header de unidade | Seleciona toda a coluna |

### 5.3 Drag selection com useRef (evitar re-renders)

```typescript
// Usar ref para tracking de drag (nao causa re-render)
const dragRef = useRef({
  isDragging: false,
  startCell: null as string | null,
  currentCells: new Set<string>(),
})

// Atualizar visual com requestAnimationFrame
// Commit para state somente no mouseUp
```

**Confianca: HIGH** - Padrao bem estabelecido para selecao em grids. useRef para drag evita renders desnecessarios durante arraste.

---

## 6. Politicas RLS para Dados de Verificacao

### 6.1 Politicas ja existentes

O arquivo `database/rls-policies.sql` ja contem politicas completas para:
- `verificacoes` (SELECT, INSERT, UPDATE, DELETE)
- `itens_verificacao` (SELECT, INSERT, UPDATE, DELETE)
- `fotos_nc` (SELECT, INSERT, DELETE)

**Resumo das politicas existentes:**

| Tabela | Operacao | Quem pode |
|--------|----------|-----------|
| `verificacoes` | SELECT | Admin/Engenheiro: todas da obra. Inspetor: apenas as proprias |
| `verificacoes` | INSERT | Qualquer um com acesso a obra |
| `verificacoes` | UPDATE | Admin: tudo. Outros: so proprias nao-concluidas |
| `verificacoes` | DELETE | Apenas admin |
| `itens_verificacao` | SELECT | Segue permissao da verificacao pai |
| `itens_verificacao` | INSERT | Quem pode editar a verificacao |
| `itens_verificacao` | UPDATE | Admin: tudo. Inspetor: so proprios |
| `itens_verificacao` | DELETE | Apenas admin (via cascade) |
| `fotos_nc` | SELECT | Segue permissao do item pai |
| `fotos_nc` | INSERT | Quem pode editar o item |
| `fotos_nc` | DELETE | Apenas admin |

### 6.2 Consideracao para o portal web (DEV_CLIENTE_ID)

Atualmente o app usa `DEV_CLIENTE_ID` hardcoded para filtros no server-side (auth nao integrada). As RLS policies acima dependem de `auth.uid()`, que nao existe sem login.

**Para v1.1:** Continuar usando `DEV_CLIENTE_ID` nos server-side fetches (mesma abordagem das paginas existentes). As RLS policies funcionarao corretamente quando auth for integrada.

**Para client-side writes:** Usar `supabase.from().insert()` diretamente. Como nao ha auth, as RLS policies bloquearao. Duas opcoes:
1. **Usar service_role key via Server Action** (recomendado) - chama server action do Next.js que usa service_role key
2. **Desabilitar RLS temporariamente** para dev (NAO recomendado em prod)

**Recomendacao:** Criar Server Actions para todas as operacoes de escrita (insert verificacao, update item, upload foto). Isso prepara para auth futura e evita expor service_role no client.

**Confianca: HIGH** - Politicas verificadas em `database/rls-policies.sql`.

---

## 7. Bulk Inserts Eficientes no Supabase

### 7.1 Cenario: Verificacao em lote

Ao marcar 50 celulas como "Conforme":
1. Criar 50 registros em `verificacoes` (se nao existem)
2. Para cada verificacao, criar N `itens_verificacao` (N = itens do servico, tipicamente 5-15)
3. Total de inserts: 50 + (50 * ~10) = ~550 registros

### 7.2 Abordagem recomendada: RPC PostgreSQL

```sql
CREATE OR REPLACE FUNCTION bulk_verificar_conforme(
  p_obra_id UUID,
  p_inspetor_id UUID,
  p_pares JSONB  -- [{"servico_id": "...", "unidade_id": "..."}, ...]
)
RETURNS SETOF verificacoes AS $$
DECLARE
  par RECORD;
  v_id UUID;
  v_record verificacoes%ROWTYPE;
BEGIN
  FOR par IN SELECT * FROM jsonb_to_recordset(p_pares) AS x(servico_id UUID, unidade_id UUID)
  LOOP
    -- Upsert verificacao
    INSERT INTO verificacoes (obra_id, unidade_id, servico_id, inspetor_id, data_inicio)
    VALUES (p_obra_id, par.unidade_id, par.servico_id, p_inspetor_id, NOW())
    ON CONFLICT (unidade_id, servico_id) DO UPDATE SET updated_at = NOW()
    RETURNING id INTO v_id;

    -- Insert itens como conforme (apenas os que nao existem ainda)
    INSERT INTO itens_verificacao (verificacao_id, item_servico_id, status, inspetor_id, data_inspecao)
    SELECT v_id, isl.id, 'conforme', p_inspetor_id, NOW()
    FROM itens_servico isl
    WHERE isl.servico_id = par.servico_id
    ON CONFLICT (verificacao_id, item_servico_id) DO NOTHING;
    -- ON CONFLICT DO NOTHING: nao sobrescreve itens ja verificados

    -- Retornar a verificacao atualizada
    SELECT * INTO v_record FROM verificacoes WHERE id = v_id;
    RETURN NEXT v_record;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
```

**Chamada do client:**

```typescript
const { data, error } = await supabase.rpc('bulk_verificar_conforme', {
  p_obra_id: obraId,
  p_inspetor_id: null,  // null para dev sem auth
  p_pares: selectedPairs,
})
```

**Vantagens:**
- Uma unica chamada HTTP para N verificacoes
- Transacao atomica (tudo ou nada)
- O trigger `atualizar_contadores_verificacao` roda automaticamente
- `ON CONFLICT DO NOTHING` preserva itens ja verificados

### 7.3 Para inserts individuais (pagina de verificacao)

Para a pagina de verificacao individual, nao precisa de bulk. Usar o padrao existente:

```typescript
// Update individual item
await supabase
  .from('itens_verificacao')
  .update({
    status: 'conforme',
    inspetor_id: inspetorId,
    data_inspecao: new Date().toISOString(),
  })
  .eq('id', itemId)
```

O trigger recalculara automaticamente os contadores da verificacao pai.

**Confianca: HIGH** - Padrao documentado pelo Supabase (upsert com array e RPC com jsonb).

---

## 8. Fluxo de Upload de Fotos

### 8.1 Fluxo completo

```
1. Usuario marca item como NC
   |
2. Panel NC abre com campo de observacao + area de upload
   |
3. Usuario seleciona foto(s) do dispositivo
   |
4. Client-side:
   a. Valida tipo (JPEG, PNG, HEIC) e tamanho
   b. Comprime para <= 1MB com canvas API / browser-image-compression
   c. Gera nome unico: {timestamp}-{random}.jpg
   |
5. Upload para Supabase Storage:
   a. Path: {clienteId}/{obraId}/{verificacaoId}/{itemVerificacaoId}/{filename}
   b. Metodo: supabase.storage.from('verificacoes').upload(path, file)
   |
6. Ao completar upload:
   a. Insere registro em fotos_nc com o path retornado
   b. Opcionalmente inclui GPS (se disponivel via navigator.geolocation)
   |
7. Para exibir foto:
   a. Gera signed URL: supabase.storage.from('verificacoes').createSignedUrl(path, 3600)
   b. Ou usa download direto (privado)
```

### 8.2 Componente de upload

```typescript
// nc-photo-upload.tsx
interface NCPhotoUploadProps {
  itemVerificacaoId: string
  verificacaoId: string
  obraId: string
  clienteId: string
  existingPhotos: FotoNC[]
  maxPhotos: number  // 5
  onPhotoAdded: (foto: FotoNC) => void
  onPhotoRemoved: (fotoId: string) => void
}
```

### 8.3 Compressao no cliente

```typescript
// Usar browser-image-compression (leve, sem dependencias)
import imageCompression from 'browser-image-compression'

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/jpeg',
}

const compressedFile = await imageCompression(file, options)
```

**Confianca: HIGH** - `browser-image-compression` e a biblioteca padrao para este caso de uso. Supabase Storage upload e well-documented.

---

## 9. Fluxo de Dados Completo

### 9.1 Matriz -> Verificacao Individual

```
MATRIZ (visao geral)
  |
  |-- Click em celula COM verificacao -> Navega para /verificacoes/{verificacaoId}
  |
  |-- Click em celula SEM verificacao -> Cria verificacao + itens, depois navega
  |     |
  |     |-- Server Action: createVerificacao(obraId, servicoId, unidadeId)
  |     |   1. INSERT INTO verificacoes
  |     |   2. INSERT INTO itens_verificacao (1 por item_servico)
  |     |   3. RETURN verificacao.id
  |     |
  |     |-- router.push(/verificacoes/{newId})
  |
  |-- Selecao multipla + "Verificar" -> Abre bulk-verification-modal
      |
      |-- "Marcar todos Conforme" -> RPC bulk_verificar_conforme
      |-- "Abrir individualmente" -> Lista de links para cada verificacao
```

### 9.2 Pagina Individual -> Banco de Dados

```
PAGINA INDIVIDUAL
  |
  |-- Toggle item para Conforme:
  |     Server Action: updateItemStatus(itemId, 'conforme')
  |     -> UPDATE itens_verificacao SET status = 'conforme'
  |     -> Trigger recalcula contadores automaticamente
  |
  |-- Toggle item para NC:
  |     1. Abre nc-detail-panel
  |     2. Usuario preenche observacao (obrigatoria)
  |     3. Usuario opcionalmente adiciona fotos
  |     4. Server Action: updateItemStatus(itemId, 'nao_conforme', observacao)
  |     5. Fotos: uploadFotoNC() para cada foto
  |
  |-- Toggle item para Excecao:
  |     Server Action: updateItemStatus(itemId, 'excecao')
  |
  |-- Reinspecao de NC existente:
  |     Server Action: reinspecionarItem(itemId, statusReinspecao, observacao?)
```

---

## 10. Ordem de Construcao Recomendada

### Fase A: Fundacao (banco + queries)

**Build order:**
1. **Migration: Bucket de Storage** - Criar bucket `verificacoes` com policies
2. **Migration: RPC bulk_verificar_conforme** - Funcao para verificacao em lote
3. **Server Actions / Queries** - CRUD de verificacoes e itens
   - `createVerificacao(obraId, servicoId, unidadeId)`
   - `getVerificacao(verificacaoId)` com itens e fotos
   - `updateItemStatus(itemId, status, observacao?)`
   - `uploadFotoNC(itemVerificacaoId, file)`
   - `getMatrixData(obraId)` - 3 queries paralelas para matriz
   - `bulkVerificarConforme(obraId, pares[])`

**Dependencias:** Nenhuma - usa schema existente.

### Fase B: Pagina de verificacao individual

**Build order:**
1. **verificacoes/[verificacaoId]/page.tsx** - Server Component com fetch
2. **verificacao-detail-client.tsx** - Client wrapper
3. **verificacao-header.tsx** - Info do servico, unidade, progresso
4. **item-verificacao-card.tsx** + **item-status-toggle.tsx** - Core da verificacao
5. **nc-detail-panel.tsx** + **nc-observation-input.tsx** - Fluxo NC
6. **nc-photo-upload.tsx** - Upload de fotos
7. **reinspecao-panel.tsx** - Reinspecao de NCs

**Dependencia:** Fase A (queries e server actions).
**Justificativa para construir primeiro:** E a unidade atomica -- verificar 1 servico em 1 unidade. A matriz e apenas uma visao que leva ate aqui.

### Fase C: Pagina da matriz

**Build order:**
1. **verificacoes/page.tsx** - Server Component com 3 queries paralelas
2. **verificacoes-matrix-client.tsx** - Client wrapper com estado
3. **matrix-toolbar.tsx** - Filtros (agrupamento, status, busca)
4. **matrix-grid.tsx** + **matrix-cell.tsx** - Grid CSS com celulas
5. **Selecao de celulas** - Click, Ctrl+Click, Drag
6. **bulk-verification-modal.tsx** - Modal de verificacao em lote

**Dependencia:** Fase A (queries) + Fase B (link para verificacao individual).

### Fase D: Navegacao e integracao

**Build order:**
1. **Atualizar sidebar-obra.tsx** - Remover badge "Em breve" de Verificacoes
2. **Atualizar breadcrumb** - Navegacao Obra > Verificacoes > [Servico + Unidade]
3. **Link de celulas da matriz** para pagina individual
4. **Botao "Voltar a matriz"** na pagina individual
5. **Dashboard update** - Dados reais nos KPIs (ja parcialmente implementado)

**Dependencia:** Fases B e C completas.

---

## 11. Consideracoes de Performance

### 11.1 Matriz com muitas celulas

| Estrategia | Implementacao | Quando usar |
|------------|---------------|-------------|
| Filtro por agrupamento | Dropdown no toolbar | Default: mostrar 1 agrupamento por vez |
| Filtro por servico/categoria | Checkboxes/dropdown | Obras com 25+ servicos |
| CSS Grid com celulas simples | `div` com `bg-color` | Sempre (celulas sao 40x40px) |
| React.memo nas celulas | `memo(MatrixCell)` | Sempre |
| useMemo no matrixData | Evita recalculo | Sempre |
| Virtualizacao 2D | @tanstack/react-virtual | So se >5000 celulas visiveis |

### 11.2 Upload de fotos

| Estrategia | Implementacao |
|------------|---------------|
| Compressao client-side | browser-image-compression (<1MB) |
| Upload progressivo | Barra de progresso por foto |
| Upload paralelo | Promise.all para multiplas fotos |
| Retry automatico | 3 tentativas com backoff |
| Preview antes de upload | URL.createObjectURL() |
| Signed URLs para exibicao | createSignedUrl com cache de 1h |

### 11.3 Queries de banco

| Estrategia | Implementacao |
|------------|---------------|
| Queries paralelas | Promise.all no Server Component |
| Indexes existentes | idx_verificacoes_obra, idx_verificacoes_status |
| Map para lookup | `Map<string, Verificacao>` com key `servicoId-unidadeId` |
| Dados minimos na matriz | Selecionar apenas id, status, contadores |
| Dados completos so na pagina individual | Buscar itens e fotos so quando necessario |

---

## 12. Anti-Padroes a Evitar

### 12.1 NAO buscar itens_verificacao para a matriz

A matriz so precisa de `verificacoes.status` por celula. Buscar itens (5-15 por verificacao) inflaria os dados de 5.000 para 50.000+ registros inutilmente.

### 12.2 NAO usar Zustand para selecao de celulas

Estado de selecao e local a pagina da matriz. Colocar no app-store global causaria re-renders desnecessarios em componentes fora da pagina.

### 12.3 NAO criar verificacao + itens no client-side com multiplas chamadas

Usar uma unica Server Action ou RPC que cria verificacao + itens em uma transacao. Isso evita estado inconsistente se a conexao cair entre chamadas.

### 12.4 NAO uplodar fotos sem compressao

Fotos de celular podem ter 5-10 MB. Sem compressao, o upload seria lento e o Storage lotaria rapidamente. Sempre comprimir para <=1MB no client.

### 12.5 NAO renderizar matriz completa sem filtro de agrupamento

Obras grandes podem ter 500+ unidades. Renderizar todas as colunas de uma vez seria ilegivel (scroll horizontal excessivo) e potencialmente lento. Default: mostrar 1 agrupamento.

---

## 13. Dependencias de Pacotes

### Novos pacotes necessarios

| Pacote | Versao | Proposito | Quando |
|--------|--------|-----------|--------|
| `browser-image-compression` | ^2.0 | Compressao de fotos no client | Fase B (upload) |

### Pacotes existentes utilizados

| Pacote | Uso nesta feature |
|--------|-------------------|
| `@supabase/ssr` | Queries server-side e client-side |
| `zustand` | NAO usar para esta feature (estado local) |
| `sonner` | Toast notifications para acoes de verificacao |
| `lucide-react` | Icones de status (Check, X, AlertTriangle) |
| `zod` | Validacao de inputs (observacao NC) |
| `react-hook-form` | Formulario de observacao NC |

---

## Fontes

- `database/schema.sql` - Schema completo verificado (linhas 522-636 para verificacoes)
- `database/rls-policies.sql` - Politicas RLS completas para verificacoes, itens e fotos
- `docs/product/05_DOMAIN_MODEL.md` - Modelo de dominio e status lifecycle
- `docs/tech/01_ARCHITECTURE.md` - Arquitetura Supabase-first
- Codebase existente: padroes de Server Component + Client Component, queries, stores
- [Supabase Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control) - Storage RLS
- [Supabase Storage Helper Functions](https://supabase.com/docs/guides/storage/schema/helper-functions) - foldername(), filename()
- [Supabase Bulk Insert Discussion](https://github.com/orgs/supabase/discussions/11349) - Padroes de bulk insert
- [Supabase Upsert Docs](https://supabase.com/docs/reference/javascript/upsert) - API de upsert
