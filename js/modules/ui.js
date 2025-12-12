// ========================================
// MÓDULO DE INTERFACE DO USUÁRIO (UI)
// ========================================

import { salvarLocal, carregarLocal, formatarDataHeader } from './utils.js';
import { UI_CONSTANTS } from './config.js';

/**
 * Sistema de Notificações/Toasts
 */
let notificationTimeout;

export function showNotification(mensagem, tipo = 'success', duracao = 3000) {
    // Remove notificação anterior se existir
    const existente = document.querySelector('.notification-toast');
    if (existente) {
        existente.remove();
        clearTimeout(notificationTimeout);
    }

    // Criar elemento de notificação
    const toast = document.createElement('div');
    toast.className = `notification-toast notification-${tipo}`;
    toast.innerHTML = `
        <span class="notification-icon">${getNotificationIcon(tipo)}</span>
        <span class="notification-message">${mensagem}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    // Adicionar ao body
    document.body.appendChild(toast);

    // Mostrar com animação
    setTimeout(() => toast.classList.add('show'), 10);

    // Remover automaticamente
    notificationTimeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duracao);
}

function getNotificationIcon(tipo) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[tipo] || icons.info;
}

/**
 * Modal genérico
 */
export function showModal(titulo, conteudo, opcoes = {}) {
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${titulo}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">×</button>
            </div>
            <div class="modal-body">
                ${conteudo}
            </div>
            ${opcoes.botoes ? `
                <div class="modal-footer">
                    ${opcoes.botoes.map(btn => `
                        <button class="btn ${btn.classe || 'btn-secondary'}"
                                onclick="${btn.onclick}">${btn.texto}</button>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;

    document.body.appendChild(modal);

    // Fechar ao clicar fora
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    return modal;
}

/**
 * Confirmação
 */
export function showConfirm(mensagem, onConfirm, onCancel = null) {
    const modal = showModal('Confirmação', `<p>${mensagem}</p>`, {
        botoes: [
            {
                texto: 'Cancelar',
                classe: 'btn-secondary',
                onclick: `this.closest('.modal').remove(); ${onCancel ? onCancel : ''}`
            },
            {
                texto: 'Confirmar',
                classe: 'btn-danger',
                onclick: `this.closest('.modal').remove(); (${onConfirm})()`
            }
        ]
    });
    return modal;
}

/**
 * Loading overlay
 */
export function showLoading(mensagem = 'Carregando...') {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner"></div>
        <p>${mensagem}</p>
    `;
    document.body.appendChild(loading);
}

export function hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) {
        loading.remove();
    }
}

/**
 * Sistema de Tabs
 */
export function showTab(tabName) {
    // Esconder todas as tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Mostrar tab selecionada
    const tab = document.getElementById(tabName);
    if (tab) {
        tab.classList.add('active');
        updateActiveMenuItem(tabName);

        // Salvar última tab visitada
        salvarLocal('ultimaTab', tabName);
    }
}

/**
 * Atualizar item ativo no menu
 */
export function updateActiveMenuItem(tabName) {
    // Remove active de todos os itens
    document.querySelectorAll('.sidebar-item, .submenu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Adiciona active no item correspondente
    const items = document.querySelectorAll('.sidebar-item, .submenu-item');
    items.forEach(item => {
        const onclick = item.getAttribute('onclick');
        if (onclick && onclick.includes(`'${tabName}'`)) {
            item.classList.add('active');

            // Se for submenu-item, abrir o submenu pai
            if (item.classList.contains('submenu-item')) {
                const submenu = item.closest('.submenu');
                const parent = submenu?.previousElementSibling;
                if (submenu && parent) {
                    submenu.classList.add('open');
                    parent.classList.add('open');
                }
            }
        }
    });
}

/**
 * Sistema de Sidebar
 */
export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('sidebar-collapsed');

    // Salvar estado no localStorage
    const isCollapsed = sidebar.classList.contains('collapsed');
    salvarLocal('sidebarCollapsed', isCollapsed);
}

export function toggleSubmenu(element) {
    const submenu = element.nextElementSibling;
    const isOpen = submenu.classList.contains('open');

    // Fechar todos os submenus
    document.querySelectorAll('.submenu').forEach(sub => {
        sub.classList.remove('open');
    });
    document.querySelectorAll('.submenu-parent').forEach(parent => {
        parent.classList.remove('open');
    });

    // Abrir o submenu clicado (se não estava aberto)
    if (!isOpen) {
        submenu.classList.add('open');
        element.classList.add('open');
    }
}

/**
 * Restaurar estado da sidebar
 */
export function restaurarSidebar() {
    const isCollapsed = carregarLocal('sidebarCollapsed', false);
    if (isCollapsed) {
        document.getElementById('sidebar')?.classList.add('collapsed');
        document.getElementById('mainContent')?.classList.add('sidebar-collapsed');
    }
}

/**
 * Restaurar última tab
 */
export function restaurarUltimaTab() {
    const ultimaTab = carregarLocal('ultimaTab', 'dashboard');
    showTab(ultimaTab);
}

/**
 * Atualizar data no header
 */
export function atualizarDataHeader() {
    const dataEl = document.getElementById('data-hoje');
    if (dataEl) {
        dataEl.textContent = formatarDataHeader();
    }
}

/**
 * Renderizar tabela genérica
 */
export function renderTable(dados, colunas, acoes) {
    if (!dados || dados.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>Nenhum registro encontrado</h3>
                <p>Comece adicionando um novo registro</p>
            </div>
        `;
    }

    return `
        <table class="table">
            <thead>
                <tr>
                    ${colunas.map(col => `<th>${col.label}</th>`).join('')}
                    ${acoes ? '<th class="th-acoes">Ações</th>' : ''}
                </tr>
            </thead>
            <tbody>
                ${dados.map(item => `
                    <tr>
                        ${colunas.map(col => `
                            <td>${col.render ? col.render(item[col.field], item) : item[col.field] || '-'}</td>
                        `).join('')}
                        ${acoes ? `<td class="td-acoes">${acoes(item)}</td>` : ''}
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

/**
 * Renderizar cards em grid
 */
export function renderCards(dados, renderCard) {
    if (!dados || dados.length === 0) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <h3>Nenhum registro encontrado</h3>
            </div>
        `;
    }

    return `
        <div class="cards-grid">
            ${dados.map(item => renderCard(item)).join('')}
        </div>
    `;
}

/**
 * Inicialização da UI
 */
export function initUI() {
    // Restaurar estado do sidebar
    restaurarSidebar();

    // Atualizar data no header
    atualizarDataHeader();

    // Restaurar última tab visitada
    restaurarUltimaTab();

    // Adicionar estilos de notificação se não existir
    addNotificationStyles();
}

/**
 * Adicionar estilos de notificação dinamicamente
 */
function addNotificationStyles() {
    if (document.getElementById('notification-styles')) return;

    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        .notification-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 300px;
            max-width: 500px;
            padding: 16px 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateX(calc(100% + 40px));
            transition: transform 0.3s ease;
            z-index: 10000;
            border-left: 4px solid;
        }
        .notification-toast.show {
            transform: translateX(0);
        }
        .notification-toast.notification-success {
            border-left-color: #10b981;
        }
        .notification-toast.notification-error {
            border-left-color: #ef4444;
        }
        .notification-toast.notification-warning {
            border-left-color: #f59e0b;
        }
        .notification-toast.notification-info {
            border-left-color: #3b82f6;
        }
        .notification-icon {
            font-size: 20px;
            font-weight: bold;
        }
        .notification-success .notification-icon {
            color: #10b981;
        }
        .notification-error .notification-icon {
            color: #ef4444;
        }
        .notification-warning .notification-icon {
            color: #f59e0b;
        }
        .notification-info .notification-icon {
            color: #3b82f6;
        }
        .notification-message {
            flex: 1;
            font-size: 14px;
            color: #333;
        }
        .notification-close {
            background: none;
            border: none;
            font-size: 24px;
            color: #999;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .notification-close:hover {
            color: #333;
        }
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        }
        .loading-spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        .loading-overlay p {
            color: white;
            margin-top: 16px;
            font-size: 16px;
        }
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #666;
        }
        .empty-state-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
        }
        .empty-state h3 {
            margin: 0 0 8px 0;
            color: #333;
        }
        .empty-state p {
            margin: 0;
            color: #999;
        }
    `;
    document.head.appendChild(style);
}

// Exportar funções globais para compatibilidade com onclick no HTML
if (typeof window !== 'undefined') {
    window.showTab = showTab;
    window.toggleSidebar = toggleSidebar;
    window.toggleSubmenu = toggleSubmenu;
}
