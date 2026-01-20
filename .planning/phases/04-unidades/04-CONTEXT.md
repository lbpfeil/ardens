# Phase 4: Unidades - Context

**Gathered:** 2026-01-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Gestao de unidades dentro de agrupamentos (apartamentos, casas, etc.). Usuario pode listar, criar, editar e excluir unidades vinculadas a um agrupamento. Criacao em lote com padrao numerico. Verificacoes de servicos sao fases futuras.

</domain>

<decisions>
## Implementation Decisions

### Display pattern
- Layout split-view (master-detail): agrupamentos a esquerda (40%), unidades a direita (60%)
- Ao clicar em agrupamento, unidades aparecem no painel direito
- Empty state: placeholder ilustrativo + "Selecione um agrupamento para ver unidades"
- Selecao indicada com background highlight + borda lateral verde (brand)
- Header do painel direito: "Unidades de [Nome do Agrupamento]"
- Mobile: stack vertical (agrupamentos em cima, unidades embaixo)
- Sem drag-and-drop para reordenar unidades (nao necessario)

### Batch naming format
- Formato numerico com prefixo: "Apto 101-110" cria 10 unidades
- Prefixo opcional: pode ser "101-110" (so numeros) ou "Apto 101-110"
- Preview truncado em 5 itens com "..." e total (mesmo padrao de agrupamentos)
- Limite de 500 unidades por lote (maior que agrupamentos devido a obras grandes)

### Unit metadata
- Campo unico: apenas nome da unidade
- Sem indicador de status/progresso nesta fase
- Contagem de unidades como badge ao lado do nome do agrupamento: "Bloco A (12)"
- Ordenacao alfanumerica por nome (natural sort: Apto 1, Apto 2, ..., Apto 10)

### Interaction flow
- Modal de criacao/edicao: mesmo padrao de agrupamentos (Dialog + form + checkbox batch mode)
- Menu dropdown por unidade: Editar + Excluir
- AlertDialog simples para confirmacao de exclusao
- Feedback via Toast (Sonner) para todas as acoes

### Claude's Discretion
- Posicionamento do botao "Nova unidade" (documentar no design system apos decidir)
- Espacamento e detalhes visuais do split-view
- Implementacao do natural sort para ordenacao

</decisions>

<specifics>
## Specific Ideas

- Split-view aproveita espaco da pagina que antes so tinha uma tabela
- Contagem inline "Bloco A (12)" em vez de coluna separada para economizar espaco horizontal
- Padroes novos devem ser documentados no design system para consistencia futura

</specifics>

<deferred>
## Deferred Ideas

None - discussao permaneceu dentro do escopo da fase

</deferred>

---

*Phase: 04-unidades*
*Context gathered: 2026-01-20*
