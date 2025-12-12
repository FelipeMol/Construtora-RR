// ========================================
// MÓDULO DE EMPRESAS
// ========================================

import { EmpresasAPI } from './api.js';
import { empresasActions } from './store.js';
import { showNotification, showConfirm, showLoading, hideLoading, renderTable } from './ui.js';
import { ResponsiveTable, TableActions, FormField, Badge } from './components.js';
import { MESSAGES } from './config.js';

/**
 * Inicializa o módulo de empresas
 */
export async function initEmpresas() {
    await carregarEmpresas();
    setupEventListeners();
}

/**
 * Carrega empresas da API
 */
export async function carregarEmpresas() {
    try {
        showLoading('Carregando empresas...');
        const response = await EmpresasAPI.listar();

        if (response.sucesso) {
            empresasActions.set(response.dados || []);
            renderizarEmpresas();
        } else {
            showNotification(response.mensagem || 'Erro ao carregar empresas', 'error');
        }
    } catch (error) {
        showNotification(MESSAGES.ERROR.NETWORK, 'error');
        console.error('Erro ao carregar empresas:', error);
    } finally {
        hideLoading();
    }
}

/**
 * Renderiza tabela de empresas
 */
export function renderizarEmpresas() {
    const container = document.getElementById('tabela-empresas');
    if (!container) return;

    const empresas = empresasActions.getAll();

    const html = ResponsiveTable({
        colunas: [
            {
                field: 'nome',
                label: 'Nome',
                render: (valor) => `<strong>${valor}</strong>`
            },
            {
                field: 'cnpj',
                label: 'CNPJ',
                render: (valor) => valor || '-'
            },
            {
                field: 'tipo',
                label: 'Tipo',
                render: (valor) => Badge({ texto: valor || 'Construtora', tipo: 'info' })
            }
        ],
        dados: empresas,
        acoes: (empresa) => TableActions(empresa, {
            onEdit: 'editarEmpresa',
            onDelete: 'excluirEmpresa'
        }),
        emptyMessage: 'Nenhuma empresa cadastrada'
    });

    container.innerHTML = html;
}

/**
 * Abre modal para adicionar empresa
 */
export function abrirModalAdicionarEmpresa() {
    const modalEmpresa = document.getElementById('modal-empresa');
    const modalTitulo = document.getElementById('modal-empresa-titulo');
    const form = document.getElementById('form-empresa');

    modalTitulo.textContent = 'Adicionar Empresa';
    form.reset();
    form.dataset.mode = 'create';
    delete form.dataset.empresaId;

    modalEmpresa.classList.add('show');
}

/**
 * Edita empresa existente
 */
export function editarEmpresa(id) {
    const empresa = empresasActions.findById(id);
    if (!empresa) {
        showNotification('Empresa não encontrada', 'error');
        return;
    }

    const modalEmpresa = document.getElementById('modal-empresa');
    const modalTitulo = document.getElementById('modal-empresa-titulo');
    const form = document.getElementById('form-empresa');

    modalTitulo.textContent = 'Editar Empresa';
    form.dataset.mode = 'edit';
    form.dataset.empresaId = id;

    // Preencher formulário
    document.getElementById('empresa-nome').value = empresa.nome || '';
    document.getElementById('empresa-cnpj').value = empresa.cnpj || '';
    document.getElementById('empresa-tipo').value = empresa.tipo || 'Construtora';

    modalEmpresa.classList.add('show');
}

/**
 * Salva empresa (criar ou atualizar)
 */
export async function salvarEmpresa(event) {
    event.preventDefault();

    const form = event.target;
    const mode = form.dataset.mode;
    const empresaId = form.dataset.empresaId;

    // Coletar dados do formulário
    const dados = {
        nome: document.getElementById('empresa-nome').value.trim(),
        cnpj: document.getElementById('empresa-cnpj').value.trim(),
        tipo: document.getElementById('empresa-tipo').value
    };

    // Validação
    if (!dados.nome) {
        showNotification('Nome da empresa é obrigatório', 'warning');
        return;
    }

    try {
        showLoading(mode === 'create' ? 'Criando empresa...' : 'Atualizando empresa...');

        let response;
        if (mode === 'create') {
            response = await EmpresasAPI.criar(dados);
        } else {
            response = await EmpresasAPI.atualizar(empresaId, dados);
        }

        if (response.sucesso) {
            showNotification(
                mode === 'create' ? MESSAGES.SUCCESS.CREATED : MESSAGES.SUCCESS.UPDATED,
                'success'
            );

            fecharModalEmpresa();
            await carregarEmpresas();
        } else {
            showNotification(response.mensagem || MESSAGES.ERROR.GENERIC, 'error');
        }
    } catch (error) {
        showNotification(MESSAGES.ERROR.NETWORK, 'error');
        console.error('Erro ao salvar empresa:', error);
    } finally {
        hideLoading();
    }
}

/**
 * Exclui empresa
 */
export async function excluirEmpresa(id) {
    const empresa = empresasActions.findById(id);
    if (!empresa) {
        showNotification('Empresa não encontrada', 'error');
        return;
    }

    showConfirm(
        `Tem certeza que deseja excluir a empresa <strong>${empresa.nome}</strong>?<br>
        <span style="color: #ef4444;">⚠️ Esta ação não pode ser desfeita!</span>`,
        async () => {
            try {
                showLoading('Excluindo empresa...');
                const response = await EmpresasAPI.excluir(id);

                if (response.sucesso) {
                    showNotification(MESSAGES.SUCCESS.DELETED, 'success');
                    await carregarEmpresas();
                } else {
                    showNotification(response.mensagem || MESSAGES.ERROR.GENERIC, 'error');
                }
            } catch (error) {
                showNotification(MESSAGES.ERROR.NETWORK, 'error');
                console.error('Erro ao excluir empresa:', error);
            } finally {
                hideLoading();
            }
        }
    );
}

/**
 * Fecha modal de empresa
 */
export function fecharModalEmpresa() {
    const modalEmpresa = document.getElementById('modal-empresa');
    modalEmpresa.classList.remove('show');
    document.getElementById('form-empresa').reset();
}

/**
 * Configura event listeners
 */
function setupEventListeners() {
    // Form submit
    const form = document.getElementById('form-empresa');
    if (form) {
        form.addEventListener('submit', salvarEmpresa);
    }

    // Botão adicionar
    const btnAdicionar = document.getElementById('btn-adicionar-empresa');
    if (btnAdicionar) {
        btnAdicionar.addEventListener('click', abrirModalAdicionarEmpresa);
    }

    // Botão fechar modal
    const btnFechar = document.getElementById('btn-fechar-modal-empresa');
    if (btnFechar) {
        btnFechar.addEventListener('click', fecharModalEmpresa);
    }
}

// Exportar funções para uso global (compatibilidade com onclick no HTML)
if (typeof window !== 'undefined') {
    window.editarEmpresa = editarEmpresa;
    window.excluirEmpresa = excluirEmpresa;
    window.abrirModalAdicionarEmpresa = abrirModalAdicionarEmpresa;
    window.fecharModalEmpresa = fecharModalEmpresa;
}
