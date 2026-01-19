# Arden FVS

## What This Is

Plataforma SaaS para gestao de qualidade na construcao civil, focada em verificacoes de servicos (FVS) para certificacao PBQP-H. O sistema permite que construtoras pequenas e medias gerenciem obras, unidades, servicos e verificacoes de qualidade de forma rapida e pratica.

**Usuario:** Engenheiro Civil com expertise em gestao de qualidade e obras, sem conhecimento tecnico em programacao. Precisa de apoio detalhado em cada etapa de desenvolvimento.

## Core Value

Trazer extrema rapidez e praticidade na verificacao de servicos, tornando a qualidade uma aliada (nao um entrave) do andamento da obra.

## Requirements

### Validated

<!-- Shipped and confirmed working -->

- [x] Setup Next.js 16 + React 19 + Tailwind CSS 4 — existing
- [x] Integracao Supabase (client/server/middleware) — existing
- [x] Autenticacao email/senha com Supabase Auth — existing
- [x] Rotas protegidas com middleware — existing
- [x] Landing page com CTAs — existing
- [x] Layout do app (sidebar + topbar) — existing
- [x] Dashboard placeholder — existing
- [x] Schema do banco de dados completo — existing
- [x] Design system com shadcn/ui (13 componentes) — existing

### Active

<!-- Current scope: Mes 1 MVP -->

- [ ] Gestao de Obras (CRUD completo)
- [ ] Gestao de Agrupamentos (criar, editar, excluir, vincular a obras)
- [ ] Gestao de Unidades (criar, editar, excluir, vincular a agrupamentos)
- [ ] Biblioteca FVS global (servicos e itens de verificacao)
- [ ] Ativar servicos por obra (obra_servicos)
- [ ] Home do Engenheiro com KPIs e feed de NCs
- [ ] Zustand para state management
- [ ] React Hook Form + Zod para validacao de formularios

### Out of Scope

<!-- Explicit boundaries for Mes 1 -->

- App Mobile (Expo) — Mes 2
- Verificacoes no portal web — Mes 2
- Sync offline — Mes 2
- Relatorios PDF — Mes 3
- Condicoes de Inicio (CI) — Fase 2
- Dashboard Telao — Fase 3
- Integracoes ERPs — Fase 3
- iOS — Fase 2
- 2FA/SSO — Fase 2

## Context

**Publico-alvo:** Construtoras pequenas/medias (4-1000 unidades) com certificacao PBQP-H.

**Modelo de dominio:**
- Obra > Agrupamento > Unidade (hierarquia de 2 niveis)
- Biblioteca FVS por construtora (nao compartilhada)
- Servico tem itens de verificacao (observacao, metodo, tolerancia)
- Verificacao = Servico + Unidade

**Volumetria tipica:**
- Obra: 15-25 servicos ativos
- Construtora pequena: ~40 servicos total
- Construtora grande: ~100 servicos total

**Documentacao existente:**
- `docs/product/` — PRD completo (10 documentos)
- `docs/design/` — Design system
- `database/schema.sql` — Schema PostgreSQL completo
- `.planning/codebase/` — Mapeamento do codigo atual

## Constraints

- **Tech stack**: Next.js 16 + React 19 + Supabase + shadcn/ui — ja definido
- **UI**: Usar APENAS componentes existentes em `arden/components/ui/` — consultar `docs/design/README.md`
- **Variaveis CSS**: Usar tokens do `globals.css` — nunca valores hardcoded
- **Multi-tenancy**: RLS via `cliente_id` — ja configurado no schema
- **Commits**: Em portugues, formato `tipo: descricao`

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hierarquia 2 niveis (Obra > Agrupamento > Unidade) | Simplicidade e flexibilidade para 99% dos casos | — Pending |
| Biblioteca FVS por construtora | Cada construtora tem seus padroes proprios | — Pending |
| Supabase como backend | Elimina necessidade de API layer, RLS nativo | — Pending |
| Schema SQL definido antes do frontend | Garante modelo de dados consistente | — Pending |

---
*Last updated: 2026-01-19 after initialization*
