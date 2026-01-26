# Requirements: Arden FVS v1.1

**Defined:** 2026-01-26
**Core Value:** Trazer extrema rapidez e praticidade na verificação de serviços, tornando a qualidade uma aliada da obra.

## v1.1 Requirements

### Dados e Infraestrutura

- [ ] **DADOS-01**: Server Actions para CRUD de verificações (criar, atualizar resultado, atualizar status)
- [ ] **DADOS-02**: Server Actions para CRUD de itens de verificação (marcar C/NC/NA por item)
- [ ] **DADOS-03**: RPC PostgreSQL para verificação em massa (bulk insert atômico)
- [ ] **DADOS-04**: Queries otimizadas para alimentar a matriz (serviços, unidades, verificações)

### Matriz de Verificações

- [ ] **MATRZ-01**: Página de verificações na sidebar da obra com matriz serviço × unidade
- [ ] **MATRZ-02**: Células com status visual (cor + ícone) para cada par serviço/unidade
- [ ] **MATRZ-03**: Scroll horizontal com coluna de serviço fixa e header fixo
- [ ] **MATRZ-04**: Colunas agrupadas por agrupamento com headers multinível
- [ ] **MATRZ-05**: Indicador de progresso por serviço (ex: 12/50 verificadas)

### Seleção e Operações em Massa

- [ ] **BULK-01**: Seleção de células individuais (Click)
- [ ] **BULK-02**: Seleção de range (Shift+Click)
- [ ] **BULK-03**: Seleção não-adjacente (Ctrl+Click)
- [ ] **BULK-04**: Seleção de linha inteira via header do serviço
- [ ] **BULK-05**: Seleção de coluna inteira via header da unidade
- [ ] **BULK-06**: Toolbar flutuante contextual com contagem de selecionados e botão "Verificar"
- [ ] **BULK-07**: Modal de verificação em massa: resultado (Conforme/NC/Exceção) + descrição
- [ ] **BULK-08**: Resolução de conflitos: pular Conformes existentes, NCs viram "após Reinspeção"
- [ ] **BULK-09**: Marcação automática de todos os itens conforme resultado do lote

### Verificação Individual

- [ ] **VERIF-01**: Página dedicada para verificação de 1 serviço × 1 unidade
- [ ] **VERIF-02**: Lista de itens de verificação com toggle C/NC/NA por item
- [ ] **VERIF-03**: Resultado automático: qualquer item NC → verificação NC
- [ ] **VERIF-04**: Campo de descrição geral por verificação
- [ ] **VERIF-05**: Status Exceção para serviço que não se aplica à unidade
- [ ] **VERIF-06**: Ciclo de reinspeção: NC → Conforme após Reinspeção | NC após Reinspeção

### Integração e Navegação

- [ ] **INTEG-01**: Item "Verificações" na sidebar da obra com link para a matriz
- [ ] **INTEG-02**: Dashboard do engenheiro com KPIs alimentados por dados reais de verificações
- [ ] **INTEG-03**: Feed de atividades com verificações realizadas (substituir dados mock)
- [ ] **INTEG-04**: Navegação da matriz para página individual (clique na célula) e volta

## v1.2 Requirements

### Fotos de Verificação

- **FOTO-01**: Upload de fotos por item de verificação
- **FOTO-02**: Compressão client-side antes do upload (browser-image-compression)
- **FOTO-03**: Preview de fotos no item de verificação
- **FOTO-04**: Múltiplas fotos por item

### Melhorias de Matriz

- **MATRZ-06**: Colunas colapsáveis com coluna-resumo
- **MATRZ-07**: Drag-to-select (arrastar para selecionar)
- **MATRZ-08**: Heatmap de intensidade de status
- **MATRZ-09**: Exportação PDF da matriz

### Melhorias de UX

- **UX-01**: Atalhos de teclado na matriz (Enter, Esc, Espaço)
- **UX-02**: Salvamento automático na verificação individual

## Out of Scope

| Feature | Reason |
|---------|--------|
| Edição inline na célula da matriz | Anti-feature: célula é indicador de status, não texto editável |
| Modo offline no portal web | Escopo exclusivo do app mobile (Expo) |
| Upload de fotos | Diferido para v1.2 — foco na verificação sem fotos primeiro |
| App Mobile (Expo) | Milestone separado |
| Sync offline | Depende do app mobile |
| Relatórios PDF | Milestone v1.3+ |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DADOS-01 | — | Pending |
| DADOS-02 | — | Pending |
| DADOS-03 | — | Pending |
| DADOS-04 | — | Pending |
| MATRZ-01 | — | Pending |
| MATRZ-02 | — | Pending |
| MATRZ-03 | — | Pending |
| MATRZ-04 | — | Pending |
| MATRZ-05 | — | Pending |
| BULK-01 | — | Pending |
| BULK-02 | — | Pending |
| BULK-03 | — | Pending |
| BULK-04 | — | Pending |
| BULK-05 | — | Pending |
| BULK-06 | — | Pending |
| BULK-07 | — | Pending |
| BULK-08 | — | Pending |
| BULK-09 | — | Pending |
| VERIF-01 | — | Pending |
| VERIF-02 | — | Pending |
| VERIF-03 | — | Pending |
| VERIF-04 | — | Pending |
| VERIF-05 | — | Pending |
| VERIF-06 | — | Pending |
| INTEG-01 | — | Pending |
| INTEG-02 | — | Pending |
| INTEG-03 | — | Pending |
| INTEG-04 | — | Pending |

**Coverage:**
- v1.1 requirements: 28 total
- Mapped to phases: 0
- Unmapped: 28 ⚠️

---
*Requirements defined: 2026-01-26*
*Last updated: 2026-01-26 after initial definition*
