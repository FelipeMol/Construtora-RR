<?php
/**
 * Teste: Adicionar membro a uma tarefa manualmente
 */

require_once 'config.php';

header('Content-Type: text/html; charset=UTF-8');

try {
    // 1. Buscar tarefa de teste
    $stmt = $pdo->prepare("SELECT id, titulo FROM tarefas WHERE titulo LIKE '%teste%' ORDER BY criado_em DESC LIMIT 1");
    $stmt->execute();
    $tarefa = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tarefa) {
        echo "<h1 style='color: red;'>Nenhuma tarefa 'teste' encontrada</h1>";
        exit;
    }

    echo "<h1>Tarefa encontrada: {$tarefa['titulo']} (ID: {$tarefa['id']})</h1>";

    // 2. Buscar usuário TESTER
    $stmt = $pdo->prepare("SELECT id, nome, email FROM usuarios WHERE nome LIKE '%TESTER%' OR email LIKE '%tester%'");
    $stmt->execute();
    $tester = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$tester) {
        echo "<h2 style='color: red;'>Usuário TESTER não encontrado</h2>";
        exit;
    }

    echo "<h2>Usuário TESTER encontrado: {$tester['nome']} (ID: {$tester['id']})</h2>";

    // 3. Verificar se já existe na tabela tarefas_membros
    $stmt = $pdo->prepare("SELECT * FROM tarefas_membros WHERE tarefa_id = ? AND usuario_id = ?");
    $stmt->execute([$tarefa['id'], $tester['id']]);
    $membroExistente = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($membroExistente) {
        echo "<h3 style='color: orange;'>⚠️ Membro já existe na tabela tarefas_membros!</h3>";
        echo "<pre>" . print_r($membroExistente, true) . "</pre>";
    } else {
        echo "<h3 style='color: green;'>✅ Membro NÃO existe na tabela. Vou adicionar...</h3>";

        // 4. Adicionar membro
        $stmt = $pdo->prepare("
            INSERT INTO tarefas_membros (tarefa_id, usuario_id, papel, criado_em)
            VALUES (?, ?, 'responsavel', NOW())
        ");
        $resultado = $stmt->execute([$tarefa['id'], $tester['id']]);

        if ($resultado) {
            $novoId = $pdo->lastInsertId();
            echo "<h4 style='color: green;'>✅ Membro adicionado com sucesso! ID: {$novoId}</h4>";

            // Verificar se foi realmente adicionado
            $stmt = $pdo->prepare("
                SELECT tm.*, u.nome, u.email
                FROM tarefas_membros tm
                INNER JOIN usuarios u ON tm.usuario_id = u.id
                WHERE tm.id = ?
            ");
            $stmt->execute([$novoId]);
            $membroAdicionado = $stmt->fetch(PDO::FETCH_ASSOC);

            echo "<pre>" . print_r($membroAdicionado, true) . "</pre>";
        } else {
            echo "<h4 style='color: red;'>❌ Erro ao adicionar membro</h4>";
        }
    }

    // 5. Listar todos os membros da tarefa
    echo "<h2>Todos os membros da tarefa:</h2>";
    $stmt = $pdo->prepare("
        SELECT tm.*, u.nome, u.email
        FROM tarefas_membros tm
        INNER JOIN usuarios u ON tm.usuario_id = u.id
        WHERE tm.tarefa_id = ?
    ");
    $stmt->execute([$tarefa['id']]);
    $todosMembros = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($todosMembros)) {
        echo "<p style='color: red;'>Nenhum membro na tabela</p>";
    } else {
        echo "<table border='1' cellpadding='10'>";
        echo "<tr><th>ID</th><th>Usuário</th><th>Email</th><th>Papel</th><th>Criado em</th></tr>";
        foreach ($todosMembros as $membro) {
            echo "<tr>";
            echo "<td>{$membro['id']}</td>";
            echo "<td>{$membro['nome']}</td>";
            echo "<td>{$membro['email']}</td>";
            echo "<td>{$membro['papel']}</td>";
            echo "<td>{$membro['criado_em']}</td>";
            echo "</tr>";
        }
        echo "</table>";
    }

    echo "<hr>";
    echo "<h2>Agora teste novamente: faça login como TESTER e veja se a tarefa aparece!</h2>";
    echo "<p>Email: {$tester['email']}</p>";

} catch (PDOException $e) {
    echo "<h1 style='color: red;'>Erro: " . $e->getMessage() . "</h1>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>
