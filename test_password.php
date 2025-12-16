<?php
// Script para testar senha e gerar hash

$senha_texto = 'admin123';
$senha_hash_banco = '$2y$10$32XUNpkQOrOi025yMoYe4oIlC9agd2Z/Uog9lIC9sysM2Ye9aEe9G';

echo "=== TESTE DE SENHA ===\n\n";

// Gerar novo hash
$novo_hash = password_hash($senha_texto, PASSWORD_BCRYPT);
echo "Senha: $senha_texto\n";
echo "Novo hash: $novo_hash\n\n";

// Verificar se a senha bate com o hash do banco
$verifica = password_verify($senha_texto, $senha_hash_banco);
echo "Hash do banco: $senha_hash_banco\n";
echo "Senha '$senha_texto' bate com hash do banco? " . ($verifica ? "SIM" : "NÃO") . "\n\n";

// Testar outras senhas comuns
$senhas_testar = ['admin', '123456', 'Admin123', 'admin@123'];
echo "=== TESTANDO OUTRAS SENHAS ===\n";
foreach ($senhas_testar as $s) {
    $v = password_verify($s, $senha_hash_banco);
    echo "Senha '$s': " . ($v ? "✓ BATE" : "✗ não bate") . "\n";
}
