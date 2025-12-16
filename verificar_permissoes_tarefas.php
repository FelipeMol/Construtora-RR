<?php
require_once 'config.php';

// Listar usuários
echo "=== USUÁRIOS ===\n";
$stmt = $pdo->query("SELECT id, nome, usuario, tipo FROM usuarios ORDER BY id");
$usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);
foreach ($usuarios as $u) {
    echo "ID: {$u['id']} | Nome: {$u['nome']} | User: {$u['usuario']} | Tipo: {$u['tipo']}\n";
}

// Buscar módulo de tarefas
echo "\n=== MÓDULO TAREFAS ===\n";
$stmt = $pdo->query("SELECT id, nome, titulo FROM modulos WHERE nome = 'tarefas'");
$modulo = $stmt->fetch(PDO::FETCH_ASSOC);
if ($modulo) {
    echo "ID: {$modulo['id']} | Nome: {$modulo['nome']} | Título: {$modulo['titulo']}\n";
} else {
    echo "Módulo 'tarefas' NÃO ENCONTRADO!\n";
}

// Verificar permissões de tarefas
echo "\n=== PERMISSÕES DE TAREFAS ===\n";
$stmt = $pdo->query("
    SELECT
        u.id as usuario_id,
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
    ORDER BY u.nome
");
$permissoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($permissoes)) {
    echo "⚠️ NENHUMA permissão configurada para tarefas!\n";
} else {
    foreach ($permissoes as $p) {
        echo "Usuario: {$p['usuario']} ({$p['tipo']}) | Ver:{$p['pode_visualizar']} Criar:{$p['pode_criar']} Editar:{$p['pode_editar']} Excluir:{$p['pode_excluir']}\n";
    }
}
?>
