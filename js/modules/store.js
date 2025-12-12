// ========================================
// MÓDULO DE GERENCIAMENTO DE ESTADO (STORE)
// ========================================

/**
 * Store centralizado para gerenciar o estado da aplicação
 * Similar ao Redux/Vuex mas em vanilla JS
 */
class AppStore {
    constructor() {
        this.state = {
            empresas: [],
            funcionarios: [],
            obras: [],
            lancamentos: [],
            funcoes: [],
            responsaveis: [],
            avaliacoes: [],

            // UI State
            loading: false,
            currentTab: 'dashboard',
            filters: {},

            // User State
            usuario: null
        };

        this.listeners = new Map();
        this.history = [];
        this.maxHistory = 50;
    }

    /**
     * Obtém o estado completo ou uma parte dele
     */
    getState(key = null) {
        if (key) {
            return this.state[key];
        }
        return { ...this.state };
    }

    /**
     * Define um valor no estado e notifica os listeners
     */
    setState(key, value) {
        const oldValue = this.state[key];

        // Salvar no histórico
        this.addToHistory({
            key,
            oldValue,
            newValue: value,
            timestamp: new Date().toISOString()
        });

        // Atualizar estado
        this.state[key] = value;

        // Notificar listeners específicos dessa chave
        this.notify(key, value, oldValue);

        // Notificar listeners globais
        this.notify('*', this.state, key);

        return this;
    }

    /**
     * Atualiza múltiplas chaves de uma vez
     */
    setMultiple(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.setState(key, value);
        });
        return this;
    }

    /**
     * Registra um listener para mudanças de estado
     */
    subscribe(key, callback) {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, new Set());
        }
        this.listeners.get(key).add(callback);

        // Retorna função para cancelar inscrição
        return () => {
            this.listeners.get(key).delete(callback);
        };
    }

    /**
     * Notifica todos os listeners de uma chave
     */
    notify(key, newValue, oldValue) {
        const callbacks = this.listeners.get(key);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(newValue, oldValue, key);
                } catch (error) {
                    console.error(`Erro no listener de '${key}':`, error);
                }
            });
        }
    }

    /**
     * Adiciona item ao array de uma chave
     */
    push(key, item) {
        if (!Array.isArray(this.state[key])) {
            throw new Error(`Estado '${key}' não é um array`);
        }
        const newArray = [...this.state[key], item];
        this.setState(key, newArray);
        return this;
    }

    /**
     * Remove item do array por ID
     */
    remove(key, id) {
        if (!Array.isArray(this.state[key])) {
            throw new Error(`Estado '${key}' não é um array`);
        }
        const newArray = this.state[key].filter(item => item.id !== id);
        this.setState(key, newArray);
        return this;
    }

    /**
     * Atualiza item no array por ID
     */
    update(key, id, updates) {
        if (!Array.isArray(this.state[key])) {
            throw new Error(`Estado '${key}' não é um array`);
        }
        const newArray = this.state[key].map(item =>
            item.id === id ? { ...item, ...updates } : item
        );
        this.setState(key, newArray);
        return this;
    }

    /**
     * Busca item por ID
     */
    findById(key, id) {
        if (!Array.isArray(this.state[key])) {
            throw new Error(`Estado '${key}' não é um array`);
        }
        return this.state[key].find(item => item.id === id);
    }

    /**
     * Filtra items
     */
    filter(key, predicate) {
        if (!Array.isArray(this.state[key])) {
            throw new Error(`Estado '${key}' não é um array`);
        }
        return this.state[key].filter(predicate);
    }

    /**
     * Ordena items
     */
    sort(key, compareFn) {
        if (!Array.isArray(this.state[key])) {
            throw new Error(`Estado '${key}' não é um array`);
        }
        return [...this.state[key]].sort(compareFn);
    }

    /**
     * Adiciona ao histórico
     */
    addToHistory(entry) {
        this.history.push(entry);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
    }

    /**
     * Obtém histórico de mudanças
     */
    getHistory(key = null) {
        if (key) {
            return this.history.filter(entry => entry.key === key);
        }
        return [...this.history];
    }

    /**
     * Limpa histórico
     */
    clearHistory() {
        this.history = [];
        return this;
    }

    /**
     * Reset do estado
     */
    reset() {
        this.state = {
            empresas: [],
            funcionarios: [],
            obras: [],
            lancamentos: [],
            funcoes: [],
            responsaveis: [],
            avaliacoes: [],
            loading: false,
            currentTab: 'dashboard',
            filters: {},
            usuario: null
        };
        this.notify('*', this.state);
        return this;
    }

    /**
     * Debug: imprime estado atual
     */
    debug() {
        console.log('=== APP STORE STATE ===');
        console.log('State:', this.state);
        console.log('Listeners:', Array.from(this.listeners.keys()));
        console.log('History:', this.history.length, 'entries');
        console.log('=======================');
    }
}

// Criar instância singleton
const store = new AppStore();

// Exportar store e funções úteis
export default store;

/**
 * Hooks para facilitar uso do store
 */

// Obter estado
export function useState(key) {
    return store.getState(key);
}

// Definir estado
export function setState(key, value) {
    return store.setState(key, value);
}

// Inscrever para mudanças
export function useSubscribe(key, callback) {
    return store.subscribe(key, callback);
}

// Actions para entidades (simplificam as operações)
export const empresasActions = {
    set: (data) => store.setState('empresas', data),
    add: (item) => store.push('empresas', item),
    update: (id, updates) => store.update('empresas', id, updates),
    remove: (id) => store.remove('empresas', id),
    findById: (id) => store.findById('empresas', id),
    getAll: () => store.getState('empresas')
};

export const funcionariosActions = {
    set: (data) => store.setState('funcionarios', data),
    add: (item) => store.push('funcionarios', item),
    update: (id, updates) => store.update('funcionarios', id, updates),
    remove: (id) => store.remove('funcionarios', id),
    findById: (id) => store.findById('funcionarios', id),
    getAll: () => store.getState('funcionarios'),
    getAtivos: () => store.filter('funcionarios', f => f.situacao === 'Ativo')
};

export const obrasActions = {
    set: (data) => store.setState('obras', data),
    add: (item) => store.push('obras', item),
    update: (id, updates) => store.update('obras', id, updates),
    remove: (id) => store.remove('obras', id),
    findById: (id) => store.findById('obras', id),
    getAll: () => store.getState('obras')
};

export const lancamentosActions = {
    set: (data) => store.setState('lancamentos', data),
    add: (item) => store.push('lancamentos', item),
    update: (id, updates) => store.update('lancamentos', id, updates),
    remove: (id) => store.remove('lancamentos', id),
    findById: (id) => store.findById('lancamentos', id),
    getAll: () => store.getState('lancamentos'),
    getByPeriodo: (inicio, fim) => {
        return store.filter('lancamentos', l => {
            const data = new Date(l.data);
            const dataInicio = new Date(inicio);
            const dataFim = new Date(fim);
            return data >= dataInicio && data <= dataFim;
        });
    }
};

export const funcoesActions = {
    set: (data) => store.setState('funcoes', data),
    add: (item) => store.push('funcoes', item),
    update: (id, updates) => store.update('funcoes', id, updates),
    remove: (id) => store.remove('funcoes', id),
    findById: (id) => store.findById('funcoes', id),
    getAll: () => store.getState('funcoes')
};

export const responsaveisActions = {
    set: (data) => store.setState('responsaveis', data),
    add: (item) => store.push('responsaveis', item),
    update: (id, updates) => store.update('responsaveis', id, updates),
    remove: (id) => store.remove('responsaveis', id),
    findById: (id) => store.findById('responsaveis', id),
    getAll: () => store.getState('responsaveis')
};

export const avaliacoesActions = {
    set: (data) => store.setState('avaliacoes', data),
    add: (item) => store.push('avaliacoes', item),
    update: (id, updates) => store.update('avaliacoes', id, updates),
    remove: (id) => store.remove('avaliacoes', id),
    findById: (id) => store.findById('avaliacoes', id),
    getAll: () => store.getState('avaliacoes'),
    getByFuncionario: (funcionarioId) => {
        return store.filter('avaliacoes', a => a.funcionario_id === funcionarioId);
    }
};

// UI Actions
export const uiActions = {
    setLoading: (loading) => store.setState('loading', loading),
    setCurrentTab: (tab) => store.setState('currentTab', tab),
    setFilters: (filters) => store.setState('filters', filters),
    setUsuario: (usuario) => store.setState('usuario', usuario)
};
