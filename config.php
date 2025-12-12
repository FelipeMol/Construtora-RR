<?php
// Produção: não exibir erros no output para preservar JSON limpo
ini_set('display_errors', 0);
ini_set('display_startup_errors', 0);
error_reporting(E_ALL);

// Registrar erros em log (ajuste caminho conforme hospedagem)
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/php_errors.log');

// Handler que evita imprimir HTML de warnings/notices
set_error_handler(function ($severity, $message, $file, $line) {
    // Loga e evita echo automático de erros, mantendo resposta JSON intacta
    error_log("[PHP:$severity] $message in $file on line $line");
    // Retorna true para impedir o handler padrão de exibir o erro
    return true;
});
// ========================================
// CONFIGURAÇÃO BANCO DE DADOS - HOSTGATOR
// ========================================

// ATENÇÃO: Configure estas variáveis no HostGator
$host = 'localhost';
$dbname = 'hg253b74_controleobras'; // Altere para o nome do seu banco
$username = 'hg253b74_Felipe';     // Altere para seu usuário
$password = 'Warning81#';       // Altere para sua senha

// Headers para permitir requisições AJAX (apenas para APIs)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
// Mantém JSON como padrão das APIs; páginas HTML não devem incluir este arquivo
header('Content-Type: application/json; charset=UTF-8');

// Responder a requisições OPTIONS (preflight CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Conectar ao banco MySQL
try {
    $pdo = new PDO(
        "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
    
} catch (PDOException $e) {
    // Retornar erro em formato JSON
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'mensagem' => 'Erro de conexão com banco de dados',
        'erro' => $e->getMessage(),
        'dsn' => "mysql:host={$host};dbname={$dbname};charset=utf8mb4",
        'usuario' => $username
    ]);
    exit();
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

// Função para retornar resposta JSON padronizada
function resposta_json($sucesso, $dados = null, $mensagem = '') {
    echo json_encode([
        'sucesso' => $sucesso,
        'dados' => $dados,
        'mensagem' => $mensagem,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

// Função para sanitizar dados de entrada
function sanitizar($valor) {
    if (is_null($valor)) return null;
    return htmlspecialchars(strip_tags(trim($valor)), ENT_QUOTES, 'UTF-8');
}

// Função para validar método HTTP
function validar_metodo($metodo_esperado) {
    if ($_SERVER['REQUEST_METHOD'] !== $metodo_esperado) {
        resposta_json(false, null, "Método {$metodo_esperado} esperado");
    }
}

// Função para obter dados JSON do POST
function obter_dados_post() {
    $input = file_get_contents('php://input');
    $dados = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        resposta_json(false, null, 'Dados JSON inválidos');
    }
    
    return $dados ?: [];
}

// Importante: sem tag de fechamento PHP para evitar espaços/BOM que quebram headers
