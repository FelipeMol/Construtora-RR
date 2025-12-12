# 📤 CHECKLIST - UPLOAD SPRINT 2 PARA HOSTGATOR

## ✅ PRÉ-UPLOAD

### 1. Verificação Local
- [ ] Abrir `index.html` no navegador local
- [ ] Testar botão toggle do sidebar (☰)
- [ ] Verificar expansão/retração do menu
- [ ] Navegar entre todas as abas
- [ ] Confirmar que submenu "Cadastros" abre/fecha
- [ ] Verificar indicador de item ativo
- [ ] Testar largura total das páginas

### 2. Backup do Servidor
**IMPORTANTE:** Fazer backup antes de qualquer alteração!

- [ ] Acessar File Manager do cPanel
- [ ] Navegar até `public_html/`
- [ ] Selecionar arquivos:
  - `index.html`
  - `styles.css`
  - `script.js`
- [ ] Clicar em "Compress" → ZIP
- [ ] Nomear: `backup_antes_sprint2_YYYY-MM-DD.zip`
- [ ] Download do ZIP para computador local

---

## 📁 ARQUIVOS A SUBSTITUIR

### Arquivo 1: `index.html`
**Localização:** `public_html/index.html`  
**Tamanho aproximado:** ~60 KB  
**Mudanças principais:**
- Header fixo com toggle button
- Sidebar lateral completa
- Estrutura `<main class="main-content">`
- Removido menu horizontal

**Upload:**
- [ ] Selecionar `E:\Planilha\index.html`
- [ ] Upload via File Manager ou FTP
- [ ] Sobrescrever arquivo existente
- [ ] Confirmar upload bem-sucedido

---

### Arquivo 2: `styles.css`
**Localização:** `public_html/styles.css`  
**Tamanho aproximado:** ~80 KB  
**Mudanças principais:**
- CSS do header fixo
- CSS do sidebar e submenu
- CSS do main-content responsivo
- Container-fluid com 100% width

**Upload:**
- [ ] Selecionar `E:\Planilha\styles.css`
- [ ] Upload via File Manager ou FTP
- [ ] Sobrescrever arquivo existente
- [ ] Confirmar upload bem-sucedido

---

### Arquivo 3: `script.js`
**Localização:** `public_html/script.js`  
**Tamanho aproximado:** ~35 KB  
**Mudanças principais:**
- Funções toggleSidebar()
- Função toggleSubmenu()
- Função updateActiveMenuItem()
- Inicialização do sidebar no DOMContentLoaded

**Upload:**
- [ ] Selecionar `E:\Planilha\script.js`
- [ ] Upload via File Manager ou FTP
- [ ] Sobrescrever arquivo existente
- [ ] Confirmar upload bem-sucedido

---

## 🔍 PÓS-UPLOAD - TESTES

### 1. Limpeza de Cache
**CRÍTICO:** Cache pode mostrar versão antiga!

**Chrome/Edge:**
- [ ] Pressionar `Ctrl + Shift + Delete`
- [ ] Selecionar "Imagens e arquivos em cache"
- [ ] Período: "Última hora"
- [ ] Clicar em "Limpar dados"

**OU:**
- [ ] Abrir DevTools (F12)
- [ ] Clicar com botão direito no ícone de atualizar
- [ ] Selecionar "Esvaziar cache e atualizar forçadamente"

**OU:**
- [ ] Abrir em aba anônima: `Ctrl + Shift + N`

---

### 2. Testes Visuais
- [ ] **Header:** Aparece fixo no topo?
- [ ] **Botão Toggle:** Aparece no canto superior esquerdo?
- [ ] **Sidebar:** Aparece na lateral esquerda?
- [ ] **Ícones:** Todos os emojis aparecem corretamente?
- [ ] **Conteúdo:** Ocupa largura total da tela?

### 3. Testes Funcionais

#### Sidebar
- [ ] Clicar no botão ☰ retrai o sidebar
- [ ] Sidebar fica com 70px de largura retraído
- [ ] Clicar novamente expande o sidebar
- [ ] Sidebar volta para 280px
- [ ] Ícones permanecem visíveis quando retraído
- [ ] Textos desaparecem quando retraído

#### Submenu
- [ ] Clicar em "📁 Cadastros"
- [ ] Submenu abre com animação
- [ ] Aparecem 6 itens (Funcionários, Obras, etc.)
- [ ] Clicar novamente fecha o submenu
- [ ] Seta (▼) rotaciona 180°

#### Navegação
- [ ] Clicar em "🏠 Início" → Abre Dashboard
- [ ] Clicar em "📋 Lançamentos" → Abre Lançamentos
- [ ] Clicar em "👥 Funcionários" (submenu) → Abre Funcionários
- [ ] Item clicado fica com borda azul à esquerda
- [ ] Item clicado fica com background gradiente
- [ ] Outros itens ficam sem destaque

#### Persistência
- [ ] Retrair sidebar
- [ ] Atualizar página (F5)
- [ ] Sidebar permanece retraído
- [ ] Expandir sidebar
- [ ] Atualizar página (F5)
- [ ] Sidebar permanece expandido

### 4. Testes das Funcionalidades Antigas

**IMPORTANTE:** Garantir que Sprint 1 continua funcionando!

#### Lançamentos
- [ ] Abrir aba Lançamentos
- [ ] Selecionar funcionário no dropdown
- [ ] Verificar se função e empresa preenchem automaticamente
- [ ] Campo "Diárias" aparece?
- [ ] Selecionar diária < 1.0
- [ ] Campo "Horas" aparece?
- [ ] Selecionar diária >= 1.0
- [ ] Campo "Horas" desaparece?
- [ ] Criar um lançamento de teste
- [ ] Toast de sucesso aparece?
- [ ] Tabela atualiza com 9 colunas?

#### Funcionários
- [ ] Abrir aba Funcionários (via submenu)
- [ ] Verificar se tabela mostra coluna "Empresa"
- [ ] Funcionários novos mostram empresa correta?
- [ ] Cadastrar funcionário teste
- [ ] Toast de sucesso?
- [ ] Tabela atualiza?

#### Empresas
- [ ] Abrir aba Empresas (via submenu)
- [ ] Cadastrar empresa teste
- [ ] Toast de sucesso?
- [ ] Tabela atualiza?

#### Obras
- [ ] Abrir aba Obras (via submenu)
- [ ] Cadastrar obra teste
- [ ] Toast de sucesso?
- [ ] Tabela atualiza?

---

## 🐛 TROUBLESHOOTING

### Problema: Sidebar não aparece
**Possíveis causas:**
- Cache do navegador
- Upload incompleto do CSS
- Erro de JavaScript

**Solução:**
1. Limpar cache (Ctrl + F5)
2. Abrir DevTools (F12) → Console
3. Verificar se há erros em vermelho
4. Verificar se `styles.css` foi carregado (aba Network)
5. Re-upload do `styles.css`

---

### Problema: Botão toggle não funciona
**Possíveis causas:**
- Erro no JavaScript
- Função `toggleSidebar()` não carregou

**Solução:**
1. Abrir DevTools (F12) → Console
2. Digitar: `toggleSidebar()`
3. Se erro "not defined" → Re-upload `script.js`
4. Verificar se `script.js` foi carregado (aba Network)

---

### Problema: Menu não marca item ativo
**Possíveis causas:**
- Função `updateActiveMenuItem()` não carregou
- Atributo `onclick` incorreto

**Solução:**
1. Abrir DevTools → Console
2. Digitar: `updateActiveMenuItem('dashboard')`
3. Verificar se item Dashboard fica azul
4. Se não funcionar → Re-upload `script.js`

---

### Problema: Páginas não ocupam largura total
**Possíveis causas:**
- CSS antigo em cache
- Container com max-width 1400px

**Solução:**
1. Limpar cache forçadamente
2. DevTools (F12) → Elements
3. Selecionar `<div class="container-fluid">`
4. Verificar no painel Styles:
   - `max-width: 100%` ✅
   - Se aparecer `max-width: 1400px` ❌ → Re-upload CSS

---

### Problema: Funcionalidades antigas pararam
**Possíveis causas:**
- Conflito de JavaScript
- Erro na modificação do `showTab()`

**Solução:**
1. DevTools → Console
2. Verificar erros
3. Se erro relacionado a `showTab` ou `updateActiveMenuItem`:
   - Restaurar backup: `backup_antes_sprint2.zip`
   - Revisar alterações no `script.js`
4. Se erro relacionado a elementos HTML:
   - Verificar se IDs dos formulários permanecem
   - Verificar se IDs das tabelas permanecem

---

## 📱 TESTE RESPONSIVO

### Desktop (1920x1080)
- [ ] Sidebar aparece corretamente
- [ ] Conteúdo usa espaço disponível
- [ ] Tabelas não quebram layout

### Laptop (1366x768)
- [ ] Sidebar funciona
- [ ] Scroll horizontal não aparece
- [ ] Tabelas com scroll interno

### Tablet (768x1024)
- [ ] Sidebar pode ser retraída para ganhar espaço
- [ ] Conteúdo responsivo
- [ ] Touch funciona no toggle button

---

## ✅ CONFIRMAÇÃO FINAL

- [ ] Todos os testes visuais passaram
- [ ] Todos os testes funcionais passaram
- [ ] Sidebar abre/fecha corretamente
- [ ] Submenu funciona
- [ ] Navegação funciona
- [ ] Lançamentos funcionam (Sprint 1)
- [ ] Funcionários mostram empresa (Sprint 1)
- [ ] Cadastros funcionam
- [ ] Toast notifications funcionam
- [ ] Sem erros no Console

---

## 🎉 SPRINT 2 IMPLANTADO COM SUCESSO!

**Data do upload:** ____ / ____ / ________  
**Horário:** ____:____  
**Testado por:** Viviane  
**Status:** ✅ FUNCIONANDO

---

## 📞 SUPORTE

**Em caso de problemas:**
1. Restaurar backup (`backup_antes_sprint2.zip`)
2. Verificar logs de erro no DevTools Console
3. Revisar este checklist
4. Comparar arquivos locais vs servidor

**Arquivos de referência:**
- `SPRINT_2_COMPLETO.md` - Documentação completa
- `styles_backup.css` - Backup local do CSS antigo
- `backup_antes_sprint2.zip` - Backup do servidor

---

**Desenvolvido com dedicação 💙**  
**Sistema de Controle de Obras - Viviane**
