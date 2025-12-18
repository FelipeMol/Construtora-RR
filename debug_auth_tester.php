<?php
/**
 * Debug: Verificar autenticação do TESTER
 */

require_once 'config.php';

header('Content-Type: text/html; charset=UTF-8');

echo "<h1>🔐 Debug: Autenticação do TESTER</h1>";

// 1. Verificar se TESTER existe
echo "<h2>1. Verificar usuário TESTER</h2>";
$stmt = $pdo->prepare("SELECT * FROM usuarios WHERE id = 4");
$stmt->execute();
$tester = $stmt->fetch(PDO::FETCH_ASSOC);

if ($tester) {
    echo "<p style='color: green;'>✅ Usuário TESTER encontrado</p>";
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>Campo</th><th>Valor</th></tr>";
    foreach ($tester as $campo => $valor) {
        if ($campo === 'senha') {
            echo "<tr><td><strong>{$campo}</strong></td><td>[OCULTO]</td></tr>";
        } else {
            echo "<tr><td><strong>{$campo}</strong></td><td>{$valor}</td></tr>";
        }
    }
    echo "</table>";
} else {
    echo "<p style='color: red;'>❌ Usuário TESTER não encontrado!</p>";
    exit;
}

// 2. Verificar permissões
echo "<h2>2. Permissões do TESTER</h2>";
$stmt = $pdo->prepare("
    SELECT p.*, m.nome as modulo_nome
    FROM permissoes_usuarios p
    LEFT JOIN modulos m ON p.modulo_id = m.id
    WHERE p.usuario_id = 4
");
$stmt->execute();
$permissoes = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($permissoes)) {
    echo "<p style='color: orange;'>⚠️ TESTER não tem permissões específicas (vai usar permissões do tipo de usuário)</p>";
} else {
    echo "<table border='1' cellpadding='10'>";
    echo "<tr><th>Módulo</th><th>Visualizar</th><th>Criar</th><th>Editar</th><th>Excluir</th></tr>";
    foreach ($permissoes as $perm) {
        echo "<tr>";
        echo "<td>{$perm['modulo_nome']}</td>";
        echo "<td>" . ($perm['pode_visualizar'] ? '✅' : '❌') . "</td>";
        echo "<td>" . ($perm['pode_criar'] ? '✅' : '❌') . "</td>";
        echo "<td>" . ($perm['pode_editar'] ? '✅' : '❌') . "</td>";
        echo "<td>" . ($perm['pode_excluir'] ? '✅' : '❌') . "</td>";
        echo "</tr>";
    }
    echo "</table>";
}

// 3. Simular login e gerar token
echo "<h2>3. Simular login do TESTER</h2>";

if (function_exists('gerar_jwt')) {
    $payload = [
        'id' => $tester['id'],
        'email' => $tester['email'],
        'nome' => $tester['nome'],
        'tipo' => $tester['tipo']
    ];

    $token = gerar_jwt($payload);

    echo "<p style='color: green;'>✅ Token JWT gerado com sucesso!</p>";
    echo "<p><strong>Token:</strong></p>";
    echo "<textarea style='width: 100%; height: 100px; font-family: monospace;'>{$token}</textarea>";

    // Validar token
    $usuarioValidado = validar_jwt($token);

    if ($usuarioValidado) {
        echo "<p style='color: green;'>✅ Token validado com sucesso!</p>";
        echo "<pre>" . print_r($usuarioValidado, true) . "</pre>";
    } else {
        echo "<p style='color: red;'>❌ Erro ao validar token!</p>";
    }
} else {
    echo "<p style='color: orange;'>⚠️ Função gerar_jwt() não encontrada</p>";
}

// 4. Testar chamada à API de tarefas
echo "<h2>4. Testar chamada à API de tarefas</h2>";
echo "<p>Use este token no header Authorization:</p>";
echo "<code>Authorization: Bearer {$token}</code>";

echo "<h3>Teste via cURL:</h3>";
echo "<pre>";
echo "curl -X GET 'http://localhost/api_tarefas.php' \\\n";
echo "  -H 'Authorization: Bearer {$token}' \\\n";
echo "  -H 'Content-Type: application/json'";
echo "</pre>";

// 5. Fazer chamada direta à API (simulando)
echo "<h2>5. Simulação de chamada direta</h2>";

// Simular headers
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['HTTP_AUTHORIZATION'] = "Bearer {$token}";

echo "<p>Fazendo chamada GET /api_tarefas.php...</p>";
echo "<p><a href='debug_query_tarefas.php' target='_blank'>→ Ver resultado da query SQL</a></p>";

?>
