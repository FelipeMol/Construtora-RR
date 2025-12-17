<?php
// debug_tarefas.php - diagnostico rápido para aba Trello

// Força exibição de erros no output
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require __DIR__ . '/config.php';

// Sobrescreve content-type para texto simples
header('Content-Type: text/plain');

function line($msg) { echo $msg, PHP_EOL; }

function checkTable(PDO $pdo, $table) {
    $tableQuoted = $pdo->quote($table);
    $stmt = $pdo->query("SHOW TABLES LIKE {$tableQuoted}");
    return (bool)$stmt->fetchColumn();
}

function checkColumn(PDO $pdo, $table, $col) {
    $tableSafe = str_replace('`', '', $table);
    $colQuoted = $pdo->quote($col);
    $sql = "SHOW COLUMNS FROM `{$tableSafe}` LIKE {$colQuoted}";
    $stmt = $pdo->query($sql);
    return (bool)$stmt->fetchColumn();
}

line('=== Tabelas Trello ===');
foreach (['tarefas_etiquetas','tarefas_membros','tarefas_checklists','tarefas_anexos','tarefas_atividades'] as $t) {
    line("$t: " . (checkTable($pdo, $t) ? 'OK' : 'FALTA'));
}

line(PHP_EOL . '=== Colunas esperadas ===');
line('usuarios.avatar: ' . (checkColumn($pdo, 'usuarios', 'avatar') ? 'OK' : 'FALTA'));
line('usuarios.token_versao: ' . (checkColumn($pdo, 'usuarios', 'token_versao') ? 'OK' : 'FALTA'));
line('tarefas.posicao_coluna: ' . (checkColumn($pdo, 'tarefas', 'posicao_coluna') ? 'OK' : 'FALTA'));

line(PHP_EOL . '=== Query etiquetas (api_tarefas_etiquetas GET) ===');
try {
    $stmt = $pdo->query("
        SELECT e.id, e.nome, e.cor, te.criado_em
        FROM tarefas_etiquetas te
        INNER JOIN etiquetas e ON te.etiqueta_id = e.id
        LIMIT 1
    ");
    $stmt->fetchAll();
    line('Etiquetas: OK (sem erro SQL)');
} catch (Exception $e) {
    line('Erro etiquetas: ' . $e->getMessage());
}

line(PHP_EOL . '=== Query membros (api_tarefas_membros GET) ===');
try {
    $stmt = $pdo->query("
        SELECT tm.id, tm.tarefa_id, tm.usuario_id, tm.papel, tm.criado_em,
               u.nome, u.email, u.avatar
        FROM tarefas_membros tm
        INNER JOIN usuarios u ON tm.usuario_id = u.id
        LIMIT 1
    ");
    $stmt->fetchAll();
    line('Membros: OK (sem erro SQL)');
} catch (Exception $e) {
    line('Erro membros: ' . $e->getMessage());
}

line(PHP_EOL . '=== Se nada apareceu acima ===');
line('- Confirme se acessou a URL correta do debug_tarefas.php');
line('- Se ainda vazar em branco, veja php_errors.log no servidor');

line(PHP_EOL . '=== Fim ===');