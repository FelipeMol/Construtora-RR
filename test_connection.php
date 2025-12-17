<?php
// Script para descobrir informações de conexão MySQL

header('Content-Type: text/plain; charset=utf-8');

echo "=== TESTE DE CONEXÃO MYSQL ===\n\n";

// Credenciais do config.php
$host = 'localhost'; // HostGator usa localhost internamente
$dbname = 'hg253b74_controleobras';
$username = 'hg253b74_Felipe';
$password = 'Warning81#';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    echo "✓ Conexão bem-sucedida!\n\n";

    // Descobrir o host real
    $stmt = $pdo->query("SELECT @@hostname as hostname, @@port as port");
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    echo "Informações do servidor MySQL:\n";
    echo "- Hostname: " . $info['hostname'] . "\n";
    echo "- Porta: " . $info['port'] . "\n";

    // Informações adicionais
    $stmt = $pdo->query("SHOW VARIABLES LIKE 'bind_address'");
    $bind = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "- Bind Address: " . $bind['Value'] . "\n";

    // Listar tabelas
    echo "\nTabelas no banco:\n";
    $stmt = $pdo->query("SHOW TABLES");
    while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        echo "  - " . $row[0] . "\n";
    }

} catch (PDOException $e) {
    echo "✗ Erro na conexão: " . $e->getMessage() . "\n";
}
?>
