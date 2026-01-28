# Requirements: Arden FVS v1.2

**Defined:** 2026-01-28
**Core Value:** Trazer extrema rapidez e praticidade na verificação de serviços, tornando a qualidade uma aliada da obra.

## v1.2 Requirements

### Matriz

- [ ] **MAT-01**: Seleção em massa é o modo padrão da matriz (remove click → verificação individual)
- [ ] **MAT-02**: Botão "Verificar" na toolbar navega para a página de feed de verificações
- [ ] **MAT-03**: Botão Exceção com cor amarela diferenciada na toolbar de seleção
- [ ] **MAT-04**: Heatmap da matriz reflete novo modelo de 3 estados (Pendente / Com Pendências / Finalizada)
- [ ] **MAT-05**: Matriz atualiza ao retornar do feed (seleção limpa, dados atualizados)

### Feed de Verificações

- [ ] **FEED-01**: Página de feed com serviços empilhados como containers verticais
- [ ] **FEED-02**: Cada container é uma mini-matriz: linhas = itens do FVS, colunas = unidades selecionadas
- [ ] **FEED-03**: Itens mostram informações expandidas (método de verificação, tolerância) na linha
- [ ] **FEED-04**: Scroll horizontal com headers sticky (mesmo padrão da matriz principal)
- [ ] **FEED-05**: Seleção em massa por célula individual (click → hachura)
- [ ] **FEED-06**: Seleção por header de serviço (seleciona todos os itens do serviço)
- [ ] **FEED-07**: Seleção por header de unidade (seleciona todos os itens daquela unidade no serviço)
- [ ] **FEED-08**: Seleção por header de item (seleciona aquele item em todas as unidades)
- [ ] **FEED-09**: Itens com status finalizado visíveis com opacidade reduzida e não selecionáveis

### Toolbar Inteligente

- [ ] **TOOL-01**: Toolbar mostra apenas ações comuns a todos os itens selecionados (intersecção de status)
- [ ] **TOOL-02**: Aviso quando itens selecionados têm status incompatíveis (intersecção vazia)
- [ ] **TOOL-03**: Modal de confirmação com resumo antes de aplicar status
- [ ] **TOOL-04**: Contador de itens selecionados na toolbar

### Modelo de Status

- [ ] **STAT-01**: Status da verificação calculado automaticamente: Pendente / Verificado com Pendências / Verificação Finalizada
- [ ] **STAT-02**: Status granulares migrados exclusivamente para nível de item
- [ ] **STAT-03**: Fluxograma de transições: Pendente → C/NC/Exceção; NC → 4 outcomes; NC após Retrabalho → 2 outcomes
- [ ] **STAT-04**: Migration de banco para refletir novo modelo de status

### Verificação Individual — Consulta

- [ ] **DET-01**: Página refatorada como visualização de consulta (sem ação de marcar status)
- [ ] **DET-02**: Histórico de transições de status por item (quem, quando, de/para)
- [ ] **DET-03**: Acessível a partir do dashboard NC feed (click → abre detalhe)
- [ ] **DET-04**: Acessível a partir do feed de verificações (click em item específico → abre detalhe)

## v2 Requirements

### Upload de Fotos

- **FOTO-01**: Upload de fotos por item NC (obrigatório)
- **FOTO-02**: Compressão client-side antes do upload
- **FOTO-03**: Visualização de fotos na página de detalhe

### UI Polish

- **UI-01**: Sidebar flutuante com transição suave
- **UI-02**: Breadcrumb estilo Supabase com troca rápida de contexto
- **UI-03**: Excluir serviço permanentemente (admin only)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Verificação offline no portal web | Escopo do app mobile |
| Drag-to-select na matriz | Complexidade não justificada, click é suficiente |
| Edição inline na célula | Anti-feature: célula é indicador de status |
| Exportação PDF da matriz | Diferido para milestone de relatórios |
| App Mobile (Expo) | Mês 2 |
| Relatórios PDF | Mês 3 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| MAT-01 | — | Pending |
| MAT-02 | — | Pending |
| MAT-03 | — | Pending |
| MAT-04 | — | Pending |
| MAT-05 | — | Pending |
| FEED-01 | — | Pending |
| FEED-02 | — | Pending |
| FEED-03 | — | Pending |
| FEED-04 | — | Pending |
| FEED-05 | — | Pending |
| FEED-06 | — | Pending |
| FEED-07 | — | Pending |
| FEED-08 | — | Pending |
| FEED-09 | — | Pending |
| TOOL-01 | — | Pending |
| TOOL-02 | — | Pending |
| TOOL-03 | — | Pending |
| TOOL-04 | — | Pending |
| STAT-01 | — | Pending |
| STAT-02 | — | Pending |
| STAT-03 | — | Pending |
| STAT-04 | — | Pending |
| DET-01 | — | Pending |
| DET-02 | — | Pending |
| DET-03 | — | Pending |
| DET-04 | — | Pending |

**Coverage:**
- v1.2 requirements: 22 total
- Mapped to phases: 0
- Unmapped: 22 ⚠️

---
*Requirements defined: 2026-01-28*
*Last updated: 2026-01-28 after initial definition*
