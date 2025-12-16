-- ========================================
-- MIGRAÇÃO: SISTEMA DE AUTENTICAÇÃO
-- Sistema de Controle de Obras
-- Executar via phpMyAdmin no HostGator
-- ========================================

-- 1. Adicionar novos campos na tabela usuarios
ALTER TABLE usuarios
    ADD COLUMN ativo TINYINT(1) DEFAULT 1 AFTER tipo,
    ADD COLUMN primeiro_acesso TINYINT(1) DEFAULT 1 AFTER ativo,
    ADD COLUMN ultimo_login TIMESTAMP NULL AFTER primeiro_acesso,
    ADD COLUMN token_versao INT DEFAULT 1 AFTER ultimo_login;

-- 1.1. Adicionar índice na coluna ativo
ALTER TABLE usuarios
    ADD INDEX idx_ativo (ativo);

-- 2. Atualizar senha do admin para hash bcrypt
-- Senha padrão: 'admin123' → hash bcrypt
-- IMPORTANTE: Este hash é gerado com password_hash('admin123', PASSWORD_BCRYPT)
UPDATE usuarios
SET senha = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'  -- admin123
WHERE usuario = 'admin';

-- 3. Criar tabela modulos
CREATE TABLE IF NOT EXISTS modulos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    icone VARCHAR(50),
    ordem INT DEFAULT 0,
    ativo TINYINT(1) DEFAULT 1,
    requer_admin TINYINT(1) DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nome (nome),
    INDEX idx_ativo (ativo),
    INDEX idx_ordem (ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Popular módulos existentes
INSERT INTO modulos (nome, titulo, descricao, icone, ordem, requer_admin) VALUES
('dashboard', 'Dashboard', 'Visão geral do sistema', '📊', 1, 0),
('lancamentos', 'Lançamentos', 'Registro de horas e diárias', '📋', 2, 0),
('funcionarios', 'Funcionários', 'Cadastro de trabalhadores', '👷', 3, 0),
('obras', 'Obras', 'Gerenciamento de obras', '🏗️', 4, 0),
('empresas', 'Empresas', 'Cadastro de empresas', '🏢', 5, 0),
('base', 'Base de Dados', 'Funções e responsáveis', '📚', 6, 0),
('relatorios', 'Relatórios', 'Relatórios e análises', '📈', 7, 0),
('avaliacoes', 'Avaliações', 'Avaliações de funcionários', '⭐', 8, 0),
('projetos', 'Projetos', 'Gerenciamento de projetos', '📁', 9, 0),
('usuarios', 'Usuários', 'Gerenciamento de usuários', '👤', 10, 1),
('configuracoes', 'Configurações', 'Configurações do sistema', '⚙️', 11, 1),
('backup', 'Backup', 'Backup e restauração', '💾', 12, 1)
ON DUPLICATE KEY UPDATE titulo=VALUES(titulo);

-- 5. Criar tabela permissoes
CREATE TABLE IF NOT EXISTS permissoes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    modulo_id BIGINT NOT NULL,
    pode_visualizar TINYINT(1) DEFAULT 0,
    pode_criar TINYINT(1) DEFAULT 0,
    pode_editar TINYINT(1) DEFAULT 0,
    pode_excluir TINYINT(1) DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_usuario_modulo (usuario_id, modulo_id),
    CONSTRAINT fk_permissao_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_permissao_modulo
        FOREIGN KEY (modulo_id) REFERENCES modulos(id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_modulo (modulo_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Dar permissões TOTAIS ao admin em TODOS os módulos
INSERT INTO permissoes (usuario_id, modulo_id, pode_visualizar, pode_criar, pode_editar, pode_excluir)
SELECT
    u.id,
    m.id,
    1, 1, 1, 1
FROM usuarios u
CROSS JOIN modulos m
WHERE u.tipo = 'admin'
ON DUPLICATE KEY UPDATE
    pode_visualizar=1, pode_criar=1, pode_editar=1, pode_excluir=1;

SELECT 'Migração concluída com sucesso!' AS Status;
