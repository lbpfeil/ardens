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
- Logo + **Seletor de Contexto** (alterna entre "Visao Global" e "Obra Especifica")
- **Command Palette** (Cmd+K / Ctrl+K) para busca universal
- Ajuda, Configuracoes Rapidas, Perfil do Usuario

### Nivel 2: Sidebar Primaria (56px, icones apenas)
- Sempre visivel
- Modulos principais
- Muda dinamicamente baseado no contexto

### Nivel 3: Sidebar Secundaria (240px, condicional)
- Aparece quando modulo tem subdivisoes
- Lista de subsecoes do modulo ativo
- Fundo um tom mais claro que sidebar primaria

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

- Design System: `DESIGN-SYSTEM.md` (raiz)
- Portal Web detalhado: [07_WEB_PORTAL.md](07_WEB_PORTAL.md)
