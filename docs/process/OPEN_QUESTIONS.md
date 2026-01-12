# Questoes Abertas - ARDEN FVS

## Como Usar Este Arquivo

Liste aqui questoes que ainda nao foram decididas e impactam o desenvolvimento.

**Formato:**
```
### Pergunta?

**Contexto:** Por que essa questao e importante
**Opcoes:**
1. Opcao A - descricao
2. Opcao B - descricao
**Impacto no MVP:** Alto/Medio/Baixo
**Status:** Pendente / Em discussao / Decidido (ver DECISIONS.md)
```

---

## Questoes Pendentes

### Qual provedor de email usar para relatorios agendados?

**Contexto:** Relatorios automaticos precisam ser enviados por email.

**Opcoes:**
1. Resend - Moderno, bom DX, integracao simples
2. SendGrid - Mais estabelecido, mais features
3. Amazon SES - Mais barato em escala

**Impacto no MVP:** Medio (pode comecar com qualquer um)

**Status:** Pendente

---

### Qual biblioteca usar para geracao de PDF?

**Contexto:** Edge Functions precisam gerar PDFs dos relatorios.

**Opcoes:**
1. jsPDF - Leve, roda no Deno
2. pdfmake - Mais features, mais pesado
3. Puppeteer/Playwright - Renderiza HTML, mais flexivel

**Impacto no MVP:** Alto (core feature)

**Status:** Pendente

---

### Implementar testes E2E no MVP?

**Contexto:** Testes E2E garantem qualidade mas adicionam tempo.

**Opcoes:**
1. Sim, com Playwright - Mais confianca, mais tempo
2. Nao, apenas unit tests - Mais rapido, menos cobertura
3. Apenas fluxos criticos - Meio termo

**Impacto no MVP:** Medio

**Status:** Pendente

---

### Como lidar com fotos muito grandes?

**Contexto:** Usuarios podem tentar enviar fotos de 10+ MB.

**Opcoes:**
1. Rejeitar no cliente com mensagem - Simples
2. Comprimir automaticamente - Melhor UX
3. Upload progressivo com compressao no servidor - Mais complexo

**Impacto no MVP:** Baixo (ja temos compressao no cliente)

**Status:** Pendente - verificar se compressao atual e suficiente

---

### Monitoramento de erros: qual ferramenta?

**Contexto:** Precisamos detectar erros em producao.

**Opcoes:**
1. Sentry - Padrao da industria
2. LogRocket - Inclui session replay
3. Apenas logs do Supabase - Mais simples, menos features

**Impacto no MVP:** Medio

**Status:** Pendente

---

## Questoes Resolvidas

Quando uma questao for decidida, mova para [DECISIONS.md](DECISIONS.md) e remova daqui.
