# Phase 12: Modelo de Status - Context

**Gathered:** 2026-01-28
**Status:** Ready for planning

<domain>
## Phase Boundary

Migration de banco e lógica de cálculo para o novo modelo de status. A verificação (serviço + unidade) passa a ter 4 estados calculados automaticamente a partir dos itens, e os status granulares (NC, Retrabalho, etc.) permanecem exclusivamente no nível de item. O trigger existente é refatorado para as novas regras, o ENUM é renomeado, e a RPC `bulk_verificar` delega o cálculo de status inteiramente ao trigger.

</domain>

<decisions>
## Implementation Decisions

### Fluxograma de transições (nível item)

- **Primeira inspeção:** Não Verificado → Conforme / Não Conforme / Exceção (documentado em `docs/product/05_DOMAIN_MODEL.md`)
- **Reinspeção (se NC):** NC → Conforme após reinspeção / Retrabalho / Aprovado com concessão / Reprovado após retrabalho
- **Reprovado após retrabalho** conta como NC aberta (volta ao fluxo de reinspeção)
- **Exceção NÃO conta como progresso** — um item com Exceção não move a verificação de Pendente para Em Andamento

### Regras de cálculo do status da verificação (4 estados)

| Status | Regra |
|--------|-------|
| **Pendente** | Todos os itens são `nao_verificado` ou `excecao` (Exceção não conta como progresso) |
| **Em Andamento** | >=1 item Conforme, sem NC aberta, ainda há itens não finalizados |
| **Verificado com Pendências** | >=1 NC aberta — NC sempre domina, independente de quantos itens estão Conforme ou pendentes |
| **Verificação Finalizada** | Todos os itens em estado terminal |

**NC aberta** = `nao_conforme` sem reinspeção concluída OU `reprovado_apos_retrabalho`

**Estado terminal (finalizado)** = Conforme, Exceção, Conforme após reinspeção, Retrabalho, Aprovado com concessão. **Reprovado após retrabalho NÃO é terminal.**

**Prioridade:** NC > Em Andamento > Pendente. Se existe qualquer NC aberta, o status é Verificado com Pendências independente do restante.

### ENUM do banco de dados

- Renomear o ENUM `status_verificacao` para os novos nomes de negócio:
  - `pendente` (mantém)
  - `em_andamento` (mantém)
  - `com_nc` → `verificado_com_pendencias`
  - `concluida` → `verificacao_finalizada`
- Mapeamento direto 1:1 dos valores antigos para os novos

### Mecanismo de cálculo

- **Trigger PostgreSQL** continua como mecanismo de cálculo (já existe `atualizar_contadores_verificacao()`)
- Trigger atualizado com as novas regras de 4 estados
- **Contadores denormalizados:** manter existentes e expandir conforme necessário (ex: `itens_finalizados`)
- **`bulk_verificar` delega ao trigger** — RPC só insere/atualiza itens, trigger recalcula status automaticamente. Uma única fonte de verdade.

### Validação de transições

- **Validação dual:** frontend mostra apenas ações válidas baseado no status atual (UX rápida), backend revalida no trigger/RPC (segurança)
- Regras de transição existem em ambas as camadas

### Migração dos dados existentes

- Dados são de teste — migração pode ser destrutiva se necessário
- Mapeamento direto: pendente→pendente, em_andamento→em_andamento, com_nc→verificado_com_pendencias, concluida→verificacao_finalizada
- Após migração do ENUM, recalcular todos os status via trigger para garantir consistência

</decisions>

<specifics>
## Specific Ideas

- O modelo original do roadmap previa 3 estados. Decisão da discussão: adicionar "Em Andamento" como 4º estado para distinguir "nenhum progresso" de "progresso sem problemas"
- Exceção é explicitamente excluída do conceito de "progresso" — um serviço com itens apenas de Exceção e não verificados continua Pendente

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-modelo-de-status*
*Context gathered: 2026-01-28*
