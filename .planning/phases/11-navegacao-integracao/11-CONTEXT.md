# Phase 11: Navegação e Integração - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Integrar as verificações (matriz + individual) ao app existente da obra — sidebar, dashboard com dados reais, feed de NCs funcional, e navegação fluida entre matriz e verificação individual. Não inclui novas funcionalidades de verificação nem mudanças no dashboard da construtora (Home Page).

</domain>

<decisions>
## Implementation Decisions

### Dashboard KPIs (INTEG-02)
- O dashboard da obra já possui KPIs reais (Taxa de Conformidade, IRS, Verificações Pendentes, Concluídas) com comparação mês a mês — nenhuma alteração necessária
- O gráfico de evolução temporal (conformidade 90 dias) está adequado — sem mudanças
- A Home Page (nível construtora) mantém dados mock — fora do escopo

### Feed de NCs (INTEG-03)
- Feed exclusivo para não-conformidades — foco em ação corretiva rápida do engenheiro
- Formato de exibição: **"Agrupamento > Unidade"** na linha principal, com serviço e descrição
- Cada item do feed é um atalho: ao clicar, navega direto para a verificação individual
- Remover o botão "Ver todas as NCs" — o feed é suficiente
- Feed já usa dados reais (query em itens_verificacao com status nao_conforme e sem reinspeção)
- Lacunas a resolver: adicionar agrupamento na exibição, implementar click handler para navegação

### Navegação matriz ↔ individual (INTEG-04)
- Botão explícito "Voltar à matriz" no header da verificação individual + browser back funciona também
- Preservar estado da matriz ao retornar (scroll, agrupamentos expandidos/colapsados)
- Highlight temporário na célula que foi verificada ao voltar (pisca/borda por 1-2s para indicar mudança)
- Breadcrumb contextual na verificação individual: "Obra X > Verificações > Serviço Y - Unidade Z"
- Verificação individual acessível de dois pontos de entrada: matriz (célula) e feed de NCs (item)

### Sidebar da obra (INTEG-01)
- Item "Verificações" já existe na sidebar (seção Operação, ícone ClipboardCheck, rota correta)
- Sem badge ou contagem extra — item está adequado como está
- Ordem atual mantida: Painel Geral > Serviços > Unidades > Verificações > NCs

### Claude's Discretion
- Implementação técnica da preservação de estado da matriz (cache, searchParams, etc.)
- Algoritmo do highlight temporário (duração, estilo de animação)
- Formato exato do breadcrumb (componente, separadores)
- Ajustes na query do feed para incluir dados de agrupamento

</decisions>

<specifics>
## Specific Ideas

- Feed de NCs como "atalho para ação corretiva" — o engenheiro vê a NC e vai direto resolver
- "Agrupamento > Unidade" é o formato preferido (não "Serviço - Agrup. / Unidade")
- Highlight temporário ao voltar da verificação individual — feedback visual de que algo mudou

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 11-navegacao-integracao*
*Context gathered: 2026-01-27*
