// ========================================
// CONFIGURAÇÕES GLOBAIS DA APLICAÇÃO
// ========================================

export const APP_VERSION = '2025.12.12-refactored';

// Configuração automática da API baseada no ambiente
export const API_CONFIG = {
    // Detectar automaticamente se está em produção ou desenvolvimento
    isProduction: !['localhost', '127.0.0.1'].includes(window.location.hostname),

    // URLs das APIs - sempre usar caminhos relativos para HostGator
    get baseURL() {
        return '';
    },

    // Endpoints das APIs
    endpoints: {
        empresas: 'api_empresas.php',
        funcionarios: 'api_funcionarios.php',
        obras: 'api_obras.php',
        lancamentos: 'api_lancamentos.php',
        funcoes: 'api_funcoes.php',
        responsaveis: 'api_responsaveis.php'
    }
};

// Constantes de UI
export const UI_CONSTANTS = {
    SIDEBAR_WIDTH_EXPANDED: 280,
    SIDEBAR_WIDTH_COLLAPSED: 70,
    ANIMATION_DURATION: 300,
    DEBOUNCE_DELAY: 300
};

// Mensagens padrão
export const MESSAGES = {
    SUCCESS: {
        CREATED: 'Registro criado com sucesso!',
        UPDATED: 'Registro atualizado com sucesso!',
        DELETED: 'Registro excluído com sucesso!',
        SAVED: 'Salvo com sucesso!'
    },
    ERROR: {
        GENERIC: 'Ocorreu um erro. Tente novamente.',
        NETWORK: 'Erro de conexão com o servidor.',
        VALIDATION: 'Por favor, preencha todos os campos obrigatórios.',
        NOT_FOUND: 'Registro não encontrado.',
        DELETE_CONFIRM: 'Tem certeza que deseja excluir este registro?'
    },
    LOADING: {
        FETCHING: 'Carregando dados...',
        SAVING: 'Salvando...',
        DELETING: 'Excluindo...'
    }
};

// Validação de formulários
export const VALIDATION_RULES = {
    REQUIRED: 'required',
    EMAIL: 'email',
    CNPJ: 'cnpj',
    CPF: 'cpf',
    PHONE: 'phone',
    NUMBER: 'number',
    DATE: 'date'
};
