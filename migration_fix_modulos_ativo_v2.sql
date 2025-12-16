-- ========================================
-- FIX v2: Corrigir tipo de dados da coluna modulos.ativo
-- Versão SEGURA que verifica o estado atual antes de modificar
-- Data: 2025-12-15
-- ========================================

-- PASSO 1: Verificar estado atual da tabela
SELECT
    'Estado ANTES da migração' as Status,
    COLUMN_NAME,
    COLUMN_TYPE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'modulos'
  AND COLUMN_NAME = 'ativo';

-- PASSO 2: Ver dados atuais
SELECT
    'Dados ANTES da migração' as Status,
    id, nome, ativo
FROM modulos
ORDER BY ordem
LIMIT 20;

-- PASSO 3: Modificar coluna para TINYINT(1)
-- Este comando funcionará independente do tipo atual
ALTER TABLE modulos
MODIFY COLUMN ativo TINYINT(1) NOT NULL DEFAULT 1;

-- PASSO 4: Normalizar valores (converter 2 → 0)
-- MySQL converte ENUM para números ordinais:
--   'Sim' (1ª posição) → 1
--   'Não' (2ª posição) → 2
-- Precisamos converter 2 → 0 para ter boolean correto
UPDATE modulos SET ativo = 0 WHERE ativo = 2;
UPDATE modulos SET ativo = 0 WHERE ativo > 1;

-- PASSO 5: Garantir que todos os valores são 0 ou 1
UPDATE modulos SET ativo = 1 WHERE ativo IS NULL;

-- PASSO 6: Verificar resultado
SELECT
    'Estado DEPOIS da migração' as Status,
    COLUMN_NAME,
    COLUMN_TYPE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'modulos'
  AND COLUMN_NAME = 'ativo';

-- PASSO 7: Ver dados finais
SELECT
    'Dados DEPOIS da migração' as Status,
    id,
    nome,
    ativo,
    CASE
        WHEN ativo = 1 THEN '✓ Ativo'
        WHEN ativo = 0 THEN '✗ Inativo'
        ELSE '? Valor inválido'
    END as status_legivel
FROM modulos
ORDER BY ordem;

-- PASSO 8: Estatísticas
SELECT
    '✅ Migração concluída!' as Status,
    COUNT(*) as total_modulos,
    SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) as modulos_ativos,
    SUM(CASE WHEN ativo = 0 THEN 1 ELSE 0 END) as modulos_inativos,
    SUM(CASE WHEN ativo NOT IN (0,1) THEN 1 ELSE 0 END) as valores_invalidos
FROM modulos;
