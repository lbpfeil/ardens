# ARDEN FVS — Referência de Documentação (AI-first)

## 0) O que é este arquivo
Você (IA) deve usar este documento como **mapa/índice** para navegar e manter a documentação do ARDEN FVS sem precisar “digerir” um único arquivo gigante.

Objetivo principal: **quebrar `ARDEN_FVS_PRD.md` em documentos menores**, com **fontes de verdade claras** e **zero contradição**.

---

## 1) Regras de ouro (para IA)

1) **Single Source of Truth (SSOT)**
- Cada assunto “mora” em **um** arquivo canônico.
- Outros arquivos podem **linkar**, mas não duplicar o conteúdo inteiro.

2) **Documento curto é documento utilizável**
- Meta: manter cada doc com ~100–400 linhas.
- Se passar de ~500 linhas: **split obrigatório**.

3) **Sem ambiguidade**
- Se existirem 2 trechos com decisões diferentes, isso é bug de documentação.
- Corrija consolidando a decisão em um “Decision Log” e removendo/ajustando o restante.

4) **Camadas de documentação**
- `product/`: o que é o produto, fluxos, regras de negócio, requisitos.
- `tech/`: como implementa (arquitetura, dados, sync, edge functions, segurança).
- `design/`: UI/UX e design system.
- `process/`: decisões, roadmap, pendências, glossário.

---

## 2) Leitura recomendada (ordem)

1. `DOCUMENTACAO_REFERENCIA.md` (este arquivo)
2. `prd-continue.md` (contexto rápido do projeto)
3. `ARDEN_FVS_PRD_SUMARIO.md` (sumário executivo alternativo)
4. SSOTs específicos conforme o tema:
   - Design: `DESIGN-SYSTEM.md`
   - Banco: `database/schema.sql`
   - Produto/Fluxos: (após migração) `docs/product/*`
   - Arquitetura: (após migração) `docs/tech/*`

---

## 3) Estrutura proposta de pastas/arquivos

Crie uma pasta `docs/` e organize assim:

- `docs/00_INDEX.md`
- `docs/00_FAST_CONTEXT.md` (opcional; pode ser o próprio `prd-continue.md` migrado)
- `docs/product/`
  - `01_OVERVIEW.md`
  - `02_PERSONAS_PERMISSIONS.md`
  - `03_INFORMATION_ARCHITECTURE.md`
  - `04_DOMAIN_MODEL.md`
  - `05_MOBILE_APP.md`
  - `06_WEB_PORTAL.md`
  - `07_ALMOXARIFE_CI.md`
  - `08_REPORTS_PRODUCT_SPEC.md`
  - `09_ROADMAP.md`
- `docs/tech/`
  - `01_ARCHITECTURE.md`
  - `02_DATABASE.md` (explica e referencia `database/schema.sql`)
  - `03_RLS_PERMISSIONS.md`
  - `04_OFFLINE_SYNC.md`
  - `05_EDGE_FUNCTIONS.md`
  - `06_IMAGE_PIPELINE.md`
  - `07_REPORTING_PIPELINE.md`
  - `08_SECURITY_LGPD.md`
  - `09_OBSERVABILITY.md`
  - `10_TESTING.md`
- `docs/design/`
  - `README.md` (linka para `DESIGN-SYSTEM.md` e define o que é SSOT)
  - (opcional) split futuro do design system, se necessário
- `docs/process/`
  - `DECISIONS.md` (Decision Log)
  - `OPEN_QUESTIONS.md` (pendências)
  - `GLOSSARY.md` (definições)

E uma pasta para “legado”:
- `archive/ARDEN_FVS_PRD.md` (opcional; mover depois que a migração estiver estável)

---

## 4) Mapeamento: PRD → novos documentos

Abaixo está o mapeamento sugerido. A regra é: **mova o conteúdo**, depois substitua no PRD por um link curto (para não duplicar).

### docs/product/01_OVERVIEW.md
Fonte principal:
- PRD §1 (Visão Geral e Contexto Estratégico)
- PRD §2 (Modelo de Negócio)

Conteúdo que deve viver aqui:
- Missão, problema, diferenciais, contexto PBQP-H
- Cliente-alvo e posicionamento
- Precificação e trial
- Go-to-market (self-service)

Ajustes recomendados:
- Transformar em **objetivos mensuráveis** (ex.: tempo médio de verificação, meta de adoção, etc.)

---

### docs/product/02_PERSONAS_PERMISSIONS.md
Fonte principal:
- PRD §3 (Personas e Usuários)
- PRD §11 (Permissões e Segurança) — parte “produto” (o que cada perfil pode fazer)

Conteúdo que deve viver aqui:
- Personas (Admin, Engenheiro, Inspetor, Almoxarife, Super Admin)
- Permissões em linguagem de produto (capabilities)
- Regras críticas: imutabilidade, quem pode deletar, logs obrigatórios

Ajustes recomendados:
- Separar “capabilities” (produto) de “RLS/policies” (técnico) → o técnico vai em `docs/tech/03_RLS_PERMISSIONS.md`

---

### docs/product/03_INFORMATION_ARCHITECTURE.md
Fonte principal:
- PRD §4 (Arquitetura de Navegação)

Conteúdo que deve viver aqui:
- Contextos: Visão Global vs Obra Específica vs Portal Almoxarife
- Módulos/menus por contexto
- Regras de navegação (ex.: seletor de contexto, sidebar primária/secundária)

Ajustes recomendados:
- Reduzir texto “descritivo” e incluir:
  - “o que o usuário precisa resolver em cada tela”
  - “navegação mínima do MVP”

---

### docs/product/04_DOMAIN_MODEL.md
Fonte principal:
- PRD §5 (Estrutura de Dados) — nível conceitual
- PRD §10.2 (Modelo de status) — regras de status

Conteúdo que deve viver aqui (sem SQL):
- Entidades e relações: Cliente → Obras → Agrupamentos → Unidades → Serviços → Verificações → Itens → NCs/Fotos
- Status (item, reinspeção, verificação) e regras
- IRS (definição, fórmula, interpretação)
- Invariantes: “verificações são imutáveis”, etc.

Ajustes recomendados:
- Unificar as descrições de conflito/sync (ver §6/§13.4) para não haver versões divergentes

---

### docs/product/05_MOBILE_APP.md
Fonte principal:
- PRD §6 (App Mobile — Verificações)

Conteúdo que deve viver aqui:
- Fluxos do app (seleção, feed, gestos, modal NC, reinspeção)
- Regras de UX (UNDO, animações, feedback, limites de foto)
- Requisitos offline do ponto de vista do usuário

Importante:
- Detalhes técnicos profundos de sync/SQLite **não** ficam aqui; vão em `docs/tech/04_OFFLINE_SYNC.md`

---

### docs/product/06_WEB_PORTAL.md
Fonte principal:
- PRD §7 (Portal Web — Obra Específica)
- PRD §8 (Portal Web — Visão Global)

Conteúdo que deve viver aqui:
- Home/NCs/KPIs, dashboard, verificações (tabela S×U, inspeção em massa, histórico)
- Serviços, não-conformidades, relatórios
- Visão global: gestão de obras, biblioteca FVS, usuários, faturamento

Ajustes recomendados:
- Para cada módulo: listar “entradas”, “saídas” e “ações em lote” (para virar backlog)

---

### docs/product/07_ALMOXARIFE_CI.md
Fonte principal:
- PRD §9 (Portal do Almoxarife)
- Partes de PRD §7.4 (Condições de Início)

Conteúdo que deve viver aqui:
- Conceito de CI e como afeta liberação
- Fluxos: entregar material, solicitar autorização, decisão do engenheiro
- O que é “feature opcional” e como muda o produto

---

### docs/product/08_REPORTS_PRODUCT_SPEC.md
Fonte principal:
- PRD §10 (Relatórios e Automações)

Conteúdo que deve viver aqui:
- Especificação de cada relatório (MVP/Fase 2/PRO)
- Campos, filtros, layout lógico (o que precisa aparecer)
- Regras do watermark (do ponto de vista do usuário/auditoria)

Importante:
- Implementação (PDF engine, cron, storage, email) vai em `docs/tech/07_REPORTING_PIPELINE.md`

---

### docs/product/09_ROADMAP.md
Fonte principal:
- PRD §14 (Roadmap)
- Apêndices (pendências)

Conteúdo que deve viver aqui:
- MVP vs Fase 2 vs PRO
- Critérios de sucesso
- Beta testing, onboarding, métricas

Ajustes recomendados:
- Converter “perguntas abertas” em checklist de decisão em `docs/process/OPEN_QUESTIONS.md`

---

### docs/tech/01_ARCHITECTURE.md
Fonte principal:
- PRD §13.1–13.5 (Supabase-first, web/mobile stack, auth)
- Trechos técnicos espalhados (ex.: geração de PDFs, jobs)

Conteúdo que deve viver aqui:
- Visão macro (frontends → supabase → DB/storage/edge)
- Responsabilidades por camada
- O que fica no client vs edge functions
- Limites e trade-offs aceitos

---

### docs/tech/02_DATABASE.md
Fonte principal:
- PRD §13.6 (schema) + `database/schema.sql` (SSOT real)

Conteúdo que deve viver aqui:
- Explicar como ler o schema e a intenção do modelo
- Convenções: chaves, multi-tenancy, triggers/contadores
- “Como evoluir schema sem quebrar auditoria”

SSOT:
- `database/schema.sql` é a fonte de verdade do SQL

---

### docs/tech/03_RLS_PERMISSIONS.md
Fonte principal:
- PRD §11 (Segurança) + PRD §13.5 (RLS/Auth) + regras do produto

Conteúdo que deve viver aqui:
- RLS: políticas por tabela, por perfil
- Casos especiais: Super Admin (Arden) com auditoria
- Logs de auditoria: eventos mínimos e retenção

Ajuste crítico:
- Garantir que “imutabilidade de verificações” esteja refletida no banco/policies

---

### docs/tech/04_OFFLINE_SYNC.md
Fonte principal:
- PRD §13.4 (Sync offline) + trechos relevantes do §6

Conteúdo que deve viver aqui:
- Protocolo de sync (download updates, upload batch, conflitos)
- Resolução de conflito (definir SSOT: **first write wins** no nível de item)
- Estrutura SQLite (tabelas locais, fila de sync, limpeza)
- RPCs/stored procedures esperadas

Ajuste crítico:
- Consolidar qualquer frase do PRD que sugira outra regra (ex.: “mais antiga vence”) explicando o escopo exato

---

### docs/tech/05_EDGE_FUNCTIONS.md
Fonte principal:
- PRD §10.7 (PDFs, agendamento, email)
- PRD §13.2 (Edge Functions)

Conteúdo que deve viver aqui:
- Lista de funções, inputs/outputs, responsabilidades
- Regras de idempotência e observabilidade

---

### docs/tech/06_IMAGE_PIPELINE.md
Fonte principal:
- PRD (watermark, compressão, storage)

Conteúdo que deve viver aqui:
- Pipeline: captura → compressão → watermark → upload → limpeza local
- Limites (tamanho, formato), EXIF/GPS

---

### docs/tech/07_REPORTING_PIPELINE.md
Fonte principal:
- PRD §10 (agendamentos, geração, storage, email)

Conteúdo que deve viver aqui:
- Como gerar PDF/Excel (tecnologia escolhida quando definir)
- Jobs agendados e timezone
- Retenção e links temporários

---

### docs/tech/08_SECURITY_LGPD.md
Fonte principal:
- PRD §11 (pendências) + qualquer regra regulatória

Conteúdo que deve viver aqui:
- LGPD (papéis, retenção, exclusão)
- Backups e retenção
- Criptografia (em trânsito / em repouso / campos sensíveis)

---

### docs/design/README.md
SSOT atual:
- `DESIGN-SYSTEM.md` já é um documento grande e detalhado.

Como usar:
- `DESIGN-SYSTEM.md` continua sendo SSOT para UI.
- `docs/design/README.md` deve ser curto e apontar “onde achar o quê” dentro do design system.

Split opcional (se necessário):
- Se `DESIGN-SYSTEM.md` ficar pesado demais, quebrar em:
  - `docs/design/TOKENS.md`
  - `docs/design/COMPONENTS.md`
  - `docs/design/LAYOUTS.md`
  - `docs/design/ACCESSIBILITY.md`

---

## 5) O que fazer com os arquivos existentes (estado atual)

- `ARDEN_FVS_PRD.md`
  - Durante a migração: manter como “fonte original”.
  - Depois: mover para `archive/` e transformar num índice com links.

- `prd-continue.md`
  - Pode virar `docs/00_FAST_CONTEXT.md` (ou continuar no root, mas linkado pelo índice).

- `ARDEN_FVS_PRD_SUMARIO.md`
  - Se ficar redundante com `prd-continue.md`, escolha um SSOT de “contexto rápido” e mantenha só um como principal.

- `DESIGN-SYSTEM.md`
  - Continua SSOT de UI/UX.

- `database/schema.sql`
  - Continua SSOT de schema.

---

## 6) Contradições/ajustes a resolver DURANTE a migração

1) **Listas de “pendentes” vs decisões já consolidadas**
- Centralizar decisões em `docs/process/DECISIONS.md`.
- Remover do PRD qualquer “opções em análise” já decididas.

2) **Conflitos de sync: “first write wins” vs “mais antiga vence”**
- Definir claramente:
  - o que é conflito de item
  - o que é duplicidade de verificação
  - qual regra vale em cada nível

3) **Hard delete vs rastreabilidade/auditoria**
- Se o produto é voltado a auditoria, definir política clara:
  - apagar é permitido quando?
  - arquivar é preferível?
  - quais logs são obrigatórios?

---

## 7) Como a IA deve manter a documentação (processo)

Sempre que você (IA) fizer mudanças relevantes:

1) Atualize primeiro o SSOT do tema:
- Produto/fluxo → `docs/product/...`
- Regra de domínio/status → `docs/product/04_DOMAIN_MODEL.md`
- Banco → `database/schema.sql` + `docs/tech/02_DATABASE.md`
- Sync → `docs/tech/04_OFFLINE_SYNC.md`
- UI → `DESIGN-SYSTEM.md`

2) Registre decisão relevante em `docs/process/DECISIONS.md`:
- Data
- Decisão
- Motivo
- Impacto

3) Mantenha `docs/process/OPEN_QUESTIONS.md` pequeno e objetivo:
- Perguntas abertas com “qual decisão falta” e “impacto no MVP”.

---

## 8) Próximo passo sugerido

Quando você estiver pronto para executar a migração:
1) Criar `docs/00_INDEX.md` e os arquivos vazios listados acima.
2) Migrar por blocos: (i) overview/personas/domain, (ii) mobile+sync, (iii) web portal, (iv) reports, (v) tech.
3) No final, reduzir `ARDEN_FVS_PRD.md` para um “índice legado” com links.

Atualizado em: 2026-01-11
