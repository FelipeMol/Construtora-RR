# 🔒 Correção: Permissões de Tarefas e UX para Usuários Sem Permissão

## 🎯 Problema Identificado

Ao logar com usuário **não-admin** (ex: "Compras CRR"), apareciam erros **403 Forbidden** no console para:
- ❌ `api_usuarios.php` - Correto (só admin deve acessar)
- ❌ `api_tarefas.php` - **Problema!** Usuários comuns deveriam poder gerenciar tarefas

## ✅ Soluções Implementadas

### 1. **Melhorar Tratamento de Erros de Permissão no Frontend**

#### ✅ [js/modules/tarefas.js](js/modules/tarefas.js#L44-L77)
- **Antes**: Mostrava notificação de erro genérica
- **Depois**: Detecta erro 403 e **silencia** (não mostra notificação)
- Usuários sem permissão simplesmente não veem tarefas (sem alarmes)

```javascript
// Silenciar erros de permissão (403) e autenticação (401)
const isSemPermissao = response.mensagem && (
    response.mensagem.includes('permissão') ||
    response.mensagem.includes('Token') ||
    response.mensagem.includes('Acesso negado')
);

if (!isSemPermissao) {
    showNotification(response.mensagem, 'erro');
}
```

#### ✅ [js/modules/usuarios.js](js/modules/usuarios.js#L56-L76)
- Mesmo tratamento para o módulo de usuários
- Console agora mostra: `ℹ️ Usuário sem permissão para visualizar módulo de usuários`

### 2. **Adicionar Tarefas ao Sistema de Permissões da UI**

#### ✅ [js/modules/ui.js](js/modules/ui.js#L517-L532)
- Adicionado `{ modulo: 'tarefas', aba: 'tarefas', menuSelector: '[onclick*="tarefas"]' }`
- Se usuário não tem permissão, a aba de **Tarefas**:
  - ✅ Fica oculta no menu lateral
  - ✅ Não pode ser acessada diretamente
  - ✅ Segue o mesmo padrão dos outros módulos

### 3. **Script SQL para Dar Permissões**

Criado [dar_permissoes_tarefas.sql](dar_permissoes_tarefas.sql) com **2 opções**:

#### Opção 1: Permissão para Usuário Específico
```sql
-- Dar permissão TOTAL ao usuário "Compras CRR" (ID 2)
INSERT INTO permissoes (usuario_id, modulo_id, pode_visualizar, pode_criar, pode_editar, pode_excluir)
SELECT 2, m.id, 1, 1, 1, 1
FROM modulos m
WHERE m.nome = 'tarefas';
```

#### Opção 2: Permissão para TODOS Usuários Comuns
```sql
-- Dar permissão para todos usuários (tipo = 'usuario')
-- Podem: visualizar, criar, editar
-- NÃO podem: excluir (apenas próprias tarefas)
INSERT INTO permissoes (usuario_id, modulo_id, pode_visualizar, pode_criar, pode_editar, pode_excluir)
SELECT u.id, m.id, 1, 1, 1, 0
FROM usuarios u
CROSS JOIN modulos m
WHERE m.nome = 'tarefas' AND u.tipo = 'usuario';
```

## 🚀 Como Aplicar

### Passo 1: Fazer Upload dos Arquivos JS

Upload para `/public_html/js/modules/`:
- ✅ `tarefas.js`
- ✅ `usuarios.js`
- ✅ `ui.js`

### Passo 2: Executar SQL de Permissões

1. Acesse **phpMyAdmin** no HostGator
2. Selecione banco `hg253b74_controleobras`
3. Vá na aba **SQL**
4. Copie e cole o conteúdo de [dar_permissoes_tarefas.sql](dar_permissoes_tarefas.sql)
5. **Escolha UMA opção** (Opção 1 ou Opção 2)
6. Clique **Executar**

### Passo 3: Testar

1. Limpe cache do navegador (Ctrl+Shift+R)
2. **Teste como Admin**:
   - ✅ Deve ver TODAS as abas
   - ✅ Módulo de Tarefas funciona
   - ✅ Sem erros no console

3. **Teste como Usuário Comum** (Compras CRR):
   - ✅ **SE TEM PERMISSÃO**: Vê aba de Tarefas
   - ✅ **SE NÃO TEM PERMISSÃO**: Aba oculta, sem erros no console
   - ✅ Aba de Usuários/Permissões **sempre oculta** (correto!)

## 📊 Comportamento Esperado

### Admin
```
✅ Dashboard
✅ Lançamentos
✅ Funcionários
✅ Obras
✅ Empresas
✅ Tarefas
✅ Base
✅ Relatórios
✅ Avaliações
✅ Projetos
✅ Usuários
✅ Permissões
✅ Configurações
✅ Backup
```

### Usuário Comum (COM permissão de tarefas)
```
✅ Dashboard
✅ Lançamentos
✅ Funcionários
✅ Obras
✅ Empresas
✅ Tarefas        ← Visível após dar permissão!
✅ Base
✅ Relatórios
❌ Usuários       ← Oculto (correto)
❌ Permissões     ← Oculto (correto)
❌ Configurações  ← Oculto (correto)
❌ Backup         ← Oculto (correto)
```

### Usuário Comum (SEM permissão de tarefas)
```
✅ Dashboard
✅ Lançamentos
✅ Funcionários
✅ Obras
✅ Empresas
❌ Tarefas        ← Oculto
✅ Base
✅ Relatórios
❌ Usuários       ← Oculto
❌ Permissões     ← Oculto
❌ Configurações  ← Oculto
❌ Backup         ← Oculto
```

## 🎯 Resultado Final

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Erro 403 no console** | ❌ Visível e assustador | ✅ Silenciado |
| **Notificações de erro** | ❌ "Acesso negado" | ✅ Sem notificação |
| **Aba de Tarefas** | ⚠️ Visível mas não funciona | ✅ Oculta se sem permissão |
| **UX para usuário comum** | ❌ Confusa | ✅ Limpa e clara |
| **Permissões no banco** | ❌ Não configuradas | ✅ Script SQL pronto |

## 💡 Recomendações

1. **Execute a Opção 2** do SQL (dar permissão para todos usuários comuns)
   - Permite colaboração em tarefas
   - Cada usuário vê apenas suas tarefas (filtro no backend)
   - Admin vê todas as tarefas

2. **Configure permissões via interface** depois
   - Acesse **Usuários → Permissões**
   - Ajuste permissões individuais conforme necessário
   - Sistema já está preparado para isso

3. **Documente para o cliente**
   - Explique que cada usuário pode ter permissões diferentes
   - Admin sempre tem acesso total
   - Usuários comuns só veem o que têm permissão

---

**Status**: ✅ Correção Completa
**Arquivos Modificados**: 4
**Scripts SQL Criados**: 1
**Prioridade**: 🟡 Média (melhoria de UX)
