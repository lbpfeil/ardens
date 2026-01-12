# App Mobile - ARDEN FVS

## Visao Geral

Interface principal para Engenheiros e Inspetores em campo.

### Caracteristicas Essenciais

- **Offline-first:** Funciona completamente sem internet
- **Sincronizacao automatica:** Ao detectar Wi-Fi/dados moveis
- **Gestos naturais:** Swipe esquerda/direita
- **Feed vertical:** Scroll infinito com containers
- **Feedback multissensorial:** Vibracao + som ao marcar item

### Plataformas

| Fase | Plataforma |
|------|------------|
| MVP | Android (React Native) |
| Fase 2 | iOS |

---

## Fluxo de Selecao de Verificacoes

1. Usuario entra na aba "Verificacoes"
2. Se tiver mais de uma obra, seleciona a obra
3. Escolhe modo de selecao:

### Modo A: Servico → Unidades
- Seleciona um servico (ex: Rejuntamento)
- Marca multiplas unidades (ex: B01, B02, B03, B04, B05)
- Sistema gera 5 verificacoes

### Modo B: Unidade → Servicos
- Seleciona uma unidade (ex: Casa B15)
- Marca multiplos servicos (ex: Pintura, Rejuntamento, Alvenaria)
- Sistema gera 3 verificacoes

4. **Filtro de status** (padrao: "Nao Avaliado"):
   - Nao Avaliado: apenas itens virgens (uso diario)
   - Nao Conforme: apenas itens com NC aberta (para reinspecao)
   - Todos: mostra tudo (raro)

5. Clica "Iniciar Verificacoes"

---

## Interface Feed de Verificacoes

Usuario ve **feed vertical** com **containers** representando cada verificacao.

### Caracteristicas
- **Scroll vertical livre:** Pode pular para qualquer verificacao
- **Containers dinamicos:** Encolhem conforme itens sao verificados
- **Containers somem:** Quando todos itens verificados
- **Liberdade de ordem:** Decide qual fazer primeiro
- **Botao UNDO:** Toast temporario aparece por 5s apos cada acao

---

## Gestos de Verificacao

### Swipe Direita → Conforme

1. Item desliza para fora (animacao 300ms)
2. Icone verde aparece e fade out (200ms)
3. Vibracao curta (haptic feedback)
4. Som: "ding" suave (configuravel)
5. Container ajusta altura
6. Item desaparece

**Filosofia:** Acao rapida, feedback imediato, sem telas intermediarias.

### Swipe Esquerda → Nao Conforme ou Excecao

1. Item desliza revelando dois botoes:
   - [Nao Conforme]
   - [Excecao]
2. Usuario escolhe

**Se "Excecao":** Item some imediatamente (som neutro).

**Se "Nao Conforme":** Abre modal de NC.

---

## Modal de Nao-Conformidade

### Campo Observacao (obrigatorio)
- Limite 1000 caracteres
- Teclado abre automaticamente
- **Sugestoes rapidas** (chips clicaveis): frases pre-definidas por servico
  - Exemplo Rejuntamento: "Junta suja", "Residuos", "Umido"
  - Ao clicar, texto e adicionado (permite combinacao)

### Fotos (opcional, ate 5)
- Botao "+ Tirar foto" abre camera diretamente
- Apos tirar: preview com [Usar] [Tirar novamente]
- Foto tem **timestamp automatico** (obra, data, hora, inspetor)
- Contador visual: "Fotos 2/5"

### Botoes Finais
- [Cancelar]: Item volta como "nao verificado"
- [Salvar NC]: Registra NC, item some do feed

---

## Visualizacao Detalhada de Item

Icone [i] ao lado do item abre tela fullscreen com:
- O que verificar (observacao completa)
- Metodo (como verificar)
- Tolerancia (criterio de aceitacao)
- Fotos de referencia (se disponivel)
- Norma tecnica (se disponivel)

**Barra fixa inferior:** [Conforme] [Excecao] [NC]

**Navegacao:** Sempre volta ao feed apos acao.

**Proposito:** Ajuda inspetores novatos ou quando ha duvida.

---

## Reinspecao de Nao-Conformidades

1. Na selecao, usuario muda filtro para "Nao Conforme"
2. Sistema mostra apenas itens com NC aberta
3. Feed aparece apenas com esses itens
4. Ao swipe direita (item corrigido), aparece submenu:
   - Conforme apos reinspecao
   - Retrabalho (aprovado mas custou corrigir)
   - Aprovado com concessao (aceito com defeito)
   - Reprovado apos retrabalho (continua errado)

5. Se "Reprovado", item volta para fila de NC

---

## Configuracoes do App

Acessivel via aba "Perfil" ou icone engrenagem:

### Notificacoes
- NCs atribuidas a mim
- Aprovacao de verificacoes

### Sons
- Som ao marcar Conforme (ativado padrao)
- Som ao marcar NC (desativado padrao)

### Vibracao
- Feedback tatil (ativado padrao)

### Fotos
- Qualidade (Alta, Media, Baixa)

### Sincronizacao
- Wi-Fi apenas (economia dados)
- Wi-Fi + Dados moveis

### Conta
- Ver perfil, trocar senha, sair

---

## Referencias

- Sincronizacao offline: [../tech/04_OFFLINE_SYNC.md](../tech/04_OFFLINE_SYNC.md)
- Stack tecnica: [../tech/06_MOBILE_TECH.md](../tech/06_MOBILE_TECH.md)
