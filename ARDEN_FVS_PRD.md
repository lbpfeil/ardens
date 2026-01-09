# ARDEN FVS - Product Requirements Document

**Versão:** 1.0 (Parcial - Em Construção)  
**Data:** Janeiro 2026  
**Status:** ✅ Seções 1-9 Consolidadas | ⏳ Seções 10-14 Pendentes

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
10. [RELATÓRIOS E AUTOMAÇÕES](#10-relatórios-e-automações) ⏳
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
- Conforme após reinspeção
- Retrabalho (erro custoso de corrigir, mas aprovado - alimenta KPI IRS)
- Aprovado com concessão (aceito com defeito menor)
- Reprovado após retrabalho (tentaram corrigir mas continua errado)

**Critério subjetivo:** Entre "Conforme após reinspeção" e "Retrabalho" é julgamento do inspetor/engenheiro (simples vs custoso).

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

## ⏳ SEÇÃO PENDENTE DE DETALHAMENTO

### O que já sabemos:

**Tipos de Relatórios Mencionados:**
- FVS Individual (PDF de uma verificação específica)
- FVS Consolidada (todas unidades de um serviço)
- Relatório de Não-Conformidades (RNC)
- Resumo Executivo (para diretoria/investidores)
- IRS - Índice de Retrabalho por Serviço (diferencial analítico)
- Mapa de Calor (planta visual com unidades coloridas por status)
- Rastreabilidade de Materiais (histórico liberações almoxarife)

**Automação:**
- Relatórios agendados com envio automático por e-mail
- Exemplo: "Todo dia 5, enviar FVS Consolidada filtrada por tag 'Financiamento Caixa' para auditoria@caixa.gov.br"
- Configurável: destinatário, frequência, escopo, tipo, formato

### O que precisa ser discutido:

**📋 Estrutura Detalhada de Cada Relatório:**
- [ ] Qual exatamente é o conteúdo/seções de cada tipo?
- [ ] Quais campos são obrigatórios vs opcionais?
- [ ] Layout visual (não precisa mockup, mas descrição clara)
- [ ] Diferenças entre formato PDF vs Excel

**🎯 Priorização por Fase:**
- [ ] Quais relatórios são MVP (essenciais)?
- [ ] Quais são Fase 2 (diferenciais)?
- [ ] Quais são Fase 3/PRO (com IA)?

**🔧 Configuração de Automações:**
- [ ] Interface de configuração (detalhes do formulário)
- [ ] Como testar antes de ativar?
- [ ] Como gerenciar múltiplas automações?
- [ ] Logs de envios realizados?

**📊 Relatórios com IA (Feature PRO):**
- [ ] Projeção de Conclusão: como funciona o algoritmo?
- [ ] Análise Preditiva: quais padrões identifica?
- [ ] Interface de apresentação dos insights?

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

## ⏳ SEÇÃO PENDENTE DE DISCUSSÃO COMPLETA

### O que já sabemos:

**Tecnologias Mencionadas:**
- Frontend Web: React, Node.js
- Mobile: React Native (Android MVP, iOS Fase 2)
- Banco Local Mobile: SQLite (para offline)
- Inspiração: Supabase (Tailwind CSS, Radix UI)

**Requisitos Técnicos:**
- Offline-first no mobile
- Sincronização automática
- Multi-tenancy (isolamento entre construtoras)

**Regras de Desenvolvimento (para IA/Windsurf):**
1. Fácil manutenção (código modular)
2. Robustez (soluções estáveis)
3. Progresso visual
4. Explicitude de conceitos
5. Criatividade controlada

### O que precisa ser discutido:

**🏗️ Arquitetura Geral:**
- [ ] Monolito vs Microserviços?
- [ ] Onde hospedar? (AWS, GCP, Azure, DigitalOcean, Vercel, outro?)
- [ ] CDN para assets estáticos?
- [ ] Load balancer necessário desde MVP?

**🗄️ Banco de Dados:**
- [ ] Qual banco usar? (PostgreSQL, MySQL, MongoDB, outro?)
- [ ] Schema completo (tabelas, relacionamentos, índices)
- [ ] Estratégia de migrations
- [ ] Backup e recovery

**🔌 Backend/API:**
- [ ] Node.js: qual framework? (Express, Fastify, NestJS, outro?)
- [ ] TypeScript ou JavaScript puro?
- [ ] REST, GraphQL, ou ambos?
- [ ] Autenticação: biblioteca/framework?
- [ ] ORM: Prisma, TypeORM, Sequelize, outro?

**🎨 Frontend Web:**
- [ ] React: qual versão? Context API ou Redux/Zustand?
- [ ] Roteamento: React Router ou Next.js?
- [ ] Gerenciamento de estado global
- [ ] Biblioteca de formulários (React Hook Form, Formik, outro?)
- [ ] Validação de dados (Zod, Yup, outro?)

**📱 Mobile:**
- [ ] React Native: Expo ou bare?
- [ ] Navegação: React Navigation ou outro?
- [ ] Gerenciamento de estado mobile
- [ ] Biblioteca de câmera
- [ ] Biblioteca de gestos

**📦 File Storage:**
- [ ] Onde armazenar fotos? (S3, Cloudflare R2, outro?)
- [ ] Estratégia de compressão de imagens
- [ ] Limite de tamanho por foto
- [ ] Política de retenção

**⚡ Performance:**
- [ ] Cache: Redis, Memcached, outro?
- [ ] Otimizações de queries
- [ ] Lazy loading
- [ ] Paginação

**🚀 Deploy e CI/CD:**
- [ ] Pipeline de deploy (GitHub Actions, GitLab CI, outro?)
- [ ] Ambientes (dev, staging, prod)
- [ ] Estratégia de versioning
- [ ] Rollback: como funciona?

**🔍 Monitoramento:**
- [ ] Logs: onde armazenar? (CloudWatch, LogDNA, outro?)
- [ ] APM: Datadog, New Relic, outro?
- [ ] Alertas de erro: Sentry, Rollbar, outro?
- [ ] Uptime monitoring

**🧪 Testes:**
- [ ] Framework de testes (Jest, Vitest, outro?)
- [ ] Cobertura mínima esperada
- [ ] E2E testing: Cypress, Playwright, outro?
- [ ] Testing mobile: Detox, Appium, outro?

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

