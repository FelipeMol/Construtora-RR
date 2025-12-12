-- ========================================
-- ATUALIZAÇÃO: ADICIONAR TABELAS FUNCOES E RESPONSAVEIS
-- Para bancos de dados já existentes
-- Sprint 3 - Data: 2025-10-30
-- ========================================

-- Verificar se banco está correto
SELECT DATABASE() as 'Banco Atual';

-- Tabela de funções (cargos padrão)
CREATE TABLE IF NOT EXISTS funcoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL UNIQUE,
    descricao TEXT,
    ativo ENUM('Sim', 'Não') DEFAULT 'Sim',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome_funcao (nome),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de responsáveis (gestores de obras)
CREATE TABLE IF NOT EXISTS responsaveis (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    telefone VARCHAR(20),
    email VARCHAR(255),
    ativo ENUM('Sim', 'Não') DEFAULT 'Sim',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome_responsavel (nome),
    INDEX idx_ativo_responsavel (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir funções padrão (apenas se não existirem)
INSERT IGNORE INTO funcoes (nome, descricao) VALUES 
('Pedreiro', 'Profissional especializado em alvenaria e construção'),
('Servente', 'Auxiliar de obras e serviços gerais'),
('Armador', 'Especialista em montagem de ferragens'),
('Carpinteiro', 'Profissional de formas e estruturas de madeira'),
('Eletricista', 'Instalações elétricas prediais'),
('Encanador', 'Instalações hidráulicas e sanitárias'),
('Pintor', 'Acabamentos e pintura predial'),
('Mestre de Obras', 'Coordenador de equipes e serviços'),
('Engenheiro', 'Responsável técnico pela obra'),
('Motorista', 'Transporte e logística'),
('Operador de Máquinas', 'Operação de equipamentos pesados'),
('Ajudante Geral', 'Auxiliar em diversas funções');

-- Verificar criação das tabelas
SELECT 
    TABLE_NAME as 'Nova Tabela',
    CREATE_TIME as 'Criada em',
    TABLE_ROWS as 'Registros'
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME IN ('funcoes', 'responsaveis')
ORDER BY TABLE_NAME;

-- Listar funções cadastradas
SELECT 'Funções cadastradas:' as 'Status';
SELECT id, nome, descricao, ativo FROM funcoes ORDER BY nome;

SELECT '✅ Migração concluída com sucesso!' as 'Resultado';
