# Sincronizacao Offline - ARDEN FVS

## Contexto

- Tablets dos inspetores **NAO tem dados moveis** (so wifi)
- Wifi disponivel no container-escritorio (3x/dia)
- Inspetores trabalham **offline no campo** durante o dia
- Multiplos inspetores podem trabalhar na mesma obra simultaneamente
- Granularidade: **ITEM por ITEM** (nao servico completo)

---

## Principio Fundamental

### FIRST WRITE WINS

Quem sincronizar primeiro trava o item. A segunda tentativa de preencher o mesmo item e rejeitada.

---

## Arquitetura de 3 Camadas

### Camada 1: Permissoes de Obras
- Admin concede/revoca acesso
- A cada sync, app verifica lista de obras permitidas
- Adiciona obras novas (download completo)
- Remove obras sem permissao (deleta dados locais)

### Camada 2: Verificacoes e Servicos
- Admin adiciona unidades → novas verificacoes geradas
- Admin ativa servico → novas verificacoes geradas
- Sync incremental de novidades

### Camada 3: Itens de Verificacao
- Inspetor preenche item → salva SQLite local
- Sync: Upload + Download de itens
- Conflito: Servidor aceita primeiro, rejeita segundo

---

## Fluxo Completo

### 1. Download Inicial

```
Inspetor Joao faz login (primeira vez):
  -> App verifica permissoes no servidor
  -> Joao tem acesso a: Obra A, Obra B

Download da Obra A:
  - Dados da obra (agrupamentos, unidades) -> 15 KB
  - 25 servicos ativos + itens -> 60 KB
  - 3.750 verificacoes pendentes -> 750 KB
  - Total: ~1 MB

Total download inicial: ~2 MB
Tempo: 3-5 segundos (wifi)
```

### 2. Trabalho Offline

```
Joao no campo (SEM wifi, 09h-12h):

Abre verificacao:
  - Obra A, Casa B10, Servico PRC-001

Preenche itens 1-4:
  - Item 1: Conforme
  - Item 2: Conforme
  - Item 3: Nao Conforme (2 fotos)
  - Item 4: Conforme

App salva no SQLite local:
  - Tabela: itens_offline
  - Status: "pending_sync"
  - Fotos: /files/foto1.jpg, /files/foto2.jpg
```

### 3. Sincronizacao (Volta ao Container)

```
Joao volta ao container (12h00):
  -> Tablet detecta wifi
  -> App inicia sync automatica

FASE 1 - Download:
  - Query: GET /sync/updates?last_sync=09:00
  - Resposta: 15 itens preenchidos por outros
  - App atualiza SQLite local

FASE 2 - Upload:
  - Le fila local (24 itens pending_sync)
  - POST /sync/upload com batch de itens
  - Servidor processa cada item:
    - Disponivel? -> ACEITA
    - Ja preenchido? -> REJEITA

FASE 3 - Upload Fotos:
  - Comprime (quality 0.8, ~800KB)
  - Adiciona watermark
  - Upload para Supabase Storage
  - Deleta foto local

Resultado:
  - 23 itens sincronizados
  - 1 item rejeitado (conflito)
```

### 4. Cenario de Conflito

```
09h00: Joao marca Item 3 como "Conforme" (offline)
09h30: Gabriel marca Item 3 como "Nao Conforme" (offline)

12h00: Joao sincroniza PRIMEIRO
  -> Servidor aceita Item 3 = "Conforme"
  -> Marca item como LOCKED

12h05: Gabriel sincroniza DEPOIS
  -> Servidor verifica: Item 3 disponivel? NAO
  -> Servidor REJEITA
  -> App notifica Gabriel: "Item ja verificado por Joao"
  -> Foto de Gabriel e deletada

Item 3 permanece "Conforme" (primeiro que subiu)
```

---

## Estrutura SQLite Local

```sql
-- Obras permitidas
CREATE TABLE obras_locais (
  id TEXT PRIMARY KEY,
  nome TEXT,
  tipologia TEXT,
  last_sync_at TEXT
);

-- Unidades
CREATE TABLE unidades (
  id TEXT PRIMARY KEY,
  obra_id TEXT,
  nome TEXT,
  agrupamento TEXT
);

-- Servicos ativos
CREATE TABLE servicos (
  id TEXT PRIMARY KEY,
  obra_id TEXT,
  codigo TEXT,
  nome TEXT
);

-- Itens de verificacao (biblioteca)
CREATE TABLE itens_biblioteca (
  id TEXT PRIMARY KEY,
  servico_id TEXT,
  descricao TEXT,
  tipo TEXT
);

-- Verificacoes pendentes
CREATE TABLE verificacoes (
  id TEXT PRIMARY KEY,
  obra_id TEXT,
  unidade_id TEXT,
  servico_id TEXT,
  status TEXT
);

-- Itens preenchidos offline (fila de sync)
CREATE TABLE itens_offline (
  id TEXT PRIMARY KEY,
  verificacao_id TEXT,
  item_id TEXT,
  status TEXT,
  observacao TEXT,
  fotos TEXT,
  preenchido_em TEXT,
  sync_status TEXT
);

-- Conflitos (itens rejeitados)
CREATE TABLE sync_conflicts (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  filled_by TEXT,
  filled_at TEXT,
  reason TEXT
);
```

---

## Codigo de Referencia

### Deteccao de Wifi

```typescript
import NetInfo from '@react-native-community/netinfo';

NetInfo.addEventListener(state => {
  if (state.isConnected && state.type === 'wifi') {
    startAutoSync();
  }
});
```

### Sync Automatica

```typescript
async function startAutoSync() {
  try {
    useStore.setState({ syncStatus: 'syncing' });

    // FASE 1: Download atualizacoes
    const updates = await downloadUpdates();
    await applyUpdates(updates);

    // FASE 2: Upload itens offline
    const pendingItems = await getPendingItems();
    const uploadResult = await uploadItems(pendingItems);

    // FASE 3: Upload fotos
    await uploadPhotos(uploadResult.success);

    // FASE 4: Limpeza
    await cleanupSyncedData(uploadResult.success);

    // FASE 5: Notifica conflitos
    if (uploadResult.rejected.length > 0) {
      addConflictsToFeed(uploadResult.rejected);
    }

    await updateLastSync();
    useStore.setState({ syncStatus: 'success' });

  } catch (error) {
    useStore.setState({ syncStatus: 'error' });
  }
}
```

### Stored Procedure (First Write Wins)

```sql
CREATE OR REPLACE FUNCTION sync_upload_itens(itens JSONB)
RETURNS JSONB AS $$
DECLARE
  item JSONB;
  accepted JSONB[] := '{}';
  rejected JSONB[] := '{}';
BEGIN
  FOR item IN SELECT * FROM jsonb_array_elements(itens)
  LOOP
    IF EXISTS (
      SELECT 1 FROM itens_verificacao
      WHERE id = (item->>'item_id')::uuid
      AND status IS NOT NULL
    ) THEN
      -- Item ja existe, rejeita
      rejected := array_append(rejected,
        jsonb_build_object('item_id', item->>'item_id', 'reason', 'already_filled')
      );
    ELSE
      -- Item disponivel, aceita
      UPDATE itens_verificacao SET
        status = item->>'status',
        observacao = item->>'observacao',
        preenchido_por = (item->>'preenchido_por')::uuid,
        preenchido_em = (item->>'preenchido_em')::timestamptz
      WHERE id = (item->>'item_id')::uuid;

      accepted := array_append(accepted, item);
    END IF;
  END LOOP;

  RETURN jsonb_build_object('accepted', to_jsonb(accepted), 'rejected', to_jsonb(rejected));
END;
$$ LANGUAGE plpgsql;
```

---

## Resumo

| Caracteristica | Implementacao |
|----------------|---------------|
| Estrategia conflito | First Write Wins |
| Granularidade | Por item |
| Multi-obra | Sim |
| Sync trigger | Auto ao detectar wifi |
| Upload | Batch |
| Limpeza | Auto apos sync |
| Conflitos | Notificacao no feed |

### Performance

| Operacao | Tempo |
|----------|-------|
| Download inicial | 2-5 seg (1-2 MB) |
| Sync diaria | 3-10 seg |
| SQLite queries | <50ms |

---

## Referencias

- Stack mobile: [06_MOBILE_TECH.md](06_MOBILE_TECH.md)
- Schema banco: [02_DATABASE.md](02_DATABASE.md)
