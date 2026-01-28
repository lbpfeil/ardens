-- ============================================================================
-- ARDEN FVS - RLS Policies (Row Level Security)
-- ============================================================================
-- Versão: 1.0
-- Data: Janeiro 2026
-- Complementa: database/schema.sql
-- ============================================================================

-- ============================================================================
-- FUNÇÕES AUXILIARES
-- ============================================================================

-- Retorna o cliente_id atual do usuário autenticado
-- (considera que usuário pode ter múltiplos clientes, usa o "ativo" no momento)
CREATE OR REPLACE FUNCTION get_user_cliente_id()
RETURNS UUID AS $$
  SELECT cliente_id
  FROM usuario_clientes
  WHERE usuario_id = auth.uid()
    AND ativo = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- Retorna o perfil do usuário no cliente atual
CREATE OR REPLACE FUNCTION get_user_perfil()
RETURNS perfil_usuario AS $$
  SELECT perfil
  FROM usuario_clientes
  WHERE usuario_id = auth.uid()
    AND cliente_id = get_user_cliente_id()
    AND ativo = true
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- Verifica se usuário tem acesso a uma obra específica
CREATE OR REPLACE FUNCTION user_has_obra_access(p_obra_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM usuario_obras
    WHERE usuario_id = auth.uid()
      AND obra_id = p_obra_id
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- Verifica se usuário é admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT get_user_perfil() = 'admin';
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- Verifica se usuário é admin ou engenheiro
CREATE OR REPLACE FUNCTION is_admin_or_engenheiro()
RETURNS BOOLEAN AS $$
  SELECT get_user_perfil() IN ('admin', 'engenheiro');
$$ LANGUAGE sql SECURITY DEFINER STABLE;


-- ============================================================================
-- POLÍTICAS: CLIENTES
-- ============================================================================

-- SELECT: Usuário vê apenas clientes aos quais pertence
DROP POLICY IF EXISTS "clientes_select" ON clientes;
CREATE POLICY "clientes_select" ON clientes
  FOR SELECT USING (
    id IN (
      SELECT cliente_id FROM usuario_clientes
      WHERE usuario_id = auth.uid() AND ativo = true
    )
  );

-- INSERT: Apenas via signup (handled by edge function)
-- UPDATE: Apenas admin do cliente
DROP POLICY IF EXISTS "clientes_update" ON clientes;
CREATE POLICY "clientes_update" ON clientes
  FOR UPDATE USING (
    id = get_user_cliente_id() AND is_admin()
  );

-- DELETE: Nunca via app (apenas Super Admin via dashboard)


-- ============================================================================
-- POLÍTICAS: USUARIOS
-- ============================================================================

-- SELECT: Usuário vê a si mesmo + usuários do mesmo cliente
DROP POLICY IF EXISTS "usuarios_select" ON usuarios;
CREATE POLICY "usuarios_select" ON usuarios
  FOR SELECT USING (
    id = auth.uid()
    OR
    id IN (
      SELECT uc.usuario_id FROM usuario_clientes uc
      WHERE uc.cliente_id = get_user_cliente_id() AND uc.ativo = true
    )
  );

-- UPDATE: Usuário edita apenas a si mesmo
DROP POLICY IF EXISTS "usuarios_update" ON usuarios;
CREATE POLICY "usuarios_update" ON usuarios
  FOR UPDATE USING (id = auth.uid());


-- ============================================================================
-- POLÍTICAS: USUARIO_CLIENTES
-- ============================================================================

-- SELECT: Vê relações do seu cliente
DROP POLICY IF EXISTS "usuario_clientes_select" ON usuario_clientes;
CREATE POLICY "usuario_clientes_select" ON usuario_clientes
  FOR SELECT USING (cliente_id = get_user_cliente_id());

-- INSERT: Apenas admin pode adicionar usuários ao cliente
DROP POLICY IF EXISTS "usuario_clientes_insert" ON usuario_clientes;
CREATE POLICY "usuario_clientes_insert" ON usuario_clientes
  FOR INSERT WITH CHECK (
    cliente_id = get_user_cliente_id() AND is_admin()
  );

-- UPDATE: Apenas admin pode alterar perfis
DROP POLICY IF EXISTS "usuario_clientes_update" ON usuario_clientes;
CREATE POLICY "usuario_clientes_update" ON usuario_clientes
  FOR UPDATE USING (
    cliente_id = get_user_cliente_id() AND is_admin()
  );

-- DELETE: Apenas admin pode remover usuários
DROP POLICY IF EXISTS "usuario_clientes_delete" ON usuario_clientes;
CREATE POLICY "usuario_clientes_delete" ON usuario_clientes
  FOR DELETE USING (
    cliente_id = get_user_cliente_id() AND is_admin()
  );


-- ============================================================================
-- POLÍTICAS: OBRAS
-- ============================================================================

-- SELECT: Usuário vê obras às quais tem acesso
-- Admin vê todas do cliente, outros só as atribuídas
DROP POLICY IF EXISTS "obras_select" ON obras;
CREATE POLICY "obras_select" ON obras
  FOR SELECT USING (
    cliente_id = get_user_cliente_id()
    AND (
      is_admin()
      OR user_has_obra_access(id)
    )
  );

-- INSERT: Apenas admin
DROP POLICY IF EXISTS "obras_insert" ON obras;
CREATE POLICY "obras_insert" ON obras
  FOR INSERT WITH CHECK (
    cliente_id = get_user_cliente_id() AND is_admin()
  );

-- UPDATE: Apenas admin
DROP POLICY IF EXISTS "obras_update" ON obras;
CREATE POLICY "obras_update" ON obras
  FOR UPDATE USING (
    cliente_id = get_user_cliente_id() AND is_admin()
  );

-- DELETE: Apenas admin
DROP POLICY IF EXISTS "obras_delete" ON obras;
CREATE POLICY "obras_delete" ON obras
  FOR DELETE USING (
    cliente_id = get_user_cliente_id() AND is_admin()
  );


-- ============================================================================
-- POLÍTICAS: USUARIO_OBRAS (permissões por obra)
-- ============================================================================

-- SELECT: Admin vê todas, outros veem apenas as próprias
DROP POLICY IF EXISTS "usuario_obras_select" ON usuario_obras;
CREATE POLICY "usuario_obras_select" ON usuario_obras
  FOR SELECT USING (
    usuario_id = auth.uid()
    OR (
      obra_id IN (SELECT id FROM obras WHERE cliente_id = get_user_cliente_id())
      AND is_admin()
    )
  );

-- INSERT: Apenas admin
DROP POLICY IF EXISTS "usuario_obras_insert" ON usuario_obras;
CREATE POLICY "usuario_obras_insert" ON usuario_obras
  FOR INSERT WITH CHECK (
    obra_id IN (SELECT id FROM obras WHERE cliente_id = get_user_cliente_id())
    AND is_admin()
  );

-- DELETE: Apenas admin
DROP POLICY IF EXISTS "usuario_obras_delete" ON usuario_obras;
CREATE POLICY "usuario_obras_delete" ON usuario_obras
  FOR DELETE USING (
    obra_id IN (SELECT id FROM obras WHERE cliente_id = get_user_cliente_id())
    AND is_admin()
  );


-- ============================================================================
-- POLÍTICAS: AGRUPAMENTOS
-- ============================================================================

-- SELECT: Segue permissão da obra
DROP POLICY IF EXISTS "agrupamentos_select" ON agrupamentos;
CREATE POLICY "agrupamentos_select" ON agrupamentos
  FOR SELECT USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = get_user_cliente_id()
      AND (is_admin() OR user_has_obra_access(id))
    )
  );

-- INSERT/UPDATE/DELETE: Admin ou Engenheiro (engenheiro configura estrutura da obra)
DROP POLICY IF EXISTS "agrupamentos_insert" ON agrupamentos;
CREATE POLICY "agrupamentos_insert" ON agrupamentos
  FOR INSERT WITH CHECK (
    obra_id IN (SELECT id FROM obras WHERE cliente_id = get_user_cliente_id())
    AND is_admin_or_engenheiro()
  );

DROP POLICY IF EXISTS "agrupamentos_update" ON agrupamentos;
CREATE POLICY "agrupamentos_update" ON agrupamentos
  FOR UPDATE USING (
    obra_id IN (SELECT id FROM obras WHERE cliente_id = get_user_cliente_id())
    AND is_admin_or_engenheiro()
  );

DROP POLICY IF EXISTS "agrupamentos_delete" ON agrupamentos;
CREATE POLICY "agrupamentos_delete" ON agrupamentos
  FOR DELETE USING (
    obra_id IN (SELECT id FROM obras WHERE cliente_id = get_user_cliente_id())
    AND is_admin_or_engenheiro()
  );


-- ============================================================================
-- POLÍTICAS: UNIDADES
-- ============================================================================

-- SELECT: Segue permissão da obra (via agrupamento)
DROP POLICY IF EXISTS "unidades_select" ON unidades;
CREATE POLICY "unidades_select" ON unidades
  FOR SELECT USING (
    agrupamento_id IN (
      SELECT a.id FROM agrupamentos a
      JOIN obras o ON o.id = a.obra_id
      WHERE o.cliente_id = get_user_cliente_id()
      AND (is_admin() OR user_has_obra_access(o.id))
    )
  );

-- INSERT/UPDATE/DELETE: Admin ou engenheiro (engenheiro configura estrutura da obra)
DROP POLICY IF EXISTS "unidades_insert" ON unidades;
CREATE POLICY "unidades_insert" ON unidades
  FOR INSERT WITH CHECK (
    agrupamento_id IN (
      SELECT a.id FROM agrupamentos a
      JOIN obras o ON o.id = a.obra_id
      WHERE o.cliente_id = get_user_cliente_id() AND is_admin_or_engenheiro()
    )
  );

DROP POLICY IF EXISTS "unidades_update" ON unidades;
CREATE POLICY "unidades_update" ON unidades
  FOR UPDATE USING (
    agrupamento_id IN (
      SELECT a.id FROM agrupamentos a
      JOIN obras o ON o.id = a.obra_id
      WHERE o.cliente_id = get_user_cliente_id() AND is_admin_or_engenheiro()
    )
  );

DROP POLICY IF EXISTS "unidades_delete" ON unidades;
CREATE POLICY "unidades_delete" ON unidades
  FOR DELETE USING (
    agrupamento_id IN (
      SELECT a.id FROM agrupamentos a
      JOIN obras o ON o.id = a.obra_id
      WHERE o.cliente_id = get_user_cliente_id() AND is_admin_or_engenheiro()
    )
  );


-- ============================================================================
-- POLÍTICAS: SERVICOS (Biblioteca FVS)
-- ============================================================================

-- SELECT: Todos do cliente veem a biblioteca
DROP POLICY IF EXISTS "servicos_select" ON servicos;
CREATE POLICY "servicos_select" ON servicos
  FOR SELECT USING (cliente_id = get_user_cliente_id());

-- INSERT/UPDATE/DELETE: Apenas admin (engenheiro não edita biblioteca)
DROP POLICY IF EXISTS "servicos_insert" ON servicos;
CREATE POLICY "servicos_insert" ON servicos
  FOR INSERT WITH CHECK (
    cliente_id = get_user_cliente_id() AND is_admin()
  );

DROP POLICY IF EXISTS "servicos_update" ON servicos;
CREATE POLICY "servicos_update" ON servicos
  FOR UPDATE USING (
    cliente_id = get_user_cliente_id() AND is_admin()
  );

DROP POLICY IF EXISTS "servicos_delete" ON servicos;
CREATE POLICY "servicos_delete" ON servicos
  FOR DELETE USING (
    cliente_id = get_user_cliente_id() AND is_admin()
  );


-- ============================================================================
-- POLÍTICAS: ITENS_SERVICO
-- ============================================================================

-- SELECT: Segue serviço
DROP POLICY IF EXISTS "itens_servico_select" ON itens_servico;
CREATE POLICY "itens_servico_select" ON itens_servico
  FOR SELECT USING (
    servico_id IN (SELECT id FROM servicos WHERE cliente_id = get_user_cliente_id())
  );

-- INSERT/UPDATE/DELETE: Apenas admin
DROP POLICY IF EXISTS "itens_servico_insert" ON itens_servico;
CREATE POLICY "itens_servico_insert" ON itens_servico
  FOR INSERT WITH CHECK (
    servico_id IN (SELECT id FROM servicos WHERE cliente_id = get_user_cliente_id())
    AND is_admin()
  );

DROP POLICY IF EXISTS "itens_servico_update" ON itens_servico;
CREATE POLICY "itens_servico_update" ON itens_servico
  FOR UPDATE USING (
    servico_id IN (SELECT id FROM servicos WHERE cliente_id = get_user_cliente_id())
    AND is_admin()
  );

DROP POLICY IF EXISTS "itens_servico_delete" ON itens_servico;
CREATE POLICY "itens_servico_delete" ON itens_servico
  FOR DELETE USING (
    servico_id IN (SELECT id FROM servicos WHERE cliente_id = get_user_cliente_id())
    AND is_admin()
  );


-- ============================================================================
-- POLÍTICAS: OBRA_SERVICOS (serviços ativos por obra)
-- ============================================================================

-- SELECT: Quem tem acesso à obra
DROP POLICY IF EXISTS "obra_servicos_select" ON obra_servicos;
CREATE POLICY "obra_servicos_select" ON obra_servicos
  FOR SELECT USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = get_user_cliente_id()
      AND (is_admin() OR user_has_obra_access(id))
    )
  );

-- INSERT/DELETE: Admin ou Engenheiro (engenheiro pode adicionar serviços à obra)
DROP POLICY IF EXISTS "obra_servicos_insert" ON obra_servicos;
CREATE POLICY "obra_servicos_insert" ON obra_servicos
  FOR INSERT WITH CHECK (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = get_user_cliente_id()
      AND (is_admin() OR (is_admin_or_engenheiro() AND user_has_obra_access(id)))
    )
  );

DROP POLICY IF EXISTS "obra_servicos_delete" ON obra_servicos;
CREATE POLICY "obra_servicos_delete" ON obra_servicos
  FOR DELETE USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = get_user_cliente_id()
      AND (is_admin() OR (is_admin_or_engenheiro() AND user_has_obra_access(id)))
    )
  );


-- ============================================================================
-- POLÍTICAS: VERIFICACOES
-- ============================================================================
-- OTIMIZAÇÃO: Padrão initPlan - wrapping de funções em (SELECT fn())
-- O PostgreSQL cacheia o resultado de (SELECT fn()) per-statement em vez de
-- reavaliar per-row, resultando em melhoria de 10-100x em operações bulk.
-- user_has_obra_access(obra_id) substituído por subselect direto para evitar
-- reavaliar a função para cada linha (depende do valor da coluna obra_id).

-- SELECT:
-- - Admin/Engenheiro: todas da obra
-- - Inspetor: apenas as que ele fez
DROP POLICY IF EXISTS "verificacoes_select" ON verificacoes;
CREATE POLICY "verificacoes_select" ON verificacoes
  FOR SELECT USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
    )
    AND (
      (SELECT is_admin_or_engenheiro())
      OR inspetor_id = (SELECT auth.uid())
    )
    AND obra_id IN (
      SELECT obra_id FROM usuario_obras WHERE usuario_id = (SELECT auth.uid())
    )
  );

-- INSERT: Quem tem acesso à obra (admin, engenheiro, inspetor)
DROP POLICY IF EXISTS "verificacoes_insert" ON verificacoes;
CREATE POLICY "verificacoes_insert" ON verificacoes
  FOR INSERT WITH CHECK (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
    )
    AND obra_id IN (
      SELECT obra_id FROM usuario_obras WHERE usuario_id = (SELECT auth.uid())
    )
  );

-- UPDATE: Admin pode editar tudo, outros só as próprias não concluídas
DROP POLICY IF EXISTS "verificacoes_update" ON verificacoes;
CREATE POLICY "verificacoes_update" ON verificacoes
  FOR UPDATE USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
    )
    AND obra_id IN (
      SELECT obra_id FROM usuario_obras WHERE usuario_id = (SELECT auth.uid())
    )
    AND (
      (SELECT is_admin())
      OR (inspetor_id = (SELECT auth.uid()) AND status != 'verificacao_finalizada')
    )
  );

-- DELETE: Apenas admin
DROP POLICY IF EXISTS "verificacoes_delete" ON verificacoes;
CREATE POLICY "verificacoes_delete" ON verificacoes
  FOR DELETE USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
    )
    AND (SELECT is_admin())
  );


-- ============================================================================
-- POLÍTICAS: ITENS_VERIFICACAO
-- ============================================================================
-- OTIMIZAÇÃO: Mesmo padrão initPlan aplicado. JOIN com verificacoes mantido
-- mas funções auxiliares wrappadas em (SELECT fn()) para caching per-statement.

-- SELECT: Segue verificação
DROP POLICY IF EXISTS "itens_verificacao_select" ON itens_verificacao;
CREATE POLICY "itens_verificacao_select" ON itens_verificacao
  FOR SELECT USING (
    verificacao_id IN (
      SELECT v.id FROM verificacoes v
      WHERE v.obra_id IN (
        SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
      )
      AND (
        (SELECT is_admin_or_engenheiro())
        OR v.inspetor_id = (SELECT auth.uid())
      )
      AND v.obra_id IN (
        SELECT obra_id FROM usuario_obras WHERE usuario_id = (SELECT auth.uid())
      )
    )
  );

-- INSERT: Quem pode editar a verificação
DROP POLICY IF EXISTS "itens_verificacao_insert" ON itens_verificacao;
CREATE POLICY "itens_verificacao_insert" ON itens_verificacao
  FOR INSERT WITH CHECK (
    verificacao_id IN (
      SELECT v.id FROM verificacoes v
      WHERE v.obra_id IN (
        SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
      )
      AND v.obra_id IN (
        SELECT obra_id FROM usuario_obras WHERE usuario_id = (SELECT auth.uid())
      )
    )
  );

-- UPDATE: Admin edita tudo, inspetor só os próprios
DROP POLICY IF EXISTS "itens_verificacao_update" ON itens_verificacao;
CREATE POLICY "itens_verificacao_update" ON itens_verificacao
  FOR UPDATE USING (
    verificacao_id IN (
      SELECT v.id FROM verificacoes v
      WHERE v.obra_id IN (
        SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
      )
      AND v.obra_id IN (
        SELECT obra_id FROM usuario_obras WHERE usuario_id = (SELECT auth.uid())
      )
      AND (
        (SELECT is_admin())
        OR v.inspetor_id = (SELECT auth.uid())
      )
    )
  );

-- DELETE: Apenas admin (via cascade da verificação)
DROP POLICY IF EXISTS "itens_verificacao_delete" ON itens_verificacao;
CREATE POLICY "itens_verificacao_delete" ON itens_verificacao
  FOR DELETE USING (
    verificacao_id IN (
      SELECT v.id FROM verificacoes v
      WHERE v.obra_id IN (
        SELECT id FROM obras WHERE cliente_id = (SELECT get_user_cliente_id())
      )
      AND (SELECT is_admin())
    )
  );


-- ============================================================================
-- POLÍTICAS: FOTOS_NC
-- ============================================================================

-- SELECT: Segue item de verificação
DROP POLICY IF EXISTS "fotos_nc_select" ON fotos_nc;
CREATE POLICY "fotos_nc_select" ON fotos_nc
  FOR SELECT USING (
    item_verificacao_id IN (
      SELECT iv.id FROM itens_verificacao iv
      JOIN verificacoes v ON v.id = iv.verificacao_id
      JOIN obras o ON o.id = v.obra_id
      WHERE o.cliente_id = get_user_cliente_id()
      AND user_has_obra_access(v.obra_id)
      AND (is_admin_or_engenheiro() OR v.inspetor_id = auth.uid())
    )
  );

-- INSERT: Quem pode editar o item
DROP POLICY IF EXISTS "fotos_nc_insert" ON fotos_nc;
CREATE POLICY "fotos_nc_insert" ON fotos_nc
  FOR INSERT WITH CHECK (
    item_verificacao_id IN (
      SELECT iv.id FROM itens_verificacao iv
      JOIN verificacoes v ON v.id = iv.verificacao_id
      JOIN obras o ON o.id = v.obra_id
      WHERE o.cliente_id = get_user_cliente_id()
      AND user_has_obra_access(v.obra_id)
    )
  );

-- DELETE: Apenas admin
DROP POLICY IF EXISTS "fotos_nc_delete" ON fotos_nc;
CREATE POLICY "fotos_nc_delete" ON fotos_nc
  FOR DELETE USING (
    item_verificacao_id IN (
      SELECT iv.id FROM itens_verificacao iv
      JOIN verificacoes v ON v.id = iv.verificacao_id
      JOIN obras o ON o.id = v.obra_id
      WHERE o.cliente_id = get_user_cliente_id()
      AND is_admin()
    )
  );


-- ============================================================================
-- POLÍTICAS: NOTIFICACOES
-- ============================================================================

-- SELECT: Usuário vê apenas suas notificações
DROP POLICY IF EXISTS "notificacoes_select" ON notificacoes;
CREATE POLICY "notificacoes_select" ON notificacoes
  FOR SELECT USING (usuario_id = auth.uid());

-- UPDATE: Usuário pode marcar como lida
DROP POLICY IF EXISTS "notificacoes_update" ON notificacoes;
CREATE POLICY "notificacoes_update" ON notificacoes
  FOR UPDATE USING (usuario_id = auth.uid());

-- INSERT: Sistema (via edge function com service_role)
-- DELETE: Sistema (limpeza automática)


-- ============================================================================
-- POLÍTICAS: RELATORIOS_AGENDADOS
-- ============================================================================

-- SELECT: Admin vê todos, engenheiro vê das obras dele
DROP POLICY IF EXISTS "relatorios_agendados_select" ON relatorios_agendados;
CREATE POLICY "relatorios_agendados_select" ON relatorios_agendados
  FOR SELECT USING (
    obra_id IN (
      SELECT id FROM obras WHERE cliente_id = get_user_cliente_id()
      AND (is_admin() OR user_has_obra_access(id))
    )
  );

-- INSERT/UPDATE/DELETE: Apenas admin
DROP POLICY IF EXISTS "relatorios_agendados_insert" ON relatorios_agendados;
CREATE POLICY "relatorios_agendados_insert" ON relatorios_agendados
  FOR INSERT WITH CHECK (
    obra_id IN (SELECT id FROM obras WHERE cliente_id = get_user_cliente_id())
    AND is_admin()
  );

DROP POLICY IF EXISTS "relatorios_agendados_update" ON relatorios_agendados;
CREATE POLICY "relatorios_agendados_update" ON relatorios_agendados
  FOR UPDATE USING (
    obra_id IN (SELECT id FROM obras WHERE cliente_id = get_user_cliente_id())
    AND is_admin()
  );

DROP POLICY IF EXISTS "relatorios_agendados_delete" ON relatorios_agendados;
CREATE POLICY "relatorios_agendados_delete" ON relatorios_agendados
  FOR DELETE USING (
    obra_id IN (SELECT id FROM obras WHERE cliente_id = get_user_cliente_id())
    AND is_admin()
  );


-- ============================================================================
-- POLÍTICAS: AUDIT_LOG
-- ============================================================================

-- SELECT: Apenas admin do cliente
DROP POLICY IF EXISTS "audit_log_select" ON audit_log;
CREATE POLICY "audit_log_select" ON audit_log
  FOR SELECT USING (
    cliente_id = get_user_cliente_id() AND is_admin()
  );

-- INSERT: Sistema apenas (via trigger ou edge function)
-- UPDATE/DELETE: Nunca (imutável)


-- ============================================================================
-- POLÍTICAS: SYNC_CONFLITOS
-- ============================================================================

-- SELECT: Usuário vê apenas seus conflitos
DROP POLICY IF EXISTS "sync_conflitos_select" ON sync_conflitos;
CREATE POLICY "sync_conflitos_select" ON sync_conflitos
  FOR SELECT USING (usuario_id = auth.uid());

-- UPDATE: Usuário pode marcar como visualizado
DROP POLICY IF EXISTS "sync_conflitos_update" ON sync_conflitos;
CREATE POLICY "sync_conflitos_update" ON sync_conflitos
  FOR UPDATE USING (usuario_id = auth.uid());


-- ============================================================================
-- POLÍTICAS: TAGS
-- ============================================================================

-- SELECT: Todos do cliente veem as tags (para seletor em itens)
DROP POLICY IF EXISTS "tags_select" ON tags;
CREATE POLICY "tags_select" ON tags
  FOR SELECT USING (cliente_id = get_user_cliente_id());

-- INSERT: Admin e engenheiro podem criar tags
DROP POLICY IF EXISTS "tags_insert" ON tags;
CREATE POLICY "tags_insert" ON tags
  FOR INSERT WITH CHECK (
    cliente_id = get_user_cliente_id() AND is_admin_or_engenheiro()
  );

-- UPDATE: Admin e engenheiro podem editar tags
DROP POLICY IF EXISTS "tags_update" ON tags;
CREATE POLICY "tags_update" ON tags
  FOR UPDATE USING (
    cliente_id = get_user_cliente_id() AND is_admin_or_engenheiro()
  );

-- DELETE: Apenas admin pode excluir tags
DROP POLICY IF EXISTS "tags_delete" ON tags;
CREATE POLICY "tags_delete" ON tags
  FOR DELETE USING (
    cliente_id = get_user_cliente_id() AND is_admin()
  );


-- ============================================================================
-- FIM DAS POLÍTICAS RLS
-- ============================================================================
