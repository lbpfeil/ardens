# Phase 9: Matriz de Verificações - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Grade visual serviço × unidade onde o engenheiro visualiza o estado de todas as verificações da obra em uma única tela. Colunas agrupadas por agrupamento com headers multinível, indicadores visuais de status por célula, scroll com headers fixos (sticky), e progresso por serviço. Seleção de células e operações em massa pertencem à Fase 10. Navegação e integração com dashboard pertencem à Fase 11.

</domain>

<decisions>
## Implementation Decisions

### Apresentação das Células
- Cor de fundo sólida representando o status — estilo mapa de calor (heatmap)
- Células puramente visuais: só cor, sem ícone ou texto interno
- Tamanho fixo e compacto (~40×40px) para maximizar células visíveis na tela
- 6 status visuais distintos, cada um com cor própria: Pendente, Conforme, NC, Exceção, Conforme após Reinspeção, NC após Reinspeção
- Conforme após Reinspeção deve ter tonalidade diferente de Conforme (ex: verde mais claro)
- NC após Reinspeção deve ter tonalidade diferente de NC (ex: vermelho mais claro)
- Células pendentes (sem verificação): fundo neutro/surface, sem conteúdo — vazia
- Tooltip no hover mostrando: status, data da verificação, quem verificou
- Legenda de cores visível na página — Claude decide o melhor local (header, lateral, footer)

### Agrupamento e Colapso
- Agrupamentos colapsáveis no header — clicar no nome do agrupamento colapsa/expande suas unidades
- Padrão ao abrir: primeiro agrupamento selecionado/expandido (dropdown ou filtro para trocar)
- Para obras com muitas unidades (200+), mostrar apenas o primeiro agrupamento por padrão (mitigar performance)
- Header multinível: linha superior com nome do agrupamento (colspan), linha inferior com nomes das unidades
- Nomes das unidades sempre completos (sem truncamento) — no domínio da construção civil, nomes são curtos por natureza (B01, 01, A3, etc.)
- Sem contadores nos headers de agrupamento — só o nome

### Progresso e Resumos
- Cada linha de serviço mostra indicador de progresso: texto fração ("12/50") + mini barra de progresso
- Indicador posicionado na coluna fixa (sticky), junto ao nome do serviço (abaixo do nome)
- Sem resumo geral da obra no topo — a matriz é autoexplicativa
- Sem contadores nos headers de agrupamento

### Navegação e Interação
- Clicar em qualquer célula navega para a página de verificação individual (/app/obras/[id]/verificacoes/[verificacaoId])
- Clicar em célula pendente NÃO cria a verificação automaticamente — a página individual deve abrir sem criar registro, e o usuário confirma a verificação dentro da página (protege contra cliques acidentais)
- Página individual tem breadcrumb navegável (Obra > Verificações > [Serviço]) + botão "Voltar à Matriz"
- Clicar em "Verificações" no breadcrumb ou no botão volta à matriz

### Claude's Discretion
- Posicionamento exato da legenda de cores
- URL state para agrupamento selecionado (query param vs client state)
- Implementação de sticky headers (z-index, border-collapse)
- Espaçamento e tipografia interna da grade
- Comportamento de colapso (animação ou toggle instantâneo)
- Como a página individual se comporta quando acessada sem verificação existente (criar on-demand vs estado intermediário)

</decisions>

<specifics>
## Specific Ideas

- Estilo heatmap: a matriz deve parecer um mapa de calor de qualidade da obra — as cores contam a história sem precisar ler nada
- Proteção contra cliques acidentais: navegar para célula pendente não deve criar verificação — o engenheiro precisa confirmar intencionalmente
- Nomes de unidades curtos são padrão do setor (B01, 01, A3) — não projetar para nomes longos

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-matriz-verificacoes*
*Context gathered: 2026-01-27*
