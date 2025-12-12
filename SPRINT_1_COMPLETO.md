# ✅ SPRINT 1 - CONCLUÍDA!

## Alterações Realizadas:

### 1️⃣ **api_lancamentos.php** - CORRIGIDO ✅
- Alterado de `funcionario_id` (INT) para `funcionario` (VARCHAR nome)
- Alterado de `obra_id` (INT) para `obra` (VARCHAR nome)
- Adicionado campo `diarias` no INSERT
- Adicionados campos `funcao` e `empresa`
- API agora aceita nomes ao invés de IDs

### 2️⃣ **database.sql** - ATUALIZADO ✅
- Adicionada coluna `diarias DECIMAL(3,1) DEFAULT 1.0` na tabela `lancamentos`
- Criado arquivo `update_add_diarias.sql` para atualizar bancos existentes

### 3️⃣ **index.html** - FORMULÁRIO DIÁRIAS ✅
- Adicionado campo `<select id="lancamento-diarias">` com opções:
  - 0.5 (Meia diária)
  - 1.0 (1 diária) - PADRÃO
  - 1.5 (1.5 diárias)
  - 2.0 (2 diárias)
- Campo de horas agora tem ID `campo-horas` para controle de visibilidade
- Tabela atualizada com coluna "Diárias" entre "Obra" e "Horas"

### 4️⃣ **script.js** - AUTO-PREENCHER ✅
- Listener no `select` de funcionário que:
  - Busca dados do funcionário selecionado no array `funcionarios`
  - Preenche automaticamente campo `lancamento-funcao`
  - Preenche automaticamente campo `lancamento-empresa`
- Listener no `select` de diárias que:
  - Se >= 1.0 diária: oculta campo horas, define 08:00 automaticamente
  - Se < 1.0 diária: mostra campo horas, define 04:00 (meia diária)
- Submit atualizado para enviar:
  - `funcionario` (nome, não ID)
  - `obra` (nome, não ID)
  - `diarias` (número decimal)
  - `funcao` e `empresa`

### 5️⃣ **script.js** - TABELA FUNCIONÁRIOS ✅
- Corrigido `atualizarTabelaFuncionarios()`:
  - Removida busca por `empresa_id`
  - Agora usa diretamente `funcionario.empresa` (nome)
  - Exibe "Sem empresa" se vazio
  - Badge dinâmico baseado em `funcionario.situacao`

### 6️⃣ **script.js** - TABELA LANÇAMENTOS ✅
- Atualizada para mostrar 9 colunas (era 6):
  - Data, Funcionário, Função, Empresa, Obra, **Diárias**, Horas, Observação, Ações
- Removidas buscas por `funcionario_id` e `obra_id`
- Usa diretamente os nomes salvos no banco
- Mostra até 50 lançamentos (era 20)

### 7️⃣ **styles.css** - OCULTAR HORAS ✅
- Adicionada regra `#campo-horas { display: none; }`
- Campo de horas oculto por padrão (1 diária = 8h automático)

---

## 📦 Arquivos para Upload no HostGator:

### OBRIGATÓRIOS (atualizar):
1. ✅ **api_lancamentos.php** - Corrigido
2. ✅ **index.html** - Campo diárias adicionado
3. ✅ **script.js** - Auto-preencher + tabelas corrigidas
4. ✅ **styles.css** - CSS para ocultar horas

### BANCO DE DADOS:
5. ✅ **update_add_diarias.sql** - Execute no phpMyAdmin para adicionar coluna

---

## 🧪 Como Testar:

### Teste 1: Cadastrar Funcionário
1. Vá em "Funcionários"
2. Cadastre: Nome, Função, Empresa, Situação
3. Clique "Adicionar Funcionário"
4. ✅ Deve aparecer na tabela COM o nome da empresa

### Teste 2: Lançamento com Auto-preencher
1. Vá em "Lançamentos Diários"
2. Selecione um funcionário
3. ✅ Função e Empresa devem preencher automaticamente

### Teste 3: Lançamento com Diárias
1. Selecione funcionário, obra
2. Deixe "1.0 diária" (padrão)
3. ✅ Campo de horas deve estar oculto
4. Mude para "0.5 diária"
5. ✅ Campo de horas deve aparecer com 04:00

### Teste 4: Salvar Lançamento
1. Preencha tudo e clique "Adicionar Lançamento"
2. ✅ Deve mostrar toast verde de sucesso
3. ✅ Deve aparecer na tabela com: Funcionário, Função, Empresa, Obra, Diárias, Horas

---

## ⚠️ IMPORTANTE - Banco de Dados:

**ANTES de fazer upload dos arquivos**, execute no phpMyAdmin:

```sql
ALTER TABLE lancamentos 
ADD COLUMN diarias DECIMAL(3,1) DEFAULT 1.0 AFTER horas;
```

OU faça upload e execute o arquivo `update_add_diarias.sql`

---

## 🎯 Próximos Passos (SPRINT 2):

1. ⏭️ Menu lateral retrátil
2. ⏭️ Expandir width das páginas
3. ⏭️ Implementar botões Editar/Excluir funcionários

---

**Status:** ✅ SPRINT 1 COMPLETA
**Data:** 30/10/2025
**Arquivos Atualizados:** 5 (api_lancamentos.php, index.html, script.js, styles.css, database.sql)
**Novos Arquivos:** 1 (update_add_diarias.sql)
