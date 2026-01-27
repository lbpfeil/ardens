# Arden FVS — Contexto de Negócio

> Fonte de verdade sobre o Arden como empresa. Consumido por `/biz-research` e `/biz-sync`.
> Última atualização: 2026-01-27 (decisões app mobile)

## Identidade

- **Nome:** Arden FVS
- **Tipo:** SaaS B2B
- **Setor:** Construção civil — gestão de qualidade
- **Missão:** Destravar a gestão de qualidade na construção civil, tornando-a rápida, prática e acessível para construtoras pequenas e médias. Transformamos a qualidade de um obstáculo burocrático em uma aliada estratégica da obra.
- **Visão:** Até 2030, ser a plataforma de referência em gestão de qualidade para construtoras habitacionais no Brasil, impactando positivamente a qualidade de milhares de unidades entregues e estabelecendo um novo padrão de excelência acessível no setor.

## Produto

- **O que faz:** Plataforma SaaS para gestão de qualidade na construção civil. Permite executar, rastrear e documentar verificações de serviços (FVS) de forma rápida e prática, gerando automaticamente a documentação exigida por auditorias PBQP-H.
- **Problema que resolve:** Construtoras pequenas e médias enfrentam sistemas de gestão de qualidade lentos, complexos e caros. O resultado: verificações atrasadas, retrabalhos não rastreados, documentação trabalhosa para auditorias e desconexão entre qualidade e operação da obra.
- **Para quem:** Construtoras pequenas e médias (4 a 1.000 unidades habitacionais) que possuem ou buscam certificação PBQP-H. Mercado endereçável: 3.000+ construtoras certificadas PBQP-H no Brasil.
- **Funcionalidades core:**
  - Gestão de obras, agrupamentos e unidades
  - Biblioteca FVS (serviços e itens de verificação por construtora)
  - Execução de verificações com fotos de não-conformidades
  - Reinspeção de não-conformidades com rastreabilidade
  - App mobile offline-first com gestos intuitivos (swipe)
  - 4 relatórios MVP com agendamento automático e envio por email
  - Dashboard do engenheiro com KPIs e feed de NCs
  - Condições de Início (CI) — almoxarifado integrado ao ciclo de qualidade (opcional por obra)
  - Multi-tenancy com isolamento total por construtora
- **Estágio atual:** MVP (v1.0) entregue em 2026-01-24. Portal web funcional. Trabalhando na v1.1 (Verificações no Portal Web). App mobile ainda não iniciado.
- **Diferenciais técnicos:**
  - Velocidade extrema via gestos (swipe) no app mobile
  - Offline-first com sincronização automática (First Write Wins)
  - Condições de Início — almoxarifado integrado ao ciclo de qualidade
  - Self-service completo (onboarding sem consultoria, inovador no setor)
  - Verificações imutáveis (rastreabilidade total para auditoria PBQP-H)
  - Custo de infraestrutura extremamente baixo (~USD 31-51/mês)

## Mercado

- **Setor-alvo:** Construção civil — construtoras habitacionais com certificação PBQP-H
- **Tamanho estimado:** 3.000+ construtoras certificadas PBQP-H no Brasil (mercado endereçável direto)
- **Regulamentação relevante:**
  - **PBQP-H** (Programa Brasileiro da Qualidade e Produtividade do Habitat) — certificação obrigatória para acesso a financiamento bancário e programas habitacionais
  - **FVS** (Ficha de Verificação de Serviços) — documento fundamental exigido em auditorias PBQP-H
  - Normas técnicas NBR (referências normativas de construção)
- **Cenário competitivo:** (Pesquisa completa realizada em 2026-01-26 — ver `docs/business/research/`)
  - **Concorrente real:** Excel + WhatsApp + Papel (~80% das PMEs usam; apenas 13% do setor se considera digitalmente maduro)
  - **Diretos (Enterprise, FVS/qualidade):** AutoDOC (~1.200 clientes, R$ 76-100M aquisição pela Ambar), Mobuss, InMeta (+1.000 canteiros), Agilean, Stant, QualitTAB (+150 clientes)
  - **Indiretos (ERPs):** Sienge + Construpoint, TOTVS Construção, Gestor Obras, Mais Controle
  - **Genéricos (checklist):** Checklist Fácil, Produttivo, Inspeção Pro
  - **Internacionais:** PlanRadar (escritório em SP, $69M captados — monitorar), Procore, Fieldwire (Hilti)
  - **Benchmark LATAM:** Calidad Cloud (Chile) — SaaS de qualidade/obras similar ao Arden
  - **Espaço vazio confirmado:** Nenhum concorrente combina FVS/PBQP-H + preço acessível/transparente + self-service + UX moderna
- **Posicionamento:** O Arden se diferencia por ser rápido, prático e acessível. Enquanto concorrentes exigem consultoria, treinamento extenso e são voltados a construtoras grandes, o Arden é self-service, intuitivo e focado em construtoras pequenas/médias que acham os concorrentes complexos e caros demais.

## Modelo de negócio

- **Receita:** Assinatura mensal por quantidade de obras

  | Plano | Preço | Obras | Usuários |
  |-------|-------|-------|----------|
  | Básico | R$ 297/mês | Até 5 | Ilimitados |
  | Profissional | R$ 597/mês | Até 15 | Ilimitados |
  | PRO | R$ 997/mês | Ilimitadas | Ilimitados |

- **Trial:** 30 dias grátis, sem cartão de crédito, acesso completo
- **Ticket médio estimado:** R$ 297-597/mês (faixa dos planos Básico e Profissional, público-alvo principal)
- **Ciclo de venda:** Curto a médio. Decisor: engenheiro de qualidade ou dono da construtora. Self-service como padrão; white-glove para contas estratégicas.
- **Canais:** Self-service online (site → conta → trial → conversão). Onboarding sem consultoria como diferencial.
- **Custos de infraestrutura:** ~USD 31-51/mês (Supabase Pro $29, hospedagem $0-20, domínio $2)

## Metas — Ano 1

| Métrica | Meta |
|---------|------|
| Clientes pagantes | 10-20 construtoras |
| Obras ativas | 50-100 |
| Usuários ativos | 200-500 |
| Verificações/mês | 10.000-25.000 |
| MRR | R$ 5.000-15.000 |
| Churn mensal | < 5% |
| NPS | > 40 |
| Conversão trial → pago | > 20% |

## Empresa

- **Estágio:** Pré-revenue (produto em desenvolvimento, sem clientes pagantes)
- **Equipe:** Fundador solo (uma pessoa faz tudo: produto, código, vendas, marketing)
- **Recursos:** Bootstrapped (custos operacionais mínimos graças à stack escolhida)
- **Localização:** Brasil
- **Projeto iniciado em:** Janeiro 2026

## Validação

- **Conversas informais realizadas** com pessoas do setor de construção civil
- **Pitch com funcionalidades básicas** apresentado e bem aceito
- **1 cliente piloto confirmado** para teste gratuito em março de 2026
- **2 construtoras mapeadas** para validação/beta na documentação original

## Personas

| Persona | Papel | Interface |
|---------|-------|-----------|
| **Admin** | Gerente de qualidade ou dono da construtora. Configura tudo, gerencia usuários e planos. | Portal Web completo |
| **Engenheiro** | Responsável técnico. Configura obras, define serviços, supervisiona verificações, analisa relatórios. | Portal Web + App Mobile |
| **Inspetor** | Executa verificações em campo. Trabalha offline. Proporção típica: 2 por obra. | Apenas App Mobile |
| **Almoxarife** | Controla liberação de materiais com base em Condições de Início. | Portal Web simplificado |
| **Super Admin** | Equipe interna Arden. Suporte, gestão de contas, templates PBQP-H globais. | Interno |

## Terminologia do setor

| Termo | Significado |
|-------|-------------|
| **FVS** | Ficha de Verificação de Serviços — documento padrão PBQP-H |
| **PBQP-H** | Programa Brasileiro da Qualidade e Produtividade do Habitat |
| **NC** | Não Conformidade — item que não atende aos critérios de qualidade |
| **IRS** | Índice de Retrabalho por Serviço — (Itens com Retrabalho / Total Verificados) × 100. <10% saudável, 10-15% atenção, >15% crítico |
| **CI** | Condições de Início — pré-requisitos antes de iniciar um serviço |
| **Retrabalho** | NC corrigida e aprovada na reinspeção; impacta negativamente o IRS |
| **NBR** | Norma Brasileira — referências normativas técnicas |

## Decisões estratégicas já tomadas

1. **Self-service como modelo principal de onboarding** — diferencial no setor onde concorrentes exigem consultoria
2. **Pricing por obras (não por usuários)** — simplicidade e incentivo para construtora envolver toda a equipe
3. **Verificações imutáveis** — rastreabilidade total exigida pelo PBQP-H; apenas exclusão por Admin com justificativa
4. **Hierarquia de 2 níveis físicos + tags** — Obra > Agrupamento > Unidade (simplicidade, atende 99% dos casos)
5. **Biblioteca de serviços por cliente (não compartilhada)** — cada construtora tem controle total sobre seus FVS
6. **Condições de Início opcionais no MVP** — flexibilidade para diferentes níveis de maturidade
7. **Sincronização First Write Wins** — primeiro a sincronizar trava o item; conflitos no nível de item (não de verificação)
8. **Dark mode único** — sem opção de light mode
9. **Stack Supabase-first** — custo operacional mínimo (~$31-51/mês), ideal para bootstrapping
10. **Fotos comprimidas automaticamente** — sem limite de entrada, saída ~800 KB (UX transparente)
11. **Testes apenas em fluxos críticos no MVP** — E2E em 3 fluxos (login, verificação com foto, gerar PDF)
12. **Monorepo para web + mobile** — Next.js e Expo no mesmo repositório, compartilhando tipos, lógica de negócio e Supabase client
13. **App mobile como "Macintosh"** — UX excepcional é diferencial competitivo central; o app deve ser tão intuitivo que mude o padrão do setor
14. **Performance absurda como requisito** — 60fps constante, startup rápido, fluidez extrema em Android de baixo/médio custo (Samsung A, Moto G)

## Roadmap do produto

| Fase | Conteúdo | Status |
|------|----------|--------|
| **v1.0 MVP** | Portal web (obras, biblioteca FVS, dashboard, navegação) | Entregue (2026-01-24) |
| **v1.1** | Verificações no Portal Web | Em andamento |
| **Beta fechado** | 1-2 construtoras parceiras, uso gratuito + desconto | Planejado (março 2026) |
| **Fase 2** | App mobile Android, Condições de Início, iOS | Planejado |
| **Fase 3** | IA e automação, relatórios preditivos, integrações ERP | Futuro |

## Riscos mapeados

- **Atraso no MVP** — mitigação: buffer de 2-4 semanas
- **Sync offline com problemas** — risco médio, impacto alto (feature core)
- **Churn alto no beta** — mitigação: feedback constante
- **Concorrente lança produto similar** — mitigação: UX superior + modelo self-service. AutoDOC (Ambar, R$ 76M+) pode modernizar; PlanRadar ($69M, escritório em SP) pode localizar para PBQP-H
- **Escala futura** — arquitetura precisa ser reavaliada em 500+ construtoras

## Lacunas identificadas

- [ ] Visão formal de 1-3 anos (além de "elevar a qualidade da construção civil mundial")
- [x] Pesquisa estruturada de concorrentes — realizada em 2026-01-26 (ver `docs/business/research/`)
- [ ] Tamanho de mercado detalhado (TAM/SAM/SOM)
- [ ] Estratégia de marketing e canais de aquisição definidos
- [ ] Análise de unit economics (CAC, LTV, payback)
- [ ] Plano financeiro (runway, investimento necessário, break-even)
- [ ] Estratégia de pricing validada com clientes reais
- [ ] Personas refinadas com dados de clientes reais (pós-piloto)
- [ ] Plano de expansão geográfica (Estudo exploratório realizado: Foco em Portugal/ISO 9001)
- [ ] Propriedade intelectual / proteção de marca
