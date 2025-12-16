# 🔧 Solução: Problema de Permissões em Tarefas

## ❌ Problema Identificado

Mesmo sendo administrador, você não conseguia criar tarefas porque:

1. **Frontend verificava apenas tipo de usuário**: O módulo [tarefas.js](js/modules/tarefas.js) estava verificando apenas se o usuário era "admin" localmente, mas não consultava as permissões do banco de dados.

2. **Falta de permissões no banco**: Provavelmente não havia registros na tabela `permissoes` para o módulo "tarefas".

## ✅ Correções Aplicadas

### 1. **Código JavaScript Corrigido** ✓

Atualizei o módulo [js/modules/tarefas.js](js/modules/tarefas.js) para usar o sistema de permissões corretamente:

**Antes:**
```javascript
if (!ehAdmin) {
    showNotification(MESSAGES.TAREFAS.ERROR.NO_PERMISSION, 'erro');
    return;
}
```

**Depois:**
```javascript
if (!verificarEhAdmin() && !temPermissao('tarefas', 'criar')) {
    showNotification(MESSAGES.TAREFAS.ERROR.NO_PERMISSION, 'erro');
    return;
}
```

**Funções Corrigidas:**
- ✅ `abrirFormularioNovaTarefa()` - Verifica permissão de criar
- ✅ `editarTarefa()` - Verifica permissão de editar
- ✅ `excluirTarefa()` - Verifica permissão de excluir
- ✅ `abrirDetalhesTarefa()` - Mostra/oculta botões conforme permissões
- ✅ Drag and Drop (alteração de status) - Verifica permissão de editar

### 2. **Script SQL para Configurar Permissões** ✓

Criei o arquivo [fix_permissoes_admin.sql](fix_permissoes_admin.sql) que:
- ✅ Garante que o módulo "tarefas" existe
- ✅ Dá permissões TOTAIS para TODOS os administradores
- ✅ Dá permissões (visualizar, criar, editar) para usuários comuns
- ✅ Verifica e mostra o resultado final

## 📋 Passos para Resolver

### **Opção A: Via phpMyAdmin (RECOMENDADO)**

1. Acesse o **cPanel** do HostGator
2. Vá em **phpMyAdmin**
3. Selecione o banco de dados `hg253b74_controleobras`
4. Clique na aba **SQL**
5. Cole o conteúdo do arquivo [fix_permissoes_admin.sql](fix_permissoes_admin.sql)
6. Clique em **Executar**

### **Opção B: Via Código PHP**

1. Acesse pelo navegador: `https://vivicontroldeobras.com.br/verificar_permissoes_tarefas.php`
2. Isso mostrará o estado atual das permissões
3. Depois execute o SQL via phpMyAdmin

## 🔍 Como Verificar se Funcionou

### 1. **Faça logout e login novamente**
   - Isso carrega as novas permissões no localStorage

### 2. **Abra o Console do Navegador** (F12)
   - Digite: `localStorage.getItem('controle_obras_permissions')`
   - Deve aparecer um array com as permissões, incluindo "tarefas"

### 3. **Tente criar uma tarefa**
   - Vá na aba "Tarefas e Agenda"
   - Clique em "Nova Tarefa"
   - Deve abrir o formulário normalmente

## 🧪 Debug

Se ainda não funcionar, verifique no Console do navegador (F12):

```javascript
// Verificar usuário logado
const usuario = JSON.parse(localStorage.getItem('controle_obras_user'));
console.log('Usuário:', usuario);

// Verificar permissões
const permissoes = JSON.parse(localStorage.getItem('controle_obras_permissions'));
console.log('Permissões:', permissoes);

// Verificar se tem permissão de tarefas
const tarefasPerm = permissoes.find(p => p.modulo === 'tarefas');
console.log('Permissão Tarefas:', tarefasPerm);
```

## 📝 Arquivos Modificados

### Código:
- ✅ [js/modules/tarefas.js](js/modules/tarefas.js) - Correção do sistema de permissões

### Arquivos Auxiliares Criados:
- 📄 [fix_permissoes_admin.sql](fix_permissoes_admin.sql) - Script para configurar permissões
- 📄 [verificar_permissoes_tarefas.php](verificar_permissoes_tarefas.php) - Script de verificação

## ⚙️ Como o Sistema de Permissões Funciona

### Backend (PHP):
```php
// Admin sempre tem acesso total
if ($ehAdmin) {
    // Pode fazer tudo
}

// Usuários comuns precisam de permissões na tabela
$permissoes = obter_permissoes_usuario($pdo, $usuario['id']);
if (tem_permissao($permissoes, 'tarefas', 'pode_criar')) {
    // Pode criar
}
```

### Frontend (JavaScript):
```javascript
import { ehAdmin, temPermissao } from './auth.js';

// Verificar se pode criar
if (ehAdmin() || temPermissao('tarefas', 'criar')) {
    // Pode criar
}
```

## 🎯 Resultado Esperado

Após aplicar a correção:
- ✅ Administradores podem criar/editar/excluir QUALQUER tarefa
- ✅ Usuários comuns podem criar/editar APENAS SUAS tarefas
- ✅ Botões aparecem/desaparecem conforme permissões
- ✅ Mensagens de erro claras quando sem permissão

## 💡 Dicas

1. **Sempre fazer logout/login** após alterar permissões
2. **Limpar cache do navegador** se persistir o problema (Ctrl+Shift+Delete)
3. **Verificar o Console** (F12) para mensagens de erro
4. **Admin sempre bypassa permissões** no código atual

---

**Status:** ✅ Correção aplicada e pronta para testar
**Data:** 2025-12-16
