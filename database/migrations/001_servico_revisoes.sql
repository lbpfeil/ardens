-- Migration: Add revision tracking to servicos
-- Created: 2026-01-22

-- 1. Add revision columns to servicos
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS revisao VARCHAR(5) NOT NULL DEFAULT '00';
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS revisao_descricao TEXT;
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS revisao_updated_at TIMESTAMPTZ;
ALTER TABLE servicos ADD COLUMN IF NOT EXISTS revisao_updated_by UUID REFERENCES auth.users(id);

-- 2. Create revision history table
CREATE TABLE IF NOT EXISTS servico_revisoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  servico_id UUID NOT NULL REFERENCES servicos(id) ON DELETE CASCADE,
  revisao VARCHAR(5) NOT NULL,
  descricao TEXT NOT NULL,
  -- Snapshot of servico fields at this revision
  snapshot_codigo VARCHAR(50) NOT NULL,
  snapshot_nome VARCHAR(255) NOT NULL,
  snapshot_categoria categoria_servico,
  snapshot_referencia_normativa TEXT,
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),

  -- Each servico+revision combination is unique
  UNIQUE(servico_id, revisao)
);

-- Indexes for servico_revisoes
CREATE INDEX IF NOT EXISTS idx_servico_revisoes_servico ON servico_revisoes(servico_id);
CREATE INDEX IF NOT EXISTS idx_servico_revisoes_created ON servico_revisoes(servico_id, created_at DESC);

-- Enable RLS on servico_revisoes
ALTER TABLE servico_revisoes ENABLE ROW LEVEL SECURITY;

-- 3. Add revision tracking to obra_servicos
ALTER TABLE obra_servicos ADD COLUMN IF NOT EXISTS revisao_ativa VARCHAR(5) NOT NULL DEFAULT '00';

-- 4. RLS policies for servico_revisoes (read-only for all authenticated users of cliente)
CREATE POLICY "servico_revisoes_select" ON servico_revisoes
  FOR SELECT
  USING (
    servico_id IN (
      SELECT id FROM servicos WHERE cliente_id IN (
        SELECT cliente_id FROM usuario_clientes
        WHERE usuario_id = auth.uid() AND ativo = true
      )
    )
  );

-- Admin can insert revision history
CREATE POLICY "servico_revisoes_insert" ON servico_revisoes
  FOR INSERT
  WITH CHECK (
    servico_id IN (
      SELECT id FROM servicos WHERE cliente_id IN (
        SELECT cliente_id FROM usuario_clientes
        WHERE usuario_id = auth.uid() AND ativo = true
      )
    )
  );

-- 5. Backfill existing servicos with initial revision entry
INSERT INTO servico_revisoes (servico_id, revisao, descricao, snapshot_codigo, snapshot_nome, snapshot_categoria, snapshot_referencia_normativa)
SELECT
  id as servico_id,
  '00' as revisao,
  'Revisao inicial (migracao)' as descricao,
  codigo as snapshot_codigo,
  nome as snapshot_nome,
  categoria as snapshot_categoria,
  referencia_normativa as snapshot_referencia_normativa
FROM servicos
WHERE NOT EXISTS (
  SELECT 1 FROM servico_revisoes sr WHERE sr.servico_id = servicos.id
);

-- 6. Backfill existing obra_servicos with current servico revision
UPDATE obra_servicos os
SET revisao_ativa = COALESCE(
  (SELECT s.revisao FROM servicos s WHERE s.id = os.servico_id),
  '00'
)
WHERE os.revisao_ativa = '00' OR os.revisao_ativa IS NULL;
