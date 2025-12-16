<?php
// Script de teste de banco de dados e usuários

$host = 'localhost';
$dbname = 'hg253b74_controleobras';
$username = 'hg253b74_Felipe';
$password = 'Warning81#';

echo "=== TESTE DE CONEXÃO E USUÁRIOS ===\n\n";

try {
    // Conectar
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );

    echo "✓ Conexão estabelecida com sucesso!\n\n";

    // Listar usuários
    echo "=== USUÁRIOS NO BANCO ===\n";
    $stmt = $pdo->query("SELECT id, nome, usuario, email, senha, tipo, ativo FROM usuarios");
    $usuarios = $stmt->fetchAll();

    foreach ($usuarios as $u) {
        echo "\n";
        echo "ID: {$u['id']}\n";
        echo "Nome: {$u['nome']}\n";
        echo "Usuário: {$u['usuario']}\n";
        echo "Email: {$u['email']}\n";
        echo "Tipo: {$u['tipo']}\n";
        echo "Ativo: {$u['ativo']}\n";
        echo "Hash: {$u['senha']}\n";
        echo str_repeat('-', 60) . "\n";
    }

    echo "\n=== TESTE DE SENHAS ===\n\n";

    $senhas_testar = [
        'admin123',
        'admin',
        '123456',
        'Admin123',
        'password'
    ];

    foreach ($usuarios as $u) {
        echo "Usuário: {$u['usuario']}\n";
        foreach ($senhas_testar as $senha) {
            $verifica = password_verify($senha, $u['senha']);
            $status = $verifica ? "✓ FUNCIONA" : "✗ não funciona";
            echo "  Senha '$senha': $status\n";
        }
        echo "\n";
    }

} catch (PDOException $e) {
    echo "✗ Erro de conexão: " . $e->getMessage() . "\n";
    exit(1);
}
