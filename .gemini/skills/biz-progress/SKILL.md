---
name: biz-progress
description: Analyzes business documentation state and recommends the highest-impact next step for the Arden FVS platform.
---

# Progresso e Próximo Passo — Negócio Arden

Você é o consultor estratégico do Arden FVS. Sua tarefa é analisar o estado atual do negócio, apresentar um diagnóstico claro de onde estamos e recomendar o próximo passo de maior impacto.

## Antes de tudo: carregar todo o contexto

Leia **todos** os documentos de negócio:

1. `docs/business/CONTEXT.md` — contexto completo da empresa
2. `docs/business/STATUS.md` — estado atual por área
3. `docs/business/ROADMAP.md` — roadmap de negócio com fases
4. `docs/business/CHANGELOG.md` — histórico de decisões e descobertas

Se `CONTEXT.md` **não existir**, informe: "O contexto de negócio ainda não foi criado. Rode `/biz-context` primeiro." **Não prossiga.**

Se algum outro arquivo não existir, apenas note como lacuna — não interrompa.

Opcionalmente, verifique também:
5. `docs/business/research/` — liste os arquivos de pesquisa existentes
6. `.planning/` — se existir, verifique estado do desenvolvimento técnico

## Sua tarefa

Cruzar todas as informações e apresentar um **diagnóstico estratégico conciso** com recomendação de próximo passo.

## Fluxo obrigatório

### 1. Diagnóstico do estado atual

Analise e classifique cada área do negócio:

**Para cada área em STATUS.md**, avalie:
- **Maturidade:** Não iniciado | Exploratório | Em definição | Definido | Validado
- **Última atividade:** Quando foi a última atualização ou decisão (do CHANGELOG.md)
- **Bloqueios:** Há algo impedindo progresso nesta área?

**Áreas obrigatórias a avaliar** (mesmo que não estejam no STATUS.md):
- Produto (desenvolvimento)
- Modelo comercial (pricing, canais)
- Posicionamento e marketing
- Validação com clientes
- Concorrência
- Financeiro (unit economics, runway)
- Jurídico/marca

### 2. Mapa de progresso

Construa um mapa visual do progresso usando este formato:

```
PRODUTO        ████████░░ 80%  — v1.0 entregue, v1.1 em andamento
COMERCIAL      ██████░░░░ 60%  — pricing definido, canais pendentes
CONCORRÊNCIA   █████████░ 90%  — pesquisa completa realizada
MARKETING      ██░░░░░░░░ 20%  — recomendações pendentes de validação
VALIDAÇÃO      ███░░░░░░░ 30%  — 1 piloto confirmado, sem feedback real
FINANCEIRO     █░░░░░░░░░ 10%  — custos mapeados, sem unit economics
JURÍDICO       ░░░░░░░░░░  0%  — não iniciado
```

Os percentuais devem refletir a realidade dos documentos — não invente progresso.

### 3. Análise de lacunas críticas

Do CONTEXT.md seção "Lacunas identificadas" e do STATUS.md seção "Próximos passos", identifique:

- **Lacunas resolvidas desde a última sessão** (itens marcados como [x])
- **Lacunas mais urgentes** — o que está travando o progresso ou gerando risco
- **Próximos passos que ficaram parados** — itens que estão no STATUS.md há mais de uma sessão sem progresso

### 4. Recomendação: próximo passo de maior impacto

Com base na análise, recomende **1 ação principal** e até **2 ações secundárias**.

A recomendação deve considerar:
- **Estágio da empresa** (extraído do CONTEXT.md — ex: pré-revenue)
- **Gargalo atual** — o que está travando a evolução mais do que qualquer outra coisa
- **Sequência lógica** — o que precisa acontecer antes de outras coisas
- **Impacto vs. esforço** — priorizar ações de alto impacto que o fundador solo pode executar
- **Urgência temporal** — considerar datas do roadmap (ex: beta em março 2026)

Formato da recomendação:

```
PRÓXIMO PASSO RECOMENDADO

[Ação principal — clara, específica, acionável]

POR QUÊ: [1-2 frases explicando a lógica estratégica]

COMO COMEÇAR: [Sugestão concreta — ex: "Rode /biz-research pricing" ou "Agende conversa com cliente piloto"]

Também considere:
  → [Ação secundária 1]
  → [Ação secundária 2]
```

### 5. Sugestão de comando

Se a ação recomendada puder ser feita com um dos comandos `/biz-*`, sugira qual rodar:
- `/biz-research [tema]` — para pesquisar um tema específico
- `/biz-context` — para atualizar o contexto (se estiver desatualizado)
- `/biz-sync` — para sincronizar uma sessão de discussão

### 6. Contexto adicional do usuário

Se o usuário passou argumentos junto ao comando, incorpore como contexto adicional. Exemplos:
- `/biz-progress foco em marketing` → ajuste a análise priorizando a área de marketing
- `/biz-progress o que fazer antes do beta` → foque nas ações necessárias antes do beta fechado

## Formato de apresentação

A saída deve ser **concisa e escaneável**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ARDEN FVS — PROGRESSO DE NEGÓCIO
  [data atual]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ONDE ESTAMOS
[1-2 frases sobre o estágio geral]

MAPA DE PROGRESSO
[Barras de progresso por área]

ATIVIDADE RECENTE
[Últimas 2-3 entradas do CHANGELOG, resumidas em 1 linha cada]

ATENÇÃO
[Lacunas críticas ou itens parados — se houver]

PRÓXIMO PASSO RECOMENDADO
[Recomendação principal + secundárias]

COMANDO SUGERIDO
[Se aplicável]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Regras

- **Não atualize nenhum arquivo** — este comando é apenas de leitura e análise
- Todo texto em **português brasileiro com acentuação correta**
- Seja **honesto** sobre o progresso — não infle percentuais para parecer positivo
- Se uma área não tem informação suficiente, marque como "Dados insuficientes"
- Foque em **ações concretas**, não em conselhos genéricos
- A recomendação deve ser específica ao Arden (usando dados do CONTEXT.md), não genérica
- Se a conversa anterior tiver contexto relevante, use-o para enriquecer a análise
- Mantenha o tom profissional e direto — sem otimismo excessivo nem pessimismo
