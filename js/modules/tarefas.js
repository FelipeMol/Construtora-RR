// ========================================
// MÓDULO: TAREFAS (Kanban Board)
// ========================================

import { TarefasAPI, ComentariosAPI, UsuariosAPI } from './api.js';
import { tarefasActions, comentariosActions, tarefasFiltersActions, funcionariosActions, obrasActions, empresasActions, usuariosActions } from './store.js';
import { showNotification, showLoading, hideLoading, abrirModal, fecharModal } from './ui.js';
import { KanbanColumn, TaskCard, CommentThread, TaskFilterPanel } from './components.js';
import { MESSAGES, TAREFAS_CONFIG } from './config.js';
import { formatDate, gerarAvatar } from './utils.js';
import { ehAdmin as verificarEhAdmin, temPermissao, obterUsuario } from './auth.js';

// Estado local do módulo
let currentUsuario = null;
let isSavingTarefa = false; // Proteção contra double-submit

/**
 * Inicializar módulo de tarefas
 */
export async function initTarefas() {
    console.log('📋 Inicializando módulo de Tarefas...');

    // Obter usuário atual
    currentUsuario = obterUsuario();

    // Carregar usuários para dropdown
    try {
        const usuariosResponse = await UsuariosAPI.listar();
        if (usuariosResponse.sucesso) {
            usuariosActions.set(usuariosResponse.dados || []);
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }

    // Carregar tarefas
    await carregarTarefas();

    // Setup event listeners
    setupEventListeners();

    // Setup drag and drop
    setupDragAndDrop();

    console.log('  ✓ Módulo de Tarefas inicializado');
}

/**
 * Carregar tarefas da API
 */
export async function carregarTarefas() {
    try {
        showLoading('Carregando tarefas...');

        const response = await TarefasAPI.listar();

        if (response.sucesso) {
            tarefasActions.set(response.dados || []);
            renderizarKanban();
        } else {
            // Silenciar erros de permissão (403) e autenticação (401)
            const isSemPermissao = response.mensagem && (
                response.mensagem.includes('permissão') ||
                response.mensagem.includes('Token') ||
                response.mensagem.includes('Acesso negado')
            );

            if (!isSemPermissao) {
                showNotification(response.mensagem || MESSAGES.TAREFAS.ERROR.LOAD_FAILED, 'erro');
            }
            // Inicializar vazio
            tarefasActions.set([]);
            renderizarKanban();
        }
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        // Não mostrar erro para não assustar o usuário
        // Inicializar vazio
        tarefasActions.set([]);
        renderizarKanban();
    } finally {
        hideLoading();
    }
}

/**
 * Renderizar Kanban board completo
 */
export function renderizarKanban() {
    const container = document.getElementById('kanban-board');
    if (!container) return;

    // Aplicar filtros
    const tarefasFiltradas = tarefasActions.getFiltered();

    // Agrupar por status
    const porStatus = {
        'novo': tarefasFiltradas.filter(t => t.status === 'novo'),
        'em_andamento': tarefasFiltradas.filter(t => t.status === 'em_andamento'),
        'concluido': tarefasFiltradas.filter(t => t.status === 'concluido'),
        'cancelado': tarefasFiltradas.filter(t => t.status === 'cancelado')
    };

    // Renderizar colunas
    const html = `
        <div class="kanban-board">
            ${KanbanColumn({ status: 'novo', tarefas: porStatus.novo })}
            ${KanbanColumn({ status: 'em_andamento', tarefas: porStatus.em_andamento })}
            ${KanbanColumn({ status: 'concluido', tarefas: porStatus.concluido })}
            ${KanbanColumn({ status: 'cancelado', tarefas: porStatus.cancelado })}
        </div>
    `;

    container.innerHTML = html;

    // Atualizar contador de resultados
    atualizarContadorResultados(tarefasFiltradas.length, tarefasActions.getAll().length);
}

/**
 * Renderizar painel de filtros
 */
export function renderizarFiltros() {
    const container = document.getElementById('tarefas-filtros');
    if (!container) return;

    const filters = tarefasFiltersActions.get();
    const funcionarios = funcionariosActions.getAll();
    const obras = obrasActions.getAll();
    const empresas = empresasActions.getAll();

    container.innerHTML = TaskFilterPanel({ filters, funcionarios, obras, empresas });
}

/**
 * Atualizar contador de resultados
 */
function atualizarContadorResultados(filtradas, total) {
    const contador = document.getElementById('tarefas-contador');
    if (contador) {
        if (filtradas === total) {
            contador.textContent = `${total} tarefas`;
        } else {
            contador.textContent = `Exibindo ${filtradas} de ${total} tarefas`;
        }
    }
}

/**
 * Abrir formulário de nova tarefa
 */
export function abrirFormularioNovaTarefa() {
    console.log('🎯 Abrindo formulário de nova tarefa...');

    // Verificar permissão de criar tarefas
    if (!verificarEhAdmin() && !temPermissao('tarefas', 'criar')) {
        showNotification(MESSAGES.TAREFAS.ERROR.NO_PERMISSION, 'erro');
        return;
    }

    // Resetar formulário
    const form = document.getElementById('form-tarefa');
    if (form) {
        form.reset();
        form.dataset.tarefaId = '';
        console.log('✅ Formulário resetado');
    }

    // Preencher dropdowns
    console.log('📋 Preenchendo dropdowns...');
    preencherDropdownUsuarios();
    preencherDropdownObras();
    preencherDropdownEmpresas();

    // Configurar valores padrão
    const statusSelect = document.getElementById('tarefa-status');
    const prioridadeSelect = document.getElementById('tarefa-prioridade');

    if (statusSelect) statusSelect.value = 'novo';
    if (prioridadeSelect) prioridadeSelect.value = 'media';

    // Atualizar título do modal
    const modalTitle = document.querySelector('#modal-tarefa .modal-title');
    if (modalTitle) {
        modalTitle.textContent = 'Nova Tarefa';
        console.log('✅ Título do modal atualizado');
    }

    // Abrir modal
    console.log('🚀 Abrindo modal modal-tarefa...');
    abrirModal('modal-tarefa');
}

/**
 * Salvar tarefa (criar ou editar)
 */
export async function salvarTarefa(event) {
    if (event) event.preventDefault();

    // Proteção contra submissão duplicada
    if (isSavingTarefa) {
        console.warn('⚠️ Submissão já em andamento, ignorando duplicata');
        return;
    }

    const form = document.getElementById('form-tarefa');
    if (!form) return;

    const tarefaId = form.dataset.tarefaId;
    const isEdicao = !!tarefaId;

    // Ativar flag de proteção
    isSavingTarefa = true;

    // Coletar dados do formulário
    const dados = {
        titulo: document.getElementById('tarefa-titulo')?.value?.trim(),
        descricao: document.getElementById('tarefa-descricao')?.value?.trim(),
        status: document.getElementById('tarefa-status')?.value,
        prioridade: document.getElementById('tarefa-prioridade')?.value,
        usuario_responsavel_id: document.getElementById('tarefa-usuario-responsavel')?.value || null,
        obra_id: document.getElementById('tarefa-obra')?.value || null,
        empresa_id: document.getElementById('tarefa-empresa')?.value || null,
        data_prazo: document.getElementById('tarefa-prazo')?.value || null
    };

    // Validações
    if (!dados.titulo) {
        showNotification(MESSAGES.TAREFAS.ERROR.TITLE_REQUIRED, 'erro');
        isSavingTarefa = false;
        return;
    }

    if (dados.titulo.length < 3) {
        showNotification(MESSAGES.TAREFAS.ERROR.TITLE_MIN_LENGTH, 'erro');
        isSavingTarefa = false;
        return;
    }

    if (!dados.usuario_responsavel_id) {
        showNotification('Selecione um usuário responsável', 'erro');
        isSavingTarefa = false;
        return;
    }

    try {
        showLoading(isEdicao ? MESSAGES.LOADING.SAVING : 'Criando tarefa...');

        let response;
        if (isEdicao) {
            response = await TarefasAPI.atualizar(tarefaId, dados);
        } else {
            response = await TarefasAPI.criar(dados);
        }

        if (response.sucesso) {
            showNotification(
                isEdicao ? MESSAGES.TAREFAS.SUCCESS.UPDATED : MESSAGES.TAREFAS.SUCCESS.CREATED,
                'sucesso'
            );

            fecharModal('modal-tarefa');
            await carregarTarefas();
        } else {
            showNotification(response.mensagem || MESSAGES.ERROR.GENERIC, 'erro');
        }
    } catch (error) {
        console.error('Erro ao salvar tarefa:', error);
        showNotification(MESSAGES.ERROR.GENERIC, 'erro');
    } finally {
        hideLoading();
        // Resetar flag de proteção
        isSavingTarefa = false;
    }
}

/**
 * Abrir detalhes da tarefa em modal
 */
export async function abrirDetalhesTarefa(tarefaId) {
    const tarefa = tarefasActions.findById(tarefaId);
    if (!tarefa) {
        showNotification('Tarefa não encontrada', 'erro');
        return;
    }

    // Preencher modal com dados da tarefa
    const modalTitle = document.getElementById('detalhe-tarefa-titulo');
    const modalDescricao = document.getElementById('detalhe-tarefa-descricao');
    const modalStatus = document.getElementById('detalhe-tarefa-status');
    const modalPrioridade = document.getElementById('detalhe-tarefa-prioridade');
    const modalFuncionario = document.getElementById('detalhe-tarefa-funcionario');
    const modalObra = document.getElementById('detalhe-tarefa-obra');
    const modalEmpresa = document.getElementById('detalhe-tarefa-empresa');
    const modalPrazo = document.getElementById('detalhe-tarefa-prazo');
    const modalCriadoEm = document.getElementById('detalhe-tarefa-criado-em');

    if (modalTitle) modalTitle.textContent = tarefa.titulo;
    if (modalDescricao) modalDescricao.textContent = tarefa.descricao || 'Sem descrição';

    // Status
    if (modalStatus) {
        const statusConfig = TAREFAS_CONFIG.STATUS[tarefa.status.toUpperCase()];
        modalStatus.innerHTML = `
            <span class="badge" style="background: ${statusConfig?.color || '#666'}">
                ${statusConfig?.icon || ''} ${statusConfig?.label || tarefa.status}
            </span>
        `;
    }

    // Prioridade
    if (modalPrioridade) {
        const prioridadeConfig = TAREFAS_CONFIG.PRIORIDADE[tarefa.prioridade.toUpperCase()];
        modalPrioridade.innerHTML = `
            <span class="badge" style="background: ${prioridadeConfig?.color || '#666'}">
                ${prioridadeConfig?.label || tarefa.prioridade}
            </span>
        `;
    }

    if (modalFuncionario) modalFuncionario.textContent = tarefa.funcionario_nome || '-';
    if (modalObra) modalObra.textContent = tarefa.obra_nome || '-';
    if (modalEmpresa) modalEmpresa.textContent = tarefa.empresa_nome || '-';
    if (modalPrazo) modalPrazo.textContent = tarefa.data_prazo ? formatDate(tarefa.data_prazo) : '-';
    if (modalCriadoEm) modalCriadoEm.textContent = tarefa.criado_em ? formatDate(tarefa.criado_em) : '-';

    // Carregar comentários
    await carregarComentarios(tarefaId);

    // Configurar botões de ação
    const btnEditar = document.getElementById('btn-editar-tarefa');
    const btnExcluir = document.getElementById('btn-excluir-tarefa');

    if (btnEditar) {
        btnEditar.onclick = () => {
            fecharModal('modal-detalhe-tarefa');
            editarTarefa(tarefaId);
        };

        // Mostrar/ocultar baseado em permissões
        const podeEditar = verificarEhAdmin() ||
                          (temPermissao('tarefas', 'editar') && tarefa.funcionario_id == currentUsuario?.id);

        if (!podeEditar) {
            btnEditar.style.display = 'none';
        } else {
            btnEditar.style.display = 'inline-block';
        }
    }

    if (btnExcluir) {
        btnExcluir.onclick = () => excluirTarefa(tarefaId);

        // Mostrar/ocultar baseado em permissões
        const podeExcluir = verificarEhAdmin() ||
                           (temPermissao('tarefas', 'excluir') && tarefa.funcionario_id == currentUsuario?.id);

        if (!podeExcluir) {
            btnExcluir.style.display = 'none';
        } else {
            btnExcluir.style.display = 'inline-block';
        }
    }

    // Armazenar ID da tarefa no modal para uso posterior
    const modal = document.getElementById('modal-detalhe-tarefa');
    if (modal) modal.dataset.tarefaId = tarefaId;

    abrirModal('modal-detalhe-tarefa');
}

/**
 * Editar tarefa
 */
export function editarTarefa(tarefaId) {
    const tarefa = tarefasActions.findById(tarefaId);
    if (!tarefa) {
        showNotification('Tarefa não encontrada', 'erro');
        return;
    }

    // Verificar permissão de editar
    const podeEditar = verificarEhAdmin() ||
                      (temPermissao('tarefas', 'editar') && tarefa.funcionario_id == currentUsuario?.id);

    if (!podeEditar) {
        showNotification(MESSAGES.TAREFAS.ERROR.NO_PERMISSION, 'erro');
        return;
    }

    // Preencher formulário
    const form = document.getElementById('form-tarefa');
    if (form) {
        form.dataset.tarefaId = tarefaId;
    }

    const tituloInput = document.getElementById('tarefa-titulo');
    const descricaoInput = document.getElementById('tarefa-descricao');
    const statusSelect = document.getElementById('tarefa-status');
    const prioridadeSelect = document.getElementById('tarefa-prioridade');
    const funcionarioSelect = document.getElementById('tarefa-funcionario');
    const obraSelect = document.getElementById('tarefa-obra');
    const empresaSelect = document.getElementById('tarefa-empresa');
    const prazoInput = document.getElementById('tarefa-prazo');

    if (tituloInput) tituloInput.value = tarefa.titulo || '';
    if (descricaoInput) descricaoInput.value = tarefa.descricao || '';
    if (statusSelect) statusSelect.value = tarefa.status || 'novo';
    if (prioridadeSelect) prioridadeSelect.value = tarefa.prioridade || 'media';
    if (prazoInput) prazoInput.value = tarefa.data_prazo || '';

    // Preencher dropdowns
    preencherDropdownFuncionarios();
    preencherDropdownObras();
    preencherDropdownEmpresas();

    // Selecionar valores após popular dropdowns
    setTimeout(() => {
        if (funcionarioSelect) funcionarioSelect.value = tarefa.funcionario_id || '';
        if (obraSelect) obraSelect.value = tarefa.obra_id || '';
        if (empresaSelect) empresaSelect.value = tarefa.empresa_id || '';
    }, 100);

    // Atualizar título do modal
    const modalTitle = document.querySelector('#modal-tarefa .modal-title');
    if (modalTitle) modalTitle.textContent = 'Editar Tarefa';

    abrirModal('modal-tarefa');
}

/**
 * Excluir tarefa
 */
export async function excluirTarefa(tarefaId) {
    const tarefa = tarefasActions.findById(tarefaId);
    if (!tarefa) {
        showNotification('Tarefa não encontrada', 'erro');
        return;
    }

    // Verificar permissão de excluir
    const podeExcluir = verificarEhAdmin() ||
                       (temPermissao('tarefas', 'excluir') && tarefa.funcionario_id == currentUsuario?.id);

    if (!podeExcluir) {
        showNotification(MESSAGES.TAREFAS.ERROR.NO_PERMISSION, 'erro');
        return;
    }

    const confirmacao = confirm(`Tem certeza que deseja excluir a tarefa "${tarefa.titulo}"?`);
    if (!confirmacao) return;

    try {
        showLoading(MESSAGES.LOADING.DELETING);

        const response = await TarefasAPI.excluir(tarefaId);

        if (response.sucesso) {
            showNotification(MESSAGES.TAREFAS.SUCCESS.DELETED, 'sucesso');
            fecharModal('modal-detalhe-tarefa');
            await carregarTarefas();
        } else {
            showNotification(response.mensagem || MESSAGES.ERROR.GENERIC, 'erro');
        }
    } catch (error) {
        console.error('Erro ao excluir tarefa:', error);
        showNotification(MESSAGES.ERROR.GENERIC, 'erro');
    } finally {
        hideLoading();
    }
}

/**
 * Alterar status da tarefa (drag and drop)
 */
export async function alterarStatusTarefa(tarefaId, novoStatus) {
    try {
        const response = await TarefasAPI.atualizar(tarefaId, { status: novoStatus });

        if (response.sucesso) {
            showNotification(MESSAGES.TAREFAS.SUCCESS.STATUS_CHANGED, 'sucesso');

            // Atualizar no store
            tarefasActions.update(tarefaId, { status: novoStatus });

            // Re-renderizar
            renderizarKanban();
        } else {
            showNotification(response.mensagem || MESSAGES.ERROR.GENERIC, 'erro');
        }
    } catch (error) {
        console.error('Erro ao alterar status:', error);
        showNotification(MESSAGES.ERROR.GENERIC, 'erro');
    }
}

/**
 * Carregar comentários de uma tarefa
 */
async function carregarComentarios(tarefaId) {
    try {
        const response = await ComentariosAPI.listar(tarefaId);

        if (response.sucesso) {
            comentariosActions.setForTarefa(tarefaId, response.dados || []);
            renderizarComentarios(tarefaId);
        }
    } catch (error) {
        console.error('Erro ao carregar comentários:', error);
    }
}

/**
 * Renderizar comentários no modal
 */
function renderizarComentarios(tarefaId) {
    const container = document.getElementById('tarefa-comentarios');
    if (!container) return;

    const comentarios = comentariosActions.getForTarefa(tarefaId);
    container.innerHTML = CommentThread({ comentarios, tarefaId });
}

/**
 * Adicionar comentário
 */
export async function adicionarComentario(tarefaId) {
    const textarea = document.getElementById('novo-comentario');
    if (!textarea) return;

    const comentario = textarea.value.trim();

    if (!comentario) {
        showNotification('Digite um comentário', 'erro');
        return;
    }

    try {
        showLoading('Adicionando comentário...');

        const response = await ComentariosAPI.criar({
            tarefa_id: tarefaId,
            comentario: comentario
        });

        if (response.sucesso) {
            showNotification(MESSAGES.TAREFAS.SUCCESS.COMMENT_ADDED, 'sucesso');

            // Limpar textarea
            textarea.value = '';

            // Recarregar comentários
            await carregarComentarios(tarefaId);
        } else {
            showNotification(response.mensagem || MESSAGES.ERROR.GENERIC, 'erro');
        }
    } catch (error) {
        console.error('Erro ao adicionar comentário:', error);
        showNotification(MESSAGES.ERROR.GENERIC, 'erro');
    } finally {
        hideLoading();
    }
}

/**
 * Filtrar por status
 */
export function filtrarPorStatus(status) {
    tarefasFiltersActions.update('status', status || null);
    renderizarKanban();
}

/**
 * Filtrar por prioridade
 */
export function filtrarPorPrioridade(prioridade) {
    tarefasFiltersActions.update('prioridade', prioridade || null);
    renderizarKanban();
}

/**
 * Filtrar por funcionário
 */
export function filtrarPorFuncionario(funcionarioId) {
    tarefasFiltersActions.update('funcionario', funcionarioId || null);
    renderizarKanban();
}

/**
 * Filtrar por obra
 */
export function filtrarPorObra(obraId) {
    tarefasFiltersActions.update('obra', obraId || null);
    renderizarKanban();
}

/**
 * Filtrar por empresa
 */
export function filtrarPorEmpresa(empresaId) {
    tarefasFiltersActions.update('empresa', empresaId || null);
    renderizarKanban();
}

/**
 * Filtrar por prazo
 */
export function filtrarPorPrazo(prazo) {
    tarefasFiltersActions.update('prazo', prazo || null);
    renderizarKanban();
}

/**
 * Limpar todos os filtros
 */
export function limparFiltrosTarefas() {
    tarefasFiltersActions.reset();
    renderizarFiltros();
    renderizarKanban();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Botão nova tarefa
    const btnNovaTarefa = document.getElementById('btn-nova-tarefa');
    if (btnNovaTarefa) {
        btnNovaTarefa.addEventListener('click', abrirFormularioNovaTarefa);
    }

    // Form submit
    const formTarefa = document.getElementById('form-tarefa');
    if (formTarefa) {
        formTarefa.addEventListener('submit', salvarTarefa);
    }
}

/**
 * Setup drag and drop
 */
function setupDragAndDrop() {
    window.handleTaskDragStart = (event, tarefaId) => {
        event.dataTransfer.setData('tarefaId', tarefaId);
        event.dataTransfer.effectAllowed = 'move';
        event.target.classList.add('dragging');
    };

    window.handleTaskDragEnd = (event) => {
        event.target.classList.remove('dragging');
    };

    window.handleKanbanDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    };

    window.handleKanbanDrop = async (event, newStatus) => {
        event.preventDefault();

        const tarefaId = event.dataTransfer.getData('tarefaId');
        if (!tarefaId) return;

        // Verificar se mudou de status
        const tarefa = tarefasActions.findById(tarefaId);
        if (!tarefa || tarefa.status === newStatus) return;

        // Verificar permissão de editar
        const podeEditar = verificarEhAdmin() ||
                          (temPermissao('tarefas', 'editar') && tarefa.funcionario_id == currentUsuario?.id);

        if (!podeEditar) {
            showNotification(MESSAGES.TAREFAS.ERROR.NO_PERMISSION, 'erro');
            return;
        }

        // Alterar status
        await alterarStatusTarefa(tarefaId, newStatus);
    };
}

/**
 * Preencher dropdown de funcionários
 */
function preencherDropdownFuncionarios() {
    const select = document.getElementById('tarefa-funcionario');
    if (!select) return;

    const funcionarios = funcionariosActions.getAll();

    select.innerHTML = '<option value="">Selecione um funcionário...</option>';

    funcionarios.forEach(func => {
        const option = document.createElement('option');
        option.value = func.id;
        option.textContent = `${func.nome} - ${func.funcao || 'Sem função'}`;
        select.appendChild(option);
    });
}

/**
 * Preencher dropdown de usuários responsáveis
 */
function preencherDropdownUsuarios() {
    const select = document.getElementById('tarefa-usuario-responsavel');
    if (!select) return;

    const usuarios = usuariosActions.getAll();

    select.innerHTML = '<option value="">Selecione um usuário...</option>';

    usuarios
        .filter(usuario => usuario.ativo === 'Sim')
        .forEach(usuario => {
            const option = document.createElement('option');
            option.value = usuario.id;

            // Generate initials for avatar display
            const initials = gerarAvatar(usuario.nome);
            const tipoLabel = usuario.tipo === 'admin' ? '👑 Admin' : '👤 Usuário';

            // Format: [XX] Nome (Tipo)
            option.textContent = `[${initials}] ${usuario.nome} (${tipoLabel})`;
            option.dataset.nome = usuario.nome;
            option.dataset.tipo = usuario.tipo;
            option.dataset.initials = initials;

            select.appendChild(option);
        });
}

/**
 * Preencher dropdown de obras
 */
function preencherDropdownObras() {
    const select = document.getElementById('tarefa-obra');
    if (!select) return;

    const obras = obrasActions.getAll();

    select.innerHTML = '<option value="">Nenhuma obra</option>';

    obras.forEach(obra => {
        const option = document.createElement('option');
        option.value = obra.id;
        option.textContent = obra.nome;
        select.appendChild(option);
    });
}

/**
 * Preencher dropdown de empresas
 */
function preencherDropdownEmpresas() {
    const select = document.getElementById('tarefa-empresa');
    if (!select) return;

    const empresas = empresasActions.getAll();

    select.innerHTML = '<option value="">Nenhuma empresa</option>';

    empresas.forEach(empresa => {
        const option = document.createElement('option');
        option.value = empresa.id;
        option.textContent = empresa.nome;
        select.appendChild(option);
    });
}

// Exportar funções para window (onclick compatibility)
if (typeof window !== 'undefined') {
    window.abrirFormularioNovaTarefa = abrirFormularioNovaTarefa;
    window.abrirDetalhesTarefa = abrirDetalhesTarefa;
    window.editarTarefa = editarTarefa;
    window.excluirTarefa = excluirTarefa;
    window.salvarTarefa = salvarTarefa;
    window.adicionarComentario = adicionarComentario;
    window.filtrarPorStatus = filtrarPorStatus;
    window.filtrarPorPrioridade = filtrarPorPrioridade;
    window.filtrarPorFuncionario = filtrarPorFuncionario;
    window.filtrarPorObra = filtrarPorObra;
    window.filtrarPorEmpresa = filtrarPorEmpresa;
    window.filtrarPorPrazo = filtrarPorPrazo;
    window.limparFiltrosTarefas = limparFiltrosTarefas;
}
