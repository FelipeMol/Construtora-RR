<?php
/**
 * Debug: Ver quais tarefas o TESTER deveria ver
 */

require_once 'config.php';

header('Content-Type: text/html; charset=UTF-8');

$tester_id = 4;

echo "<h1>🔍 Tarefas que o TESTER (ID: {$tester_id}) deveria ver</h1>";

try {
    // Buscar TODAS as tarefas
    $stmt = $pdo->query("SELECT id, titulo, status, usuario_responsavel_id, criado_por FROM tarefas ORDER BY id");
    $todasTarefas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<h2>Todas as tarefas no banco:</h2>";
    echo "<table border='1' cellpadding='10' style='width: 100%;'>";
    echo "<tr>";
    echo "<th>ID</th><th>Título</th><th>Status</th>";
    echo "<th>Responsável ID</th><th>Criado por ID</th>";
    echo "<th>✅ TESTER é responsável?</th>";
    echo "<th>✅ TESTER criou?</th>";
    echo "<th>✅ TESTER é membro?</th>";
    echo "<th><strong>DEVE VER?</strong></th>";
    echo "</tr>";

    foreach ($todasTarefas as $tarefa) {
        $ehResponsavel = ($tarefa['usuario_responsavel_id'] == $tester_id);
        $criou = ($tarefa['criado_por'] == $tester_id);

        // Verificar se é membro
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM tarefas_membros WHERE tarefa_id = ? AND usuario_id = ?");
        $stmt->execute([$tarefa['id'], $tester_id]);
        $ehMembro = $stmt->fetchColumn() > 0;

        $deveVer = $ehResponsavel || $criou || $ehMembro;

        echo "<tr style='background: " . ($deveVer ? '#e8f5e9' : '#ffebee') . ";'>";
        echo "<td>{$tarefa['id']}</td>";
        echo "<td><strong>{$tarefa['titulo']}</strong></td>";
        echo "<td>{$tarefa['status']}</td>";
        echo "<td>{$tarefa['usuario_responsavel_id']}</td>";
        echo "<td>{$tarefa['criado_por']}</td>";
        echo "<td>" . ($ehResponsavel ? '✅ SIM' : '❌ NÃO') . "</td>";
        echo "<td>" . ($criou ? '✅ SIM' : '❌ NÃO') . "</td>";
        echo "<td>" . ($ehMembro ? '✅ SIM' : '❌ NÃO') . "</td>";
        echo "<td><strong>" . ($deveVer ? '✅ SIM' : '❌ NÃO') . "</strong></td>";
        echo "</tr>";
    }
    echo "</table>";

    // Resumo
    echo "<h2>📊 Resumo:</h2>";
    $stmt = $pdo->prepare("
        SELECT COUNT(*) FROM tarefas
        WHERE usuario_responsavel_id = ? OR criado_por = ?
    ");
    $stmt->execute([$tester_id, $tester_id]);
    $countResponsavelOuCriador = $stmt->fetchColumn();

    $stmt = $pdo->prepare("
        SELECT COUNT(DISTINCT tarefa_id) FROM tarefas_membros WHERE usuario_id = ?
    ");
    $stmt->execute([$tester_id]);
    $countMembro = $stmt->fetchColumn();

    echo "<ul>";
    echo "<li>Tarefas onde TESTER é <strong>responsável ou criador</strong>: {$countResponsavelOuCriador}</li>";
    echo "<li>Tarefas onde TESTER é <strong>membro</strong>: {$countMembro}</li>";
    echo "</ul>";

    // Listar membros de cada tarefa
    echo "<h2>👥 Membros de cada tarefa:</h2>";
    foreach ($todasTarefas as $tarefa) {
        echo "<h3>Tarefa #{$tarefa['id']}: {$tarefa['titulo']}</h3>";

        $stmt = $pdo->prepare("
            SELECT tm.*, u.nome, u.email
            FROM tarefas_membros tm
            INNER JOIN usuarios u ON tm.usuario_id = u.id
            WHERE tm.tarefa_id = ?
        ");
        $stmt->execute([$tarefa['id']]);
        $membros = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($membros)) {
            echo "<p style='color: gray;'>Sem membros na tabela tarefas_membros</p>";
        } else {
            echo "<table border='1' cellpadding='5'>";
            echo "<tr><th>Usuário</th><th>Email</th><th>Papel</th></tr>";
            foreach ($membros as $membro) {
                $destaque = ($membro['usuario_id'] == $tester_id) ? "style='background: yellow; font-weight: bold;'" : "";
                echo "<tr {$destaque}>";
                echo "<td>{$membro['nome']}</td>";
                echo "<td>{$membro['email']}</td>";
                echo "<td>{$membro['papel']}</td>";
                echo "</tr>";
            }
            echo "</table>";
        }
    }

    // Testar a query final
    echo "<hr>";
    echo "<h2>🔍 Query final (como no api_tarefas.php):</h2>";

    $sql = "
        SELECT t.id, t.titulo, t.status
        FROM tarefas t
        WHERE (
            t.usuario_responsavel_id = :usuario_id_resp
            OR t.criado_por = :usuario_id_criador
            OR EXISTS (SELECT 1 FROM tarefas_membros tm WHERE tm.tarefa_id = t.id AND tm.usuario_id = :usuario_id_membro)
        )
        ORDER BY t.id
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':usuario_id_resp' => $tester_id,
        ':usuario_id_criador' => $tester_id,
        ':usuario_id_membro' => $tester_id
    ]);
    $tarefasRetornadas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "<p><strong>Tarefas retornadas pela query:</strong> " . count($tarefasRetornadas) . "</p>";
    echo "<ul>";
    foreach ($tarefasRetornadas as $t) {
        echo "<li>ID {$t['id']}: {$t['titulo']} ({$t['status']})</li>";
    }
    echo "</ul>";

} catch (PDOException $e) {
    echo "<h1 style='color: red;'>Erro: " . $e->getMessage() . "</h1>";
}
?>
