# Research Summary: v1.1 Verificacoes no Portal Web

**Projeto:** Arden FVS
**Dominio:** Matriz interativa de verificacoes FVS (servicos x unidades) com execucao individual/lote e upload de fotos
**Pesquisado:** 2026-01-26
**Confianca:** ALTA

## Resumo Executivo

A v1.1 e o milestone mais critico do Arden: transforma o portal web de ferramenta de cadastro em ferramenta de execucao de qualidade. O nucleo e uma matriz interativa Servicos x Unidades onde engenheiros visualizam o estado de verificacoes da obra inteira e executam verificacoes individuais ou em lote. Nenhum concorrente brasileiro (AutoDOC, QualitTAB) oferece essa experiencia -- todos operam por navegacao sequencial. A matriz interativa com selecao tipo planilha e o diferencial competitivo numero 1.

A abordagem recomendada e construir a matriz como componente customizado usando CSS Grid + estado local React, em vez de adotar bibliotecas de spreadsheet/grid (AG Grid, TanStack Table, Handsontable). O caso de uso e fundamentalmente diferente de um data grid: celulas exibem icones de status, nao texto editavel. Isso economiza 170-220KB de bundle e da controle total sobre visual e interacoes. As unicas dependencias novas sao `browser-image-compression` (~30KB) para compressao de fotos e `nanoid` (~0.1KB) para nomes de arquivo. O schema do banco ja contem todas as tabelas necessarias (`verificacoes`, `itens_verificacao`, `fotos_nc`) com triggers de contadores automaticos.

Os riscos principais sao: (1) performance da matriz com 5000+ celulas sem virtualizacao ou sem filtros por agrupamento, (2) re-renders em cascata ao atualizar estado de selecao, (3) RLS policies lentas em operacoes bulk, e (4) upload de fotos grandes sem compressao. Todos tem mitigacoes claras documentadas na pesquisa. A decisao arquitetural mais importante -- e que deve ser tomada PRIMEIRO -- e a estrategia de renderizacao da matriz (CSS Grid com filtro por agrupamento como default, virtualizacao so se necessario).

## Achados Principais

### Stack Recomendada

O stack existente do Arden (Next.js + Supabase + shadcn/ui + Zustand) e suficiente para quase tudo. Apenas 2 pacotes novos sao necessarios.

**Tecnologias core:**
- **CSS Grid customizado**: Matriz de status -- controle total, ~5-15KB vs 200KB+ de bibliotecas de grid
- **browser-image-compression** (^2.0.2): Compressao client-side de fotos com Web Worker -- fotos de 5-10MB reduzidas para ~0.5-1MB
- **nanoid** (^5.1.6): IDs unicos URL-safe para nomes de arquivo no Storage -- 118 bytes
- **Supabase Storage** (signed upload URLs): Upload de fotos via URL assinada -- evita limite de 1MB do body em Server Actions
- **Estado local (useState/useRef)**: Selecao de celulas e estado transiente de UI, NAO Zustand global

**Decisoes de "nao usar":**
- AG Grid: Cell selection exige licenca Enterprise ($999/dev)
- TanStack Table: Headless, sem cell selection nativo, abstracao desnecessaria
- react-data-grid: Beta, sem header groups nativos
- Supabase UI Dropzone: Bug reportado (#34960), caso de uso diferente

### Escopo de Features

**Must have (table stakes):**
- Matriz Servicos x Unidades com status visual por celula (cor + icone + texto)
- Scroll horizontal com coluna de servico fixa e header fixo
- Verificacao individual (pagina dedicada com itens C/NC/Excecao)
- Upload de fotos por item NC (obrigatorio)
- Agrupamento de colunas por Torre/Quadra com headers multinivel
- Selecao de celulas (Click + Shift+Click)
- Verificacao em lote via modal com resolucao de conflitos
- Indicador de progresso por servico (linha)
- Ciclo de vida de status (Pendente -> Conforme/NC/Excecao, NC -> Reinspecao)

**Should have (diferenciadores):**
- Ctrl+Click para selecao nao-adjacente
- Selecao de linha/coluna inteira via header
- Toolbar flutuante contextual (estilo Notion/Figma)
- Progresso por agrupamento no header
- Atalhos de teclado (Enter, Esc, Espaco)

**Diferido (v1.2+):**
- Colunas colapsiveis com coluna-resumo
- Heatmap de intensidade de status
- Drag-to-select (click+arrastar)
- Exportacao PDF da matriz
- Salvamento automatico na verificacao individual
- Edicao inline na celula (anti-feature -- NAO construir)
- Modo offline no portal web (escopo mobile)

### Abordagem de Arquitetura

O schema v1.0 ja contem todas as tabelas necessarias. A arquitetura segue o padrao existente do codebase: Server Component para fetch + Client Component para interatividade. A matriz e construida com 3 queries paralelas no server (servicos, unidades, verificacoes) e montada como Map para lookup O(1). Operacoes de escrita passam por Server Actions (prepara para auth futura). Bulk inserts usam RPC PostgreSQL (`bulk_verificar_conforme`) para atomicidade e eficiencia.

**Componentes principais:**
1. **Pagina da Matriz** (`/app/obras/[id]/verificacoes`) -- Grid CSS com celulas de status, filtros por agrupamento, selecao de celulas, toolbar de acoes em lote
2. **Pagina de Verificacao Individual** (`/app/obras/[id]/verificacoes/[verificacaoId]`) -- Lista de itens com toggle C/NC/Excecao, painel NC com observacao e upload de fotos, painel de reinspecao
3. **Modal de Verificacao em Lote** -- Selector de resultado, resolucao de conflitos, contagem de celulas afetadas
4. **Pipeline de Upload de Fotos** -- Compressao client-side + upload via signed URL + registro em `fotos_nc`
5. **RPC bulk_verificar_conforme** -- Funcao PostgreSQL que cria verificacoes + itens em transacao atomica

### Schema do Banco

**Tabelas existentes (nenhuma migration para estrutura core):**

| Tabela | Funcao |
|--------|--------|
| `verificacoes` | 1 registro por par servico+unidade. Contadores denormalizados via trigger. UNIQUE(unidade_id, servico_id) |
| `itens_verificacao` | Items individuais com status C/NC/Excecao + reinspecao. UNIQUE(verificacao_id, item_servico_id) |
| `fotos_nc` | Fotos de NC com path no Storage, GPS opcional |

**Migrations necessarias:**
- Bucket `verificacoes` no Supabase Storage com RLS policies
- RPC `bulk_verificar_conforme` para operacoes em lote
- View `view_matriz_verificacoes` (opcional, so se performance insuficiente)

### Armadilhas Criticas

1. **Renderizacao de 5000+ celulas sem estrategia** -- Filtrar por agrupamento como default (mostrar 1 agrupamento por vez). Considerar @tanstack/react-virtual so se > 5000 celulas visiveis. Medir com React DevTools Profiler desde o inicio.
2. **Re-renders em cascata na matriz** -- Usar React.memo em cada celula, event delegation (1 handler no container, nao 5000), estado granular com seletores por celula, useRef para drag tracking.
3. **RLS policies lentas em bulk** -- Usar `(SELECT auth.uid())` em vez de `auth.uid()` nas policies (initPlan optimization). Indexes nos campos usados em policies. Para bulk massivo, RPC com service_role.
4. **Upload de fotos sem compressao** -- Fotos de celular chegam com 4-12MB. Comprimir para <= 1MB com browser-image-compression ANTES do upload. Processar fotos sequencialmente (Canvas crash em Safari).
5. **Sticky headers + sticky column quebrados** -- Aplicar `position: sticky` nos `<th>/<td>` diretamente, z-index em 3 niveis, `border-collapse: separate`, container de scroll unico.

### Ordem de Construcao Recomendada

```
Fase A: Fundacao (banco + queries + server actions)
  |
  v
Fase B: Verificacao Individual (pagina dedicada)
  |
  v
Fase C: Matriz (grid + selecao + bulk)
  |
  v
Fase D: Navegacao e Integracao
```

## Implicacoes para o Roadmap

### Fase 1: Fundacao de Dados e Server Actions

**Racional:** Tudo depende de queries e operacoes de escrita funcionando. Sem essa base, nenhuma UI pode ser construida. E tambem a fase com menos risco -- usa schema existente.
**Entrega:** Bucket de Storage configurado, RPC de bulk insert, Server Actions completas (CRUD de verificacoes, upload de fotos), queries da matriz.
**Features abordadas:** Nenhuma feature visivel -- infraestrutura pura.
**Armadilhas a evitar:** C3 (RLS lenta) -- aplicar initPlan pattern nas policies desde o inicio.

### Fase 2: Verificacao Individual

**Racional:** E a unidade atomica do sistema -- verificar 1 servico em 1 unidade. A matriz e apenas uma visao que leva ate aqui. Construir primeiro permite validar o fluxo de dados end-to-end antes de investir na UI complexa da matriz.
**Entrega:** Pagina `/app/obras/[id]/verificacoes/[verificacaoId]` com lista de itens, toggle C/NC/Excecao, painel NC com observacao e upload de fotos, pipeline de compressao.
**Features abordadas:** Verificacao individual (table stake #2), upload de fotos NC (table stake #2), ciclo de vida de status (table stake #4).
**Armadilhas a evitar:** C4 (sem state machine -- usar enum de status), C5 (sem compressao -- pipeline obrigatorio), M5 (Canvas crash Safari -- processar fotos sequencialmente), L1 (EXIF), L2 (memory leak Object URLs).

### Fase 3: Matriz Basica

**Racional:** Com a verificacao individual funcionando, a matriz e a visao panoramica que conecta tudo. O risco principal (performance de renderizacao) e isolado nesta fase.
**Entrega:** Pagina `/app/obras/[id]/verificacoes` com grid CSS, celulas de status visual, scroll com header/coluna fixa, filtro por agrupamento, headers multinivel.
**Features abordadas:** Matriz Servicos x Unidades (table stake #1), scroll fixo (table stake #1), agrupamento de colunas (table stake #5), progresso por servico (diferenciador).
**Armadilhas a evitar:** C1 (sem virtualizacao/filtro), C2 (re-renders), M1 (sticky headers), M6 (scroll dessincronizado).

### Fase 4: Selecao e Operacoes em Lote

**Racional:** Depende da matriz basica estar funcionando. A selecao de celulas e a feature mais complexa de interacao e o maior diferencial competitivo. Separar em fase propria permite iterar sem arriscar a estabilidade da matriz.
**Entrega:** Selecao de celulas (Click, Shift+Click, Ctrl+Click), selecao de linha/coluna, toolbar flutuante, modal de verificacao em lote, resolucao de conflitos.
**Features abordadas:** Selecao tipo planilha (diferenciador #1), verificacao em lote (table stake #3), toolbar flutuante (diferenciador), resolucao de conflitos bulk (diferenciador).
**Armadilhas a evitar:** M2 (drag vs click -- keyboard-first), M3 (limite de payload -- batch em grupos), M4 (race conditions -- ON CONFLICT), L3 (perda de selecao -- indexar por IDs), L4 (feedback visual).

### Fase 5: Navegacao e Integracao

**Racional:** Fase final que conecta tudo ao app existente. Sem complexidade tecnica significativa, mas necessaria para experiencia completa.
**Entrega:** Sidebar atualizada (remover badge "Em breve"), breadcrumbs, links entre matriz e verificacao individual, botao "Voltar a matriz", KPIs do dashboard com dados reais.
**Features abordadas:** Integracao de navegacao, dashboard update.
**Armadilhas a evitar:** Nenhuma critica -- fase de integracao com padroes ja estabelecidos no codebase.

### Racional de Ordenacao das Fases

- **Fundacao primeiro:** Queries e server actions sao dependencia de tudo. Zero risco, maximo reuso.
- **Individual antes da matriz:** Valida fluxo de dados completo (criar verificacao, preencher itens, upload de foto) sem a complexidade da UI da matriz. Se algo estiver errado no schema ou nas queries, descobre aqui.
- **Matriz antes de selecao:** A matriz basica (visualizacao) e util mesmo sem selecao -- engenheiro ja ve o estado da obra. Selecao/bulk e uma camada adicional.
- **Selecao como fase separada:** E a feature de maior risco tecnico (interacao complexa). Isolando, evita-se que problemas de selecao atrasem a entrega da matriz basica.
- **Integracao por ultimo:** E "polish" -- conectar os pontos. Tudo ja funciona, so falta estar acessivel pelo menu.

### Flags de Pesquisa

**Fases que provavelmente precisam de `/gsd:research-phase` durante o planejamento:**
- **Fase 3 (Matriz Basica):** Performance de renderizacao com CSS Grid vs virtualizacao precisa de prototipacao. Sticky headers + scroll horizontal e surpreendentemente complexo. Recomendo prototipar ANTES de planejar os tickets detalhados.
- **Fase 4 (Selecao e Lote):** Interacao de selecao de celulas com keyboard + mouse tem edge cases nao triviais (accessibility, drag threshold, focus vs selection). Referencia principal: joshuawootonn.com/react-drag-to-select.

**Fases com padroes bem documentados (pular pesquisa adicional):**
- **Fase 1 (Fundacao):** Supabase Storage, RPC, Server Actions -- tudo documentado oficialmente. Padroes ja existem no codebase.
- **Fase 2 (Verificacao Individual):** Pagina de formulario padrao Next.js com componentes shadcn existentes. Upload de fotos com browser-image-compression tem API trivial.
- **Fase 5 (Integracao):** Padroes de sidebar, breadcrumb, navegacao ja existem no codebase.

## Avaliacao de Confianca

| Area | Confianca | Notas |
|------|-----------|-------|
| Stack | ALTA | Apenas 2 dependencias novas, ambas com npm stats solidos. Decisao de nao usar biblioteca de grid e bem fundamentada. |
| Features | MEDIA-ALTA | Table stakes claras baseadas em analise competitiva e requisitos PBQP-H. Diferenciadores validados contra concorrentes. Incerteza no escopo exato de bulk operations. |
| Arquitetura | ALTA | Schema existente verificado diretamente. Padroes de Server/Client Component consolidados no codebase. RPC para bulk e padrao Supabase documentado. |
| Armadilhas | MEDIA-ALTA | Armadilhas de performance (C1, C2) sao bem conhecidas mas mitigacoes dependem de medicao real. Canvas crash em Safari (M5) depende dos dispositivos dos usuarios. |

**Confianca geral:** ALTA

### Lacunas a Enderecar

- **Plano Supabase:** O projeto esta no plano Pro? Determina se transformacoes de imagem on-the-fly estao disponiveis ou se thumbnails precisam ser gerados client-side.
- **HEIC de iPhones:** `browser-image-compression` nao suporta HEIC nativamente. Se inspetores usarem iPhones com HEIC ativo, pode precisar de `heic2any` (~50KB). Verificar durante implementacao da Fase 2.
- **Limite real de unidades:** Obras com 500+ unidades sao raras mas possiveis. A decisao de CSS Grid puro vs @tanstack/react-virtual depende de testes de performance reais na Fase 3. Filtro por agrupamento e a mitigacao principal.
- **Auth nao integrada:** O portal usa `DEV_CLIENTE_ID` hardcoded. Server Actions com service_role key sao necessarias para escrita. RLS policies so serao efetivas apos integracao de auth (fora de escopo v1.1).
- **Virtualizacao horizontal:** Para o caso tipico (20 servicos x 80 unidades = 1600 celulas), CSS Grid puro com filtro de agrupamento e suficiente. A pesquisa de PITFALLS recomenda virtualizacao obrigatoria para 200+ colunas, mas a pesquisa de ARCHITECTURE recomenda comecar sem. Recomendacao final: comecar sem virtualizacao, medir, adicionar @tanstack/react-virtual se necessario. Filtro de agrupamento como default reduz dramaticamente o numero de colunas visiveis.

## Fontes

### Primarias (ALTA confianca)
- `database/schema.sql` -- Schema completo verificado (tabelas verificacoes, itens_verificacao, fotos_nc)
- `database/rls-policies.sql` -- Politicas RLS completas para verificacoes
- [Supabase Storage Docs](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl) -- Upload via signed URLs
- [Supabase RLS Performance Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv) -- initPlan optimization
- [AG Grid Cell Selection](https://www.ag-grid.com/react-data-grid/cell-selection/) -- Analise de alternativas descartadas
- [PatternFly Bulk Selection](https://www.patternfly.org/patterns/bulk-selection/) -- Padroes de operacoes em lote
- [W3C WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) -- Acessibilidade de grids

### Secundarias (MEDIA confianca)
- [React Drag to Select](https://www.joshuawootonn.com/react-drag-to-select) -- Implementacao de selecao de celulas
- [CSS-Tricks: Sticky Header + Sticky Column](https://css-tricks.com/a-table-with-both-a-sticky-header-and-a-sticky-first-column/) -- Sticky elements em tabelas
- [browser-image-compression (npm)](https://www.npmjs.com/package/browser-image-compression) -- Compressao de imagens
- [Supabase Discussion: Bulk Inserts](https://github.com/orgs/supabase/discussions/11349) -- Padroes de insercao em massa
- [AutoDOC FVS](https://autodoc.com.br/fvs/) -- Analise competitiva

### Terciarias (BAIXA confianca)
- [Visibuild Inspection Matrix](https://medium.com/@baileypwhite/inspection-matrix-bringing-clarity-to-complex-inspection-workflows-acf900a0a0a9) -- Referencia parcial (paywall)

---
*Pesquisa concluida: 2026-01-26*
*Pronto para roadmap: sim*
