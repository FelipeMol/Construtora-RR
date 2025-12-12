// ========================================
// APP.JS - ENTRY POINT DA APLICAÇÃO
// ========================================

/**
 * Ponto de entrada principal da aplicação refatorada
 * Este arquivo inicializa todos os módulos e configura a aplicação
 */

// Importar módulos base
import { APP_VERSION } from './modules/config.js';
import { initUI } from './modules/ui.js';
import store, { useSubscribe } from './modules/store.js';

// Importar módulos de entidades
import { initEmpresas, carregarEmpresas } from './modules/empresas.js';

/**
 * Inicialização da aplicação
 */
async function initApp() {
    console.log(`🚀 Inicializando Controle de Obras v${APP_VERSION}`);

    try {
        // 1. Inicializar UI (sidebar, tabs, notificações)
        initUI();
        console.log('✓ UI inicializada');

        // 2. Carregar dados iniciais
        await carregarDadosIniciais();
        console.log('✓ Dados iniciais carregados');

        // 3. Inicializar módulos de entidades
        await initEmpresas();
        console.log('✓ Módulo de Empresas inicializado');

        // 4. Configurar observadores de estado
        setupStateObservers();
        console.log('✓ Observadores configurados');

        // 5. Aplicação pronta
        console.log('✅ Aplicação iniciada com sucesso!');
        store.debug();

    } catch (error) {
        console.error('❌ Erro ao inicializar aplicação:', error);
        alert('Erro ao inicializar a aplicação. Verifique o console para mais detalhes.');
    }
}

/**
 * Carrega dados iniciais de todas as entidades
 */
async function carregarDadosIniciais() {
    const promises = [
        carregarEmpresas(),
        // Adicionar carregamento de outras entidades aqui quando prontas:
        // carregarFuncionarios(),
        // carregarObras(),
        // carregarLancamentos(),
    ];

    await Promise.all(promises);
}

/**
 * Configura observadores de mudanças de estado
 */
function setupStateObservers() {
    // Observar mudanças em empresas
    useSubscribe('empresas', (empresas) => {
        console.log(`📊 Empresas atualizadas: ${empresas.length} registros`);
    });

    // Observar mudanças na tab atual
    useSubscribe('currentTab', (tab) => {
        console.log(`📑 Tab alterada para: ${tab}`);
    });

    // Observar loading global
    useSubscribe('loading', (isLoading) => {
        console.log(`⏳ Loading: ${isLoading ? 'ON' : 'OFF'}`);
    });
}

/**
 * Iniciar quando o DOM estiver pronto
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

/**
 * Exportar para debug no console
 */
if (typeof window !== 'undefined') {
    window.AppStore = store;
    window.AppDebug = {
        getState: () => store.getState(),
        getHistory: () => store.getHistory(),
        reset: () => store.reset()
    };
}
