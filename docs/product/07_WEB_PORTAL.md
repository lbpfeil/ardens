# Portal Web - ARDEN FVS

## Obra Especifica

### Home do Engenheiro

**Proposito:** Centro de comando, primeira tela ao abrir portal. Foco em acao imediata.

**Elementos:**

1. **Feed de NCs (prioridade maxima):**
   - Ultimas 2-3 NCs abertas
   - Unidade, Servico, Item, Observacao resumida, Tempo desde abertura
   - Botao [Ver Detalhes]
   - Atualizacao tempo real
   - Botao "Ver todas (5) →"

2. **KPIs em Cards:**
   - Taxa de Conformidade Geral
   - IRS - Indice de Retrabalho por Servico
   - Verificacoes Pendentes
   - Verificacoes Concluidas

3. **Grafico de Evolucao Temporal:**
   - Linha do tempo: taxa de conformidade ultimos 30 dias

4. **Feed de Atividade Recente:**
   - Log ultimas 5-10 acoes da equipe

---

### Dashboard

**Proposito:** Analise visual profunda com multiplos graficos.

**Graficos Disponiveis:**
- Taxa conformidade por servico (barras horizontais)
- Evolucao temporal (linha)
- Top 5 NCs recorrentes (pizza/barras)
- Unidades problematicas (tabela ranqueada)
- Comparativo entre agrupamentos (barras)

**Filtros:**
- Periodo (ultima semana, mes, trimestre, customizado)
- Servicos especificos
- Agrupamentos
- Tags

---

### Verificacoes

#### Tabela Servicos x Unidades

**Interface:** Matriz onde linhas = servicos, colunas = unidades. Cada celula = verificacao.

**Legenda:**
- Verde: Conforme
- Vermelho: NC Aberta
- Cinza: Nao Verificado
- Laranja: Retrabalho

**Interacoes:**
- Click individual em celula: seleciona
- Click em cabecalho de coluna: seleciona todas unidades daquele servico
- Click em cabecalho de linha: seleciona todos servicos daquela unidade
- Drag para selecao multipla

**Acoes em Lote:**
- Marcar Conforme
- Marcar NC
- Enviar para Inspetor
- Ver Detalhes

#### Inspecao em Massa

**Proposito:** Verificar rapidamente multiplas unidades identicas.

**Fluxo:**
1. Seleciona servico
2. Seleciona multiplas unidades
3. Interface formulario com checkboxes
4. Salva: cria N verificacoes identicas

**Limitacao:** Nao permite fotos. Use app mobile ou individual.

---

### Servicos

#### Biblioteca da Obra
Lista servicos ativos na obra com acoes: Visualizar, Editar, Remover.

#### Adicionar Servicos
Lista servicos da biblioteca global nao ativos nesta obra.

#### Condicoes de Inicio
Configurar dependencias entre servicos (feature opcional).

---

### Nao-Conformidades

**Proposito:** Central de gestao de NCs.

**Interface:** Lista de NCs em cards com:
- Status visual (Aberta, Retrabalho, Fechada)
- Unidade + Servico + Item
- Observacao resumida
- Inspetor responsavel
- Tempo desde abertura
- Indicador de fotos

**Filtros:**
- Status (Abertas, Fechadas, Retrabalho, Todas)
- Servico, Unidade/Agrupamento, Inspetor, Periodo

---

## Visao Global

### Home

**Proposito:** Visao geral de toda a construtora.

**Elementos:**
- Metricas Consolidadas (Total Obras, Usuarios, Verificacoes, NCs Abertas)
- Obras Ativas (lista com cards)
- Acoes Rapidas

### Dashboard Geral

**Proposito:** Comparar performance entre multiplas obras.

**Graficos:**
- Comparativo de Progresso por Obra
- Taxa de Conformidade por Obra
- Ranking de Obras por Performance

### Gerenciar Obras

- Lista todas obras
- Wizard de criacao (3 passos)
- Empreendimentos (agrupamento virtual)

### Biblioteca FVS

- Lista todos servicos
- Criar novo servico
- Importar/Exportar Excel

### Gerenciar Usuarios

- Lista todos usuarios
- Convidar usuario (email)
- Atribuir a obras

### Configuracoes

- Dados da Empresa (logo, CNPJ, etc)
- Integracoes (SMTP)
- Automacoes (relatorios agendados)
- Alertas (triggers)

### Plano e Faturamento

- Plano atual
- Historico de pagamentos
- Alterar plano

---

## Referencias

- Navegacao: [04_NAVIGATION.md](04_NAVIGATION.md)
- Design System: [../design/DESIGN-SYSTEM.md](../design/DESIGN-SYSTEM.md)
- Relatorios: [09_REPORTS.md](09_REPORTS.md)
