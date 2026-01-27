-- Migration: Add tem_reinspecao boolean to verificacoes
-- Created: 2026-01-27
-- Apply via: mcp__supabase__apply_migration (name: "add_tem_reinspecao_to_verificacoes")

-- 1. Add column tem_reinspecao to verificacoes
ALTER TABLE verificacoes ADD COLUMN IF NOT EXISTS tem_reinspecao BOOLEAN DEFAULT FALSE;

-- 2. Update trigger function to recalculate tem_reinspecao
CREATE OR REPLACE FUNCTION atualizar_contadores_verificacao()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE verificacoes v SET
    total_itens = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id),
    itens_verificados = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status != 'nao_verificado'),
    itens_conformes = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status = 'conforme'),
    itens_nc = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status = 'nao_conforme' AND status_reinspecao IS NULL),
    itens_excecao = (SELECT COUNT(*) FROM itens_verificacao WHERE verificacao_id = v.id AND status = 'excecao'),
    tem_reinspecao = EXISTS(SELECT 1 FROM itens_verificacao WHERE verificacao_id = v.id AND status_reinspecao IS NOT NULL),
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

-- 3. Backfill existing records
UPDATE verificacoes v SET tem_reinspecao = EXISTS(
  SELECT 1 FROM itens_verificacao iv
  WHERE iv.verificacao_id = v.id AND iv.status_reinspecao IS NOT NULL
);
