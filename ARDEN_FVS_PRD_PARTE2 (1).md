# ARDEN FVS - Product Requirements Document - PARTE 2

**Continuação da Parte 1**

**Status:** ⏳ Seções Pendentes de Discussão e Definição

---

# ÍNDICE PARTE 2

10. [RELATÓRIOS E AUTOMAÇÕES](#10-relatórios-e-automações) ⏳
11. [PERMISSÕES E SEGURANÇA](#11-permissões-e-segurança) ⏳
12. [DESIGN SYSTEM E UI/UX](#12-design-system-e-uiux) ⏳
13. [ASPECTOS TÉCNICOS](#13-aspectos-técnicos) ⏳
14. [PRÓXIMOS PASSOS E ROADMAP](#14-próximos-passos-e-roadmap) ⏳

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

---

**FIM DO PRD - PARTE 2**

---

# NOTA IMPORTANTE

Este documento (Parte 1 + Parte 2) representa o estado atual do PRD do Arden FVS.

**Parte 1** contém tudo que foi efetivamente discutido e decidido.

**Parte 2** mapeia o que ainda precisa ser definido, organizando as lacunas de forma estruturada para facilitar as próximas sessões de discussão.

**Próximo passo recomendado:** Começar pela Sessão 1 (Stack Técnica e Arquitetura), pois essas definições são bloqueantes para o início do desenvolvimento.
