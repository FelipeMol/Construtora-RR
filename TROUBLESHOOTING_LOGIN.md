# 🔧 Troubleshooting - Problemas de Login

## Problemas Identificados

### 1. ✅ Modal de Login no Canto da Tela (CORRIGIDO)

**Problema:** O modal de login estava aparecendo no canto da tela ao invés de centralizado.

**Causa:** Conflito de múltiplas definições CSS para `.modal` no arquivo [styles.css](styles.css).

**Solução Aplicada:**
- Atualizado CSS em [styles.css:4819](styles.css#L4819) para forçar `display: flex !important`
- Adicionado `backdrop-filter: blur(8px)` para melhor efeito visual

### 2. ⚠️ Problema de Autenticação

**Problema:** Não consegue fazer login com credenciais `admin / admin123`.

**Possíveis Causas:**

#### A. Hash de senha incorreto no banco
O hash da senha no banco pode não corresponder à senha esperada.

**Como verificar:**
```bash
# Acessar o servidor e executar:
php test_db_users.php
```

Este script irá:
- ✅ Testar conexão com banco
- 📋 Listar todos os usuários
- 🔑 Testar várias senhas contra os hashes

#### B. Usuário não existe ou está inativo
**Como verificar:**
- Acessar phpMyAdmin no cPanel
- Navegar para tabela `usuarios`
- Verificar se existe registro com `usuario = 'admin'`
- Verificar se campo `ativo = 'Sim'`

## 🔧 Soluções

### Solução 1: Resetar Senha do Admin

Execute o script de atualização:

```bash
php update_admin_password.php
```

Este script irá:
1. ✅ Verificar se usuário `admin` existe
2. 🔄 Atualizar senha para `admin123` (hash bcrypt)
3. ✅ Garantir que usuário está ativo
4. ✅ Resetar `token_versao` para 0
5. 🧪 Testar se a senha funciona

**Credenciais após execução:**
- **Usuário:** `admin`
- **Senha:** `admin123`

### Solução 2: Verificar Logs

Os logs de autenticação foram adicionados em [api_auth.php](api_auth.php).

**Como verificar logs:**
```bash
# No servidor HostGator:
tail -f php_errors.log

# Procurar por linhas como:
# Tentativa de login - Usuário: admin
# Login falhou - Usuário não encontrado: admin
# Verificação de senha - Usuário: admin, Senha válida: SIM/NÃO
```

### Solução 3: Criar Novo Usuário Manualmente

Se preferir criar manualmente via phpMyAdmin:

```sql
-- Gerar hash (executar no PHP):
-- password_hash('admin123', PASSWORD_BCRYPT);

INSERT INTO usuarios (nome, usuario, email, senha, tipo, ativo, token_versao)
VALUES (
    'Administrador Sistema',
    'admin',
    'admin@vivicontroledeobras.com.br',
    '$2y$10$SEU_HASH_AQUI',
    'admin',
    'Sim',
    0
);
```

## 📊 Debugging no Console do Navegador

1. Abrir DevTools (F12)
2. Ir na aba **Console**
3. Tentar fazer login
4. Verificar mensagens de erro

**Mensagens esperadas:**
```
0️⃣ Verificando autenticação...
❌ Não autenticado - mostrando tela de login
```

**Após tentar login:**
- ✅ Sucesso: `Login realizado com sucesso!` → Recarrega a página
- ❌ Erro: Mensagem de erro em vermelho

## 🔍 Verificar API Manualmente

Use o console do navegador para testar a API diretamente:

```javascript
// Testar login
fetch('api_auth.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        acao: 'login',
        usuario: 'admin',
        senha: 'admin123'
    })
})
.then(r => r.json())
.then(data => console.log('Resposta:', data))
.catch(e => console.error('Erro:', e));
```

**Resposta esperada (sucesso):**
```json
{
    "sucesso": true,
    "dados": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        "usuario": {
            "id": 1,
            "nome": "Administrador Sistema",
            "email": "admin@vivicontroledeobras.com.br",
            "tipo": "admin",
            "primeiro_acesso": false
        },
        "permissoes": [],
        "expira_em": 28800
    },
    "mensagem": "Login realizado com sucesso"
}
```

**Resposta esperada (erro):**
```json
{
    "sucesso": false,
    "dados": null,
    "mensagem": "Usuário ou senha incorretos"
}
```

## 🚀 Próximos Passos

1. **Execute o script de reset de senha:**
   ```bash
   php update_admin_password.php
   ```

2. **Limpe o cache do navegador:**
   - Ctrl + F5 (Windows/Linux)
   - Cmd + Shift + R (Mac)

3. **Tente fazer login novamente:**
   - Usuário: `admin`
   - Senha: `admin123`

4. **Verifique os logs:**
   - Abra DevTools (F12)
   - Vá na aba Console
   - Observe as mensagens

## 📝 Arquivos Relacionados

- [api_auth.php](api_auth.php) - API de autenticação (com logging adicionado)
- [js/modules/auth.js](js/modules/auth.js) - Módulo de autenticação frontend
- [js/app.js](js/app.js) - Entry point da aplicação
- [styles.css](styles.css#L4804) - Estilos do modal de login
- [config.php](config.php) - Configuração do banco e JWT

## 🆘 Se Ainda Não Funcionar

1. Verifique se está usando a versão refatorada:
   - Em [index.html](index.html), deve ter: `<script type="module" src="js/app.js"></script>`

2. Verifique credenciais do banco em [config.php](config.php#L23-L26):
   ```php
   $host = 'localhost';
   $dbname = 'hg253b74_controleobras';
   $username = 'hg253b74_Felipe';
   $password = 'Warning81#';
   ```

3. Teste conexão direta com banco via phpMyAdmin

4. Verifique se tabela `usuarios` existe:
   ```sql
   SHOW TABLES LIKE 'usuarios';
   SELECT * FROM usuarios;
   ```

## 💡 Dica Rápida

Para testar rapidamente se o hash está correto:

```bash
# No servidor:
php -r "echo password_verify('admin123', '\$2y\$10\$32XUNpkQOrOi025yMoYe4oIlC9agd2Z/Uog9lIC9sysM2Ye9aEe9G') ? 'OK' : 'FALHOU';"
```

Substitua o hash pelo que está no banco de dados.
