<?php
/**
 * Debug: Simular a query exata que a API faz para o TESTER
 */

require_once 'config.php';

header('Content-Type: text/html; charset=UTF-8');

try {
    // Simular usuário TESTER
    $usuario_id = 4; // ID do TESTER
    $ehAdmin = false; // TESTER não é admin

    echo "<h1>🔍 Debug: Query de Tarefas para TESTER (ID: {$usuario_id})</h1>";

    // Query EXATA do api_tarefas.php (linhas 100-184)
    $sql = "
        SELECT
            t.*,
            f.nome as funcionario_nome,
            o.nome as obra_nome,
            e.nome as empresa_nome,
            uc.nome as criado_por_nome,
            ur.nome as usuario_responsavel_nome,
            ur.email as usuario_responsavel_email,
            ur.tipo as usuario_responsavel_tipo,
            (SELECT COUNT(*) FROM tarefas_comentarios tc WHERE tc.tarefa_id = t.id) as comentarios_count
        FROM tarefas t
        LEFT JOIN funcionarios f ON t.funcionario_id = f.id
        LEFT JOIN obras o ON t.obra_id = o.id
        LEFT JOIN empresas e ON t.empresa_id = e.id
        LEFT JOIN usuarios uc ON t.criado_por = uc.id
        LEFT JOIN usuarios ur ON t.usuario_responsavel_id = ur.id
    ";

    $where = [];
    $params = [];

    // Non-admin: ver apenas tarefas onde é responsável, criador ou membro
    if (!$ehAdmin) {
        $where[] = "(
            t.usuario_responsavel_id = :usuario_id
            OR t.criado_por = :usuario_id
            OR EXISTS (SELECT 1 FROM tarefas_membros tm WHERE tm.tarefa_id = t.id AND tm.usuario_id = :usuario_id)
        )";
        $params[':usuario_id'] = $usuario_id;
    }

    // Aplicar filtros WHERE
    if (count($where) > 0) {
        $sql .= " WHERE " . implode(' AND ', $where);
    }

    // Ordenação
    $sql .= " ORDER BY
        CASE t.prioridade
            WHEN 'urgente' THEN 1
            WHEN 'alta' THEN 2
            WHEN 'media' THEN 3
            WHEN 'baixa' THEN 4
        END,
        t.data_prazo IS NULL ASC,
        t.data_prazo ASC,
        t.criado_em DESC
    ";

    echo "<h2>📝 Query SQL:</h2>";
    echo "<pre>" . htmlspecialchars($sql) . "</pre>";

    echo "<h2>🔢 Parâmetros:</h2>";
    echo "<pre>" . print_r($params, true) . "</pre>";

    // Executar query
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $tarefas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<h2>📊 Resultado: " . count($tarefas) . " tarefas encontradas</h2>";

    if (empty($tarefas)) {
        echo "<div style='background: #fee; padding: 20px; border: 2px solid red; margin: 20px 0;'>";
        echo "<h3 style='color: red;'>❌ PROBLEMA: Nenhuma tarefa encontrada!</h3>";
        echo "<p>Vamos verificar cada condição da query WHERE...</p>";
        echo "</div>";

        // Verificar cada condição separadamente
        echo "<h3>🔍 Verificando condição 1: usuario_responsavel_id</h3>";
        $stmt = $pdo->prepare("SELECT id, titulo, usuario_responsavel_id FROM tarefas WHERE usuario_responsavel_id = ?");
        $stmt->execute([$usuario_id]);
        $tarefas1 = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<p>Tarefas onde TESTER é responsável: <strong>" . count($tarefas1) . "</strong></p>";
        if (!empty($tarefas1)) {
            echo "<pre>" . print_r($tarefas1, true) . "</pre>";
        }

        echo "<h3>🔍 Verificando condição 2: criado_por</h3>";
        $stmt = $pdo->prepare("SELECT id, titulo, criado_por FROM tarefas WHERE criado_por = ?");
        $stmt->execute([$usuario_id]);
        $tarefas2 = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<p>Tarefas criadas pelo TESTER: <strong>" . count($tarefas2) . "</strong></p>";
        if (!empty($tarefas2)) {
            echo "<pre>" . print_r($tarefas2, true) . "</pre>";
        }

        echo "<h3>🔍 Verificando condição 3: membros</h3>";
        $stmt = $pdo->prepare("
            SELECT t.id, t.titulo, tm.usuario_id
            FROM tarefas t
            INNER JOIN tarefas_membros tm ON tm.tarefa_id = t.id
            WHERE tm.usuario_id = ?
        ");
        $stmt->execute([$usuario_id]);
        $tarefas3 = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "<p>Tarefas onde TESTER é membro: <strong>" . count($tarefas3) . "</strong></p>";
        if (!empty($tarefas3)) {
            echo "<pre>" . print_r($tarefas3, true) . "</pre>";
        }

        // Verificar se tarefa "teste" existe
        echo "<h3>🔍 Verificando tarefa 'teste' (ID: 9)</h3>";
        $stmt = $pdo->prepare("SELECT * FROM tarefas WHERE id = 9");
        $stmt->execute();
        $tarefaTeste = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($tarefaTeste) {
            echo "<p style='color: green;'>✅ Tarefa existe no banco!</p>";
            echo "<table border='1' cellpadding='10'>";
            echo "<tr><th>Campo</th><th>Valor</th></tr>";
            foreach ($tarefaTeste as $campo => $valor) {
                echo "<tr><td><strong>{$campo}</strong></td><td>{$valor}</td></tr>";
            }
            echo "</table>";
        } else {
            echo "<p style='color: red;'>❌ Tarefa ID 9 não existe!</p>";
        }

    } else {
        echo "<div style='background: #efe; padding: 20px; border: 2px solid green; margin: 20px 0;'>";
        echo "<h3 style='color: green;'>✅ Tarefas encontradas!</h3>";
        echo "</div>";

        echo "<table border='1' cellpadding='10' style='width: 100%;'>";
        echo "<tr>";
        echo "<th>ID</th><th>Título</th><th>Status</th><th>Responsável</th><th>Criado por</th>";
        echo "</tr>";
        foreach ($tarefas as $tarefa) {
            echo "<tr>";
            echo "<td>{$tarefa['id']}</td>";
            echo "<td>{$tarefa['titulo']}</td>";
            echo "<td>{$tarefa['status']}</td>";
            echo "<td>{$tarefa['usuario_responsavel_nome']} (ID: {$tarefa['usuario_responsavel_id']})</td>";
            echo "<td>{$tarefa['criado_por_nome']} (ID: {$tarefa['criado_por']})</td>";
            echo "</tr>";
        }
        echo "</table>";
    }

} catch (PDOException $e) {
    echo "<h1 style='color: red;'>Erro: " . $e->getMessage() . "</h1>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>
