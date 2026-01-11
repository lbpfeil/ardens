-- ============================================================================
-- ARDEN FVS - Schema do Banco de Dados
-- ============================================================================
-- Versão: 1.0
-- Data: Janeiro 2026
-- Database: PostgreSQL 15+ via Supabase
-- ============================================================================

-- ============================================================================
-- PARTE 1: TIPOS ENUM
-- ============================================================================

-- Perfis de usuário no sistema
CREATE TYPE perfil_usuario AS ENUM (
  'admin',           -- Gerencia obras, usuários, configurações
  'engenheiro',      -- Acessa dashboards, relatórios, faz verificações
  'inspetor',        -- Apenas app mobile, verificações em campo
  'almoxarife'       -- Portal simplificado, libera materiais (feature opcional)
);

-- Tipologia da obra
CREATE TYPE tipologia_obra AS ENUM (
  'residencial_horizontal',  -- Loteamento, casas
  'residencial_vertical',    -- Prédios, torres
  'comercial',               -- Lojas, escritórios
  'retrofit',                -- Reforma/modernização
  'misto'                    -- Combinação
);

-- Categorias fixas de serviços FVS
CREATE TYPE categoria_servico AS ENUM (
  'fundacao',        -- Fundação
  'estrutura',       -- Estrutura
  'alvenaria',       -- Alvenaria
  'revestimento',    -- Revestimento
  'acabamento',      -- Acabamento
  'instalacoes',     -- Instalações (elétrica, hidráulica, etc)
  'cobertura',       -- Cobertura/Telhado
  'esquadrias',      -- Portas, janelas
  'pintura',         -- Pintura
  'impermeabilizacao', -- Impermeabilização
  'outros'           -- Outros serviços
);

-- Status da primeira inspeção de um item
CREATE TYPE status_inspecao AS ENUM (
  'nao_verificado',  -- Estado inicial
  'conforme',        -- Item OK
  'nao_conforme',    -- Item com problema (NC)
  'excecao'          -- Item não se aplica
);

-- Status da reinspeção (quando item era NC)
CREATE TYPE status_reinspecao AS ENUM (
  'conforme_apos_reinspecao',   -- Não havia problema real
  'retrabalho',                 -- Correção executada (impacta IRS)
  'aprovado_com_concessao',     -- Defeito tolerável aceito
  'reprovado_apos_retrabalho'   -- Correção insuficiente
);

-- Status geral de uma verificação (serviço em unidade)
CREATE TYPE status_verificacao AS ENUM (
  'pendente',        -- Nenhum item verificado ainda
  'em_andamento',    -- Alguns itens verificados
  'concluida',       -- Todos itens verificados, sem NC aberta
  'com_nc'           -- Tem pelo menos 1 NC aberta
);

-- Tipos de notificação no feed
CREATE TYPE tipo_notificacao AS ENUM (
  'conflito_sync',           -- Item rejeitado por conflito
  'nova_obra_atribuida',     -- Usuário ganhou acesso a obra
  'nova_unidade',            -- Novas unidades criadas
  'novo_servico',            -- Novo serviço ativado na obra
  'nc_aberta',               -- NC registrada (para engenheiro)
  'nc_fechada',              -- NC fechada
  'relatorio_gerado',        -- Relatório agendado gerado
  'permissao_revogada',      -- Acesso removido
  'sistema'                  -- Mensagens do sistema
);

-- Frequência de agendamento de relatórios
CREATE TYPE frequencia_relatorio AS ENUM (
  'diario',
  'semanal',
  'quinzenal',
  'mensal'
);

-- Tipos de relatório
CREATE TYPE tipo_relatorio AS ENUM (
  'fvs_grupo_unidades',      -- FVS por Grupo de Unidades
  'rnc',                     -- Relatório de Não Conformidades
  'dashboard_executivo',     -- Dashboard Executivo
  'eficiencia_correcao'      -- Eficiência de Correção
);


-- ============================================================================
-- PARTE 2: TABELAS DE MULTI-TENANCY
-- ============================================================================

-- Clientes (construtoras) - tenant principal
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identificação
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) UNIQUE,

  -- Contato
  email_principal VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),

  -- Endereço (opcional)
  endereco TEXT,
  cidade VARCHAR(100),
  estado CHAR(2),

  -- Plano/Assinatura
  plano VARCHAR(50) DEFAULT 'trial',  -- trial, basico, profissional, pro
  data_inicio_trial TIMESTAMPTZ DEFAULT NOW(),
  data_fim_trial TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 days',
  assinatura_ativa BOOLEAN DEFAULT true,

  -- Configurações
  config JSONB DEFAULT '{}',

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clientes_cnpj ON clientes(cnpj);
CREATE INDEX idx_clientes_assinatura ON clientes(assinatura_ativa);


-- ============================================================================
-- PARTE 3: TABELAS DE USUÁRIOS E PERMISSÕES
-- ============================================================================

-- Usuários (perfil estendido do auth.users do Supabase)
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identificação
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  avatar_url TEXT,

  -- Perfil padrão (pode ter diferentes perfis por cliente)
  perfil_padrao perfil_usuario DEFAULT 'inspetor',

  -- Configurações pessoais
  config JSONB DEFAULT '{
    "notificacoes": true,
    "som_conforme": true,
    "som_nc": false,
    "vibracao": true,
    "qualidade_foto": "media",
    "sync_wifi_only": true
  }',

  -- Status
  ativo BOOLEAN DEFAULT true,

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_ativo ON usuarios(ativo);


-- Relação N:N entre usuários e clientes (multi-tenant)
CREATE TABLE usuario_clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

  -- Perfil neste cliente específico
  perfil perfil_usuario NOT NULL DEFAULT 'inspetor',

  -- Status
  ativo BOOLEAN DEFAULT true,

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  UNIQUE(usuario_id, cliente_id)
);

CREATE INDEX idx_usuario_clientes_usuario ON usuario_clientes(usuario_id);
CREATE INDEX idx_usuario_clientes_cliente ON usuario_clientes(cliente_id);


-- ============================================================================
-- PARTE 4: TABELAS DE OBRAS, AGRUPAMENTOS, UNIDADES
-- ============================================================================

-- Obras
CREATE TABLE obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

  -- Identificação
  nome VARCHAR(255) NOT NULL,
  codigo VARCHAR(50),  -- Código interno da construtora
  tipologia tipologia_obra DEFAULT 'residencial_horizontal',

  -- Localização (apenas coordenadas, conforme decidido)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Responsável
  responsavel_tecnico VARCHAR(255),

  -- Status
  ativo BOOLEAN DEFAULT true,
  arquivada BOOLEAN DEFAULT false,

  -- Configurações da obra
  config JSONB DEFAULT '{
    "ci_ativo": false,
    "aprovacao_verificacoes": false,
    "liberar_inspecoes": false
  }',

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_obras_cliente ON obras(cliente_id);
CREATE INDEX idx_obras_ativo ON obras(ativo) WHERE ativo = true;


-- Empreendimentos (agrupamento virtual de obras para relatórios)
CREATE TABLE empreendimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

  nome VARCHAR(255) NOT NULL,
  descricao TEXT,

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_empreendimentos_cliente ON empreendimentos(cliente_id);


-- Relação N:N obras-empreendimentos
CREATE TABLE obra_empreendimentos (
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  empreendimento_id UUID NOT NULL REFERENCES empreendimentos(id) ON DELETE CASCADE,

  PRIMARY KEY (obra_id, empreendimento_id)
);


-- Agrupamentos (Quadras, Torres, Blocos, etc)
CREATE TABLE agrupamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,

  nome VARCHAR(100) NOT NULL,
  ordem INT DEFAULT 0,  -- Para ordenação na UI

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_agrupamentos_obra ON agrupamentos(obra_id);


-- Tags (aplicadas a agrupamentos)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

  nome VARCHAR(100) NOT NULL,
  cor VARCHAR(7) DEFAULT '#3ecf8e',  -- Hex color

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(cliente_id, nome)
);

CREATE INDEX idx_tags_cliente ON tags(cliente_id);


-- Relação N:N agrupamentos-tags
CREATE TABLE agrupamento_tags (
  agrupamento_id UUID NOT NULL REFERENCES agrupamentos(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,

  PRIMARY KEY (agrupamento_id, tag_id)
);


-- Unidades (Casas, Apartamentos, etc)
CREATE TABLE unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agrupamento_id UUID NOT NULL REFERENCES agrupamentos(id) ON DELETE CASCADE,

  nome VARCHAR(100) NOT NULL,  -- Ex: "Casa A01", "Apto 201"
  codigo VARCHAR(50),          -- Código alternativo
  ordem INT DEFAULT 0,         -- Para ordenação na UI

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_unidades_agrupamento ON unidades(agrupamento_id);


-- Permissões de usuário por obra (binário: tem ou não tem)
CREATE TABLE usuario_obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(usuario_id, obra_id)
);

CREATE INDEX idx_usuario_obras_usuario ON usuario_obras(usuario_id);
CREATE INDEX idx_usuario_obras_obra ON usuario_obras(obra_id);


-- ============================================================================
-- PARTE 5: TABELAS DE BIBLIOTECA FVS (SERVIÇOS E ITENS)
-- ============================================================================

-- Serviços (FVS) - Biblioteca do cliente
CREATE TABLE servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,

  -- Identificação
  codigo VARCHAR(50) NOT NULL,  -- Ex: PRC-001, REJ-003
  nome VARCHAR(255) NOT NULL,   -- Ex: "Portas e Janelas de Alumínio"

  -- Classificação
  categoria categoria_servico DEFAULT 'outros',

  -- Referência técnica (opcional)
  referencia_normativa TEXT,  -- NBR, PBQP-H, etc

  -- Status
  ativo BOOLEAN DEFAULT true,
  arquivado BOOLEAN DEFAULT false,  -- Soft delete

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(cliente_id, codigo)
);

CREATE INDEX idx_servicos_cliente ON servicos(cliente_id);
CREATE INDEX idx_servicos_categoria ON servicos(categoria);
CREATE INDEX idx_servicos_ativo ON servicos(ativo) WHERE ativo = true;


-- Itens de Verificação (pertence a um serviço)
CREATE TABLE itens_servico (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,

  -- Conteúdo do item
  observacao TEXT NOT NULL,   -- O que verificar
  metodo TEXT,                -- Como verificar
  tolerancia TEXT,            -- Critério de aceitação

  -- Ordenação
  ordem INT DEFAULT 0,

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_itens_servico_servico ON itens_servico(servico_id);


-- Fotos de referência do serviço (correto/incorreto)
CREATE TABLE fotos_referencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,

  -- Caminho no storage
  path TEXT NOT NULL,

  -- Tipo
  tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('correto', 'incorreto')),

  -- Descrição opcional
  descricao TEXT,

  -- Ordenação
  ordem INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fotos_referencia_servico ON fotos_referencia(servico_id);


-- Condições de Início (CI) - dependências entre serviços
CREATE TABLE condicoes_inicio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Serviço que tem a dependência
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,

  -- Serviço que precisa estar conforme antes
  servico_dependencia_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,

  -- Pode especificar item específico (opcional)
  item_dependencia_id UUID REFERENCES itens_servico(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(servico_id, servico_dependencia_id)
);

CREATE INDEX idx_ci_servico ON condicoes_inicio(servico_id);


-- Sugestões rápidas de observação (chips no modal de NC)
CREATE TABLE sugestoes_observacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,

  texto VARCHAR(100) NOT NULL,  -- Ex: "Junta suja", "Resíduos"
  ordem INT DEFAULT 0,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sugestoes_servico ON sugestoes_observacao(servico_id);


-- Serviços ativos por obra (quais serviços da biblioteca estão habilitados)
CREATE TABLE obra_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,

  -- Status nesta obra
  ativo BOOLEAN DEFAULT true,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(obra_id, servico_id)
);

CREATE INDEX idx_obra_servicos_obra ON obra_servicos(obra_id);
CREATE INDEX idx_obra_servicos_servico ON obra_servicos(servico_id);


-- ============================================================================
-- PARTE 6: TABELAS DE VERIFICAÇÕES
-- ============================================================================

-- Verificações (serviço em unidade)
CREATE TABLE verificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contexto
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
  unidade_id UUID NOT NULL REFERENCES unidades(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE RESTRICT,

  -- Status geral
  status status_verificacao DEFAULT 'pendente',

  -- Quem e quando (primeira verificação)
  inspetor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  data_inicio TIMESTAMPTZ,
  data_conclusao TIMESTAMPTZ,

  -- Contadores (denormalizados para performance)
  total_itens INT DEFAULT 0,
  itens_verificados INT DEFAULT 0,
  itens_conformes INT DEFAULT 0,
  itens_nc INT DEFAULT 0,
  itens_excecao INT DEFAULT 0,

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(unidade_id, servico_id)
);

CREATE INDEX idx_verificacoes_obra ON verificacoes(obra_id);
CREATE INDEX idx_verificacoes_unidade ON verificacoes(unidade_id);
CREATE INDEX idx_verificacoes_servico ON verificacoes(servico_id);
CREATE INDEX idx_verificacoes_status ON verificacoes(status);
CREATE INDEX idx_verificacoes_inspetor ON verificacoes(inspetor_id);


-- Itens de Verificação (preenchimento individual)
CREATE TABLE itens_verificacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contexto
  verificacao_id UUID NOT NULL REFERENCES verificacoes(id) ON DELETE CASCADE,
  item_servico_id UUID NOT NULL REFERENCES itens_servico(id) ON DELETE RESTRICT,

  -- Status primeira inspeção
  status status_inspecao DEFAULT 'nao_verificado',

  -- Dados da inspeção
  inspetor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  data_inspecao TIMESTAMPTZ,

  -- Observação (obrigatória se NC)
  observacao TEXT,

  -- GPS da inspeção (opcional)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Reinspeção (se status era NC)
  status_reinspecao status_reinspecao,
  inspetor_reinspecao_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
  data_reinspecao TIMESTAMPTZ,
  observacao_reinspecao TEXT,

  -- Contador de reinspeções (se reprovado múltiplas vezes)
  ciclos_reinspecao INT DEFAULT 0,

  -- Sincronização offline
  sync_id UUID,  -- ID único gerado no device para detectar conflitos
  sync_timestamp TIMESTAMPTZ,  -- Timestamp do device quando foi criado

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(verificacao_id, item_servico_id)
);

CREATE INDEX idx_itens_verificacao_verificacao ON itens_verificacao(verificacao_id);
CREATE INDEX idx_itens_verificacao_status ON itens_verificacao(status);
CREATE INDEX idx_itens_verificacao_nc ON itens_verificacao(status) WHERE status = 'nao_conforme';
CREATE INDEX idx_itens_verificacao_sync ON itens_verificacao(sync_id);


-- ============================================================================
-- PARTE 7: TABELAS DE FOTOS
-- ============================================================================

-- Fotos de NC (1-5 por item)
CREATE TABLE fotos_nc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_verificacao_id UUID NOT NULL REFERENCES itens_verificacao(id) ON DELETE CASCADE,

  -- Caminho no storage
  path TEXT NOT NULL,

  -- Metadados
  ordem INT DEFAULT 0,

  -- GPS (opcional)
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Watermark aplicado
  watermark_texto TEXT,  -- Ex: "Obra X | 10/01/2026 14:30 | João Silva"

  -- Sincronização
  sync_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_fotos_nc_item ON fotos_nc(item_verificacao_id);


-- ============================================================================
-- PARTE 8: TABELAS DE NOTIFICAÇÕES (FEED)
-- ============================================================================

-- Notificações (feed de atividade)
CREATE TABLE notificacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Destinatário
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,

  -- Contexto (opcional, para filtros)
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,

  -- Conteúdo
  tipo tipo_notificacao NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  mensagem TEXT,

  -- Referência (para navegação ao clicar)
  referencia_tipo VARCHAR(50),  -- 'verificacao', 'obra', 'relatorio', etc
  referencia_id UUID,

  -- Status
  lida BOOLEAN DEFAULT false,

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notificacoes_usuario ON notificacoes(usuario_id);
CREATE INDEX idx_notificacoes_cliente ON notificacoes(cliente_id);
CREATE INDEX idx_notificacoes_nao_lidas ON notificacoes(usuario_id, lida) WHERE lida = false;
CREATE INDEX idx_notificacoes_created ON notificacoes(created_at DESC);


-- ============================================================================
-- PARTE 9: TABELAS DE RELATÓRIOS AGENDADOS
-- ============================================================================

-- Configurações de relatórios agendados
CREATE TABLE relatorios_agendados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,

  -- Tipo
  tipo tipo_relatorio NOT NULL,

  -- Agendamento
  ativo BOOLEAN DEFAULT true,
  frequencia frequencia_relatorio NOT NULL,
  dia_semana INT,  -- 0-6 (dom-sab), para frequência semanal
  dia_mes INT,     -- 1-31, para frequência mensal
  horario TIME NOT NULL DEFAULT '08:00',

  -- Destinatários (emails)
  destinatarios TEXT[] NOT NULL DEFAULT '{}',  -- Array de emails

  -- Configurações do relatório
  config JSONB DEFAULT '{}',

  -- Auditoria
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_relatorios_agendados_obra ON relatorios_agendados(obra_id);
CREATE INDEX idx_relatorios_agendados_ativo ON relatorios_agendados(ativo) WHERE ativo = true;


-- Log de envios de relatórios
CREATE TABLE log_relatorios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  relatorio_agendado_id UUID REFERENCES relatorios_agendados(id) ON DELETE SET NULL,
  obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,

  -- Detalhes
  tipo tipo_relatorio NOT NULL,
  destinatarios TEXT[] NOT NULL,

  -- Arquivo gerado
  path TEXT,
  url_temporaria TEXT,
  url_expira_em TIMESTAMPTZ,

  -- Status
  status VARCHAR(20) DEFAULT 'pendente',  -- pendente, enviado, erro
  erro TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_log_relatorios_obra ON log_relatorios(obra_id);
CREATE INDEX idx_log_relatorios_created ON log_relatorios(created_at DESC);


-- ============================================================================
-- PARTE 10: TABELAS DE AUDITORIA (Estrutura para Fase 2)
-- ============================================================================

-- Log de auditoria (estrutura preparada, triggers em Fase 2)
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Quem
  usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,

  -- Contexto
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  obra_id UUID REFERENCES obras(id) ON DELETE SET NULL,

  -- O que
  tabela VARCHAR(100) NOT NULL,
  operacao VARCHAR(10) NOT NULL,  -- INSERT, UPDATE, DELETE
  registro_id UUID NOT NULL,

  -- Valores
  dados_anteriores JSONB,
  dados_novos JSONB,

  -- Metadados
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_log_usuario ON audit_log(usuario_id);
CREATE INDEX idx_audit_log_tabela ON audit_log(tabela);
CREATE INDEX idx_audit_log_registro ON audit_log(registro_id);
CREATE INDEX idx_audit_log_created ON audit_log(created_at DESC);

-- Retenção: 90 dias (implementar via cron job ou Supabase scheduled function)


-- ============================================================================
-- PARTE 11: TABELA DE CONFLITOS DE SYNC (Mobile)
-- ============================================================================

-- Conflitos de sincronização (quando item já foi preenchido por outro)
CREATE TABLE sync_conflitos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Quem teve o conflito
  usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,

  -- Qual item
  item_verificacao_id UUID NOT NULL REFERENCES itens_verificacao(id) ON DELETE CASCADE,

  -- Quem preencheu primeiro
  usuario_vencedor_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,

  -- Dados rejeitados
  dados_rejeitados JSONB NOT NULL,

  -- Status
  visualizado BOOLEAN DEFAULT false,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sync_conflitos_usuario ON sync_conflitos(usuario_id);
CREATE INDEX idx_sync_conflitos_nao_visualizados ON sync_conflitos(usuario_id, visualizado)
  WHERE visualizado = false;


-- ============================================================================
-- PARTE 12: FUNÇÕES AUXILIARES
-- ============================================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger em todas tabelas com updated_at
CREATE TRIGGER tr_clientes_updated_at BEFORE UPDATE ON clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_usuarios_updated_at BEFORE UPDATE ON usuarios
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_usuario_clientes_updated_at BEFORE UPDATE ON usuario_clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_obras_updated_at BEFORE UPDATE ON obras
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_agrupamentos_updated_at BEFORE UPDATE ON agrupamentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_unidades_updated_at BEFORE UPDATE ON unidades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_servicos_updated_at BEFORE UPDATE ON servicos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_itens_servico_updated_at BEFORE UPDATE ON itens_servico
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_verificacoes_updated_at BEFORE UPDATE ON verificacoes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_itens_verificacao_updated_at BEFORE UPDATE ON itens_verificacao
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_empreendimentos_updated_at BEFORE UPDATE ON empreendimentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tr_relatorios_agendados_updated_at BEFORE UPDATE ON relatorios_agendados
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- Função para atualizar contadores da verificação
CREATE OR REPLACE FUNCTION atualizar_contadores_verificacao()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalcula contadores
  UPDATE verificacoes v SET
    total_itens = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id),
    itens_verificados = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status != 'nao_verificado'),
    itens_conformes = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status = 'conforme'),
    itens_nc = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status = 'nao_conforme' AND status_reinspecao IS NULL),
    itens_excecao = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status = 'excecao'),
    -- Atualiza status geral
    status = CASE
      WHEN (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status = 'nao_verificado') =
           (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id) THEN 'pendente'
      WHEN (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status = 'nao_conforme' AND status_reinspecao IS NULL) > 0 THEN 'com_nc'
      WHEN (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status = 'nao_verificado') > 0 THEN 'em_andamento'
      ELSE 'concluida'
    END
  WHERE v.id = COALESCE(NEW.verificacao_id, OLD.verificacao_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_itens_verificacao_contadores
  AFTER INSERT OR UPDATE OR DELETE ON itens_verificacao
  FOR EACH ROW EXECUTE FUNCTION atualizar_contadores_verificacao();


-- ============================================================================
-- PARTE 13: RLS POLICIES (Básicas - Detalhamento na Seção 11)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE empreendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_empreendimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrupamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE agrupamento_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuario_obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_servico ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_referencia ENABLE ROW LEVEL SECURITY;
ALTER TABLE condicoes_inicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE sugestoes_observacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE obra_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE verificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE itens_verificacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE fotos_nc ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios_agendados ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_relatorios ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_conflitos ENABLE ROW LEVEL SECURITY;

-- Políticas serão detalhadas na Seção 11 do PRD
-- Por enquanto, políticas básicas de exemplo:

-- Exemplo: Usuário vê apenas seus clientes
CREATE POLICY "usuarios_veem_seus_clientes" ON clientes
  FOR SELECT
  USING (
    id IN (
      SELECT cliente_id FROM usuario_clientes
      WHERE usuario_id = auth.uid() AND ativo = true
    )
  );

-- Exemplo: Usuário vê apenas obras dos seus clientes com permissão
CREATE POLICY "usuarios_veem_suas_obras" ON obras
  FOR SELECT
  USING (
    id IN (
      SELECT uo.obra_id FROM usuario_obras uo
      JOIN obras o ON o.id = uo.obra_id
      JOIN usuario_clientes uc ON uc.cliente_id = o.cliente_id
      WHERE uo.usuario_id = auth.uid()
        AND uc.usuario_id = auth.uid()
        AND uc.ativo = true
    )
  );


-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================
