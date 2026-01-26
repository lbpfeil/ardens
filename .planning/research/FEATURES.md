# Features Research: v1.1 Verificacoes no Portal Web

**Dominio:** Matriz de verificacao de servicos para gestao de qualidade em construcao civil (PBQP-H)
**Pesquisado:** 2026-01-26
**Confianca geral:** MEDIUM-HIGH

---

## Resumo Executivo

A v1.1 introduz o nucleo do valor do Arden: execucao de verificacoes via portal web usando uma matriz Servicos x Unidades. Esta pesquisa mapeou padroes UX de ferramentas concorrentes (AutoDOC FVS, QualitTAB, Visibuild, Fieldwire, PlanRadar), padroes de design systems corporativos (PatternFly, Carbon, MUI, Astro UXDS) e praticas consolidadas em data grids (AG Grid, Handsontable, TanStack Table).

O diferencial competitivo do Arden nesta milestone e **velocidade de execucao**: enquanto concorrentes como AutoDOC operam por navegacao sequencial (servico > unidade > preencher), a matriz permite visao panoramica e acoes em lote, reduzindo drasticamente o tempo do engenheiro.

---

## Table Stakes

Features que usuarios esperam. Ausencia = produto incompleto para o caso de uso.

### 1. Matriz Servicos x Unidades

| Feature | Por que essencial | Complexidade | Notas |
|---------|-------------------|--------------|-------|
| Grid com servicos nas linhas e unidades nas colunas | Visualizacao panoramica do estado da obra; padrao do setor (Excel e o baseline) | Alta | Volume: ate 25 servicos x 200+ unidades |
| Status visual por celula (cor + icone) | Engenheiro precisa ver progresso de relance; todos os concorrentes fazem isso | Media | Verde=Conforme, Vermelho=NC, Cinza=Excecao, Vazio=Pendente |
| Scroll horizontal com colunas/linhas fixas | Matriz excede viewport; sem isso, usuario perde contexto | Media | Coluna de servico fixa a esquerda; header de unidades fixo no topo |
| Filtros por agrupamento | Obras com 200+ unidades precisam de segmentacao por Torre/Quadra | Baixa | Dropdown ou tabs por agrupamento |

**Fonte:** Analise competitiva AutoDOC, QualitTAB, Visibuild (confianca: HIGH)

### 2. Verificacao Individual

| Feature | Por que essencial | Complexidade | Notas |
|---------|-------------------|--------------|-------|
| Pagina dedicada ao clicar na celula | Verificacao completa requer preencher itens C/NC/NA individualmente | Alta | Rota: /app/obras/[id]/verificacoes/[servico]/[unidade] |
| Lista de itens do servico com toggle C/NC/NA | Core do FVS: cada item e avaliado; requisito PBQP-H | Media | Itens vem da biblioteca de servicos |
| Campo de descricao/observacao por verificacao | Documentacao para auditoria; obrigatorio quando NC | Baixa | Textarea com placeholder contextual |
| Upload de foto por item (NC obrigatoria) | Evidencia fotografica e requisito PBQP-H para nao-conformidades | Alta | Ver secao UX Patterns > Photo Upload |
| Botao salvar com validacao | Garantir completude antes de salvar | Baixa | Validar: todos itens preenchidos, NC tem foto |

**Fonte:** Modelo de dominio ARDEN (docs/product/05_DOMAIN_MODEL.md), requisitos PBQP-H (confianca: HIGH)

### 3. Verificacao em Lote (Bulk)

| Feature | Por que essencial | Complexidade | Notas |
|---------|-------------------|--------------|-------|
| Selecao de multiplas celulas na matriz | Velocidade e o diferencial #1 do Arden; sem isso, e so mais um concorrente | Alta | Click + Shift+Click para range; Ctrl+Click para nao-adjacentes |
| Modal de verificacao em lote | Aplicar resultado (C/NC/Excecao) + descricao a todas as celulas selecionadas | Media | Modal com selector de resultado + textarea |
| Contagem de celulas selecionadas | Feedback imediato do que sera afetado | Baixa | Badge no botao ou toolbar flutuante |
| Confirmacao antes de aplicar | Prevenir erros em operacoes que afetam muitas unidades | Baixa | Modal de confirmacao com resumo |

**Fonte:** Padroes PatternFly Bulk Selection, Eleken Bulk Actions UX, milestone_context (confianca: HIGH)

### 4. Ciclo de Vida de Status

| Feature | Por que essencial | Complexidade | Notas |
|---------|-------------------|--------------|-------|
| Pendente -> Conforme / NC / Excecao | Fluxo basico de primeira inspecao | Media | Status na celula da matriz + na pagina de verificacao |
| NC -> Reinspecao (apos reinspecao) | Fluxo de correcao obrigatorio PBQP-H | Media | NC abre caminho para reinspecao futura |
| Indicador visual de "ja verificado" vs "pendente" | Engenheiro precisa saber o que falta | Baixa | Celula vazia vs celula com cor |
| Historico de verificacoes por celula | Rastreabilidade para auditoria; imutabilidade | Media | Verificacoes sao imutaveis apos salvas |

**Fonte:** Modelo de dominio ARDEN, requisitos PBQP-H (confianca: HIGH)

### 5. Agrupamento de Colunas

| Feature | Por que essencial | Complexidade | Notas |
|---------|-------------------|--------------|-------|
| Colunas agrupadas por agrupamento (Torre/Quadra) | Organizar 200+ unidades sem esse agrupamento torna a matriz ilegivel | Media | Headers multinivel: agrupamento > unidade |
| Visual de agrupamento (cor ou separador) | Distinguir torres/quadras visualmente | Baixa | Borda mais forte entre grupos ou cor de fundo sutil |

**Fonte:** Padroes MUI X column groups, Infragistics collapsible column groups, Handsontable nested headers (confianca: HIGH)

---

## Differentiators

Features que destacam o Arden dos concorrentes. Nao esperadas, mas altamente valorizadas.

### Vantagem Competitiva Alta

| Feature | Proposta de valor | Complexidade | Notas |
|---------|-------------------|--------------|-------|
| **Selecao estilo planilha (click+drag, Shift+Click)** | Nenhum concorrente brasileiro oferece selecao de celulas tipo Excel; AutoDOC e QualitTAB usam navegacao sequencial | Alta | Padrao Excel: Click seleciona, Shift+Click estende range, Ctrl+Click adiciona celulas nao-adjacentes |
| **Toolbar flutuante contextual** | Acoes aparecem somente quando ha selecao; reduz clutter e guia o fluxo | Media | Padrao: Notion/Figma floating toolbar; aparece proximo a selecao |
| **Resolucao de conflitos em bulk** | Inteligencia ao aplicar bulk: pula Conformes existentes, NCs viram "apos Reinspecao" | Media | Modal mostra resumo de conflitos antes de aplicar |
| **Percentual de progresso por servico** | Barra ou numero mostrando % verificado por servico (linha da matriz) | Baixa | Ex: "Rejuntamento: 85% verificado (170/200)" |
| **Percentual de progresso por agrupamento** | % verificado por Torre/Quadra (coluna agrupada) | Baixa | Resumo no header do agrupamento |

### Vantagem Competitiva Media

| Feature | Proposta de valor | Complexidade | Notas |
|---------|-------------------|--------------|-------|
| **Heatmap de status na matriz** | Cores de intensidade variavel mostram "saude" visual da obra | Baixa | Celulas usam gradiente: mais verde = mais conforme |
| **Atalhos de teclado** | Engenheiros que usam muito a ferramenta ganham velocidade com shortcuts | Media | Enter=abrir verificacao, Esc=cancelar, Espaco=toggle selecao |
| **Colunas colapsaveis por agrupamento** | Recolher torre/quadra para focar em outra; padrao enterprise consolidado | Media | Chevron no header de grupo; colapsa mostrando coluna-resumo |
| **Salvamento automatico (autosave)** | Na verificacao individual, salvar automaticamente ao sair | Media | Pattern: debounce 2s apos ultima alteracao |

---

## Anti-Features (NAO Construir na v1.1)

Features que deliberadamente NAO devem entrar nesta milestone.

| Anti-Feature | Por que evitar | O que fazer no lugar |
|--------------|----------------|---------------------|
| **Edicao inline na celula da matriz** | Celula da matriz so mostra status; editar inline confunde com planilha real e impede validacao adequada | Celula e clicavel: abre pagina dedicada (individual) ou abre modal (bulk) |
| **Arrastar para selecionar (click+drag)** | Complexidade de implementacao muito alta para v1.1; conflita com scroll horizontal; edge cases problematicos em mobile | Usar Click + Shift+Click + Ctrl+Click; implementar drag na v1.2 se validado |
| **Reordenacao de colunas/linhas** | Engenheiro nao precisa reordenar; agrupamentos ja organizam; complexidade alta | Ordem fixa: agrupamento > unidade (ordem de cadastro) |
| **Exportacao PDF da matriz** | Foco da v1.1 e execucao, nao relatorios; relatorios ja existem no roadmap separado | Manter relatorios existentes; PDF da matriz pode entrar em v1.2+ |
| **Filtro avancado por status na matriz** | Filtrar celulas por status (so pendentes, so NC) adiciona complexidade de layout; matriz parcial confunde | Filtrar por agrupamento e suficiente; status e visual via cor |
| **Upload de foto via camera no portal web** | Portal e desktop-first; captura de camera e para app mobile (Expo) | Input file para upload de fotos ja tiradas; camera e escopo mobile |
| **Edicao de verificacao salva** | Verificacoes sao imutaveis por design (auditoria PBQP-H); editar quebra rastreabilidade | Permitir excluir (apenas Admin) + criar nova verificacao |
| **Notificacoes em tempo real** | Overengineering para v1.1; sem multiplos usuarios simultaneos no portal ainda | Atualizar dados ao navegar (revalidacao no fetch) |
| **Modo offline no portal web** | Offline e para app mobile com service workers; portal assume conectividade | Portal requer conexao; mostrar erro se offline |
| **Formulas ou calculos na matriz** | Arden nao e planilha; qualquer calculo e feito no backend e exibido | Mostrar % progresso calculado server-side |

---

## UX Patterns

### Selecao na Matriz (Matrix Selection)

**Padrao recomendado: Selecao hibrida celula/range inspirada em Excel**

A matriz do Arden NAO e uma planilha -- e uma grade de status. A selecao serve para aplicar acoes em lote, nao para editar conteudo inline.

#### Mecanismos de selecao

| Interacao | Comportamento | Referencia |
|-----------|---------------|------------|
| **Click simples** | Seleciona uma celula (desmarca todas as outras) | Excel, Google Sheets |
| **Shift + Click** | Seleciona range retangular entre ultima celula clicada e a atual | Excel, AG Grid |
| **Ctrl/Cmd + Click** | Adiciona/remove celula individual da selecao (nao-adjacente) | Excel, AG Grid |
| **Click no header de servico (linha)** | Seleciona toda a linha (todas as unidades daquele servico) | Excel row select |
| **Click no header de unidade (coluna)** | Seleciona toda a coluna (todos os servicos daquela unidade) | Excel column select |
| **Click no header de agrupamento** | Seleciona todas as colunas do agrupamento | Extensao logica do padrao |

#### Feedback visual de selecao

- **Celula selecionada:** Borda `brand` (verde) de 2px + fundo `surface-200` com opacidade
- **Range selecionado:** Fundo highlight sutil em todas as celulas do range
- **Celula foco (ancora):** Borda mais forte (como Excel mostra a celula ativa vs selecionadas)
- **Contador de selecao:** Badge no canto superior direito ou toolbar flutuante mostrando "X celulas selecionadas"

#### Implementacao recomendada

NAO usar bibliotecas de spreadsheet (Handsontable, AG Grid etc) -- sao overkill para este caso. A matriz do Arden e um grid CSS/HTML customizado com estado de selecao gerenciado via Zustand.

**Justificativa:**
- AG Grid: Enterprise license necessaria para cell selection ($999+); excessivo para grid de status
- Handsontable: Projetado para edicao de dados, nao visualizacao de status
- TanStack Table: Headless mas nao tem cell selection nativo; teria que implementar custom de qualquer forma
- **Grid customizado:** Controle total sobre visual, performance, e interacoes especificas do dominio

**Confianca:** HIGH -- Baseado em analise de AG Grid docs, TanStack Table discussions, e escopo real do Arden

### Operacoes em Lote (Bulk Operations)

**Padrao recomendado: Toolbar flutuante + Modal de confirmacao**

#### Fluxo completo

```
1. Usuario seleciona celulas na matriz
   ↓
2. Toolbar flutuante aparece (bottom-center da viewport)
   - Mostra: "X celulas selecionadas"
   - Botoes: [Verificar em Lote] [Limpar Selecao]
   ↓
3. Click em "Verificar em Lote" abre modal
   - Selector: Conforme / Nao Conforme / Excecao
   - Campo descricao (opcional para C, obrigatorio para NC)
   - Upload de foto (obrigatorio para NC)
   ↓
4. Antes de aplicar, modal mostra resolucao de conflitos
   - "3 celulas ja estao Conforme (serao ignoradas)"
   - "2 celulas tem NC aberta (serao marcadas como apos Reinspecao)"
   - "15 celulas pendentes receberao o novo status"
   ↓
5. Botao "Aplicar a X celulas" (com contagem real)
   ↓
6. Feedback: Toast de sucesso + celulas atualizam cor na matriz
   - Celulas afetadas fazem breve flash de destaque
```

#### Padroes de referencia

- **Toolbar flutuante:** Notion (selecao de blocos), Figma (selecao de layers), GitHub (bulk actions em issues)
- **Resolucao de conflitos:** Jira (bulk change wizard), Windows Explorer (copiar com conflitos)
- **Feedback pos-acao:** FOLIO bulk actions modal (sumario sucesso/falha)

**Confianca:** HIGH -- Padroes consolidados em PatternFly, Basis Design System, Eleken guidelines

### Upload de Fotos (Photo Upload)

**Padrao recomendado: Upload multiplo com preview em grid + compressao client-side**

#### Contexto de uso

- Na **verificacao individual**: foto associada a cada item NC
- Na **verificacao em lote**: foto associada a verificacao inteira (opcional para NC)
- **Volume tipico:** 1-5 fotos por item NC; total pode chegar a centenas por obra

#### Componentes do fluxo

| Etapa | Pattern | Implementacao |
|-------|---------|---------------|
| **Trigger** | Botao "Adicionar fotos" + area de drop zone | `<input type="file" multiple accept="image/*">` com area pontilhada |
| **Selecao** | File picker nativo do OS | Sem camera -- portal e desktop-first |
| **Preview** | Grid de thumbnails com `URL.createObjectURL()` | Grid 3-4 colunas com thumbnails quadrados |
| **Compressao** | Client-side resize antes de upload | Canvas API: max 1920px, qualidade 0.8 JPEG |
| **Upload** | Upload para Supabase Storage com progress bar | Chunk upload se > 5MB; mostrar % por foto |
| **Remocao** | Botao X no canto do thumbnail | Confirmar se ja fez upload (nao se ainda e preview) |
| **Limite** | Max 10 fotos por item | Mostrar "X/10 fotos" no contador |

#### Boas praticas de acessibilidade

- Alt text automatico: "Foto NC - [Nome do Item] - [Data]"
- Drag & drop como alternativa, NAO como unico metodo (botao sempre presente)
- Labels claros no input: "Selecionar fotos do computador"
- Preview com tamanho suficiente para verificar conteudo (min 80x80px)

**Confianca:** HIGH -- Padroes consolidados; Cloudinary widget, Next.js/shadcn uploader, BezKoder tutorials

### Visualizacao de Status na Celula (Status Lifecycle)

**Padrao recomendado: Cor de fundo + icone minimalista + texto abreviado**

#### Mapeamento de status para visual

| Status | Cor de Fundo | Icone | Texto | CSS Variable |
|--------|-------------|-------|-------|-------------|
| **Pendente** | `surface-100` (neutro) | Nenhum | -- | `bg-surface-100` |
| **Conforme** | Verde sutil | Checkmark fino | C | `bg-brand/10` + `text-brand` |
| **Nao Conforme** | Vermelho sutil | X fino | NC | `bg-destructive/10` + `text-destructive` |
| **Excecao** | Cinza medio | Traco (--) | E | `bg-foreground-muted/10` + `text-foreground-muted` |
| **Apos Reinspecao** | Amarelo sutil | Seta circular | R | `bg-warning/10` + `text-warning` |

#### Principios de design

1. **Cor + forma + texto:** NUNCA depender so de cor (acessibilidade WCAG 2.1 AA)
2. **Baixa enfase para Conforme:** Verde sutil, nao gritante -- o "bom" e o padrao esperado
3. **Alta enfase para NC:** Vermelho mais visivel -- requer atencao e acao
4. **Celula compacta:** ~40-48px de altura, ~60-80px de largura; conteudo minimalista
5. **Hover tooltip:** Mostrar detalhes ao passar o mouse ("Conforme - Verificado em 23/01/2026")

**Confianca:** HIGH -- Padroes Carbon Design System, Astro UXDS Status System, UX Movement badge guidelines

### Colunas Colapsaveis por Agrupamento

**Padrao recomendado: Headers multinivel com chevron de colapso**

#### Estrutura visual

```
┌──────────────────┬───────────────────────────────────┬──────────────────────────────────┐
│                  │         Torre 1  [▼] (85%)        │       Torre 2  [▼] (62%)         │
│    Servico       ├──────┬──────┬──────┬──────┬───────┼──────┬──────┬──────┬──────┬──────┤
│                  │ 101  │ 102  │ 103  │ 104  │  105  │ 201  │ 202  │ 203  │ 204  │ 205  │
├──────────────────┼──────┼──────┼──────┼──────┼───────┼──────┼──────┼──────┼──────┼──────┤
│ Rejuntamento     │  C   │  C   │  NC  │  C   │       │  C   │      │      │  NC  │  C   │
│ Pintura          │  C   │  C   │  C   │  C   │  C    │      │      │      │      │      │
│ Piso             │  E   │  C   │  C   │      │       │  C   │  C   │  NC  │      │      │
└──────────────────┴──────┴──────┴──────┴──────┴───────┴──────┴──────┴──────┴──────┴──────┘
```

#### Estado colapsado

```
┌──────────────────┬──────────────────┬─────────────────┐
│                  │  Torre 1  [▶]    │  Torre 2  [▶]   │
│    Servico       │     (85%)        │     (62%)       │
├──────────────────┼──────────────────┼─────────────────┤
│ Rejuntamento     │  4C / 1NC / 0E   │  2C / 1NC / 0E  │
│ Pintura          │  5C / 0NC / 0E   │  0C / 0NC / 0E  │
│ Piso             │  2C / 0NC / 1E   │  2C / 1NC / 0E  │
└──────────────────┴──────────────────┴─────────────────┘
```

#### Implementacao

- **Expandido:** Mostra todas as colunas de unidades dentro do agrupamento
- **Colapsado:** Mostra coluna-resumo com contagem de status (XC / YNC / ZE)
- **Chevron:** No header do agrupamento; click para toggle
- **Percentual:** Mostrar % verificado no header do agrupamento
- **Persistencia:** Salvar estado de colapso em localStorage por obra

**Referencia:** Infragistics Collapsible Column Groups, MUI X column groups (confianca: HIGH)

### Progresso na Matriz (Progress Tracking)

**Padrao recomendado: Barras de progresso em linhas/headers + resumo numerico**

#### Por servico (linha)

- Coluna fixa a direita (ou dentro da coluna de servico): mini barra de progresso
- Formato: `170/200 (85%)` ou barra visual verde preenchendo proporcionalmente
- Cores da barra segmentadas: verde (Conforme), vermelho (NC), cinza (Excecao), transparente (Pendente)

#### Por agrupamento (coluna)

- No header do agrupamento: percentual de verificacoes completas
- Formato: `(85%)` ou icone de progresso circular (donut chart mini)

#### Por obra (resumo geral)

- Card ou banner no topo da pagina da matriz
- Formato: "Obra Vista Verde: 1.250/3.000 verificacoes (41,7%)"
- Breakdown por status: X Conformes, Y NCs, Z Excecoes, W Pendentes

**Confianca:** MEDIUM -- Padrao logico baseado em heatmap/progress patterns; AutoDOC e QualitTAB mostram graficos similares mas nao inline na matriz

---

## Dependencias entre Features

```
Matriz basica (grid + status visual)
  └─> Selecao de celulas
       └─> Verificacao em lote (bulk)
            └─> Resolucao de conflitos em bulk
  └─> Click na celula
       └─> Verificacao individual
            └─> Upload de fotos
            └─> Ciclo C/NC/NA por item
  └─> Agrupamento de colunas
       └─> Colapso de agrupamentos
            └─> Coluna-resumo colapsada
  └─> Progresso por linha/coluna
```

**Ordem de implementacao sugerida:**
1. Matriz basica com status visual e scroll fixo
2. Click na celula -> Verificacao individual com itens C/NC/NA
3. Upload de fotos (NC obrigatoria)
4. Agrupamento de colunas com headers multinivel
5. Selecao de celulas (Click, Shift+Click, Ctrl+Click)
6. Verificacao em lote (modal + resolucao de conflitos)
7. Progresso por linha e agrupamento
8. Colapso de agrupamentos (nice-to-have para v1.1)

---

## Recomendacao MVP para v1.1

### Obrigatorio (Must Have)

1. Matriz Servicos x Unidades com status visual por celula
2. Scroll horizontal com coluna de servico fixa
3. Verificacao individual (pagina dedicada com itens C/NC/NA)
4. Upload de fotos por item NC
5. Agrupamento de colunas por Torre/Quadra
6. Selecao de celulas (Click + Shift+Click)
7. Verificacao em lote via modal
8. Resolucao de conflitos em bulk (skip Conformes, NC->Reinspecao)
9. Indicador de progresso por servico (linha)

### Desejavel (Should Have)

10. Ctrl+Click para selecao nao-adjacente
11. Selecao de linha/coluna inteira via header
12. Toolbar flutuante contextual
13. Progresso por agrupamento no header
14. Atalhos de teclado (Enter, Esc, Espaco)

### Diferido (v1.2+)

15. Colunas colapsaveis com resumo
16. Heatmap de intensidade de status
17. Drag-to-select (click+arrastar)
18. Exportacao PDF da matriz
19. Salvamento automatico na verificacao individual

---

## Analise Competitiva

| Feature | AutoDOC FVS | QualitTAB | Arden v1.1 |
|---------|-------------|-----------|------------|
| Matriz visual Servicos x Unidades | Parcial (mapa de locais) | Parcial (arvore hierarquica) | **Completa (grid interativo)** |
| Selecao de celulas tipo planilha | Nao | Nao | **Sim (diferencial)** |
| Verificacao em lote | Nao (sequencial) | Nao (sequencial) | **Sim (diferencial)** |
| Upload de fotos NC | Sim (mobile) | Sim (mobile) | Sim (portal web) |
| Progresso % na matriz | Graficos separados | Dashboard separado | **Inline na matriz** |
| Agrupamento de colunas | Por torres (navegacao) | Arvore hierarquica | **Headers multinivel** |
| Reinspecao | Sim | Sim | Sim |
| Portal web | Sim (limitado) | Sim | **Sim (foco principal)** |

**Conclusao competitiva:** O Arden sera o primeiro FVS brasileiro com interface de matriz interativa estilo planilha. AutoDOC e QualitTAB focam no mobile e tratam o portal como consulta/relatorio. O Arden inverte: portal e o centro de comando, mobile sera complementar.

---

## Fontes

### Padroes de Selecao e Grids
- [AG Grid Cell Selection](https://www.ag-grid.com/react-data-grid/cell-selection/) -- Confianca: HIGH
- [TanStack Table Row Selection](https://tanstack.com/table/v8/docs/guide/row-selection) -- Confianca: HIGH
- [MUI X Column Groups](https://mui.com/x/react-data-grid/column-groups/) -- Confianca: HIGH
- [Infragistics Collapsible Column Groups](https://www.infragistics.com/products/ignite-ui-angular/angular/components/grid/collapsible-column-groups) -- Confianca: HIGH
- [Handsontable Column Groups](https://handsontable.com/docs/react-data-grid/column-groups/) -- Confianca: HIGH

### Padroes de Bulk Operations
- [PatternFly Bulk Selection](https://www.patternfly.org/patterns/bulk-selection/) -- Confianca: HIGH
- [Basis Design System Bulk Editing](https://design.basis.com/patterns/bulk-editing) -- Confianca: HIGH
- [Eleken Bulk Actions UX](https://www.eleken.co/blog-posts/bulk-actions-ux) -- Confianca: MEDIUM
- [Helios Table Multi-Select](https://helios.hashicorp.design/patterns/table-multi-select) -- Confianca: HIGH

### Padroes de Status e Badges
- [Carbon Design System Status Indicators](https://carbondesignsystem.com/patterns/status-indicator-pattern/) -- Confianca: HIGH
- [Astro UXDS Status System](https://www.astrouxds.com/patterns/status-system/) -- Confianca: HIGH
- [UX Movement Table Status Badges](https://uxmovement.substack.com/p/why-youre-designing-table-status) -- Confianca: MEDIUM

### Padroes de Upload
- [Uploadcare UX Best Practices](https://uploadcare.com/blog/file-uploader-ux-best-practices/) -- Confianca: HIGH
- [Next.js Multi-Image Uploader with shadcn](https://medium.com/@jacksonkasipeacock/building-a-compact-responsive-multi-image-uploader-for-next-js-2a96456c64ef) -- Confianca: MEDIUM

### Analise Competitiva
- [AutoDOC FVS](https://autodoc.com.br/fvs/) -- Confianca: MEDIUM
- [QualitTAB FVS](https://qualitab.com.br/ferramentas/fvs/) -- Confianca: MEDIUM
- [Visibuild Inspection Matrix](https://medium.com/@baileypwhite/inspection-matrix-bringing-clarity-to-complex-inspection-workflows-acf900a0a0a9) -- Confianca: LOW (paywall)

### Padroes de Confirmacao e Conflitos
- [NNGroup Confirmation Dialogs](https://www.nngroup.com/articles/confirmation-dialog/) -- Confianca: HIGH
- [Smashing Magazine Dangerous Actions](https://www.smashingmagazine.com/2024/09/how-manage-dangerous-actions-user-interfaces/) -- Confianca: HIGH
- [Microsoft Confirmations Guide](https://learn.microsoft.com/en-us/windows/win32/uxguide/mess-confirm) -- Confianca: HIGH

### Design de Tabelas Enterprise
- [Pencil & Paper Data Table UX](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables) -- Confianca: HIGH
- [Stephanie Walter Enterprise Tables](https://stephaniewalter.design/blog/essential-resources-design-complex-data-tables/) -- Confianca: HIGH
