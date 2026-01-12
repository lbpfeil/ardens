# Seguranca e LGPD - ARDEN FVS

## LGPD e Privacidade

### Bases Legais (Art. 7)

| Dados | Base Legal |
|-------|------------|
| Cadastro usuario | Execucao de contrato (V) |
| Verificacoes | Interesse legitimo (IX) + Obrigacao regulatoria (II) |
| Fotos de NC | Interesse legitimo (IX) |
| Logs de auditoria | Obrigacao regulatoria (II) |

### Direitos do Titular

| Direito LGPD | Implementacao |
|--------------|---------------|
| Acesso aos dados | Via suporte (solicitacao por email) |
| Correcao | Self-service no perfil |
| Exclusao | Self-service (botao "Excluir conta") |
| Portabilidade | Via suporte (exporta em JSON) |

### Politica de Retencao

| Situacao | Retencao |
|----------|----------|
| Cliente ativo | Dados mantidos indefinidamente |
| Cliente cancelou assinatura | 90 dias para exportar, depois exclusao |
| Usuario excluiu conta | Dados pessoais removidos, verificacoes anonimizadas |
| Logs de auditoria | Mesmo periodo da conta |

---

## Exclusao de Conta (Self-Service)

### Fluxo

1. Usuario acessa Perfil → "Excluir minha conta"
2. Modal de confirmacao explica consequencias
3. Usuario digita "EXCLUIR" para confirmar
4. Sistema:
   - Remove dados pessoais (nome, email, telefone)
   - Anonimiza verificacoes (`inspetor_id = null`)
   - Remove da tabela `usuarios`
   - Exclui de `auth.users`
5. Email de confirmacao enviado

### Restricao

Admin nao pode excluir propria conta se for o unico admin do cliente.

---

## Seguranca de Infraestrutura

### Criptografia

| Dado | Em Transito | Em Repouso |
|------|-------------|------------|
| API requests | TLS 1.3 (Supabase) | - |
| Banco de dados | TLS | AES-256 (Supabase) |
| Fotos (Storage) | TLS | AES-256 (Supabase) |
| Senhas | - | bcrypt (Supabase Auth) |

### Backup

| Aspecto | Configuracao |
|---------|--------------|
| Frequencia | Diario automatico (Supabase) |
| Retencao | 7 dias (Plano Pro) |
| Point-in-time recovery | Suportado |
| Teste de restore | Trimestral (manual) |

### Rate Limiting

| Endpoint | Limite |
|----------|--------|
| Login | 5 tentativas/minuto por IP |
| API geral | 100 req/minuto por usuario |
| Upload fotos | 20/minuto por usuario |

### Headers de Seguranca (Web)

```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
Strict-Transport-Security: max-age=31536000
```

---

## Checklist de Seguranca

### MVP

- [x] RLS em todas tabelas
- [x] Autenticacao via Supabase Auth
- [x] HTTPS obrigatorio
- [x] Senhas com bcrypt
- [x] JWT com expiracao
- [x] Logs de acoes criticas
- [x] Politica de retencao definida

### Fase 2

- [ ] 2FA opcional
- [ ] SSO (Google/Microsoft)
- [ ] Triggers automaticos de auditoria
- [ ] Dashboard de logs para Admin
- [ ] Tela de sessoes ativas
- [ ] Rate limiting customizavel

### Nao Planejado (Complexidade vs Valor)

| Item | Motivo |
|------|--------|
| ISO 27001 | Custo proibitivo para MVP |
| SOC 2 | Avaliar apos 100+ clientes |
| Criptografia client-side | Desnecessario com TLS + AES |

---

## Referencias

- Permissoes RLS: [03_RLS_PERMISSIONS.md](03_RLS_PERMISSIONS.md)
- Auditoria: `database/rls-policies.sql`
