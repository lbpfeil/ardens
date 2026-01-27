# Phase 10: Seleção e Operações em Massa - Context

**Gathered:** 2026-01-27
**Status:** Ready for planning

<domain>
## Phase Boundary

O engenheiro seleciona múltiplas células na matriz e executa verificações em lote com um único clique, com resolução inteligente de conflitos. Inclui: modo de seleção, seleção por headers, toolbar flutuante, modal de verificação em massa, e regras de conflito para células já verificadas.

</domain>

<decisions>
## Implementation Decisions

### Mecânica de seleção
- Modo de seleção ativado via botão explícito (não automático)
- Click na célula no modo normal → navega para verificação individual (comportamento preservado)
- Click na célula no modo de seleção → toggle seleção (adiciona/remove)
- Click simples acumula — sem necessidade de Shift ou Ctrl
- Click no header de serviço (no modo de seleção) → seleciona linha inteira
- Click no header de unidade (no modo de seleção) → seleciona coluna inteira
- Headers só funcionam como seletores quando o modo de seleção está ativo
- Saída do modo: botão "Cancelar" + tecla Esc (manual) ou automaticamente após operação bulk confirmada
- Seleção limpa ao sair do modo

### Toolbar flutuante
- Posição: bottom bar fixa no rodapé da página (estilo Gmail)
- Conteúdo: contagem de selecionados + botão "Verificar" + botão "Exceção" + botão "Cancelar"
- Aparece ao entrar no modo de seleção com células selecionadas

### Modal de verificação em massa
- Escolha de resultado: Conforme ou NC (aplicado a todas as células selecionadas)
- Campo de descrição opcional
- Todos os itens do serviço marcados automaticamente conforme o resultado escolhido (consistente com decisão 08-02)
- Resumo com contagem antes de confirmar: "12 verificações serão criadas como Conforme. 3 já existentes serão ignoradas."
- Barra de progresso durante a operação (células processadas / total)

### Resolução de conflitos
- Células Conformes (concluídas) → imutáveis, sempre ignoradas no bulk. Aviso no resumo do modal.
- Células com Exceção → imutáveis, ignoradas no bulk. Aviso no resumo.
- Células NC existentes + bulk Conforme → viram "Conforme após Reinspeção" (respeita histórico)
- Células pendentes (sem verificação) → criadas normalmente com o resultado escolhido
- Operação atômica: tudo ou nada. Se qualquer falhar, nenhuma é aplicada.

### Feedback e estados
- Células selecionadas: borda azul/brand + overlay semitransparente sobre a cor do heatmap
- Durante operação: barra de progresso no modal
- Sucesso: modal fecha, toast de sucesso ("12 verificações criadas"), matriz atualiza com novas cores, seleção limpa
- Erro: toast de erro, operação revertida (tudo ou nada), seleção mantida para retry

### Claude's Discretion
- Animação de entrada/saída da bottom bar
- Exato design da barra de progresso
- Layout interno do modal de bulk
- Estilo visual do overlay de seleção (opacidade, cor exata)
- Comportamento do botão "Selecionar" (posição, ícone)

</decisions>

<specifics>
## Specific Ideas

- Bottom bar fixa no rodapé como Gmail faz com ações em massa
- Resumo no modal deve ser claro sobre o que será ignorado e por quê
- Barra de progresso para operações grandes (não só spinner)
- Modo de seleção explícito preserva o fluxo de navegação individual que já existe

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-selecao-operacoes-massa*
*Context gathered: 2026-01-27*
