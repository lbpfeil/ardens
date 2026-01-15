# Arquitetura de Navegacao - ARDEN FVS

## Inspiracao Visual

Baseado no design system do **Supabase** (ferramenta open-source de backend-as-a-service).

### Razoes
- Design system maduro (React + Tailwind CSS + Radix UI)
- Dark mode nativo (sera o padrao unico)
- Componentes reutilizaveis
- Acessibilidade (WCAG)
- Estetica profissional, hierarquia visual clara

---

## Estrutura de Navegacao

### Nivel 1: Barra Superior (56px, fixa)
- Logo + **Breadcrumb** (navegacao hierarquica)
- **Command Palette** (Cmd+K / Ctrl+K) para busca universal
- Ajuda, Configuracoes Rapidas, Perfil do Usuario

---

## Breadcrumb (Barra Superior)

Estrutura visual igual ao Supabase (ex: `Pfeil / evoque / main [PRODUCTION]`).

### Visao Global
```
[Logo] Empresa / Visao Global
```

### Obra Especifica
```
[Logo] Empresa / Nome da Obra / Secao Atual
         |            |              |
         |            |              +-- Dashboard, Verificacoes, etc (opcional)
         |            +-- Ex: "Residencial Aurora - Etapa 1"
         +-- Ex: "Pfeil Engenharia"
```

### Comportamento
- Clique em "Empresa": volta para Visao Global
- Clique em "Nome da Obra": vai para Home da obra
- Secao Atual: apenas indicativo (nao clicavel)
- Separador: `/` com espacamento (igual Supabase)

### Nivel 2: Sidebar Primaria (56px, icones apenas)
- Sempre visivel
- Modulos principais
- Muda dinamicamente baseado no contexto

### Nivel 3: Sidebar Secundaria (240px, condicional)
- Aparece quando modulo tem subdivisoes
- Lista de subsecoes do modulo ativo
- Fundo um tom mais claro que sidebar primaria

---

## Sidebar Primaria (Detalhes Visuais)

Estrutura visual igual ao Supabase.

### Estado Padrao
- **Retraida** (collapsed): apenas icones, sem labels
- Largura: 56px
- Fundo: `bg-sidebar` (um tom mais escuro que o canvas)

### Comportamento de Expansao
- **Hover**: expande temporariamente mostrando labels (tooltip ou sidebar expandida)
- **Click no icone de menu** (opcional): trava sidebar expandida (240px)
- Transicao suave (150-200ms)

### Estrutura Vertical
```
[Logo]
─────────────────
[Home]           ← Icone ativo com highlight (bg-accent)
[Modulo 1]
[Modulo 2]
[Modulo 3]
─────────────────  ← Separador sutil (border-muted)
[Modulo 4]
[Modulo 5]
─────────────────
[Indicador Status] ← Bolinha colorida (online/sync/etc)
[Modulo 6]
[Modulo 7]
─────────────────
[Configuracoes]  ← Sempre no final (engrenagem)
```

### Icone Ativo (Highlight)
- Fundo: `bg-accent` ou `bg-surface-200`
- Borda esquerda opcional: 2px `bg-brand` (verde)
- Icone: `text-foreground` (mais claro que inativos)

### Icones Inativos
- Cor: `text-foreground-light` ou `text-foreground-lighter`
- Hover: `text-foreground` + `bg-surface-100`

### Separadores
- Linha horizontal sutil: `border-muted` ou `border-secondary`
- Agrupa modulos por categoria (ex: principais, secundarios, config)

### Indicador de Status (Opcional)
- Bolinha pequena (8px) indicando:
  - Verde: online/sincronizado
  - Amarelo: sincronizando
  - Vermelho: offline/erro
- Posicionado proximo ao final da sidebar

### Nivel 4: Area de Conteudo Principal
- Flex, ocupando espaco restante
- Scroll independente

---

## Contextos de Navegacao

### Contexto: Visao Global (Administrador)

Seletor mostra "Visao Global".

**Sidebar Primaria:**
- Home
- Dashboard Geral (comparativo entre obras)
- Gerenciar Obras
- Biblioteca FVS (servicos globais da construtora)
- Gerenciar Usuarios
- Relatorios Consolidados
- Configuracoes (empresa, integracoes, automacoes, alertas)
- Plano e Faturamento
- *Secao inferior:* lista rapida de obras para trocar contexto

**Modulos com Sidebar Secundaria:**
- **Gerenciar Obras:** Todas Obras, Nova Obra, Empreendimentos, Comparativo
- **Biblioteca FVS:** Todos Servicos, Novo Servico, Categorias, Importar/Exportar
- **Gerenciar Usuarios:** Todos Usuarios, Convidar, Por Cargo, Permissoes

---

### Contexto: Obra Especifica (Engenheiro/Admin)

Seletor mostra nome da obra (ex: "Residencial Aurora - Etapa 1").

**Sidebar Primaria:**
- Home (feed de NCs + KPIs)
- Dashboard (graficos e analises)
- Verificacoes (gestao de inspecoes)
- Servicos (FVS ativos na obra)
- Nao-Conformidades (central de NCs)
- Relatorios (geracao e exportacao)
- Almoxarifado (visualizacao de CIs, se feature ativa)
- Equipe (quem tem acesso a esta obra)
- Configuracoes (da obra: estrutura, tags, servicos, CIs)
- *Secao inferior:* botao "Visao Global" para voltar

**Modulos com Sidebar Secundaria:**
- **Verificacoes:** Visao Geral, Tabela (S x U), Inspecao em Massa, Historico, Enviar p/ Inspetores
- **Servicos:** Biblioteca da Obra, Adicionar Servicos, Categorias, Condicoes de Inicio
- **Relatorios:** FVS Individual, Consolidada, RNC, Resumo Executivo, IRS, Mapa Calor, Rastreabilidade, Agendados

---

### Contexto: Portal Almoxarife

Portal **ultra simplificado**, apenas:
- Condicoes de Inicio
- Liberacoes Pendentes
- Relatorio de Materiais
- Configuracoes basicas

---

## Diferenciacao por Cargo

| Cargo | Acesso |
|-------|--------|
| Engenheiro | Ve apenas obras atribuidas, nao tem "Visao Global" |
| Administrador | Alterna entre Visao Global e obras especificas |
| Inspetor | Nao acessa portal web (so app mobile) |
| Almoxarife | Portal ultra simplificado |

---

## Referencias

- Design System: [../design/DESIGN-SYSTEM.md](../design/DESIGN-SYSTEM.md)
- Portal Web detalhado: [07_WEB_PORTAL.md](07_WEB_PORTAL.md)
