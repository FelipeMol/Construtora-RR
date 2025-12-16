-- ========================================
-- Dar Permissões de Tarefas para Usuários
-- ========================================

-- OPÇÃO 1: Dar permissão TOTAL de tarefas para usuário "Compras CRR" (ID 2)
INSERT INTO permissoes (usuario_id, modulo_id, pode_visualizar, pode_criar, pode_editar, pode_excluir)
SELECT
    2 as usuario_id,  -- ID do usuário "Compras CRR"
    m.id as modulo_id,
    1,  -- pode_visualizar
    1,  -- pode_criar
    1,  -- pode_editar
    1   -- pode_excluir
FROM modulos m
WHERE m.nome = 'tarefas'
ON DUPLICATE KEY UPDATE
    pode_visualizar = 1,
    pode_criar = 1,
    pode_editar = 1,
    pode_excluir = 1;

-- OPÇÃO 2: Dar permissões de tarefas para TODOS os usuários (exceto já configurados)
INSERT INTO permissoes (usuario_id, modulo_id, pode_visualizar, pode_criar, pode_editar, pode_excluir)
SELECT
    u.id as usuario_id,
    m.id as modulo_id,
    1,  -- pode_visualizar
    1,  -- pode_criar
    1,  -- pode_editar
    0   -- pode_excluir (apenas visualizar, criar e editar próprias tarefas)
FROM usuarios u
CROSS JOIN modulos m
WHERE m.nome = 'tarefas'
  AND u.tipo = 'usuario'  -- Apenas usuários comuns (admin já tem)
ON DUPLICATE KEY UPDATE
    pode_visualizar = VALUES(pode_visualizar),
    pode_criar = VALUES(pode_criar),
    pode_editar = VALUES(pode_editar),
    pode_excluir = VALUES(pode_excluir);

-- Verificar permissões configuradas
SELECT
    u.nome as usuario,
    u.tipo,
    m.titulo as modulo,
    p.pode_visualizar,
    p.pode_criar,
    p.pode_editar,
    p.pode_excluir
FROM permissoes p
INNER JOIN usuarios u ON p.usuario_id = u.id
INNER JOIN modulos m ON p.modulo_id = m.id
WHERE m.nome = 'tarefas'
ORDER BY u.nome;

-- Mensagem de sucesso
SELECT '✅ Permissões de tarefas configuradas!' as Status;
