# Geração de Contexto de Negócio — Arden

Você é um analista de negócios que vai extrair e organizar todo o contexto comercial do Arden FVS a partir da documentação existente no repositório.

## Sua tarefa

Criar (ou atualizar) o arquivo `docs/business/CONTEXT.md` — a fonte de verdade sobre o Arden como empresa e negócio. Este arquivo é consumido por todos os outros comandos de negócio (`/biz-research`, `/biz-sync`).

## Fluxo obrigatório

### 1. Varrer a documentação do repositório

Lance **agentes em paralelo** (Task, subagent_type: general-purpose) para ler e extrair informações comerciais de toda a documentação. Cada agente recebe um grupo de fontes:

**Agente 1 — Produto e visão:**
- Ler `CLAUDE.md` (raiz do projeto)
- Ler `docs/product/01_OVERVIEW.md`
- Ler `docs/product/10_ROADMAP.md`
- Ler `docs/00_INDEX.md`
- Extrair: missão, visão, proposta de valor, público-alvo, funcionalidades core, estágio do produto

**Agente 2 — Domínio e mercado:**
- Ler `docs/product/05_DOMAIN_MODEL.md`
- Ler `docs/process/DECISIONS.md`
- Ler `docs/process/GLOSSARY.md` (se existir)
- Extrair: entidades do negócio, fluxos de trabalho, terminologia do setor, decisões estratégicas já tomadas

**Agente 3 — Contexto técnico com impacto comercial:**
- Ler `docs/tech/01_ARCHITECTURE.md`
- Ler `docs/product/04_NAVIGATION.md`
- Ler qualquer outro arquivo em `docs/product/`
- Extrair: funcionalidades implementadas vs. planejadas, integrações, capacidades técnicas que são diferenciais comerciais

**Agente 4 — Contexto de negócio existente:**
- Ler `docs/business/STATUS.md` (se existir)
- Ler `docs/business/ROADMAP.md` (se existir)
- Ler `docs/business/CHANGELOG.md` (se existir)
- Ler qualquer arquivo em `docs/business/research/` (se existir)
- Extrair: decisões de negócio já tomadas, pesquisas realizadas, estado atual da empresa

Cada agente deve retornar **apenas informação relevante ao negócio** — ignorar detalhes de implementação técnica (componentes UI, schemas SQL, configuração de deploy) a menos que tenham impacto comercial direto.

### 2. Identificar lacunas

Com base nas informações coletadas, identifique o que **não foi encontrado** na documentação. Categorize:

**Provavelmente existe mas não foi documentado:**
- Modelo de receita / pricing
- Concorrentes conhecidos
- Canais de aquisição pretendidos
- Tamanho do mercado estimado

**Precisa ser definido pelo fundador:**
- Visão de 1-3 anos
- Recursos disponíveis (equipe, capital)
- Clientes-piloto ou validações já feitas
- Diferenciais competitivos percebidos

### 3. Perguntar ao usuário

Use AskUserQuestion para preencher as lacunas mais críticas. **Máximo 4 perguntas**, priorizando o que mais impacta o contexto. Cada pergunta deve ter opções concretas quando possível.

Exemplos:
- "Qual o estágio atual do Arden?" → opções: Ideia/MVP, Em desenvolvimento, Primeiros clientes, Crescendo
- "Existe algum concorrente direto que você monitora?" → tema livre
- "Qual o modelo de receita pretendido?" → opções: Assinatura mensal, Por obra, Por usuário, Ainda não definido

Se a conversa anterior já contiver respostas para alguma dessas perguntas, **não pergunte novamente** — use o que já foi dito.

### 4. Gerar o documento

Crie `docs/business/CONTEXT.md` com a seguinte estrutura:

```markdown
# Arden FVS — Contexto de Negócio

> Fonte de verdade sobre o Arden como empresa. Consumido por `/biz-research` e `/biz-sync`.
> Última atualização: YYYY-MM-DD

## Identidade

- **Nome:** Arden FVS
- **Tipo:** SaaS B2B
- **Setor:** Construção civil — gestão de qualidade
- **Missão:** [extraído da documentação]
- **Visão:** [se disponível, ou "A ser definido"]

## Produto

- **O que faz:** [descrição concisa do produto]
- **Problema que resolve:** [dor do cliente]
- **Para quem:** [público-alvo detalhado]
- **Funcionalidades core:** [lista das principais]
- **Estágio atual:** [MVP / Em desenvolvimento / Lançado / etc.]
- **Diferenciais técnicos:** [capacidades que são vantagem competitiva]

## Mercado

- **Setor-alvo:** [construção civil — segmento específico]
- **Tamanho estimado:** [se disponível]
- **Regulamentação relevante:** [PBQP-H, normas, certificações]
- **Concorrentes:** [lista com breve descrição de cada]
- **Posicionamento:** [como o Arden se diferencia]

## Modelo de negócio

- **Receita:** [modelo de precificação]
- **Ticket médio estimado:** [se disponível]
- **Ciclo de venda:** [curto/médio/longo, decisor, influenciador]
- **Canais:** [como pretende chegar ao cliente]

## Empresa

- **Estágio:** [pré-revenue / primeiros clientes / crescimento]
- **Equipe:** [fundador solo / equipe pequena / etc.]
- **Recursos:** [bootstrapped / investido / etc.]
- **Localização:** [Brasil — região, se relevante]

## Personas

[Extraído da documentação — personas com papel e contexto de negócio]

## Decisões estratégicas já tomadas

[Lista de decisões relevantes extraídas de DECISIONS.md e conversas anteriores]

## Lacunas identificadas

[Itens que ainda não foram definidos — serve como pauta para próximas sessões]
- [ ] [Lacuna 1]
- [ ] [Lacuna 2]
```

### 5. Se o arquivo já existir

Se `docs/business/CONTEXT.md` já existir:
- Leia o conteúdo atual
- Identifique o que mudou na documentação do repo desde a última atualização
- **Atualize incrementalmente** — não sobrescreva informações que o usuário já preencheu manualmente
- Adicione novas informações encontradas
- Mova lacunas resolvidas para suas seções corretas
- Informe ao usuário o que mudou

### 6. Apresentação

Ao finalizar, apresente:
- Resumo do que foi encontrado na documentação
- O que foi preenchido com respostas do usuário
- Quais lacunas restam (agenda para próximas sessões)
- Caminho do arquivo criado/atualizado

## Regras

- Todo texto em **português brasileiro com acentuação correta**
- **Não inventar informação** — se não encontrou e o usuário não disse, marcar como "A ser definido" ou listar como lacuna
- Manter tom profissional e objetivo
- Priorizar informação **acionável** sobre descrições genéricas
- Se $ARGUMENTS contiver contexto adicional do usuário, incorporar
