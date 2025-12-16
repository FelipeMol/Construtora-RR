<?php
/**
 * Script para atualizar senha do administrador
 * Execute este script UMA VEZ para resetar a senha do admin
 */

require_once __DIR__ . '/config.php';

echo "=== ATUALIZAÇÃO DE SENHA DO ADMIN ===\n\n";

try {
    // Definir senha
    $nova_senha = 'admin123';
    $senha_hash = password_hash($nova_senha, PASSWORD_BCRYPT);

    echo "Nova senha: $nova_senha\n";
    echo "Hash gerado: $senha_hash\n\n";

    // Verificar se usuário admin existe
    $stmt = $pdo->prepare("SELECT id, usuario FROM usuarios WHERE usuario = 'admin'");
    $stmt->execute();
    $admin = $stmt->fetch();

    if ($admin) {
        echo "✓ Usuário admin encontrado (ID: {$admin['id']})\n";
        echo "Atualizando senha...\n";

        // Atualizar senha
        $stmt = $pdo->prepare("
            UPDATE usuarios
            SET senha = ?,
                ativo = 1,
                tipo = 'admin',
                token_versao = 0
            WHERE usuario = 'admin'
        ");
        $stmt->execute([$senha_hash]);

        echo "✓ Senha atualizada com sucesso!\n\n";

    } else {
        echo "✗ Usuário admin não encontrado. Criando...\n";

        // Criar usuário admin
        $stmt = $pdo->prepare("
            INSERT INTO usuarios (nome, usuario, email, senha, tipo, ativo, token_versao)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            'Administrador Sistema',
            'admin',
            'admin@vivicontroledeobras.com.br',
            $senha_hash,
            'admin',
            'Sim',
            0
        ]);

        echo "✓ Usuário admin criado com sucesso!\n\n";
    }

    // Testar login
    echo "=== TESTE DE LOGIN ===\n";
    $stmt = $pdo->prepare("SELECT senha FROM usuarios WHERE usuario = 'admin'");
    $stmt->execute();
    $admin = $stmt->fetch();

    $teste = password_verify($nova_senha, $admin['senha']);
    echo "Senha '$nova_senha' funciona? " . ($teste ? "✓ SIM" : "✗ NÃO") . "\n\n";

    echo "=== CREDENCIAIS ===\n";
    echo "Usuário: admin\n";
    echo "Senha: admin123\n";

} catch (PDOException $e) {
    echo "✗ Erro: " . $e->getMessage() . "\n";
}
