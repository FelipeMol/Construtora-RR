/**
 * Script de Debug para Página de Permissões
 * Execute no Console do Navegador (F12)
 */

console.log('🔍 === DEBUG PÁGINA DE PERMISSÕES ===\n');

// 1. Verificar se a aba existe
const abPermissoes = document.getElementById('permissoes');
console.log('1️⃣ Aba #permissoes:', abPermissoes ? 'ENCONTRADA ✅' : 'NÃO ENCONTRADA ❌');

if (abPermissoes) {
    const computedStyle = window.getComputedStyle(abPermissoes);
    console.log('   - Display:', computedStyle.display);
    console.log('   - Visibility:', computedStyle.visibility);
    console.log('   - Opacity:', computedStyle.opacity);
    console.log('   - Width:', computedStyle.width);
    console.log('   - Height:', computedStyle.height);
    console.log('   - Classes:', abPermissoes.className);
    console.log('   - BoundingRect:', abPermissoes.getBoundingClientRect());
}

// 2. Verificar .permissoes-layout
const layout = document.querySelector('.permissoes-layout');
console.log('\n2️⃣ .permissoes-layout:', layout ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌');

if (layout) {
    const computedStyle = window.getComputedStyle(layout);
    console.log('   - Display:', computedStyle.display);
    console.log('   - Grid Template Columns:', computedStyle.gridTemplateColumns);
    console.log('   - Visibility:', computedStyle.visibility);
    console.log('   - Overflow:', computedStyle.overflow);
    console.log('   - Width:', computedStyle.width);
    console.log('   - Height:', computedStyle.height);
    console.log('   - BoundingRect:', layout.getBoundingClientRect());
}

// 3. Verificar .permissoes-usuarios-panel
const panelUsuarios = document.querySelector('.permissoes-usuarios-panel');
console.log('\n3️⃣ .permissoes-usuarios-panel:', panelUsuarios ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌');

if (panelUsuarios) {
    const computedStyle = window.getComputedStyle(panelUsuarios);
    console.log('   - Display:', computedStyle.display);
    console.log('   - Flex Direction:', computedStyle.flexDirection);
    console.log('   - Background:', computedStyle.background);
    console.log('   - Visibility:', computedStyle.visibility);
    console.log('   - Width:', computedStyle.width);
    console.log('   - Height:', computedStyle.height);
    console.log('   - BoundingRect:', panelUsuarios.getBoundingClientRect());
}

// 4. Verificar #lista-usuarios
const listaUsuarios = document.getElementById('lista-usuarios');
console.log('\n4️⃣ #lista-usuarios:', listaUsuarios ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌');

if (listaUsuarios) {
    const computedStyle = window.getComputedStyle(listaUsuarios);
    console.log('   - Display:', computedStyle.display);
    console.log('   - Flex Direction:', computedStyle.flexDirection);
    console.log('   - Visibility:', computedStyle.visibility);
    console.log('   - Width:', computedStyle.width);
    console.log('   - Height:', computedStyle.height);
    console.log('   - Overflow Y:', computedStyle.overflowY);
    console.log('   - Filhos:', listaUsuarios.children.length);
    console.log('   - BoundingRect:', listaUsuarios.getBoundingClientRect());

    if (listaUsuarios.children.length > 0) {
        console.log('\n   📋 Primeiro filho (.usuario-card):');
        const primeiroCard = listaUsuarios.children[0];
        const cardStyle = window.getComputedStyle(primeiroCard);
        console.log('      - Display:', cardStyle.display);
        console.log('      - Visibility:', cardStyle.visibility);
        console.log('      - Background:', cardStyle.background);
        console.log('      - Color:', cardStyle.color);
        console.log('      - Width:', cardStyle.width);
        console.log('      - Height:', cardStyle.height);
        console.log('      - BoundingRect:', primeiroCard.getBoundingClientRect());
    }
}

// 5. Verificar .permissoes-controle-panel
const panelControle = document.querySelector('.permissoes-controle-panel');
console.log('\n5️⃣ .permissoes-controle-panel:', panelControle ? 'ENCONTRADO ✅' : 'NÃO ENCONTRADO ❌');

if (panelControle) {
    const computedStyle = window.getComputedStyle(panelControle);
    console.log('   - Display:', computedStyle.display);
    console.log('   - Visibility:', computedStyle.visibility);
    console.log('   - Width:', computedStyle.width);
    console.log('   - Height:', computedStyle.height);
    console.log('   - BoundingRect:', panelControle.getBoundingClientRect());
}

// 6. Verificar todas as regras CSS aplicadas
console.log('\n6️⃣ Regras CSS relevantes:');
const styleSheets = Array.from(document.styleSheets);
const relevantRules = [];

styleSheets.forEach(sheet => {
    try {
        const rules = Array.from(sheet.cssRules || sheet.rules || []);
        rules.forEach(rule => {
            if (rule.selectorText && (
                rule.selectorText.includes('permissoes') ||
                rule.selectorText.includes('usuario-card') ||
                rule.selectorText.includes('tab-content')
            )) {
                relevantRules.push({
                    selector: rule.selectorText,
                    cssText: rule.cssText
                });
            }
        });
    } catch (e) {
        // Ignorar erros de CORS
    }
});

console.log(`   Encontradas ${relevantRules.length} regras CSS relevantes`);

// 7. Verificar Z-Index
console.log('\n7️⃣ Z-Index Stack:');
if (abPermissoes) {
    let element = abPermissoes;
    while (element) {
        const style = window.getComputedStyle(element);
        if (style.zIndex !== 'auto') {
            console.log(`   ${element.tagName}${element.id ? '#' + element.id : ''}${element.className ? '.' + element.className.split(' ')[0] : ''} → z-index: ${style.zIndex}`);
        }
        element = element.parentElement;
    }
}

// 8. Verificar se está sendo sobreposto por outro elemento
console.log('\n8️⃣ Teste de sobreposição:');
if (abPermissoes) {
    const rect = abPermissoes.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const elementAtCenter = document.elementFromPoint(centerX, centerY);

    console.log('   Elemento no centro da aba:', elementAtCenter);
    console.log('   É filho do #permissoes?', abPermissoes.contains(elementAtCenter));
}

console.log('\n✅ Debug completo!\n');
