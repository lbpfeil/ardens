# Pipeline de Relatorios - ARDEN FVS

## Visao Geral

Relatorios sao gerados via Edge Functions (Deno) e enviados por email ou disponibilizados para download.

---

## Edge Functions

| Funcao | Proposito |
|--------|-----------|
| `gerar-pdf-fvs` | FVS por Grupo de Unidades |
| `gerar-pdf-rnc` | Relatorio de Nao Conformidades |
| `gerar-pdf-dashboard` | Dashboard Executivo |
| `gerar-pdf-eficiencia` | Eficiencia de Correcao |
| `gerar-excel-dashboard` | Excel do Dashboard Executivo |

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

Supabase Scheduled Functions (cron)

### Jobs Configurados

| Job | Horario | Timezone |
|-----|---------|----------|
| `relatorio-rnc-semanal` | Segunda 07:00 | Brasil |
| `relatorio-dashboard-mensal` | Dia 1, 08:00 | Brasil |
| `relatorio-eficiencia-semanal` | Sexta 16:00 | Brasil |

### Fluxo

```
1. Cron dispara Edge Function
2. Edge Function consulta configuracoes ativas
3. Para cada cliente com agendamento ativo:
   - Gera PDF/Excel
   - Salva no Storage (temporario, 7 dias)
   - Envia email com link de download
   - Registra no log
```

---

## Envio de Emails

### Tecnologia

Supabase + provedor de email (Resend ou similar)

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

Incluido no Plano Pro:
- 500K invocacoes/mes de Edge Functions
- Storage para PDFs temporarios

---

## Referencias

- Especificacao dos relatorios: [../product/09_REPORTS.md](../product/09_REPORTS.md)
- Arquitetura: [01_ARCHITECTURE.md](01_ARCHITECTURE.md)
