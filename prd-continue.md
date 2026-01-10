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

## ⏳ O QUE FALTA DEFINIR (PRÓXIMAS SESSÕES)

### **Seção 10: Relatórios e Automações**
- [ ] Estrutura de cada tipo de relatório (FVS individual, RNC, Consolidado, IRS)
- [ ] Diferenças PDF vs Excel
- [ ] Priorização por fase (MVP vs Fase 2)
- [ ] Lógica de agendamento automático

### **Seção 11: Permissões e Segurança**
- [ ] RLS Policies detalhadas (SQL completo)
- [ ] Matriz de permissões granular
- [ ] 2FA: quando implementar?
- [ ] SSO (Google, Microsoft): quando?
- [ ] LGPD: políticas, DPO, termos de uso
- [ ] Auditoria: quais eventos logar, retenção

### **Seção 12: Design System e UI/UX**
- [ ] Integrar DESIGN-SYSTEM.md no PRD
- [ ] Breakpoints exatos de responsividade
- [ ] Portal web funciona em mobile? (ou só desktop?)
- [ ] Acessibilidade: padrão WCAG (A, AA, AAA)?
- [ ] Animações essenciais

### **Seção 13.6: Schema do Banco de Dados**
- [ ] SQL completo de TODAS as tabelas
- [ ] Relacionamentos (foreign keys)
- [ ] Indexes para performance
- [ ] Triggers necessários
- [ ] Migrations strategy

### **Seção 14: Roadmap**
- [ ] Timeline MVP (quantos meses?)
- [ ] Fase Beta: quantos clientes? critérios?
- [ ] Estratégia de onboarding (como construtora começa?)
- [ ] Plano de crescimento (100 → 500 construtoras)

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

**Arquivo:** `ARDEN_FVS_PRD.md` (1.800+ linhas)

**Concluído:**
- ✅ Seções 1-9: Produto completo (funcionalidades, fluxos, usuários)
- ✅ Seção 13.1: Database
- ✅ Seção 13.2: Backend
- ✅ Seção 13.3: Frontend Web
- ✅ Seção 13.4: Mobile (incluindo sync offline COMPLETA)
- ✅ Seção 13.5: Autenticação (Supabase Auth)

**Pendente:**
- ⏳ Seção 10: Relatórios e Automações
- ⏳ Seção 11: Permissões e Segurança
- ⏳ Seção 12: Design System
- ⏳ Seção 13.6: Schema do Banco
- ⏳ Seção 14: Roadmap

---

## 🚀 COMO USAR ESTE DOCUMENTO NA PRÓXIMA SESSÃO

**Para a próxima IA:**

1. **Leia este arquivo COMPLETO primeiro** (economiza tempo vs ler PRD completo)
2. **Entenda o contexto:** Dev solo, pouco conhecimento, precisa de orientação consultiva
3. **Princípios fundamentais:** Zero ambiguidade, praticidade, consistência total
4. **Abordagem:** Fazer perguntas estratégicas antes de apresentar opções técnicas
5. **Foco:** Simplicidade e facilidade de gestão (não over-engineering)
6. **Continue de onde parou:** Próximos blocos são Seções 10-12 e 13.6

**Para o usuário:**

1. Compartilhe este arquivo com a próxima IA
2. Diga: "Leia @prd-continue.md para entender todo o contexto do projeto"
3. Indique qual seção quer continuar (Seção 10, 11, 12 ou 13.6)
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

**Arquivo gerado em:** 2025-01-10
**Última sessão concluída:** Sessão 1 - Stack Técnica (Blocos 1-4)
**Próxima sessão:** Seção 10 (Relatórios) ou Seção 11 (Segurança) ou Seção 12 (Design System)
