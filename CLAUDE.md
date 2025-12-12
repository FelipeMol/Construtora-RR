# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Construction Works Management System** (Sistema de Controle de Obras) - a single-page web application for managing construction projects, employees, companies, and daily time tracking. Built with vanilla JavaScript, PHP REST APIs, and MySQL database, deployed on HostGator shared hosting.

**Tech Stack:**
- Frontend: Vanilla JavaScript (ES6+), HTML5, CSS3
- Backend: PHP 7+ with PDO (MySQL)
- Database: MySQL 5.7+
- Hosting: HostGator shared hosting environment

## Architecture

⚠️ **IMPORTANTE:** O projeto possui duas arquiteturas (versão antiga e versão refatorada).

### 🆕 Nova Arquitetura Modular (RECOMENDADA)

O código JavaScript foi refatorado em **módulos ES6** para melhor organização e manutenibilidade.

**Estrutura de Módulos:**
```
js/
├── app.js                      → Entry point principal
└── modules/
    ├── config.js              → Configurações e constantes
    ├── api.js                 → Comunicação com APIs backend
    ├── utils.js               → Funções utilitárias (30+ helpers)
    ├── ui.js                  → Interface (sidebar, tabs, modais, notificações)
    ├── components.js          → Componentes reutilizáveis
    ├── store.js               → Gerenciamento centralizado de estado
    └── empresas.js            → Módulo de negócio (Empresas)
        (outros módulos a implementar: funcionarios.js, obras.js, lancamentos.js, avaliacoes.js)
```

**Como ativar:** Trocar em [index.html](index.html):
```html
<!-- De: --> <script src="script.js"></script>
<!-- Para: --> <script type="module" src="js/app.js"></script>
```

**Vantagens:**
- ✅ Código organizado em 8 módulos especializados
- ✅ State management centralizado (tipo Redux)
- ✅ Componentes reutilizáveis
- ✅ Debug avançado com histórico de estado
- ✅ Sem build tools (ES6 nativo do navegador)

Ver [MIGRATION_GUIDE.md](MIGRATION_GUIDE.md) para detalhes completos.

### 📜 Arquitetura Antiga (Funcional, mas monolítica)

- **[index.html](index.html)** (1,214 lines) - Single-page application with all UI sections
- **[script.js](script.js)** (3,946 lines) - ARQUIVO ANTIGO - Complete client-side logic (mantido como backup)
- **[styles.css](styles.css)** (3,844 lines) - All styling (compartilhado entre as duas versões)

### Backend APIs (PHP RESTful)
Each API file follows the same pattern: GET (list), POST (create), PUT (update), DELETE (remove)

- **[api_empresas.php](api_empresas.php)** - Companies/Contractors management
- **[api_funcionarios.php](api_funcionarios.php)** - Employees management
- **[api_obras.php](api_obras.php)** - Construction sites management
- **[api_lancamentos.php](api_lancamentos.php)** - Daily time/work entries
- **[api_funcoes.php](api_funcoes.php)** - Job functions/roles
- **[api_responsaveis.php](api_responsaveis.php)** - Site managers

All APIs include `require_once 'config.php'` and use shared helper functions.

### Database Configuration
- **[config.php](config.php)** - Database connection (PDO), CORS headers, error handling, shared utility functions
- **[database.sql](database.sql)** - Complete schema with 8 tables: usuarios, empresas, obras, funcionarios, lancamentos, avaliacoes, funcoes, responsaveis

**Important:** Database credentials are in [config.php](config.php#L24-L26):
```php
$dbname = 'hg253b74_controleobras';
$username = 'hg253b74_Felipe';
$password = 'Warning81#';
```

## Key Features & Modules

### 1. Sidebar Navigation System
- **Collapsible sidebar** (280px expanded / 70px collapsed)
- State persisted in localStorage
- Functions: `toggleSidebar()`, `toggleSubmenu()`, `updateActiveMenuItem()`
- Submenu structure for "Cadastros" with 6 sub-items

### 2. Tab System
- `showTab(tabName)` - Main navigation function
- All content in `<div class="tab-content">` with `.active` class for visibility
- Tabs: dashboard, lancamentos, funcionarios, obras, empresas, avaliacoes, projetos, usuarios, base, relatorios, configuracoes, backup

### 3. API Communication Pattern
```javascript
// All API calls use fetchAPI() wrapper
const API_CONFIG = {
    baseURL: '', // Relative paths for HostGator
    endpoints: { empresas, funcionarios, obras, lancamentos }
};

async function fetchAPI(endpoint, options = {}) {
    // Returns: { sucesso: boolean, dados: any, mensagem: string }
}
```

### 4. Data Tables Pattern
Each entity (funcionarios, empresas, obras, lancamentos) follows this pattern:
- `listar{Entity}()` - Fetch and render data
- `adicionar{Entity}()` - Create new record
- `editar{Entity}(id)` - Update existing record
- `excluir{Entity}(id)` - Delete with confirmation
- Global arrays: `empresas[]`, `funcionarios[]`, `obras[]`, `lancamentos[]`

### 5. Modal System
- `.modal` with `.modal-content` structure
- Functions: `abrirModal{Name}()`, `fecharModal{Name}()`
- Form validation before submission
- Close on backdrop click or X button

### 6. Employee Evaluation System
- Star rating system (0-5 stars) with 6 criteria
- Visual cards with avatars (initials), function badges
- State management in `AvaliacaoState` object
- Functions: `abrirFormularioAvaliacao(id)`, `salvarAvaliacao()`

## Development Commands

### Database Operations
```bash
# Import schema to HostGator via phpMyAdmin
# 1. Access cPanel → phpMyAdmin
# 2. Select database: hg253b74_controleobras
# 3. Import database.sql

# Test database connection
php -r "require 'config.php'; echo 'Connected!';"
```

### Local Testing
```bash
# Start PHP built-in server (if testing locally)
php -S localhost:8000

# Access application
# http://localhost:8000/index.html
```

### Debugging
- PHP errors logged to `php_errors.log` (configured in [config.php](config.php#L9))
- Browser Console for JavaScript errors
- API responses always return JSON: `{ sucesso: boolean, dados: any, mensagem: string }`

## Important Conventions

### Database Table Patterns
All tables include:
- `id BIGINT AUTO_INCREMENT PRIMARY KEY`
- `criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- `atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
- Indexes on frequently queried columns

### Time Format Handling
- Database stores: `TIME` as `HH:MM:SS`
- Frontend displays: `HH:MM` (seconds stripped in API responses)
- Normalize with: `substr($horas, 0, 5)` in PHP or `value.slice(0, 5)` in JS

### Data Sanitization
Always use in PHP APIs:
```php
$value = sanitizar($dados['field']); // Defined in config.php
```

### Error Handling Pattern
```php
// PHP APIs
try {
    // database operation
    resposta_json(true, $data, 'Success message');
} catch (PDOException $e) {
    resposta_json(false, null, 'Error: ' . $e->getMessage());
}
```

```javascript
// Frontend
try {
    const result = await fetchAPI(endpoint, options);
    if (result.sucesso) {
        // handle success
    } else {
        mostrarMensagem(result.mensagem, 'erro');
    }
} catch (error) {
    mostrarMensagem('Erro de conexão', 'erro');
}
```

## HostGator Deployment

### File Structure on Server
```
/public_html/
├── index.html
├── script.js
├── styles.css
├── config.php
├── api_*.php (6 files)
├── database.sql (reference only)
└── assets/
    └── logo.png
```

### Deployment Steps
1. Update [config.php](config.php#L24-L26) with HostGator database credentials
2. Create MySQL database via cPanel → MySQL Databases
3. Import [database.sql](database.sql) via phpMyAdmin
4. Upload all files to `/public_html/` via File Manager or FTP
5. Set file permissions: PHP files = 644, directories = 755
6. Access: `https://vivicontroldeobras.com.br`

### Production Considerations
- Error display disabled in [config.php](config.php#L3-L4) (`display_errors = 0`)
- Errors logged to `php_errors.log`
- CORS headers set to `*` for all origins (line 29)
- Cache busting via `APP_VERSION` constant in [script.js](script.js#L111)

## Sprint Documentation

The project has detailed sprint documentation showing feature evolution:
- **[SPRINT_1_COMPLETO.md](SPRINT_1_COMPLETO.md)** - Initial features and UI
- **[SPRINT_2_COMPLETO.md](SPRINT_2_COMPLETO.md)** - Sidebar implementation and responsive design
- **[SPRINT_3_EDITAR_EXCLUIR.md](SPRINT_3_EDITAR_EXCLUIR.md)** - Edit/Delete functionality for all entities

## Code Navigation Tips

### Finding Entity Logic
- **Funcionários (Employees):** Search for `function.*[Ff]uncionario` in [script.js](script.js)
- **Empresas (Companies):** Search for `function.*[Ee]mpresa` in [script.js](script.js)
- **Obras (Sites):** Search for `function.*[Oo]bra` in [script.js](script.js)
- **Lançamentos (Entries):** Search for `function.*[Ll]ancamento` in [script.js](script.js)

### Finding UI Sections
All sections in [index.html](index.html) use: `<div id="{section-name}" class="tab-content">`

### Finding API Endpoints
All API files follow RESTful pattern with switch statement: `switch ($metodo) { case 'GET': ... case 'POST': ... case 'PUT': ... case 'DELETE': ... }`

## Working with New Modular Architecture

### Module Structure

Cada módulo tem responsabilidade única:

1. **[config.js](js/modules/config.js)** - Configurações, constantes, mensagens
2. **[api.js](js/modules/api.js)** - Wrapper para fetch, funções de API por entidade
3. **[utils.js](js/modules/utils.js)** - Formatação, validação, busca, ordenação
4. **[ui.js](js/modules/ui.js)** - Notificações, modais, loading, tabs, sidebar
5. **[components.js](js/modules/components.js)** - Tabelas, badges, forms, cards
6. **[store.js](js/modules/store.js)** - Estado centralizado com observadores
7. **[empresas.js](js/modules/empresas.js)** - Exemplo completo de módulo de entidade
8. **[app.js](js/app.js)** - Entry point que inicializa tudo

### Creating New Entity Module

Siga o padrão de [empresas.js](js/modules/empresas.js):

```javascript
// js/modules/nova-entidade.js
import { NovaEntidadeAPI } from './api.js';
import { novaEntidadeActions } from './store.js';
import { showNotification, showLoading, hideLoading } from './ui.js';
import { ResponsiveTable, TableActions } from './components.js';

export async function initNovaEntidade() {
    await carregarNovaEntidade();
    setupEventListeners();
}

export async function carregarNovaEntidade() {
    try {
        showLoading('Carregando...');
        const response = await NovaEntidadeAPI.listar();
        if (response.sucesso) {
            novaEntidadeActions.set(response.dados || []);
            renderizarNovaEntidade();
        }
    } finally {
        hideLoading();
    }
}

export function renderizarNovaEntidade() {
    // Usar ResponsiveTable do components.js
}

// Implementar CRUD: criar, editar, excluir

// Exportar para window (onclick compatibility)
if (typeof window !== 'undefined') {
    window.editarNovaEntidade = editarNovaEntidade;
    window.excluirNovaEntidade = excluirNovaEntidade;
}
```

Depois adicionar em [app.js](js/app.js):
```javascript
import { initNovaEntidade, carregarNovaEntidade } from './modules/nova-entidade.js';

// Em carregarDadosIniciais():
await Promise.all([
    carregarEmpresas(),
    carregarNovaEntidade() // ← adicionar aqui
]);

// Em initApp():
await initNovaEntidade(); // ← adicionar aqui
```

### Using Store for State Management

```javascript
import { empresasActions, useSubscribe } from './modules/store.js';

// Ler dados
const empresas = empresasActions.getAll();
const empresa = empresasActions.findById(5);

// Modificar dados
empresasActions.set([...]); // Substituir todos
empresasActions.add(newEmpresa); // Adicionar
empresasActions.update(id, updates); // Atualizar
empresasActions.remove(id); // Remover

// Observar mudanças
useSubscribe('empresas', (empresas) => {
    console.log('Empresas atualizadas', empresas);
    renderizarEmpresas(); // Re-render automático
});
```

### Using Components

```javascript
import { ResponsiveTable, Badge, FormField, TableActions } from './modules/components.js';

// Tabela responsiva
const html = ResponsiveTable({
    colunas: [
        { field: 'nome', label: 'Nome', render: (v) => `<strong>${v}</strong>` },
        { field: 'situacao', label: 'Status', render: (v) => Badge({ texto: v, tipo: 'success' }) }
    ],
    dados: items,
    acoes: (item) => TableActions(item, {
        onEdit: 'editarItem',
        onDelete: 'excluirItem'
    })
});

container.innerHTML = html;
```

### Debugging

Console do navegador expõe ferramentas:

```javascript
AppDebug.getState();       // Ver estado completo
AppDebug.getHistory();     // Ver histórico de mudanças
AppDebug.reset();          // Resetar estado
AppStore.debug();          // Debug do store
```

## Common Modifications

### Adding New Entity (Nova Arquitetura)
1. Create database table in [database.sql](database.sql)
2. Create `api_{entity}.php` following existing pattern
3. Add endpoint to `API_CONFIG.endpoints` in [script.js](script.js#L96)
4. Add global array: `let {entities} = [];`
5. Add HTML section in [index.html](index.html)
6. Implement CRUD functions: `listar{Entity}()`, `adicionar{Entity}()`, etc.
7. Add sidebar menu item with onclick: `showTab('{entity}')`

### Modifying Table Columns
1. Update database table with `ALTER TABLE`
2. Update `SELECT` and `INSERT/UPDATE` queries in corresponding `api_{entity}.php`
3. Update form fields in [index.html](index.html)
4. Update rendering functions in [script.js](script.js)

### Styling Changes
- Modern CSS with CSS Grid and Flexbox
- Color scheme: Primary blue `#2563eb`, success green `#10b981`, error red `#ef4444`
- Use existing utility classes: `.btn-primary`, `.btn-success`, `.btn-danger`, `.card`, `.modal`, etc.
- Responsive breakpoints in [styles.css](styles.css): 768px (tablets), 480px (mobile)
