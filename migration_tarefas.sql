-- ========================================
-- MIGRATION: Sistema de Tarefas (Kanban)
-- Descrição: Cria tabelas para gestão de tarefas estilo Trello
-- Data: 2025-12-15
-- ========================================

-- Tabela: tarefas
-- Armazena as tarefas do sistema com status, prioridade, prazos
CREATE TABLE IF NOT EXISTS tarefas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    status ENUM('novo', 'em_andamento', 'concluido', 'cancelado') DEFAULT 'novo',
    prioridade ENUM('baixa', 'media', 'alta', 'urgente') DEFAULT 'media',

    -- Referências
    funcionario_id BIGINT,
    obra_id BIGINT,
    empresa_id BIGINT,
    criado_por BIGINT NOT NULL,

    -- Datas
    data_prazo DATE,
    data_conclusao TIMESTAMP NULL,

    -- Timestamps
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Índices para performance
    INDEX idx_status (status),
    INDEX idx_prioridade (prioridade),
    INDEX idx_funcionario (funcionario_id),
    INDEX idx_obra (obra_id),
    INDEX idx_empresa (empresa_id),
    INDEX idx_criado_por (criado_por),
    INDEX idx_prazo (data_prazo),
    INDEX idx_criado_em (criado_em),

    -- Foreign Keys
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE SET NULL,
    FOREIGN KEY (obra_id) REFERENCES obras(id) ON DELETE SET NULL,
    FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE SET NULL,
    FOREIGN KEY (criado_por) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela: tarefas_comentarios
-- Armazena comentários das tarefas
CREATE TABLE IF NOT EXISTS tarefas_comentarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tarefa_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Índices
    INDEX idx_tarefa (tarefa_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_criado_em (criado_em),

    -- Foreign Keys com CASCADE para remover comentários quando tarefa for deletada
    FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicionar módulo de permissões para tarefas
INSERT INTO modulos (nome, titulo, descricao, icone, ordem, requer_admin, ativo)
VALUES ('tarefas', 'Tarefas', 'Gestão de tarefas e agenda', '📋', 8, 0, 1)
ON DUPLICATE KEY UPDATE
    titulo = 'Tarefas',
    descricao = 'Gestão de tarefas e agenda',
    icone = '📋',
    ordem = 8,
    ativo = 1;

-- Verificação final
SELECT 'Migration concluída com sucesso!' as status;
SELECT COUNT(*) as total_tarefas FROM tarefas;
SELECT COUNT(*) as total_comentarios FROM tarefas_comentarios;
SELECT * FROM modulos WHERE nome = 'tarefas';
