# Phase 6: Dashboard - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Dashboard **por obra** com KPIs de qualidade e feed de não-conformidades. O dashboard global (agregação de todas as obras) fica para fase futura — com a base por obra pronta, o global é trivial.

Página: `/app/obras/[id]` (já existe como placeholder)

</domain>

<decisions>
## Implementation Decisions

### Layout dos KPIs
- Grid 2x2 (2 colunas x 2 linhas), todos cards do mesmo tamanho
- Cada card mostra: valor atual + tendência (seta + % de variação)
- Comparação: mês atual vs mês anterior
- Visual: seguir design system para containers (bg-surface-100)

### Métricas e Cálculos
- **Taxa de Conformidade**: (Conformes + Conformes c/ ressalva) / Total de verificações
- **IRS (Índice de Retrabalho)**: pesquisar fórmula robusta na construção civil
- **Verificações Pendentes**: verificações com NC aberta (não resolvida)
- **Verificações Concluídas**: Conformes + NCs resolvidas (NC resolvida = serviço passou)

### Feed de NCs
- Mostrar 5 NCs mais recentes
- Informações por item: Serviço + Unidade + Data relativa
- Ao clicar: abre modal com detalhes da NC
- Link "Ver todas as NCs" para lista completa

### Gráfico Temporal
- Métrica: Taxa de Conformidade ao longo do tempo
- Período padrão: últimos 3 meses
- Granularidade: diária (um ponto por dia)
- Seletor de período: 30d, 3m, 6m, 1a, Todo

### Claude's Discretion
- Fórmula exata do IRS (pesquisar melhor prática)
- Estilo do gráfico (cores, área preenchida, tooltip)
- Layout responsivo (como reorganiza em mobile)
- Skeleton loading durante carregamento

</decisions>

<specifics>
## Specific Ideas

- NC resolvida eventualmente se torna Conforme — considerar no fluxo de dados
- Dashboard por obra é a "unidade atômica" — componentes devem ser reutilizáveis para futuro dashboard global

</specifics>

<deferred>
## Deferred Ideas

- Dashboard global (agregação de todas as obras) — fase futura, reutiliza componentes
- Filtros avançados no dashboard (por agrupamento, por serviço)
- Exportação de relatório PDF

</deferred>

---

*Phase: 06-dashboard*
*Context gathered: 2026-01-24*
