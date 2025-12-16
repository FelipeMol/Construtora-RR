-- ========================================
-- MIGRATION: Add usuario_responsavel_id to tarefas table
-- Date: 2025-12-16
-- Purpose: Replace funcionario_id with usuario_responsavel_id
-- ========================================

-- Selecionar o banco de dados
USE hg253b74_controleobras;

-- Add new column for user assignment
ALTER TABLE tarefas
ADD COLUMN usuario_responsavel_id BIGINT AFTER funcionario_id;

-- Add foreign key constraint
ALTER TABLE tarefas
ADD CONSTRAINT fk_tarefas_usuario_responsavel
    FOREIGN KEY (usuario_responsavel_id)
    REFERENCES usuarios(id)
    ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_tarefas_usuario_responsavel ON tarefas(usuario_responsavel_id);

-- Optional: Migrate existing funcionario_id data to usuario_responsavel_id
-- Note: This is commented out as it requires manual mapping
-- UPDATE tarefas SET usuario_responsavel_id = 1 WHERE funcionario_id IS NOT NULL;

-- Verification queries
-- SELECT COUNT(*) FROM tarefas WHERE usuario_responsavel_id IS NOT NULL;
-- SHOW COLUMNS FROM tarefas WHERE Field = 'usuario_responsavel_id';
