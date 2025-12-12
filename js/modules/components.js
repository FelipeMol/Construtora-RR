// ========================================
// MÓDULO DE COMPONENTES REUTILIZÁVEIS
// ========================================

/**
 * Componente de Badge de Status
 */
export function Badge({ texto, tipo = 'default' }) {
    const classes = {
        default: 'badge-default',
        success: 'badge-success',
        danger: 'badge-danger',
        warning: 'badge-warning',
        info: 'badge-info',
        ativo: 'badge-success',
        inativo: 'badge-danger'
    };

    const classe = classes[tipo.toLowerCase()] || classes.default;

    return `<span class="badge ${classe}">${texto}</span>`;
}

/**
 * Componente de Botão de Ação
 */
export function ActionButton({ icon, texto, onClick, classe = 'btn-primary', tipo = 'button' }) {
    return `
        <button type="${tipo}" class="btn ${classe}" onclick="${onClick}">
            ${icon ? `<span class="btn-icon">${icon}</span>` : ''}
            ${texto}
        </button>
    `;
}

/**
 * Componente de Botões de Ação em Tabela
 */
export function TableActions(item, opcoes = {}) {
    const { onEdit, onDelete, onView, customActions = [] } = opcoes;

    const botoes = [];

    if (onView) {
        botoes.push(`
            <button class="btn-icon-table btn-view"
                    onclick="${onView}(${item.id})"
                    title="Visualizar">
                👁️
            </button>
        `);
    }

    if (onEdit) {
        botoes.push(`
            <button class="btn-icon-table btn-edit"
                    onclick="${onEdit}(${item.id})"
                    title="Editar">
                ✏️
            </button>
        `);
    }

    if (onDelete) {
        botoes.push(`
            <button class="btn-icon-table btn-delete"
                    onclick="${onDelete}(${item.id})"
                    title="Excluir">
                🗑️
            </button>
        `);
    }

    // Ações customizadas
    customActions.forEach(action => {
        botoes.push(`
            <button class="btn-icon-table ${action.classe || ''}"
                    onclick="${action.onClick}(${item.id})"
                    title="${action.titulo}">
                ${action.icon}
            </button>
        `);
    });

    return botoes.join('');
}

/**
 * Componente de Card
 */
export function Card({ titulo, conteudo, footer, icone, classe = '' }) {
    return `
        <div class="card ${classe}">
            ${titulo ? `
                <div class="card-header">
                    ${icone ? `<span class="card-icon">${icone}</span>` : ''}
                    <h3>${titulo}</h3>
                </div>
            ` : ''}
            <div class="card-body">
                ${conteudo}
            </div>
            ${footer ? `
                <div class="card-footer">
                    ${footer}
                </div>
            ` : ''}
        </div>
    `;
}

/**
 * Componente de Input de Busca
 */
export function SearchInput({ id, placeholder = 'Buscar...', onSearch }) {
    return `
        <div class="search-input-container">
            <input type="text"
                   id="${id}"
                   class="search-input"
                   placeholder="${placeholder}"
                   oninput="${onSearch}(this.value)">
            <span class="search-icon">🔍</span>
        </div>
    `;
}

/**
 * Componente de Filtro
 */
export function FilterSelect({ id, label, opcoes, onChange, valorPadrao = '' }) {
    return `
        <div class="filter-group">
            ${label ? `<label for="${id}">${label}</label>` : ''}
            <select id="${id}" class="filter-select" onchange="${onChange}(this.value)">
                <option value="">Todos</option>
                ${opcoes.map(opt => `
                    <option value="${opt.value}" ${opt.value === valorPadrao ? 'selected' : ''}>
                        ${opt.label}
                    </option>
                `).join('')}
            </select>
        </div>
    `;
}

/**
 * Componente de Paginação
 */
export function Pagination({ totalItens, itensPorPagina, paginaAtual, onChange }) {
    const totalPaginas = Math.ceil(totalItens / itensPorPagina);
    if (totalPaginas <= 1) return '';

    const paginas = [];
    const maxPaginas = 5;

    let inicio = Math.max(1, paginaAtual - Math.floor(maxPaginas / 2));
    let fim = Math.min(totalPaginas, inicio + maxPaginas - 1);

    if (fim - inicio < maxPaginas - 1) {
        inicio = Math.max(1, fim - maxPaginas + 1);
    }

    for (let i = inicio; i <= fim; i++) {
        paginas.push(i);
    }

    return `
        <div class="pagination">
            <button class="pagination-btn"
                    ${paginaAtual === 1 ? 'disabled' : ''}
                    onclick="${onChange}(${paginaAtual - 1})">
                ‹
            </button>

            ${inicio > 1 ? `
                <button class="pagination-btn" onclick="${onChange}(1)">1</button>
                ${inicio > 2 ? '<span class="pagination-dots">...</span>' : ''}
            ` : ''}

            ${paginas.map(p => `
                <button class="pagination-btn ${p === paginaAtual ? 'active' : ''}"
                        onclick="${onChange}(${p})">
                    ${p}
                </button>
            `).join('')}

            ${fim < totalPaginas ? `
                ${fim < totalPaginas - 1 ? '<span class="pagination-dots">...</span>' : ''}
                <button class="pagination-btn" onclick="${onChange}(${totalPaginas})">${totalPaginas}</button>
            ` : ''}

            <button class="pagination-btn"
                    ${paginaAtual === totalPaginas ? 'disabled' : ''}
                    onclick="${onChange}(${paginaAtual + 1})">
                ›
            </button>
        </div>
    `;
}

/**
 * Componente de Form Field
 */
export function FormField({
    id,
    label,
    tipo = 'text',
    required = false,
    placeholder = '',
    valor = '',
    opcoes = [], // Para select
    disabled = false,
    classe = ''
}) {
    const requiredAttr = required ? 'required' : '';
    const disabledAttr = disabled ? 'disabled' : '';

    if (tipo === 'select') {
        return `
            <div class="form-group ${classe}">
                <label for="${id}">
                    ${label}
                    ${required ? '<span class="required">*</span>' : ''}
                </label>
                <select id="${id}"
                        class="form-control"
                        ${requiredAttr}
                        ${disabledAttr}>
                    <option value="">Selecione...</option>
                    ${opcoes.map(opt => `
                        <option value="${opt.value || opt}" ${(opt.value || opt) === valor ? 'selected' : ''}>
                            ${opt.label || opt}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    if (tipo === 'textarea') {
        return `
            <div class="form-group ${classe}">
                <label for="${id}">
                    ${label}
                    ${required ? '<span class="required">*</span>' : ''}
                </label>
                <textarea id="${id}"
                          class="form-control"
                          placeholder="${placeholder}"
                          ${requiredAttr}
                          ${disabledAttr}>${valor}</textarea>
            </div>
        `;
    }

    return `
        <div class="form-group ${classe}">
            <label for="${id}">
                ${label}
                ${required ? '<span class="required">*</span>' : ''}
            </label>
            <input type="${tipo}"
                   id="${id}"
                   class="form-control"
                   placeholder="${placeholder}"
                   value="${valor}"
                   ${requiredAttr}
                   ${disabledAttr}>
        </div>
    `;
}

/**
 * Componente de Estatística (para dashboard)
 */
export function StatCard({ titulo, valor, icone, cor = 'blue', trend }) {
    return `
        <div class="stat-card stat-card-${cor}">
            <div class="stat-card-content">
                <div class="stat-card-header">
                    <span class="stat-card-titulo">${titulo}</span>
                    <span class="stat-card-icone">${icone}</span>
                </div>
                <div class="stat-card-valor">${valor}</div>
                ${trend ? `
                    <div class="stat-card-trend ${trend.tipo}">
                        <span class="trend-icon">${trend.tipo === 'up' ? '↑' : '↓'}</span>
                        <span class="trend-valor">${trend.valor}</span>
                        <span class="trend-label">${trend.label || 'vs mês anterior'}</span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

/**
 * Componente de Tabela Responsiva
 */
export function ResponsiveTable({ colunas, dados, acoes, emptyMessage = 'Nenhum registro encontrado' }) {
    if (!dados || dados.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>${emptyMessage}</h3>
            </div>
        `;
    }

    return `
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        ${colunas.map(col => `
                            <th class="${col.classe || ''}">${col.label}</th>
                        `).join('')}
                        ${acoes ? '<th class="th-acoes">Ações</th>' : ''}
                    </tr>
                </thead>
                <tbody>
                    ${dados.map(item => `
                        <tr>
                            ${colunas.map(col => `
                                <td data-label="${col.label}" class="${col.classe || ''}">
                                    ${col.render ? col.render(item[col.field], item) : (item[col.field] || '-')}
                                </td>
                            `).join('')}
                            ${acoes ? `
                                <td class="td-acoes" data-label="Ações">
                                    ${acoes(item)}
                                </td>
                            ` : ''}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Componente de Avaliação com Estrelas
 */
export function StarRating({ id, valor = 0, max = 5, readonly = false }) {
    const stars = [];
    for (let i = 1; i <= max; i++) {
        const filled = i <= valor;
        stars.push(`
            <span class="star ${filled ? 'star-filled' : 'star-empty'}"
                  ${!readonly ? `onclick="document.getElementById('${id}').value=${i}; updateStars('${id}', ${i}, ${max})"` : ''}
                  style="cursor: ${readonly ? 'default' : 'pointer'}">
                ${filled ? '★' : '☆'}
            </span>
        `);
    }

    return `
        <div class="star-rating" id="${id}-container">
            ${stars.join('')}
            <input type="hidden" id="${id}" value="${valor}">
        </div>
    `;
}

/**
 * Componente de Alert
 */
export function Alert({ tipo = 'info', mensagem, titulo, dismissible = false }) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    return `
        <div class="alert alert-${tipo}">
            <div class="alert-content">
                <span class="alert-icon">${icons[tipo]}</span>
                <div class="alert-message">
                    ${titulo ? `<div class="alert-titulo">${titulo}</div>` : ''}
                    <div>${mensagem}</div>
                </div>
            </div>
            ${dismissible ? '<button class="alert-close" onclick="this.parentElement.remove()">×</button>' : ''}
        </div>
    `;
}

// Função helper para atualizar estrelas (usada no StarRating)
if (typeof window !== 'undefined') {
    window.updateStars = function(id, valor, max) {
        const container = document.getElementById(id + '-container');
        const stars = container.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < valor) {
                star.classList.add('star-filled');
                star.classList.remove('star-empty');
                star.textContent = '★';
            } else {
                star.classList.remove('star-filled');
                star.classList.add('star-empty');
                star.textContent = '☆';
            }
        });
    };
}
