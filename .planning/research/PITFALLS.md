# Pitfalls Research: v1.1 Verificacoes no Portal Web

**Dominio:** Matriz interativa de verificacoes FVS (servicos x unidades) com upload de fotos
**Pesquisado:** 2026-01-26
**Confianca geral:** MEDIA-ALTA (baseado em documentacao oficial + multiplas fontes comunitarias)

---

## Armadilhas Criticas

Erros que causam reescrita ou problemas graves de performance/usabilidade.

---

### C1: Renderizar 5000+ Celulas sem Virtualizacao

- **Risco:** Renderizar todas as 5000 celulas (25 servicos x 200 unidades) simultaneamente no DOM causa travamento do navegador, scroll lento (< 10 FPS), e uso excessivo de memoria. React reconciliation com 5000+ DOM nodes e extremamente caro.
- **Confianca:** ALTA (consenso universal em todas as fontes pesquisadas)
- **Sinais de alerta:**
  - Primeira renderizacao da matriz > 500ms
  - Scroll com jank visivel (< 30 FPS)
  - Profiler do React mostrando re-renders em cascata
  - Usuarios reclamando que "a pagina trava"
- **Prevencao:**
  - Usar virtualizacao obrigatoriamente. Recomendacao: **@tanstack/react-virtual** (leve, sem dependencias, composavel, suporte a ambos eixos).
  - Renderizar apenas celulas visiveis + buffer de 5-10 celulas em cada direcao.
  - Para 25 servicos (linhas), virtualizacao vertical pode ser opcional se todas cabem na tela. Para 200 unidades (colunas), virtualizacao horizontal e **obrigatoria**.
  - Medir com React DevTools Profiler desde o inicio do desenvolvimento.
- **Fase:** Fase 1 (Estrutura da Matriz) -- decisao arquitetural fundamental que nao pode ser adiada.

**Fontes:**
- [React Grid DOM Virtualisation - AG Grid](https://www.ag-grid.com/react-data-grid/dom-virtualisation/)
- [TanStack Virtual - Sticky Headers Guide](https://mashuktamim.medium.com/building-sticky-headers-and-columns-with-tanstack-virtualizer-react-a-complete-guide-12123ef75334)

---

### C2: Re-renders em Cascata na Matriz

- **Risco:** Atualizar o estado de uma unica celula (ex: selecionar, marcar verificacao) causa re-render de TODAS as 5000 celulas. Com React, se o estado da matriz vive em um unico objeto/array no componente pai, qualquer mudanca dispara reconciliation completa.
- **Confianca:** ALTA (comportamento documentado do React)
- **Sinais de alerta:**
  - Clicar em uma celula demora > 100ms para feedback visual
  - React Profiler mostra "Rendered at" em centenas de componentes ao clicar uma celula
  - `useMemo` em todos os lugares como "band-aid"
- **Prevencao:**
  - **Arquitetura de estado granular com Zustand:** Usar seletores granulares por celula. Cada celula deve subscrever apenas ao seu proprio estado via `useStore(store, (s) => s.cells[cellId])`.
  - **`React.memo` em cada componente de celula:** Mesmo com React 19 Compiler (que automatiza memoizacao), para grids grandes o `React.memo` explicito ainda e critico. O compilador nao conhece o custo de render de cada componente.
  - **Referencia estavel para callbacks:** Usar `useCallback` para handlers de click/select, ou usar o pattern de callback ref com `data-*` attributes + event delegation no container.
  - **Event delegation:** Em vez de 5000 onClick handlers, usar UM handler no container da matriz que identifica a celula via `data-row` e `data-col` attributes. Reduz drasticamente overhead de memoria e event listeners.
- **Fase:** Fase 1 (Estrutura da Matriz) -- arquitetura do state management define tudo.

**Fontes:**
- [React.memo em 2025 - DEV Community](https://dev.to/shantih_palani/is-reactmemo-still-useful-in-react-19-a-practical-guide-for-2025-4lj5)
- [useMemo com AG Grid - Medium](https://medium.com/@vishubommoju/mastering-usememo-in-react-why-when-and-how-with-ag-grid-example-22a061278465)

---

### C3: RLS Policies Lentas em Operacoes Bulk

- **Risco:** Row Level Security (RLS) do Supabase avalia cada politica POR LINHA em cada query. Para um insert bulk de 200 verificacoes (selecionar coluna inteira), o Supabase avalia a RLS policy 200 vezes. Se a policy faz JOIN com outra tabela ou chama `auth.uid()` sem otimizacao, queries que deveriam levar ms levam segundos.
- **Confianca:** ALTA (documentacao oficial do Supabase + relatos da comunidade)
- **Sinais de alerta:**
  - Insert de 50+ linhas demora > 2 segundos via API
  - `EXPLAIN ANALYZE` mostra Sequential Scan em tabelas com index
  - Dashboard queries ficam progressivamente mais lentas com mais dados
- **Prevencao:**
  - **Usar `(SELECT auth.uid())` em vez de `auth.uid()` nas policies.** O wrapper `SELECT` causa initPlan optimization no Postgres, fazendo cache do resultado por statement em vez de chamar a funcao por linha.
  - **Criar indexes nos campos usados em RLS policies:** `CREATE INDEX idx_verificacoes_cliente_id ON verificacoes USING btree (cliente_id);`
  - **Especificar `TO authenticated`** em todas as policies (nao usar `public`).
  - **Para joins em policies:** Usar `IN (SELECT ...)` em vez de subconsultas correlacionadas.
  - **Para operacoes realmente massivas:** Considerar Edge Function com service_role key que bypassa RLS (com validacao manual).
- **Fase:** Fase de Bulk Operations -- aplicar ANTES de implementar insercao em massa.

**Fontes:**
- [Supabase Docs - RLS Performance Best Practices](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)
- [Optimizing RLS Performance - AntStack](https://medium.com/@antstack/optimizing-rls-performance-with-supabase-postgres-fa4e2b6e196d)

---

### C4: Estado de Verificacao como Booleanos Avulsos (Sem State Machine)

- **Risco:** Modelar o status da verificacao com flags booleanas (`isApproved`, `isRejected`, `isPending`, `needsReinspection`) cria estados impossivel como `isApproved AND isRejected` e transicoes invalidas. Com multiplos usuarios e operacoes concorrentes, race conditions podem corromper o estado.
- **Confianca:** ALTA (padrao bem documentado de engenharia de software)
- **Sinais de alerta:**
  - Codigo com `if (isApproved && !isRejected && !isPending)` em multiplos lugares
  - Bug report: "verificacao aparece como aprovada E reprovada"
  - Logica de transicao duplicada entre frontend e backend
- **Prevencao:**
  - **Usar enum de status no banco:** `status verificacao_status NOT NULL DEFAULT 'pendente'` com valores `('pendente', 'conforme', 'nao_conforme', 'nao_aplicavel', 'reinspecao')`.
  - **Definir transicoes validas explicitamente:** Criar tabela ou constraint que define quais transicoes sao permitidas (ex: `pendente -> conforme`, `nao_conforme -> reinspecao`, mas NAO `conforme -> pendente`).
  - **Validar transicoes no banco (trigger ou check):** Garantir que o backend rejeita transicoes invalidas independente do que o frontend envie.
  - **Usar `useReducer` ou Zustand com actions tipadas** no frontend para espelhar as transicoes validas.
  - **Para operacoes concorrentes:** Usar optimistic locking com coluna `updated_at` -- rejeitar update se `updated_at` no banco for diferente do que o cliente conhece.
- **Fase:** Fase de Execucao de Verificacoes -- definir na modelagem do banco, ANTES de qualquer UI.

**Fontes:**
- [State Machines in React](https://mastery.games/post/state-machines-in-react/)
- [XState - State Machine Solution](https://blog.openreplay.com/xstate-the-solution-to-all-your-app-state-problems/)

---

### C5: Upload de Fotos Sem Compressao Client-Side

- **Risco:** Fotos de celular em obra chegam com 4-12 MB cada (cameras modernas: 12-50 MP). Sem compressao, upload de 5 fotos = 20-60 MB. Em conexao 4G instavel de canteiro de obras, isso causa timeout, uploads travados, e experiencia terrivel. Alem disso, Storage costs explodem.
- **Confianca:** ALTA (documentacao Supabase + limites conhecidos de plano Free: 50 MB max por arquivo)
- **Sinais de alerta:**
  - Upload demorando > 10 segundos por foto
  - Erros 413 (Maximum size exceeded) ou timeout
  - Galeria de fotos carregando lentamente
  - Custos de storage crescendo rapidamente
- **Prevencao:**
  - **Comprimir client-side ANTES do upload** usando `browser-image-compression` ou `compressorjs`.
  - **Parametros recomendados para fotos de obra:** `maxWidth: 1600px`, `quality: 0.8`, formato JPEG. Resulta em ~200-400 KB por foto (reducao de 95%+).
  - **Para fotos > 6 MB (mesmo comprimidas):** Usar upload resumivel (TUS protocol) do Supabase para confiabilidade em conexoes instaveis.
  - **Definir limite no bucket:** Configurar `maxFileSize` no bucket do Supabase (ex: 5 MB) como safety net.
  - **Liberar Object URLs:** Sempre chamar `URL.revokeObjectURL()` apos uso para evitar memory leaks.
  - **Usar Supabase Image Transformations** ao servir: guardar original comprimido, gerar thumbnails on-the-fly.
- **Fase:** Fase de Upload de Fotos -- implementar pipeline de compressao ANTES do upload.

**Fontes:**
- [Client-side image compression with Supabase Storage](https://mikeesto.com/posts/subaseimagecompression/)
- [Supabase Storage - File Limits](https://supabase.com/docs/guides/storage/uploads/file-limits)
- [browser-image-compression - npm](https://www.npmjs.com/package/browser-image-compression)

---

## Armadilhas Medias

Erros que causam atrasos significativos ou debito tecnico.

---

### M1: Sticky Headers + Sticky Columns com `position: sticky` Quebrados

- **Risco:** Combinar header fixo (scroll vertical) com primeira coluna fixa (scroll horizontal) em uma tabela e surpreendentemente complicado. `position: sticky` nao funciona em `<thead>` ou `<tr>` diretamente, e qualquer ancestor com `overflow: hidden` quebra silenciosamente o comportamento sticky.
- **Confianca:** ALTA (problema bem documentado com CSS)
- **Sinais de alerta:**
  - Header "desgruda" ao scrollar em certas condicoes
  - Celula no canto superior esquerdo (intersecao header + coluna fixa) nao fica acima de ambos
  - Bordas desaparecem ao scrollar (border-collapse issue)
  - Funciona no Chrome mas quebra no Firefox
- **Prevencao:**
  - Aplicar `position: sticky` diretamente nos `<th>` e `<td>`, nunca em `<thead>` ou `<tr>`.
  - Gerenciar z-index em 3 niveis: celulas normais (z-0), header e coluna fixa (z-10), celula de intersecao (z-20).
  - Usar `border-collapse: separate` (nao `collapse`) para manter bordas visiveis ao scrollar.
  - Verificar que NENHUM ancestor tenha `overflow: hidden` (exceto o container de scroll).
  - Se usar virtualizacao, considerar **@tanstack/react-virtual** que tem guias especificos para sticky + virtual grid.
  - **Testar em Firefox** alem do Chrome (Firefox requer z-index explicito).
- **Fase:** Fase 1 (Estrutura da Matriz) -- resolver junto com virtualizacao.

**Fontes:**
- [CSS-Tricks: Sticky Header + Sticky Column](https://css-tricks.com/a-table-with-both-a-sticky-header-and-a-sticky-first-column/)
- [Position Sticky and Table Headers](https://css-tricks.com/position-sticky-and-table-headers/)
- [ReactGrid: Concurrent Sticky Headers Guide](https://reactgrid.com/blog/how-to-build-a-table-with-concurrent-sticky-headers/)

---

### M2: Selecao Tipo Planilha com Conflitos de Drag vs Click vs Texto

- **Risco:** Implementar selecao de celulas com click, Shift+click, Ctrl+click, e drag-to-select causa conflitos entre: selecao de texto do navegador, click normal vs inicio de drag, e acessibilidade (drag nao e acessivel). Sem threshold de distancia, um click simples e interpretado como drag de 0px.
- **Confianca:** ALTA (documentado extensivamente)
- **Sinais de alerta:**
  - Click em celula tambem seleciona texto adjacente
  - Drag acidental ao tentar clicar
  - Selecao nao funciona com teclado (Shift+Arrow)
  - Usuarios de screen reader nao conseguem navegar a matriz
- **Prevencao:**
  - **CSS `user-select: none`** no container da matriz para prevenir selecao de texto.
  - **Threshold de distancia (8px)** antes de iniciar drag: so iniciar drag no `onPointerMove` apos mover >= 8 pixels do ponto inicial.
  - **Separar estado de foco vs selecao:** Manter `focusedCell` (uma celula) e `selectedCells` (Set de celulas) como estados distintos.
  - **Implementar keyboard first:** Shift+Arrow para expandir selecao, Enter para confirmar, Escape para cancelar. Drag e um bonus, nao o metodo primario.
  - **Seguir WAI-ARIA grid pattern:** Role `grid` no container, `row` nas linhas, `gridcell` nas celulas. Roving tabindex (tabIndex=0 na celula focada, -1 nas demais).
- **Fase:** Fase de Selecao -- implementar APOS a estrutura basica da matriz funcionar.

**Fontes:**
- [React Drag to Select - Joshua Wootonn](https://www.joshuawootonn.com/react-drag-to-select)
- [W3C WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [Meta Engineering: ARIA Grid](https://engineering.fb.com/2017/03/28/web/aria-grid-supporting-nonvisual-layout-and-keyboard-traversal/)

---

### M3: Bulk Insert via API REST do Supabase (Limite de Payload)

- **Risco:** O Supabase client (PostgREST) tem overhead por requisicao. Inserir 200 verificacoes individualmente (uma por celula) resulta em 200 round-trips HTTP. Inserir todas em um unico payload pode exceder limites de tamanho. Inserir 55k+ linhas via API leva > 1 hora segundo relatos.
- **Confianca:** ALTA (discussoes oficiais do Supabase)
- **Sinais de alerta:**
  - Bulk operation demorando > 5 segundos
  - Erros de timeout em insercoes grandes
  - Usuarios veem spinner prolongado ao confirmar selecao em massa
- **Prevencao:**
  - **Batch em grupos de 100-500 linhas** por request. Nao enviar 1 por vez, nem 5000 de uma vez.
  - **Usar upsert com `ON CONFLICT`** para evitar erros quando a verificacao ja existe: `supabase.from('verificacoes').upsert(rows, { onConflict: 'servico_id,unidade_id' })`.
  - **Para operacoes criticas de volume:** Criar uma **Edge Function** ou **RPC function** no Postgres que recebe JSON array e insere tudo em uma transacao server-side, evitando overhead do PostgREST.
  - **Mostrar progresso:** Para batches multiplos, mostrar barra de progresso (ex: "Criando verificacoes: 150/200").
  - **Timeout configuravel:** Aumentar statement_timeout para sessoes de bulk insert.
- **Fase:** Fase de Bulk Operations -- projetar o mecanismo de insert ANTES de construir a UI de selecao em massa.

**Fontes:**
- [Supabase Discussion: Best Practices for Large Inserts](https://github.com/orgs/supabase/discussions/11349)
- [Supabase Bulk Insert Guide - Restack](https://www.restack.io/docs/supabase-knowledge-supabase-bulk-insert-guide)

---

### M4: Race Conditions em Operacoes Concorrentes de Verificacao

- **Risco:** Dois engenheiros abrem a mesma matriz. Engenheiro A seleciona colunas 1-50, Engenheiro B seleciona colunas 25-75. Ambos clicam "Criar Verificacoes" simultaneamente. Sem controle, resultado e: verificacoes duplicadas nas colunas 25-50, ou erro silencioso, ou dados corrompidos.
- **Confianca:** MEDIA (cenario real mas probabilidade depende do numero de usuarios simultaneos)
- **Sinais de alerta:**
  - Verificacoes duplicadas no banco de dados
  - Erro "unique constraint violation" sem tratamento no UI
  - UI mostra estado diferente do banco apos operacao concorrente
- **Prevencao:**
  - **`ON CONFLICT DO NOTHING` ou `DO UPDATE`** em todo insert de verificacao. Definir unique constraint `(servico_id, unidade_id, obra_id)`.
  - **Tratar conflito no frontend:** Quando o bulk insert retorna com conflitos, mostrar ao usuario: "X verificacoes ja existiam e foram mantidas. Y novas verificacoes criadas."
  - **Optimistic locking com `updated_at`:** Para updates, verificar que a linha nao foi alterada entre leitura e escrita.
  - **Supabase Realtime (futuro):** Considerar subscription para atualizar a matriz em tempo real quando outro usuario faz mudancas.
- **Fase:** Fase de Bulk Operations -- tratar conflitos e a segunda prioridade apos o insert basico funcionar.

**Fontes:**
- [Supabase: Handling Concurrent Writes](https://bootstrapped.app/guide/how-to-handle-concurrent-writes-in-supabase)
- [Supabase ON CONFLICT DO UPDATE](https://www.restack.io/docs/supabase-knowledge-supabase-on-conflict-do-update-example)

---

### M5: Canvas Memory Crash em Safari (Compressao de Imagem)

- **Risco:** Safari tem limites de memoria muito mais restritos para elementos Canvas do que Chrome/Firefox. Fotos de smartphones modernos (12+ MP = 4000x3000px) criam Canvas enormes. Em iPhones, o Safari pode crashar silenciosamente (saida em branco) ou travar a aba ao tentar comprimir multiplas fotos.
- **Confianca:** MEDIA (documentado pela biblioteca browser-image-compression, mas depende do dispositivo)
- **Sinais de alerta:**
  - Fotos saem "em branco" apos compressao no iOS Safari
  - Aba do navegador crasha ao comprimir multiplas fotos
  - `browser-image-compression` retorna sem erro mas com arquivo vazio
- **Prevencao:**
  - **Limitar maxWidth/maxHeight a 4096px** (limite seguro para Canvas em todos os navegadores).
  - **Processar fotos sequencialmente**, nao em paralelo. Fila de compressao: comprimir foto 1, fazer upload, comprimir foto 2, etc.
  - **Usar `OffscreenCanvas` em Web Worker** quando suportado (Chrome, Edge) para nao bloquear UI thread.
  - **Fallback sem compressao:** Se Canvas falhar, fazer upload da foto original com aviso de que pode demorar mais.
  - **Testar em iPhone/Safari** como caso de teste primario (pior cenario).
- **Fase:** Fase de Upload de Fotos -- testar logo apos implementar pipeline de compressao.

**Fontes:**
- [browser-image-compression - npm (Canvas limits note)](https://www.npmjs.com/package/browser-image-compression)
- [Image Compression Techniques in JavaScript - ImageKit](https://imagekit.io/blog/image-compression-techniques-in-javascript/)

---

### M6: Scroll Horizontal Dessincronizado entre Header e Body

- **Risco:** Se header e body da matriz estiverem em containers de scroll separados (comum com header fixo), o scroll horizontal fica dessincronizado -- o usuario scrolle o body mas o header nao acompanha, ou acompanha com lag visivel.
- **Confianca:** MEDIA-ALTA (problema classico de UI)
- **Sinais de alerta:**
  - Colunas do header nao alinham com colunas do body apos scroll
  - Lag visivel entre scroll do body e ajuste do header
  - Pior em dispositivos mais lentos/mobiles
- **Prevencao:**
  - **Preferir container de scroll unico** com `position: sticky` no header (evita problema completamente).
  - Se precisar de containers separados: usar `onScroll` no container principal para sincronizar `scrollLeft` do header via `requestAnimationFrame`.
  - **Nao usar `scrollSync` com setTimeout** -- causa flicker. Usar `transform: translateX()` para mover header programaticamente.
  - Com **@tanstack/react-virtual**, usar um unico container de scroll e aplicar sticky via CSS nos elementos de header.
- **Fase:** Fase 1 (Estrutura da Matriz) -- definir abordagem de scroll na arquitetura.

**Fontes:**
- [Gearheart: Smooth Virtual Scroll with Fixed Rows/Columns](https://gearheart.io/blog/smooth-react-virtual-scroll-with-fixed-rows-columns/)
- [Fixing Horizontal Scroll Table Header - Medium](https://medium.com/neocoast/fixing-a-table-header-on-a-horizontally-scrolling-table-de3364610957)

---

## Armadilhas Menores

Erros que causam incomodo mas sao corrigiveis.

---

### L1: Orientacao EXIF Ignorada em Fotos de Celular

- **Risco:** Fotos de smartphones podem aparecer rotacionadas 90 graus na preview porque o navegador nem sempre respeita metadados EXIF de orientacao. Foto tirada em retrato aparece em paisagem.
- **Sinais de alerta:** Previews de fotos rotacionadas incorretamente no formulario de upload.
- **Prevencao:** Usar `compressorjs` que corrige orientacao EXIF automaticamente durante compressao. Ou usar `browser-image-compression` com opcao de correcao de orientacao habilitada.
- **Fase:** Fase de Upload de Fotos -- resolvido automaticamente se usar as bibliotecas recomendadas.

---

### L2: Memory Leak com Object URLs nao Revogadas

- **Risco:** Cada `URL.createObjectURL()` para preview de imagem aloca memoria que so e liberada com `URL.revokeObjectURL()`. Em uma sessao com muitas fotos, memoria do navegador cresce continuamente.
- **Sinais de alerta:** Tab do navegador ficando lenta ao longo do tempo. Memory usage crescendo no Task Manager.
- **Prevencao:** Revogar URLs no cleanup do `useEffect`: `return () => URL.revokeObjectURL(previewUrl)`.
- **Fase:** Fase de Upload de Fotos -- boas praticas de implementacao.

---

### L3: Perda de Selecao ao Re-render da Matriz

- **Risco:** Se a matriz re-renderiza (ex: dados atualizados do servidor), a selecao atual do usuario e perdida porque o estado de selecao esta atrelado a indices de array que mudaram.
- **Sinais de alerta:** Usuario seleciona 50 celulas, dados atualizam, selecao desaparece.
- **Prevencao:** Indexar selecao por IDs unicos (ex: `"servico_123_unidade_456"`), nao por posicao (row index, col index). Manter selecao em store Zustand separado dos dados da matriz.
- **Fase:** Fase de Selecao -- decisao de modelagem do estado.

---

### L4: Falta de Feedback Visual em Operacoes Lentas

- **Risco:** Operacao de bulk insert (200 verificacoes) leva 2-3 segundos. Sem feedback, usuario clica novamente, disparando operacao duplicada.
- **Sinais de alerta:** Double-clicks criando operacoes duplicadas. Usuarios perguntando "funcionou?"
- **Prevencao:** Desabilitar botao imediatamente. Mostrar skeleton/spinner na area afetada. Toast de sucesso/erro ao concluir. Usar `isPending` de React 19 transitions.
- **Fase:** Todas as fases de operacoes -- padrao de UX basico.

---

### L5: Collapsible Groups Quebrando Virtualizacao

- **Risco:** Grupos colapsiveis de colunas (ex: "Bloco A: unidades 1-50") mudam o numero total de colunas visiveis. Se a virtualizacao nao for notificada do collapse/expand, renderiza colunas fantasma ou calcula scroll incorretamente.
- **Sinais de alerta:** Espaco em branco apos colapsar grupo. Scroll "pula" ao expandir grupo.
- **Prevencao:** Ao colapsar/expandir, recalcular `totalSize` e `count` do virtualizer. Usar `virtualizer.measure()` para forcar re-medicao. Manter estado de grupos colapsados no Zustand e derivar lista de colunas visiveis.
- **Fase:** Fase de Grupos Colapsiveis -- implementar APOS virtualizacao basica funcionar.

---

### L6: Upload Concorrente de Multiplas Fotos sem Limite

- **Risco:** Usuario seleciona 10 fotos de uma vez. Sem limite de concorrencia, 10 uploads + 10 compressoes simultaneas sobrecarregam o navegador e a rede.
- **Sinais de alerta:** Navegador travando ao selecionar multiplas fotos. Uploads falhando por timeout.
- **Prevencao:** Implementar fila de upload com concorrencia maxima de 2-3 uploads simultaneos. Comprimir sequencialmente (1 por vez) e uplodar com concorrencia limitada. Usar `Promise.allSettled` (nao `Promise.all`) para nao cancelar uploads bem-sucedidos se um falhar.
- **Fase:** Fase de Upload de Fotos.

---

## Alertas por Fase

| Fase/Topico | Armadilha Provavel | Mitigacao |
|-------------|-------------------|-----------|
| Estrutura da Matriz | C1 (sem virtualizacao), C2 (re-renders), M1 (sticky), M6 (scroll sync) | @tanstack/react-virtual + Zustand granular + container de scroll unico |
| Selecao de Celulas | M2 (drag vs click), L3 (perda de selecao) | Keyboard-first, threshold de 8px, IDs unicos para selecao |
| Execucao de Verificacoes | C4 (state machine), L4 (feedback) | Enum de status no banco + transicoes explicitas |
| Bulk Operations | C3 (RLS lenta), M3 (limite de payload), M4 (race conditions) | initPlan em RLS + batch de 100-500 + ON CONFLICT |
| Upload de Fotos | C5 (sem compressao), M5 (Safari Canvas), L1 (EXIF), L2 (memory leak), L6 (concorrencia) | compressorjs + fila sequencial + limite de concorrencia |
| Grupos Colapsiveis | L5 (virtualizacao quebrada) | Recalcular virtualizer ao colapsar/expandir |

---

## Recomendacao de Ordem de Mitigacao

1. **Primeira coisa:** Prototipar a matriz com @tanstack/react-virtual + sticky header/coluna. Se essa base nao funcionar bem, TUDO que vem depois sera comprometido.
2. **Segunda coisa:** Definir state machine de verificacao e esquema de banco com enum de status e constraints de transicao.
3. **Terceira coisa:** Implementar pipeline de compressao de imagem e testar em Safari iOS.
4. **Quarta coisa:** Otimizar RLS policies com initPlan pattern ANTES de implementar bulk operations.
5. **Quinta coisa:** Implementar selecao de celulas (keyboard-first, depois drag).

---

## Fontes Gerais

- [Supabase Docs - RLS Performance](https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv)
- [Supabase Docs - Storage File Limits](https://supabase.com/docs/guides/storage/uploads/file-limits)
- [Supabase Docs - Storage Uploads](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
- [W3C WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [TanStack Virtual - Sticky Grid Guide](https://mashuktamim.medium.com/building-sticky-headers-and-columns-with-tanstack-virtualizer-react-a-complete-guide-12123ef75334)
- [AG Grid - DOM Virtualisation](https://www.ag-grid.com/react-data-grid/dom-virtualisation/)
- [CSS-Tricks - Sticky Table Headers](https://css-tricks.com/position-sticky-and-table-headers/)
- [React Drag to Select](https://www.joshuawootonn.com/react-drag-to-select)
- [browser-image-compression npm](https://www.npmjs.com/package/browser-image-compression)
- [Supabase Discussion - Bulk Inserts](https://github.com/orgs/supabase/discussions/11349)
- [Handling Concurrent Writes in Supabase](https://bootstrapped.app/guide/how-to-handle-concurrent-writes-in-supabase)
- [Meta Engineering - ARIA Grid](https://engineering.fb.com/2017/03/28/web/aria-grid-supporting-nonvisual-layout-and-keyboard-traversal/)
