-- ========================================
-- SISTEMA CONTROLE DE OBRAS - HOSTGATOR
-- Criação das tabelas MySQL ATUALIZADO
-- Data: 2025-10-29
-- ========================================

-- Criar banco de dados (descomente se necessário)
-- CREATE DATABASE controle_obras CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE controle_obras;

-- ========================================
-- TABELAS DO SISTEMA
-- ========================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    usuario VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo ENUM('admin', 'usuario') DEFAULT 'usuario',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_usuario (usuario),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de empresas
CREATE TABLE IF NOT EXISTS empresas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20),
    tipo ENUM('Construtora', 'Serviços', 'SPE') DEFAULT 'Construtora',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome_empresa (nome),
    INDEX idx_cnpj (cnpj)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de obras
CREATE TABLE IF NOT EXISTS obras (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    responsavel VARCHAR(255),
    cidade VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome_obra (nome),
    INDEX idx_cidade (cidade)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de funcionários
CREATE TABLE IF NOT EXISTS funcionarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    funcao VARCHAR(255),
    empresa VARCHAR(255),
    situacao ENUM('Ativo', 'Inativo') DEFAULT 'Ativo',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome_funcionario (nome),
    INDEX idx_empresa_funcionario (empresa),
    INDEX idx_situacao (situacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de lançamentos
CREATE TABLE IF NOT EXISTS lancamentos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    data DATE NOT NULL,
    funcionario VARCHAR(255) NOT NULL,
    funcao VARCHAR(255),
    empresa VARCHAR(255),
    obra VARCHAR(255),
    horas TIME DEFAULT '08:00:00',
    diarias DECIMAL(3,1) DEFAULT 1.0,
    observacao TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_data (data),
    INDEX idx_funcionario_lancamento (funcionario),
    INDEX idx_obra_lancamento (obra),
    INDEX idx_empresa_lancamento (empresa),
    INDEX idx_data_funcionario (data, funcionario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de avaliações
CREATE TABLE IF NOT EXISTS avaliacoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    funcionario_id BIGINT NOT NULL,
    funcionario_nome VARCHAR(255) NOT NULL,
    data_avaliacao DATE NOT NULL,
    pontualidade INT DEFAULT 0,
    qualidade INT DEFAULT 0,
    trabalho_equipe INT DEFAULT 0,
    iniciativa INT DEFAULT 0,
    conhecimento_tecnico INT DEFAULT 0,
    capacidade_aprendizado INT DEFAULT 0,
    observacoes TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_funcionario_avaliacao (funcionario_id),
    INDEX idx_data_avaliacao (data_avaliacao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

-- ========================================
-- DADOS INICIAIS
-- ========================================

-- Usuário administrador padrão (senha: admin123)
INSERT IGNORE INTO usuarios (nome, usuario, email, senha, tipo) VALUES 
('Administrador Sistema', 'admin', 'admin@vivicontroldeobras.com.br', 'admin123', 'admin');

-- Funções padrão comuns na construção civil
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

-- Verificar se as tabelas foram criadas
SELECT 
    TABLE_NAME as 'Tabela Criada',
    TABLE_ROWS as 'Registros'
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE() 
    AND TABLE_NAME IN ('usuarios', 'empresas', 'obras', 'funcionarios', 'lancamentos', 'avaliacoes', 'funcoes', 'responsaveis')
ORDER BY TABLE_NAME;

SELECT 'Banco de dados criado com sucesso!' as 'Status';