# Phase 2: Obras - Context

**Gathered:** 2026-01-19
**Status:** Ready for planning

<domain>
## Phase Boundary

CRUD completo de obras na Visao Global. Usuario pode listar, criar, editar e arquivar obras. Clicar em uma obra = entrar no contexto da obra (context switch, sidebar muda). A "Home" da obra com KPIs e NCs pertence a Phase 6 (Dashboard).

**Importante:** Esta phase acontece no contexto "Visao Global", nao dentro de uma obra especifica.

</domain>

<decisions>
## Implementation Decisions

### Lista de obras
- Layout: **Tabela** com colunas (estilo Supabase tables)
- Colunas: Nome, Status (badge), Progresso (barra visual %), Data criacao, Acoes (dropdown)
- Toolbar: Campo de busca por nome + dropdown filtro de status (Ativas/Arquivadas/Todas)
- Clique na linha da obra = entra no contexto da obra (navegacao para /app/obras/[id])

### Criar obra
- Interface: **Modal (Dialog)** abrindo sobre a lista
- Campos obrigatorios: apenas **Nome**
- Campos opcionais: Endereco (cidade/estado) - pode preencher depois
- Padrao de modal: Dialog do design system (sm:max-w-[425px])

### Editar obra
- Interface: **Mesmo modal** que criar, com dados preenchidos
- Acesso: via dropdown de acoes na linha da tabela
- Comportamento: salva e fecha, toast de sucesso

### Arquivar obra
- Confirmacao: **AlertDialog** ("Tem certeza? A obra sera arquivada.")
- Acesso a arquivadas: **Filtro na lista** (dropdown status inclui "Arquivadas")
- Restaurar: **Sim**, obras arquivadas tem acao "Restaurar" no dropdown
- Visualizacao: obras arquivadas podem ser acessadas **read-only** (entrar no contexto, ver dados, sem editar)

### Navegacao
- Contexto: Visao Global (sidebar mostra itens globais da construtora)
- Rota lista: `/app/obras`
- Rota obra: `/app/obras/[id]` (entra no contexto da obra, sidebar muda)
- Breadcrumb: `Empresa / Gerenciar Obras`

### Claude's Discretion
- Ordenacao padrao da tabela (por nome ou data criacao)
- Paginacao se necessario (baseado em volumetria 3-10 obras)
- Skeleton loading durante fetch
- Mensagem de empty state quando nao ha obras

</decisions>

<specifics>
## Specific Ideas

- Comportamento igual Supabase: clicar no projeto (obra) = entrar no contexto dele, sidebar muda
- Barra de progresso visual na coluna "Progresso" (% de verificacoes concluidas)
- Status como badge colorido (verde=ativa, cinza=arquivada)

</specifics>

<deferred>
## Deferred Ideas

- Wizard de criacao em 3 passos (Dados > Estrutura > Servicos) - consolidar quando phases 3 e 5 estiverem prontas
- Empreendimentos (agrupamento virtual de obras) - feature secundaria documentada em 07_WEB_PORTAL.md
- Comparativo entre obras - Phase 6 (Dashboard)

</deferred>

---

*Phase: 02-obras*
*Context gathered: 2026-01-19*
