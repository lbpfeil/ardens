# Arquitetura Tecnica - ARDEN FVS

## Visao Geral

Arquitetura **Supabase-first** sem backend tradicional.

```
+--------------------------------------------------+
|          FRONTEND (React/React Native)           |
|               Supabase Client                    |
+------------------------+-------------------------+
                         |
          +--------------+---------------+
          v                              v
+---------------------+    +---------------------------+
|      SUPABASE       |    |  GOOGLE CLOUD FUNCTIONS   |
| +─────────────────+ |    | +───────────────────────+ |
| | PostgreSQL + RLS| |    | | Puppeteer (PDFs)      | |
| +─────────────────+ |    | +───────────────────────+ |
| | Auth            | |    +---------------------------+
| +─────────────────+ |
| | Storage (fotos) | |
| +─────────────────+ |
| | Edge Functions  | |
| | - Emails        | |
| | - Calculos IRS  | |
| | - Agendamentos  | |
| +─────────────────+ |
+---------------------+
```

---

## Distribuicao de Responsabilidades

### 90% - Frontend Direto com Supabase

- CRUD basico (criar/ler/atualizar verificacoes, obras, usuarios)
- Queries e filtros
- Upload de fotos
- Autenticacao (login/logout)

```typescript
// Exemplo: Criar verificacao direto do React Native
const { data, error } = await supabase
  .from('verificacoes')
  .insert({
    obra_id: obraId,
    servico_id: servicoId,
    unidade_id: unidadeId,
    inspetor_id: user.id
  })
```

### 10% - Funcoes Server-side

#### Supabase Edge Functions (Deno)

| Funcao | Proposito |
|--------|-----------|
| `enviar-relatorio-email` | Envio de relatorios agendados |
| `processar-foto-nc` | Compressao + watermark |
| `calcular-irs` | Calculos complexos |
| `agendar-relatorios` | Cron que dispara geracao de PDFs |

#### Google Cloud Functions (Node.js + Puppeteer)

| Funcao | Proposito |
|--------|-----------|
| `gerar-pdf-fvs` | PDF de FVS por grupo de unidades |
| `gerar-pdf-rnc` | Relatorio de Nao Conformidades |
| `gerar-pdf-dashboard` | Dashboard Executivo |
| `gerar-pdf-eficiencia` | Eficiencia de Correcao |
| `gerar-excel-dashboard` | Excel do Dashboard |

> **Por que Cloud Functions para PDF?** Puppeteer requer Chromium que nao roda em Edge Functions (Deno).
> Ver [07_REPORTING_PIPELINE.md](07_REPORTING_PIPELINE.md) para detalhes.

```typescript
// Exemplo: Chamar Cloud Function para PDF
const response = await fetch('https://us-central1-arden-fvs.cloudfunctions.net/gerar-pdf-fvs', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ verificacao_id: '123' })
})
```

---

## Por que NAO Backend Tradicional?

| Razao | Explicacao |
|-------|------------|
| Dev solo | Menos codigo = menos bugs |
| Supabase resolve 90% | CRUD, auth, permissoes prontos |
| Custo | Servidor extra = $5-12/mes + deploy + monitoring |
| Tempo | Backend separado = 2-3x mais lento |
| Edge Functions | Cobrem os 10% restantes ($0 extra) |

**Quando reavaliar:** 500+ construtoras com logicas muito customizadas.

---

## Banco de Dados

### Decisao: PostgreSQL via Supabase

**Razoes:**
- Dev solo com experiencia previa
- Interface visual para criacao de tabelas
- APIs REST geradas automaticamente
- Auth e autorizacao prontas
- RLS para multi-tenancy
- Realtime subscriptions
- Backup automatico

### Plano de Hospedagem

| Fase | Plano | Custo |
|------|-------|-------|
| MVP | Supabase Pro | $29/mes |
| Ano 1 (100 construtoras) | Pro + Storage | ~$29/mes |

**Volumetria calculada (100 construtoras/ano):**
- Dados estruturados: 2.55 GB
- Fotos: 292 GB
- **Total: ~295 GB**

---

## Storage de Fotos

### Estrategia

1. Comecar com Supabase Storage (simples)
2. Compressao no cliente (3-5 MB → 500-800 KB)
3. Migracao futura para Cloudflare R2 se necessario

### Limites

| Aspecto | Limite |
|---------|--------|
| Por foto (entrada) | Sem limite (comprime qualquer tamanho) |
| Por foto (apos compressao) | 1 MB |
| Fotos por NC | 5 |

---

## Multi-tenancy

### Estrategia: Row Level Security (RLS)

Cada construtora (tenant) identificada por `cliente_id`.

```sql
-- Usuarios so veem dados da construtora deles
CREATE POLICY "Isolamento por cliente" ON verificacoes
  FOR ALL
  USING (
    cliente_id = (SELECT cliente_id FROM usuarios WHERE id = auth.uid())
  );
```

**Garantias:**
- Isolamento completo no nivel do banco
- Impossivel acessar dados de outro cliente via queries
- Super Admin (Arden) tem politica especial com auditoria

---

## Hospedagem e Custos

| Item | Custo/mes | Anual |
|------|-----------|-------|
| Supabase Pro | $29 | $348 |
| Vercel (frontend) | $0-20 | $0-240 |
| GCP Cloud Functions | $0-1 | $0-12 |
| Google Play Store | - | $25 |
| Dominio | $2 | $24 |
| **Total Estimado** | **$31-52** | **$397-649** |

> **GCP Cloud Functions:** Tier gratuito de 2M invocacoes/mes. Custo real ~$0 para MVP.

---

## Referencias

- Schema SQL: `database/schema.sql`
- Politicas RLS: `database/rls-policies.sql`
- Stack Web: [05_FRONTEND_WEB.md](05_FRONTEND_WEB.md)
- Stack Mobile: [06_MOBILE_TECH.md](06_MOBILE_TECH.md)
