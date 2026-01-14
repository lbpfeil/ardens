# Log de Decisoes - ARDEN FVS

## Como Usar Este Arquivo

Registre aqui decisoes importantes que afetam o produto ou arquitetura.

**Formato:**
```
### [DATA] Titulo da Decisao

**Contexto:** Por que essa decisao foi necessaria
**Decisao:** O que foi decidido
**Alternativas:** O que foi considerado e descartado
**Impacto:** O que muda com essa decisao
```

---

## Decisoes Registradas

### [2026-01] Stack Tecnica Definida

**Contexto:** Necessidade de definir tecnologias antes de iniciar desenvolvimento.

**Decisao:**
- Backend: Supabase-first (sem servidor tradicional)
- Web: Next.js 15+ com App Router
- Mobile: Expo (React Native)
- Estado: Zustand (unica fonte)
- Forms: React Hook Form + Zod
- Graficos: Recharts

**Alternativas descartadas:**
- Backend Node.js/Express (complexidade desnecessaria)
- PWA para mobile (performance insuficiente)
- Redux (boilerplate excessivo)
- Context API (ambiguidade)

**Impacto:** Stack consistente entre web e mobile, menor curva de aprendizado.

---

### [2026-01] Estrategia de Sync: First Write Wins

**Contexto:** Multiplos inspetores trabalhando offline na mesma obra.

**Decisao:** Primeiro a sincronizar um item trava o item. Segundo e rejeitado.

**Alternativas descartadas:**
- Last write wins (perde trabalho)
- Merge automatico (complexo demais)
- Bloqueio pessimista (impossivel offline)

**Impacto:** Simplicidade na resolucao de conflitos, possivel perda de trabalho em casos raros.

---

### [2026-01] Granularidade de Sync por Item

**Contexto:** Definir nivel de conflito na sincronizacao.

**Decisao:** Conflitos sao detectados no nivel de ITEM, nao de servico ou verificacao.

**Alternativas descartadas:**
- Por servico (muito grosseiro)
- Por verificacao (impede trabalho paralelo)

**Impacto:** Dois inspetores podem trabalhar no mesmo servico/unidade em itens diferentes.

---

### [2026-01] Verificacoes Imutaveis

**Contexto:** Garantir rastreabilidade para auditorias PBQP-H.

**Decisao:** Verificacoes nao podem ser editadas apos salvas. Apenas exclusao por Admin com justificativa.

**Impacto:** Integridade dos dados para auditoria, complexidade adicional para corrigir erros.

---

### [2026-01] Dark Mode Unico

**Contexto:** Definir tema visual do portal.

**Decisao:** Apenas dark mode, sem opcao de light mode.

**Alternativas descartadas:**
- Tema claro (menos diferenciado)
- Opcao de troca (mais trabalho de manutencao)

**Impacto:** Design consistente, economia de tempo, alinhamento com Supabase.

---

### [2026-01] Condicoes de Inicio no MVP (Opcional por Obra)

**Contexto:** Algumas construtoras ja tem processos de almoxarifado, outras nao.

**Decisao:** CI entra no MVP como feature que pode ser ativada/desativada por obra.

**Impacto:** Flexibilidade para diferentes workflows, Portal Almoxarife disponivel desde o MVP.

---

### [2026-01] Geracao de PDF via Cloud Function + Puppeteer

**Contexto:** Relatorios do Arden incluem tabelas complexas, graficos (Recharts) e fotos com watermark. Edge Functions (Deno) tem restricoes que eliminam bibliotecas tradicionais como jsPDF e pdfmake.

**Decisao:** Usar Google Cloud Function com Puppeteer para geracao de todos os PDFs.

**Alternativas descartadas:**
- jsPDF: Depende de DOM/html2canvas, nao roda em server-side
- pdfmake: API verbosa, problemas com Edge Functions, sem suporte nativo a graficos
- pdf-lib: Funciona em Edge Functions mas muito limitado para layouts complexos
- Servicos externos (DocRaptor): Custo recorrente desnecessario

**Arquitetura:**
```
Portal Web → Cloud Function (GCP) → Puppeteer renderiza HTML → PDF → Supabase Storage → URL
```

**Impacto:**
- Relatorios com qualidade visual alta (renderiza HTML/CSS real)
- Graficos Recharts renderizados como SVG nativo
- Reuso de componentes React do portal para templates
- Cold start de ~2-5 segundos na primeira execucao
- Custo por execucao: ~$0.0001

---

### [2026-01] Provedor de Email: Resend

**Contexto:** Relatorios agendados precisam ser enviados por email. Volume MVP estimado em 200-2000 emails/mes.

**Decisao:** Usar Resend como provedor de email transacional.

**Alternativas descartadas:**
- SendGrid: Mais caro (~$20/mes), DX inferior, sem React Email nativo
- Amazon SES: Setup complexo, requer servicos adicionais (SNS/SQS), overkill para volume MVP

**Razoes:**
- Tier gratuito de 3.000 emails/mes cobre o MVP
- React Email nativo (templates JSX, mesmo stack do portal)
- Setup em 5 minutos, SDK TypeScript de primeira classe
- Escala para $20/mes com 50k emails quando necessario

**Impacto:**
- Templates de email como componentes React reutilizaveis
- Integracao simples com Edge Functions do Supabase

---

### [2026-01] Testes: Apenas Fluxos Criticos no MVP

**Contexto:** Dev solo com prazo de MVP. Testes completos adicionam semanas ao cronograma.

**Decisao:** Implementar testes E2E apenas para fluxos criticos, complementados por unit tests.

**Fluxos com E2E (Playwright):**
1. Login/logout - Garante que auth funciona
2. Criar verificacao com foto - Fluxo core do inspetor
3. Gerar PDF de relatorio - Integracao com Cloud Function

**Alternativas descartadas:**
- Playwright completo: Muito tempo para MVP, pode expandir depois
- Apenas unit tests: Nao pega bugs de integracao nos fluxos criticos
- Sem testes: Risco alto de regressoes em producao

**Impacto:**
- ~2-3 dias para setup + 3-5 testes criticos
- 80% de cobertura de risco com 20% do esforco
- Base para expandir apos MVP

---

### [2026-01] Fotos: Comprimir Sempre (Sem Limite de Entrada)

**Contexto:** Usuarios podem tirar fotos de qualquer tamanho (5 MB, 10 MB, 15 MB). Precisamos garantir UX fluida.

**Decisao:** Comprimir todas as fotos automaticamente, sem limite de tamanho na entrada.

**Implementacao:**
- Resize para max 1920px de largura
- Compressao JPEG quality 0.8
- Resultado final: ~800 KB
- Se resultado > 1 MB apos compressao, mostra erro (caso raro)

**Alternativas descartadas:**
- Rejeitar acima de X MB: UX frustrante, usuario perde trabalho
- Upload progressivo no servidor: Complexidade desnecessaria

**Impacto:**
- UX transparente - usuario nao precisa se preocupar com tamanho
- Codigo simples - expo-image-manipulator ja faz tudo
- Storage otimizado - todas fotos ficam ~800 KB

---

### [2026-01] Monitoramento de Erros: Sentry

**Contexto:** Precisamos detectar e debugar erros em producao de forma proativa.

**Decisao:** Usar Sentry para monitoramento de erros em todas as plataformas.

**Cobertura:**
- Next.js (portal web)
- React Native/Expo (app mobile)
- Edge Functions (opcional, via logs)

**Alternativas descartadas:**
- LogRocket: Foco em session replay, mais pesado, tier gratis menor
- Apenas logs Supabase: Sem alertas proativos, sem stack traces, debug manual

**Configuracao:**
- Tier gratis: 5.000 eventos/mes (suficiente para MVP)
- Source maps habilitados para stack traces legiveis
- Alertas por email para erros novos
- Performance sampling: 10%

**Impacto:**
- Setup ~30 minutos para web + mobile
- Alertas automaticos quando erros novos aparecem
- Debug rapido com stack traces completos

---

## Todas as Decisoes Tomadas

Nenhuma questao pendente. Documentacao pronta para implementacao.
