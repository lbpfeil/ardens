# Project Milestones: Arden FVS

## v1.1 Verificações no Portal Web (Shipped: 2026-01-27)

**Delivered:** Matriz interativa de verificações serviço × unidade com heatmap de 6 estados, verificação individual com itens C/NC/NA e ciclo de reinspeção, operações em massa com resolução inteligente de conflitos, e navegação bidirecional integrada ao dashboard.

**Phases completed:** 7-11 (11 plans total)

**Key accomplishments:**

- Matriz interativa serviço × unidade com CSS Grid, sticky headers, heatmap de 6 cores e progresso por serviço
- Verificação individual com checklist de itens (C/NC/NA), modal NC, exceção, reinspeção e imutabilidade
- Operações em massa: seleção por célula/linha/coluna, toolbar flutuante, modal bulk com resumo de conflitos
- RPC PostgreSQL `bulk_verificar` para inserção atômica de verificações + itens em lote
- Navegação bidirecional matriz ↔ individual com preservação de estado (sessionStorage) e highlight animation
- Dashboard e NC feed alimentados por dados reais com click-through para verificação

**Stats:**

- 121 files created/modified
- 16,807 lines of TypeScript (total)
- 5 phases, 11 plans, 20 tasks
- 2 days from start to ship (2026-01-26 to 2026-01-27)
- 28 requirements satisfied (100% coverage)

**Git range:** `feat(07-01)` to `fix(11)`

**Tech debt carried forward:**
- DEV_CLIENTE_ID hardcoded (auth integration deferred from v1.0)
- atualizarStatusVerificacao exported but unused (status via triggers)
- Upload de fotos diferido para v1.2

**What's next:** Planejamento do próximo milestone

---

## v1.0 MVP (Shipped: 2026-01-24)

**Delivered:** Portal web completo para gestao de obras, agrupamentos, unidades, biblioteca FVS com revisoes e tags, e dashboard do engenheiro com KPIs, feed de NCs e grafico de evolucao.

**Phases completed:** 1-6 + 3 insertions (34 plans total)

**Key accomplishments:**

- CRUD completo de obras com listagem, criacao, edicao e arquivamento
- Hierarquia completa: Obras > Agrupamentos > Unidades com criacao em lote e drag-and-drop
- Biblioteca FVS com servicos, itens de verificacao, tags coloridas e ativacao por obra
- Sistema de revisoes FVS com historico, rastreabilidade por obra e revisao condicional (modo rascunho)
- Navegacao contextual com sidebar global e sidebar de obra
- Dashboard do engenheiro com 4 KPIs, feed de NCs e grafico de conformidade temporal (Recharts)

**Stats:**

- 230 files created/modified
- 13,355 lines of TypeScript
- 9 phases, 34 plans, 146 min total execution
- 5 days from start to ship (2026-01-19 to 2026-01-24)
- 36 requirements satisfied (100% coverage)

**Git range:** `feat(01-01)` to `feat(06-03)`

**Tech debt carried forward:**
- Hardcoded construtora name in breadcrumb (auth integration deferred)
- Hardcoded isOnline=true in status indicator
- DEV_CLIENTE_ID instead of authenticated user

**What's next:** v1.1 — Auth integration, verificacoes no portal, polimento UI

---
