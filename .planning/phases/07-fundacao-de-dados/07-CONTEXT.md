# Fase 7: Fundação de Dados e Server Actions - Contexto

**Gathered:** 2026-01-26
**Status:** Pronto para planejamento

<domain>
## Limite da Fase

Todas as operações de leitura e escrita de verificações disponíveis como Server Actions e queries reutilizáveis, prontas para qualquer UI consumir. Inclui CRUD de verificações, marcação de itens, RPC bulk, e query otimizada para a matriz. Sem UI nesta fase.

</domain>

<decisions>
## Decisões de Implementação

### Comportamento de resultado/status

- **Resultados possíveis (primeira inspeção):** Conforme, Não Conforme, Exceção — 3 resultados apenas
- **Reinspeção individual:** Todos os 4 status do schema — Conforme após Reinspeção, Retrabalho, Aprovado com Concessão, Reprovado após Retrabalho
- **Reinspeção via bulk:** Simplificado — Conforme (traduz para "Conforme após Reinspeção") e NC (traduz para "NC após Reinspeção", mapeado ao status mais apropriado)
- **Imutabilidade:** Verificação Conforme é TRAVADA — não pode ser reaberta ou alterada. Erro requer ação administrativa
- **Status de verificação (nível geral):** Pendente → Em Andamento → Concluída | Com NC (derivado automaticamente dos itens)

### Escopo da operação bulk

- **Resultados suportados:** Conforme + NC + Exceção (não só Conforme) — RPC renomeado para `bulk_verificar` em vez de `bulk_verificar_conforme`
- **Conflitos com existentes:** Células já Conformes são IGNORADAS (travadas). Células NC existentes entram em fluxo de reinspeção automático
- **Itens no bulk Conforme:** Auto-marca TODOS os itens de verificação como Conforme — dados completos, não só resultado geral
- **Itens no bulk NC:** Auto-marca TODOS os itens como Não Conforme — o engenheiro depois edita individualmente para detalhar quais são realmente NC
- **Itens no bulk Exceção:** Cria verificação com resultado Exceção (não se aplica à unidade)
- **Atomicidade:** Transação atômica — sem registros parciais em caso de erro

### Claude's Discretion

- Query shape da matriz (filtros, ordenação, estrutura do retorno)
- Tratamento de erros e formato de feedback para o UI
- Nomes exatos das Server Actions e parâmetros
- Pattern de RLS para operações bulk (initPlan pattern mencionado no roadmap)
- Batch size para operações bulk grandes

</decisions>

<specifics>
## Ideias Específicas

- O nome do RPC bulk deve ser genérico (`bulk_verificar`) já que suporta todos os resultados, não só Conforme
- Os triggers de contadores do banco já existem no schema — as Server Actions devem respeitar o fluxo existente
- Reinspeção no bulk é simplificada (só Conforme/NC), mas individual usa todos os 4 status do schema

</specifics>

<deferred>
## Ideias Diferidas

Nenhuma — discussão manteve-se dentro do escopo da fase.

</deferred>

---

*Fase: 07-fundacao-de-dados*
*Contexto capturado: 2026-01-26*
