# 🚀 Guia Completo de Instalação no HostGator

## 📋 Pré-requisitos
- Conta HostGator ativa (plano Start ou superior)
- Acesso ao painel cPanel
- Domínio configurado (opcional)

## 📁 Estrutura de Arquivos para Upload
```
public_html/
├── controle-obras.html (arquivo principal)
├── styles.css
├── script.js (será modificado)
├── config.php
├── api_usuarios.php
├── api_funcionarios.php
├── api_obras.php
├── api_empresas.php
├── api_lancamentos.php
├── logout.php
└── database.sql (apenas para referência)
```

## 🗄️ Passo 1: Configurar Banco de Dados MySQL

### 1.1 Criar Banco de Dados
1. Acesse o **cPanel** da sua conta HostGator
2. Clique em **"MySQL Databases"**
3. Em "Create New Database", digite: `controleobras`
4. Clique em **"Create Database"**

### 1.2 Criar Usuário do Banco
1. Em "MySQL Users", seção "Add New User":
   - Username: `ctrluser` (anote este nome!)
   - Password: Crie uma senha forte (anote!)
   - Password (Again): Repita a senha
2. Clique em **"Create User"**

### 1.3 Associar Usuário ao Banco
1. Em "Add User To Database":
   - User: Selecione `seu_usuario_ctrluser`
   - Database: Selecione `seu_usuario_controleobras`
2. Clique em **"Add"**
3. Marque **"ALL PRIVILEGES"**
4. Clique em **"Make Changes"**

### 1.4 Executar Script SQL
1. No cPanel, clique em **"phpMyAdmin"**
2. Selecione o banco `seu_usuario_controleobras` na lateral
3. Clique na aba **"SQL"**
4. Copie e cole todo o conteúdo do arquivo `database.sql`
5. Clique em **"Go"**
6. Verifique se todas as tabelas foram criadas com sucesso

## 📤 Passo 2: Upload dos Arquivos

### 2.1 Via Gerenciador de Arquivos (Recomendado)
1. No cPanel, clique em **"File Manager"**
2. Navegue até a pasta `public_html`
3. Upload todos os arquivos PHP, HTML, CSS e JS
4. **IMPORTANTE**: Não faça upload do `database.sql`

### 2.2 Via FTP (Alternativo)
- Host: `ftp.seudominio.com` ou IP fornecido
- Usuário: Usuário FTP do cPanel
- Senha: Senha FTP do cPanel
- Upload todos os arquivos para `/public_html/`

## ⚙️ Passo 3: Configurar Conexão com Banco

### 3.1 Editar config.php
Abra o arquivo `config.php` e substitua as informações:

```php
// Configurações para HostGator
$host = 'localhost';
$database = 'seu_usuario_controleobras'; // Substitua 'seu_usuario'
$username = 'seu_usuario_ctrluser';      // Substitua 'seu_usuario'
$password = 'sua_senha_forte';           // Substitua pela senha criada
```

**📝 Exemplo real:**
Se seu usuário cPanel é `joao123`, ficará:
- Database: `joao123_controleobras`
- Username: `joao123_ctrluser`

## 🔄 Passo 4: Modificar JavaScript para API

Você precisará atualizar o `script.js` para usar as APIs PHP em vez do localStorage. Esta é a próxima etapa que faremos juntos.

## 🌐 Passo 5: Testar a Aplicação

### 5.1 Acessar via Navegador
- Se tem domínio: `http://seudominio.com/controle-obras.html`
- Se não tem: `http://seuusuario.hostgatorwebsite.com/controle-obras.html`

### 5.2 Login Inicial
- **Usuário**: `admin`
- **Senha**: `admin123`
- **⚠️ IMPORTANTE**: Altere essa senha após o primeiro login!

## 🔧 Configurações Adicionais

### Permissões de Arquivos
Certifique-se que as permissões estão corretas:
- Arquivos PHP: 644
- Pastas: 755

### SSL (Recomendado)
1. No cPanel, procure por **"Let's Encrypt SSL"**
2. Selecione seu domínio
3. Clique em **"Issue"**
4. Aguarde a instalação
5. Force HTTPS nas configurações

## 📱 Funcionalidades Após Instalação

✅ **Login/Logout seguro**
✅ **Gestão de usuários**
✅ **Cadastro de funcionários**
✅ **Controle de obras**
✅ **Lançamentos diários**
✅ **Avaliações de funcionários**
✅ **Relatórios automáticos**
✅ **Backup automático no banco**

## 🆘 Solução de Problemas Comuns

### Erro 500 - Internal Server Error
- Verifique permissões dos arquivos (644 para arquivos, 755 para pastas)
- Confira se não há erros de sintaxe no config.php
- Verifique se o PHP está ativado

### Erro de Conexão com Banco
- Confirme se o nome do banco está correto
- Verifique usuário e senha do MySQL
- Teste conexão via phpMyAdmin

### Página em Branco
- Ative display de erros temporariamente
- Verifique se todos os arquivos foram enviados
- Confira se o arquivo index está correto

### CORS Error (apenas se usar subdomínio)
Adicione no início de cada arquivo PHP:
```php
header('Access-Control-Allow-Origin: http://seudominio.com');
```

## 📞 Próximos Passos

Após completar esta instalação, estaremos prontos para:

1. **Modificar o JavaScript** para usar APIs em vez de localStorage
2. **Configurar domínio personalizado** (se desejar)
3. **Implementar backups automáticos**
4. **Configurar SSL** para segurança
5. **Otimizar performance**

---

**💡 Dica Pro**: Mantenha sempre um backup local dos arquivos antes de fazer alterações no servidor!

**🔒 Segurança**: Após o primeiro login, vá em "Usuários" e altere a senha padrão do administrador.