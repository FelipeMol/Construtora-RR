# 🔐 Trechos HTML para Adicionar - Sistema de Autenticação

Este arquivo contém os trechos de HTML que precisam ser adicionados ao [index.html](index.html) para completar o sistema de autenticação.

---

## 1️⃣ MODAL DE LOGIN

**Adicionar ANTES da tag `</body>` (final do arquivo):**

```html
<!-- ========================================
     MODAL DE LOGIN
     ======================================== -->
<div id="modal-login" class="modal">
    <div class="modal-content modal-login">
        <div class="login-header">
            <div class="login-logo">
                <img src="assets/logo.png" alt="Logo" style="max-width: 150px; margin-bottom: 20px;">
            </div>
            <h2>🏗️ Controle de Obras</h2>
            <p class="login-subtitle">Construtora Ramdy Raydan</p>
        </div>

        <form id="form-login" class="login-form">
            <div class="form-group">
                <label for="login-usuario">
                    👤 Usuário ou Email
                </label>
                <input
                    type="text"
                    id="login-usuario"
                    name="usuario"
                    required
                    autofocus
                    placeholder="Digite seu usuário ou email"
                    autocomplete="username"
                />
            </div>

            <div class="form-group">
                <label for="login-senha">
                    🔒 Senha
                </label>
                <input
                    type="password"
                    id="login-senha"
                    name="senha"
                    required
                    placeholder="Digite sua senha"
                    autocomplete="current-password"
                />
            </div>

            <button type="submit" class="btn btn-primary btn-full btn-login">
                🔑 Entrar
            </button>
        </form>

        <div class="login-footer">
            <p class="text-muted">
                Sistema de Gestão de Obras
            </p>
        </div>
    </div>
</div>

<!-- Script de login (usar type="module" para importar) -->
<script type="module">
    import { login } from './js/modules/auth.js';
    import { showNotification, showLoading, hideLoading } from './js/modules/ui.js';

    const form = document.getElementById('form-login');
    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();

            const usuario = document.getElementById('login-usuario').value;
            const senha = document.getElementById('login-senha').value;

            try {
                showLoading('Autenticando...');

                const result = await login(usuario, senha);

                if (result.sucesso) {
                    showNotification('Login realizado com sucesso!', 'success');
                    // Recarregar página para inicializar app autenticado
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                } else {
                    showNotification(result.mensagem || 'Erro ao fazer login', 'error');
                }
            } catch (error) {
                console.error('Erro ao fazer login:', error);
                showNotification('Erro ao fazer login. Verifique suas credenciais.', 'error');
            } finally {
                hideLoading();
            }
        });
    }
</script>
```

---

## 2️⃣ MODIFICAR ABA DE USUÁRIOS

**Localizar no HTML a seção `<div id="usuarios" class="tab-content">` e SUBSTITUIR TODO O CONTEÚDO por:**

```html
<div id="usuarios" class="tab-content">
    <h2>👤 Gerenciamento de Usuários</h2>

    <!-- Tabs secundárias -->
    <div class="tabs-secondary">
        <button class="tab-btn active" onclick="showSubTab('usuarios-lista')">
            📋 Lista de Usuários
        </button>
        <button class="tab-btn" onclick="showSubTab('usuarios-adicionar')">
            ➕ Adicionar Usuário
        </button>
    </div>

    <!-- Sub-tab: Lista -->
    <div id="usuarios-lista" class="sub-tab-content active">
        <div class="card">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Email</th>
                            <th>Usuário</th>
                            <th>Tipo</th>
                            <th>Status</th>
                            <th>Último Login</th>
                            <th class="th-acoes">Ações</th>
                        </tr>
                    </thead>
                    <tbody id="usuarios-tbody">
                        <tr>
                            <td colspan="7" style="text-align: center; padding: 2rem;">
                                Carregando usuários...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Sub-tab: Adicionar -->
    <div id="usuarios-adicionar" class="sub-tab-content">
        <div class="card">
            <h3>➕ Adicionar Novo Usuário</h3>

            <form id="form-add-usuario">
                <div class="form-row">
                    <div class="form-group">
                        <label for="add-nome">Nome Completo *</label>
                        <input
                            type="text"
                            id="add-nome"
                            name="nome"
                            required
                            placeholder="Ex: João da Silva"
                        />
                    </div>

                    <div class="form-group">
                        <label for="add-email">Email *</label>
                        <input
                            type="email"
                            id="add-email"
                            name="email"
                            required
                            placeholder="Ex: joao@empresa.com"
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="add-usuario">Usuário (Login) *</label>
                        <input
                            type="text"
                            id="add-usuario"
                            name="usuario"
                            required
                            placeholder="Ex: joao.silva"
                        />
                    </div>

                    <div class="form-group">
                        <label for="add-senha">Senha *</label>
                        <input
                            type="password"
                            id="add-senha"
                            name="senha"
                            required
                            placeholder="Mínimo 6 caracteres"
                            minlength="6"
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="add-tipo">Tipo de Usuário *</label>
                        <select id="add-tipo" name="tipo" required>
                            <option value="usuario">👤 Usuário</option>
                            <option value="admin">👑 Administrador</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="add-ativo">Status *</label>
                        <select id="add-ativo" name="ativo" required>
                            <option value="Sim">✓ Ativo</option>
                            <option value="Não">✗ Inativo</option>
                        </select>
                    </div>
                </div>

                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">
                        💾 Criar Usuário
                    </button>
                    <button type="reset" class="btn btn-secondary">
                        🔄 Limpar
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal de Edição de Usuário -->
<div id="modal-edit-usuario" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>✏️ Editar Usuário</h3>
            <button class="modal-close" onclick="closeModal('modal-edit-usuario')">×</button>
        </div>

        <form id="form-edit-usuario">
            <input type="hidden" id="edit-usuario-id" name="id" />

            <div class="form-group">
                <label for="edit-nome">Nome Completo *</label>
                <input type="text" id="edit-nome" name="nome" required />
            </div>

            <div class="form-group">
                <label for="edit-email">Email *</label>
                <input type="email" id="edit-email" name="email" required />
            </div>

            <div class="form-group">
                <label for="edit-usuario">Usuário (Login) *</label>
                <input type="text" id="edit-usuario" name="usuario" required />
            </div>

            <div class="form-group">
                <label for="edit-senha">Nova Senha (deixe em branco para manter)</label>
                <input
                    type="password"
                    id="edit-senha"
                    name="senha"
                    placeholder="Mínimo 6 caracteres"
                    minlength="6"
                />
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label for="edit-tipo">Tipo de Usuário *</label>
                    <select id="edit-tipo" name="tipo" required>
                        <option value="usuario">👤 Usuário</option>
                        <option value="admin">👑 Administrador</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="edit-ativo">Status *</label>
                    <select id="edit-ativo" name="ativo" required>
                        <option value="Sim">✓ Ativo</option>
                        <option value="Não">✗ Inativo</option>
                    </select>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    💾 Salvar Alterações
                </button>
                <button type="button" class="btn btn-secondary" onclick="closeModal('modal-edit-usuario')">
                    ❌ Cancelar
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    // Função para alternar sub-tabs
    function showSubTab(tabId) {
        // Remover active de todos os botões e conteúdos
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.sub-tab-content').forEach(content => content.classList.remove('active'));

        // Adicionar active no botão clicado
        event.target.classList.add('active');

        // Mostrar conteúdo correspondente
        document.getElementById(tabId).classList.add('active');
    }

    function closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
</script>
```

---

## 3️⃣ CRIAR ABA DE PERMISSÕES (NOVA)

**Adicionar DEPOIS da aba de Usuários (procurar por `</div><!-- fim usuarios -->` e adicionar logo após):**

```html
<!-- ========================================
     ABA: PERMISSÕES
     ======================================== -->
<div id="permissoes" class="tab-content">
    <h2>🔐 Gerenciamento de Permissões</h2>

    <div class="card">
        <h3>Selecionar Usuário</h3>
        <p class="text-muted">Escolha um usuário para configurar suas permissões de acesso</p>

        <div class="form-group">
            <label for="select-usuario-permissoes">Usuário</label>
            <select id="select-usuario-permissoes" class="form-control-lg">
                <option value="">-- Selecione um Usuário --</option>
            </select>
        </div>
    </div>

    <div id="permissoes-matriz">
        <div style="text-align: center; padding: 3rem; color: #6b7280;">
            <p>👆 Selecione um usuário acima para configurar suas permissões</p>
        </div>
    </div>
</div>
```

---

## 4️⃣ ATUALIZAR SIDEBAR (Adicionar item de menu)

**Localizar a seção da sidebar onde estão os outros itens de menu e ADICIONAR:**

```html
<!-- Dentro do <ul class="submenu"> de Configurações, adicionar: -->
<li class="submenu-item" onclick="showTab('permissoes')">
    🔐 Permissões
</li>
```

**OU se não houver submenu de Configurações, adicionar como item principal:**

```html
<li class="sidebar-item" onclick="showTab('permissoes')">
    <span class="menu-icon">🔐</span>
    <span class="menu-text">Permissões</span>
</li>
```

---

## 5️⃣ TROCAR SCRIPT.JS POR APP.JS (Ativar Módulos)

**Localizar ANTES de `</body>` a linha:**

```html
<script src="script.js"></script>
```

**E SUBSTITUIR por:**

```html
<script type="module" src="js/app.js"></script>
```

**⚠️ IMPORTANTE:** Isso ativa a arquitetura modular ES6. Se quiser manter o script.js como fallback, pode comentar em vez de remover:

```html
<!-- <script src="script.js"></script> -->
<script type="module" src="js/app.js"></script>
```

---

## ✅ CHECKLIST DE MODIFICAÇÕES

- [ ] Modal de login adicionado antes de `</body>`
- [ ] Aba de usuários modificada (com tabs secundárias)
- [ ] Modal de edição de usuário adicionado
- [ ] Aba de permissões criada
- [ ] Item "Permissões" adicionado na sidebar
- [ ] Script trocado de `script.js` para `js/app.js`

---

**Próximo passo:** Adicionar estilos CSS em [styles.css](styles.css)
