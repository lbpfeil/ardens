-- ============================================================================
-- Migration: refactor_status_model_v12
-- Phase: 12-01 Modelo de Status
-- Description: Renomeia ENUM status_verificacao para modelo de 4 estados,
--              refatora trigger de cálculo automático com prioridade NC,
--              atualiza bulk_verificar, e recalcula dados existentes.
-- ============================================================================

-- ============================================================================
-- Passo 1: Renomear valores do ENUM
-- ============================================================================
ALTER TYPE status_verificacao RENAME VALUE 'com_nc' TO 'verificado_com_pendencias';
ALTER TYPE status_verificacao RENAME VALUE 'concluida' TO 'verificacao_finalizada';
-- 'pendente' e 'em_andamento' permanecem inalterados


-- ============================================================================
-- Passo 2: Refatorar trigger function (nova lógica de 4 estados)
-- ============================================================================
CREATE OR REPLACE FUNCTION atualizar_contadores_verificacao()
RETURNS TRIGGER AS $$
DECLARE
  v_verificacao_id UUID;
  v_total INT;
  v_nc_abertas INT;
  v_finalizados INT;
  v_conformes INT;
  v_verificados INT;
  v_excecao INT;
  v_tem_reinspecao BOOLEAN;
  v_new_status status_verificacao;
BEGIN
  -- Obter verificacao_id de NEW ou OLD (funciona para INSERT, UPDATE, DELETE)
  v_verificacao_id := COALESCE(NEW.verificacao_id, OLD.verificacao_id);

  -- Calcular todos os contadores em uma única query (performance otimizada)
  SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (
      WHERE (status = 'nao_conforme' AND status_reinspecao IS NULL)
         OR status_reinspecao = 'reprovado_apos_retrabalho'
    ) AS nc_abertas,
    COUNT(*) FILTER (
      WHERE status IN ('conforme', 'excecao')
         OR status_reinspecao IN ('conforme_apos_reinspecao', 'retrabalho', 'aprovado_com_concessao')
    ) AS finalizados,
    COUNT(*) FILTER (WHERE status = 'conforme') AS conformes,
    COUNT(*) FILTER (WHERE status != 'nao_verificado') AS verificados,
    COUNT(*) FILTER (WHERE status = 'excecao') AS excecao,
    bool_or(status_reinspecao IS NOT NULL) AS tem_reinspecao
  INTO v_total, v_nc_abertas, v_finalizados, v_conformes, v_verificados, v_excecao, v_tem_reinspecao
  FROM itens_verificacao
  WHERE verificacao_id = v_verificacao_id;

  -- Calcular status com prioridade estrita: NC > Finalizado > Progresso > Pendente
  IF v_nc_abertas > 0 THEN
    -- Prioridade 1: NC aberta domina tudo
    v_new_status := 'verificado_com_pendencias';
  ELSIF v_finalizados = v_total THEN
    -- Prioridade 2: Todos os itens finalizados
    v_new_status := 'verificacao_finalizada';
  ELSIF v_conformes > 0 THEN
    -- Prioridade 3: Tem progresso (Exceção NÃO conta como progresso)
    v_new_status := 'em_andamento';
  ELSE
    -- Prioridade 4: Nenhum progresso (todos Não Verificado ou apenas Exceção)
    v_new_status := 'pendente';
  END IF;

  -- Atualizar verificação com todos os contadores + status
  UPDATE verificacoes SET
    total_itens = v_total,
    itens_verificados = v_verificados,
    itens_conformes = v_conformes,
    itens_nc = v_nc_abertas,
    itens_excecao = v_excecao,
    tem_reinspecao = v_tem_reinspecao,
    status = v_new_status,
    updated_at = NOW()
  WHERE id = v_verificacao_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger já existe, não precisa recriar


-- ============================================================================
-- Passo 3: Atualizar bulk_verificar RPC (substituir nomes antigos de ENUM)
-- ============================================================================
CREATE OR REPLACE FUNCTION bulk_verificar(
  p_obra_id UUID,
  p_resultado TEXT,
  p_pares JSONB,
  p_descricao TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_par JSONB;
  v_servico_id UUID;
  v_unidade_id UUID;
  v_verificacao_id UUID;
  v_existing_status status_verificacao;
  v_item_status status_inspecao;
  v_count_created INT := 0;
  v_count_skipped INT := 0;
  v_count_reinspected INT := 0;
BEGIN
  -- 1. Autorização
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não autenticado';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM usuario_obras
    WHERE usuario_id = v_user_id AND obra_id = p_obra_id
  ) THEN
    RAISE EXCEPTION 'Usuário não tem acesso a esta obra';
  END IF;

  -- 2. Validação
  IF p_resultado NOT IN ('conforme', 'nao_conforme', 'excecao') THEN
    RAISE EXCEPTION 'Resultado inválido: %. Valores aceitos: conforme, nao_conforme, excecao', p_resultado;
  END IF;

  IF jsonb_array_length(p_pares) > 500 THEN
    RAISE EXCEPTION 'Limite de 500 pares por operação';
  END IF;

  -- 3. Mapear resultado para status de item
  v_item_status := p_resultado::status_inspecao;

  -- 4. Loop pelos pares
  FOR v_par IN SELECT * FROM jsonb_array_elements(p_pares)
  LOOP
    v_servico_id := (v_par->>'servico_id')::UUID;
    v_unidade_id := (v_par->>'unidade_id')::UUID;

    -- Buscar verificação existente
    SELECT id, status INTO v_verificacao_id, v_existing_status
    FROM verificacoes
    WHERE unidade_id = v_unidade_id AND servico_id = v_servico_id;

    IF v_verificacao_id IS NOT NULL THEN
      -- Verificação existe
      IF v_existing_status = 'verificacao_finalizada' THEN
        -- Verificação finalizada: skip (não permite alteração)
        v_count_skipped := v_count_skipped + 1;
        CONTINUE;

      ELSIF v_existing_status = 'verificado_com_pendencias' THEN
        -- Verificação com pendências: permitir reinspeção
        IF p_resultado = 'conforme' THEN
          UPDATE itens_verificacao
          SET status_reinspecao = 'conforme_apos_reinspecao',
              data_reinspecao = NOW(),
              inspetor_reinspecao_id = v_user_id,
              ciclos_reinspecao = ciclos_reinspecao + 1,
              updated_at = NOW()
          WHERE verificacao_id = v_verificacao_id
            AND status = 'nao_conforme'
            AND status_reinspecao IS NULL;
        ELSE
          UPDATE itens_verificacao
          SET status_reinspecao = 'reprovado_apos_retrabalho',
              data_reinspecao = NOW(),
              inspetor_reinspecao_id = v_user_id,
              ciclos_reinspecao = ciclos_reinspecao + 1,
              updated_at = NOW()
          WHERE verificacao_id = v_verificacao_id
            AND status = 'nao_conforme'
            AND status_reinspecao IS NULL;
        END IF;
        v_count_reinspected := v_count_reinspected + 1;

      ELSE
        -- pendente ou em_andamento: atualizar todos os itens existentes
        UPDATE itens_verificacao
        SET status = v_item_status,
            data_inspecao = NOW(),
            inspetor_id = v_user_id,
            updated_at = NOW()
        WHERE verificacao_id = v_verificacao_id;
        v_count_created := v_count_created + 1;
      END IF;

    ELSE
      -- Verificação nova
      INSERT INTO verificacoes (obra_id, unidade_id, servico_id, inspetor_id, data_inicio)
      VALUES (p_obra_id, v_unidade_id, v_servico_id, v_user_id, NOW())
      RETURNING id INTO v_verificacao_id;

      -- Inserir itens a partir do template
      INSERT INTO itens_verificacao (verificacao_id, item_servico_id, status, inspetor_id, data_inspecao)
      SELECT v_verificacao_id, is2.id, v_item_status, v_user_id, NOW()
      FROM itens_servico is2
      WHERE is2.servico_id = v_servico_id
      ORDER BY is2.ordem;

      v_count_created := v_count_created + 1;
    END IF;
  END LOOP;

  -- 5. Retorno
  RETURN jsonb_build_object(
    'created', v_count_created,
    'skipped', v_count_skipped,
    'reinspected', v_count_reinspected
  );
END;
$$;


-- ============================================================================
-- Passo 4: Recalcular dados existentes (força trigger a recalcular)
-- ============================================================================
UPDATE verificacoes SET updated_at = updated_at WHERE TRUE;


-- ============================================================================
-- Passo 5: Atualizar RLS policy (verificacoes_update)
-- ============================================================================
-- Remover policy antiga
DROP POLICY IF EXISTS verificacoes_update ON verificacoes;

-- Recriar com novo nome de ENUM
CREATE POLICY verificacoes_update ON verificacoes FOR UPDATE TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuario_obras uo
    WHERE uo.usuario_id = (SELECT auth.uid()) AND uo.obra_id = verificacoes.obra_id
  )
  AND (
    (obra_id IN (SELECT initPlan.obra_id FROM get_user_obras() AS initPlan))
    OR (inspetor_id = (SELECT auth.uid()) AND status != 'verificacao_finalizada')
  )
);


-- ============================================================================
-- Verificação: Consultas de auditoria
-- ============================================================================

-- Exibir distribuição de status após migração
SELECT 'Status distribution:' AS check_name;
SELECT status, COUNT(*) AS count
FROM verificacoes
GROUP BY status
ORDER BY status;

-- Verificar consistência: NC abertas devem resultar em verificado_com_pendencias
SELECT 'NC consistency check:' AS check_name;
SELECT COUNT(*) AS inconsistencies
FROM verificacoes v
WHERE v.status = 'verificado_com_pendencias'
  AND NOT EXISTS (
    SELECT 1 FROM itens_verificacao iv
    WHERE iv.verificacao_id = v.id
      AND ((iv.status = 'nao_conforme' AND iv.status_reinspecao IS NULL)
           OR iv.status_reinspecao = 'reprovado_apos_retrabalho')
  );
-- ESPERADO: 0 inconsistências

COMMIT;
