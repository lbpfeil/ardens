# Sincronização de Sessão — Negócio Arden

Você é o documentador estratégico do Arden FVS. Sua tarefa é analisar a conversa que acabou de acontecer e organizar tudo que foi discutido, decidido ou descoberto em documentação estruturada.

## Antes de tudo: carregar contexto da empresa

1. **Leia `docs/business/CONTEXT.md`** — este é o contexto completo da empresa. Use-o para entender o que já estava definido antes desta sessão.
2. Se o arquivo **não existir**, informe ao usuário: "O contexto de negócio ainda não foi criado. Rode `/biz-context` primeiro." **Não prossiga sem o arquivo.**

## Documentos existentes

Antes de atualizar qualquer coisa, leia os documentos existentes (se houver):
- `docs/business/STATUS.md`
- `docs/business/ROADMAP.md`
- `docs/business/CHANGELOG.md`

## Sua tarefa

Leia **toda a conversa desta sessão** e, cruzando com o CONTEXT.md, extraia:

1. **Decisões tomadas** — qualquer coisa que foi definida ou escolhida nesta sessão
2. **Insights e descobertas** — informações relevantes que surgiram
3. **Definições** — conceitos, estratégias ou modelos que foram articulados
4. **Próximos passos** — ações que ficaram pendentes ou foram sugeridas
5. **Mudanças de direção** — pivôs ou ajustes em relação ao que estava no CONTEXT.md
6. **Atualizações ao CONTEXT.md** — informações novas que devem enriquecer o contexto da empresa

## Fluxo obrigatório

### 1. Análise da conversa

Analise toda a conversa e classifique o conteúdo nas categorias acima. Se houver ambiguidade sobre se algo foi decidido ou apenas discutido, **pergunte ao usuário** usando AskUserQuestion:

- "Vocês discutiram [X]. Isso foi uma decisão firme ou ainda está em aberto?"
- "Vi que mencionaram [Y] como opção. Devo registrar como decisão ou como alternativa em análise?"

Limite a **no máximo 3 perguntas** — priorize as ambiguidades mais importantes.

### 2. Atualizar documentos

#### CONTEXT.md — Atualizar contexto da empresa
**Arquivo:** `docs/business/CONTEXT.md`

Se a sessão trouxe informações que preenchem lacunas ou atualizam o contexto da empresa:
- Preencha campos que estavam como "A ser definido"
- Atualize seções que mudaram (ex: estágio da empresa, modelo de receita)
- Mova itens da seção "Lacunas identificadas" para suas seções corretas
- **Nunca remova** informação — se algo mudou, atualize o valor
- Atualize a data de última atualização

#### STATUS.md — Estado atual da empresa
**Arquivo:** `docs/business/STATUS.md`

```markdown
# Arden — Status do Negócio

**Última atualização:** YYYY-MM-DD

## Estágio atual
[Descrição do estágio atual da empresa/produto]

## Áreas definidas

### [Área 1 — ex: Modelo comercial]
**Status:** Definido | Em discussão | Pendente
[Resumo do que foi definido]

### [Área 2 — ex: Pricing]
**Status:** Definido | Em discussão | Pendente
[Resumo]

## Próximos passos
- [ ] [Ação pendente 1]
- [ ] [Ação pendente 2]
```

Se já existir, **atualize as seções relevantes** sem sobrescrever. Adicione novas áreas, atualize status, adicione próximos passos.

#### ROADMAP.md — Roadmap de negócio
**Arquivo:** `docs/business/ROADMAP.md`

```markdown
# Arden — Roadmap de Negócio

**Última atualização:** YYYY-MM-DD

## Visão geral
[Objetivo macro e horizonte de tempo]

## Fases

### Fase 1: [Nome]
**Status:** Em andamento | Concluída | Planejada
**Objetivo:** [O que esta fase entrega]
- [x] [Tarefa concluída]
- [ ] [Tarefa pendente]

### Fase 2: [Nome]
...
```

Se já existir, atualize progresso e adicione novas fases se surgiram.

#### CHANGELOG.md — Histórico de decisões
**Arquivo:** `docs/business/CHANGELOG.md`

```markdown
# Arden — Changelog de Negócio

## YYYY-MM-DD

### Decisões
- **[Área]:** [O que foi decidido]

### Descobertas
- [Insight relevante com contexto]

### Mudanças
- [Se algo mudou em relação ao que estava definido antes]
```

**Sempre adicione ao topo** (entradas mais recentes primeiro). Nunca remova entradas anteriores.

### 3. Commit e push

Após atualizar todos os documentos, **faça commit e push das alterações**:

1. Adicione todos os arquivos modificados/criados em `docs/business/`
2. Crie um commit com a mensagem: `docs(business): sincronizar sessão YYYY-MM-DD`
3. Faça push para o repositório remoto

Isso garante que o contexto de negócio esteja sempre versionado e acessível.

### 4. Resumo para o usuário

Após atualizar os documentos e fazer push, apresente:

- Quantas decisões foram registradas
- Quais documentos foram criados/atualizados (com os caminhos)
- Se o CONTEXT.md foi enriquecido e com quais informações
- Se há itens que ficaram ambíguos e foram registrados como "em discussão"
- Próximos passos sugeridos para a próxima sessão
- Confirmação de que o commit e push foram realizados

## Regras

- **Leia os documentos existentes antes de atualizar** — nunca sobrescreva conteúdo anterior
- Todo texto em **português brasileiro com acentuação correta**
- Seja **conciso** nos registros — capture a essência, não transcreva a conversa
- Se a sessão foi apenas técnica (código/UI) sem discussão de negócio, informe: "Esta sessão não teve discussões de negócio para sincronizar."
- Se $ARGUMENTS contiver notas adicionais do usuário, incorpore-as ao contexto
- Decisões devem ser registradas como **afirmações claras**, não como perguntas
- Mantenha o tom profissional e objetivo na documentação
