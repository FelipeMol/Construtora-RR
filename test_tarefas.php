<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'config.php';

echo "=== TESTE API TAREFAS ===<br><br>";

// Simular token
$token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibm9tZSI6IkFkbWluaXN0cmFkb3IgU2lzdGVtYSIsImVtYWlsIjoiYWRtaW5Adml2aWNvbnRyb2xkZW9icmFzLmNvbS5iciIsInRpcG8iOiJhZG1pbiIsInRva2VuX3ZlcnNhbyI6MCwiaWF0IjoxNzY1ODQ5OTc5LCJleHAiOjE3NjU4Nzg3Nzl9.XLb_ogNpyyj0lcfbBnMFH8-iLrJI069dcb5DriiGYJQ';

echo "1. Validando token...<br>";
$usuario = validar_jwt($token);
if ($usuario) {
    echo "✓ Token válido<br>";
    echo "Usuario ID: " . $usuario['id'] . "<br>";
    echo "Usuario Nome: " . $usuario['nome'] . "<br><br>";
} else {
    echo "✗ Token inválido<br><br>";
    die();
}

echo "2. Verificando função obter_permissoes_usuario...<br>";
if (function_exists('obter_permissoes_usuario')) {
    echo "✓ Função existe<br><br>";
} else {
    echo "✗ Função NÃO existe<br><br>";
    die('ERRO: Função obter_permissoes_usuario não foi encontrada!');
}

echo "3. Obtendo permissões do usuário...<br>";
try {
    $permissoes = obter_permissoes_usuario($pdo, $usuario['id']);
    echo "✓ Permissões obtidas: " . count($permissoes) . " módulos<br>";
    echo "<pre>";
    print_r($permissoes);
    echo "</pre><br>";
} catch (Exception $e) {
    echo "✗ ERRO ao obter permissões: " . $e->getMessage() . "<br><br>";
    die();
}

echo "4. Verificando função tem_permissao...<br>";
if (function_exists('tem_permissao')) {
    echo "✓ Função existe<br><br>";
} else {
    echo "✗ Função NÃO existe<br><br>";
    die();
}

echo "5. Verificando permissão 'tarefas' -> 'pode_visualizar'...<br>";
$temPermissao = tem_permissao($permissoes, 'tarefas', 'pode_visualizar');
echo ($temPermissao ? "✓" : "✗") . " Tem permissão: " . ($temPermissao ? 'SIM' : 'NÃO') . "<br><br>";

echo "6. Testando query de tarefas...<br>";
try {
    $sql = "
        SELECT
            t.*,
            f.nome as funcionario_nome,
            o.nome as obra_nome,
            e.nome as empresa_nome,
            uc.nome as criado_por_nome,
            (SELECT COUNT(*) FROM tarefas_comentarios tc WHERE tc.tarefa_id = t.id) as comentarios_count
        FROM tarefas t
        LEFT JOIN funcionarios f ON t.funcionario_id = f.id
        LEFT JOIN obras o ON t.obra_id = o.id
        LEFT JOIN empresas e ON t.empresa_id = e.id
        LEFT JOIN usuarios uc ON t.criado_por = uc.id
        LIMIT 5
    ";

    $stmt = $pdo->prepare($sql);
    $stmt->execute();
    $tarefas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "✓ Query executada com sucesso<br>";
    echo "Total de tarefas: " . count($tarefas) . "<br>";

} catch (Exception $e) {
    echo "✗ ERRO na query: " . $e->getMessage() . "<br>";
}

echo "<br>=== FIM DO TESTE ===";
?>
