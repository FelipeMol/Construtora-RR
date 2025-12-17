-- ========================================
-- MIGRATION: Sistema de Tarefas Estilo Trello
-- Adiciona recursos: Etiquetas, Checklist, Membros, Anexos, Atividades
-- ========================================

-- ETIQUETAS (Tags coloridas para organização)
CREATE TABLE IF NOT EXISTS etiquetas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    cor VARCHAR(7) NOT NULL DEFAULT '#6b7280',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nome (nome)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TAREFAS <-> ETIQUETAS (Relacionamento N:N)
CREATE TABLE IF NOT EXISTS tarefas_etiquetas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tarefa_id BIGINT NOT NULL,
    etiqueta_id BIGINT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tarefa_etiqueta (tarefa_id, etiqueta_id),
    INDEX idx_tarefa (tarefa_id),
    INDEX idx_etiqueta (etiqueta_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- CHECKLIST (Subtarefas/Items de checklist)
CREATE TABLE IF NOT EXISTS tarefas_checklists (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tarefa_id BIGINT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    concluido BOOLEAN DEFAULT FALSE,
    ordem INT DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
    INDEX idx_tarefa (tarefa_id),
    INDEX idx_ordem (tarefa_id, ordem)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- MEMBROS/RESPONSÁVEIS MÚLTIPLOS (Atribuição de múltiplos usuários)
CREATE TABLE IF NOT EXISTS tarefas_membros (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tarefa_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    papel ENUM('responsavel', 'observador', 'revisor') DEFAULT 'responsavel',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tarefa_usuario (tarefa_id, usuario_id),
    INDEX idx_tarefa (tarefa_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ANEXOS (Upload de arquivos)
CREATE TABLE IF NOT EXISTS tarefas_anexos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tarefa_id BIGINT NOT NULL,
    nome_original VARCHAR(255) NOT NULL,
    nome_arquivo VARCHAR(255) NOT NULL,
    caminho VARCHAR(500) NOT NULL,
    tamanho INT NOT NULL,
    tipo_mime VARCHAR(100),
    usuario_id BIGINT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_tarefa (tarefa_id),
    INDEX idx_usuario (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- HISTÓRICO DE ATIVIDADES (Timeline de mudanças)
CREATE TABLE IF NOT EXISTS tarefas_atividades (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tarefa_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    acao VARCHAR(50) NOT NULL,
    descricao TEXT,
    campo_alterado VARCHAR(100),
    valor_anterior TEXT,
    valor_novo TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    INDEX idx_tarefa (tarefa_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_criado (criado_em DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Adicionar novos campos na tabela tarefas existente
-- (Comentar os campos que já existem para evitar erro)

-- Descomente APENAS os campos que NÃO existem na sua tabela:
-- ALTER TABLE tarefas ADD COLUMN posicao_coluna INT DEFAULT 0 AFTER status;
-- ALTER TABLE tarefas ADD COLUMN cor_customizada VARCHAR(7) AFTER prioridade;
-- ALTER TABLE tarefas ADD COLUMN estimativa_horas DECIMAL(5,2) AFTER cor_customizada;
-- ALTER TABLE tarefas ADD COLUMN tempo_gasto DECIMAL(5,2) DEFAULT 0 AFTER estimativa_horas;
-- ALTER TABLE tarefas ADD COLUMN data_inicio DATE AFTER data_prazo;
-- ALTER TABLE tarefas ADD COLUMN arquivada BOOLEAN DEFAULT FALSE AFTER cancelado;

-- Índice para melhorar performance em drag-and-drop (se não existir)
-- ALTER TABLE tarefas ADD INDEX idx_posicao (status, posicao_coluna);

-- Etiquetas padrão (8 tags coloridas)
INSERT INTO etiquetas (nome, cor) VALUES
    ('Urgente', '#ef4444'),
    ('Bug', '#dc2626'),
    ('Feature', '#3b82f6'),
    ('Melhoria', '#10b981'),
    ('Documentação', '#8b5cf6'),
    ('Design', '#ec4899'),
    ('Backend', '#f59e0b'),
    ('Frontend', '#06b6d4')
ON DUPLICATE KEY UPDATE nome=nome;

-- Atualizar campo editado_em na tabela de comentários (para permitir edição)
-- Descomente se a coluna NÃO existir:
-- ALTER TABLE tarefas_comentarios ADD COLUMN editado_em TIMESTAMP NULL AFTER atualizado_em;

-- ========================================
-- VIEWS para facilitar queries complexas
-- ========================================

-- View: Tarefas com contadores agregados
CREATE OR REPLACE VIEW view_tarefas_resumo AS
SELECT
    t.*,
    u.nome AS usuario_responsavel_nome,
    u.email AS usuario_Xresponsavel_email,
    f.nome AS funcionario_nome,
    o.nome AS obra_nome,
    e.nome AS empresa_nome,
    (SELECT COUNT(*) FROM tarefas_comentarios tc WHERE tc.tarefa_id = t.id) AS total_comentarios,
    (SELECT COUNT(*) FROM tarefas_anexos ta WHERE ta.tarefa_id = t.id) AS total_anexos,
    (SELECT COUNT(*) FROM tarefas_checklists tcl WHERE tcl.tarefa_id = t.id) AS total_checklist_items,
    (SELECT COUNT(*) FROM tarefas_checklists tcl WHERE tcl.tarefa_id = t.id AND tcl.concluido = TRUE) AS checklist_concluidos,
    (SELECT GROUP_CONCAT(et.nome SEPARATOR '|') FROM tarefas_etiquetas te
     INNER JOIN etiquetas et ON te.etiqueta_id = et.id
     WHERE te.tarefa_id = t.id) AS etiquetas_nomes,
    (SELECT GROUP_CONCAT(et.cor SEPARATOR '|') FROM tarefas_etiquetas te
     INNER JOIN etiquetas et ON te.etiqueta_id = et.id
     WHERE te.tarefa_id = t.id) AS etiquetas_cores
FROM tarefas t
LEFT JOIN usuarios u ON t.usuario_responsavel_id = u.id
LEFT JOIN funcionarios f ON t.funcionario_id = f.id
LEFT JOIN obras o ON t.obra_id = o.id
LEFT JOIN empresas e ON t.empresa_id = e.id;

-- ========================================
-- Adicionar permissão do módulo de tarefas (se não existir)
-- ========================================
INSERT INTO modulos (nome, titulo, descricao, icone, ordem, ativo, requer_admin)
VALUES ('tarefas', 'Tarefas e Agenda', 'Gestão de tarefas e agenda (Kanban)', '📋', 4, 1, 0)
ON DUPLICATE KEY UPDATE titulo=titulo;

-- ========================================
-- LOG da Migration
-- ========================================
SELECT 'Migration concluída com sucesso!' AS status,
       'Tabelas criadas: etiquetas, tarefas_etiquetas, tarefas_checklists, tarefas_membros, tarefas_anexos, tarefas_atividades' AS info,
       '8 etiquetas padrão inseridas' AS etiquetas,
       'View view_tarefas_resumo criada' AS view_info;
