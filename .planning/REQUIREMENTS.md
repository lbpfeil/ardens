# Requirements: Arden FVS v1.1

**Defined:** 2026-01-26
**Core Value:** Trazer extrema rapidez e praticidade na verificacao de servicos, tornando a qualidade uma aliada da obra.

## v1.1 Requirements

### Dados e Infraestrutura

- [x] **DADOS-01**: Server Actions para CRUD de verificações (criar, atualizar resultado, atualizar status)
- [x] **DADOS-02**: Server Actions para CRUD de itens de verificação (marcar C/NC/NA por item)
- [x] **DADOS-03**: RPC PostgreSQL para verificação em massa (bulk insert atômico)
- [x] **DADOS-04**: Queries otimizadas para alimentar a matriz (serviços, unidades, verificações)

### Matriz de Verificacoes

- [x] **MATRZ-01**: Pagina de verificacoes na sidebar da obra com matriz servico x unidade
- [x] **MATRZ-02**: Celulas com status visual (cor + icone) para cada par servico/unidade
- [x] **MATRZ-03**: Scroll horizontal com coluna de servico fixa e header fixo
- [x] **MATRZ-04**: Colunas agrupadas por agrupamento com headers multinivel
- [x] **MATRZ-05**: Indicador de progresso por servico (ex: 12/50 verificadas)

### Selecao e Operacoes em Massa

- [ ] **BULK-01**: Selecao de celulas individuais (Click)
- [ ] **BULK-02**: Selecao de range (Shift+Click)
- [ ] **BULK-03**: Selecao nao-adjacente (Ctrl+Click)
- [ ] **BULK-04**: Selecao de linha inteira via header do servico
- [ ] **BULK-05**: Selecao de coluna inteira via header da unidade
- [ ] **BULK-06**: Toolbar flutuante contextual com contagem de selecionados e botao "Verificar"
- [ ] **BULK-07**: Modal de verificacao em massa: resultado (Conforme/NC/Excecao) + descricao
- [ ] **BULK-08**: Resolucao de conflitos: pular Conformes existentes, NCs viram "apos Reinspecao"
- [ ] **BULK-09**: Marcacao automatica de todos os itens conforme resultado do lote

### Verificacao Individual

- [x] **VERIF-01**: Pagina dedicada para verificacao de 1 servico x 1 unidade
- [x] **VERIF-02**: Lista de itens de verificacao com toggle C/NC/NA por item
- [x] **VERIF-03**: Resultado automatico: qualquer item NC -> verificacao NC
- [x] **VERIF-04**: Campo de descricao geral por verificacao
- [x] **VERIF-05**: Status Excecao para servico que nao se aplica a unidade
- [x] **VERIF-06**: Ciclo de reinspecao: NC -> Conforme apos Reinspecao | NC apos Reinspecao

### Integracao e Navegacao

- [ ] **INTEG-01**: Item "Verificacoes" na sidebar da obra com link para a matriz
- [ ] **INTEG-02**: Dashboard do engenheiro com KPIs alimentados por dados reais de verificacoes
- [ ] **INTEG-03**: Feed de atividades com verificacoes realizadas (substituir dados mock)
- [ ] **INTEG-04**: Navegacao da matriz para pagina individual (clique na celula) e volta

## v1.2 Requirements

### Fotos de Verificacao

- **FOTO-01**: Upload de fotos por item de verificacao
- **FOTO-02**: Compressao client-side antes do upload (browser-image-compression)
- **FOTO-03**: Preview de fotos no item de verificacao
- **FOTO-04**: Multiplas fotos por item

### Melhorias de Matriz

- **MATRZ-06**: Colunas colapsiveis com coluna-resumo
- **MATRZ-07**: Drag-to-select (arrastar para selecionar)
- **MATRZ-08**: Heatmap de intensidade de status
- **MATRZ-09**: Exportacao PDF da matriz

### Melhorias de UX

- **UX-01**: Atalhos de teclado na matriz (Enter, Esc, Espaco)
- **UX-02**: Salvamento automatico na verificacao individual

## Out of Scope

| Feature | Reason |
|---------|--------|
| Edicao inline na celula da matriz | Anti-feature: celula e indicador de status, nao texto editavel |
| Modo offline no portal web | Escopo exclusivo do app mobile (Expo) |
| Upload de fotos | Diferido para v1.2 -- foco na verificacao sem fotos primeiro |
| App Mobile (Expo) | Milestone separado |
| Sync offline | Depende do app mobile |
| Relatorios PDF | Milestone v1.3+ |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DADOS-01 | Phase 7 | Complete |
| DADOS-02 | Phase 7 | Complete |
| DADOS-03 | Phase 7 | Complete |
| DADOS-04 | Phase 7 | Complete |
| MATRZ-01 | Phase 9 | Complete |
| MATRZ-02 | Phase 9 | Complete |
| MATRZ-03 | Phase 9 | Complete |
| MATRZ-04 | Phase 9 | Complete |
| MATRZ-05 | Phase 9 | Complete |
| BULK-01 | Phase 10 | Pending |
| BULK-02 | Phase 10 | Pending |
| BULK-03 | Phase 10 | Pending |
| BULK-04 | Phase 10 | Pending |
| BULK-05 | Phase 10 | Pending |
| BULK-06 | Phase 10 | Pending |
| BULK-07 | Phase 10 | Pending |
| BULK-08 | Phase 10 | Pending |
| BULK-09 | Phase 10 | Pending |
| VERIF-01 | Phase 8 | Complete |
| VERIF-02 | Phase 8 | Complete |
| VERIF-03 | Phase 8 | Complete |
| VERIF-04 | Phase 8 | Complete |
| VERIF-05 | Phase 8 | Complete |
| VERIF-06 | Phase 8 | Complete |
| INTEG-01 | Phase 11 | Pending |
| INTEG-02 | Phase 11 | Pending |
| INTEG-03 | Phase 11 | Pending |
| INTEG-04 | Phase 11 | Pending |

**Coverage:**
- v1.1 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-01-26*
*Last updated: 2026-01-27 after Phase 9 completion*
