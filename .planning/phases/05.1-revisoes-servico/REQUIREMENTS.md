# Phase 5.1: Sistema de Revisões de Serviços

## Goal

Implementar sistema de controle de revisões para serviços FVS, permitindo rastrear mudanças e gerenciar atualizações por obra.

## Context

Todo serviço FVS precisa de controle de revisão (padrão PBQP-H):
- Revisão inicial: "00"
- Incrementa quando serviço é modificado
- Obras podem estar em revisões diferentes do mesmo serviço
- Atualização de revisão na obra deve ser explícita (não automática)

## Requirements

### REV-01: Revisão na Biblioteca
Serviço deve armazenar revisão atual, histórico de revisões e descrição das mudanças.

### REV-02: Incremento Automático
Ao editar um serviço, sistema deve:
- Exigir descrição da mudança
- Incrementar revisão automaticamente ("00" → "01" → "02"...)
- Registrar data e autor da revisão

### REV-03: Histórico de Revisões
Usuário pode visualizar histórico completo de revisões de um serviço:
- Número da revisão
- Data da mudança
- Descrição da mudança
- Quem modificou

### REV-04: Revisão por Obra
Cada obra mantém registro de qual revisão de cada serviço está utilizando:
- Ao ativar serviço, usa revisão atual
- Revisão da obra não muda automaticamente quando biblioteca atualiza

### REV-05: Atualização de Revisão na Obra
Usuário pode atualizar revisão de um serviço na obra:
- Ver indicador de que há revisão mais nova disponível
- Escolher atualizar para revisão mais recente
- Dados de verificações existentes são mantidos

### REV-06: Visualização de Diferenças (opcional)
Usuário pode ver o que mudou entre revisões (nice to have, pode ficar para depois).

## Success Criteria

1. Serviço mostra revisão atual na lista e detalhe (ex: "Rev. 02")
2. Ao editar serviço, modal exige descrição da mudança
3. Histórico de revisões acessível na página de detalhe do serviço
4. Obra mostra qual revisão está usando de cada serviço
5. Indicador visual quando há revisão mais nova disponível
6. Botão "Atualizar revisão" na página de serviços da obra

## Technical Considerations

### Schema Changes
```sql
-- Adicionar a servicos
ALTER TABLE servicos ADD COLUMN revisao VARCHAR(5) DEFAULT '00';
ALTER TABLE servicos ADD COLUMN revisao_descricao TEXT;
ALTER TABLE servicos ADD COLUMN revisao_updated_at TIMESTAMPTZ;

-- Nova tabela de histórico
CREATE TABLE servico_revisoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID REFERENCES servicos(id) ON DELETE CASCADE,
  revisao VARCHAR(5) NOT NULL,
  descricao TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Adicionar a obra_servicos
ALTER TABLE obra_servicos ADD COLUMN revisao_ativa VARCHAR(5) DEFAULT '00';
```

### Affected Areas
- `servicos.ts` - updateServico deve incrementar revisão
- `obra-servicos.ts` - activateServico deve copiar revisão atual
- UI Biblioteca - mostrar revisão, histórico
- UI Obra > Serviços - mostrar revisão, indicador de update

## Dependencies

- Phase 5 (Biblioteca FVS) - já implementado
- Autenticação para saber quem fez mudança (pode usar placeholder)

## Estimated Plans

1. **05.1-01**: Schema changes + data access layer
2. **05.1-02**: Edição de serviço com incremento de revisão
3. **05.1-03**: Histórico de revisões na página de detalhe
4. **05.1-04**: Revisão por obra + indicador de atualização
