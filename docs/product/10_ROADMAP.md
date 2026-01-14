# Roadmap - ARDEN FVS

## Fases do Produto

### Fase MVP (3 meses)

**Objetivo:** Produto funcional para validacao com clientes reais.

**Plataformas:**
- Portal Web (Next.js) - Admin e Engenheiro
- App Mobile Android (Expo) - Inspetores

**Funcionalidades Core:**
- Gestao de obras, unidades, agrupamentos
- Biblioteca FVS (servicos e itens de verificacao)
- Verificacoes com fotos de NC
- Sincronizacao offline completa
- Reinspecao de nao-conformidades
- Condicoes de Inicio (CIs) com portal do Almoxarife
- 4 relatorios MVP
- Agendamento automatico de relatorios
- Multi-tenancy com RLS
- Autenticacao Supabase (email + senha)

**O que NAO entra no MVP:**
- iOS
- 2FA / SSO
- Dashboard Telao
- Relatorios com IA
- Integracoes externas (ERPs)

---

### Fase Beta (1-2 meses apos MVP)

**Objetivo:** Validacao intensiva com construtoras parceiras.

**Quantidade:** 1-2 construtoras parceiras

**Criterios de Selecao:**
- Certificacao PBQP-H ativa
- Minimo 2 obras simultaneas
- Disposicao para dar feedback constante
- Relacionamento previo (parceria)

**Duracao:** 4-8 semanas antes do lancamento publico

**Incentivo:** Uso gratuito durante beta + desconto no primeiro ano

---

### Fase 2 (Pos-Lancamento)

**Prioridades em ordem:**

1. **Relatorios com IA**
   - Analise preditiva de NCs
   - Projecoes de conclusao
   - Identificacao de padroes

2. **iOS**
   - React Native/Expo ja compila para iOS
   - Custo: $99/ano Apple Developer
   - Baixo esforco tecnico adicional

3. **Seguranca Avancada**
   - 2FA (autenticacao em dois fatores)
   - SSO para construtoras maiores

---

### Fase 3 (Futuro)

**Features PRO:**
- Dashboard Telao (TV na obra)
- Integracoes com ERPs (TOTVS, SAP)
- API publica com webhooks
- White-label para grandes construtoras

---

## Estrategia de Onboarding

### Modelo Hibrido

**Self-Service (Padrao):**
- Construtora cria conta sozinha
- Tour guiado no primeiro acesso
- Central de ajuda com tutoriais
- Videos curtos por funcionalidade
- **Vantagem competitiva:** Inovador no ramo

**White-Glove (Contas Estrategicas):**
- Para construtoras grandes e parcerias-chave
- Venda presencial/consultiva
- Setup completo feito pelo Arden
- Treinamento presencial ou por call

### Fluxo Self-Service

```
1. Acessa site → "Comecar Gratis"
2. Cria conta (email + senha)
3. Tour guiado
4. Cria primeira obra
5. Configura unidades e servicos
6. Convida inspetores
7. Inspetores baixam app
8. Trial 30 dias → Conversao
```

---

## Cronograma Macro

```
MES 1-3: Desenvolvimento MVP
├── Mes 1: Setup + Schema + Auth + Portal basico
├── Mes 2: Verificacoes + Sync offline + App mobile
└── Mes 3: Relatorios + Polimento + Testes

MES 4-5: Beta Fechado
├── Mes 4: Deploy + Onboarding beta testers
└── Mes 5: Feedback + Correcoes + Melhorias

MES 6: Lancamento Publico
├── Self-service ativo
├── Marketing inicial
└── Primeiros clientes pagantes

MES 7-12: Crescimento + Fase 2
├── Aquisicao de clientes
├── Desenvolvimento iOS
└── Relatorios com IA
```

---

## Riscos e Mitigacoes

| Risco | Probabilidade | Impacto | Mitigacao |
|-------|---------------|---------|-----------|
| Atraso no MVP | Media | Alto | Buffer de 2-4 semanas |
| Bug critico em producao | Media | Alto | Testes rigorosos + Monitoramento |
| Churn alto no beta | Baixa | Medio | Feedback constante + Ajustes rapidos |
| Sync offline com problemas | Media | Alto | Testes exaustivos de cenarios edge |
| Competidor lanca similar | Baixa | Medio | Foco em UX superior + Self-service |

---

## Checklist Pre-Lancamento

### Tecnico
- [ ] Todos os testes passando
- [ ] Performance validada (queries < 200ms)
- [ ] Sync offline testada em cenarios reais
- [ ] Backup automatico funcionando
- [ ] Monitoramento e alertas configurados
- [ ] SSL/HTTPS em producao

### Legal
- [ ] Termos de Uso redigidos
- [ ] Politica de Privacidade (LGPD)
- [ ] Conta Google Play ativa
- [ ] CNPJ e contrato de prestacao de servicos

### Marketing
- [ ] Landing page pronta
- [ ] Video demo (2-3 minutos)
- [ ] Casos de uso documentados
- [ ] Precos publicados

### Suporte
- [ ] Central de ajuda com artigos basicos
- [ ] Email de suporte configurado
- [ ] Processo de onboarding documentado

---

## Referencias

- Modelo de negocio: [02_BUSINESS_MODEL.md](02_BUSINESS_MODEL.md)
- Arquitetura: [../tech/01_ARCHITECTURE.md](../tech/01_ARCHITECTURE.md)
