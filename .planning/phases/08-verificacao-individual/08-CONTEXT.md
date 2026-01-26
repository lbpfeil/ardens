# Phase 8: Verificação Individual - Context

**Gathered:** 2026-01-26
**Status:** Ready for planning

<domain>
## Phase Boundary

O engenheiro abre uma verificação de 1 serviço em 1 unidade, avalia cada item individualmente com C/NC/NA, e o sistema determina o resultado final automaticamente. Inclui ciclo de reinspeção para itens NC. Não inclui: matriz de verificações (Fase 9), operações em massa (Fase 10), navegação/integração (Fase 11).

</domain>

<decisions>
## Implementation Decisions

### Layout dos itens
- Checklist compacta: uma linha por item com nome + toggle C/NC/NA
- Toggle inline com 3 botões lado a lado, clique direto marca sem abrir modal
- Cores dos botões: Verde (C) / Vermelho (NC) / Amarelo (NA)
- Ao clicar na linha do item (fora do toggle), abre modal com detalhes
- Modal mostra: Observação + Método + Tolerância do template de serviço

### Fluxo de avaliação (já definido na documentação)
- NC obriga observação por item (como no mobile), fotos diferidas para v1.2
- Reinspeção tem 4 resultados: Conforme após reinspeção, Retrabalho, Aprovado com concessão, Reprovado após retrabalho
- Resultado automático: qualquer item NC → verificação NC; todos C/NA → Conforme
- Imutabilidade: verificação Conforme (concluída + todos itens conformes) é travada
- UI "NA" → enum 'exceção' no banco

### Regra de observação por contexto
- **Verificação individual (Fase 8):** observação é por item — NC obriga, C/NA opcional
- **Verificação em massa (Fase 10):** observação é por serviço, obrigatória independente do resultado (Conforme, NC ou Exceção) — justificativa: verificação via web é incomum, precisa documentar o porquê

### Estados visuais e feedback
- Header de identificação simples: serviço + unidade + obra — sem indicador de progresso
- Feedback ao marcar item: cor muda com transição suave (animação)
- Ao concluir verificação (todos itens marcados): banner no topo verde/vermelho indicando "Verificação concluída — Conforme" ou "Verificação concluída — Não Conforme"
- Verificação travada (Conforme imutável): toggles desabilitados (cinza) + banner "Verificação Conforme — não pode ser alterada"

### Exceção e descrição
- Botão "Marcar como Exceção" visível no header da página, ao lado da identificação
- Ao marcar Exceção: modal com justificativa obrigatória antes de confirmar
- Campo de descrição geral da verificação (VERIF-04): textarea visível no topo/rodapé da página, sempre acessível

### Claude's Discretion
- Posicionamento exato do textarea de descrição geral (topo ou rodapé)
- Design do modal de detalhes do item
- Design do modal de NC (campo de observação obrigatório)
- Fluxo de reinspeção no portal web (adaptar conceito mobile para clicks)
- Loading states e skeleton durante fetch
- Espaçamento, tipografia e ícones

</decisions>

<specifics>
## Specific Ideas

- Botões toggle com cores fortes: Verde (Conforme), Vermelho (NC), Amarelo (NA) — identidade visual clara
- Modal de detalhes do item mostra os 3 campos do template: Observação, Método, Tolerância
- Verificação via web é incomum (campo é predominantemente mobile), por isso a observação em massa é sempre obrigatória

</specifics>

<deferred>
## Deferred Ideas

- Upload de fotos na verificação — v1.2
- Regra de observação obrigatória para verificação em massa — Fase 10

</deferred>

---

*Phase: 08-verificacao-individual*
*Context gathered: 2026-01-26*
