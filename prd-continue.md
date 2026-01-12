# 🔄 PRD Continue - Resumo Executivo para Próxima Sessão

> **Arquivo de contexto rápido:** Use este documento para entender rapidamente TODO o projeto sem ler o PRD completo (1800+ linhas).

---

## 🎯 O QUE É O PRODUTO

**Nome:** ARDEN FVS (Ficha de Verificação de Serviços)

**Propósito:** SaaS para gestão de qualidade em obras de construção civil, focado em certificação PBQP-H.

**Modelo de Negócio:** B2B SaaS - Construtoras pagam mensalidade por obra ativa.

**Usuário Principal:** Construtoras brasileiras que precisam de certificação PBQP-H.

---

## 👥 PERFIS DE USUÁRIO

1. **Admin** (construtora) - Gerencia obras, usuários, configurações
2. **Engenheiro** - Acessa dashboards, relatórios, aprova retrabalhos
3. **Inspetor/Auxiliar Técnico** - Usa app mobile para fazer verificações no campo
4. **Almoxarife** - Libera materiais baseado em CIs (feature opcional)

---

## 🏗️ CONCEITOS PRINCIPAIS

### **Estrutura de Dados:**
- **Obra** → Múltiplas **Unidades** (casas, apartamentos)
- **Unidades** agrupadas em **Agrupamentos** (Quadra A, Torre 1, etc)
- **Serviços** (biblioteca FVS: Alvenaria, Revestimento, Elétrica, etc)
- Cada **Serviço** tem múltiplos **Itens de Verificação**
- **Verificação** = Inspetor preenche itens de 1 serviço em 1 unidade

### **Status de Verificação:**
- ✅ **Conforme** - Item OK
- ❌ **Não Conforme (NC)** - Item com problema → foto obrigatória + observação
- ⚠️ **Não Aplicável** - Item não se aplica

### **Granularidade CRÍTICA:**
- Sincronização e conflitos acontecem no nível de **ITEM** (não serviço completo)
- João pode verificar itens 1-4, Gabriel itens 5-8 do MESMO serviço

### **Multi-tenancy:**
- Isolamento total por `cliente_id` (Row Level Security no PostgreSQL)
- Cada construtora é um tenant

---

## 🖥️ PLATAFORMAS

1. **Portal Web (Next.js)** - Admin e Engenheiro (desktop)
2. **App Mobile (Expo)** - Inspetores (Android tablets, offline-first)

---

## 📚 SESSÃO 1 CONCLUÍDA: STACK TÉCNICA

### ✅ **Bloco 1: Database**

**Decisão:** PostgreSQL 15+ via Supabase (BaaS)

**Razões:**
- Dev solo com experiência em Supabase
- Interface visual para tabelas
- Row Level Security (RLS) para multi-tenancy
- APIs REST automáticas
- Backup automático

**Volumetria (Ano 1, 100 construtoras):**
- Dados estruturados: ~3 GB
- Fotos: ~292 GB
- Total: ~295 GB

**Custo:** $29/mês (Supabase Pro + storage adicional)

**Storage de Fotos:** Supabase Storage (pode migrar para Cloudflare R2 depois se necessário)

---

### ✅ **Bloco 2: Backend**

**Decisão:** Supabase-First (SEM backend tradicional Node.js)

**Estrutura:**
- **90%:** Frontend direto com Supabase (CRUD, queries, auth)
- **10%:** Edge Functions (Deno) para lógica complexa (PDFs, emails, cálculos)

**Razões:**
- Dev solo com pouco conhecimento
- Supabase resolve 90% dos casos
- Edge Functions cobrem os 10% restantes
- Zero servidor extra para gerenciar

**Edge Functions (Deno):**
- `gerar-pdf-fvs` - Relatórios em PDF
- `gerar-pdf-rnc` - Relatório de Não Conformidades
- `enviar-relatorio-email` - Emails automáticos
- `processar-foto-nc` - Comprimir + watermark
- `calcular-irs` - Cálculo IRS (Índice de Retrabalho de Serviços)

---

### ✅ **Bloco 3: Frontend Web (Portal)**

**Stack Completa:**

| Aspecto | Tecnologia | Motivo |
|---------|------------|--------|
| **Framework** | Next.js 15+ (App Router) | Supabase usa, roteamento incluído, SEO, Vercel grátis |
| **Estado Global** | Zustand | Zero ambiguidade, leve (4KB), IA sempre sabe usar |
| **Formulários** | React Hook Form + Zod | Integração perfeita, TypeScript automático |
| **Validação** | Zod | Infere tipos, reutilizável |
| **Gráficos** | Recharts | Declarativo, React-like, popular |
| **Estilização** | Tailwind CSS + Radix UI | Design system Supabase clone |
| **Hospedagem** | Vercel | Grátis até 100K req/mês, deploy automático |
| **Linguagem** | TypeScript | Obrigatório em tudo |

**Princípio Fundamental:** **ZERO AMBIGUIDADE** - Uma única forma de fazer cada coisa (facilita IA desenvolver)

**Regra de Ouro:** Todo estado global = Zustand (Context API não será usado)

---

### ✅ **Bloco 4: Mobile (App Inspetores)**

**Stack Completa:**

| Aspecto | Tecnologia | Motivo |
|---------|------------|--------|
| **Framework** | Expo (React Native) | Build na nuvem (EAS), testes via Expo Go, zero config |
| **Navegação** | React Navigation | Padrão oficial Expo |
| **Estado Global** | Zustand | Mesma do web (consistência total) |
| **Formulários** | React Hook Form + Zod | Mesma do web (consistência total) |
| **Câmera** | expo-camera + expo-image-manipulator | Oficiais Expo, compressão + watermark |
| **Offline** | SQLite (expo-sqlite) + expo-file-system | Robusto, nativo, armazena 50+ verificações offline |
| **Sync** | Automática ao detectar wifi | Upload batch + download incremental |
| **Build/Deploy** | EAS Build ($29/mês) | Build na nuvem, não precisa Android Studio local |
| **Linguagem** | TypeScript | Mesma do web |

**Plataformas MVP:** Android (iOS Fase 2)

**Custo Ano 1:** ~$373 (EAS $29/mês × 12 + Google Play $25 único)

---

### 🔄 **ARQUITETURA DE SINCRONIZAÇÃO OFFLINE (CRÍTICA!)**

#### **Contexto Operacional:**
- Tablets **NÃO têm dados móveis** (só wifi)
- Wifi disponível **3x/dia** (manhã, almoço, fim do dia) no container-escritório
- Inspetores trabalham **offline no campo** durante o dia
- **Múltiplos inspetores** na mesma obra simultaneamente

#### **Princípio Fundamental:** **FIRST WRITE WINS**
- Quem sincronizar primeiro "trava" o item
- Quem sincronizar depois é rejeitado (notificado no feed)

#### **Granularidade:** ITEM por ITEM (não serviço completo)
- Serviço tem 8 itens
- João pode preencher itens 1-4 offline
- Gabriel pode preencher itens 5-8 offline
- Ambos sincronizam sem conflito

#### **3 Camadas de Sincronização:**

**Camada 1: Permissões de Obras**
- Admin concede/revoca acesso de usuário a obras
- App verifica lista de obras permitidas a cada sync
- Adiciona obras novas (download completo ~1 MB)
- Remove obras sem permissão (deleta dados locais)

**Camada 2: Verificações e Serviços**
- Admin adiciona unidades → novas verificações geradas
- Admin ativa serviço → novas verificações geradas
- App baixa incrementalmente (~50 KB)

**Camada 3: Itens de Verificação**
- **Upload:** Envia itens preenchidos localmente (batch)
- **Download:** Baixa itens preenchidos por outros
- **Conflito:** Servidor aceita primeiro, rejeita segundo

#### **Fluxo Completo:**

**1. Download Inicial (1x na vida ou nova obra):**
```
João tem acesso a Obra A e Obra B
  → Download Obra A: ~1 MB (unidades, serviços, 3.750 verificações pendentes)
  → Download Obra B: ~1 MB
  → Total: ~2 MB em 3-5 segundos
  → Salva tudo no SQLite local
  → Pronto para trabalhar offline
```

**2. Trabalho Offline:**
```
João preenche itens 1-4 de uma verificação
  → Salva no SQLite local (tabela: itens_offline)
  → Status: "pending_sync"
  → Tira 2 fotos (salva filesystem: /files/foto1.jpg)
  → Acumula localmente: ~50 KB dados + ~15 MB fotos
```

**3. Sincronização Automática (ao detectar wifi):**
```
FASE 1 - Download atualizações:
  → Baixa itens preenchidos por outros (Gabriel fez itens 5-8)
  → Remove itens 5-8 da lista de João (já foram feitos)

FASE 2 - Upload em batch:
  → Envia 24 itens preenchidos
  → Servidor verifica cada um: disponível?
    - Item 1: SIM → ACEITA ✅
    - Item 15: NÃO (Gabriel fez antes) → REJEITA ❌
  → Resposta: 23 aceitos, 1 rejeitado

FASE 3 - Upload fotos:
  → Comprime (quality 0.8, ~800KB)
  → Adiciona watermark (obra, data, hora, inspetor)
  → Upload para Supabase Storage

FASE 4 - Limpeza:
  → Remove itens sincronizados do SQLite local
  → Deleta fotos do filesystem
  → Libera ~14 MB
```

**4. Conflito (raro mas possível):**
```
João marca Item 3 como "Conforme" (09h, offline)
Gabriel marca Item 3 como "Não Conforme" (09h30, offline)

João sincroniza PRIMEIRO (12h):
  → Servidor aceita Item 3 = "Conforme" ✅

Gabriel sincroniza DEPOIS (12h05):
  → Servidor rejeita Item 3 ❌ (já foi preenchido)
  → App de Gabriel mostra no feed:
      "⚠️ Item 3 (Casa B10) já foi verificado por João às 12h00"
  → Foto de Gabriel é deletada

Item 3 permanece "Conforme" (primeiro que subiu)
```

#### **SQLite Local (7 Tabelas):**
- `obras_locais` - Obras permitidas
- `unidades` - Unidades da obra
- `servicos` - Serviços ativos
- `itens_biblioteca` - Itens de cada serviço
- `verificacoes` - Verificações pendentes (baixadas do servidor)
- `itens_offline` - Fila de sync (itens preenchidos aguardando upload)
- `sync_conflicts` - Conflitos (itens rejeitados)

#### **Performance:**
- Download inicial: 2-5 seg (1-2 MB)
- Sync diária: 3-10 seg (50 KB dados + 10-15 MB fotos)
- SQLite queries: <50ms

---

## 🎨 DESIGN SYSTEM

**Inspiração:** Clone EXATO do Supabase Dashboard

**Características:**
- Dark mode único (verde característico #3ecf8e)
- React + Tailwind CSS + Radix UI
- Sidebar primária (56px, ícones) + secundária condicional (240px)
- Command Palette (⌘K)

**Arquivo Completo:** `DESIGN-SYSTEM.md` (2110 linhas com CSS vars, componentes, layouts)

---

## 📋 FEATURES PRINCIPAIS

### **Portal Web:**

**Admin:**
- Gerenciar obras (criar, editar, arquivar)
- Gerenciar usuários (convidar, atribuir permissões por obra)
- Configurar serviços ativos
- Configurar CIs (Condições de Início - feature opcional)
- Dashboard consolidado multi-obras

**Engenheiro:**
- Dashboard da obra (progresso, conformidade, NCs abertas)
- Central de NCs (filtrar, visualizar, marcar reinspecionada)
- Gerar relatórios (PDF, Excel)
- Agendar relatórios automáticos (email)

### **App Mobile:**

**Inspetor:**
- Ver verificações pendentes (filtrar por unidade, agrupamento, serviço)
- Abrir verificação → preencher itens (Conforme/NC/NA)
- Tirar fotos (se NC) → compressão automática + watermark
- Trabalhar 100% offline
- Sincronizar automaticamente ao conectar wifi
- Ver feed de notificações (conflitos, atualizações)

---

## 🏭 FEATURES OPCIONAIS (Fases Futuras)

1. **Condições de Início (CIs):**
   - Bloquear serviços até CIs atendidas
   - Almoxarife libera materiais baseado em CIs

2. **Relatórios com IA (PRO):**
   - Projeção de conclusão
   - Análise preditiva de NCs

3. **Edição de Fotos:**
   - Desenho livre, círculos, setas, undo/redo
   - Adiado para Fase 2 (não MVP)

4. **iOS:**
   - Fase 2 (requer Apple Developer $99/ano)

---

## ✅ SESSÃO 2 CONCLUÍDA: RELATÓRIOS E AUTOMAÇÕES

### **Seção 10: Relatórios e Automações** ✅

**Modelo de Status definido:**

| Status Primeira Inspeção | Descrição |
|--------------------------|-----------|
| Não Verificado | Estado inicial |
| Conforme | Atende critérios |
| Não Conforme | Problema → foto + observação |
| Exceção | Não se aplica |

| Status Reinspeção | Descrição | Impacta IRS? |
|-------------------|-----------|--------------|
| Conforme após reinspeção | Não havia problema real | Não |
| Retrabalho | Correção executada | **Sim** |
| Aprovado com concessão | Defeito tolerável aceito | Não |
| Reprovado após retrabalho | Correção insuficiente | Não |

**Fórmula IRS:** `(Itens com "Retrabalho" / Total Verificados) × 100`

**Relatórios MVP (4):**
| Relatório | Formato | Geração |
|-----------|---------|---------|
| FVS por Grupo de Unidades | PDF | Sob demanda |
| RNC | PDF | Sob demanda + Semanal (seg 7h) |
| Dashboard Executivo | PDF + Excel | Sob demanda + Mensal (dia 1, 8h) |
| Eficiência de Correção | PDF | Semanal (sex 16h) |

**Relatórios Fase 2:** Tendências (análise estatística)

**Relatórios PRO:** Análise Preditiva de NCs (Machine Learning)

**Watermark nas fotos:** Obra, Data/Hora, Inspetor, GPS

**Configurações de agendamento:**
- Frequência, dia, horário configuráveis
- Destinatários por email (até 10)
- Log de envios (90 dias retenção)
- Link expira em 7 dias

---

## ✅ SESSÃO 3 CONCLUÍDA: SCHEMA DO BANCO DE DADOS

### **Seção 13.6: Schema do Banco** ✅

**Arquivo:** `database/schema.sql`

**Estrutura:**
- 9 tipos ENUM
- 22 tabelas
- Indexes para performance
- Triggers para updated_at e contadores
- RLS habilitado em todas tabelas

**Tabelas principais:**

| Categoria | Tabelas |
|-----------|---------|
| Multi-tenancy | `clientes` |
| Usuários | `usuarios`, `usuario_clientes`, `usuario_obras` |
| Obras | `obras`, `agrupamentos`, `unidades`, `empreendimentos`, `tags` |
| Biblioteca FVS | `servicos`, `itens_servico`, `fotos_referencia`, `condicoes_inicio` |
| Verificações | `verificacoes`, `itens_verificacao`, `fotos_nc` |
| Feed | `notificacoes`, `sync_conflitos` |
| Relatórios | `relatorios_agendados`, `log_relatorios` |
| Auditoria | `audit_log` (triggers Fase 2) |

**Decisões de modelagem:**
- Usuário pode pertencer a múltiplos clientes (N:N)
- Permissão por obra é binária (tem ou não tem)
- Obras/unidades: hard delete permitido
- Serviços: soft delete (arquivar)
- Fotos NC: 1-5 por item, GPS opcional
- Reinspeção não exige foto
- Categorias de serviço: ENUM fixo (11 categorias)
- Notificações persistidas (feed é core feature)

**Diagrama simplificado:**
```
Cliente → Obras → Agrupamentos → Unidades
                                    ↓
Serviços → Verificações (1 por unidade+serviço)
    ↓              ↓
Itens Serviço → Itens Verificação → Fotos NC
```

---

## ✅ SESSÃO 4 CONCLUÍDA: PERMISSÕES E SEGURANÇA

### **Seção 11: Permissões e Segurança** ✅

**Arquivo:** `database/rls-policies.sql`

**Matriz de Permissões:**
- Admin: tudo (incluindo editar verificações concluídas)
- Engenheiro: só adiciona serviços à obra (não edita biblioteca)
- Inspetor: só vê as próprias verificações

**Autenticação:**
- Supabase Auth (email + senha)
- Sessão: 30 dias de inatividade
- 2FA e SSO: Fase 2

**LGPD:**
- Base legal: execução de contrato + interesse legítimo + obrigação regulatória
- Retenção: enquanto ativo + 90 dias após cancelamento
- Exclusão de conta: self-service

**Auditoria:**
- Log de ações críticas (excluir verificação, editar concluída, excluir usuário)
- Retenção: mesmo período da conta
- Super Admin: log automático obrigatório

**RLS Policies:**
- 4 funções auxiliares (get_user_cliente_id, get_user_perfil, etc)
- Políticas para todas 22 tabelas
- Inspetor só vê próprias verificações (decisão importante!)

---

## ✅ SESSÃO 5 CONCLUÍDA: ROADMAP E LANÇAMENTO

### **Seção 14: Roadmap** ✅

**Timeline:**
- **MVP:** 3 meses (ritmo intenso)
- **Beta:** 1-2 construtoras parceiras, 4-8 semanas
- **Lançamento Público:** Mês 6
- **Fase 2:** Meses 7-12

**Fases do Produto:**

| Fase | Conteúdo |
|------|----------|
| **MVP** | Portal Web + App Android, 4 relatórios, sync offline, multi-tenancy |
| **Fase 2** | Relatórios com IA → iOS → Condições de Início → 2FA/SSO |
| **Fase 3** | Dashboard Telão, Integrações ERPs, API pública |

**Onboarding Híbrido:**
- **Self-service (padrão):** Construtora cria conta sozinha, tour guiado, central de ajuda
- **White-glove (estratégico):** Venda presencial, setup completo, para contas grandes

**Metas Ano 1:**
- 10-20 construtoras pagantes
- MRR: R$ 5.000-15.000
- Churn: < 5%
- NPS: > 40

---

## ❌ SEÇÃO REMOVIDA DO PRD

### **Seção 12: Design System**
- Design System é documento técnico separado: `DESIGN-SYSTEM.md` (2110 linhas)
- PRD deve focar em requisitos de produto, não detalhes de implementação UI

---

## ✅ PRD COMPLETO - PRONTO PARA DESENVOLVIMENTO

---

## 🧠 PRINCÍPIOS APLICADOS (CRÍTICOS!)

### **1. Zero Ambiguidade**
- Uma única forma de fazer cada coisa
- Facilita IA desenvolver código consistente
- Exemplo: TODO estado global = Zustand (nunca Context API)

### **2. Consistência Total Web + Mobile**
- Mesmas ferramentas onde possível (Zustand, RHF+Zod, TypeScript)
- IA aprende 1x, aplica 2x

### **3. Praticidade e Gestão**
- Decisões pensando em dev solo com pouco conhecimento
- Priorizar simplicidade sobre flexibilidade
- Exemplo: Next.js (roteamento incluído) vs React+Vite (mais decisões)

### **4. Offline-First no Mobile**
- Inspetores trabalham sem wifi o dia todo
- SQLite robusto (não IndexedDB web)
- First write wins (não last write wins)

### **5. Performance Nativa**
- App mobile = Expo (nativo real), NÃO PWA
- PWA não aguenta 50 verificações offline + fotos

---

## 💰 CUSTOS RECORRENTES (Ano 1)

| Serviço | Custo |
|---------|-------|
| Supabase Pro | $25/mês |
| Storage adicional (~200GB) | $4/mês |
| EAS Build (Expo) | $29/mês |
| Google Play Store (único) | $25 |
| **TOTAL ANO 1** | **$721** |

---

## 📊 VOLUMETRIA CALCULADA (100 Construtoras, Ano 1)

**Dados estruturados:**
- 5.000 verificações/dia
- ~7 MB/dia
- **~2.5 GB/ano**

**Fotos:**
- 1.000 fotos/dia (NCs)
- Comprimidas: 800 KB cada
- 800 MB/dia
- **~292 GB/ano**

**Total:** ~295 GB → cabe no Supabase Pro tranquilamente

---

## 👨‍💻 CONTEXTO DO DESENVOLVEDOR

- **Dev solo** com pouco conhecimento
- **Nunca usou React Native** antes (aprendendo Expo)
- **Experiência prévia:** Supabase
- **Não tem:** Celular Android físico, conta Google Play
- **Estratégia de testes:** Expo Go em celular Android emprestado

---

## 🎯 ESTADO ATUAL DO PRD

**Arquivo:** `ARDEN_FVS_PRD.md` (2.000+ linhas)

**Concluído:**
- ✅ Seções 1-9: Produto completo (funcionalidades, fluxos, usuários)
- ✅ Seção 10: Relatórios e Automações (4 relatórios MVP + agendamento)
- ✅ Seção 13.1: Database
- ✅ Seção 13.2: Backend
- ✅ Seção 13.3: Frontend Web
- ✅ Seção 13.4: Mobile (incluindo sync offline COMPLETA)
- ✅ Seção 13.5: Autenticação (Supabase Auth)
- ✅ Seção 13.6: Schema do Banco (22 tabelas, 9 ENUMs, indexes, triggers)
- ✅ Seção 11: Permissões e Segurança (RLS completo, LGPD, auditoria)

**Removido do PRD (documento separado):**
- ❌ Seção 12: Design System → `DESIGN-SYSTEM.md`

**Status:** ✅ PRD COMPLETO - Todas as seções bloqueantes definidas

---

## 🚀 COMO USAR ESTE DOCUMENTO NA PRÓXIMA SESSÃO

**Para a próxima IA:**

1. **Leia este arquivo COMPLETO primeiro** (economiza tempo vs ler PRD completo)
2. **Entenda o contexto:** Dev solo, pouco conhecimento, precisa de orientação consultiva
3. **Princípios fundamentais:** Zero ambiguidade, praticidade, consistência total
4. **Abordagem:** Fazer perguntas estratégicas antes de apresentar opções técnicas
5. **Foco:** Simplicidade e facilidade de gestão (não over-engineering)
6. **Continue de onde parou:** Próximos blocos são Seções 12 e 14

**Para o usuário:**

1. Compartilhe este arquivo com a próxima IA
2. Diga: "Leia @prd-continue.md para entender todo o contexto do projeto"
3. Indique qual seção quer continuar (Seção 12 ou 14)
4. A IA terá todo o contexto sem precisar ler o PRD completo

---

## 📝 OBSERVAÇÕES FINAIS

**Decisão mais complexa do projeto:** Sincronização offline (Seção 13.4)
- Granularidade por item
- First write wins
- Multi-obra por usuário
- Totalmente documentada com exemplos de código

**Decisão mais estratégica:** Expo vs PWA
- PWA não aguenta 50 verificações offline + fotos
- Expo tem performance nativa necessária
- Custo $373/ano é viável

**Filosofia de desenvolvimento:**
- Consultivo (fazer perguntas, entender contexto)
- Pragmático (MVP primeiro, features depois)
- Consistente (mesmas ferramentas web + mobile)
- Claro (zero ambiguidade para IA desenvolver)

---

**Arquivo atualizado em:** 2026-01-11
**Última sessão concluída:** Sessão 5 - Roadmap e Lançamento (Seção 14)
**Status:** ✅ PRD COMPLETO - Pronto para iniciar desenvolvimento do MVP
