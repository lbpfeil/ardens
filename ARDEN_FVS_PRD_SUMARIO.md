# ARDEN FVS - PRD SUMÁRIO EXECUTIVO

**Propósito:** Este documento resume o PRD completo (3550+ linhas) para facilitar a compreensão rápida pela IA. Para detalhes completos, consulte o arquivo `ARDEN_FVS_PRD.md`.

---

## VISÃO GERAL DO PRODUTO

**O que é:** SaaS para gestão de qualidade na construção civil (FVS - Ficha de Verificação de Serviços)

**Missão:** Trazer extrema rapidez e praticidade na verificação de serviços para certificação PBQP-H

**Cliente-alvo:** Construtoras pequenas/médias que acham ferramentas concorrentes complexas (3.000+ construtoras certificadas PBQP-H no Brasil)

**Diferenciais:**
1. Velocidade extrema (app mobile com gestos intuitivos)
2. Condições de Início (CI) - integração almoxarifado + qualidade
3. IA e automação (relatórios agendados, alertas preditivos)
4. Flexibilidade (sistema se adapta ao workflow da construtora)

---

## MODELO DE NEGÓCIO

| Plano | Preço/mês | Obras | Features |
|-------|-----------|-------|----------|
| Básico | R$ 297 | Até 5 | Usuários ilimitados, relatórios básicos |
| Profissional | R$ 597 | Até 15 | IA, automações, dashboard, relatórios avançados |
| PRO | R$ 997 | Ilimitadas | API, integrações, suporte dedicado |

**Trial:** 30 dias grátis sem cartão

---

## PERSONAS E PERMISSÕES

| Persona | Acesso | Responsabilidades |
|---------|--------|-------------------|
| **Administrador** | Portal Web completo | Configurar obras, biblioteca FVS, usuários, automações |
| **Engenheiro** | Portal Web (obras atribuídas) + App Mobile | Fazer/aprovar verificações, dashboards, relatórios |
| **Inspetor** | App Mobile apenas | Verificações em campo, fotos de NCs |
| **Almoxarife** | Portal Web simplificado | Condições de Início, liberação de materiais |
| **Super Admin (Arden)** | Todas contas (com log) | Suporte, gerenciar planos |

---

## ESTRUTURA DE DADOS

### Hierarquia de Obras (2 Níveis + Tags)
```
OBRA
├─ AGRUPAMENTO (Quadra A, Torre 1, etc.)
   └─ UNIDADES (Casa A01, Apto 201, etc.)
```
- **Tags:** Filtros opcionais (Etapa 1, Financiamento Caixa, etc.)
- **Empreendimentos:** Agrupamento virtual de múltiplas obras

### Biblioteca FVS (por construtora)
- Volumetria típica: 15-25 serviços/obra, 40-100 serviços/construtora
- Estrutura: Código, Nome, Itens de verificação (Observação, Método, Tolerância)
- Importação: Excel/CSV ou criação manual

### Status de Verificação
**Primeira inspeção:** Não Verificado → Conforme / Não Conforme / Exceção

**Reinspeção (se NC):**
- Conforme após reinspeção (não era problema real)
- Retrabalho (correção necessária) ← **Impacta IRS**
- Aprovado com concessão (defeito tolerável aceito)
- Reprovado após retrabalho (problema persiste)

**Fórmula IRS:** `(Itens com Retrabalho / Total Verificados) × 100`

---

## APP MOBILE

**Framework:** Expo (React Native)
**Plataforma MVP:** Android

**Características:**
- ✅ Offline-first (SQLite local)
- ✅ Sincronização automática ao detectar WiFi
- ✅ Gestos: Swipe direita (Conforme) / Swipe esquerda (NC/Exceção)
- ✅ Feed vertical com containers de verificações
- ✅ Haptic feedback + sons configuráveis

**Fluxo de Verificação:**
1. Seleciona obra → modo de seleção (Serviço→Unidades ou Unidade→Serviços)
2. Filtro de status (Não Avaliado / NC / Todos)
3. Feed de itens → swipe para verificar
4. NC: Modal com observação obrigatória + até 5 fotos (watermark automático)

**Sincronização Offline:**
- Salvamento instantâneo no SQLite local
- Sync automática quando detecta WiFi
- Conflito: **First Write Wins** (primeiro a sincronizar vence)
- Upload em batch (economiza requests)

---

## PORTAL WEB

### Contextos de Navegação

**Visão Global (Admin):**
- Dashboard comparativo entre obras
- Gerenciar Obras, Biblioteca FVS, Usuários
- Relatórios consolidados, Configurações, Plano/Faturamento

**Obra Específica (Engenheiro/Admin):**
- Home: Feed de NCs + KPIs
- Dashboard com gráficos
- Verificações: Tabela S×U, Inspeção em massa, Histórico
- Serviços, NCs, Relatórios, Almoxarifado, Equipe, Configurações

**Portal Almoxarife (simplificado):**
- Condições de Início
- Liberações Pendentes
- Relatório de Materiais

### Interface: Inspiração Supabase
- Dark mode único
- Sidebar primária (56px, ícones)
- Sidebar secundária (240px, condicional)
- Command Palette (⌘K)

---

## RELATÓRIOS

### MVP
| Relatório | Formato | Geração |
|-----------|---------|---------|
| FVS por Grupo de Unidades | PDF | Sob demanda |
| RNC (Não Conformidades) | PDF | Sob demanda + Semanal (seg 7h) |
| Dashboard Executivo | PDF + Excel | Sob demanda + Mensal (dia 1, 8h) |
| Eficiência de Correção | PDF | Semanal (sex 16h) |

### Fase 2
- Relatório de Tendências (análise estatística)

### Plano PRO
- Análise Preditiva de NCs (Machine Learning)

---

## STACK TÉCNICA (✅ CONSOLIDADA)

### Backend/Database
- **Banco:** PostgreSQL 15+ via Supabase
- **BaaS:** Supabase (Auth, Storage, RLS, Realtime)
- **Serverless:** Edge Functions (Deno)
- **Multi-tenancy:** Row Level Security (RLS)

### Frontend Web
- **Framework:** Next.js 15+ (App Router)
- **Estilização:** Tailwind CSS + Radix UI
- **Estado Global:** Zustand
- **Formulários:** React Hook Form + Zod
- **Gráficos:** Recharts
- **Hospedagem:** Vercel

### Mobile
- **Framework:** Expo (React Native)
- **Navegação:** React Navigation
- **Estado Global:** Zustand
- **Offline:** SQLite (expo-sqlite)
- **Câmera:** expo-camera + expo-image-manipulator
- **Build:** EAS Build ($29/mês)

### Princípios de Desenvolvimento
- Zero ambiguidade (uma única forma de fazer cada coisa)
- TypeScript strict mode em todo projeto
- Mesmas bibliotecas web + mobile (Zustand, RHF+Zod)

---

## CUSTOS ESTIMADOS (Ano 1)

| Item | Mensal | Anual |
|------|--------|-------|
| Supabase Pro | $29 | $348 |
| Hospedagem Web (Vercel) | $0-20 | $0-240 |
| EAS Build (Expo) | $29 | $348 |
| Google Play Store | - | $25 |
| **TOTAL** | ~$58-78 | ~$721-961 |

---

## SEÇÕES PENDENTES NO PRD

### 11. Permissões e Segurança ⏳
- Estratégia de tokens (JWT)
- 2FA, SSO
- LGPD, backup, criptografia
- Formato de logs de auditoria

### 12. Design System e UI/UX ⏳
- Paleta de cores completa (hex codes)
- Tipografia e hierarquia
- Biblioteca de componentes detalhada
- Responsividade e breakpoints
- Animações e transições

### 14. Roadmap ⏳
- Cronograma realista
- Definição de MVP mínimo
- Critérios de sucesso
- Plano de beta testing

---

## REFERÊNCIA RÁPIDA: ONDE ENCONTRAR NO PRD

| Tópico | Seção | Linhas (aprox) |
|--------|-------|----------------|
| Visão Geral e Contexto | §1 | 28-73 |
| Modelo de Negócio | §2 | 76-108 |
| Personas e Usuários | §3 | 111-208 |
| Arquitetura de Navegação | §4 | 211-307 |
| Estrutura de Dados | §5 | 310-462 |
| App Mobile | §6 | 465-641 |
| Portal Web - Obra | §7 | 644-912 |
| Portal Web - Visão Global | §8 | 915-1176 |
| Portal do Almoxarife | §9 | 1179-1258 |
| Relatórios e Automações | §10 | 1262-1833 |
| Aspectos Técnicos | §13 | 1936-3367 |
| Sincronização Offline | §13.4 | 2467-2997 |
| Schema de Banco | §13.6 | 3058-3194 |

---

## DECISÕES-CHAVE JÁ TOMADAS

1. ✅ **Supabase** como BaaS (PostgreSQL + Auth + Storage + Edge Functions)
2. ✅ **Next.js** para portal web (App Router)
3. ✅ **Expo** para app mobile (não PWA)
4. ✅ **Zustand** para estado global (web + mobile)
5. ✅ **React Hook Form + Zod** para formulários/validação
6. ✅ **Recharts** para gráficos
7. ✅ **SQLite** para offline (expo-sqlite)
8. ✅ **First Write Wins** para resolução de conflitos offline
9. ✅ **Dark mode único** (inspiração Supabase)
10. ✅ **Hierarquia 2 níveis** (Agrupamento → Unidade) + Tags

---

## FLUXOS CRÍTICOS

### Verificação no App
```
Abrir App → Selecionar Obra → Escolher Serviço/Unidades →
Filtrar por Status → Feed de Itens →
Swipe Direita (Conforme) ou Swipe Esquerda (NC/Exceção) →
Se NC: Modal (Observação + Fotos) → Salvar Local →
Sync quando WiFi disponível
```

### Condições de Início (Almoxarife)
```
Empreiteiro solicita material →
Almoxarife consulta sistema →
Se CI aprovada: Libera + Registra entrega
Se CI bloqueada: Nega OU Solicita autorização ao Engenheiro
```

### Sincronização Offline
```
Trabalho offline (SQLite local) →
Detecta WiFi →
Download: Novas verificações + Itens preenchidos por outros →
Upload: Batch de itens pendentes →
Servidor aceita/rejeita (first write wins) →
Limpa dados locais sincronizados →
Notifica conflitos no feed
```

---

*Última atualização: Janeiro 2026*
*PRD versão: 1.0 (Parcial - Seções 1-10 Consolidadas)*
