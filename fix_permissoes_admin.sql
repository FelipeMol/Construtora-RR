-- ========================================
-- CORRIGIR PERMISSÕES DO ADMINISTRADOR
-- ========================================

-- Primeiro, verificar se o módulo de tarefas existe
SELECT * FROM modulos WHERE nome = 'tarefas';

-- Se não existir, criar o módulo de tarefas
INSERT INTO modulos (nome, titulo, descricao, icone, ordem, ativo, requer_admin)
VALUES ('tarefas', 'Tarefas e Agenda', 'Gestão de tarefas em formato Kanban', '📋', 30, 1, 0)
ON DUPLICATE KEY UPDATE
    titulo = 'Tarefas e Agenda',
    descricao = 'Gestão de tarefas em formato Kanban',
    icone = '📋',
    ordem = 30,
    ativo = 1;

-- Dar permissões TOTAIS para TODOS os usuários tipo 'admin'
-- (Admin não precisa de permissões na tabela, mas vamos adicionar por garantia)
INSERT INTO permissoes (usuario_id, modulo_id, pode_visualizar, pode_criar, pode_editar, pode_excluir)
SELECT
    u.id as usuario_id,
    m.id as modulo_id,
    1,  -- pode_visualizar
    1,  -- pode_criar
    1,  -- pode_editar
    1   -- pode_excluir
FROM usuarios u
CROSS JOIN modulos m
WHERE m.nome = 'tarefas'
  AND u.tipo = 'admin'
ON DUPLICATE KEY UPDATE
    pode_visualizar = 1,
    pode_criar = 1,
    pode_editar = 1,
    pode_excluir = 1;

-- Dar permissões para TODOS os usuários comuns (tipo 'usuario')
INSERT INTO permissoes (usuario_id, modulo_id, pode_visualizar, pode_criar, pode_editar, pode_excluir)
SELECT
    u.id as usuario_id,
    m.id as modulo_id,
    1,  -- pode_visualizar
    1,  -- pode_criar
    1,  -- pode_editar
    0   -- pode_excluir (apenas admin pode excluir)
FROM usuarios u
CROSS JOIN modulos m
WHERE m.nome = 'tarefas'
  AND u.tipo = 'usuario'
ON DUPLICATE KEY UPDATE
    pode_visualizar = 1,
    pode_criar = 1,
    pode_editar = 1;

-- Verificar resultado final
SELECT
    u.id,
    u.nome as usuario,
    u.tipo,
    m.titulo as modulo,
    COALESCE(p.pode_visualizar, 0) as pode_visualizar,
    COALESCE(p.pode_criar, 0) as pode_criar,
    COALESCE(p.pode_editar, 0) as pode_editar,
    COALESCE(p.pode_excluir, 0) as pode_excluir
FROM usuarios u
CROSS JOIN modulos m
LEFT JOIN permissoes p ON p.usuario_id = u.id AND p.modulo_id = m.id
WHERE m.nome = 'tarefas'
ORDER BY u.tipo DESC, u.nome;

SELECT '✅ Permissões configuradas com sucesso!' as status;
