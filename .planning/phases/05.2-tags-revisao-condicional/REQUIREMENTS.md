# Phase 5.2: Tags e Revisão Condicional

## Objetivo

Implementar sistema de tags para organização de itens de verificação e tornar o trigger de revisão condicional (apenas quando serviço já foi ativado em alguma obra).

## Requisitos

### REQ-01: Revisão Condicional

**Regra:** Edições de serviço/itens só geram revisão se o serviço já foi ativado em pelo menos uma obra (histórico).

| Estado do Serviço | Edição gera revisão? |
|-------------------|---------------------|
| Nunca foi ativado em nenhuma obra | Não |
| Já foi ativado em ≥1 obra (mesmo que desativado depois) | Sim |

**Implementação:**
- Novo campo `primeira_ativacao_em` (timestamp) na tabela `servicos`
- Preenchido na primeira vez que o serviço é ativado em qualquer obra
- Uma vez preenchido, nunca é resetado (mesmo se desativado de todas as obras)
- Lógica de edição verifica: `if (servico.primeira_ativacao_em) { incrementar revisão }`

**UI:**
- Modal de edição mostra campo "Descrição da mudança" apenas se `primeira_ativacao_em` existir
- Feedback visual indicando se serviço está em "modo rascunho" ou "modo versionado"

### REQ-02: Entidade Tags

**Atributos:**
- `id`: UUID
- `cliente_id`: UUID (FK)
- `nome`: VARCHAR(50), obrigatório
- `cor`: VARCHAR(7), hex color (ex: "#3B82F6"), obrigatório
- `ordem`: INTEGER, para ordenação
- `created_at`, `updated_at`: timestamps

**Regras:**
- Tags são globais por construtora (cliente_id)
- Não podem ser deletadas, apenas renomeadas/recoloridas
- Ordem determina sequência de exibição nas tabelas de itens

### REQ-03: Página de Tags

**Rota:** `/app/tags`

**Funcionalidades:**
- Listar todas as tags da construtora
- Criar nova tag (nome + cor)
- Editar tag existente (nome + cor)
- Reordenar tags (drag-and-drop na própria lista)

**UI:**
- Tabela com: cor (preview), nome, ações (editar)
- Botão "Nova Tag" abre modal
- Drag-and-drop para reordenar

### REQ-04: Tags em Itens de Verificação

**Schema:**
- Novo campo `tag_id` (UUID, nullable, FK) na tabela `itens_servico`

**Modal de Item:**
- Campo opcional "Tag" (select/combobox)
- Lista tags disponíveis da construtora
- Permite "Sem tag" (null)

### REQ-05: Tabela de Itens Agrupada por Tags

**Visualização:**
- Itens agrupados por tag
- Cada grupo tem header com nome da tag (borda lateral colorida)
- Itens sem tag aparecem primeiro, sem header de seção
- Ordem dos grupos segue `tags.ordem`
- Dentro de cada grupo, itens ordenados por `itens_servico.ordem`

**Estrutura visual:**
```
[Itens sem tag - sem header]
  Item 1
  Item 2

[Tag: Alvenaria] ━━━ (borda azul)
  Item 3
  Item 4

[Tag: Pintura] ━━━ (borda verde)
  Item 5
```

### REQ-06: Reordenação de Itens entre Tags

**Funcionalidade:** Drag-and-drop de itens entre seções

**Comportamento:**
- Arrastar item de uma tag para outra atualiza `tag_id`
- Arrastar dentro da mesma tag atualiza `ordem`
- Visual feedback durante drag (ghost, drop zones)

### REQ-07: Reordenação de Tags (Seções)

**Funcionalidade:** Botão "Reordenar Tags" abre modal

**Modal:**
- Lista de tags com drag-and-drop
- Preview da nova ordem
- Botões "Cancelar" / "Salvar"
- Salvar atualiza `tags.ordem` para todas as tags

**Justificativa:** Modal separado é mais robusto que DnD inline de seções inteiras.

## Critérios de Sucesso

1. [ ] Engenheiro edita serviço não-ativado sem gerar revisão
2. [ ] Engenheiro edita serviço já-ativado e revisão é incrementada
3. [ ] Engenheiro cria/edita tags na página /app/tags
4. [ ] Engenheiro associa tag a item de verificação no modal
5. [ ] Tabela de itens mostra agrupamento por tags com borda colorida
6. [ ] Engenheiro arrasta item de uma tag para outra
7. [ ] Engenheiro reordena sequência de tags via modal

## Dependências

- Phase 5.1 (sistema de revisões existente)
- @dnd-kit (já instalado para agrupamentos)

## Notas Técnicas

- Reutilizar padrões de drag-and-drop de agrupamentos (Phase 3)
- Tags RLS: mesmo padrão de outras entidades (cliente_id match)
- Considerar criar componente `TaggedItemsTable` reutilizável
