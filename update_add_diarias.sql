-- ========================================
-- ATUALIZAÇÃO DO BANCO DE DADOS
-- Adicionar campo DIARIAS na tabela lancamentos
-- ========================================

-- Verificar se a coluna já existe antes de adicionar
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'lancamentos' 
    AND COLUMN_NAME = 'diarias'
);

-- Adicionar coluna apenas se não existir
SET @query = IF(@column_exists = 0, 
    'ALTER TABLE lancamentos ADD COLUMN diarias DECIMAL(3,1) DEFAULT 1.0 AFTER horas',
    'SELECT "Coluna diarias já existe" as status'
);

PREPARE stmt FROM @query;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar resultado
SELECT 
    COLUMN_NAME as 'Coluna',
    COLUMN_TYPE as 'Tipo',
    COLUMN_DEFAULT as 'Padrão'
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'lancamentos'
    AND COLUMN_NAME IN ('horas', 'diarias')
ORDER BY ORDINAL_POSITION;

SELECT '✅ Atualização concluída! Campo DIARIAS adicionado.' as 'Status';
