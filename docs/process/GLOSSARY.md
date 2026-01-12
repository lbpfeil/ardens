# Glossario - ARDEN FVS

## Termos do Dominio

### FVS - Ficha de Verificacao de Servicos
Documento padrao PBQP-H que lista itens a serem verificados em cada servico de construcao.

### PBQP-H - Programa Brasileiro da Qualidade e Produtividade do Habitat
Programa governamental que certifica construtoras. Obrigatorio para acesso a financiamento bancario.

### NC - Nao Conformidade
Item que nao atende aos criterios de qualidade. Requer foto e observacao.

### IRS - Indice de Retrabalho por Servico
Metrica que mede a porcentagem de itens que precisaram de retrabalho.
Formula: (Itens com Retrabalho / Total Verificados) x 100

### CI - Condicoes de Inicio
Pre-requisitos que precisam estar aprovados antes de iniciar um servico.
Ex: Piso precisa estar OK antes de liberar rejuntamento.

### Verificacao
Inspecao de um servico em uma unidade especifica.
Ex: "Verificacao de Rejuntamento na Casa B03"

### Reinspecao
Segunda (ou mais) verificacao de um item que estava Nao Conforme.

### Retrabalho
Quando uma NC foi corrigida e o item passou na reinspecao.
Impacta negativamente o IRS.

---

## Termos de Estrutura

### Cliente / Construtora
Empresa que usa o sistema. Cada cliente e um tenant isolado.

### Obra
Projeto de construcao. Ex: "Residencial Aurora"

### Agrupamento
Divisao dentro de uma obra. Ex: "Quadra A", "Torre 1", "Pavimento 2"

### Unidade
Casa ou apartamento individual. Ex: "Casa A01", "Apto 201"

### Servico
Tipo de verificacao. Ex: "Rejuntamento", "Alvenaria", "Pintura"

### Item de Verificacao
Ponto especifico a ser verificado dentro de um servico.
Contem: observacao, metodo, tolerancia.

### Empreendimento
Agrupamento virtual de multiplas obras para relatorios consolidados.

### Tag
Etiqueta customizavel para filtrar agrupamentos.
Ex: "Etapa 1", "Financiamento Caixa"

---

## Termos de Status

### Nao Verificado
Estado inicial de um item. Ainda nao foi inspecionado.

### Conforme
Item atende aos criterios de qualidade.

### Nao Conforme
Item nao atende aos criterios. Requer foto + observacao.

### Excecao
Item nao se aplica ao contexto da unidade.

### Conforme Apos Reinspecao
Na reinspecao, descobriu-se que nao havia problema real.

### Aprovado com Concessao
Defeito toleravel aceito sem correcao.

### Reprovado Apos Retrabalho
Tentaram corrigir mas continua errado.

---

## Termos Tecnicos

### RLS - Row Level Security
Mecanismo do PostgreSQL para isolar dados por tenant no nivel do banco.

### SSOT - Single Source of Truth
Principio: cada informacao tem um unico lugar canonico.

### Edge Function
Funcao serverless que roda no Supabase (Deno runtime).

### Sync
Processo de sincronizacao entre app mobile (offline) e servidor.

### First Write Wins
Estrategia de resolucao de conflitos onde o primeiro a sincronizar prevalece.

---

## Personas

### Admin / Administrador
Gerente de qualidade ou dono da construtora. Configura tudo.

### Engenheiro
Responsavel tecnico. Faz e supervisiona verificacoes.

### Inspetor
Executa verificacoes em campo. Usa apenas app mobile.

### Almoxarife
Controla liberacao de materiais baseado em CIs.

### Super Admin
Equipe Arden. Suporte e manutencao do sistema.
