# ARDEN FVS - Product Requirements Document

**Versão:** 1.0 (Parcial - Em Construção)  
**Data:** Janeiro 2026  
**Status:** ✅ Seções 1-10 Consolidadas | ⏳ Seções 11-14 Pendentes

---

# ÍNDICE

1. [VISÃO GERAL E CONTEXTO ESTRATÉGICO](#1-visão-geral-e-contexto-estratégico) ✅
2. [MODELO DE NEGÓCIO](#2-modelo-de-negócio) ✅
3. [PERSONAS E USUÁRIOS](#3-personas-e-usuários) ✅
4. [ARQUITETURA DE NAVEGAÇÃO](#4-arquitetura-de-navegação) ✅
5. [ESTRUTURA DE DADOS](#5-estrutura-de-dados) ✅
6. [APP MOBILE - VERIFICAÇÕES](#6-app-mobile---verificações) ✅
7. [PORTAL WEB - OBRA ESPECÍFICA](#7-portal-web---obra-específica) ✅
8. [PORTAL WEB - VISÃO GLOBAL](#8-portal-web---visão-global) ✅
9. [PORTAL DO ALMOXARIFE](#9-portal-do-almoxarife) ✅
10. [RELATÓRIOS E AUTOMAÇÕES](#10-relatórios-e-automações) ✅
11. [PERMISSÕES E SEGURANÇA](#11-permissões-e-segurança) ⏳
12. [DESIGN SYSTEM E UI/UX](#12-design-system-e-uiux) ⏳
13. [ASPECTOS TÉCNICOS](#13-aspectos-técnicos) ⏳
14. [PRÓXIMOS PASSOS E ROADMAP](#14-próximos-passos-e-roadmap) ⏳

---

# 1. VISÃO GERAL E CONTEXTO ESTRATÉGICO

## 1.1 Propósito

Arden FVS é uma plataforma SaaS para gestão de qualidade na construção civil, focada em integrar verificações de serviços ao andamento real da obra, eliminando burocracia e trazendo praticidade.

**Missão:** "Trazer extrema rapidez e praticidade na verificação de serviços, tornando a qualidade uma aliada (não um entrave) do andamento da obra."

## 1.2 Problema

**Construtoras grandes:** Usam ferramentas caras e complexas (AutoDOC, QualitTAB FVS) que atrasam obra com processos burocráticos.

**Construtoras pequenas/médias:** Fazem verificações manuais ou improvisadas, correndo para organizar tudo quando auditoria se aproxima. Falta rastreabilidade e histórico.

**Dores principais:**
- Sistemas lentos e complexos
- Desconexão entre qualidade e operação
- Retrabalhos não rastreados
- Documentação trabalhosa para auditorias PBQP-H

## 1.3 Diferenciais Competitivos

**1. Velocidade extrema:** App mobile com gestos intuitivos (swipe direita/esquerda), interface feed, offline-first.

**2. Condições de Início (CI):** Almoxarifado integrado ao ciclo de qualidade - bloqueia liberação de material se pré-requisitos não foram aprovados (ex: rejuntamento só libera se piso/revestimento OK).

**3. IA e Automação:** Relatórios agendados, alertas preditivos, análise de padrões de retrabalho.

**4. Flexibilidade:** Sistema se adapta ao workflow da construtora, não o contrário. Features opcionais (liberar inspeções, aprovar verificações, CIs), tags customizáveis.

## 1.4 Cliente-Alvo

- Construtoras de todos os tamanhos (4 a 1000 unidades)
- **Foco:** pequenas/médias que acham concorrentes complexos
- Certificação PBQP-H necessária ou desejada
- **Mercado:** 3.000+ construtoras certificadas PBQP-H no Brasil
- **Clientes iniciais:** 2 construtoras já mapeadas

## 1.5 Contexto PBQP-H

- Certificação obrigatória para acesso a financiamento bancário e programas habitacionais governamentais
- FVS (Ficha de Verificação de Serviços) é documento fundamental para auditorias
- Obra típica usa 15-25 serviços FVS
- Construtora pequena: biblioteca de ~40 FVS totais
- Construtora grande: biblioteca de ~100 FVS totais

---

# 2. MODELO DE NEGÓCIO

## 2.1 Precificação

**Modelo:** Assinatura mensal por quantidade de obras

**Plano Básico - R$ 297/mês**
- Até 5 obras simultâneas
- Usuários ilimitados
- Relatórios básicos
- Suporte por e-mail

**Plano Profissional - R$ 597/mês**
- Até 15 obras
- IA e Automações
- Relatórios avançados
- Dashboard (telão)
- Suporte prioritário

**Plano PRO - R$ 997/mês**
- Obras ilimitadas
- Todas funcionalidades
- API e integrações
- Suporte dedicado

**Trial:** 30 dias grátis sem cartão de crédito

## 2.2 Go-to-Market

- **Self-service** completo: usuário cria conta, configura tudo sozinho
- Clientes iniciais: 2 construtoras mapeadas
- Filosofia: sistema deve ser tão simples que não requer consultoria/treinamento extenso

---

# 3. PERSONAS E USUÁRIOS

## 3.1 Administrador

**Perfil:** Gerente de qualidade, engenheiro chefe ou dono da construtora.

**Responsabilidades:**
- Criar e configurar obras
- Gerenciar biblioteca de serviços (FVS)
- Cadastrar e gerenciar usuários
- Configurar integrações, alertas, automações
- Exportar relatórios de todas obras
- Gerenciar assinatura/plano

**Acesso:** Portal Web completo (Visão Global + Obras Específicas). Não usa app mobile.

**Frequência:** Alta no início (configuração), média/baixa depois (manutenção), diária para dashboards/relatórios.

**Permissões especiais:**
- ✅ Único que pode deletar verificações (com justificativa registrada)
- ✅ Ver todas obras da construtora
- ✅ Configurações globais

## 3.2 Engenheiro

**Perfil:** Engenheiro civil, responsável técnico pelas verificações em uma ou mais obras.

**Responsabilidades:**
- Fazer verificações (app mobile + portal web)
- Analisar indicadores e dashboards da obra
- Responder rapidamente a NCs (não-conformidades)
- Aprovar/reprovar verificações de inspetores (feature opcional)
- Liberar seletivamente quais inspeções inspetores podem fazer (feature opcional)
- Exportar relatórios das obras dele

**Acesso:** Portal Web (apenas obras atribuídas a ele) + App Mobile completo.

**Contexto de trabalho:** Geralmente 1 engenheiro + 2 inspetores por obra.

**Frequência:** Diária (inspeções + análise de NCs). App mobile é principal interface de trabalho.

**Permissões:**
- ✅ Fazer verificações
- ✅ Ver dashboards/relatórios das obras dele
- ❌ Não pode alterar configurações de obra
- ❌ Não pode gerenciar usuários
- ❌ Não pode deletar verificações

## 3.3 Inspetor

**Perfil:** Estagiário de engenharia, auxiliar técnico ou técnico em edificações.

**Responsabilidades:**
- Fazer verificações em campo (app mobile apenas)
- Tirar fotos de NCs
- Registrar observações

**Acesso:** **Apenas app mobile.** Não acessa portal web. Vê apenas inspeções liberadas pelo engenheiro (se feature ativa) ou todas (se não ativa).

**Frequência:** Diária (aumenta próximo a auditorias).

**Permissões:**
- ✅ Fazer verificações (mobile apenas)
- ❌ Não vê dashboards
- ❌ Não exporta relatórios

## 3.4 Almoxarife

**Perfil:** Profissional responsável pelo almoxarifado da obra. Não precisa conhecimento técnico profundo.

**Responsabilidades:**
- Visualizar Condições de Início (CI) dos serviços
- Liberar ou negar materiais baseado no status de CI
- Registrar entregas de material
- Solicitar autorização manual do engenheiro quando necessário

**Acesso:** Portal web **ultra simplificado** (apenas CI e liberações). Dispositivo fixo no almoxarifado (computador/tablet).

**Frequência:** Diária (sempre que há solicitação de material).

**Feature opcional:** Funcionalidade de CI é opcional (construtoras que têm seus próprios processos podem desativar).

## 3.5 Super Admin (Equipe Arden)

**Perfil:** Equipe técnica da Arden.

**Responsabilidades:**
- Criar/suspender/excluir contas de clientes
- Gerenciar planos e features
- Acessar contas para suporte (com log de auditoria)
- Criar/editar biblioteca global de templates PBQP-H
- Monitorar saúde do sistema

**Restrições éticas:**
- ❌ **Nunca alterar dados de verificação** (NCs, conformidades, status)
- ⚠️ Acesso a contas sempre logado (auditoria completa)
- ⚠️ Idealmente pedir autorização do cliente antes de acessar

---

# 4. ARQUITETURA DE NAVEGAÇÃO

## 4.1 Inspiração Visual: Supabase

O portal web será baseado no design system do Supabase (ferramenta open-source de backend-as-a-service).

**Razões:**
- Design system maduro (React + Tailwind CSS + Radix UI)
- Dark mode nativo (será o padrão único)
- Componentes reutilizáveis do GitHub
- Acessibilidade (WCAG)
- Estética profissional, hierarquia visual clara

## 4.2 Estrutura de Navegação

### Níveis Hierárquicos

**Nível 1: Barra Superior (56px, fixa)**
- Logo + **Seletor de Contexto** (alterna entre "Visão Global" e "Obra Específica")
- **Command Palette** (⌘K/Ctrl+K) para busca universal
- Ajuda, Configurações Rápidas, Perfil do Usuário

**Nível 2: Sidebar Primária (56px, ícones apenas)**
- Sempre visível
- Módulos principais
- Muda dinamicamente baseado no contexto

**Nível 3: Sidebar Secundária (240px, condicional)**
- Aparece quando módulo tem subdivisões
- Lista de subseções do módulo ativo
- Fundo um tom mais claro que sidebar primária (hierarquia visual)

**Nível 4: Área de Conteúdo Principal**
- Flex, ocupando espaço restante
- Scroll independente

## 4.3 Contextos de Navegação

### CONTEXTO: Visão Global (Administrador)

Seletor mostra "🌐 Visão Global".

**Sidebar Primária:**
- Home
- Dashboard Geral (comparativo entre obras)
- Gerenciar Obras
- Biblioteca FVS (serviços globais da construtora)
- Gerenciar Usuários
- Relatórios Consolidados
- Configurações (empresa, integrações, automações, alertas)
- Plano e Faturamento
- *Seção inferior:* lista rápida de obras para trocar contexto

**Módulos com Sidebar Secundária:**
- **Gerenciar Obras:** Todas Obras, Nova Obra, Empreendimentos, Comparativo
- **Biblioteca FVS:** Todos Serviços, Novo Serviço, Categorias, Importar/Exportar
- **Gerenciar Usuários:** Todos Usuários, Convidar, Por Cargo, Permissões

### CONTEXTO: Obra Específica (Engenheiro/Admin)

Seletor mostra nome da obra (ex: "Residencial Aurora - Etapa 1").

**Sidebar Primária:**
- Home (feed de NCs + KPIs)
- Dashboard (gráficos e análises)
- Verificações (gestão de inspeções)
- Serviços (FVS ativos na obra)
- Não-Conformidades (central de NCs)
- Relatórios (geração e exportação)
- Almoxarifado (visualização de CIs, se feature ativa)
- Equipe (quem tem acesso a esta obra)
- Configurações (da obra: estrutura, tags, serviços, CIs)
- *Seção inferior:* botão "Visão Global" para voltar

**Módulos com Sidebar Secundária:**
- **Verificações:** Visão Geral, Tabela (S×U), Inspeção em Massa, Histórico, Enviar p/ Inspetores
- **Serviços:** Biblioteca da Obra, Adicionar Serviços, Categorias, Condições de Início
- **Relatórios:** FVS Individual, Consolidada, RNC, Resumo Executivo, IRS, Mapa Calor, Rastreabilidade, Agendados

### CONTEXTO: Portal Almoxarife

Portal **ultra simplificado**, apenas:
- Condições de Início
- Liberações Pendentes
- Relatório de Materiais
- Configurações básicas

## 4.4 Diferenciação por Cargo

**Engenheiro:** Vê apenas obras atribuídas a ele, não tem "Visão Global".

**Administrador:** Alterna entre Visão Global e obras específicas.

**Inspetor:** Não acessa portal web (só app mobile).

**Almoxarife:** Portal ultra simplificado.

---

# 5. ESTRUTURA DE DADOS

## 5.1 Hierarquia de Obras

### Conceito: 2 Níveis Físicos + Tags Flexíveis

Após análise de diferentes cenários (loteamentos, prédios, obras pequenas), foi definida:

```
OBRA
├─ AGRUPAMENTO (obrigatório: Quadra A, Torre 1, Pavimento 2)
   └─ UNIDADES (obrigatórias: Casa A01, Apto 201)
```

**Tags (opcional):** Aplicadas aos agrupamentos para filtros/relatórios.
- Exemplos: "Etapa 1", "Financiamento Caixa", "Recursos Próprios", "Entrega Jun/25"

**Empreendimentos (opcional):** Agrupamento virtual de múltiplas obras para relatórios consolidados.

### Por que 2 Níveis?

- **Simplicidade:** Todos entendem "Obra > Grupo > Unidade"
- **Flexibilidade:** Atende 99% dos casos reais
- **Performance:** Queries mais simples

### Casos Específicos

**Loteamento Horizontal (50 casas em 3 quadras):**
- Obra: Loteamento Vista Verde
- Agrupamentos: Quadra A, Quadra B, Quadra C
- Unidades: Casa A01, A02..., B01, B02..., C01, C02...

**Prédio com 2 Torres:**
- Obra: Residencial Aurora
- Agrupamentos: Torre 1, Torre 2
- Unidades: Apto 101, 102... (torre 1), Apto 201, 202... (torre 2)

**Obra Pequena (4 casas):**
- Obra: Residencial Pequeno
- Agrupamento: "Padrão" (nome automático)
- Unidades: Casa 1, 2, 3, 4

**Obra em Etapas (usando tags):**
- Obra: Residencial Aurora
- Quadra A [tags: Etapa 1, Caixa]
- Quadra B [tags: Etapa 1, Próprio]
- Quadra C [tags: Etapa 2, Caixa]
- Permite relatórios filtrados sem criar obras separadas

### Nomenclatura Automática Inteligente

Sistema sugere padrões baseados na tipologia:
- **Loteamento:** Quadra A/B/C, Casa A01/A02...
- **Vertical:** Torre 1/2, Apto 101/102... (1º dígito = andar)
- **Simples:** Agrupamento "Padrão", Unidade 1/2/3...

Admin pode customizar completamente.

### Empreendimentos

Para múltiplas obras que precisam relatórios consolidados:
- Conceito opcional
- Múltiplas obras vinculadas a um empreendimento
- Relatórios podem ser por obra ou consolidados
- Permite selecionar quais obras incluir

Resolve casos como:
- Etapas com cronogramas diferentes
- Parte Caixa, parte Recursos Próprios (relatórios separados + consolidado)

## 5.2 Estrutura de Serviços (FVS)

### Biblioteca por Cliente

Cada construtora tem sua própria biblioteca (não compartilhada entre clientes).

**Volumetria típica:**
- Obra: 15-25 serviços ativos
- Construtora pequena: ~40 serviços total
- Construtora grande: ~100 serviços total

### Estrutura de um Serviço

**Campos Obrigatórios:**
- Código (ex: PRC-001, REJ-003)
- Nome (ex: "Portas e Janelas de Alumínio")
- Lista de itens de verificação (mínimo 1):
  - Observação (o que verificar)
  - Método (como verificar)
  - Tolerância (critério de aceitação)

**Campos Opcionais:**
- Categoria (ex: Estrutura, Acabamento, Instalações)
- Fotos de referência (correto/incorreto)
- Referência normativa (NBR, PBQP-H)
- Condições de Início (quais serviços precisam estar OK antes)

### Importação e Criação

**Criar Manualmente:** Admin cadastra item por item no portal.

**Importar Excel/CSV:** Para facilitar onboarding. Comum quando construtora contrata consultoria que fornece "pacote" de FVS prontas.

**Templates Arden (Futuro):** Biblioteca de templates PBQP-H como ponto de partida.

### Atribuição Serviços → Obras

Admin seleciona manualmente quais serviços da biblioteca se aplicam a cada obra. Pode visualizar conteúdo completo antes de adicionar.

## 5.3 Estrutura de Verificações

### Conceito

**Verificação** = Inspeção de um **Serviço** em uma **Unidade** específica.

Exemplo: "Verificação de Rejuntamento na Casa B03".

Uma verificação contém múltiplos **Itens**, cada um com status individual.

### Status de Itens

**Primeira Inspeção:**
- Não Verificado (inicial)
- Conforme ✓
- Não Conforme ✗
- Exceção ⊘ (item não se aplica naquele caso)

**Reinspeção (se item estava Não Conforme):**
- Conforme após reinspeção (nenhum retrabalho foi feito - mal entendido ou mudança de entendimento sobre a NC original)
- Retrabalho (correção foi necessária e realizada - alimenta KPI IRS)
- Aprovado com concessão (aceito com defeito menor)
- Reprovado após retrabalho (tentaram corrigir mas continua errado)

### Dados de uma Verificação

- ID único
- Obra + Agrupamento + Unidade
- Serviço
- Data/hora de criação
- Inspetor responsável
- Status geral (Pendente, Concluída, Com NC)
- Lista de itens com status individual
- Para cada NC:
  - Observação obrigatória (até 1000 chars)
  - Até 5 fotos (com timestamp automático: obra, data, hora, inspetor)
  - Histórico de reinspeções

### Imutabilidade e Auditoria

Verificações são **imutáveis** após salvas. Não podem ser editadas, apenas excluídas (somente por Admin, com justificativa registrada em log).

Garante rastreabilidade completa para auditorias PBQP-H.

---

# 6. APP MOBILE - VERIFICAÇÕES

## 6.1 Visão Geral

Interface principal para Engenheiros e Inspetores em campo.

**Características Essenciais:**
- ✅ **Offline-first:** Funciona completamente sem internet
- ✅ **Sincronização automática:** Ao detectar Wi-Fi/dados móveis
- ✅ **Gestos naturais:** Swipe esquerda/direita
- ✅ **Feed vertical:** Scroll infinito com containers
- ✅ **Feedback multissensorial:** Vibração + som ao marcar item

**Plataformas:**
- MVP: Android (React Native)
- Fase 2: iOS

## 6.2 Fluxo de Seleção de Verificações

1. Usuário entra na aba "Verificações"
2. Se tiver mais de uma obra, seleciona a obra
3. Escolhe modo de seleção:

**MODO A: Serviço → Unidades**
- Seleciona um serviço (ex: Rejuntamento)
- Marca múltiplas unidades (ex: B01, B02, B03, B04, B05)
- Sistema gera 5 verificações (Rejuntamento em cada casa)

**MODO B: Unidade → Serviços**
- Seleciona uma unidade (ex: Casa B15)
- Marca múltiplos serviços (ex: Pintura, Rejuntamento, Alvenaria)
- Sistema gera 3 verificações (cada serviço na casa B15)

4. **Filtro de status** (padrão: "Não Avaliado"):
   - Não Avaliado: mostra apenas itens virgens (uso diário)
   - Não Conforme: mostra apenas itens com NC aberta (para reinspeção)
   - Todos: mostra tudo (raro)

5. Clica "Iniciar Verificações"

## 6.3 Interface Feed de Verificações

Usuário vê **feed vertical** com **containers** representando cada verificação.

**Características:**
- **Scroll vertical livre:** Pode pular para qualquer verificação
- **Containers dinâmicos:** Encolhem conforme itens são verificados
- **Containers somem:** Quando todos itens verificados (independente de NC ou não)
- **Liberdade de ordem:** Decide qual fazer primeiro
- **Botão UNDO:** Toast temporário aparece por 5s após cada ação

## 6.4 Gestos de Verificação

### Swipe Direita → Conforme ✓

1. Item desliza para fora (animação 300ms)
2. Ícone ✓ verde aparece e fade out (200ms)
3. Vibração curta (haptic feedback)
4. Som: "ding" suave (configurável)
5. Container ajusta altura automaticamente
6. Item desaparece

**Filosofia:** Ação rápida, feedback imediato, sem telas intermediárias.

### Swipe Esquerda → Não Conforme ✗ ou Exceção ⊘

1. Item desliza revelando dois botões:
   - [❌ Não Conforme]
   - [⊘ Exceção]
2. Usuário escolhe

**Se "Exceção":** Item some imediatamente (som neutro).

**Se "Não Conforme":** Abre modal de NC (ver 6.5).

## 6.5 Modal de Não-Conformidade

**Campo Observação (obrigatório):**
- Limite 1000 caracteres
- Teclado abre automaticamente
- **Sugestões rápidas** (chips clicáveis): frases pré-definidas por serviço, configuráveis pelo Admin
  - Exemplo Rejuntamento: "Junta suja", "Resíduos", "Úmido"
  - Ao clicar, texto é **adicionado** ao campo (permite combinação)

**Fotos (opcional, até 5):**
- Botão "+ Tirar foto" abre câmera diretamente
- Após tirar: preview com [✓ Usar] [↻ Tirar novamente]
- Foto tem **timestamp automático sobreposto** (obra, data, hora, inspetor)
- Contador visual: "Fotos 2/5"

**Botões finais:**
- [Cancelar]: Item volta como "não verificado", nada salvo
- [Salvar NC]: Registra NC, item some do feed, salva no banco local

## 6.6 Visualização Detalhada de Item

Ícone [i] ao lado do item abre tela fullscreen com:
- O que verificar (observação completa)
- Método (como verificar)
- Tolerância (critério de aceitação)
- Fotos de referência (correto/incorreto, se disponível)
- Norma técnica (NBR, PBQP-H, se disponível)

**Barra fixa inferior:** [✓ Conforme] [⊘ Exceção] [✗ NC]

**Navegação:** Sempre volta ao feed após ação (não navega entre itens dentro dessa tela).

**Propósito:** Ajuda inspetores novatos ou quando há dúvida. Inspetores experientes usam direto o swipe.

## 6.7 Reinspeção de Não-Conformidades

1. Na seleção, usuário muda filtro para "Não Conforme"
2. Sistema mostra apenas itens com NC aberta
3. Feed aparece apenas com esses itens (formato idêntico)
4. Ao swipe direita (item corrigido), aparece submenu:
   - ✓ Conforme após reinspeção
   - ⚙️ Retrabalho (aprovado mas custou caro corrigir)
   - ⚠️ Aprovado com concessão (aceito com defeito)
   - ✗ Reprovado após retrabalho (continua errado)

5. Se "Reprovado", item volta para fila de NC (pode reinspecionar quantas vezes necessário)

## 6.8 Sincronização Offline

### Salvamento Local

**Cada swipe = save instantâneo no SQLite local**
- Se app crashar, progresso preservado
- Verificações parciais mantidas

**Conflict Resolution:**
Se 2 inspetores verificam mesma unidade+serviço offline:
- **Vale a verificação mais antiga** (timestamp de criação)
- A mais recente é descartada ou marcada como "tentativa de duplicação"

### Sincronização Automática

**Triggers:**
- Detecta Wi-Fi ou dados móveis
- Tenta a cada 30min quando online
- Botão manual "Sincronizar agora" na home

**Indicador na Home:**
"☁️ 7 verificações aguardando sincronização" (permanente)

**Falha:**
Se não conseguir, exibe mensagem mas não bloqueia uso:
"Não foi possível sincronizar. Tentaremos automaticamente."

**Instrução ao Usuário (Onboarding):**
"💡 Dica: Conecte-se ao Wi-Fi ao final de cada turno para enviar suas verificações."

## 6.9 Configurações do App

Acessível via aba "Perfil" ou ícone engrenagem:

**Notificações:**
- NCs atribuídas a mim
- Aprovação de verificações

**Sons:**
- Som ao marcar Conforme (ativado padrão)
- Som ao marcar NC (desativado padrão)

**Vibração:**
- Feedback tátil (ativado padrão)

**Fotos:**
- Qualidade (Alta, Média, Baixa)

**Sincronização:**
- Wi-Fi apenas (economia dados)
- Wi-Fi + Dados móveis

**Conta:**
- Ver perfil, trocar senha, sair

---

# 7. PORTAL WEB - OBRA ESPECÍFICA

## 7.1 Home do Engenheiro

**Propósito:** Centro de comando, primeira tela ao abrir portal. Foco em ação imediata.

**Elementos:**

**1. Feed de NCs (prioridade máxima):**
- Últimas 2-3 NCs abertas
- Para cada: Unidade, Serviço, Item, Observação resumida, Tempo desde abertura
- Botão [Ver Detalhes]
- Atualização tempo real
- Botão "Ver todas (5) →"

**2. KPIs em Cards:**
- Taxa de Conformidade Geral (% itens OK no primeiro check)
- IRS - Índice de Retrabalho por Serviço (% itens que precisaram retrabalho)
- Verificações Pendentes (número)
- Verificações Concluídas (número)

**3. Gráfico de Evolução Temporal:**
- Linha do tempo: taxa de conformidade últimos 30 dias
- Permite ver se obra está melhorando/piorando

**4. Feed de Atividade Recente:**
- Log últimas 5-10 ações da equipe
- Ex: "João Silva verificou Rejuntamento B05 (1h atrás)"

**Propósito:** Engenheiro abre portal e em 5 segundos sabe:
1. Quais problemas surgiram (NCs)
2. Saúde geral (KPIs)
3. Tendência (gráfico)
4. O que equipe está fazendo

## 7.2 Dashboard

**Propósito:** Análise visual profunda com múltiplos gráficos.

**Gráficos Disponíveis:**
- Taxa conformidade por serviço (barras horizontais)
- Evolução temporal (linha)
- Top 5 NCs recorrentes (pizza/barras)
- Unidades problemáticas (tabela ranqueada)
- Comparativo entre agrupamentos (barras)

**Filtros:**
- Período (última semana, mês, trimestre, customizado)
- Serviços específicos
- Agrupamentos
- Tags

**Exportação:** Botão "Exportar PDF" gera relatório visual.

## 7.3 Verificações

### Subseção: Tabela Serviços × Unidades

**Interface:** Matriz onde linhas = serviços, colunas = unidades. Cada célula = verificação.

**Legenda:**
- ✓ Conforme (verde)
- ✗ NC Aberta (vermelho)
- ○ Não Verificado (cinza)
- ⚙️ Retrabalho (laranja)

**Interações:**
- Click individual em célula: seleciona
- Click em cabeçalho de coluna: seleciona todas unidades daquele serviço
- Click em cabeçalho de linha: seleciona todos serviços daquela unidade
- Drag para seleção múltipla

**Ações em Lote (dropdown):**
- Marcar Conforme (modal observação única, sem fotos)
- Marcar NC (modal observação única, sem fotos)
- Enviar para Inspetor
- Ver Detalhes

**Filtros:**
- Status (todos, conforme, NC, não verificado)
- Serviço específico
- Agrupamento
- Tags

### Subseção: Inspeção em Massa

**Propósito:** Verificar rapidamente múltiplas unidades idênticas (ex: 10 casas geminadas com layout igual).

**Fluxo:**
1. Seleciona serviço (ex: Rejuntamento)
2. Seleciona múltiplas unidades (ex: B01 a B10)
3. Clica "Iniciar Inspeção"
4. Interface formulário: checkboxes [Conforme] [NC] para cada item
5. Campo observação única (se houver NC)
6. Salva: cria 10 verificações idênticas

**Limitação:** Não permite fotos. Se precisa fotos, usar app mobile ou individual.

### Subseção: Histórico de Verificações

**Interface:** Tabela com todas verificações já realizadas.

**Colunas:** Data/Hora, Inspetor, Serviço, Unidade, Status Final

**Funcionalidades:**
- Busca por texto
- Filtros (período, inspetor, serviço, status)
- Click em linha: modal com detalhes completos (itens, fotos, observações)

### Subseção: Enviar para Inspetores

**Propósito:** Feature opcional. Permite engenheiro liberar seletivamente verificações para cada inspetor.

**Fluxo:**
1. Seleciona verificações (da tabela ou manual)
2. Escolhe inspetor
3. Adiciona instruções opcionais
4. Envia

**Resultado:**
- Inspetor vê no app apenas essas verificações
- Outras ficam ocultas
- Engenheiro recebe notificação quando inspetor finalizar

**Desativação:** Se feature não ativa, inspetores veem todas verificações.

## 7.4 Serviços

### Subseção: Biblioteca da Obra

**Interface:** Tabela listando serviços ativos na obra.

**Colunas:** Código, Nome, Qtd Itens

**Ações:** [👁️ Visualizar] [✏️ Editar] [🗑️ Remover]

- **Visualizar:** Modal mostrando todos itens (observação, método, tolerância, fotos referência, normas)
- **Editar:** Permite ajustes (se Admin)
- **Remover:** Desativa serviço nesta obra (não deleta da biblioteca global)

### Subseção: Adicionar Serviços

**Interface:** Lista serviços da biblioteca global não ativos nesta obra.

**Funcionalidades:**
- Busca por nome/código
- Checkbox múltipla
- Botão [👁️] para visualizar conteúdo antes de adicionar
- Botão "Adicionar Selecionados"

**Propósito:** Engenheiro adiciona serviços conforme necessidade (ex: descobriu que precisa impermeabilização).

### Subseção: Condições de Início

**Propósito:** Configurar dependências entre serviços (feature opcional).

**Interface:**
- Dropdown seleciona serviço
- Checkboxes listam outros serviços
- Marca quais precisam estar "Conforme" antes deste poder iniciar

**Granularidade (opcional):**
Marcar itens específicos como "CI crítica" (ex: Rejuntamento, apenas "Limpeza das juntas" bloqueia).

**Comportamento:**
- Se CI não atendida: Almoxarife vê "Bloqueado", não libera material
- Engenheiro pode autorizar manualmente (casos excepcionais)

## 7.5 Não-Conformidades

**Propósito:** Central de gestão de NCs. Todas NCs da obra em um só lugar.

**Interface:**
Lista de NCs em cards:
- Status visual (🔴 Aberta, 🟡 Retrabalho, 🟢 Fechada)
- Unidade + Serviço + Item
- Observação (texto resumido)
- Inspetor responsável
- Tempo desde abertura
- Indicador fotos (📷 2 fotos)
- Botões: [Ver Detalhes] [Marcar Reinspecionada]

**Filtros:**
- Status (Abertas, Fechadas, Retrabalho, Todas)
- Serviço
- Unidade/Agrupamento
- Inspetor
- Período

**Exportação:** "Exportar Relatório de NCs" gera PDF com NCs filtradas.

**Detalhes da NC (Modal):**
- Unidade, Serviço, Item
- Status atual
- Data/hora abertura
- Inspetor
- Observação completa
- Fotos (visualizador com zoom)
- Histórico:
  - Data abertura
  - Reinspeções (se houver)
  - Status em cada reinspeção
  - Quem fez

**Ações:** [Fechar modal] [Marcar Reinspecionada]

## 7.6 Relatórios

**Propósito:** Gerar e exportar relatórios em PDF e Excel.

**Interface Principal:**
- **Seleção de Relatório:** Dropdown listando tipos disponíveis
- **Escopo:** Obra completa ou Filtrar por tags
- **Período:** Dropdown com opções comuns ou customizado
- **Botões:** [📄 Gerar PDF] [📊 Gerar Excel]

**Relatórios Agendados:** Link para subseção onde Admin configura envios automáticos.

## 7.7 Almoxarifado

**Propósito:** Visualizar status de CIs e solicitações pendentes (funcionalidade disponível apenas se feature CI ativa).

**Interface:** Tabela com:
- Serviço
- Unidade
- Status CI (✓ Liberado, ✗ Bloqueado, ⚠️ Autorização Pendente)
- Status Almoxarife (Material Entregue, Aguardando CI, Aguardando Autorização)

**Filtros:** Status, Serviço, Unidade

**Funcionalidade:** Engenheiro vê visão geral de liberações/bloqueios. Pode intervir autorizando manualmente quando necessário.

**Relatório:** Botão para gerar "Relatório de Rastreabilidade de Materiais".

## 7.8 Equipe

**Propósito:** Visualizar quem tem acesso a esta obra específica.

**Interface:** Lista de usuários com:
- Nome
- Cargo
- E-mail
- Nível de acesso

**Nota:** Engenheiro não pode adicionar/remover usuários (apenas visualizar). Somente Admin tem essa permissão.

## 7.9 Configurações (da Obra)

**Propósito:** Ajustes específicos desta obra.

**Seções:**

**Informações da Obra:**
- Nome, tipologia, responsável técnico, endereço (opcionais)

**Tags e Agrupamentos:**
- Gerenciar tags aplicadas aos agrupamentos
- Criar/editar/remover agrupamentos e unidades

**Serviços Ativos:**
- Link para "Serviços" (Biblioteca da Obra)

**Condições de Início:**
- Toggle ativar/desativar feature
- Link para configuração de CIs por serviço

**Equipe da Obra:**
- Link para "Equipe" (visualização de membros)

---

# 8. PORTAL WEB - VISÃO GLOBAL

## 8.1 Home (Visão Global)

**Propósito:** Visão geral de toda a construtora.

**Elementos:**

**Métricas Consolidadas (cards):**
- Total de Obras Ativas
- Total de Usuários
- Total de Verificações (este mês)
- Total de NCs Abertas

**Obras Ativas (lista com cards):**
- Cada obra: Nome, Progresso (%), Botão [Abrir] (muda contexto)
- Botão "+ Nova Obra"

**Ações Rápidas (links):**
- Convidar novo usuário
- Criar nova obra
- Ver relatório consolidado

## 8.2 Dashboard Geral

**Propósito:** Comparar performance entre múltiplas obras.

**Gráficos:**
- Comparativo de Progresso por Obra (barras)
- Taxa de Conformidade por Obra (radar/barras)
- Ranking de Obras por Performance (tabela)

**Filtros:** Período, Obras específicas

## 8.3 Gerenciar Obras

### Subseção: Todas as Obras

**Interface:** Tabela com todas as obras.

**Colunas:** Nome, Nº Unidades, Progresso (%)

**Ações:** [👁️ Abrir] [✏️ Editar]

**Busca e filtros.**

### Subseção: Nova Obra

**Wizard de 3 Passos:**

**Passo 1: Essencial (obrigatório)**
- Nome da obra
- Tipologia (Residencial Horizontal/Vertical, Comercial, Retrofit, Outro)
- Responsável técnico (opcional)
- Endereço (opcional)

**Passo 2: Estrutura de Unidades (obrigatório)**
- Adicionar agrupamentos (ex: Quadra A, B, C)
- Para cada agrupamento:
  - Nome
  - Quantidade de unidades
  - Padrão de nomenclatura (ex: A##)
- Sistema mostra total de unidades
- Nomenclatura automática baseada em tipologia (editável)

**Passo 3: Extras (opcional, pode pular)**
- Vincular a empreendimento (existente ou criar novo)
- Aplicar tags aos agrupamentos
- Sugestões de tags comuns: Etapa 1, Financiamento Caixa, Recursos Próprios

**Conclusão:** Obra criada, Admin pode ir para ela imediatamente ou voltar para lista.

### Subseção: Empreendimentos

**Interface:** Lista de empreendimentos (agrupamentos virtuais de obras).

**Para cada empreendimento:**
- Nome
- Obras vinculadas (lista)
- Botões: [Ver Consolidado] [Editar]

**Funcionalidade:** Permite gerar relatórios consolidados de múltiplas obras (ex: Etapa 1 + Etapa 2).

## 8.4 Biblioteca FVS

### Subseção: Todos os Serviços

**Interface:** Tabela com todos os serviços cadastrados.

**Colunas:** Código, Nome, Nº Itens

**Ações:** [👁️ Visualizar] [✏️ Editar] [🗑️ Deletar]

**Busca e filtros** (por categoria, código, nome).

### Subseção: Novo Serviço

**Formulário:**

**Campos Obrigatórios:**
- Código
- Nome do Serviço

**Itens de Verificação (mínimo 1):**
Para cada item:
- Observação (o que verificar) *
- Método (como verificar) *
- Tolerância (critério de aceitação) *
- Fotos de Referência (opcional): upload foto correta e incorreta
- Referência Normativa (opcional): texto livre para NBR, PBQP-H, etc

Botão "+ Adicionar Item" para criar mais itens.

**Campos Opcionais do Serviço:**
- Categoria (dropdown: Estrutura, Acabamento, Instalações, outro)

**Salvar:** Adiciona serviço à biblioteca, disponível para ser atribuído a obras.

### Subseção: Importar FVS

**Propósito:** Facilitar onboarding com importação em massa.

**Fluxo:**
1. Download template Excel
2. Cliente preenche (ou usa arquivo de consultoria)
3. Upload do arquivo
4. Sistema preview dos dados lidos
5. Confirmação: importa todos de uma vez

### Subseção: Exportar Templates

**Propósito:** Backup ou compartilhamento de biblioteca.

**Fluxo:**
- Seleciona serviços
- Exporta para Excel
- Pode importar em outra conta

## 8.5 Gerenciar Usuários

### Subseção: Todos os Usuários

**Interface:** Tabela listando todos os usuários.

**Colunas:** Nome, E-mail, Cargo (Admin, Engenheiro, Inspetor, Almoxarife)

**Ações:** [✏️ Editar] [🗑️ Remover]

**Busca e filtros** (por cargo).

### Subseção: Convidar Usuário

**Formulário:**
- Nome completo
- E-mail
- Cargo (radio buttons: Admin, Engenheiro, Inspetor, Almoxarife)
- Acesso às obras:
  - Todas as obras (padrão Admin)
  - Obras específicas (checkboxes, comum Engenheiro/Inspetor)
- Permissões especiais (opcionais):
  - Pode deletar verificações
  - Pode exportar relatórios

**Fluxo após envio:**
1. Sistema envia e-mail
2. Link de ativação (válido 7 dias)
3. Usuário clica, cria senha
4. Entra direto com permissões definidas

## 8.6 Relatórios Consolidados

**Propósito:** Gerar relatórios agregando múltiplas obras.

**Interface:**
- **Tipo de Relatório:** Dropdown com opções
- **Obras Incluídas:** Checkboxes, permite selecionar quais incluir
- **Período:** Dropdown com opções comuns
- **Botões:** [📄 Gerar PDF] [📊 Gerar Excel]

## 8.7 Configurações (Globais)

### Subseção: Dados da Empresa

**Campos:**
- Logo (upload, usado em relatórios/cabeçalhos)
- Nome Fantasia
- Razão Social
- CNPJ
- Endereço Completo
- Telefone
- E-mail Corporativo

**Uso:** Aparecem em todos relatórios gerados, cabeçalhos de e-mails automáticos, etc.

### Subseção: Integrações

**SMTP (E-mail):**
- Configuração de servidor SMTP para envio de relatórios automáticos
- Botão "Testar Envio"

**Webhooks (Futuro):**
- Integração com outros sistemas
- Admin adiciona URLs para receber eventos

**API Externa (Futuro):**
- Documentação de API pública

### Subseção: Automações

**Relatórios Agendados:**

Lista de automações configuradas. Para cada:
- Destinatário(s) (e-mail)
- Frequência (diária, semanal, mensal)
- Dia/horário específico
- Escopo (obra, tag, todas obras)
- Tipo de relatório
- Status (ativo/inativo)
- Ações: [Editar] [Excluir]

**Botão "+ Nova Automação":** formulário para configurar.

**Exemplo:** "Todo dia 5 do mês, enviar FVS Consolidada filtrada por tag 'Financiamento Caixa' para auditoria@caixa.gov.br"

### Subseção: Alertas

**Configuração de Triggers:**

Lista de alertas configurados. Para cada:
- Condição (ex: "Taxa de NC > 20%", "Retrabalho > 3x no mesmo item")
- Destinatários (quais usuários receberão)
- Canal (e-mail, notificação app, ambos)
- Status (ativo/inativo)
- Ações: [Editar] [Excluir]

**Botão "+ Novo Alerta":** formulário para criar.

**Alertas Pré-Definidos Sugeridos:**
- Taxa de NC acima de X%
- Serviço com retrabalho recorrente (>3x)
- Verificação pendente há mais de X dias

## 8.8 Plano e Faturamento

**Informações do Plano Atual:**
- Nome do plano (Básico, Profissional, PRO, Trial)
- Valor mensal
- Data de renovação
- Uso atual (obras ativas X de limite, usuários X de ∞)

**Ações:**
- [Alterar Plano]: comparativo de planos, permite upgrade/downgrade
- [Histórico de Pagamentos]: lista faturas pagas

**Método de Pagamento:**
- Cartão cadastrado (últimos 4 dígitos)
- [Atualizar Cartão]

**Histórico de Pagamentos:**
- Data, Valor, Status (✓ Pago, ⚠️ Pendente, ✗ Falhou)
- [Baixar Nota Fiscal]

---

# 9. PORTAL DO ALMOXARIFE

O Portal do Almoxarife é interface **ultra simplificada** focada exclusivamente em Condições de Início e liberação de materiais. Disponível apenas se feature "Condições de Início" está ativa.

## 9.1 Conceito

Quando empreiteiro solicita material (ex: rejunte para Casa B03), almoxarife consulta sistema:
- **Se CI aprovada** (piso/revestimento OK) → Libera material e registra entrega
- **Se CI bloqueada** (piso não aprovado) → Nega material OU solicita autorização do engenheiro

## 9.2 Tela Principal: Condições de Início

**Tabela:**
- Serviço
- Unidade
- Status CI (✓ Liberado, ✗ Bloqueado, ⚠️ Pendente de Autorização)
- Ação (botões: [Entregar Material] ou [Solicitar Autorização])

**Filtros:**
- Busca por serviço, unidade
- Status (Todos, Liberados, Bloqueados, Pendentes)

**Legenda Visual:**
- ✓ Verde: pode liberar
- ✗ Vermelho: não pode liberar
- ⚠️ Amarelo: aguardando resposta do engenheiro

## 9.3 Fluxos

### Fluxo 1: Entregar Material (CI Liberada)

**Ação:** Almoxarife clica [Entregar Material]

**Modal:**
- Serviço: Rejuntamento (pré-preenchido)
- Unidade: B01 (pré-preenchido)
- Empreiteiro: campo de texto
- Quantidade: campo de texto
- Observações: campo opcional

**Confirmação:** Salva registro com timestamp + almoxarife responsável

**Resultado:**
- Status muda para "Material Entregue"
- Aparece no Relatório de Rastreabilidade de Materiais
- Engenheiro pode consultar quando quiser

### Fluxo 2: Solicitar Autorização (CI Bloqueada)

**Ação:** Almoxarife clica [Solicitar Autorização]

**Modal:**
- Serviço + Unidade (pré-preenchidos)
- Motivo da solicitação: campo obrigatório (ex: "Empreiteiro promete terminar piso hoje ainda")

**Confirmação:** Envia notificação ao engenheiro

**Resultado:**
- Status muda para "⚠️ Pendente de Autorização"
- Engenheiro recebe notificação no app e portal web
- Engenheiro pode aprovar ou negar

**Se engenheiro aprovar:**
- Status volta para "✓ Liberado"
- Almoxarife pode clicar [Entregar Material]

**Se engenheiro negar:**
- Status volta para "✗ Bloqueado"
- Almoxarife não pode liberar

## 9.4 Sidebar do Almoxarife

**Itens:**
- 📦 Condições de Início (tela principal)
- 📋 Liberações Pendentes (filtro pré-aplicado mostrando apenas "⚠️ Pendente")
- 📊 Relatório de Materiais (gera relatório rastreabilidade)
- ⚙️ Configurações (ajustes básicos de perfil)

**Nota:** Interface extremamente simples, sem acesso a verificações, dashboards ou outras funcionalidades.


---

# 10. RELATÓRIOS E AUTOMAÇÕES

## 10.1 Visão Geral

O sistema ARDEN FVS oferece relatórios estratégicos para diferentes públicos: desde documentos obrigatórios para auditoria PBQP-H até dashboards executivos para tomada de decisão. Os relatórios são organizados em 4 categorias:

1. **Relatórios Operacionais** - Dia a dia (FVS, RNC)
2. **Relatórios Estratégicos** - Tomada de decisão (Dashboard Executivo)
3. **Relatórios de Accountability** - Performance de equipes (Eficiência de Correção)
4. **Relatórios Preditivos** - IA/Análise Avançada (Plano PRO)

### 10.1.1 Priorização por Fase

| Fase | Relatórios |
|------|------------|
| **MVP** | FVS por Grupo de Unidades, RNC, Dashboard Executivo, Eficiência de Correção |
| **Fase 2** | Relatório de Tendências (análise estatística) |
| **Plano PRO** | Análise Preditiva de NCs (Machine Learning) |

---

## 10.2 Modelo de Status (Referência para Relatórios)

### 10.2.1 Status de ITEM (granular)

**Primeira Inspeção:**
| Status | Descrição | Ícone |
|--------|-----------|-------|
| Não Verificado | Estado inicial, aguardando avaliação | ⬜ |
| Conforme | Atende aos critérios de qualidade | ✅ |
| Não Conforme | Problema identificado → requer foto + observação | ❌ |
| Exceção | Não se aplica ao contexto da unidade | ⚪ |

**Reinspeção (somente itens que eram NC):**
| Status | Descrição | Impacta IRS? |
|--------|-----------|--------------|
| Conforme após reinspeção | Não havia problema real, sem retrabalho executado | Não |
| Retrabalho | Correção foi executada | **Sim** |
| Aprovado com concessão | Defeito tolerável aceito | Não |
| Reprovado após retrabalho | Correção insuficiente, problema persiste → loop continua | Não (até resolver) |

### 10.2.2 Status de VERIFICAÇÃO (nível serviço + unidade)
| Status | Descrição |
|--------|-----------|
| Pendente | Ainda há itens não verificados |
| Concluída | Todos os itens verificados (sem NCs abertas) |
| Com NC | Possui não-conformidades aguardando resolução |

### 10.2.3 Fórmula IRS (Índice de Retrabalho por Serviço)

```
IRS = (Itens com status "Retrabalho" / Total de Itens Verificados) × 100
```

**Interpretação:**
- IRS < 10%: 🟢 Saudável
- IRS 10-15%: 🟡 Atenção
- IRS > 15%: 🔴 Crítico

---

## 10.3 Relatórios MVP

### 10.3.1 FVS por Grupo de Unidades

**Propósito:** Documento oficial para auditoria PBQP-H. Checklist completo de verificação de serviço.

**Público:** Auditor externo, Engenheiro

**Formato:** PDF

**Geração:** Sob demanda

**Seleção:** Usuário escolhe:
- Obra inteira OU
- Unidades específicas (seleção múltipla)

**Estrutura do PDF:**

```
┌─────────────────────────────────────────────────────────┐
│ CABEÇALHO                                               │
│ ─────────────────────────────────────────────────────── │
│ Logo Construtora | Obra: [Nome da Obra]                 │
│ Serviço: [Nome do Serviço FVS]                          │
│ Data de emissão: [DD/MM/AAAA]                           │
│ Unidades: [Lista ou "Todas"]                            │
│ Total de unidades: [N]                                  │
├─────────────────────────────────────────────────────────┤
│ RESUMO                                                  │
│ ─────────────────────────────────────────────────────── │
│ Total de itens: [N]                                     │
│ Conformes: [N] | Não Conformes: [N] | Exceções: [N]     │
│ Taxa de conformidade: [X]%                              │
│ IRS do serviço: [X]%                                    │
├─────────────────────────────────────────────────────────┤
│ TABELA DE VERIFICAÇÃO                                   │
│ ─────────────────────────────────────────────────────── │
│ Unidade | Item                  | Status    | Inspetor  │
│ ────────┼───────────────────────┼───────────┼───────────│
│ B01     │ [Nome do item 1]      │ ✅ Conf.  │ [Nome]    │
│ B01     │ [Nome do item 2]      │ ❌ NC     │ [Nome]    │
│ B01     │ [Nome do item 3]      │ ⚪ Exceção│ [Nome]    │
│ B02     │ [Nome do item 1]      │ ✅ Conf.  │ [Nome]    │
│ ...     │ ...                   │ ...       │ ...       │
├─────────────────────────────────────────────────────────┤
│ DETALHAMENTO DE NÃO CONFORMIDADES                       │
│ ─────────────────────────────────────────────────────── │
│                                                         │
│ NC #[ID]: Unidade [X] - [Nome do Item]                  │
│ Inspetor: [Nome] | Data: [DD/MM/AAAA HH:MM]             │
│ Observação: [Texto da observação]                       │
│ [FOTO COM WATERMARK]                                    │
│ Status atual: [Aguardando reinspeção / Retrabalho /     │
│               Conforme após reinspeção / etc.]          │
│                                                         │
│ Histórico de reinspeções (se houver):                   │
│   - [DD/MM/AAAA]: [Status] por [Inspetor]               │
│   - [DD/MM/AAAA]: [Status] por [Inspetor]               │
│                                                         │
│ [Repete para cada NC]                                   │
├─────────────────────────────────────────────────────────┤
│ RODAPÉ                                                  │
│ Gerado por ARDEN FVS em [DD/MM/AAAA] às [HH:MM]         │
│ Página [X] de [Y]                                       │
└─────────────────────────────────────────────────────────┘
```

**Watermark nas Fotos:**
- Nome da Obra
- Data e Hora da foto
- Nome do Inspetor
- Coordenadas GPS

---

### 10.3.2 RNC - Relatório de Não Conformidades

**Propósito:** Visão consolidada de todas as não conformidades da obra para gestão e correção.

**Público:** Engenheiro, Mestre de obras

**Formato:** PDF

**Geração:**
- Sob demanda (com filtros)
- Automático semanal (segunda-feira, 7h)

**Filtros disponíveis:**
- Por obra
- Por período (data início/fim)
- Por serviço
- Por status (abertas / resolvidas / todas)
- Por agrupamento de unidades

**Estrutura do PDF:**

```
┌─────────────────────────────────────────────────────────┐
│ CABEÇALHO                                               │
│ ─────────────────────────────────────────────────────── │
│ Relatório de Não Conformidades                          │
│ Obra: [Nome da Obra]                                    │
│ Período: [DD/MM/AAAA] a [DD/MM/AAAA]                    │
│ Filtros aplicados: [Lista de filtros]                   │
│ Gerado em: [DD/MM/AAAA] às [HH:MM]                      │
├─────────────────────────────────────────────────────────┤
│ RESUMO EXECUTIVO                                        │
│ ─────────────────────────────────────────────────────── │
│ NCs abertas: [N]                                        │
│ NCs resolvidas no período: [N]                          │
│ Tempo médio de resolução: [X.X] dias                    │
│ NC mais antiga aberta: [N] dias                         │
│   ([Unidade] - [Serviço])                               │
├─────────────────────────────────────────────────────────┤
│ NCs POR SERVIÇO                                         │
│ ─────────────────────────────────────────────────────── │
│ [Serviço 1]............... [N] NCs ([X]%)               │
│ [Serviço 2]............... [N] NCs ([X]%)               │
│ [Serviço 3]............... [N] NCs ([X]%)               │
│ [Serviço 4]............... [N] NCs ([X]%)               │
│ [Serviço 5]............... [N] NCs ([X]%)               │
├─────────────────────────────────────────────────────────┤
│ NCs POR AGRUPAMENTO                                     │
│ ─────────────────────────────────────────────────────── │
│ [Agrupamento 1]........... [N] NCs                      │
│ [Agrupamento 2]........... [N] NCs                      │
│ [Agrupamento 3]........... [N] NCs                      │
├─────────────────────────────────────────────────────────┤
│ LISTA DETALHADA DE NCs ABERTAS                          │
│ ─────────────────────────────────────────────────────── │
│ (Ordenadas por tempo aberta, da mais antiga para mais   │
│ recente)                                                │
│                                                         │
│ NC #[ID] - CRÍTICA ([N] dias aberta)                    │
│ Unidade: [X] | Serviço: [Nome]                          │
│ Item: [Nome do item]                                    │
│ Inspetor: [Nome] | Data: [DD/MM/AAAA]                   │
│ Observação: [Texto]                                     │
│ [FOTO COM WATERMARK]                                    │
│ Histórico:                                              │
│   - [DD/MM/AAAA]: Reinspeção → [Status]                 │
│   - [DD/MM/AAAA]: Reinspeção → [Status]                 │
│                                                         │
│ [Repete para cada NC aberta]                            │
├─────────────────────────────────────────────────────────┤
│ NCs RESOLVIDAS NO PERÍODO                               │
│ ─────────────────────────────────────────────────────── │
│ NC #[ID] | [Serviço] | [Status final] | Resolvida em    │
│          |           |                | [N] dias        │
│ NC #[ID] | [Serviço] | [Status final] | [N] dias        │
│ ...                                                     │
├─────────────────────────────────────────────────────────┤
│ RODAPÉ                                                  │
│ Gerado por ARDEN FVS em [DD/MM/AAAA] às [HH:MM]         │
│ Página [X] de [Y]                                       │
└─────────────────────────────────────────────────────────┘
```

**Watermark nas Fotos:** (mesmo padrão do FVS)
- Nome da Obra
- Data e Hora da foto
- Nome do Inspetor
- Coordenadas GPS

---

### 10.3.3 Dashboard Executivo

**Propósito:** Visão consolidada de TODAS as obras da construtora para tomada de decisão estratégica.

**Público:** Proprietário da construtora, Diretoria

**Formato:** PDF (visual) + Excel (dados brutos)

**Geração:**
- Sob demanda
- Automático mensal (dia 1, 8h)

**Estrutura do PDF:**

```
┌─────────────────────────────────────────────────────────┐
│ DASHBOARD EXECUTIVO - [MÊS/ANO]                         │
│ [Nome da Construtora]                                   │
│ Gerado em: [DD/MM/AAAA] às [HH:MM]                      │
├─────────────────────────────────────────────────────────┤
│ VISÃO GERAL MULTI-OBRAS                                 │
│ ─────────────────────────────────────────────────────── │
│ Obras ativas: [N]                                       │
│ Total de unidades: [N]                                  │
│ Verificações concluídas (mês): [N]                      │
│ Taxa de conformidade global: [X]%                       │
│ IRS médio: [X]%                                         │
├─────────────────────────────────────────────────────────┤
│ RANKING DE OBRAS                                        │
│ ─────────────────────────────────────────────────────── │
│ Status │ Obra                    │ Progresso │ NCs │ IRS│
│ ───────┼─────────────────────────┼───────────┼─────┼────│
│ 🟢     │ [Obra 1]                │ [X]%      │ [N] │[X]%│
│ 🟢     │ [Obra 2]                │ [X]%      │ [N] │[X]%│
│ 🟡     │ [Obra 3]                │ [X]%      │ [N] │[X]%│
│ 🔴     │ [Obra 4]                │ [X]%      │ [N] │[X]%│
│                                                         │
│ Legenda:                                                │
│ 🟢 Saudável (IRS < 10%)                                 │
│ 🟡 Atenção (IRS 10-15%)                                 │
│ 🔴 Crítico (IRS > 15%)                                  │
├─────────────────────────────────────────────────────────┤
│ ALERTAS CRÍTICOS                                        │
│ ─────────────────────────────────────────────────────── │
│ ⚠️ [Obra X]: IRS de [X]% (meta: 10%)                    │
│ ⚠️ [N] NCs abertas há mais de 30 dias                   │
│ ⚠️ [Serviço X] com [X]% de NCs (todas as obras)         │
│ [Lista de alertas relevantes]                           │
├─────────────────────────────────────────────────────────┤
│ TOP 5 SERVIÇOS COM MAIS NCs (TODAS AS OBRAS)            │
│ ─────────────────────────────────────────────────────── │
│ 1. [Serviço 1]............ [N] NCs ([X]%)               │
│ 2. [Serviço 2]............ [N] NCs ([X]%)               │
│ 3. [Serviço 3]............ [N] NCs ([X]%)               │
│ 4. [Serviço 4]............ [N] NCs ([X]%)               │
│ 5. [Serviço 5]............ [N] NCs ([X]%)               │
├─────────────────────────────────────────────────────────┤
│ PRODUTIVIDADE DE INSPETORES (mês)                       │
│ ─────────────────────────────────────────────────────── │
│ Ranking │ Inspetor      │ Verificações │ Média/dia      │
│ ────────┼───────────────┼──────────────┼────────────────│
│ 🥇      │ [Nome 1]      │ [N]          │ [X.X]          │
│ 🥈      │ [Nome 2]      │ [N]          │ [X.X]          │
│ 🥉      │ [Nome 3]      │ [N]          │ [X.X]          │
│                                                         │
│ Produtividade semanal (última semana):                  │
│ [Nome 1]: [N] | [Nome 2]: [N] | [Nome 3]: [N]           │
├─────────────────────────────────────────────────────────┤
│ GRÁFICO: EVOLUÇÃO MENSAL                                │
│ ─────────────────────────────────────────────────────── │
│ [Gráfico de linha: % conformidade últimos 6 meses]      │
│                                                         │
│ 100%│                                                   │
│  90%│              ___────────────────                  │
│  80%│     ___─────/                                     │
│  70%│────/                                              │
│     └────────────────────────────────────               │
│      [Mês-6] [Mês-5] [Mês-4] [Mês-3] [Mês-2] [Mês-1]    │
├─────────────────────────────────────────────────────────┤
│ RODAPÉ                                                  │
│ Gerado por ARDEN FVS em [DD/MM/AAAA] às [HH:MM]         │
│ Página [X] de [Y]                                       │
└─────────────────────────────────────────────────────────┘
```

**Excel Anexo:**
Planilha com dados brutos organizados para análise própria do cliente:
- Aba 1: Resumo por Obra (colunas: Obra, Progresso, NCs Abertas, IRS, Taxa Conformidade)
- Aba 2: Detalhamento de NCs (colunas: ID, Obra, Unidade, Serviço, Item, Data, Status, Dias Aberta)
- Aba 3: Verificações do Período (colunas: ID, Obra, Unidade, Serviço, Inspetor, Data, Status)
- Aba 4: Produtividade Inspetores (colunas: Inspetor, Obra, Verificações Mês, Média Diária)

---

### 10.3.4 Eficiência de Correção

**Propósito:** Monitorar velocidade de resolução de NCs e identificar gargalos.

**Público:** Engenheiro, Mestre de obras

**Formato:** PDF

**Geração:** Automático semanal (sexta-feira, 16h)

**Estrutura do PDF:**

```
┌─────────────────────────────────────────────────────────┐
│ RELATÓRIO DE EFICIÊNCIA DE CORREÇÃO                     │
│ Obra: [Nome da Obra]                                    │
│ Semana: [DD/MM/AAAA] a [DD/MM/AAAA]                     │
│ Gerado em: [DD/MM/AAAA] às [HH:MM]                      │
├─────────────────────────────────────────────────────────┤
│ INDICADORES DA SEMANA                                   │
│ ─────────────────────────────────────────────────────── │
│ NCs abertas no período: [N]                             │
│ NCs resolvidas no período: [N]                          │
│ Saldo: [+/-N] ([Reduzindo/Aumentando] backlog)          │
│                                                         │
│ Tempo médio de resolução: [X.X] dias                    │
│ Meta: 7 dias | Status: [✅ Dentro / ⚠️ Acima] da meta   │
├─────────────────────────────────────────────────────────┤
│ TEMPO DE RESOLUÇÃO POR SERVIÇO                          │
│ ─────────────────────────────────────────────────────── │
│ Serviço              │ Média (dias) │ Status            │
│ ─────────────────────┼──────────────┼───────────────────│
│ [Serviço 1]          │ [X.X]        │ 🟢 Excelente      │
│ [Serviço 2]          │ [X.X]        │ 🟢 OK             │
│ [Serviço 3]          │ [X.X]        │ 🟡 Atenção        │
│ [Serviço 4]          │ [X.X]        │ 🔴 Crítico        │
│                                                         │
│ Legenda:                                                │
│ 🟢 Excelente (< 3 dias) | 🟢 OK (3-7 dias)              │
│ 🟡 Atenção (7-14 dias)  | 🔴 Crítico (> 14 dias)        │
├─────────────────────────────────────────────────────────┤
│ NCs CRÔNICAS (abertas > 15 dias)                        │
│ ─────────────────────────────────────────────────────── │
│ ⚠️ NC #[ID] - [N] dias - [Serviço] - [Unidade]          │
│    [Observação sobre o problema ou histórico]           │
│                                                         │
│ ⚠️ NC #[ID] - [N] dias - [Serviço] - [Unidade]          │
│    [Observação sobre o problema ou histórico]           │
│                                                         │
│ [Lista de NCs crônicas]                                 │
├─────────────────────────────────────────────────────────┤
│ TAXA DE REINCIDÊNCIA                                    │
│ ─────────────────────────────────────────────────────── │
│ NCs que precisaram de 2+ retrabalhos: [N] ([X]%)        │
│                                                         │
│ Detalhamento:                                           │
│ - NC #[ID] ([Serviço]): [N] retrabalhos, [status]       │
│ - NC #[ID] ([Serviço]): [N] retrabalhos, [status]       │
│ - NC #[ID] ([Serviço]): [N] retrabalhos, [status]       │
├─────────────────────────────────────────────────────────┤
│ RESOLUÇÃO POR TIPO                                      │
│ ─────────────────────────────────────────────────────── │
│ Retrabalho.................. [N] ([X]%)                 │
│ Conforme após reinspeção.... [N] ([X]%) ← Falsos posit. │
│ Aprovado com concessão...... [N] ([X]%)                 │
├─────────────────────────────────────────────────────────┤
│ RODAPÉ                                                  │
│ Gerado por ARDEN FVS em [DD/MM/AAAA] às [HH:MM]         │
│ Página [X] de [Y]                                       │
└─────────────────────────────────────────────────────────┘
```

---

## 10.4 Relatórios Fase 2

### 10.4.1 Relatório de Tendências

**Propósito:** Análise longitudinal para identificar padrões recorrentes e melhoria contínua.

**Público:** Engenheiro, Proprietário

**Formato:** PDF

**Geração:**
- Sob demanda
- Automático trimestral (opcional)

**Tipo de análise:** Estatística simples (sem IA), baseada em queries SQL dos dados históricos.

**Conteúdo planejado:**
- Top 5 serviços problemáticos recorrentes (últimos 3 meses)
- Comparativo mensal de IRS por serviço
- Identificação de padrões sazonais
- Evolução da taxa de conformidade
- Comparativo entre obras

**Queries base (exemplo):**
```sql
-- Top 5 serviços com mais NCs (últimos 3 meses)
SELECT servico, COUNT(*) as total_ncs
FROM verificacoes
WHERE status = 'NC' AND data > NOW() - INTERVAL '3 months'
GROUP BY servico
ORDER BY total_ncs DESC
LIMIT 5;
```

---

## 10.5 Relatórios Plano PRO (IA)

### 10.5.1 Análise Preditiva de NCs

**Propósito:** Machine Learning para prever onde problemas vão ocorrer antes que aconteçam.

**Público:** Engenheiro

**Formato:** PDF com insights

**Geração:** Sob demanda

**Funcionalidades planejadas:**
- Previsão de probabilidade de NC por unidade/serviço
- Identificação de correlações (ex: solo argiloso → mais NCs em fundação)
- Recomendações automatizadas
- Alertas proativos

**Nota:** Requer volume significativo de dados históricos para treinar modelo. Disponível apenas para clientes com 6+ meses de uso.

---

## 10.6 Configurações de Agendamento

### 10.6.1 Tela de Configuração (Portal Admin)

**Localização:** Configurações > Relatórios Automáticos

**Campos por relatório:**
- **Ativo:** Toggle (sim/não)
- **Frequência:** Dropdown (Diário / Semanal / Mensal)
- **Dia:**
  - Se semanal: Dropdown (Segunda a Domingo)
  - Se mensal: Dropdown (Dia 1 a 28)
- **Horário:** Dropdown (00:00 a 23:00, incrementos de 1h)
- **Destinatários:** Lista de emails (adicionar/remover)

**Configuração padrão (sugerida no primeiro acesso):**

| Relatório | Frequência | Dia | Horário | Destinatários Padrão |
|-----------|------------|-----|---------|---------------------|
| RNC | Semanal | Segunda | 07:00 | Engenheiro da obra |
| Dashboard Executivo | Mensal | Dia 1 | 08:00 | Admin |
| Eficiência de Correção | Semanal | Sexta | 16:00 | Engenheiro da obra |

### 10.6.2 Funcionalidades da Tela

**Ações disponíveis:**
- Editar configuração de cada relatório
- Adicionar/remover destinatários por email
- Testar envio (gera e envia imediatamente para o admin)
- Ver histórico de envios (últimos 30 dias)
- Pausar/retomar agendamento

**Validações:**
- Email deve ser válido
- Pelo menos 1 destinatário se relatório ativo
- Limite de 10 destinatários por relatório

### 10.6.3 Log de Envios

**Campos do log:**
- Data/hora do envio
- Relatório enviado
- Destinatários
- Status (Sucesso / Falha)
- Tamanho do arquivo
- Link para download (expira em 7 dias)

**Retenção:** 90 dias

---

## 10.7 Implementação Técnica

### 10.7.1 Geração de PDFs

**Tecnologia:** Edge Function (Deno) + biblioteca de geração de PDF

**Edge Functions necessárias:**
- `gerar-pdf-fvs` - FVS por Grupo de Unidades
- `gerar-pdf-rnc` - Relatório de Não Conformidades
- `gerar-pdf-dashboard` - Dashboard Executivo
- `gerar-pdf-eficiencia` - Eficiência de Correção
- `gerar-excel-dashboard` - Excel do Dashboard Executivo

### 10.7.2 Processamento de Fotos

**Watermark automático (aplicado no upload):**
- Nome da Obra
- Data e Hora (timestamp da foto)
- Nome do Inspetor
- Coordenadas GPS

**Compressão:**
- Quality: 0.8
- Tamanho alvo: ~800KB por foto
- Formato: JPEG

### 10.7.3 Agendamento

**Tecnologia:** Supabase Scheduled Functions (cron)

**Jobs configurados:**
- `relatorio-rnc-semanal`: Segundas 07:00 (timezone Brasil)
- `relatorio-dashboard-mensal`: Dia 1, 08:00
- `relatorio-eficiencia-semanal`: Sextas 16:00

**Fluxo:**
1. Cron dispara Edge Function
2. Edge Function consulta configurações ativas
3. Para cada cliente com agendamento ativo:
   - Gera PDF/Excel
   - Salva no Storage (temporário, 7 dias)
   - Envia email com link de download
   - Registra no log

### 10.7.4 Envio de Emails

**Tecnologia:** Supabase + provedor de email (Resend ou similar)

**Template de email:**
- Assunto: "[ARDEN FVS] [Nome do Relatório] - [Obra/Construtora] - [Data]"
- Corpo: Resumo breve + link para download
- Anexo: Não (apenas link para evitar limite de tamanho)

**Expiração do link:** 7 dias

---

## 10.8 Resumo de Relatórios

| Relatório | Formato | Geração | Público | Fase |
|-----------|---------|---------|---------|------|
| FVS por Grupo de Unidades | PDF | Sob demanda | Auditor, Engenheiro | MVP |
| RNC | PDF | Sob demanda + Semanal (seg 7h) | Engenheiro, Mestre | MVP |
| Dashboard Executivo | PDF + Excel | Sob demanda + Mensal (dia 1, 8h) | Diretoria | MVP |
| Eficiência de Correção | PDF | Semanal (sex 16h) | Engenheiro | MVP |
| Tendências | PDF | Sob demanda + Trimestral | Engenheiro, Proprietário | Fase 2 |
| Análise Preditiva de NCs | PDF | Sob demanda | Engenheiro | PRO |

---

# 11. PERMISSÕES E SEGURANÇA

## ⏳ SEÇÃO PENDENTE DE DETALHAMENTO

### O que já sabemos:

**Matriz Básica de Permissões:**
- **Admin:** Tudo (incluindo deletar verificações com justificativa)
- **Engenheiro:** Verificações + dashboards + relatórios das obras dele
- **Inspetor:** Apenas app mobile
- **Almoxarife:** Apenas portal de CIs
- **Super Admin (Arden):** Acesso todas contas (com log)

**Autenticação:**
- E-mail + Senha
- Recuperação de senha via e-mail

**Multi-tenancy:**
- Isolamento completo entre construtoras

### O que precisa ser discutido:

**🔐 Autenticação e Sessões:**
- [ ] Estratégia de tokens (JWT? OAuth? Outro?)
- [ ] Duração de sessões
- [ ] 2FA será implementado? Quando?
- [ ] SSO (Google, Microsoft) será implementado? Quando?

**🛡️ Segurança de Dados:**
- [ ] Criptografia: o que criptografar e como?
- [ ] Backup: frequência, retenção, onde armazenar?
- [ ] LGPD: políticas de privacidade, termos de uso, DPO?
- [ ] Auditoria: quais eventos logar? Por quanto tempo manter logs?

**👥 Permissões Granulares:**
- [ ] Níveis intermediários de permissão (ex: Engenheiro Sênior vs Júnior)?
- [ ] Permissões customizáveis por cliente?
- [ ] Como lidar com múltiplos papéis? (ex: alguém que é Admin e Engenheiro)

**🔍 Auditoria e Compliance:**
- [ ] Formato dos logs de auditoria
- [ ] Quem pode acessar logs?
- [ ] Certificações necessárias (ISO 27001, etc)?

---

# 12. DESIGN SYSTEM E UI/UX

## ⏳ SEÇÃO PENDENTE DE DETALHAMENTO

### O que já sabemos:

**Inspiração:** Supabase (Dark mode único, componentes React + Tailwind CSS + Radix UI)

**Paleta de Cores (conceitual):**
- Dark mode com verde característico do Supabase (#3ecf8e)
- Cores semânticas: Verde (conforme), Vermelho (NC), Amarelo (pendente)

**Componentes Mencionados:**
- Sidebar primária (56px, ícones)
- Sidebar secundária (240px, condicional)
- Barra superior (56px)
- Command Palette (⌘K)

### O que precisa ser discutido:

**🎨 Paleta de Cores Completa:**
- [ ] Definir exatamente todos os hex codes
- [ ] Backgrounds (primário, secundário, terciário)
- [ ] Foregrounds (texto, texto secundário)
- [ ] Borders, divisores
- [ ] Estados (hover, active, disabled)

**📐 Tipografia:**
- [ ] Fonte principal e fallbacks
- [ ] Hierarquia de tamanhos (H1, H2, H3, Body, Small)
- [ ] Line heights, letter spacing

**🧩 Biblioteca de Componentes:**
- [ ] Lista completa de componentes necessários (botões, inputs, cards, tabelas, modais, etc)
- [ ] Variantes de cada componente
- [ ] Estados (loading, error, success)

**📱 Responsividade:**
- [ ] Breakpoints exatos
- [ ] Comportamento em tablet
- [ ] Portal web funciona em mobile? (Ou só app?)

**♿ Acessibilidade:**
- [ ] Padrão WCAG a seguir (A, AA, AAA)?
- [ ] Navegação por teclado: teclas de atalho?
- [ ] Screen readers: prioridade?

**🎭 Animações e Transições:**
- [ ] Quais animações são essenciais?
- [ ] Duração padrão das transições?
- [ ] Preferência de redução de movimento (acessibilidade)?

---

# 13. ASPECTOS TÉCNICOS

## ✅ DECISÕES FUNDAMENTAIS (Consolidadas)

Esta seção documenta as decisões técnicas tomadas para o desenvolvimento do Arden FVS.

---

## 13.1 Banco de Dados e Storage

### **Decisão: PostgreSQL via Supabase**

**Banco escolhido:** PostgreSQL 15+ hospedado no Supabase (plataforma BaaS)

**Razões da escolha:**
1. ✅ Dev solo com experiência prévia em Supabase
2. ✅ Interface visual para criação de tabelas (baixa curva de aprendizado)
3. ✅ APIs REST geradas automaticamente (menos código)
4. ✅ Autenticação e autorização prontas
5. ✅ Row Level Security (RLS) para isolamento multi-tenancy
6. ✅ Realtime subscriptions para atualizações ao vivo
7. ✅ Backup automático e point-in-time recovery
8. ✅ Custo previsível e escalável

**Plano de hospedagem:**
- **MVP:** Supabase Pro - $25/mês
  - 8 GB database
  - 100 GB storage inclusos
  - 500K Edge Functions invocations/mês
- **Projeção Ano 1 (100 construtoras):**
  - Database: ~3 GB
  - Storage adicional: ~200 GB ($4.20/mês)
  - **Total: $29.20/mês**

### **Storage de Fotos (Não-Conformidades)**

**Decisão Inicial:** Supabase Storage

**Estratégia:**
- Começar simples com Supabase Storage
- Compressão de imagens no cliente (reduzir 3-5 MB → 500-800 KB)
- Migração futura opcional para Cloudflare R2 quando:
  - Passar de 200 construtoras, OU
  - Custo de transfer começar a impactar, OU
  - Necessidade de melhor performance global

**Volumetria calculada (100 construtoras):**
- Dados estruturados: 7 MB/dia → **2.55 GB/ano**
- Fotos (1.000/dia × 800 KB): 800 MB/dia → **292 GB/ano**
- **Total Ano 1: ~295 GB**

**Compressão de imagens:**
- Cliente comprime antes de upload
- Formato: JPEG com qualidade 80-85%
- Watermark automático: obra, data, hora, inspetor

**Limite de tamanho:**
- Por foto: 5 MB (antes compressão), 1 MB (após compressão)
- Por NC: até 5 fotos

### **Multi-tenancy e Isolamento**

**Estratégia:** Row Level Security (RLS) do PostgreSQL

Cada construtora (tenant) é identificada por `cliente_id`. Todas tabelas principais têm:
```sql
cliente_id UUID REFERENCES clientes(id)
```

**Policies RLS (exemplo):**
```sql
-- Usuários só veem dados da construtora deles
CREATE POLICY "Isolamento por cliente" ON verificacoes
  FOR ALL
  USING (
    cliente_id = (SELECT cliente_id FROM usuarios WHERE id = auth.uid())
  );
```

**Garantias:**
- Isolamento completo no nível do banco
- Impossível acessar dados de outro cliente via queries
- Super Admin (Arden) tem política especial com auditoria

---

## 13.2 Backend e API

### **Decisão: Arquitetura Supabase-First (Sem Backend Tradicional)**

**Filosofia:** Maximizar uso das capacidades nativas do Supabase, minimizar código custom.

### **Estrutura da Arquitetura:**

```
┌─────────────────────────────────────────────────────┐
│               FRONTEND (React/React Native)         │
│                   Supabase Client                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│                    SUPABASE                         │
│  ┌───────────────────────────────────────────────┐  │
│  │  PostgreSQL Database (dados estruturados)     │  │
│  │  + Row Level Security (permissões)            │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Supabase Auth (autenticação/sessões)        │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Supabase Storage (fotos)                    │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Edge Functions (Deno) - lógica complexa     │  │
│  │  - Gerar PDFs                                │  │
│  │  - Enviar emails                             │  │
│  │  - Cálculos IRS                              │  │
│  │  - Processar imagens                         │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### **Distribuição de Responsabilidades:**

**90% - Frontend Direto com Supabase:**
- CRUD básico (criar/ler/atualizar verificações, obras, usuários)
- Queries e filtros
- Upload de fotos
- Autenticação (login/logout)

**Exemplo:**
```typescript
// Criar verificação direto do React Native
const { data, error } = await supabase
  .from('verificacoes')
  .insert({
    obra_id: obraId,
    servico_id: servicoId,
    unidade_id: unidadeId,
    inspetor_id: user.id
  })
```

**10% - Edge Functions (quando necessário):**
- Gerar PDFs (relatórios FVS, RNC, consolidados)
- Enviar emails (relatórios agendados, alertas)
- Processar imagens (comprimir, watermark)
- Cálculos complexos (IRS, projeções)
- Webhooks para integrações futuras

**Exemplo:**
```typescript
// Edge Function: gerar PDF
const { data } = await supabase.functions.invoke('gerar-pdf-fvs', {
  body: { verificacao_id: '123' }
})
```

### **Por que NÃO usar backend tradicional (Node.js/Express)?**

**Razões:**
1. ❌ Dev solo com pouco conhecimento → menos código = menos bugs
2. ❌ Supabase já resolve 90% dos casos (CRUD, auth, permissões)
3. ❌ Backend separado = servidor extra ($5-12/mês) + deploy + monitoring
4. ❌ Mais tempo de desenvolvimento (2-3x mais lento)
5. ✅ Edge Functions cobrem os 10% restantes ($0 extra)

**Quando reavaliar:** Se crescer para 500+ construtoras e precisar lógicas muito customizadas.

### **Edge Functions (Deno Runtime)**

**Tecnologia:** Deno (JavaScript/TypeScript runtime moderno, criador do Node.js)

**Vantagens:**
- TypeScript nativo (sem configuração)
- Seguro por padrão (sandboxed)
- APIs web-standard (fetch, streams)
- Deploy automático via Supabase CLI

**Casos de uso confirmados:**
1. **Gerar PDFs:** `gerar-pdf-fvs`, `gerar-pdf-rnc`
2. **Enviar emails:** `enviar-relatorio-email`
3. **Processar imagens:** `processar-foto-nc` (comprimir, watermark)
4. **Cálculos:** `calcular-irs`, `projetar-conclusao`

**Custo:** Incluído no Plano Pro (500K invocações/mês, mais que suficiente)

---

## 13.3 Frontend Web (Portal)

### **Decisão: Next.js 15+ (App Router)**

**Framework escolhido:** Next.js com App Router (React framework completo)

**Razões da escolha:**
1. ✅ Supabase usa Next.js no próprio dashboard (queremos clonar o design deles)
2. ✅ Dev solo = menos decisões = mais produtividade
3. ✅ Roteamento já incluído (baseado em pastas, automático)
4. ✅ SEO otimizado (importante para landing page de vendas)
5. ✅ Deploy gratuito e automático na Vercel (criadores do Next.js)
6. ✅ Otimizações automáticas (code splitting, lazy loading, image optimization)
7. ✅ Documentação excelente em português
8. ✅ TypeScript de primeira classe

**Stack Completa:**
- **Framework:** Next.js 15+ (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Componentes:** Radix UI (primitivos acessíveis)
- **Design System:** Clone Supabase (ver DESIGN-SYSTEM.md)
- **Hospedagem:** Vercel (natural para Next.js, grátis até escalar)

**Estrutura de Pastas (Next.js App Router):**
```
/app
  /(auth)
    /login
    /cadastro
  /(portal)
    /dashboard
    /obras
      /[id]
    /relatorios
  /api (opcional, se precisar)
/components
  /ui (botões, inputs, cards - Radix UI)
  /layouts (sidebar, header)
/lib
  /supabase (client, queries)
```

### **Gerenciamento de Estado: Zustand**

**Decisão:** Zustand para TODO estado global (sem exceções)

**Razões da escolha:**
1. ✅ **Zero ambiguidade** → Sempre usar Zustand (facilita para IA desenvolver)
2. ✅ Código 100% consistente (uma única forma de fazer)
3. ✅ Leve (4KB) e performance excelente
4. ✅ TypeScript de primeira classe
5. ✅ DevTools inclusos
6. ✅ Sem boilerplate (menos código que Redux ou Context API)
7. ✅ Fácil integração com Supabase

**Estrutura da Store:**
```typescript
// lib/store.ts - ÚNICA fonte de estado global
import { create } from 'zustand'

export const useStore = create((set) => ({
  // Auth
  user: null,
  session: null,
  setUser: (user) => set({ user }),

  // App state
  obraSelecionada: null,
  setObra: (obra) => set({ obraSelecionada: obra }),

  // UI state
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Filtros
  filtros: { periodo: '30d', status: 'todas' },
  setFiltros: (filtros) => set({ filtros })
}))
```

**Regra para desenvolvimento:** Context API NÃO será utilizado para evitar ambiguidade. Todo estado global = Zustand.

### **Formulários + Validação: React Hook Form + Zod**

**Decisão:** React Hook Form + Zod (dupla integrada, sem exceções)

**Razões da escolha:**
1. ✅ **Integração nativa perfeita** (foram feitas para trabalhar juntas)
2. ✅ **Zero ambiguidade** → Todo formulário usa esta dupla
3. ✅ **TypeScript automático** (Zod infere tipos, zero duplicação)
4. ✅ **Performance excelente** (React Hook Form usa refs, menos rerenders)
5. ✅ **Menos código** que qualquer outra combinação
6. ✅ **Padrão no ecossistema Next.js** (documentação abundante)
7. ✅ **Reutilização de schemas** (mesmo schema para criar/editar)

**Exemplo de uso:**
```typescript
// Schema Zod define validação + tipos TypeScript
const obraSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres'),
  tipologia: z.enum(['residencial', 'comercial', 'retrofit']),
  responsavel: z.string().email('Email inválido').optional()
})

type ObraForm = z.infer<typeof obraSchema> // Tipo inferido automaticamente

// React Hook Form com Zod resolver
const { register, handleSubmit, formState: { errors } } = useForm<ObraForm>({
  resolver: zodResolver(obraSchema)
})
```

**Regra para desenvolvimento:** Todo formulário usa React Hook Form com Zod resolver. Validação nativa HTML5 não será utilizada.

### **Gráficos e Visualizações: Recharts**

**Decisão:** Recharts como biblioteca única de gráficos

**Razões da escolha:**
1. ✅ **Componentes declarativos** → Sintaxe React-like (JSX)
2. ✅ **TypeScript excelente** (tipos completos e intuitivos)
3. ✅ **Responsivo por padrão** (mobile/tablet/desktop)
4. ✅ **Leve e performático** (SVG nativo)
5. ✅ **Documentação clara** com muitos exemplos
6. ✅ **Customização simples** (estilo via props)
7. ✅ **Mais popular** no ecossistema React/Next.js
8. ✅ **Fácil manutenção** (código declarativo)

**Tipos de gráficos disponíveis:**
- `<BarChart>` → Progresso por obra, comparativos
- `<LineChart>` → Evolução temporal, tendências
- `<PieChart>` → Distribuição de status
- `<RadarChart>` → Comparativo multi-dimensional
- `<AreaChart>` → Áreas de tendência

**Exemplo de uso:**
```typescript
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

function GraficoConformidade({ data }) {
  return (
    <BarChart width={600} height={300} data={data}>
      <XAxis dataKey="obra" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="conformidade" fill="#3ecf8e" />
      <Bar dataKey="naoConformidade" fill="#ef4444" />
    </BarChart>
  )
}
```

**Regra para desenvolvimento:** Todos os gráficos usam Recharts. Outras bibliotecas (Chart.js, Victory, Nivo) não serão utilizadas.

### **Hospedagem:**
- **Vercel** (grátis até 100K requests/mês, deploy automático via Git)

---

### **✅ BLOCO 3 CONCLUÍDO - Resumo Frontend Web**

**Stack Completa Definida:**
- ⚡ **Framework:** Next.js 15+ (App Router)
- 🎨 **Estilização:** Tailwind CSS + Radix UI
- 📦 **Estado Global:** Zustand (tudo)
- 📝 **Formulários:** React Hook Form + Zod
- 📊 **Gráficos:** Recharts
- 🚀 **Hospedagem:** Vercel
- 💻 **Linguagem:** TypeScript

**Princípios aplicados:**
- Zero ambiguidade (uma única forma de fazer cada coisa)
- Praticidade e facilidade de gestão
- Padrões da indústria (Next.js + Vercel)
- Mínimo de decisões para IA desenvolver

---

## 13.4 Mobile (App) - BLOCO 4

### **Decisão: Expo (React Native Framework)**

**Framework escolhido:** Expo (React Native com ferramentas de produtividade)

**Razões da escolha:**
1. ✅ **Performance nativa real** (não é PWA, é app nativo verdadeiro)
2. ✅ **Dev solo friendly** (zero configuração Android Studio/Xcode)
3. ✅ **Build na nuvem** (EAS Build - envia código, recebe APK pronto)
4. ✅ **Testes sem device físico** (Expo Go em celular Android emprestado)
5. ✅ **SQLite nativo** (offline robusto para 50+ verificações)
6. ✅ **Gestos fluidos** (60fps, swipes nativos)
7. ✅ **Documentação excelente** (melhor que RN bare)
8. ✅ **Suporta tudo necessário** (câmera, GPS, notificações, offline)

**Por que NÃO PWA:**
- ❌ Performance insuficiente para 50 verificações offline + fotos
- ❌ Swipes web não são fluidos como nativos
- ❌ IndexedDB menos confiável que SQLite para dados críticos
- ❌ UX não-nativa (perceptível para usuários)

**Por que NÃO React Native Bare:**
- ❌ Complexidade alta para dev solo (Android Studio, Gradle, etc)
- ❌ Requer device físico para testes (usuário não tem Android)
- ❌ Build local complexo

**Custo:**
- **EAS Build:** $29/mês (build na nuvem, não precisa setup local)
- **Google Play Store:** $25 (taxa única)
- **Total Ano 1:** ~$373

**Plataformas:**
- **MVP:** Android (via EAS Build)
- **Fase 2:** iOS (quando tiver budget para Apple Developer $99/ano)

**Workflow de Testes:**
1. Desenvolvimento local (VS Code)
2. Testa via **Expo Go** (app grátis instalado em Android emprestado)
3. QR Code → código roda instantaneamente no físico
4. Build final via EAS Build (cloud) → recebe APK
5. Publica via EAS Submit → Google Play Store

---

### **Estado Global: Zustand**

**Decisão:** Zustand no mobile (mesma biblioteca do web)

**Razões da escolha:**
1. ✅ **Consistência total** → Mesma ferramenta web + mobile
2. ✅ **Zero ambiguidade** → IA sempre usa Zustand em todo o projeto
3. ✅ **Reutilização de conhecimento** → Aprende 1x, usa 2x
4. ✅ **Performance** → Melhor que Context API
5. ✅ **Funciona perfeitamente** em React Native

**Store Mobile (exemplo):**
```typescript
// store.ts (mobile)
import { create } from 'zustand'

export const useStore = create((set) => ({
  // Auth
  user: null,
  setUser: (user) => set({ user }),

  // Verificações offline
  verificacoesOffline: [],
  addVerificacao: (v) => set(state => ({
    verificacoesOffline: [...state.verificacoesOffline, v]
  })),

  // Sync status
  syncStatus: 'idle', // idle | syncing | error | success
  setSyncStatus: (status) => set({ syncStatus: status })
}))
```

**Regra para desenvolvimento:** Todo estado global (web + mobile) usa Zustand. Context API não será utilizado.

### **Navegação: React Navigation**

**Decisão:** React Navigation (padrão oficial Expo)

**Razões:**
- ✅ Padrão oficial do Expo e React Native
- ✅ Único viável para Expo (alternativas são incompatíveis)
- ✅ Documentação integrada e completa
- ✅ Suporta Stack, Tabs, Drawer (tudo necessário)

**Sem alternativas viáveis.** Decisão automática.

### **Câmera e Imagens: Expo Nativo**

**Decisão:** expo-camera + expo-image-manipulator + expo-file-system

**Stack de Câmera:**
1. **expo-camera** → Tira foto
2. **expo-image-manipulator** → Comprime (quality 0.8, ~800KB) + Watermark automático
3. **expo-file-system** → Salva no filesystem local
4. **SQLite** → Armazena referência (path da foto)
5. **Supabase Storage** → Upload quando sincronizar

**Razões da escolha:**
- ✅ Oficiais do Expo (zero config)
- ✅ Funciona no Expo Go (fácil testar)
- ✅ Simples de usar
- ✅ Faz tudo necessário (foto, compressão, watermark)

**Watermark automático:**
- Obra, data, hora, nome do inspetor
- Adicionado via `expo-image-manipulator` antes de salvar

**Edição de fotos (círculos, setas, desenho livre):**
- ⏳ **Adiado para Fase 2** (não crítico para MVP)
- MVP: Foto + observação em texto
- Fase 2: Adicionar react-native-sketch-canvas (círculo, seta, caneta, undo/redo)

---

### **Formulários e Validação: React Hook Form + Zod**

**Decisão:** React Hook Form + Zod no mobile (mesma stack do web)

**Razões da escolha:**
1. ✅ **Consistência total** → Mesma ferramenta web + mobile
2. ✅ **Schemas reutilizáveis** → Validação compartilhada
3. ✅ **TypeScript unificado** → Tipos inferidos por Zod
4. ✅ **Zero ambiguidade** → IA sempre usa RHF + Zod

**Particularidade Mobile:**
- Usa `Controller` do RHF (necessário para `<TextInput>` do React Native)
- Mais verboso que web, mas consistente

**Exemplo:**
```typescript
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const verificacaoSchema = z.object({
  observacao: z.string().min(3, 'Mínimo 3 caracteres'),
  status: z.enum(['conforme', 'nao_conforme'])
})

// No componente
const { control, handleSubmit } = useForm({
  resolver: zodResolver(verificacaoSchema)
})

<Controller
  control={control}
  name="observacao"
  render={({ field: { onChange, value } }) => (
    <TextInput value={value} onChangeText={onChange} />
  )}
/>
```

**Regra para desenvolvimento:** Todos os formulários (web + mobile) usam React Hook Form + Zod. Sem exceções.

### **Sincronização Offline: Arquitetura Completa**

#### **Contexto e Requisitos**

**Cenário operacional:**
- Tablets dos inspetores **NÃO têm dados móveis** (só wifi)
- Wifi disponível no container-escritório (3x/dia: manhã, almoço, fim do dia)
- Inspetores trabalham **offline no campo** durante o dia
- Múltiplos inspetores podem trabalhar na mesma obra simultaneamente
- Granularidade: **ITEM por ITEM** (não serviço completo)
- Conflitos são raros mas possíveis

**Princípio fundamental:** **FIRST WRITE WINS** (quem sincronizar primeiro trava o item)

---

#### **Arquitetura de 3 Camadas**

**Camada 1: Permissões de Obras**
- Admin concede/revoca acesso de usuários a obras
- A cada sync, app verifica lista de obras permitidas
- Adiciona obras novas (download completo)
- Remove obras sem permissão (deleta dados locais)

**Camada 2: Verificações e Serviços**
- Admin adiciona unidades novas → novas verificações geradas
- Admin ativa serviço novo → novas verificações geradas
- A cada sync, app baixa verificações/serviços novos (incremental)

**Camada 3: Itens de Verificação**
- Inspetor preenche item → salva SQLite local
- Sync: Upload itens preenchidos + Download itens preenchidos por outros
- Conflito: Servidor aceita primeiro, rejeita segundo

---

#### **Fluxo Completo de Sincronização**

**1. Download Inicial (Primeira Vez ou Nova Obra)**

```
Inspetor João faz login (primeira vez):
  → App verifica permissões no servidor
  → João tem acesso a: Obra A, Obra B

Download da Obra A:
  - Dados da obra (agrupamentos, unidades) → 15 KB
  - 25 serviços ativos + itens de verificação → 60 KB
  - 3.750 verificações pendentes (150 unidades × 25 serviços) → 750 KB
  - Total: ~1 MB

Download da Obra B:
  - Mesma estrutura → ~1 MB

Total download inicial: ~2 MB
Tempo: 3-5 segundos (wifi)
Armazenamento SQLite: 2 MB

✅ João está pronto para trabalhar offline
```

**2. Trabalho Offline (Durante o Dia)**

```
João no campo (SEM wifi, 09h-12h):

Abre verificação:
  - Obra A, Casa B10, Serviço PRC-001 (Revestimento Cerâmico)
  - Vê 8 itens disponíveis:
    1. Prumo das paredes [ ]
    2. Nível do piso [ ]
    3. Alinhamento das juntas [ ]
    4. Limpeza das juntas [ ]
    5. Qualidade do rejunte [ ]
    6. Acabamento nos cantos [ ]
    7. Quebras ou trincas [ ]
    8. Tonalidade uniforme [ ]

Preenche itens 1-4:
  - Item 1: Conforme ✓
  - Item 2: Conforme ✓
  - Item 3: Não Conforme ✗ (tira 2 fotos: foto1.jpg, foto2.jpg)
  - Item 4: Conforme ✓

App salva no SQLite local:
  - Tabela: itens_offline
  - Registros: 4 itens com status "pending_sync"
  - Fotos: /files/foto1.jpg (1.6 MB), /files/foto2.jpg (1.4 MB)

Armazenamento: +4 KB (dados) +3 MB (fotos)

João continua trabalhando, marca mais 20 itens de outras verificações...
Total acumulado offline: ~50 KB dados + ~15 MB fotos
```

**3. Sincronização Automática (Almoço - Volta ao Container)**

```
João volta ao container (12h00):
  → Tablet detecta wifi
  → App inicia sync automática (background)

FASE 1 - Download (Receber Atualizações):

  Query ao servidor:
    GET /sync/updates?user_id=joao&last_sync=2025-01-10T09:00:00

  Resposta:
    - Novas verificações: 0 (nenhuma unidade adicionada)
    - Itens preenchidos por outros: 15 itens
      (Gabriel preencheu itens 5-8 da Casa B10, mais outros)

  App atualiza SQLite local:
    - Remove item 5 (Gabriel fez)
    - Remove item 6 (Gabriel fez)
    - Remove item 7 (Gabriel fez)
    - Remove item 8 (Gabriel fez)
    - Atualiza outras verificações

FASE 2 - Upload (Enviar Trabalho Local):

  Lê da fila local (itens_offline com status "pending_sync"):
    - 24 itens preenchidos
    - 6 fotos (15 MB total)

  Upload em BATCH:
    POST /sync/upload
    Body: {
      itens: [
        { item_id: "item-1", verificacao_id: "v-123", status: "conforme", ... },
        { item_id: "item-3", verificacao_id: "v-123", status: "nao_conforme", fotos: ["foto1", "foto2"] },
        ... (22 itens)
      ]
    }

  Servidor processa:
    - Verifica cada item: já foi preenchido?
      - Item 1: NÃO → ACEITA ✅
      - Item 3: NÃO → ACEITA ✅
      - Item 15: SIM (Gabriel fez antes) → REJEITA ❌
      - ... (resto OK)

  Resposta:
    {
      success: [item-1, item-3, ... 22 itens],
      rejected: [
        { item_id: "item-15", reason: "already_filled", filled_by: "Gabriel", filled_at: "11h45" }
      ]
    }

  App processa resposta:
    - Itens aceitos: Remove do SQLite local + Deleta fotos associadas
    - Itens rejeitados: Move para tabela "sync_conflicts"
    - Mostra notificação no feed:
      "1 item já foi verificado: Item 15 (Casa C05) por Gabriel às 11h45"

FASE 3 - Upload de Fotos:

  Para itens aceitos que têm fotos:
    - Comprime fotos (quality 0.8, ~800KB cada)
    - Adiciona watermark (obra, data, hora, inspetor)
    - Upload para Supabase Storage:

      POST /storage/v1/object/fotos-nc/obra-a/foto1.jpg

  Aguarda confirmação

  Depois de confirmar upload:
    - Deleta foto local do filesystem
    - Atualiza referência no servidor (URL da foto)

Resultado final:
  ✅ 23 itens sincronizados com sucesso
  ❌ 1 item rejeitado (conflito)
  📦 Armazenamento liberado: ~14 MB

Notificação ao João:
  "Sincronizado ✓ 23 itens enviados"
```

**4. Cenário de Conflito Real (Mesmo Item)**

```
09h00: João marca Item 3 (Casa B10) como "Conforme" (offline)
09h30: Gabriel marca Item 3 (Casa B10) como "Não Conforme" (offline)

12h00: João sincroniza PRIMEIRO
  → Servidor recebe Item 3 = "Conforme"
  → Servidor verifica: Item 3 disponível? SIM
  → Servidor ACEITA ✅
  → Marca Item 3 como LOCKED (filled_by: João, filled_at: 12h00)

12h05: Gabriel sincroniza DEPOIS
  → Servidor recebe Item 3 = "Não Conforme"
  → Servidor verifica: Item 3 disponível? NÃO (João preencheu)
  → Servidor REJEITA ❌

  Resposta ao Gabriel:
    {
      rejected: [{
        item_id: "item-3",
        reason: "already_filled",
        filled_by: "João",
        filled_at: "12h00",
        filled_value: "conforme"
      }]
    }

  App de Gabriel:
    - Remove Item 3 da fila de sync
    - Adiciona notificação no feed:
      "⚠️ Item 3 (Casa B10, Prumo) já foi verificado por João às 12h00 (Conforme)"
    - Item 3 desaparece da lista de Gabriel
    - Foto que Gabriel tirou é deletada (não serve mais)

Item 3 permanece "Conforme" (primeiro que subiu)
```

**5. Cenário de Adição de Unidades (Admin)**

```
Admin no portal web (14h00):
  → Adiciona 10 unidades novas à Obra A
  → Sistema gera automaticamente:
      10 unidades × 25 serviços = 250 verificações novas

João sincroniza (18h00 - fim do dia):
  → App pergunta ao servidor: "Tem novidades desde 12h00?"
  → Servidor responde:
      {
        new_verificacoes: [250 verificações],
        new_unidades: [10 unidades]
      }

  → App baixa incrementalmente (~50 KB)
  → Adiciona no SQLite local
  → João vê 250 novas verificações disponíveis

Download incremental: 1-2 segundos
```

**6. Cenário de Remoção de Permissão**

```
Admin remove acesso de João à Obra B (15h00)

João sincroniza (18h00):
  → App baixa lista de obras permitidas: [Obra A]
  → Compara com local: [Obra A, Obra B]
  → Detecta: Obra B removida

  App executa:
    - Verifica fila de sync: Tem itens pendentes da Obra B?
      - NÃO → Deleta tudo
      - SIM → Mostra alerta:
          "⚠️ Você perdeu acesso à Obra B mas tem 5 itens não sincronizados. Deseja tentar sincronizar agora?"
          [Sim, sincronizar] [Não, descartar]

  Se João escolhe "Sim":
    - Tenta sincronizar itens pendentes (pode funcionar se remoção foi recente)

  Se João escolhe "Não" ou sync falha:
    - Deleta todos dados da Obra B do SQLite
    - Deleta todas fotos da Obra B do filesystem
    - Libera ~1 MB de espaço
```

---

#### **Estrutura do SQLite Local**

```sql
-- Obras permitidas
CREATE TABLE obras_locais (
  id TEXT PRIMARY KEY,
  nome TEXT,
  tipologia TEXT,
  last_sync_at TEXT
);

-- Unidades
CREATE TABLE unidades (
  id TEXT PRIMARY KEY,
  obra_id TEXT,
  nome TEXT,
  agrupamento TEXT
);

-- Serviços ativos
CREATE TABLE servicos (
  id TEXT PRIMARY KEY,
  obra_id TEXT,
  codigo TEXT,
  nome TEXT
);

-- Itens de verificação (biblioteca)
CREATE TABLE itens_biblioteca (
  id TEXT PRIMARY KEY,
  servico_id TEXT,
  descricao TEXT,
  tipo TEXT -- conforme/nao_conforme/parcial
);

-- Verificações pendentes (baixadas do servidor)
CREATE TABLE verificacoes (
  id TEXT PRIMARY KEY,
  obra_id TEXT,
  unidade_id TEXT,
  servico_id TEXT,
  status TEXT -- pendente/em_andamento/finalizada
);

-- Itens preenchidos offline (fila de sync)
CREATE TABLE itens_offline (
  id TEXT PRIMARY KEY,
  verificacao_id TEXT,
  item_id TEXT,
  status TEXT, -- conforme/nao_conforme/nao_aplicavel
  observacao TEXT,
  fotos TEXT, -- JSON array de paths locais
  preenchido_em TEXT,
  sync_status TEXT -- pending_sync/syncing/synced/error
);

-- Conflitos (itens rejeitados)
CREATE TABLE sync_conflicts (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  filled_by TEXT,
  filled_at TEXT,
  reason TEXT
);
```

---

#### **Lógica de Código (Sync Service)**

**Detecção de Wifi:**

```typescript
import NetInfo from '@react-native-community/netinfo';

// Listener de conexão
NetInfo.addEventListener(state => {
  if (state.isConnected && state.type === 'wifi') {
    console.log('Wifi detectado! Iniciando sync...');
    startAutoSync();
  }
});
```

**Sync Automática:**

```typescript
async function startAutoSync() {
  try {
    // Mostra loading
    useStore.setState({ syncStatus: 'syncing' });

    // FASE 1: Download atualizações
    const updates = await downloadUpdates();
    await applyUpdates(updates); // Atualiza SQLite local

    // FASE 2: Upload itens offline
    const pendingItems = await getPendingItems(); // Lê da fila local
    const uploadResult = await uploadItems(pendingItems);

    // FASE 3: Upload fotos
    const photosToUpload = uploadResult.success.filter(i => i.fotos?.length > 0);
    await uploadPhotos(photosToUpload);

    // FASE 4: Limpeza
    await cleanupSyncedData(uploadResult.success);

    // FASE 5: Notifica conflitos
    if (uploadResult.rejected.length > 0) {
      addConflictsToFeed(uploadResult.rejected);
    }

    // Atualiza last_sync timestamp
    await updateLastSync();

    useStore.setState({ syncStatus: 'success' });
    showNotification('Sincronizado ✓');

  } catch (error) {
    useStore.setState({ syncStatus: 'error' });
    showNotification('Erro ao sincronizar. Tente novamente.');
  }
}
```

**Download de Atualizações:**

```typescript
async function downloadUpdates() {
  const lastSync = await getLastSyncTimestamp();

  const { data } = await supabase
    .rpc('sync_get_updates', {
      user_id: currentUser.id,
      last_sync_at: lastSync
    });

  return {
    obras_permitidas: data.obras, // Lista de obras que user pode acessar
    novas_verificacoes: data.novas_verificacoes,
    itens_preenchidos_por_outros: data.itens_preenchidos
  };
}
```

**Upload em Batch:**

```typescript
async function uploadItems(pendingItems) {
  const { data, error } = await supabase
    .rpc('sync_upload_itens', {
      itens: pendingItems.map(item => ({
        item_id: item.item_id,
        verificacao_id: item.verificacao_id,
        status: item.status,
        observacao: item.observacao,
        preenchido_em: item.preenchido_em,
        preenchido_por: currentUser.id
      }))
    });

  // Servidor retorna quais foram aceitos e quais rejeitados
  return {
    success: data.accepted, // Itens aceitos (first write)
    rejected: data.rejected // Itens rejeitados (conflito)
  };
}
```

**Stored Procedure no Supabase (Backend Logic):**

```sql
-- Função que processa upload de itens (garante first write wins)
CREATE OR REPLACE FUNCTION sync_upload_itens(itens JSONB)
RETURNS JSONB AS $$
DECLARE
  item JSONB;
  result JSONB;
  accepted JSONB[] := '{}';
  rejected JSONB[] := '{}';
BEGIN
  -- Para cada item enviado
  FOR item IN SELECT * FROM jsonb_array_elements(itens)
  LOOP
    -- Verifica se item já foi preenchido
    IF EXISTS (
      SELECT 1 FROM itens_verificacao
      WHERE id = (item->>'item_id')::uuid
      AND status IS NOT NULL -- Já preenchido
    ) THEN
      -- Item já existe, rejeita (first write wins)
      rejected := array_append(rejected,
        jsonb_build_object(
          'item_id', item->>'item_id',
          'reason', 'already_filled'
        )
      );
    ELSE
      -- Item disponível, aceita
      UPDATE itens_verificacao SET
        status = item->>'status',
        observacao = item->>'observacao',
        preenchido_por = (item->>'preenchido_por')::uuid,
        preenchido_em = (item->>'preenchido_em')::timestamptz
      WHERE id = (item->>'item_id')::uuid;

      accepted := array_append(accepted, item);
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'accepted', to_jsonb(accepted),
    'rejected', to_jsonb(rejected)
  );
END;
$$ LANGUAGE plpgsql;
```

**Limpeza Pós-Sync:**

```typescript
async function cleanupSyncedData(successItems) {
  const db = await getDatabase();

  for (const item of successItems) {
    // Remove item da fila de sync
    await db.executeSql(
      'DELETE FROM itens_offline WHERE id = ?',
      [item.id]
    );

    // Deleta fotos locais associadas
    if (item.fotos?.length > 0) {
      for (const fotoPath of item.fotos) {
        await FileSystem.deleteAsync(fotoPath, { idempotent: true });
      }
    }
  }
}
```

---

#### **Resumo da Estratégia de Sync**

**Características:**
- ✅ **First Write Wins** (não last write wins)
- ✅ **Granularidade por item** (não por serviço)
- ✅ **Multi-obra por usuário** (download de todas as obras permitidas)
- ✅ **Sync automática ao detectar wifi**
- ✅ **Upload em batch** (economiza requests)
- ✅ **Auto-limpeza** (libera espaço após sync)
- ✅ **Notificação de conflitos** (no feed, não bloqueante)
- ✅ **Gerenciamento de permissões** (adiciona/remove obras dinamicamente)

**Complexidade:** Média-Alta (mas totalmente viável com Expo + Supabase)

**Performance:**
- Download inicial: 2-5 segundos (1-2 MB)
- Sync diária: 3-10 segundos (50 KB dados + 10-15 MB fotos)
- SQLite queries: <50ms (muito rápido)

---

### **✅ BLOCO 4 CONCLUÍDO - Resumo Mobile**

**Stack Completa Definida:**
- 📱 **Framework:** Expo (React Native + ferramentas produtividade)
- 🎨 **Navegação:** React Navigation
- 📦 **Estado Global:** Zustand
- 📝 **Formulários:** React Hook Form + Zod
- 📸 **Câmera:** expo-camera + expo-image-manipulator
- 💾 **Offline:** SQLite (expo-sqlite) + expo-file-system
- 🔄 **Sync:** Automática ao detectar wifi, granularidade por item, first write wins
- 🚀 **Build/Deploy:** EAS Build ($29/mês) + Google Play Store ($25 único)
- 💻 **Linguagem:** TypeScript

**Princípios aplicados:**
- Consistência total com web (mesmas ferramentas onde possível)
- Offline-first robusto (SQLite nativo)
- Zero ambiguidade (regras claras de sync)
- Performance nativa (não PWA)

---

## 13.5 Autenticação e Segurança

### **Decisão: Supabase Auth**

**Estratégia de autenticação:**
- Email + Senha (MVP)
- Magic links (fase futura)
- SSO Google/Microsoft (fase futura, feature PRO)

**Sessões:**
- JWT tokens gerenciados pelo Supabase
- Refresh tokens automáticos
- Duração: 1 semana (configurável)

**Row Level Security (RLS):**
- Permissões no nível do banco
- Policies baseadas em `auth.uid()` (usuário logado)
- Isolamento perfeito entre construtoras

**Exemplo de Policy:**
```sql
-- Engenheiro só vê obras atribuídas a ele
CREATE POLICY "Engenheiro vê suas obras" ON verificacoes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM usuarios_obras
      WHERE usuario_id = auth.uid()
      AND obra_id = verificacoes.obra_id
    )
  );
```

**2FA:** Fase futura (não MVP)

---

## 13.6 Schema de Banco de Dados

### **⏳ PENDENTE DE DEFINIÇÃO COMPLETA**

**Status:** Estrutura conceitual definida (Seção 5), schema SQL detalhado será criado em sessão específica.

**Tabelas principais (conceitual):**
- `clientes` (construtoras)
- `usuarios` (admin, engenheiro, inspetor, almoxarife)
- `usuarios_obras` (relação N:N)
- `obras`
- `agrupamentos`
- `unidades`
- `servicos` (biblioteca FVS)
- `obras_servicos` (serviços ativos por obra)
- `verificacoes`
- `itens_verificacao`
- `fotos_nc`
- `condicoes_inicio`

**Relacionamentos chave:**
- Cliente 1:N Obras
- Obra 1:N Agrupamentos 1:N Unidades
- Verificação → Obra + Unidade + Serviço + Inspetor
- Verificação 1:N Itens
- Item NC 1:N Fotos

**Índices críticos (performance):**
- `verificacoes(obra_id, created_at)`
- `itens_verificacao(verificacao_id, status)`
- `fotos_nc(item_id)`

**Será detalhado em sessão específica de modelagem.**

---

## 13.7 Hospedagem e Infraestrutura

### **Decisões:**

**Banco de Dados:** Supabase (já confirmado)

**Frontend Web:** ⏳ Pendente (opções: Vercel, Netlify, Cloudflare Pages)

**Mobile:** Distribuição via Google Play Store (Android MVP)

**CDN:** Supabase Storage já inclui CDN global

**Backup:**
- Supabase: backup automático diário + point-in-time recovery
- Retenção: 7 dias (Plano Pro)

**Ambientes:**
- **Produção:** Supabase projeto principal
- **Desenvolvimento:** Supabase projeto separado (plano Free)
- **Staging:** Opcional (avaliar necessidade)

---

## 13.8 Monitoramento e Logs

### **⏳ PENDENTE DE DECISÃO**

**Necessário definir:**
- [ ] Error tracking: Sentry, Rollbar, outro?
- [ ] Logs: onde armazenar? (Supabase Logs + serviço externo?)
- [ ] Uptime monitoring: UptimeRobot, Pingdom?
- [ ] APM (Application Performance Monitoring): necessário no MVP?

**Supabase já fornece:**
- Logs de database queries
- Logs de Edge Functions
- Metrics de API usage

**Será discutido em sessão de DevOps/Deploy.**

---

## 13.9 Testes

### **⏳ PENDENTE DE DECISÃO**

**Necessário definir:**
- [ ] Framework: Jest, Vitest?
- [ ] Cobertura mínima: 70%? 80%?
- [ ] E2E testing: Playwright, Cypress?
- [ ] Mobile testing: Detox, Appium?
- [ ] CI/CD: GitHub Actions, GitLab CI?

**Estratégia preliminar:**
- Unit tests para Edge Functions (crítico)
- Integration tests para fluxos principais
- E2E para jornadas críticas (criar verificação, gerar PDF)
- Mobile: testes manuais no MVP, automação na Fase 2

**Será detalhado em sessão específica.**

---

## 13.10 Performance e Otimizações

### **Estratégias confirmadas:**

**Mobile Offline-first:**
- SQLite local (todas verificações salvas instantaneamente)
- Sincronização em background quando online
- Conflict resolution: timestamp mais antigo vence

**Compressão de imagens:**
- Cliente comprime antes de upload (3-5 MB → 500-800 KB)
- Biblioteca: react-native-image-compressor ou similar

**Database:**
- Índices nas queries mais frequentes
- RLS policies otimizadas
- Paginação: 50 itens por página

**Frontend:**
- Code splitting (lazy loading de rotas)
- Virtualização de listas longas (react-window)
- Cache de queries com Supabase realtime

**Cache adicional:** ⏳ Avaliar necessidade de Redis (provavelmente não no MVP)

---

## 13.11 Tecnologias e Bibliotecas Confirmadas

### **Confirmadas:**

| Categoria | Tecnologia | Versão | Uso |
|-----------|-----------|--------|-----|
| **Database** | PostgreSQL | 15+ | Banco de dados principal |
| **BaaS** | Supabase | Latest | Backend-as-a-Service |
| **Frontend** | React | 18+ | Portal web |
| **Mobile** | React Native | Latest | App mobile |
| **Styling** | Tailwind CSS | 3.x | Estilização |
| **UI Components** | Radix UI | Latest | Primitivos acessíveis |
| **Language** | TypeScript | 5+ | Frontend + Edge Functions |
| **Edge Runtime** | Deno | Latest | Serverless functions |
| **Local DB Mobile** | SQLite | Latest | Offline storage |

### **Pendentes de decisão:**

| Categoria | Opções em análise |
|-----------|-------------------|
| **State Management** | Context API, Zustand, Redux Toolkit |
| **Forms** | React Hook Form, Formik |
| **Validation** | Zod, Yup |
| **Routing** | React Router, Next.js |
| **Charts** | Recharts, Chart.js, Victory |
| **PDF Generation** | jsPDF, pdfmake, puppeteer |
| **Hosting Web** | Vercel, Netlify, Cloudflare Pages |

**Serão decididas no próximo bloco (Frontend Web).**

---

## 13.12 Regras de Desenvolvimento

**Filosofia:** Código simples, manutenível, progressivo.

**Princípios para IA/Windsurf:**
1. **Fácil manutenção:** Código modular, funções pequenas, nomes descritivos
2. **Robustez:** Validações, tratamento de erros, fallbacks
3. **Progresso visual:** Sempre mostrar loading states e feedback ao usuário
4. **Explicitude:** Preferir código verboso e claro a "clever code"
5. **Criatividade controlada:** Seguir padrões estabelecidos, não reinventar

**Convenções de código:**
- TypeScript strict mode
- ESLint + Prettier (configuração Supabase)
- Commits semânticos (conventional commits)
- Branch strategy: Gitflow (main, develop, feature/*)

---

## 13.13 Resumo de Custos (Ano 1)

| Item | Custo/mês | Anual |
|------|-----------|-------|
| **Supabase Pro** (database + storage + edge functions) | $29 | $348 |
| **Hospedagem Frontend** ⏳ | $0-20 | $0-240 |
| **Google Play Store** (taxa única) | - | $25 |
| **Apple Developer** (se iOS Fase 2) | - | $99 |
| **Domínio** (.com.br) | $2 | $24 |
| **Monitoramento** ⏳ | $0-10 | $0-120 |
| **TOTAL ESTIMADO** | **$31-61** | **$397-856** |

**Nota:** Valores podem variar conforme decisões pendentes. Custo inicial conservador: **~$400/ano**.

---

## 🎯 PRÓXIMO BLOCO: FRONTEND WEB

**Objetivo:** Definir stack completa do portal web (React + ferramentas)

**Tópicos:**
- Gerenciamento de estado (Context API vs Zustand vs Redux)
- Roteamento (React Router vs Next.js)
- Formulários (React Hook Form vs Formik)
- Validação (Zod vs Yup)
- Gráficos (Recharts vs Chart.js)
- Hospedagem (Vercel vs Netlify vs Cloudflare Pages)

**Decisões necessárias antes de começar desenvolvimento do portal.**

---

# 14. PRÓXIMOS PASSOS E ROADMAP

## ⏳ SEÇÃO PENDENTE DE DISCUSSÃO COMPLETA

### O que já sabemos:

**Clientes Iniciais:** 2 construtoras mapeadas

**Fases Mencionadas:**
- **MVP:** Android, relatórios básicos, funcionalidades core
- **Fase 2:** iOS, relatórios avançados (IRS, Mapa Calor)
- **Fase 3:** Dashboard (Telão), IA avançada

**Trial:** 30 dias grátis sem cartão

### O que precisa ser discutido:

**📅 Cronograma Realista:**
- [ ] Quanto tempo para MVP completo?
- [ ] Quanto tempo para Fase 2?
- [ ] Quanto tempo para Fase 3?
- [ ] Quando lançar versão beta?
- [ ] Quando lançar versão pública?

**🎯 Definição de MVP Mínimo Viável:**
- [ ] Quais funcionalidades são REALMENTE essenciais para MVP?
- [ ] O que pode ser deixado para Fase 2 sem prejudicar validação?
- [ ] Relatórios: quantos e quais no MVP?
- [ ] Dashboard (telão): MVP ou só PRO?

**🏆 Critérios de Sucesso:**
- [ ] Métricas de produto (quantas obras, usuários, verificações)?
- [ ] Métricas de negócio (MRR, churn, CAC, LTV)?
- [ ] Métricas de qualidade (uptime, bugs, performance)?
- [ ] Como medir satisfação do cliente (NPS)?

**🧪 Plano de Beta Testing:**
- [ ] Beta fechado: quantos clientes? Por quanto tempo?
- [ ] Beta aberto: como selecionar participantes?
- [ ] Incentivos para beta testers?
- [ ] Processo de coleta de feedback

**📚 Documentação Necessária:**
- [ ] Documentação técnica (API, arquitetura, deploy)
- [ ] Documentação de usuário (manuais, tutoriais)
- [ ] Documentação de negócio (pitch deck, playbook de vendas)

**🎓 Onboarding:**
- [ ] Tour guiado no primeiro acesso?
- [ ] Tutoriais em vídeo: quais tópicos?
- [ ] Central de ajuda: estrutura de conteúdo?
- [ ] Suporte: canais (chat, e-mail, telefone)?

**🤖 Dashboard (Telão) - Feature PRO:**
- [ ] Conceito detalhado: o que mostra?
- [ ] Tipos de visualização (slides, mapa interativo, gráficos tempo real)?
- [ ] Como configurar (Admin escolhe o que mostrar)?
- [ ] Atualização em tempo real ou periódica?
- [ ] Funciona em qualquer tela ou precisa hardware específico?

**🧠 IA e Análise Avançada - Feature PRO:**
- [ ] Casos de uso específicos da IA
- [ ] Dados necessários para treinar modelos
- [ ] Algoritmos/modelos (regressão, clustering, redes neurais)?
- [ ] Interface de apresentação dos insights
- [ ] Como validar precisão das projeções?

**🔗 Integrações Futuras:**
- [ ] Quais ERPs integrar? (TOTVS, SAP, outros?)
- [ ] Gestão de projetos (MS Project, Primavera)?
- [ ] Webhooks: quais eventos disponibilizar?
- [ ] API pública: documentação, rate limits, pricing?

**⚖️ Aspectos Regulatórios:**
- [ ] Certificação PBQP-H do próprio sistema (necessário)?
- [ ] Conformidade com normas específicas
- [ ] Auditoria externa antes do lançamento?
- [ ] Termos de uso e política de privacidade (quem redigir?)

---

# APÊNDICE A: LISTA DE DEFINIÇÕES PENDENTES

## Prioridade Alta (Bloqueantes para Desenvolvimento)

- [ ] **Stack técnica completa** (banco, backend framework, ORM, hosting)
- [ ] **Schema de banco de dados** (tabelas, relacionamentos, índices)
- [ ] **Estrutura detalhada dos relatórios MVP**
- [ ] **Paleta de cores e tipografia exatas**
- [ ] **Cronograma realista de desenvolvimento**

## Prioridade Média (Importantes mas não Bloqueantes)

- [ ] Detalhamento de relatórios Fase 2
- [ ] Dashboard (Telão) completo
- [ ] Estratégias de segurança avançadas
- [ ] Plano de beta testing detalhado
- [ ] Documentação de usuário (manuais, tutoriais)

## Prioridade Baixa (Pode ser Definido Durante Desenvolvimento)

- [ ] IA e análise avançada (Feature PRO)
- [ ] Integrações futuras (ERPs, APIs)
- [ ] Aspectos regulatórios (certificações)
- [ ] Roadmap detalhado pós-MVP

---

# APÊNDICE B: PRÓXIMAS SESSÕES SUGERIDAS

## Sessão 1: Stack Técnica e Arquitetura

**Objetivo:** Definir completamente tecnologias e arquitetura

**Tópicos:**
- Banco de dados (qual? por quê?)
- Backend (framework, ORM, autenticação)
- Frontend (gerenciamento de estado, formulários)
- Mobile (Expo vs Bare, bibliotecas essenciais)
- Hospedagem (onde? como?)
- Schema de banco completo

**Duração estimada:** 2-3 horas

---

## Sessão 2: Design System Completo

**Objetivo:** Definir identidade visual e componentes

**Tópicos:**
- Paleta de cores exata (hex codes)
- Tipografia completa
- Biblioteca de componentes
- Responsividade e breakpoints
- Acessibilidade

**Duração estimada:** 1-2 horas

---

## Sessão 3: Relatórios Detalhados

**Objetivo:** Estrutura exata de cada relatório

**Tópicos:**
- Conteúdo de cada tipo de relatório
- Layout e seções
- Diferenças PDF vs Excel
- Priorização por fase (MVP vs Fase 2)

**Duração estimada:** 1-2 horas

---

## Sessão 4: Dashboard (Telão) e IA

**Objetivo:** Definir features PRO avançadas

**Tópicos:**
- Conceito completo do Dashboard
- Visualizações e configurações
- IA: casos de uso, algoritmos, interface
- Análise preditiva

**Duração estimada:** 1-2 horas

---

## Sessão 5: Roadmap e Execução

**Objetivo:** Planejar desenvolvimento e lançamento

**Tópicos:**
- Cronograma realista
- MVP mínimo viável
- Critérios de sucesso
- Plano de beta testing
- Documentação necessária

**Duração estimada:** 1-2 horas

