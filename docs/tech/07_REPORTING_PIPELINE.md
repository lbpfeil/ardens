# Pipeline de Relatorios - ARDEN FVS

## Visao Geral

Relatorios sao gerados via **Google Cloud Function com Puppeteer** e disponibilizados no Supabase Storage para download ou visualizacao.

> **Decisao:** Cloud Function + Puppeteer foi escolhido por permitir renderizacao HTML/CSS real,
> resultando em relatorios com alta qualidade visual. Ver [DECISIONS.md](../process/DECISIONS.md).

---

## Arquitetura

```
┌─────────────────┐      ┌─────────────────────┐      ┌─────────────────┐
│   Portal Web    │ ──── │  Cloud Function     │ ──── │ Supabase        │
│   (Next.js)     │      │  (GCP + Puppeteer)  │      │ Storage         │
└─────────────────┘      └─────────────────────┘      └─────────────────┘
        │                         │                          │
        │ 1. POST /gerar-pdf      │                          │
        │ ───────────────────────>│                          │
        │                         │ 2. Busca dados           │
        │                         │ ───────────────────────> │
        │                         │ <─────────────────────── │
        │                         │                          │
        │                         │ 3. Renderiza HTML        │
        │                         │    (React + Recharts)    │
        │                         │                          │
        │                         │ 4. Puppeteer gera PDF    │
        │                         │                          │
        │                         │ 5. Upload PDF            │
        │                         │ ───────────────────────> │
        │                         │                          │
        │ 6. Retorna URL signed   │                          │
        │ <───────────────────────│                          │
        │                         │                          │
        │ 7. Abre PDF em nova aba │                          │
        └─────────────────────────┴──────────────────────────┘
```

---

## Cloud Functions

| Funcao | Proposito |
|--------|-----------|
| `gerar-pdf-fvs` | FVS por Grupo de Unidades |
| `gerar-pdf-rnc` | Relatorio de Nao Conformidades |
| `gerar-pdf-dashboard` | Dashboard Executivo |
| `gerar-pdf-eficiencia` | Eficiencia de Correcao |
| `gerar-excel-dashboard` | Excel do Dashboard Executivo |

### Tecnologias

| Componente | Tecnologia |
|------------|------------|
| Runtime | Node.js 20 (GCP Cloud Functions) |
| Renderizador | Puppeteer |
| Templates | React (server-side) |
| Graficos | Recharts (renderizado como SVG) |
| Excel | ExcelJS |

### Performance

| Metrica | Valor |
|---------|-------|
| Cold start | ~2-5 segundos |
| Geracao PDF simples | ~3-5 segundos |
| Geracao PDF com graficos | ~5-10 segundos |
| Custo por execucao | ~$0.0001

---

## Processamento de Fotos

### Watermark Automatico (Aplicado no Upload)

- Nome da Obra
- Data e Hora (timestamp da foto)
- Nome do Inspetor
- Coordenadas GPS

### Compressao

| Aspecto | Valor |
|---------|-------|
| Quality | 0.8 |
| Tamanho alvo | ~800KB por foto |
| Formato | JPEG |

---

## Agendamento

### Tecnologia

Supabase Scheduled Functions (cron) dispara Cloud Functions

### Jobs Configurados

| Job | Horario | Timezone |
|-----|---------|----------|
| `relatorio-rnc-semanal` | Segunda 07:00 | Brasil |
| `relatorio-dashboard-mensal` | Dia 1, 08:00 | Brasil |
| `relatorio-eficiencia-semanal` | Sexta 16:00 | Brasil |

### Fluxo

```
1. Cron (Supabase) dispara Edge Function leve
2. Edge Function consulta configuracoes ativas
3. Para cada cliente com agendamento ativo:
   - Chama Cloud Function (GCP) para gerar PDF
   - Cloud Function salva no Storage (7 dias)
   - Edge Function envia email com link
   - Registra no log
```

---

## Envio de Emails

### Tecnologia

Supabase Edge Functions + **Resend**

> **Decisao:** Resend escolhido por DX excelente, React Email nativo e tier gratuito de 3k/mes.
> Ver [DECISIONS.md](../process/DECISIONS.md).

### Template de Email

```
Assunto: [ARDEN FVS] [Nome do Relatorio] - [Obra/Construtora] - [Data]
Corpo: Resumo breve + link para download
Anexo: Nao (apenas link para evitar limite de tamanho)
```

**Expiracao do link:** 7 dias

---

## Configuracoes (Portal Admin)

### Localizacao

Configuracoes > Relatorios Automaticos

### Campos por Relatorio

| Campo | Opcoes |
|-------|--------|
| Ativo | Toggle (sim/nao) |
| Frequencia | Diario / Semanal / Mensal |
| Dia (semanal) | Segunda a Domingo |
| Dia (mensal) | Dia 1 a 28 |
| Horario | 00:00 a 23:00 |
| Destinatarios | Lista de emails |

### Configuracao Padrao

| Relatorio | Frequencia | Dia | Horario | Destinatario |
|-----------|------------|-----|---------|--------------|
| RNC | Semanal | Segunda | 07:00 | Engenheiro |
| Dashboard Executivo | Mensal | Dia 1 | 08:00 | Admin |
| Eficiencia de Correcao | Semanal | Sexta | 16:00 | Engenheiro |

### Acoes Disponiveis

- Editar configuracao
- Adicionar/remover destinatarios
- Testar envio (gera e envia imediatamente)
- Ver historico (ultimos 30 dias)
- Pausar/retomar agendamento

### Validacoes

- Email deve ser valido
- Pelo menos 1 destinatario se ativo
- Limite: 10 destinatarios por relatorio

---

## Log de Envios

### Campos

| Campo | Descricao |
|-------|-----------|
| Data/hora | Quando foi enviado |
| Relatorio | Tipo do relatorio |
| Destinatarios | Lista de emails |
| Status | Sucesso / Falha |
| Tamanho | Tamanho do arquivo |
| Link | Download (expira em 7 dias) |

**Retencao:** 90 dias

---

## Custo

### Supabase (incluido no plano)
- Edge Functions para agendamento (leves)
- Storage para PDFs temporarios (7 dias)

### Google Cloud Functions
- Tier gratuito: 2M invocacoes/mes
- Apos tier: ~$0.0001 por execucao
- Estimativa 1000 relatorios/mes: ~$0.10

---

## Referencias

- Especificacao dos relatorios: [../product/09_REPORTS.md](../product/09_REPORTS.md)
- Arquitetura: [01_ARCHITECTURE.md](01_ARCHITECTURE.md)
