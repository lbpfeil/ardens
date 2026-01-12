# ARDEN FVS - Documentacao

## Mapa da Documentacao

Este documento serve como indice central para toda a documentacao do projeto ARDEN FVS.

---

## Leitura Recomendada (Ordem)

1. **Este arquivo** (`docs/00_INDEX.md`) - Mapa geral
2. **Contexto rapido** - `prd-continue.md` (na raiz)
3. **SSOTs especificos** conforme o tema abaixo

---

## Estrutura de Documentos

### Produto (`docs/product/`)

| Arquivo | Conteudo | SSOT para |
|---------|----------|-----------|
| [01_OVERVIEW.md](product/01_OVERVIEW.md) | Visao geral, problema, diferenciais, cliente-alvo | Missao e posicionamento |
| [02_BUSINESS_MODEL.md](product/02_BUSINESS_MODEL.md) | Precificacao, planos, go-to-market | Modelo de negocio |
| [03_PERSONAS.md](product/03_PERSONAS.md) | Perfis de usuario e suas responsabilidades | Quem usa o sistema |
| [04_NAVIGATION.md](product/04_NAVIGATION.md) | Arquitetura de navegacao, contextos, sidebars | Estrutura do portal |
| [05_DOMAIN_MODEL.md](product/05_DOMAIN_MODEL.md) | Entidades, status, IRS, invariantes | Regras de dominio |
| [06_MOBILE_APP.md](product/06_MOBILE_APP.md) | Fluxos do app, gestos, feed, reinspeção | App mobile (produto) |
| [07_WEB_PORTAL.md](product/07_WEB_PORTAL.md) | Portal web - obra especifica e visao global | Portal web (produto) |
| [08_ALMOXARIFE.md](product/08_ALMOXARIFE.md) | Portal do almoxarife, condicoes de inicio | CI e liberacoes |
| [09_REPORTS.md](product/09_REPORTS.md) | Especificacao de relatorios (o que, nao como) | Relatorios (produto) |
| [10_ROADMAP.md](product/10_ROADMAP.md) | Fases, metas, cronograma, riscos | Planejamento |

### Tecnico (`docs/tech/`)

| Arquivo | Conteudo | SSOT para |
|---------|----------|-----------|
| [01_ARCHITECTURE.md](tech/01_ARCHITECTURE.md) | Stack, decisoes, camadas, Edge Functions | Arquitetura geral |
| [02_DATABASE.md](tech/02_DATABASE.md) | Explicacao do schema, convencoes | Banco de dados |
| [03_RLS_PERMISSIONS.md](tech/03_RLS_PERMISSIONS.md) | Politicas RLS, matriz de permissoes | Seguranca de dados |
| [04_OFFLINE_SYNC.md](tech/04_OFFLINE_SYNC.md) | Protocolo sync, SQLite, conflitos | Sincronizacao mobile |
| [05_FRONTEND_WEB.md](tech/05_FRONTEND_WEB.md) | Next.js, Zustand, RHF+Zod, Recharts | Stack web |
| [06_MOBILE_TECH.md](tech/06_MOBILE_TECH.md) | Expo, camera, navegacao | Stack mobile |
| [07_REPORTING_PIPELINE.md](tech/07_REPORTING_PIPELINE.md) | Geracao de PDFs, agendamento, email | Pipeline de relatorios |
| [08_SECURITY_LGPD.md](tech/08_SECURITY_LGPD.md) | LGPD, auditoria, backup, criptografia | Compliance |

### Design (`docs/design/`)

| Arquivo | Conteudo | SSOT para |
|---------|----------|-----------|
| [README.md](design/README.md) | Indice do design system | Navegacao |
| [DESIGN-SYSTEM.md](design/DESIGN-SYSTEM.md) | Design system completo | UI/UX (SSOT principal) |

### Processo (`docs/process/`)

| Arquivo | Conteudo | SSOT para |
|---------|----------|-----------|
| [DECISIONS.md](process/DECISIONS.md) | Log de decisoes tomadas | Historico de decisoes |
| [OPEN_QUESTIONS.md](process/OPEN_QUESTIONS.md) | Pendencias e questoes abertas | O que falta decidir |
| [GLOSSARY.md](process/GLOSSARY.md) | Definicoes de termos | Terminologia |

---

## Arquivos na Raiz

| Arquivo | Proposito |
|---------|-----------|
| `ARDEN_FVS_PRD.md` | PRD original (referencia legada, use os docs fragmentados) |
| `DOCUMENTACAO_REFERENCIA.md` | Guia de fragmentacao (este plano) |
| `prd-continue.md` | Contexto rapido do projeto |
| `WARP.md` | Guia para IAs (Warp) |
| `database/schema.sql` | **SSOT** do schema SQL |
| `database/rls-policies.sql` | **SSOT** das politicas RLS |

---

## Regras de Manutencao

### Single Source of Truth (SSOT)

- Cada assunto tem **um** arquivo canonico
- Outros podem **linkar**, mas nao duplicar conteudo
- Se houver conflito, o SSOT vence

### Tamanho

- Meta: 100-400 linhas por documento
- Se passar de 500 linhas: split obrigatorio

### Atualizacoes

1. Atualize primeiro o SSOT do tema
2. Registre decisoes relevantes em `docs/process/DECISIONS.md`
3. Remova duplicacoes do PRD original

---

*Atualizado em: 2026-01-12*
