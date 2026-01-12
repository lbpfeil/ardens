# Banco de Dados - ARDEN FVS

## SSOT

O arquivo **`database/schema.sql`** e a fonte de verdade do schema SQL.

Este documento explica a intencao e convencoes do modelo.

---

## Visao Geral

- **22 tabelas**
- **9 tipos ENUM**
- Multi-tenancy via `cliente_id`
- RLS habilitado em todas tabelas

---

## Diagrama de Entidades

```
+-------------+
|   clientes  | (construtoras/tenants)
+------+------+
       | 1:N
       v
+-----------------+     N:N     +---------------+
| usuario_clientes|<----------->|   usuarios    |
+-----------------+             +---------------+
       |                               |
       v                               | N:N (usuario_obras)
+-------------+                        |
|    obras    |<-----------------------+
+------+------+
       | 1:N
       v
+-------------+     1:N     +---------------+
| agrupamentos|------------>|   unidades    |
+-------------+             +-------+-------+
                                    |
                                    | 1:1 (por servico)
                                    v
+-------------+     1:N     +---------------+
|  servicos   |------------>| verificacoes  |
+------+------+             +-------+-------+
       | 1:N                        | 1:N
       v                            v
+-------------+             +-------------------+     1:N     +----------+
|itens_servico|------------>| itens_verificacao |------------>| fotos_nc |
+-------------+             +-------------------+             +----------+
```

---

## Tipos ENUM

| Tipo | Valores | Uso |
|------|---------|-----|
| `perfil_usuario` | admin, engenheiro, inspetor, almoxarife | Perfis de acesso |
| `tipologia_obra` | residencial_horizontal, residencial_vertical, comercial, retrofit, misto | Classificacao de obras |
| `categoria_servico` | fundacao, estrutura, alvenaria, revestimento, acabamento, instalacoes, cobertura, esquadrias, pintura, impermeabilizacao, outros | Categorias FVS |
| `status_inspecao` | nao_verificado, conforme, nao_conforme, excecao | Status primeira inspecao |
| `status_reinspecao` | conforme_apos_reinspecao, retrabalho, aprovado_com_concessao, reprovado_apos_retrabalho | Status reinspecao |
| `status_verificacao` | pendente, em_andamento, concluida, com_nc | Status geral |
| `tipo_notificacao` | conflito_sync, nova_obra_atribuida, nova_unidade, novo_servico, nc_aberta, nc_fechada, relatorio_gerado, permissao_revogada, sistema | Tipos de notificacao |
| `frequencia_relatorio` | diario, semanal, quinzenal, mensal | Agendamento |
| `tipo_relatorio` | fvs_grupo_unidades, rnc, dashboard_executivo, eficiencia_correcao | Relatorios MVP |

---

## Tabelas por Categoria

### Multi-tenancy
- `clientes` - Construtoras (tenants)

### Usuarios
- `usuarios` - Dados do usuario
- `usuario_clientes` - Relacao N:N usuario-cliente
- `usuario_obras` - Permissao de acesso a obras

### Obras
- `obras` - Projetos/canteiros
- `empreendimentos` - Agrupamento virtual de obras
- `obra_empreendimentos` - Relacao N:N
- `agrupamentos` - Quadra, Torre, Pavimento
- `unidades` - Casa, Apartamento
- `tags` - Tags customizaveis
- `agrupamento_tags` - Relacao N:N

### Biblioteca FVS
- `servicos` - Servicos de verificacao
- `itens_servico` - Itens de cada servico
- `fotos_referencia` - Fotos de exemplo (correto/incorreto)
- `condicoes_inicio` - Dependencias entre servicos
- `sugestoes_observacao` - Chips de texto rapido
- `obra_servicos` - Servicos ativos por obra

### Verificacoes
- `verificacoes` - Inspecao de servico em unidade
- `itens_verificacao` - Status de cada item
- `fotos_nc` - Fotos de nao conformidade

### Feed/Notificacoes
- `notificacoes` - Feed do usuario
- `sync_conflitos` - Itens rejeitados no sync

### Relatorios
- `relatorios_agendados` - Configuracao de automacao
- `log_relatorios` - Historico de envios

### Auditoria
- `audit_log` - Log de acoes criticas

---

## Decisoes de Modelagem

| Decisao | Escolha | Justificativa |
|---------|---------|---------------|
| Usuario multi-cliente | Sim (N:N) | Consultor pode atender 2+ construtoras |
| Permissao por obra | Binaria | Simplifica: tem ou nao tem acesso |
| Delecao obras/unidades | Hard delete | Usuario pode excluir |
| Delecao servicos | Soft delete | Preserva historico de verificacoes |
| Endereco obra | Apenas coordenadas | GPS para validar fotos |
| Fotos NC | 1-5 por item | Limite razoavel |
| GPS nas fotos | Opcional | Salva se disponivel |
| Reinspecao | Sem foto | Apenas muda status |
| Categorias servico | ENUM fixo | 11 categorias pre-definidas |

---

## Contadores Denormalizados

A tabela `verificacoes` mantem contadores via trigger:

```sql
total_itens
itens_verificados
itens_conformes
itens_nc
itens_excecao
```

**Proposito:** Evitar queries pesadas para dashboards.

---

## Sincronizacao Offline

Campos de suporte em `itens_verificacao`:

| Campo | Proposito |
|-------|-----------|
| `sync_id` | UUID gerado no device para detectar conflitos |
| `sync_timestamp` | Timestamp do device quando preenchido |

Tabela `sync_conflitos` armazena itens rejeitados para exibir no feed.

---

## Indexes Criticos

| Tabela | Index | Uso |
|--------|-------|-----|
| `verificacoes` | `obra_id`, `status`, `inspetor_id` | Listagem, filtros |
| `itens_verificacao` | `verificacao_id`, `status`, `sync_id` | NC abertas, sync |
| `notificacoes` | `usuario_id + lida`, `created_at DESC` | Feed nao lidas |
| `servicos` | `cliente_id`, `categoria`, `ativo` | Biblioteca, filtros |

---

## Como Evoluir o Schema

1. **Nunca alterar** dados de verificacoes existentes (imutabilidade para auditoria)
2. **Novas colunas:** Sempre com DEFAULT ou nullable
3. **Remocao de colunas:** Soft deprecate primeiro, depois remove
4. **Migrations:** Via Supabase CLI (`supabase db push`)

---

## Referencias

- Schema SQL: `database/schema.sql`
- Politicas RLS: [03_RLS_PERMISSIONS.md](03_RLS_PERMISSIONS.md)
