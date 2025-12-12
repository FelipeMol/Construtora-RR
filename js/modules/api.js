// ========================================
// MÓDULO DE COMUNICAÇÃO COM APIS
// ========================================

import { API_CONFIG, MESSAGES } from './config.js';
import { showNotification } from './ui.js';

/**
 * Função principal para fazer requisições à API
 * @param {string} endpoint - Nome do endpoint (ex: 'empresas', 'funcionarios')
 * @param {Object} options - Opções da requisição
 * @returns {Promise<Object>} Resposta da API
 */
export async function fetchAPI(endpoint, options = {}) {
    try {
        // Determinar URL completa
        const url = API_CONFIG.baseURL + (API_CONFIG.endpoints[endpoint] || endpoint);

        // Configurações padrão
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        // Adicionar corpo da requisição se houver dados
        if (options.data) {
            config.body = JSON.stringify(options.data);
        }

        // Adicionar parâmetros de query string para GET
        let fullUrl = url;
        if (options.params) {
            const params = new URLSearchParams(options.params);
            fullUrl += '?' + params.toString();
        }

        // Adicionar ID na URL para PUT/DELETE
        if (options.id) {
            fullUrl += (fullUrl.includes('?') ? '&' : '?') + 'id=' + options.id;
        }

        // Fazer requisição
        const response = await fetch(fullUrl, config);

        // Verificar se a resposta é JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            console.error('Resposta não é JSON:', await response.text());
            throw new Error('Resposta inválida do servidor');
        }

        // Parse da resposta
        const result = await response.json();

        // Log para debug em desenvolvimento
        if (!API_CONFIG.isProduction) {
            console.log(`[API ${config.method}] ${fullUrl}`, {
                options,
                response: result
            });
        }

        // Retornar resultado
        return result;

    } catch (error) {
        console.error('[API ERROR]', error);

        // Mostrar notificação de erro
        if (options.showError !== false) {
            showNotification(MESSAGES.ERROR.NETWORK, 'error');
        }

        return {
            sucesso: false,
            mensagem: error.message || MESSAGES.ERROR.GENERIC,
            dados: null
        };
    }
}

/**
 * Funções auxiliares específicas para cada endpoint
 */

// Empresas
export const EmpresasAPI = {
    listar: () => fetchAPI('empresas'),
    criar: (data) => fetchAPI('empresas', { method: 'POST', data }),
    atualizar: (id, data) => fetchAPI('empresas', { method: 'PUT', id, data }),
    excluir: (id) => fetchAPI('empresas', { method: 'DELETE', id })
};

// Funcionários
export const FuncionariosAPI = {
    listar: () => fetchAPI('funcionarios'),
    criar: (data) => fetchAPI('funcionarios', { method: 'POST', data }),
    atualizar: (id, data) => fetchAPI('funcionarios', { method: 'PUT', id, data }),
    excluir: (id) => fetchAPI('funcionarios', { method: 'DELETE', id })
};

// Obras
export const ObrasAPI = {
    listar: () => fetchAPI('obras'),
    criar: (data) => fetchAPI('obras', { method: 'POST', data }),
    atualizar: (id, data) => fetchAPI('obras', { method: 'PUT', id, data }),
    excluir: (id) => fetchAPI('obras', { method: 'DELETE', id })
};

// Lançamentos
export const LancamentosAPI = {
    listar: (params) => fetchAPI('lancamentos', { params }),
    criar: (data) => fetchAPI('lancamentos', { method: 'POST', data }),
    atualizar: (id, data) => fetchAPI('lancamentos', { method: 'PUT', id, data }),
    excluir: (id) => fetchAPI('lancamentos', { method: 'DELETE', id })
};

// Funções
export const FuncoesAPI = {
    listar: () => fetchAPI('funcoes'),
    criar: (data) => fetchAPI('funcoes', { method: 'POST', data }),
    atualizar: (id, data) => fetchAPI('funcoes', { method: 'PUT', id, data }),
    excluir: (id) => fetchAPI('funcoes', { method: 'DELETE', id })
};

// Responsáveis
export const ResponsaveisAPI = {
    listar: () => fetchAPI('responsaveis'),
    criar: (data) => fetchAPI('responsaveis', { method: 'POST', data }),
    atualizar: (id, data) => fetchAPI('responsaveis', { method: 'PUT', id, data }),
    excluir: (id) => fetchAPI('responsaveis', { method: 'DELETE', id })
};
