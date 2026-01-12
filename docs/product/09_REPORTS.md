# Relatorios - ARDEN FVS

## Visao Geral

O sistema oferece relatorios estrategicos para diferentes publicos: desde documentos obrigatorios para auditoria PBQP-H ate dashboards executivos para tomada de decisao.

### Categorias

1. **Operacionais** - Dia a dia (FVS, RNC)
2. **Estrategicos** - Tomada de decisao (Dashboard Executivo)
3. **Accountability** - Performance de equipes (Eficiencia de Correcao)
4. **Preditivos** - IA/Analise Avancada (Plano PRO)

### Priorizacao por Fase

| Fase | Relatorios |
|------|------------|
| MVP | FVS por Grupo de Unidades, RNC, Dashboard Executivo, Eficiencia de Correcao |
| Fase 2 | Relatorio de Tendencias (analise estatistica) |
| Plano PRO | Analise Preditiva de NCs (Machine Learning) |

---

## Relatorios MVP

### FVS por Grupo de Unidades

**Proposito:** Documento oficial para auditoria PBQP-H.

**Publico:** Auditor externo, Engenheiro

**Formato:** PDF

**Geracao:** Sob demanda

**Selecao:** Obra inteira ou unidades especificas

**Estrutura:**
- Cabecalho (Logo, Obra, Servico, Data, Unidades)
- Resumo (Total itens, Conformes, NCs, Excecoes, Taxa, IRS)
- Tabela de Verificacao (Unidade, Item, Status, Inspetor)
- Detalhamento de NCs (com fotos e watermark)
- Rodape (Gerado por ARDEN FVS)

---

### RNC - Relatorio de Nao Conformidades

**Proposito:** Visao consolidada de todas NCs da obra.

**Publico:** Engenheiro, Mestre de obras

**Formato:** PDF

**Geracao:**
- Sob demanda (com filtros)
- Automatico semanal (segunda-feira, 7h)

**Filtros:**
- Por obra, periodo, servico, status, agrupamento

**Estrutura:**
- Resumo Executivo (NCs abertas, resolvidas, tempo medio, NC mais antiga)
- NCs por Servico (ranking)
- NCs por Agrupamento
- Lista Detalhada de NCs Abertas (ordenadas por tempo)
- NCs Resolvidas no Periodo

---

### Dashboard Executivo

**Proposito:** Visao consolidada de TODAS as obras da construtora.

**Publico:** Proprietario, Diretoria

**Formato:** PDF (visual) + Excel (dados brutos)

**Geracao:**
- Sob demanda
- Automatico mensal (dia 1, 8h)

**Estrutura:**
- Visao Geral Multi-Obras
- Ranking de Obras (com status verde/amarelo/vermelho)
- Alertas Criticos
- Top 5 Servicos com Mais NCs
- Produtividade de Inspetores
- Grafico de Evolucao Mensal

**Excel Anexo:**
- Aba 1: Resumo por Obra
- Aba 2: Detalhamento de NCs
- Aba 3: Verificacoes do Periodo
- Aba 4: Produtividade Inspetores

---

### Eficiencia de Correcao

**Proposito:** Monitorar velocidade de resolucao de NCs.

**Publico:** Engenheiro, Mestre de obras

**Formato:** PDF

**Geracao:** Automatico semanal (sexta-feira, 16h)

**Estrutura:**
- Indicadores da Semana (NCs abertas, resolvidas, saldo, tempo medio)
- Tempo de Resolucao por Servico
- NCs Cronicas (abertas > 15 dias)
- Taxa de Reincidencia
- Resolucao por Tipo (Retrabalho, Conforme, Concessao)

---

## Relatorios Fase 2

### Relatorio de Tendencias

**Proposito:** Analise longitudinal para identificar padroes.

**Publico:** Engenheiro, Proprietario

**Tipo de analise:** Estatistica simples (sem IA)

**Conteudo:**
- Top 5 servicos problematicos recorrentes
- Comparativo mensal de IRS
- Identificacao de padroes sazonais
- Evolucao da taxa de conformidade

---

## Relatorios Plano PRO

### Analise Preditiva de NCs

**Proposito:** Machine Learning para prever problemas.

**Funcionalidades:**
- Previsao de probabilidade de NC por unidade/servico
- Identificacao de correlacoes
- Recomendacoes automatizadas
- Alertas proativos

**Requisito:** 6+ meses de dados historicos.

---

## Watermark nas Fotos

Todas fotos de NC tem watermark automatico:
- Nome da Obra
- Data e Hora da foto
- Nome do Inspetor
- Coordenadas GPS

---

## Resumo

| Relatorio | Formato | Geracao | Publico | Fase |
|-----------|---------|---------|---------|------|
| FVS por Grupo | PDF | Sob demanda | Auditor, Engenheiro | MVP |
| RNC | PDF | Sob demanda + Semanal | Engenheiro, Mestre | MVP |
| Dashboard Executivo | PDF + Excel | Sob demanda + Mensal | Diretoria | MVP |
| Eficiencia de Correcao | PDF | Semanal | Engenheiro | MVP |
| Tendencias | PDF | Sob demanda + Trimestral | Engenheiro, Proprietario | Fase 2 |
| Analise Preditiva | PDF | Sob demanda | Engenheiro | PRO |

---

## Referencias

- Pipeline tecnico: [../tech/07_REPORTING_PIPELINE.md](../tech/07_REPORTING_PIPELINE.md)
- Modelo de status: [05_DOMAIN_MODEL.md](05_DOMAIN_MODEL.md)
