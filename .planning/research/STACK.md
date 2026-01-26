# Stack Research: v1.1 Verificacoes no Portal Web

**Projeto:** Arden FVS
**Pesquisado:** 2026-01-26
**Confianca geral:** ALTA

---

## Resumo Executivo

O milestone v1.1 precisa de cinco capacidades tecnicas novas: (1) matriz interativa servico x unidade com selecao de celulas, (2) upload de fotos com Supabase Storage, (3) compressao de imagens antes do upload, (4) grupos de colunas colapsaveis na matriz, (5) selecao em massa (linha inteira, coluna inteira). A pesquisa avaliou bibliotecas de grid/spreadsheet, upload de arquivos, compressao de imagens e padroes de selecao.

**Recomendacao principal:** Construir a matriz como componente customizado usando CSS Grid + React state, em vez de adotar uma biblioteca pesada de spreadsheet. O caso de uso e uma matriz de status (servico x unidade) com celulas simples (icones de status, checkboxes), nao uma planilha com edicao de texto em celulas. Bibliotecas de spreadsheet como AG Grid ou react-data-grid sao projetadas para grids de dados complexos e adicionariam peso e complexidade desnecessarios.

---

## Novas Dependencias Necessarias

### 1. Compressao de Imagens no Browser

- **browser-image-compression** (^2.0.2) -- Compressao de imagens antes do upload
  - **Confianca:** ALTA (npm: ~390K downloads/semana, 866 stars no GitHub)
  - **Racional:** Unica biblioteca madura para compressao client-side de imagens. Usa Web Workers por padrao (nao bloqueia UI), API simples baseada em Promises, suporta `maxSizeMB`, `maxWidthOrHeight`, `preserveExif`, callback de progresso via `onProgress`, e `AbortSignal` para cancelamento.
  - **Alternativa descartada:** `compressorjs` -- API baseada em callbacks (nao Promises), nao usa Web Workers, remove EXIF por padrao sem opcao simples de preservar. `browser-image-compression` tem API mais moderna e ergonomica.
  - **Alternativa descartada:** Canvas API puro -- Funciona, mas exige reimplementar logica de iteracao de qualidade, Web Worker offloading, e tratamento de EXIF. Nao compensa quando a biblioteca tem 2KB gzipped.
  - **Uso:**
    ```typescript
    import imageCompression from 'browser-image-compression'

    const compressed = await imageCompression(file, {
      maxSizeMB: 1,           // Limitar a 1MB
      maxWidthOrHeight: 1920, // Max Full HD
      useWebWorker: true,     // Nao bloquear UI
      fileType: 'image/jpeg', // Forcar JPEG para fotos
    })
    ```
  - **Fonte:** [npm](https://www.npmjs.com/package/browser-image-compression), [GitHub](https://github.com/Donaldcwl/browser-image-compression)

### 2. ID Unico para Nomes de Arquivo

- **nanoid** (^5.1.6) -- Gerador de IDs unicos para nomes de arquivo no Storage
  - **Confianca:** ALTA (15.6K dependentes no npm, 118 bytes minificado)
  - **Racional:** Gera IDs curtos, URL-safe, criptograficamente seguros. Usa `crypto.getRandomValues()`. Com 21 caracteres (padrao), a probabilidade de colisao e equivalente a UUID v4 (~126 bits de entropia), mas o resultado e 21 chars vs 36 do UUID. Ideal para paths de arquivo no Supabase Storage.
  - **Alternativa descartada:** `crypto.randomUUID()` -- Funciona, mas gera IDs mais longos (36 chars com hifens) e menos URL-friendly. `nanoid` e mais compacto e ja amplamente adotado.
  - **Alternativa descartada:** `Date.now()` -- Risco de colisao em uploads simultaneos. Nao seguro para multi-tenant.
  - **Uso:**
    ```typescript
    import { nanoid } from 'nanoid'

    const filePath = `verificacoes/${obraId}/${nanoid()}.jpg`
    ```
  - **Fonte:** [npm](https://www.npmjs.com/package/nanoid), [GitHub](https://github.com/ai/nanoid)

---

## Stack Existente Suficiente Para

### Upload de Fotos com Supabase Storage

**Nenhuma biblioteca adicional necessaria.** O `@supabase/supabase-js` (^2.90.1) ja instalado suporta todas as operacoes de Storage:

- **Upload direto:** `supabase.storage.from('bucket').upload(path, file)`
- **Upload via URL assinada (recomendado):**
  1. Server Action cria URL: `supabase.storage.from('bucket').createSignedUploadUrl(path)`
  2. Cliente faz upload: `supabase.storage.from('bucket').uploadToSignedUrl(path, token, file)`
- **Download/visualizacao:** `supabase.storage.from('bucket').getPublicUrl(path)` ou `createSignedUrl(path, expiresIn)`
- **Transformacoes de imagem on-the-fly:** `getPublicUrl(path, { transform: { width: 200, height: 200 } })` (requer plano Pro)

**Abordagem recomendada:** Upload via Signed URL para evitar o limite de 1MB do body em Server Actions do Next.js.

**Fluxo completo:**
```
1. Usuário seleciona foto
2. Client-side: browser-image-compression comprime
3. Server Action: cria signed upload URL via createSignedUploadUrl
4. Client-side: upload direto ao Supabase via uploadToSignedUrl
5. Server Action: salva path no banco (tabela de verificacoes)
```

**Configuracao necessaria (sem npm install):**
- Criar bucket no Supabase (ex: `verificacoes-fotos`)
- Definir RLS policies para o bucket
- Definir limite de tamanho no bucket (ex: 5MB)

**Fonte:** [Supabase Storage Docs](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl), [Supabase Dropzone UI](https://supabase.com/ui/docs/nextjs/dropzone)

### Matriz Interativa com Selecao de Celulas

**Construir como componente customizado** usando React + CSS Grid + Zustand para estado.

**Racional para NAO usar biblioteca de grid/spreadsheet:**

| Criterio | Biblioteca (AG Grid etc.) | Componente Customizado |
|----------|--------------------------|----------------------|
| Peso do bundle | 200KB-2MB+ | ~5-15KB |
| Celulas da matriz | Status icons + checkboxes (simples) | Perfeito |
| Edicao inline de texto | Sim (desnecessario) | N/A |
| Formulas | Sim (desnecessario) | N/A |
| Selecao de celulas | Requer Enterprise (AG Grid: $999/dev) | Custom: ~150 linhas de codigo |
| Grupos colapsaveis | Nao nativo (TanStack) / Parcial | Custom: ~50 linhas |
| Estilo (shadcn/Tailwind) | Tema separado, dificil customizar | CSS nativo, total controle |
| Custo | $0 (limitado) ou $999+ (completo) | $0 |

A matriz FVS tem ~20-50 servicos (linhas) x ~50-500 unidades (colunas). Cada celula exibe um icone de status de verificacao (pendente, conforme, nao conforme, nao aplicavel). Nao ha edicao de texto, formulas, ou sorting de colunas. O caso de uso e fundamentalmente diferente de um data grid.

**Implementacao recomendada:**

```typescript
// Hook customizado para selecao de celulas
function useMatrixSelection() {
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState<CellCoord | null>(null)
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set())

  const handlePointerDown = useCallback((row: number, col: number) => {
    setIsSelecting(true)
    setStartCell({ row, col })
    setSelectedCells(new Set([`${row}-${col}`]))
  }, [])

  const handlePointerEnter = useCallback((row: number, col: number) => {
    if (!isSelecting || !startCell) return
    // Calcular retangulo entre startCell e celula atual
    const cells = computeRectSelection(startCell, { row, col })
    setSelectedCells(cells)
  }, [isSelecting, startCell])

  const handlePointerUp = useCallback(() => {
    setIsSelecting(false)
  }, [])

  return { selectedCells, handlePointerDown, handlePointerEnter, handlePointerUp }
}
```

**Componentes CSS Grid para a matriz:**
```typescript
// Layout usando CSS Grid com colunas fixas para servicos e scrollaveis para unidades
<div style={{
  display: 'grid',
  gridTemplateColumns: `250px repeat(${unidades.length}, 48px)`,
}}>
```

**Fonte:** [joshuawootonn.com - Drag to Select](https://www.joshuawootonn.com/react-drag-to-select)

### Grupos de Colunas Colapsaveis

**Construir como parte do componente de matriz customizado.** Usar o estado do Zustand para controlar quais grupos estao expandidos/colapsados.

```typescript
// Estado de grupos colapsaveis
interface MatrixState {
  collapsedGroups: Set<string>  // IDs de blocos/pavimentos colapsados
  toggleGroup: (groupId: string) => void
}

// No render, filtrar colunas de grupos colapsados
const visibleUnidades = unidades.filter(u =>
  !collapsedGroups.has(u.blocoId)
)
```

**Nenhuma biblioteca necessaria.** O padrao e simples: header clicavel com icone ChevronRight/ChevronDown (ja temos `lucide-react`) que alterna a visibilidade das colunas do grupo.

### Selecao em Massa (Linha/Coluna Inteira)

**Construir com componentes existentes.** O `Checkbox` (Radix UI) ja existe no projeto e suporta estado `indeterminate`.

**Padroes de selecao:**
- **Selecionar coluna inteira:** Checkbox no header da coluna (unidade) -- seleciona todas as celulas daquela unidade
- **Selecionar linha inteira:** Checkbox no inicio da linha (servico) -- seleciona todas as celulas daquele servico
- **Selecionar tudo:** Checkbox no canto superior esquerdo -- seleciona toda a matriz
- **Shift+Click:** Estender selecao (como em planilhas)

**Componentes existentes suficientes:**
- `Checkbox` (Radix) -- com suporte a `indeterminate`
- `Zustand` -- estado global de selecao
- `lucide-react` -- icones de status

### Feedback de Upload e Progresso

**Construir com componentes existentes:**
- `Progress` (shadcn) -- ja existe em `arden/components/ui/progress.tsx`
- `Sonner` (toast) -- ja existe para notificacoes
- `Skeleton` -- ja existe para loading states

---

## Nao Recomendado

### AG Grid (Community ou Enterprise)
- **Por que nao:** Cell range selection exige licenca Enterprise ($999/dev). A versao Community so tem row selection. Mesmo a versao Enterprise seria overkill -- a matriz FVS nao precisa de sorting, filtering, formulas, ou edicao de texto em celulas. O peso do bundle (200KB-2MB) nao se justifica para uma matriz de status.
- **Quando seria apropriado:** Se o projeto precisasse de um data grid complexo com edicao inline, formulas, e export Excel.
- **Fonte:** [AG Grid Community vs Enterprise](https://www.ag-grid.com/react-data-grid/community-vs-enterprise/), [Pricing](https://www.ag-grid.com/license-pricing/)

### react-data-grid (Adazzle)
- **Por que nao:** Ainda em beta (v7.0.0-beta.59), sem header groups nativos (issue #765 aberta), sem row spanning. A API e projetada para grids de dados tabulares, nao para matrizes de status. O colSpan existe mas nao substitui header groups verdadeiros. Adiciona complexidade sem beneficio claro para o caso de uso FVS.
- **Quando seria apropriado:** Se precisassemos de um grid de dados editavel com sorting e filtering.
- **Fonte:** [GitHub](https://github.com/adazzle/react-data-grid), [npm](https://www.npmjs.com/package/react-data-grid)

### TanStack Table
- **Por que nao:** E headless (nao tem cell selection, drag select, ou qualquer UI). Teriamos que implementar toda a logica de selecao de celulas manualmente de qualquer forma. TanStack Table adiciona uma camada de abstracao (columnDefs, row models) que nao precisamos -- a matriz FVS tem estrutura fixa (servicos x unidades). O overhead conceitual nao se paga.
- **Quando seria apropriado:** Se tivessemos muitas tabelas de dados diferentes com sorting, filtering e paginacao customizados.
- **Fonte:** [TanStack Table Docs](https://tanstack.com/table/latest)

### MUI X Data Grid
- **Por que nao:** Cell selection exige licenca Premium. O projeto usa shadcn/ui + Tailwind, nao MUI. Introduzir MUI criaria conflito de design systems e duplicacao de dependencias.

### Handsontable / ReactGrid / Jspreadsheet
- **Por que nao:** Bibliotecas de spreadsheet completas. Overkill para uma matriz de status. Licencas comerciais para features avancadas. Peso de bundle injustificavel.

### Supabase UI Dropzone
- **Por que nao agora:** O componente oficial tem um bug reportado onde o dropzone trava apos um upload falhar (issue #34960). Alem disso, o caso de uso FVS e "tirar foto e anexar a verificacao", nao "arrastar arquivos para uma area de drop". Um input de arquivo customizado com preview e mais apropriado.
- **Quando considerar:** Se o bug for corrigido e o caso de uso evoluir para upload de multiplos documentos (relatorios, plantas).
- **Fonte:** [GitHub Issue](https://github.com/supabase/supabase/issues/34960), [Supabase UI Docs](https://supabase.com/ui/docs/nextjs/dropzone)

### compressorjs
- **Por que nao:** API baseada em callbacks (nao retorna Promise nativa), nao usa Web Workers (bloqueia main thread em imagens grandes), remove EXIF por padrao. `browser-image-compression` tem API mais moderna, suporte a Web Workers, e workflow melhor para React.
- **Fonte:** [GitHub](https://github.com/fengyuanchen/compressorjs)

---

## Notas de Integracao

### Fluxo de Upload de Foto Integrado

```
[Captura/Selecao]  ->  [Compressao]  ->  [Upload]  ->  [Banco]
     |                      |                |            |
  <input>             browser-image-    Supabase       INSERT em
  accept=              compression      Storage       verificacoes
  "image/*"           (Web Worker)    (Signed URL)    com path
  capture=                                            do arquivo
  "environment"
```

### Configuracao de Storage no Supabase

Criar bucket `verificacoes-fotos` com:
- **Publico:** Nao (fotos de obra sao dados sensiveis)
- **Tamanho maximo:** 5MB (apos compressao, fotos terao ~0.5-1MB)
- **Tipos permitidos:** `image/jpeg, image/png, image/webp, image/heic`
- **RLS:** Baseada em `cliente_id` (mesmo padrao do banco)

### Estrutura de Pastas no Storage

```
verificacoes-fotos/
  {cliente_id}/
    {obra_id}/
      {verificacao_id}/
        {nanoid}.jpg
```

### Transformacoes de Imagem (Otimizacao de Exibicao)

O Supabase Storage suporta transformacoes on-the-fly (plano Pro):
- **Thumbnail na matriz:** `?width=48&height=48&resize=cover`
- **Preview no modal:** `?width=800&height=600&resize=contain`
- **Original:** Download sem transformacao

Se o projeto estiver no plano Free, gerar thumbnails client-side durante o upload usando `browser-image-compression` com `maxWidthOrHeight: 200` e salvar como arquivo separado.

### Integracao com Zustand (Estado da Matriz)

```typescript
interface VerificacaoMatrixStore {
  // Estado da selecao
  selectedCells: Set<string>       // "row-col" keys
  isSelecting: boolean
  selectionStart: CellCoord | null

  // Estado dos grupos
  collapsedGroups: Set<string>     // Blocos/pavimentos colapsados

  // Acoes
  startSelection: (row: number, col: number) => void
  extendSelection: (row: number, col: number) => void
  endSelection: () => void
  toggleGroup: (groupId: string) => void
  selectRow: (row: number) => void
  selectColumn: (col: number) => void
  selectAll: () => void
  clearSelection: () => void

  // Verificacao em massa
  bulkVerify: (status: VerificationStatus) => void
}
```

---

## Resumo de Instalacao

```bash
# Novas dependencias (apenas 2 pacotes)
cd arden && npm install browser-image-compression nanoid
```

**Impacto no bundle:**
- `browser-image-compression`: ~30KB gzipped (usa Web Worker, carregado sob demanda)
- `nanoid`: ~0.1KB gzipped (118 bytes)
- **Total adicional:** ~30KB gzipped

**Comparacao com alternativa de biblioteca de grid:**
- AG Grid Enterprise: ~200KB+ gzipped
- react-data-grid: ~50KB gzipped
- **Economia:** ~170-220KB evitados ao construir componente customizado

---

## Avaliacao de Confianca

| Area | Confianca | Razao |
|------|-----------|-------|
| browser-image-compression | ALTA | Npm stats verificados, API documentada, amplamente usado |
| nanoid | ALTA | 15.6K dependentes, 118 bytes, API trivial |
| Supabase Storage upload | ALTA | Documentacao oficial verificada, API estavel |
| Supabase signed upload URLs | ALTA | Documentacao oficial, padrao recomendado para Next.js |
| Matriz customizada vs biblioteca | ALTA | Analise de custo-beneficio clara, caso de uso especifico |
| Selecao de celulas customizada | MEDIA | Padrao bem documentado (joshuawootonn.com), mas implementacao customizada sempre tem riscos |
| Transformacoes de imagem Supabase | MEDIA | Requer plano Pro, nao verificado se projeto tem esse plano |

---

## Questoes em Aberto

1. **Plano Supabase:** O projeto esta no plano Pro? Isso determina se podemos usar transformacoes de imagem on-the-fly ou precisamos gerar thumbnails client-side.
2. **HEIC de iPhones:** `browser-image-compression` nao suporta HEIC nativamente. Se inspetores usarem iPhones com HEIC ativo, pode ser necessario adicionar `heic2any` (~50KB) para conversao. Investigar no momento da implementacao.
3. **Limite de unidades na matriz:** Com 500+ unidades (colunas), virtualizacao horizontal pode ser necessaria. Se isso se confirmar, `@tanstack/react-virtual` (ja compativel com React 19, ~5KB) pode ser adicionado especificamente para virtualizar as colunas da matriz, sem adotar TanStack Table.
4. **Offline-first (futuro mobile):** O fluxo de upload assume conectividade. Para o futuro app Expo, sera necessario cache local de fotos e fila de upload. Isso e escopo do milestone mobile, nao v1.1.

---

## Fontes

- [browser-image-compression (npm)](https://www.npmjs.com/package/browser-image-compression)
- [browser-image-compression (GitHub)](https://github.com/Donaldcwl/browser-image-compression)
- [nanoid (npm)](https://www.npmjs.com/package/nanoid)
- [nanoid (GitHub)](https://github.com/ai/nanoid)
- [Supabase Storage - createSignedUploadUrl](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl)
- [Supabase Storage - uploadToSignedUrl](https://supabase.com/docs/reference/javascript/storage-from-uploadtosignedurl)
- [Supabase Storage - Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [Supabase UI Dropzone](https://supabase.com/ui/docs/nextjs/dropzone)
- [AG Grid Community vs Enterprise](https://www.ag-grid.com/react-data-grid/community-vs-enterprise/)
- [AG Grid Cell Selection](https://www.ag-grid.com/react-data-grid/cell-selection/)
- [react-data-grid (GitHub)](https://github.com/adazzle/react-data-grid)
- [TanStack Table Column Groups](https://tanstack.com/table/v8/docs/framework/react/examples/column-groups)
- [TanStack Table Expanding Guide](https://tanstack.com/table/v8/docs/guide/expanding)
- [React Drag to Select (joshuawootonn)](https://www.joshuawootonn.com/react-drag-to-select)
- [Signed URL Uploads with Next.js (Medium)](https://medium.com/@olliedoesdev/signed-url-file-uploads-with-nextjs-and-supabase-74ba91b65fe0)
- [Complete Guide to File Uploads with Next.js and Supabase](https://supalaunch.com/blog/file-upload-nextjs-supabase)
