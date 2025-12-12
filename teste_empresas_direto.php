<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Teste de API Empresas</h1>";

try {
    require_once 'config.php';
    echo "<p style='color: green;'>✅ Config.php carregado</p>";
    
    echo "<h2>Teste 1: Listar Empresas (GET)</h2>";
    $stmt = $pdo->query("SELECT * FROM empresas ORDER BY nome ASC");
    $empresas = $stmt->fetchAll();
    echo "<p style='color: green;'>✅ Query executada: " . count($empresas) . " empresas encontradas</p>";
    echo "<pre>" . print_r($empresas, true) . "</pre>";
    
    echo "<h2>Teste 2: Adicionar Empresa (POST)</h2>";
    $dados = [
        'nome' => 'Teste API',
        'cnpj' => '12.345.678/0001-90',
        'tipo' => 'Construtora'
    ];
    
    $nome = htmlspecialchars(strip_tags(trim($dados['nome'])), ENT_QUOTES, 'UTF-8');
    $cnpj = htmlspecialchars(strip_tags(trim($dados['cnpj'])), ENT_QUOTES, 'UTF-8');
    $tipo = htmlspecialchars(strip_tags(trim($dados['tipo'])), ENT_QUOTES, 'UTF-8');
    
    echo "<p>Dados: nome=$nome, cnpj=$cnpj, tipo=$tipo</p>";
    
    $stmt = $pdo->prepare("INSERT INTO empresas (nome, cnpj, tipo, criado_em) VALUES (?, ?, ?, NOW())");
    $stmt->execute([$nome, $cnpj, $tipo]);
    $id = $pdo->lastInsertId();
    
    echo "<p style='color: green;'>✅ Empresa inserida com ID: $id</p>";
    
    // Deletar o teste
    $stmt = $pdo->prepare("DELETE FROM empresas WHERE id = ?");
    $stmt->execute([$id]);
    echo "<p>Teste deletado</p>";
    
    echo "<h2>Teste 3: Carregar api_empresas.php</h2>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Erro: " . $e->getMessage() . "</p>";
    echo "<pre>" . $e->getTraceAsString() . "</pre>";
}
?>
