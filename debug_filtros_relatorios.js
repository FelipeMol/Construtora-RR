/**
 * Script de Debug para Filtros de Relatórios
 * Execute no Console do Navegador (F12) quando estiver na aba de Relatórios
 */

console.log('🔍 === DEBUG FILTROS DE RELATÓRIOS ===\n');

// 1. Verificar se a aba de relatórios está ativa
const abaRelatorios = document.getElementById('relatorios');
console.log('1️⃣ Aba #relatorios:', abaRelatorios ? 'ENCONTRADA ✅' : 'NÃO ENCONTRADA ❌');
if (abaRelatorios) {
    console.log('   - Classes:', abaRelatorios.className);
    console.log('   - Display:', window.getComputedStyle(abaRelatorios).display);
}

// 2. Verificar se o botão de adicionar filtro existe
const btnAddFilter = document.getElementById('btn-add-filter');
console.log('\n2️⃣ Botão #btn-add-filter:', btnAddFilter ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌');
if (btnAddFilter) {
    console.log('   - Display:', window.getComputedStyle(btnAddFilter).display);
    console.log('   - Visibility:', window.getComputedStyle(btnAddFilter).visibility);
    console.log('   - Text:', btnAddFilter.textContent);

    // Verificar se tem event listeners
    const listeners = getEventListeners ? getEventListeners(btnAddFilter) : 'Função não disponível (use Chrome)';
    console.log('   - Event Listeners:', listeners);
}

// 3. Verificar estado dos dados
console.log('\n3️⃣ Estado dos dados globais:');
console.log('   - funcionarios:', typeof funcionarios !== 'undefined' ? `${funcionarios?.length || 0} items ✅` : 'NÃO DEFINIDO ❌');
console.log('   - obras:', typeof obras !== 'undefined' ? `${obras?.length || 0} items ✅` : 'NÃO DEFINIDO ❌');
console.log('   - empresas:', typeof empresas !== 'undefined' ? `${empresas?.length || 0} items ✅` : 'NÃO DEFINIDO ❌');
console.log('   - lancamentos:', typeof lancamentos !== 'undefined' ? `${lancamentos?.length || 0} items ✅` : 'NÃO DEFINIDO ❌');

// 4. Verificar RelatorioState
console.log('\n4️⃣ RelatorioState:');
if (typeof RelatorioState !== 'undefined') {
    console.log('   ✅ RelatorioState definido');
    console.log('   - Período:', RelatorioState.periodo);
    console.log('   - Filtros:', RelatorioState.filtros);
    console.log('   - Visualização:', RelatorioState.visualizacao);
    console.log('   - Dados filtrados:', RelatorioState.dados?.length || 0);
} else {
    console.log('   ❌ RelatorioState NÃO DEFINIDO');
}

// 5. Verificar funções necessárias
console.log('\n5️⃣ Funções necessárias:');
const funcoes = [
    'mostrarMenuFiltros',
    'abrirSeletorFiltro',
    'adicionarFiltro',
    'removerFiltro',
    'renderizarChips',
    'atualizarRelatorio'
];

funcoes.forEach(fn => {
    const existe = typeof window[fn] === 'function';
    console.log(`   - ${fn}:`, existe ? '✅ DEFINIDA' : '❌ NÃO DEFINIDA');
});

// 6. Teste manual do botão
console.log('\n6️⃣ Teste de clique no botão:');
if (btnAddFilter) {
    console.log('   📝 Simulando clique no botão...');
    try {
        btnAddFilter.click();
        setTimeout(() => {
            const menu = document.getElementById('filter-dropdown-menu');
            console.log('   - Menu criado:', menu ? 'SIM ✅' : 'NÃO ❌');
            if (menu) {
                console.log('   - Posição:', menu.style.position);
                console.log('   - Top:', menu.style.top);
                console.log('   - Left:', menu.style.left);
                console.log('   - Display:', window.getComputedStyle(menu).display);
                console.log('   - Visibilidade:', window.getComputedStyle(menu).visibility);
                console.log('   - Items:', menu.querySelectorAll('.filter-dropdown-item').length);
            }
        }, 100);
    } catch (error) {
        console.error('   ❌ Erro ao clicar no botão:', error);
    }
} else {
    console.log('   ⚠️ Botão não encontrado, não é possível testar');
}

// 7. Verificar container de chips
console.log('\n7️⃣ Container de chips:');
const chipsContainer = document.getElementById('rel-chips-container');
console.log('   - Container:', chipsContainer ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌');
if (chipsContainer) {
    console.log('   - Filhos:', chipsContainer.children.length);
    console.log('   - HTML:', chipsContainer.innerHTML);
}

// 8. Verificar área de visualização
console.log('\n8️⃣ Área de visualização:');
const visualArea = document.getElementById('rel-visualization-area');
console.log('   - Container:', visualArea ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌');
if (visualArea) {
    console.log('   - Filhos:', visualArea.children.length);
    console.log('   - Display:', window.getComputedStyle(visualArea).display);
}

console.log('\n✅ Debug completo!\n');
console.log('💡 Dica: Se o menu não aparecer, verifique os logs do console para erros JavaScript.');
