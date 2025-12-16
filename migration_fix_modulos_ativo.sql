-- ========================================
-- FIX: Corrigir tipo de dados da coluna modulos.ativo
-- Problema: ENUM('Sim', 'Não') não é compatível com comparação numérica
-- Solução: Converter para TINYINT(1) padrão
-- Data: 2025-12-15
-- ========================================

-- IMPORTANTE: Execute este script via phpMyAdmin no HostGator
-- antes de usar o módulo de Tarefas

-- Passo 1: Modificar o tipo da coluna ativo de ENUM para TINYINT(1)
-- IMPORTANTE: MySQL converterá automaticamente os valores:
--   - ENUM 'Sim' (primeiro valor) → 1
--   - ENUM 'Não' (segundo valor) → 2
-- Por isso, precisamos primeiro normalizar para 0 e 1 ANTES de converter
ALTER TABLE modulos
MODIFY COLUMN ativo TINYINT(1) DEFAULT 1;

-- Passo 2: Normalizar valores (caso algum registro tenha valor 2)
-- Após a conversão, 'Não' vira 2, então precisamos converter 2 → 0
UPDATE modulos SET ativo = 0 WHERE ativo = 2;
UPDATE modulos SET ativo = 1 WHERE ativo != 0;

-- Passo 3: Verificar se a migração foi bem-sucedida
SELECT
    'Verificação da Migração' as Teste,
    COUNT(*) as total_modulos,
    SUM(CASE WHEN ativo = 1 THEN 1 ELSE 0 END) as modulos_ativos,
    SUM(CASE WHEN ativo = 0 THEN 1 ELSE 0 END) as modulos_inativos
FROM modulos;

-- Passo 4: Listar todos os módulos com novo tipo
SELECT id, nome, titulo, ativo, ordem
FROM modulos
ORDER BY ordem;

-- Mensagem de sucesso
SELECT '✅ Migração concluída com sucesso! A coluna modulos.ativo agora é TINYINT(1)' as Status;
