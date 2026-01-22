# Requirements: Arden FVS

**Defined:** 2026-01-19
**Core Value:** Trazer extrema rapidez e praticidade na verificacao de servicos, tornando a qualidade uma aliada da obra.

## v1 Requirements

Requirements para o Mes 1 do MVP. Cada um mapeia para fases do roadmap.

### Obras

- [x] **OBRA-01**: Usuario pode listar todas as obras do cliente
- [x] **OBRA-02**: Usuario pode criar nova obra (nome, codigo, tipologia, responsavel, coordenadas)
- [x] **OBRA-03**: Usuario pode editar dados de uma obra existente
- [x] **OBRA-04**: Usuario pode arquivar uma obra (soft delete)
- [x] **OBRA-05**: Usuario pode visualizar detalhes de uma obra

### Agrupamentos

- [x] **AGRU-01**: Usuario pode listar agrupamentos de uma obra
- [x] **AGRU-02**: Usuario pode criar novo agrupamento (nome, ordem)
- [x] **AGRU-03**: Usuario pode editar agrupamento existente
- [x] **AGRU-04**: Usuario pode excluir agrupamento (se nao tiver unidades)
- [x] **AGRU-05**: Usuario pode criar agrupamentos em lote (ex: "Bloco 1-38")

### Unidades

- [x] **UNID-01**: Usuario pode listar unidades de um agrupamento
- [x] **UNID-02**: Usuario pode criar nova unidade (nome, codigo, ordem)
- [x] **UNID-03**: Usuario pode editar unidade existente
- [x] **UNID-04**: Usuario pode excluir unidade (se nao tiver verificacoes)
- [x] **UNID-05**: Usuario pode criar unidades em lote (ex: "Apto 101-110")

### Biblioteca FVS

- [x] **SERV-01**: Usuario pode listar todos os servicos do cliente
- [x] **SERV-02**: Usuario pode criar novo servico (codigo, nome, categoria)
- [x] **SERV-03**: Usuario pode editar servico existente
- [x] **SERV-04**: Usuario pode arquivar servico (soft delete)
- [x] **SERV-05**: Usuario pode adicionar itens de verificacao a um servico
- [x] **SERV-06**: Usuario pode editar/excluir itens de verificacao
- [x] **SERV-07**: Usuario pode ativar servicos em uma obra especifica
- [x] **SERV-08**: Usuario pode desativar servicos de uma obra

### Revisoes de Servicos

- [x] **REV-01**: Servico armazena revisao atual, historico e descricao das mudancas
- [x] **REV-02**: Ao editar servico, sistema exige descricao e incrementa revisao automaticamente
- [x] **REV-03**: Usuario pode visualizar historico completo de revisoes de um servico
- [x] **REV-04**: Cada obra mantém registro de qual revisao de cada servico esta utilizando
- [x] **REV-05**: Usuario pode atualizar revisao de um servico na obra para versao mais recente

### Dashboard

- [ ] **DASH-01**: Usuario ve card com Taxa de Conformidade Geral
- [ ] **DASH-02**: Usuario ve card com IRS (Indice de Retrabalho)
- [ ] **DASH-03**: Usuario ve card com Verificacoes Pendentes
- [ ] **DASH-04**: Usuario ve card com Verificacoes Concluidas
- [ ] **DASH-05**: Usuario ve feed de ultimas NCs abertas
- [ ] **DASH-06**: Usuario ve grafico de evolucao temporal (linha)

### Infraestrutura

- [x] **INFR-01**: Zustand configurado para state management
- [x] **INFR-02**: React Hook Form + Zod configurados para validacao

## v2 Requirements

Deferidos para fases posteriores. Nao estao no roadmap atual.

### Obras

- **OBRA-06**: Wizard de criacao em 3 passos
- **OBRA-07**: Empreendimentos (agrupamento virtual de obras)

### Agrupamentos

- **AGRU-06**: Tags em agrupamentos para filtros

### Biblioteca FVS

- **SERV-09**: Import/Export Excel de servicos
- **SERV-10**: Fotos de referencia (correto/incorreto)
- **SERV-11**: Sugestoes rapidas de observacao

### Revisoes de Servicos

- **REV-06**: Usuario pode ver o que mudou entre revisoes (diff)

### Dashboard

- **DASH-07**: Dashboard comparativo entre obras
- **DASH-08**: Ranking de obras por performance

## Out of Scope

Explicitamente excluido do Mes 1.

| Feature | Reason |
|---------|--------|
| App Mobile (Expo) | Mes 2 - foco no portal primeiro |
| Verificacoes no portal | Mes 2 - precisa de obras/servicos primeiro |
| Sync offline | Mes 2 - feature do mobile |
| Relatorios PDF | Mes 3 - polimento |
| Condicoes de Inicio (CI) | Fase 2 - complexidade alta |
| 2FA/SSO | Fase 2 - seguranca avancada |
| Dashboard Telao | Fase 3 - feature PRO |
| Integracoes ERPs | Fase 3 - feature PRO |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| OBRA-01 | Phase 2 | Complete |
| OBRA-02 | Phase 2 | Complete |
| OBRA-03 | Phase 2 | Complete |
| OBRA-04 | Phase 2 | Complete |
| OBRA-05 | Phase 2 | Complete |
| AGRU-01 | Phase 3 | Complete |
| AGRU-02 | Phase 3 | Complete |
| AGRU-03 | Phase 3 | Complete |
| AGRU-04 | Phase 3 | Complete |
| AGRU-05 | Phase 3 | Complete |
| UNID-01 | Phase 4 | Complete |
| UNID-02 | Phase 4 | Complete |
| UNID-03 | Phase 4 | Complete |
| UNID-04 | Phase 4 | Complete |
| UNID-05 | Phase 4 | Complete |
| SERV-01 | Phase 5 | Complete |
| SERV-02 | Phase 5 | Complete |
| SERV-03 | Phase 5 | Complete |
| SERV-04 | Phase 5 | Complete |
| SERV-05 | Phase 5 | Complete |
| SERV-06 | Phase 5 | Complete |
| SERV-07 | Phase 5 | Complete |
| SERV-08 | Phase 5 | Complete |
| REV-01 | Phase 5.1 | Complete |
| REV-02 | Phase 5.1 | Complete |
| REV-03 | Phase 5.1 | Complete |
| REV-04 | Phase 5.1 | Complete |
| REV-05 | Phase 5.1 | Complete |
| DASH-01 | Phase 6 | Pending |
| DASH-02 | Phase 6 | Pending |
| DASH-03 | Phase 6 | Pending |
| DASH-04 | Phase 6 | Pending |
| DASH-05 | Phase 6 | Pending |
| DASH-06 | Phase 6 | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0

---
*Requirements defined: 2026-01-19*
*Last updated: 2026-01-22 after phase 5.1 complete*
