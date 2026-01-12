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

### [2026-01] Condicoes de Inicio como Feature Opcional

**Contexto:** Algumas construtoras ja tem processos de almoxarifado.

**Decisao:** CI e feature que pode ser desativada por obra.

**Impacto:** Flexibilidade para diferentes workflows, Portal Almoxarife condicional.

---

## Proximas Decisoes Pendentes

Ver [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md)
