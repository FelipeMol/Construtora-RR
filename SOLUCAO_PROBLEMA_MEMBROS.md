# Solução: Tarefa não aparece para membros

## 🔍 Problema Identificado

Quando você adiciona um usuário como **Membro** de uma tarefa pela interface, a tarefa não aparece para ele quando ele faz login.

## 📋 Diagnóstico

A query em [api_tarefas.php](api_tarefas.php) (linhas 122-129) verifica:

```php
// Non-admin: ver apenas tarefas onde é responsável, criador ou membro
if (!$ehAdmin) {
    $where[] = "(
        t.usuario_responsavel_id = :usuario_id
        OR t.criado_por = :usuario_id
        OR EXISTS (SELECT 1 FROM tarefas_membros tm WHERE tm.tarefa_id = t.id AND tm.usuario_id = :usuario_id)
    )";
    $params[':usuario_id'] = $usuario['id'];
}
```

A lógica está **CORRETA**. O problema está em **como os membros são adicionados**.

## 🧪 Como Testar

### Passo 1: Verificar se membros estão sendo salvos

Execute no navegador:
```
http://localhost/debug_membros_tarefa.php
```

ou (se estiver no servidor):
```
https://vivicontroldeobras.com.br/debug_membros_tarefa.php
```

**Resultado esperado:**
- Se aparecer "⚠️ NENHUM MEMBRO ENCONTRADO!" = **Problema confirmado**: interface não está salvando membros

### Passo 2: Adicionar membro manualmente (teste)

Execute:
```
http://localhost/test_adicionar_membro.php
```

Isso vai:
1. Encontrar a tarefa "teste"
2. Encontrar o usuário TESTER
3. Adicionar ele na tabela `tarefas_membros`
4. Confirmar que foi adicionado

### Passo 3: Testar novamente

Faça login como TESTER e veja se a tarefa aparece agora.

## ✅ Duas Possíveis Causas

### Causa 1: Interface não está chamando a API corretamente

Abra o **Console do navegador** (F12) e:
1. Clique em "Adicionar Membro" na interface
2. Veja se aparece algum erro no console
3. Vá na aba **Network** e veja se a chamada para `api_tarefas_membros.php` está sendo feita

**O que verificar:**
- Status HTTP: deve ser `200 OK`
- Response: deve ter `{ sucesso: true, ... }`
- Se der erro 401/403: problema de autenticação
- Se não aparecer nada: botão não está chamando a função

### Causa 2: Diferença entre "Responsável" e "Membro"

Existem 2 campos diferentes:

1. **`usuario_responsavel_id`** (na tabela `tarefas`)
   - Campo único, só 1 responsável principal
   - Aparece no dropdown "Responsável" no topo da tarefa

2. **Membros** (na tabela `tarefas_membros`)
   - Múltiplos membros com papéis diferentes
   - Adicionados via botão "+ Adicionar" na seção Membros

**Importante:** Quando você clica em "Responsável" no topo (dropdown), isso **NÃO** adiciona na tabela `tarefas_membros`. Ele apenas seta o campo `usuario_responsavel_id`.

## 🔧 Solução

### Se o problema for na interface:

Verifique em [tarefas.js](js/modules/tarefas.js#L1279-L1314) se a função `adicionarMembro()` está sendo chamada corretamente.

**Teste rápido:** Adicione um `console.log` na função:

```javascript
window.adicionarMembro = async function() {
    console.log('🔍 adicionarMembro chamada!', {
        currentTarefaId,
        usuarioId: document.getElementById(`select-membro-${currentTarefaId}`)?.value,
        papel: document.getElementById(`select-papel-${currentTarefaId}`)?.value
    });

    // ... resto do código
}
```

### Se a API retornar erro:

Verifique os logs PHP:
```php
// Ver últimas linhas do log
tail -f php_errors.log
```

### Verificação final:

```sql
-- No banco de dados, execute:
SELECT
    t.id,
    t.titulo,
    t.usuario_responsavel_id,
    GROUP_CONCAT(tm.usuario_id) as membros_ids
FROM tarefas t
LEFT JOIN tarefas_membros tm ON tm.tarefa_id = t.id
WHERE t.titulo LIKE '%teste%'
GROUP BY t.id;
```

**Resultado esperado:**
- `usuario_responsavel_id`: ID do TESTER (se ele for responsável)
- `membros_ids`: ID do TESTER (se ele for membro)

## 📝 Próximos Passos

1. Execute `debug_membros_tarefa.php` para confirmar o problema
2. Se confirmar que não há membros na tabela:
   - Execute `test_adicionar_membro.php` para adicionar manualmente
   - Teste se a tarefa aparece para o TESTER
3. Se funcionar com insert manual:
   - Problema está na interface
   - Verifique console do navegador (F12)
   - Verifique Network tab para ver requisições

## 🎯 Resumo

- **Backend está correto**: API funciona, query está certa
- **Problema provável**: Interface não está salvando membros quando você clica em "+ Adicionar"
- **Teste**: Use os scripts de debug para confirmar e adicione manualmente para testar
