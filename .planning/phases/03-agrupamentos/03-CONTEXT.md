# Phase 3: Agrupamentos - Context

**Gathered:** 2026-01-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Gestao de agrupamentos dentro de uma obra (blocos, torres, quadras, etc.). Agrupamentos sao containers simples para unidades — nao tem pagina propria, apenas nome e ordem. Usuario pode criar, editar, excluir e reordenar agrupamentos. Criacao em lote disponivel.

</domain>

<decisions>
## Implementation Decisions

### Navegacao e localizacao
- Agrupamentos ficam em pagina dedicada: `/app/obras/[id]/agrupamentos`
- Acessivel via sidebar-obra (sidebar contextual quando obra esta aberta)
- Sidebar atual ja funciona como sidebar-obra — usar a existente
- Obra detail page mostra apenas resumo/link, sem acoes de agrupamentos

### Layout da lista
- Tabela similar a lista de obras
- Colunas: Nome, Quantidade de Unidades, Acoes (dropdown)
- Clique na linha nao faz nada — acoes ficam no dropdown
- Nao existe pagina de detalhes do agrupamento (e apenas um container)

### Criacao
- Modal para criar agrupamento (igual pattern de obras)
- Criacao em lote no mesmo modal via toggle/campo extra
- Formato lote: prefixo + quantidade + numero inicial
- Exemplo: prefixo "Bloco", quantidade 5, inicio 3 → Bloco 3, Bloco 4, Bloco 5, Bloco 6, Bloco 7

### Reordenacao
- Drag-and-drop para reordenar agrupamentos
- Modo edicao: botao "Reordenar" ativa o modo, handles de arrastar aparecem
- Botao "Salvar" explicito para confirmar nova ordem
- Se sair sem salvar: confirmacao "Descartar alteracoes?"

### Exclusao
- Sempre pede confirmacao, mesmo para agrupamento vazio
- Se tem unidades: cascade delete com aviso "Excluir agrupamento e suas X unidades?"
- Por enquanto permite excluir mesmo com verificacoes — cascade tudo
- Pode ser limitado no futuro conforme plataforma cresce

### Claude's Discretion
- Hard delete vs soft delete — verificar schema existente e decidir
- Componente de drag-and-drop (dnd-kit, react-beautiful-dnd, ou nativo)
- Empty state da lista de agrupamentos
- Mensagens de erro e validacao

</decisions>

<specifics>
## Specific Ideas

- Sidebar-obra vs sidebar-geral: conceito importante para navegacao contextual
- Agrupamentos sao simples: "Bloco A", "Bloco B", "Quadra 4" — apenas containers para unidades
- Usuario geralmente cria em ordem (A, B, C, D) mas pode precisar reordenar depois

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-agrupamentos*
*Context gathered: 2026-01-19*
