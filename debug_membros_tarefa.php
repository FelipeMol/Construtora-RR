<?php
/**
 * Debug: Verificar membros de tarefas
 */

require_once 'config.php';

header('Content-Type: text/html; charset=UTF-8');

try {
    // Buscar tarefa de teste
    $stmt = $pdo->prepare("
        SELECT id, titulo, usuario_responsavel_id, criado_por
        FROM tarefas
        WHERE titulo LIKE '%teste%'
        ORDER BY criado_em DESC
        LIMIT 1
    ");
    $stmt->execute();
    $tarefa = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tarefa) {
        echo "<h1>Nenhuma tarefa 'teste' encontrada</h1>";
        exit;
    }

    echo "<h1>Tarefa: {$tarefa['titulo']} (ID: {$tarefa['id']})</h1>";
    echo "<p><strong>Responsável ID:</strong> {$tarefa['usuario_responsavel_id']}</p>";
    echo "<p><strong>Criado por ID:</strong> {$tarefa['criado_por']}</p>";

    // Buscar membros da tarefa
    $stmt = $pdo->prepare("
        SELECT
            tm.*,
            u.nome AS usuario_nome,
            u.email AS usuario_email,
            u.tipo AS usuario_tipo
        FROM tarefas_membros tm
        INNER JOIN usuarios u ON tm.usuario_id = u.id
        WHERE tm.tarefa_id = ?
    ");
    $stmt->execute([$tarefa['id']]);
    $membros = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<h2>Membros na tabela tarefas_membros (" . count($membros) . "):</h2>";

    if (empty($membros)) {
        echo "<p style='color: red;'><strong>⚠️ NENHUM MEMBRO ENCONTRADO!</strong></p>";
        echo "<p>Este é o problema: quando você adiciona membros pela interface, eles não estão sendo salvos na tabela tarefas_membros.</p>";
    } else {
        echo "<table border='1' cellpadding='10'>";
        echo "<tr><th>ID</th><th>Usuário ID</th><th>Nome</th><th>Email</th><th>Papel</th><th>Criado em</th></tr>";
        foreach ($membros as $membro) {
            echo "<tr>";
            echo "<td>{$membro['id']}</td>";
            echo "<td>{$membro['usuario_id']}</td>";
            echo "<td>{$membro['usuario_nome']}</td>";
            echo "<td>{$membro['usuario_email']}</td>";
            echo "<td>{$membro['papel']}</td>";
            echo "<td>{$membro['criado_em']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }

    // Buscar todos os usuários para referência
    echo "<h2>Usuários disponíveis:</h2>";
    $stmt = $pdo->query("SELECT id, nome, email, tipo FROM usuarios ORDER BY nome");
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>ID</th><th>Nome</th><th>Email</th><th>Tipo</th></tr>";
    foreach ($usuarios as $usuario) {
        echo "<tr>";
        echo "<td>{$usuario['id']}</td>";
        echo "<td>{$usuario['nome']}</td>";
        echo "<td>{$usuario['email']}</td>";
        echo "<td>{$usuario['tipo']}</td>";
        echo "</tr>";
    }
    echo "</table>";

    // Verificar estrutura da tabela tarefas_membros
    echo "<h2>Estrutura da tabela tarefas_membros:</h2>";
    $stmt = $pdo->query("DESCRIBE tarefas_membros");
    $estrutura = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>Campo</th><th>Tipo</th><th>Nulo</th><th>Chave</th><th>Padrão</th><th>Extra</th></tr>";
    foreach ($estrutura as $coluna) {
        echo "<tr>";
        echo "<td>{$coluna['Field']}</td>";
        echo "<td>{$coluna['Type']}</td>";
        echo "<td>{$coluna['Null']}</td>";
        echo "<td>{$coluna['Key']}</td>";
        echo "<td>{$coluna['Default']}</td>";
        echo "<td>{$coluna['Extra']}</td>";
        echo "</tr>";
    }
    echo "</table>";

} catch (PDOException $e) {
    echo "<h1 style='color: red;'>Erro: " . $e->getMessage() . "</h1>";
}
?>
