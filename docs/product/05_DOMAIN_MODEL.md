# Modelo de Dominio - ARDEN FVS

## Hierarquia de Obras

### Estrutura: 2 Niveis Fisicos + Tags Flexiveis

```
OBRA
+-- AGRUPAMENTO (obrigatorio: Quadra A, Torre 1, Pavimento 2)
    +-- UNIDADES (obrigatorias: Casa A01, Apto 201)
```

**Tags (opcional):** Aplicadas aos agrupamentos para filtros/relatorios.
- Exemplos: "Etapa 1", "Financiamento Caixa", "Recursos Proprios"

**Empreendimentos (opcional):** Agrupamento virtual de multiplas obras para relatorios consolidados.

### Por que 2 Niveis?
- **Simplicidade:** Todos entendem "Obra > Grupo > Unidade"
- **Flexibilidade:** Atende 99% dos casos reais
- **Performance:** Queries mais simples

---

## Casos Especificos

### Loteamento Horizontal (50 casas em 3 quadras)
- Obra: Loteamento Vista Verde
- Agrupamentos: Quadra A, Quadra B, Quadra C
- Unidades: Casa A01, A02..., B01, B02..., C01, C02...

### Predio com 2 Torres
- Obra: Residencial Aurora
- Agrupamentos: Torre 1, Torre 2
- Unidades: Apto 101, 102... (torre 1), Apto 201, 202... (torre 2)

### Obra Pequena (4 casas)
- Obra: Residencial Pequeno
- Agrupamento: "Padrao" (nome automatico)
- Unidades: Casa 1, 2, 3, 4

### Obra em Etapas (usando tags)
- Obra: Residencial Aurora
- Quadra A [tags: Etapa 1, Caixa]
- Quadra B [tags: Etapa 1, Proprio]
- Quadra C [tags: Etapa 2, Caixa]
- Permite relatorios filtrados sem criar obras separadas

---

## Estrutura de Servicos (FVS)

### Biblioteca por Cliente

Cada construtora tem sua propria biblioteca (nao compartilhada).

**Volumetria tipica:**
- Obra: 15-25 servicos ativos
- Construtora pequena: ~40 servicos total
- Construtora grande: ~100 servicos total

### Estrutura de um Servico

**Campos Obrigatorios:**
- Codigo (ex: PRC-001, REJ-003)
- Nome (ex: "Portas e Janelas de Aluminio")
- Lista de itens de verificacao (minimo 1):
  - Observacao (o que verificar)
  - Metodo (como verificar)
  - Tolerancia (criterio de aceitacao)

**Campos Opcionais:**
- Categoria (Estrutura, Acabamento, Instalacoes)
- Fotos de referencia (correto/incorreto)
- Referencia normativa (NBR, PBQP-H)
- Condicoes de Inicio (quais servicos precisam estar OK antes)

---

## Estrutura de Verificacoes

### Conceito

**Verificacao** = Inspecao de um **Servico** em uma **Unidade** especifica.

Exemplo: "Verificacao de Rejuntamento na Casa B03".

Uma verificacao contem multiplos **Itens**, cada um com status individual.

---

## Status de Itens

### Primeira Inspecao

| Status | Descricao | Icone |
|--------|-----------|-------|
| Nao Verificado | Estado inicial | Vazio |
| Conforme | Atende aos criterios | Verde |
| Nao Conforme | Problema identificado (requer foto + observacao) | Vermelho |
| Excecao | Nao se aplica ao contexto | Cinza |

### Reinspecao (se item estava Nao Conforme)

| Status | Descricao | Impacta IRS? |
|--------|-----------|--------------|
| Conforme apos reinspecao | Nao havia problema real | Nao |
| Retrabalho | Correcao foi executada | **Sim** |
| Aprovado com concessao | Defeito toleravel aceito | Nao |
| Reprovado apos retrabalho | Continua errado | Nao (ate resolver) |

---

## Status de Verificacao (nivel servico + unidade)

| Status | Descricao |
|--------|-----------|
| Pendente | Ainda ha itens nao verificados |
| Concluida | Todos os itens verificados (sem NCs abertas) |
| Com NC | Possui nao-conformidades aguardando resolucao |

---

## IRS - Indice de Retrabalho por Servico

### Formula

```
IRS = (Itens com status "Retrabalho" / Total de Itens Verificados) x 100
```

### Interpretacao

| IRS | Status |
|-----|--------|
| < 10% | Saudavel (verde) |
| 10-15% | Atencao (amarelo) |
| > 15% | Critico (vermelho) |

---

## Invariantes do Sistema

1. **Verificacoes sao imutaveis** apos salvas
2. Nao podem ser editadas, apenas excluidas
3. Exclusao apenas por Admin, com justificativa registrada em log
4. Garante rastreabilidade completa para auditorias PBQP-H

---

## Referencias

- Schema SQL: `database/schema.sql`
- Banco de dados: [../tech/02_DATABASE.md](../tech/02_DATABASE.md)
