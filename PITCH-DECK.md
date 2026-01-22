# Prompt para Pitch Deck - Arden FVS

> Instrucoes para ferramenta de geracao de slides. Use este documento como prompt.

---

## Identidade Visual Base

- **Cor primaria (brand)**: Verde #3ECF8E (inspirado no Supabase)
- **Fundo**: Dark mode (#1C1C1C ou gradiente para #232323)
- **Texto**: Branco (#FAFAFA) para titulos, cinza claro (#B3B3B3) para corpo
- **Fonte sugerida**: Inter, Circular ou SF Pro (sans-serif moderna)
- **Tom geral**: Tech, profissional, moderno, minimalista

---

## SLIDE 1: CAPA

**Conteudo:**
- Logo Arden (posicionar centro-superior ou centro)
- Tagline: **"Qualidade sem burocracia"**
- Subtitulo pequeno: "Gestao de qualidade PBQP-H para construtoras"

**Instrucoes visuais:**
- Fundo: Gradiente escuro sutil (de #1C1C1C para #0A0A0A) ou imagem abstrata de linhas/grids representando construcao digital
- Logo centralizado, grande (40% da largura)
- Tagline em fonte bold, tamanho grande, logo abaixo do logo
- Subtitulo em cinza claro, menor, abaixo da tagline
- Sem elementos visuais pesados - minimalismo extremo
- Opcional: linhas sutis em verde (#3ECF8E) como detalhe decorativo nos cantos

---

## SLIDE 2: PROBLEMA

**Titulo:** A dor do PBQP-H

**Conteudo (3 pontos em destaque):**

1. **Lento** - "Sistemas complexos que atrasam a obra"
2. **Manual** - "Papelada, planilhas, correria antes das auditorias"
3. **Desconectado** - "Qualidade separada do dia-a-dia da obra"

**Dados de contexto (menor, rodape):**
- "3.000+ construtoras certificadas PBQP-H no Brasil"
- "Certificacao obrigatoria para financiamento bancario"

**Instrucoes visuais:**
- Layout: titulo no topo, 3 colunas com icones
- Cada "dor" com um icone simples (sugestoes):
  - Lento: icone de relogio/ampulheta
  - Manual: icone de pilha de papeis ou prancheta
  - Desconectado: icone de cadeia quebrada ou dois circulos separados
- Icones em vermelho/laranja suave (#E57373 ou similar) para transmitir problema
- Gerar icones minimalistas, linha fina (stroke), estilo Lucide/Feather Icons
- Fundo escuro uniforme
- Texto dos pontos em branco, descricoes em cinza

---

## SLIDE 3: SOLUCAO

**Titulo:** Arden: Sua aliada na qualidade

**Frase principal (grande, destacada):**

> "Verificacao de servicos tao rapida que vira rotina, nao obstaculo."

**3 Diferenciais (em cards ou colunas):**

### 1. Velocidade Extrema
- Icone: raio/lightning
- "App mobile com gestos intuitivos. Swipe para aprovar/reprovar."

### 2. Condicoes de Inicio
- Icone: check-shield ou checklist
- "Almoxarifado so libera material se pre-requisitos aprovados."

### 3. Relatorios Automaticos
- Icone: documento com grafico
- "Pronto para auditoria PBQP-H com um clique."

**Instrucoes visuais:**
- Layout: frase principal centralizada no topo (1/3 do slide)
- 3 cards lado a lado na parte inferior (2/3 do slide)
- Cards com fundo ligeiramente elevado (#232323), borda sutil
- Icone verde (#3ECF8E) no topo de cada card
- Titulo do diferencial em branco, bold
- Descricao em cinza claro, tamanho menor
- Gerar icones: estilo outline, cor verde, 48px

---

## SLIDE 4: COMO FUNCIONA

**Titulo:** Fluxo simples, resultado consistente

**Fluxo visual (horizontal, tipo timeline):**

```
[Admin]  -->  [Engenheiro]  -->  [Inspetor]  -->  [Relatorio]
   |              |                 |                |
Configura      Define           Verifica        Pronto para
  obra        servicos          em campo         auditoria
```

**Detalhes de cada etapa:**

### 1. Admin (icone: engrenagem/settings)
"Cria obra, define estrutura, configura biblioteca FVS"

### 2. Engenheiro (icone: hard hat ou blueprint)
"Define servicos por unidade, analisa dashboards"

### 3. Inspetor (icone: smartphone ou checklist)
"Verifica no app mobile, offline-first, gestos rapidos"

### 4. Relatorio (icone: documento com check)
"Gerado automaticamente, certificacao PBQP-H"

**Instrucoes visuais:**
- Layout: timeline horizontal no centro do slide
- 4 circulos conectados por linha/seta
- Cada circulo com icone dentro (fundo verde com icone branco, ou outline verde)
- Setas/conectores em verde (#3ECF8E)
- Labels acima de cada circulo (persona)
- Descricao curta abaixo de cada circulo
- Fundo escuro, elementos centralizados verticalmente
- Gerar imagem: fluxograma estilo Miro/FigJam, mas elegante e tech

---

## SLIDE 5: MOCKUP DO APP

**Titulo:** Verificacao em segundos

**Conteudo visual principal:**
- Mockup de smartphone (iPhone frame) mostrando tela do app
- Tela: lista de verificacoes estilo "feed" com gestos

**Elementos a destacar na tela mockup:**
- Interface dark mode (coerente com brand)
- Cards de verificacao com:
  - Nome do servico
  - Unidade (ex: "Apt 101")
  - Status visual (pendente = amarelo, ok = verde)
- Indicacao visual de "swipe right = conforme" / "swipe left = NC"
- Design limpo, sem clutter

**Callouts ao redor do mockup:**
- "Swipe direita: Conforme" (com seta verde)
- "Swipe esquerda: Nao-conformidade" (com seta laranja/vermelha)
- "Funciona offline" (com icone de nuvem com X)

**Instrucoes visuais:**
- Mockup centralizado (60% do slide)
- Callouts ao redor do dispositivo, conectados com linhas finas
- Frame de smartphone elegante (tipo Apple marketing)
- Tela do app: gerar no estilo do design system (dark, verde accent)
- Para a ferramenta de slides: descrever que deve gerar uma interface mobile dark mode com cards de checklist, estetica profissional tipo app de produtividade

---

## SLIDE 6: CONDICOES DE INICIO (Diferencial)

**Titulo:** Integracao com Almoxarifado

**Subtitulo:** "Qualidade que previne, nao apenas corrige"

**Conceito visual - Fluxo de bloqueio/liberacao:**

```
[Solicitacao de Material]
          |
          v
  [Sistema verifica CI]
          |
    ------+------
    |           |
    v           v
[Aprovado]  [Bloqueado]
 "Libera     "Pre-requisito
 material"   nao atendido"
```

**Exemplo concreto (em destaque):**

> "Rejuntamento so e liberado se o revestimento foi aprovado."

**Instrucoes visuais:**
- Fluxograma estilo decision tree, vertical
- Usar cores: verde para aprovado, amarelo/laranja para bloqueado
- Icones: caixa/pacote para material, escudo/check para aprovacao, mao/stop para bloqueio
- Exemplo concreto em card destacado, talvez com aspas ou borda verde
- Pode incluir ilustracao minimalista de almoxarifado (prateleiras estilizadas)
- Manter fundo escuro, elementos limpos

---

## SLIDE 7: PROXIMOS PASSOS

**Titulo:** Comece agora

**Conteudo (3 etapas claras):**

### 1. Trial Gratuito
- Icone: play/start ou gift
- "14 dias para testar com sua equipe"

### 2. Implementacao Guiada
- Icone: pessoas/suporte ou hands
- "Nossa equipe configura sua primeira obra junto com voce"

### 3. Escale quando quiser
- Icone: grafico crescendo ou seta para cima
- "Adicione obras e usuarios conforme precisar"

**CTA destacado:**

> "Agende uma demonstracao" ou "Fale com nosso time"

**Instrucoes visuais:**
- Layout: 3 cards horizontais ou 3 etapas tipo "numbered steps" (1, 2, 3)
- Numeros grandes em verde, texto ao lado
- CTA em botao destacado (fundo verde, texto branco) na parte inferior
- Transmitir: facil comecar, sem risco, suporte proximo
- Fundo pode ter gradiente sutil ou pattern de pontos/grid

---

## SLIDE 8: CONTATO

**Titulo:** Vamos conversar?

**Informacoes de contato:**
- **Nome:** [Seu nome]
- **Cargo:** [Ex: Founder, Sales]
- **Email:** [email]
- **WhatsApp:** [numero]
- **Site:** [URL]

**QR Code** (opcional):
- Gerar QR Code para WhatsApp ou site

**Instrucoes visuais:**
- Layout limpo, centralizado
- Logo Arden pequeno no canto
- Informacoes de contato em lista organizada com icones (email, phone, globe)
- Icones em verde, texto em branco
- QR Code se couber, posicionado a direita
- Pode incluir foto/avatar profissional do apresentador
- Fundo escuro, minimalista
- Fechar com sensacao de profissionalismo e acessibilidade

---

## Notas Gerais para Geracao de Imagens

**Quando gerar imagens/ilustracoes:**
- Estilo: flat design ou outline minimal
- Cores: predominancia de cinza escuro (#1C1C1C, #232323), verde (#3ECF8E) como accent
- Evitar: imagens stock genericas de pessoas apertando maos ou escritorios
- Preferir: ilustracoes tech, icones, mockups, fluxogramas elegantes
- Referencia visual: Supabase.com, Linear.app, Vercel.com (estilo SaaS moderno)

**Para mockups de interface:**
- Dark mode obrigatorio
- Interface limpa, muito espaco em branco (ou "espaco escuro")
- Tipografia clara, hierarquia visual
- Verde para elementos de acao/sucesso
- Vermelho/laranja suave para alertas/erros

---

## Resumo da Estrutura

| Slide | Titulo | Objetivo |
|-------|--------|----------|
| 1 | Capa | Impacto inicial, tagline |
| 2 | Problema | Criar identificacao com a dor |
| 3 | Solucao | Apresentar Arden + 3 diferenciais |
| 4 | Como funciona | Fluxo visual simples |
| 5 | Mockup App | Demonstrar velocidade/UX |
| 6 | Condicoes de Inicio | Diferencial almoxarifado |
| 7 | Proximos passos | Call-to-action claro |
| 8 | Contato | Facilitar proximo passo |

---

*Criado em: 2026-01-22*
