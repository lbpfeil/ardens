# Portal do Almoxarife - ARDEN FVS

## Visao Geral

Portal **ultra simplificado** focado exclusivamente em Condicoes de Inicio e liberacao de materiais.

**Disponivel apenas se feature "Condicoes de Inicio" esta ativa.**

---

## Conceito

Quando empreiteiro solicita material (ex: rejunte para Casa B03), almoxarife consulta sistema:

- **Se CI aprovada** (piso/revestimento OK) → Libera material e registra entrega
- **Se CI bloqueada** (piso nao aprovado) → Nega material OU solicita autorizacao do engenheiro

---

## Tela Principal: Condicoes de Inicio

### Tabela

| Coluna | Descricao |
|--------|-----------|
| Servico | Nome do servico |
| Unidade | Identificacao da unidade |
| Status CI | Liberado / Bloqueado / Pendente de Autorizacao |
| Acao | [Entregar Material] ou [Solicitar Autorizacao] |

### Filtros
- Busca por servico, unidade
- Status (Todos, Liberados, Bloqueados, Pendentes)

### Legenda Visual
- Verde: Pode liberar
- Vermelho: Nao pode liberar
- Amarelo: Aguardando resposta do engenheiro

---

## Fluxos

### Fluxo 1: Entregar Material (CI Liberada)

**Acao:** Almoxarife clica [Entregar Material]

**Modal:**
- Servico: (pre-preenchido)
- Unidade: (pre-preenchido)
- Empreiteiro: campo de texto
- Quantidade: campo de texto
- Observacoes: campo opcional

**Confirmacao:** Salva registro com timestamp + almoxarife responsavel

**Resultado:**
- Status muda para "Material Entregue"
- Aparece no Relatorio de Rastreabilidade de Materiais

---

### Fluxo 2: Solicitar Autorizacao (CI Bloqueada)

**Acao:** Almoxarife clica [Solicitar Autorizacao]

**Modal:**
- Servico + Unidade (pre-preenchidos)
- Motivo da solicitacao: campo obrigatorio

**Confirmacao:** Envia notificacao ao engenheiro

**Resultado:**
- Status muda para "Pendente de Autorizacao"
- Engenheiro recebe notificacao no app e portal web

**Se engenheiro aprovar:**
- Status volta para "Liberado"
- Almoxarife pode clicar [Entregar Material]

**Se engenheiro negar:**
- Status volta para "Bloqueado"
- Almoxarife nao pode liberar

---

## Sidebar do Almoxarife

| Item | Descricao |
|------|-----------|
| Condicoes de Inicio | Tela principal |
| Liberacoes Pendentes | Filtro pre-aplicado (apenas Pendentes) |
| Relatorio de Materiais | Gera relatorio de rastreabilidade |
| Configuracoes | Ajustes basicos de perfil |

**Nota:** Interface extremamente simples, sem acesso a verificacoes, dashboards ou outras funcionalidades.

---

## Feature Opcional

A funcionalidade de Condicoes de Inicio e **opcional**.

Construtoras que tem seus proprios processos de controle de almoxarifado podem desativar esta feature.

Quando desativada:
- Portal do Almoxarife nao existe
- Sidebar de obra nao mostra "Almoxarifado"
- Nenhum bloqueio de servico por dependencia

---

## Referencias

- Modelo de dominio: [05_DOMAIN_MODEL.md](05_DOMAIN_MODEL.md)
- Portal web: [07_WEB_PORTAL.md](07_WEB_PORTAL.md)
