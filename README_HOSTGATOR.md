# 🚀 GUIA COMPLETO DE INSTALAÇÃO HOSTGATOR

## 📋 ARQUIVOS PARA UPLOAD

### Copie estes arquivos para o HostGator:

1. **index.html** - Página principal
2. **styles.css** - Estilos  
3. **script_hostgator.js** - JavaScript produção
4. **config_hostgator.php** - Configuração banco
5. **api_empresas_hostgator.php** - API empresas
6. **api_funcionarios_hostgator.php** - API funcionários
7. **api_obras_hostgator.php** - API obras
8. **api_lancamentos_hostgator.php** - API lançamentos
9. **database_hostgator.sql** - Estrutura do banco

## ⚙️ CONFIGURAÇÃO PASSO A PASSO

### 1. BANCO DE DADOS
- Crie banco MySQL no painel HostGator
- Importe `database_hostgator.sql` no phpMyAdmin
- Anote: nome_banco, usuário, senha

### 2. CONFIGURAR PHP
Edite `config_hostgator.php`:
```php
$dbname = 'SEU_BANCO_AQUI';
$username = 'SEU_USUARIO_AQUI'; 
$password = 'SUA_SENHA_AQUI';
```

### 3. FAZER UPLOAD
- Acesse Gerenciador de Arquivos
- Vá para `/public_html/`
- Faça upload de todos os 8 arquivos

### 4. TESTAR
- Acesse: https://vivicontroldeobras.com.br
- Teste cadastro de empresa
- Teste cadastro de funcionário

## ✅ PRONTO PARA USO!

Sistema completo funcionando no HostGator com MySQL.