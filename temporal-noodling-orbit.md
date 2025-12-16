# Dashboard "Início" - Plano de Design UX/UI

## 🎯 Visão Geral

Transformar a aba "Início" em um **dashboard executivo moderno** que oferece visão 360° da operação de obras em tempo real. O design combina métricas-chave, gráficos interativos e alertas inteligentes, mantendo a identidade visual do sistema (gradiente azul #1976d2 → #2196f3).

---

## 📐 Estrutura Visual (Layout em Grid)

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER: Bem-vinda, Viviane | 🕐 Qua, 12 Dez 2025, 14:23   │
│  + Resumo do dia: "4 obras ativas • 12 funcionários"        │
└─────────────────────────────────────────────────────────────┘

┌──────────────┬──────────────┬──────────────┬──────────────┐
│ 💰 CUSTO     │ 👷 ATIVOS    │ 🏗️ OBRAS     │ ⏱️ HOJE      │
│ R$ 45.280    │ 12/15        │ 4 andamento  │ 64,5 horas   │
│ +12% vs mês  │ 3 ausentes   │ 2 atrasadas  │ 8 lançam.    │
│ [ver mais ↗] │ [ver mais ↗] │ [ver mais ↗] │ [ver mais ↗] │
└──────────────┴──────────────┴──────────────┴──────────────┘

┌───────────────────────────────┬───────────────────────────┐
│  📊 HORAS POR OBRA (30 dias)  │  🏆 TOP FUNCIONÁRIOS      │
│  ─────────────────────────    │  ─────────────────────    │
│  [Gráfico barras horizontal]  │  [Lista com avatares]     │
│  ✅ Obra A: ████████ 120h     │  1. João Silva   85h ⭐⭐⭐ │
│  ⚠️ Obra B: ████ 45h          │  2. Maria Costa  78h ⭐⭐⭐ │
│  ✅ Obra C: ██████ 90h        │  3. Pedro Lima   65h ⭐⭐  │
│                                │  [+ ver todos]            │
└───────────────────────────────┴───────────────────────────┘

┌───────────────────────────────┬───────────────────────────┐
│  📅 CRONOGRAMA SEMANAL        │  🚨 ALERTAS E PENDÊNCIAS  │
│  ─────────────────────────    │  ─────────────────────    │
│  [Mini calendário 7 dias]     │  ⚠️ Obra B sem lançamento │
│  Seg: 8 lanç | Ter: 6 lanç   │     há 3 dias             │
│  Qua: 4 lanç | ...            │  🔴 Obra A 12% acima      │
│                                │     do orçamento          │
│                                │  [+ ver todos alertas]    │
└───────────────────────────────┴───────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📋 ATIVIDADE RECENTE (últimos 10 lançamentos)              │
│  ─────────────────────────────────────────────────────      │
│  🕐 14:23 | João Silva → Obra A | 8,5h | Carpinteiro       │
│  🕐 14:15 | Maria Costa → Obra B | 4h | Encanadora          │
│  🕐 13:45 | Pedro Lima → Obra A | 6h | Pedreiro             │
│  [+ carregar mais atividades]                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Design Visual & Identidade

### Paleta de Cores (mantém identidade atual)

- **Primária:** Gradiente azul `#1976d2 → #2196f3`
- **Sucesso:** Verde `#10b981` (obras no prazo)
- **Alerta:** Laranja `#f59e0b` (atenção necessária)
- **Erro:** Vermelho `#ef4444` (crítico/atrasado)
- **Neutro:** Cinza `#64748b` (textos secundários)
- **Background:** Gradiente suave `#e3f2fd → #f8faff`

### Cards com "Glassmorphism"

- Background: `rgba(255, 255, 255, 0.95)` com `backdrop-filter: blur(10px)`
- Border: Sutil `1px solid rgba(255, 255, 255, 0.2)`
- Shadow: Elevação suave `0 4px 20px rgba(25, 118, 210, 0.08)`
- Hover: Elevação aumenta `translateY(-5px)` + shadow intensifica

### Tipografia

- **Títulos grandes:** 2rem (welcome), 1.3rem (cards)
- **Números principais:** 2.25rem (métricas), bold 700
- **Labels:** 0.9rem, peso 500, cor `#64748b`
- **Ícones:** Emojis + símbolos Unicode (sem dependência de bibliotecas)

---

## 🧩 Componentes Detalhados

### 1. HEADER DE BOAS-VINDAS

**Visual atual:** Gradiente azul com saudação estática

**Novo design:**
- **Linha 1:** "🌟 Bem-vinda, Viviane!" (mantém)
- **Linha 2:** Data/hora atualizada em tempo real: "Quarta-feira, 12 de dezembro de 2025 • 14:23:45"
- **Linha 3 (NOVO):** Resumo dinâmico: "4 obras ativas • 12 de 15 funcionários trabalhando • 3 ausentes hoje"
- **Ícone pulsante (NOVO):** Indicador de sincronização com API (ponto verde piscando quando atualiza)

**Interação:**
- Relógio atualiza a cada 1 segundo
- Resumo recalcula quando há nova atividade (via polling ou quando usuário adiciona lançamento)

---

### 2. CARDS DE MÉTRICAS PRINCIPAIS (4 cards)

**Grid responsivo:** 4 colunas desktop → 2 colunas tablet → 1 coluna mobile

#### Card 1: 💰 CUSTO DO MÊS
```
┌────────────────────┐
│ 💰 CUSTO MÊS       │
│ R$ 45.280,00       │ ← Número grande
│ +12% vs mês ant.   │ ← Badge verde/vermelho com seta ↑/↓
│ [ver detalhes ↗]   │ ← Link sutil
└────────────────────┘
```
**Cálculo:** Soma `funcionarios[].salario_dia * dias_trabalhados` do mês
**Ao clicar:** Abre modal com breakdown por obra

#### Card 2: 👷 FUNCIONÁRIOS ATIVOS
```
┌────────────────────┐
│ 👷 ATIVOS HOJE     │
│ 12/15              │ ← 12 trabalhando de 15 total
│ 3 ausentes         │ ← Texto vermelho se > 0
│ [ver lista ↗]      │
└────────────────────┘
```
**Cálculo:** Funcionários com lançamento hoje / total
**Ao clicar:** Abre modal com lista de ausentes (se houver) ou vai para aba Funcionários

#### Card 3: 🏗️ OBRAS EM ANDAMENTO
```
┌────────────────────┐
│ 🏗️ OBRAS           │
│ 4 em andamento     │ ← Total obras.status = "Em andamento"
│ 2 atrasadas ⚠️     │ ← Badge laranja se houver
│ [ver cronograma ↗] │
└────────────────────┘
```
**Cálculo:** Obras com status "Em andamento"
**Alerta:** Vermelho se prazo_final < hoje
**Ao clicar:** Scroll suave para seção "Cronograma Semanal" ou abre aba Obras

#### Card 4: ⏱️ HORAS HOJE
```
┌────────────────────┐
│ ⏱️ HORAS HOJE      │
│ 64,5h              │ ← Soma lancamentos de hoje
│ 8 lançamentos      │ ← Contador
│ [ver lançamentos ↗]│
└────────────────────┘
```
**Cálculo:** Soma `lancamentos[].horas` onde data = hoje
**Ao clicar:** Vai para aba Lançamentos com filtro "Hoje"

**Design dos cards:**
- Animação de entrada: Fade in + slide up (stagger 100ms entre cards)
- Hover: Elevação sutil + borda azul aparece
- Loading: Skeleton pulsante enquanto carrega dados da API

---

### 3. GRÁFICO: HORAS POR OBRA (Barras Horizontais)

**Posicionamento:** Grid esquerda, ocupa ~60% da largura

**Visual:**
```
📊 HORAS POR OBRA (últimos 30 dias)
────────────────────────────────────
✅ Obra Shopping Norte        ████████████ 120h (40%)
⚠️ Obra Residencial Sul       ████ 45h (15%)
✅ Obra Prédio Centro         ██████████ 90h (30%)
🔴 Obra Galpão Industrial     ██ 15h (5%)
                              [Total: 270h]
```

**Recursos:**
- **Cores das barras:** Verde (no prazo), laranja (atenção), vermelho (crítico)
- **Ícones de status:** ✅ ⚠️ 🔴 baseado em prazo vs progresso
- **Tooltip ao hover:** "Obra Shopping Norte | 120h trabalhadas | 15 funcionários | Prazo: 15/01/2025"
- **Clique na barra:** Abre modal drilldown com:
  - Breakdown por funcionário (quem trabalhou quanto)
  - Evolução diária (mini gráfico de linha)
  - Botão "Ir para Obra" (abre aba Obras com filtro)

**Cálculo:**
1. Agrupa `lancamentos[]` por `obra_id` (últimos 30 dias)
2. Soma horas por obra
3. Ordena decrescente
4. Limita top 5 (+ opção "ver todas")

---

### 4. PAINEL: TOP FUNCIONÁRIOS DO MÊS

**Posicionamento:** Grid direita, ocupa ~40% da largura

**Visual:**
```
🏆 TOP FUNCIONÁRIOS (este mês)
──────────────────────────────
1. [JS] João Silva        85h ⭐⭐⭐⭐⭐
   Carpinteiro • 4 obras

2. [MC] Maria Costa       78h ⭐⭐⭐⭐
   Encanadora • 3 obras

3. [PL] Pedro Lima        65h ⭐⭐⭐⭐
   Pedreiro • 2 obras

4. [AR] Ana Rocha         58h ⭐⭐⭐
   Pintora • 3 obras

5. [CF] Carlos Freitas    52h ⭐⭐⭐
   Eletricista • 2 obras

[+ ver todos os 15 funcionários]
```

**Recursos:**
- **Avatar com iniciais:** Círculo colorido (cor baseada em hash do nome) com letras brancas "JS"
- **Estrelas:** Baseado em `avaliacoes.nota_geral` (média das avaliações)
- **Badge da função:** Pill com cor pastel
- **Hover:** Card expande mostrando preview de avaliações recentes
- **Clique:** Abre modal com:
  - Perfil completo do funcionário
  - Gráfico de horas por semana (4 semanas)
  - Últimas avaliações
  - Obras em que trabalhou
  - Botão "Ver detalhes completos" → aba Funcionários

**Cálculo:**
1. Agrupa `lancamentos[]` do mês por `funcionario_id`
2. Soma horas
3. Join com `funcionarios[]` para pegar nome, função
4. Join com `avaliacoes[]` para média de estrelas
5. Ordena por horas decrescente
6. Top 5

---

### 5. CRONOGRAMA SEMANAL (NOVO)

**Posicionamento:** Grid esquerda, abaixo do gráfico de obras

**Visual:**
```
📅 CRONOGRAMA SEMANAL (Seg 9 → Dom 15 Dez)
──────────────────────────────────────────
┌───┬───┬───┬───┬───┬───┬───┐
│SEG│TER│QUA│QUI│SEX│SAB│DOM│
├───┼───┼───┼───┼───┼───┼───┤
│ 8 │ 6 │ 4 │ 0 │ 0 │ 0 │ 0 │ ← Número de lançamentos
│64h│48h│32h│ - │ - │ - │ - │ ← Horas totais
│🟢│🟢│🟡│⚫│⚫│⚫│⚫│ ← Status (verde=normal, cinza=futuro)
└───┴───┴───┴───┴───┴───┴───┘

Média diária: 48h | Pico: Segunda (64h)
```

**Interação:**
- **Hover em dia:** Mostra lista de obras ativas naquele dia
- **Clique em dia:** Filtra "Atividade Recente" para mostrar apenas lançamentos daquele dia
- **Navegação:** Setas < > para semana anterior/próxima

**Cálculo:**
- Agrupa `lancamentos[]` por dia da semana (últimos 7 dias)
- Conta quantidade + soma horas
- Indicador colorido baseado em meta (ex: verde se >= 50h/dia)

---

### 6. ALERTAS E PENDÊNCIAS (NOVO)

**Posicionamento:** Grid direita, abaixo de Top Funcionários

**Visual:**
```
🚨 ALERTAS E PENDÊNCIAS
───────────────────────
⚠️ Obra Residencial Sul
   Sem lançamentos há 3 dias
   [Ir para obra →]

🔴 Obra Shopping Norte
   12% acima do orçamento
   R$ 15.280 / R$ 13.500 previsto
   [Ver detalhes →]

⏰ Funcionário João Silva
   Sem avaliação há 45 dias
   [Avaliar agora →]

[+ ver todos os 5 alertas]
```

**Tipos de alertas:**
1. **Obra sem lançamentos:** > 2 dias sem activity
2. **Orçamento estourado:** Custo real > orçamento previsto
3. **Funcionário sem avaliação:** > 30 dias desde última avaliação
4. **Prazo próximo:** Obra com prazo em < 7 dias
5. **Funcionários ausentes:** > 3 dias sem lançamento

**Priorização:**
- 🔴 Crítico (vermelho): Orçamento, prazo vencido
- ⚠️ Atenção (laranja): Sem lançamentos, sem avaliação
- ℹ️ Informativo (azul): Próximos vencimentos

**Interação:**
- Clique em alerta: Vai para contexto relevante (obra/funcionário/etc)
- Botão "Resolver": Marca alerta como "visto" (localStorage)
- Badge com contador no ícone 🚨 (número de alertas não vistos)

---

### 7. ATIVIDADE RECENTE

**Posicionamento:** Full width, final da página

**Visual:**
```
📋 ATIVIDADE RECENTE (últimos 10 lançamentos)
─────────────────────────────────────────────
┌──────────────────────────────────────────────────────┐
│ 🕐 14:23 • há 2 min                                  │
│ João Silva → Obra Shopping Norte                     │
│ 8,5 horas • Carpinteiro • ⭐⭐⭐⭐⭐                   │
├──────────────────────────────────────────────────────┤
│ 🕐 14:15 • há 10 min                                 │
│ Maria Costa → Obra Residencial Sul                   │
│ 4 horas • Encanadora • ⭐⭐⭐⭐                        │
├──────────────────────────────────────────────────────┤
│ 🕐 13:45 • há 40 min                                 │
│ Pedro Lima → Obra Shopping Norte                     │
│ 6 horas • Pedreiro • ⭐⭐⭐⭐                          │
└──────────────────────────────────────────────────────┘

[Carregar mais 10 atividades ↓]
```

**Recursos:**
- **Timestamp relativo:** "há 2 min", "há 1 hora", "há 3 dias"
- **Cores de badge:** Função do funcionário tem cor consistente
- **Mini avatar:** Iniciais do funcionário (círculo colorido)
- **Infinite scroll:** Botão "carregar mais" adiciona +10 itens
- **Filtros rápidos (pills):** [Hoje] [Esta semana] [Este mês] [Todas]
- **Hover:** Fundo muda + botão "Ver detalhes" aparece

**Cálculo:**
- Ordena `lancamentos[]` por `criado_em DESC`
- Join com `funcionarios[]`, `obras[]`
- Limita inicial: 10 itens
- Paginação client-side para performance

---

## 🔄 Fluxo de Interação do Usuário

### Fluxo 1: Verificação Rápida Matinal
```
1. Usuário abre sistema → Dashboard carrega
2. Visualiza cards: "12 funcionários ativos, 4 obras"
3. Vê alerta: "⚠️ Obra B sem lançamento há 3 dias"
4. Clica no alerta → Abre aba Obras com filtro "Obra B"
5. Adiciona nota/comentário na obra
```

### Fluxo 2: Análise de Performance
```
1. Usuário clica no card "🏆 Top Funcionários"
2. Modal abre com gráfico de evolução de horas
3. Vê que João Silva teve queda de 30% na semana
4. Clica "Ver detalhes" → Aba Funcionários
5. Adiciona avaliação de desempenho
```

### Fluxo 3: Controle de Orçamento
```
1. Vê card "💰 R$ 45.280 | +12% vs mês anterior"
2. Badge vermelho indica aumento preocupante
3. Clica "ver detalhes" → Modal com breakdown por obra
4. Identifica "Obra Shopping Norte" responsável
5. Clica na obra → Gráfico de horas mostra pico anormal
6. Vai para Lançamentos daquela obra
7. Ajusta lançamentos incorretos
```

### Fluxo 4: Acompanhamento de Cronograma
```
1. Olha "Cronograma Semanal"
2. Vê que Quinta e Sexta estão zeradas
3. Clica em "Quinta" → Filtra atividades daquele dia
4. Vê que não há lançamentos futuros
5. Vai para aba Lançamentos
6. Adiciona planejamento para quinta
```

---

## 📱 Responsividade

### Desktop (> 1200px)
- Grid 4 colunas para cards de métricas
- Gráficos lado a lado (60/40)
- Sidebar expandida por padrão

### Tablet (768px - 1200px)
- Grid 2 colunas para cards
- Gráficos empilham (full width cada)
- Sidebar retrátil

### Mobile (< 768px)
- Grid 1 coluna (cards empilham)
- Gráficos simplificados (menos barras)
- Header compacto (resumo oculto)
- Cronograma horizontal scroll
- Sidebar overlay (esconde conteúdo)

---

## ⚡ Performance & Otimizações

### Lazy Loading
- Gráficos só renderizam quando visíveis (Intersection Observer)
- Atividade Recente: Infinite scroll com virtualização

### Caching
- Dados do dashboard em cache (5 minutos)
- Atualização incremental via polling (30 segundos)
- LocalStorage para preferências (cards minimizados, alertas vistos)

### Animações
- CSS transforms (GPU-accelerated)
- Debounce em hover tooltips (300ms)
- Skeleton screens enquanto carrega dados

### Dados
- Cálculos pesados (agregações) em Web Worker
- Memoização de funções de formatação
- Batch updates no DOM (requestAnimationFrame)

---

## 🎯 Priorização de Desenvolvimento (se fosse implementar)

### Fase 1 - MVP (Essencial)
1. ✅ Corrigir mismatch de IDs HTML ↔ JavaScript
2. ✅ Relógio em tempo real no header
3. ✅ Cards de métricas funcionais (4 cards)
4. ✅ Gráfico de horas por obra (barras horizontais)
5. ✅ Top 5 funcionários com avatares

### Fase 2 - Interatividade
6. ✅ Modais de drilldown (clique nos cards)
7. ✅ Tooltips informativos nos gráficos
8. ✅ Filtros na atividade recente
9. ✅ Cronograma semanal básico

### Fase 3 - Inteligência
10. ✅ Sistema de alertas automáticos
11. ✅ Cálculos de orçamento vs real
12. ✅ Detecção de ausências/anomalias
13. ✅ Badges de status contextuais

### Fase 4 - Polimento
14. ✅ Animações e transições suaves
15. ✅ Responsividade mobile refinada
16. ✅ Dark mode (se solicitado)
17. ✅ Exportar dashboard como PDF

---

## 🎨 Mockup de Referência (Descrição Textual)

Imagine um painel inspirado em:
- **Stripe Dashboard:** Cards limpos, métricas grandes, micro-animações
- **Linear:** Tipografia forte, cores vibrantes em badges de status
- **Notion:** Hierarquia visual clara, hover states sutis
- **Tailwind UI:** Componentes modernos, glassmorphism, gradientes

**Estilo geral:**
- Espaçamento generoso (breathing room)
- Tipografia hierárquica (tamanhos 2rem → 0.85rem)
- Sombras suaves (não exageradas)
- Cores saturadas apenas em estados de ação
- Bordas arredondadas (12px - 20px)

---

## 📋 Checklist de UX

- [ ] **Escaneabilidade:** Usuário identifica informação crítica em < 5s
- [ ] **Ação rápida:** 1 clique para resolver alertas
- [ ] **Feedback visual:** Loading states, confirmações, erros claros
- [ ] **Consistência:** Padrões de cor/ícone se repetem (verde = ok, vermelho = erro)
- [ ] **Acessibilidade:** Cores com contraste WCAG AA, textos alternativos
- [ ] **Mobilidade:** Funcional em touch (áreas de toque >= 44px)
- [ ] **Performance:** Carrega em < 2s em 3G
- [ ] **Recuperação:** Offline state, retry automático em falhas de API

---

## 🚀 Próximos Passos (quando for implementar)

1. **Validar com usuário:** Mostrar este plano para Viviane/stakeholders
2. **Priorizar features:** Definir MVP baseado em necessidade
3. **Prototipar:** Criar mockup visual no Figma (opcional)
4. **Implementar fase 1:** Corrigir bugs existentes + MVP
5. **Iterar:** Adicionar features incrementalmente
6. **Medir:** Analytics para ver quais cards/gráficos são mais usados

---

---

# PLANO TÉCNICO DE IMPLEMENTAÇÃO

## ⚖️ Decisão Arquitetural: HÍBRIDA COM FOCO NA NOVA

### Recomendação: Implementar na arquitetura MODULAR (js/modules/)

**Por quê?**

✅ **Arquitetura Nova tem infraestrutura completa:**
- Store.js pronto para gerenciar estado
- Components.js com 10+ componentes reutilizáveis (StatCard, ResponsiveTable, Badge)
- Utils.js com 30+ funções prontas (formatação de datas, validação, cálculos)
- UI.js com sistema de notificações, modals, loading
- API.js estruturado para todas entidades

✅ **Vantagens da abordagem modular:**
- Componentes reutilizáveis (escreve uma vez, usa em todo lugar)
- Estado reativo (mudanças de dados atualizam UI automaticamente)
- Debug profissional (histórico de estado, ferramentas de console)
- Escalável (adicionar features = novo módulo, não mexer em 4000 linhas)
- Manutenível (bug no dashboard? Apenas dashboard.js)

❌ **Arquitetura Antiga (script.js) tem problemas:**
- Função `atualizarDashboard()` (linhas 1346-1418) tem BUGS conhecidos:
  - IDs no código não batem com HTML (busca `total-empresas` mas HTML tem `dash-funcionarios`)
  - Lógica de cálculo básica e duplicada
  - Não usa store centralizado
  - Sem componentes reutilizáveis

### Estratégia: Implementação Modular + Compatibilidade

```
┌────────────────────────────────────────────────────┐
│  FASE 1: Dashboard Completo (Nova Arquitetura)    │
│  ├─ Criar js/modules/dashboard.js                 │
│  ├─ Implementar todas features UX                 │
│  ├─ Usar componentes reutilizáveis                │
│  └─ Integrar com Store.js                         │
├────────────────────────────────────────────────────┤
│  FASE 2: Garantir Compatibilidade                 │
│  ├─ Manter script.js como backup                  │
│  ├─ HTML funciona com ambas arquiteturas          │
│  └─ Toggle via comentário em index.html           │
├────────────────────────────────────────────────────┤
│  FASE 3: Migração Futura (opcional)               │
│  ├─ funcionarios.js                               │
│  ├─ obras.js                                      │
│  ├─ lancamentos.js                                │
│  └─ avaliacoes.js                                 │
└────────────────────────────────────────────────────┘
```

---

## 📁 Estrutura de Arquivos

### Arquivos a Criar

```
🆕 CRIAR:
e:\Planilha\js\modules\dashboard.js  (Módulo principal - ~600 linhas)
```

### Arquivos a Modificar

```
✏️ MODIFICAR:
e:\Planilha\js\app.js                    (Adicionar import/init - 3 linhas)
e:\Planilha\js\modules\components.js     (Adicionar 3 componentes - ~80 linhas)
e:\Planilha\js\modules\store.js          (Adicionar dashboardActions - 5 linhas)
e:\Planilha\js\modules\utils.js          (Adicionar 3 funções - ~30 linhas)
e:\Planilha\index.html                   (Atualizar HTML dashboard - linhas 99-150)
```

### Arquivos Sem Alteração

```
✅ SEM ALTERAÇÃO:
e:\Planilha\script.js                    (Backup funcional)
e:\Planilha\styles.css                   (CSS já tem classes necessárias)
e:\Planilha\api_lancamentos.php          (Backend OK)
e:\Planilha\api_funcionarios.php         (Backend OK)
e:\Planilha\api_obras.php                (Backend OK)
e:\Planilha\api_empresas.php             (Backend OK)
```

---

## 🏗️ Estrutura do Módulo dashboard.js

### Organização do Código

```javascript
// ========================================
// 1. IMPORTS (Dependências externas)
// ========================================
import { LancamentosAPI, FuncionariosAPI, ObrasAPI } from './api.js';
import { dashboardActions, lancamentosActions, ... } from './store.js';
import { showNotification, showLoading, hideLoading } from './ui.js';
import { StatCard, BarChart, ActivityFeed, TopEmployeeCard } from './components.js';
import { formatarData, calcularHorasTotais, getDiasUteis } from './utils.js';

// ========================================
// 2. ESTADO LOCAL (State privado do módulo)
// ========================================
let dashboardState = {
    periodoAtual: 'mes',      // 'hoje' | 'semana' | 'mes'
    metricsCache: null,        // Cache de métricas calculadas
    ultimaAtualizacao: null    // Timestamp do último refresh
};

// ========================================
// 3. INICIALIZAÇÃO (Setup do módulo)
// ========================================
export async function initDashboard() {
    setupEventListeners();
    setupRelogioAoVivo();
    await carregarDadosDashboard();
    setupAutoRefresh();
}

// ========================================
// 4. CARREGAMENTO DE DADOS (API → Store)
// ========================================
export async function carregarDadosDashboard() {
    // Buscar dados de todas entidades em paralelo
    // Atualizar Store
    // Calcular métricas
    // Renderizar
}

// ========================================
// 5. CÁLCULO DE MÉTRICAS (Lógica de negócio)
// ========================================
function calcularMetricas() {
    // MÉTRICA 1: Custo Total do Mês
    // MÉTRICA 2: Funcionários Ativos
    // MÉTRICA 3: Obras em Andamento
    // MÉTRICA 4: Horas Hoje
    // MÉTRICA 5: Top 5 Funcionários
    // MÉTRICA 6: Horas por Obra
    // MÉTRICA 7: Cronograma Semanal
    // MÉTRICA 8: Alertas Inteligentes
    // MÉTRICA 9: Atividades Recentes
}

// ========================================
// 6. RENDERIZAÇÃO (Componentes → DOM)
// ========================================
export function renderizarDashboard() {
    renderizarCards();
    renderizarGraficoObras();
    renderizarTopFuncionarios();
    renderizarCronogramaSemanal();
    renderizarAlertas();
    renderizarAtividades();
}

// ========================================
// 7. FEATURES INTERATIVAS (Relógio, Auto-refresh)
// ========================================
function setupRelogioAoVivo() { ... }
function setupAutoRefresh() { ... }

// ========================================
// 8. EVENT LISTENERS (Filtros, Botões)
// ========================================
function setupEventListeners() { ... }

// ========================================
// 9. EXPORTAÇÃO PARA WINDOW (Compatibilidade onclick)
// ========================================
if (typeof window !== 'undefined') {
    window.initDashboard = initDashboard;
    window.carregarDadosDashboard = carregarDadosDashboard;
}
```

### Funções Principais

| Função | Responsabilidade | Linhas Aprox. |
|--------|------------------|---------------|
| `initDashboard()` | Inicializa módulo, configura listeners | 10 |
| `carregarDadosDashboard()` | Busca dados de 4 APIs em paralelo | 25 |
| `calcularMetricas()` | Calcula todas as 9 métricas | 80 |
| `calcularCustoMes()` | Soma (horas × valor_hora) por funcionário | 15 |
| `calcularTopFuncionarios()` | Agrupa por funcionário, ordena por horas | 30 |
| `calcularHorasPorObra()` | Agrupa por obra, top 5 | 20 |
| `calcularCronogramaSemanal()` | Próximos 7 dias com distribuição | 25 |
| `gerarAlertas()` | 3 tipos de alertas automáticos | 60 |
| `renderizarDashboard()` | Master function que renderiza tudo | 10 |
| `renderizarCards()` | 4 StatCards com métricas | 30 |
| `renderizarGraficoObras()` | Gráfico de barras horizontal | 20 |
| `renderizarTopFuncionarios()` | Lista com avatares/estrelas | 25 |
| `renderizarCronogramaSemanal()` | Mini calendário 7 dias | 30 |
| `renderizarAlertas()` | Cards de alerta com ações | 20 |
| `renderizarAtividades()` | Feed com últimos 10 lançamentos | 15 |
| `setupRelogioAoVivo()` | Relógio HH:MM:SS atualizado | 15 |
| `setupAutoRefresh()` | Atualiza a cada 5 minutos | 10 |
| `setupEventListeners()` | Filtros de período, botão refresh | 20 |

**Total:** ~600 linhas (bem documentadas e organizadas)

---

## 🧩 Novos Componentes em components.js

### 1. BarChart (Gráfico de Barras Horizontal)

```javascript
export function BarChart({ dados, labelKey, valueKey, formatValue, cor = '#2563eb' }) {
    // Renderiza barras proporcionais
    // Hover mostra detalhes
    // Máximo 5 itens (top 5)
}
```

**Uso:**
```javascript
const html = BarChart({
    dados: [{obra: 'Shopping Norte', horas: 120}, ...],
    labelKey: 'obra',
    valueKey: 'horas',
    formatValue: (h) => `${h.toFixed(1)}h`,
    cor: '#2563eb'
});
```

### 2. TopEmployeeCard (Card de Funcionário)

```javascript
export function TopEmployeeCard({ nome, funcao, horas, avaliacao, avatar }) {
    // Avatar com iniciais ou foto
    // Nome + função (badge)
    // Horas trabalhadas
    // Estrelas de avaliação (★★★★☆)
}
```

**Uso:**
```javascript
const html = TopEmployeeCard({
    nome: 'João Silva',
    funcao: 'Carpinteiro',
    horas: '85h 30m',
    avaliacao: 4.5,
    avatar: null  // Usa iniciais "JS"
});
```

### 3. ActivityFeed (Feed de Atividades)

```javascript
export function ActivityFeed({ atividades }) {
    // Lista de atividades com:
    // - Ícone
    // - Tempo relativo ("Hoje", "Ontem", "3 dias atrás")
    // - Descrição formatada
}
```

**Uso:**
```javascript
const html = ActivityFeed({
    atividades: [
        {
            icone: '👷',
            tempo: 'Hoje',
            texto: '<strong>João Silva</strong> trabalhou 8h em <em>Obra A</em>'
        }
    ]
});
```

---

## 🔄 Fluxo de Dados (Data Flow)

```
┌─────────────────────────────────────────────────────────────────┐
│                    INICIALIZAÇÃO DO SISTEMA                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
            app.js → initApp() → carregarDadosIniciais()
                              ↓
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
  carregarEmpresas()  carregarDadosDashboard()  (futuros)
        │                     │
        ↓                     ↓
  EmpresasAPI          Promise.all([
    .listar()            EmpresasAPI.listar(),
        │                FuncionariosAPI.listar(),
        ↓                ObrasAPI.listar(),
  empresasActions        LancamentosAPI.listar()
    .set(dados)        ])
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
              Atualizar Store     Atualizar Store
              (empresas)          (funcionarios, obras, lancamentos)
                    │                   │
                    └─────────┬─────────┘
                              ↓
                    calcularMetricas()
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
  calcularCustoMes()  calcularTopFunc()  gerarAlertas()
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              ↓
                  Armazenar no Cache + Store
              (dashboardState.metricsCache)
              (dashboardActions.setMetrics())
                              ↓
                  renderizarDashboard()
                              │
        ┌─────────────────────┼─────────────────────┐
        ↓                     ↓                     ↓
  renderizarCards()  renderizarGraficoObras()  renderizarAlertas()
        │                     │                     │
        ↓                     ↓                     ↓
   StatCard()            BarChart()             Alert()
   (component)           (component)            (component)
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              ↓
                  Atualizar DOM (innerHTML)
                              ↓
                  ┌───────────┴───────────┐
                  ↓                       ↓
          Usuário vê dashboard    Auto-refresh (5min)
                                         │
                                         ↓
                              carregarDadosDashboard()
                                    (loop infinito)
```

---

## 📅 Roadmap de Implementação (4 Sprints)

### SPRINT 1: Infraestrutura e MVP (2-3 dias) ⭐ PRIORITÁRIO

**Objetivo:** Dashboard básico funcional com métricas essenciais

**Tarefas:**
1. ✅ Criar arquivo `js/modules/dashboard.js` com estrutura básica
2. ✅ Implementar `calcularMetricas()` (métricas 1-4: custo, ativos, obras, horas)
3. ✅ Adicionar componente `StatCard` em `components.js` (se não existe)
4. ✅ Atualizar HTML do dashboard em `index.html` (linhas 99-150)
5. ✅ Integrar no `app.js` (import + init)
6. ✅ Implementar `renderizarCards()` (4 cards principais)
7. ✅ Implementar `setupRelogioAoVivo()` (relógio HH:MM:SS)
8. ✅ Testar carregamento e exibição

**Entregáveis:**
- Dashboard funcional com 4 métricas principais
- Relógio ao vivo funcionando
- Estrutura modular implementada

**Validação:**
```
[ ] Cards exibem valores corretos do backend
[ ] Relógio atualiza a cada segundo
[ ] Console não mostra erros
[ ] Loading aparece durante carregamento
[ ] HTML está correto (inspecionar elemento)
```

---

### SPRINT 2: Visualizações e Gráficos (2-3 dias)

**Objetivo:** Implementar gráficos e ranking de funcionários

**Tarefas:**
1. ✅ Adicionar componente `BarChart` em `components.js`
2. ✅ Implementar `calcularHorasPorObra()` e `renderizarGraficoObras()`
3. ✅ Adicionar componente `TopEmployeeCard` em `components.js`
4. ✅ Implementar `calcularTopFuncionarios()` com avatares/estrelas
5. ✅ Implementar `calcularCronogramaSemanal()` e renderizar
6. ✅ Adicionar CSS para cronograma (barras verticais)
7. ✅ Implementar filtros de período (Hoje/Semana/Mês)
8. ✅ Adicionar animações CSS nas barras

**Entregáveis:**
- Gráfico de barras de horas por obra
- Top 5 funcionários com avatares
- Cronograma semanal visual
- Filtros de período funcionais

**Validação:**
```
[ ] Gráfico renderiza com dados reais
[ ] Barras têm tamanho proporcional
[ ] Top 5 mostra funcionários corretos
[ ] Avatares aparecem (iniciais se sem foto)
[ ] Estrelas correspondem à avaliação
[ ] Cronograma mostra próximos 7 dias
[ ] Filtros alteram os dados exibidos
```

---

### SPRINT 3: Alertas e Atividades (1-2 dias)

**Objetivo:** Sistema de alertas inteligentes e feed de atividades

**Tarefas:**
1. ✅ Implementar `gerarAlertas()` com 3 tipos:
   - Funcionários sem lançamento hoje
   - Obras sem atividade (7 dias)
   - Meta de horas abaixo do esperado
2. ✅ Adicionar componente `Alert` (se não existe)
3. ✅ Implementar `renderizarAlertas()`
4. ✅ Adicionar componente `ActivityFeed` em `components.js`
5. ✅ Implementar `formatarAtividadesRecentes()`
6. ✅ Implementar `renderizarAtividades()`
7. ✅ Adicionar tempo relativo ("Hoje", "Ontem", "3 dias atrás")
8. ✅ Implementar dismissible nos alertas (fechar com X)

**Entregáveis:**
- Sistema de alertas funcionando
- Feed de atividade recente
- Notificações contextuais

**Validação:**
```
[ ] Alertas aparecem quando devem
[ ] "Funcionários sem lançamento" funciona
[ ] "Obras sem atividade" detecta corretamente
[ ] Alertas podem ser fechados (X)
[ ] Feed mostra últimos 10 lançamentos
[ ] Tempo relativo está correto
[ ] Ícones contextuais aparecem
```

---

### SPRINT 4: Otimização e Polish (1-2 dias)

**Objetivo:** Refinamentos, cache e UX

**Tarefas:**
1. ✅ Implementar cache de métricas (evitar recálculos)
2. ✅ Adicionar loading states em cada seção
3. ✅ Implementar `setupAutoRefresh()` (5 minutos)
4. ✅ Adicionar animações de entrada (fade-in, slide-up)
5. ✅ Otimizar cálculos (memoização se necessário)
6. ✅ Adicionar empty states (quando não há dados)
7. ✅ Testar responsividade mobile/tablet
8. ✅ Documentar código (JSDoc)
9. ✅ Atualizar [CLAUDE.md](CLAUDE.md) com novo módulo

**Entregáveis:**
- Dashboard otimizado e responsivo
- Auto-refresh implementado
- Documentação completa

**Validação:**
```
[ ] Dashboard carrega em < 2s
[ ] Auto-refresh funciona (esperar 5min)
[ ] Responsivo em mobile/tablet
[ ] Empty states aparecem corretamente
[ ] Animações são suaves (60fps)
[ ] Código está documentado
[ ] CLAUDE.md atualizado
```

---

## 🔧 Modificações em Arquivos Existentes

### 1. app.js (3 linhas)

```javascript
// ADICIONAR no topo (imports)
import { initDashboard, carregarDadosDashboard } from './modules/dashboard.js';

// MODIFICAR função carregarDadosIniciais()
async function carregarDadosIniciais() {
    console.log('  → Carregando dados...');
    const promises = [
        carregarEmpresas(),
        carregarDadosDashboard(),  // ← ADICIONAR ESTA LINHA
        // Futuros: carregarFuncionarios(), carregarObras(), etc
    ];
    await Promise.all(promises);
}

// ADICIONAR na função initApp() (após initEmpresas)
async function initApp() {
    // ... código existente ...

    await initEmpresas();
    await initDashboard();  // ← ADICIONAR ESTA LINHA

    // ... resto do código ...
}
```

### 2. store.js (5 linhas)

```javascript
// ADICIONAR na seção de exports (final do arquivo)

// Dashboard actions
export const dashboardActions = {
    setMetrics: (metrics) => store.setState('dashboardMetrics', metrics),
    getMetrics: () => store.getState('dashboardMetrics')
};
```

### 3. utils.js (3 funções)

```javascript
// ADICIONAR ao final do arquivo

/**
 * Calcula dias úteis do mês até hoje
 */
export function getDiasUteis(data) {
    const ano = data.getFullYear();
    const mes = data.getMonth();
    const hoje = data.getDate();

    let diasUteis = 0;
    for (let dia = 1; dia <= hoje; dia++) {
        const d = new Date(ano, mes, dia);
        const diaSemana = d.getDay();
        if (diaSemana !== 0 && diaSemana !== 6) diasUteis++;
    }
    return diasUteis;
}

/**
 * Calcula total de horas em decimal
 */
export function calcularHorasTotais(lancamentos) {
    return lancamentos.reduce((total, lanc) => {
        const [h, m] = (lanc.horas || '00:00').split(':').map(Number);
        return total + h + (m || 0) / 60;
    }, 0);
}

/**
 * Formata horas decimal para HH:MM
 */
export function formatarHorasDecimal(horasDecimal) {
    const horas = Math.floor(horasDecimal);
    const minutos = Math.round((horasDecimal % 1) * 60);
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}
```

### 4. index.html (substituir linhas 99-150)

```html
<!-- Dashboard Tab -->
<div id="dashboard" class="tab-content active">
    <!-- Header com Relógio -->
    <div class="welcome-section">
        <h1 class="welcome-title">🌟 Bem-vinda, Viviane!</h1>
        <p class="welcome-subtitle">Painel de Controle - Sistema de Obras e Funcionários</p>
        <div class="current-time" id="current-time"></div>
        <div class="dashboard-summary" id="dashboard-summary">
            <!-- "4 obras ativas • 12 funcionários trabalhando" -->
        </div>
    </div>

    <!-- Cards de Métricas (Grid 4 colunas) -->
    <div class="dashboard-metrics" id="dashboard-metrics-cards">
        <!-- StatCards renderizados via JS -->
    </div>

    <!-- Grid: Gráficos + Top Funcionários (2 colunas) -->
    <div class="charts-grid">
        <!-- Gráfico de Horas por Obra -->
        <div class="chart-card">
            <h3 class="chart-title">📊 Horas por Obra (Este Mês)</h3>
            <div id="chart-obras" class="simple-chart"></div>
        </div>

        <!-- Top 5 Funcionários -->
        <div class="chart-card">
            <h3 class="chart-title">🏆 Top 5 Funcionários</h3>
            <div id="top-funcionarios"></div>
        </div>
    </div>

    <!-- Grid: Cronograma + Alertas (2 colunas) -->
    <div class="charts-grid">
        <!-- Cronograma Semanal -->
        <div class="chart-card">
            <h3 class="chart-title">📅 Cronograma Semanal</h3>
            <div id="cronograma-semanal"></div>
        </div>

        <!-- Alertas -->
        <div class="chart-card">
            <h3 class="chart-title">🚨 Alertas e Pendências</h3>
            <div id="dashboard-alertas"></div>
        </div>
    </div>

    <!-- Feed de Atividade Recente (Full Width) -->
    <div class="recent-activity">
        <h3 class="chart-title">📋 Atividade Recente</h3>
        <div id="recent-activities"></div>
    </div>
</div>
```

---

## 🔀 Estratégia de Compatibilidade

### Como Manter Ambas Arquiteturas Funcionando

**Problema:** Usuário pode querer voltar para `script.js` antigo.

**Solução:**

1. **Não deletar `script.js`** - Backup funcional
2. **HTML compatível** - Usar mesmos IDs
3. **Toggle no `index.html`** - Comentário claro

```html
<!-- ========================================
     ESCOLHA A ARQUITETURA ATIVA:
     ======================================== -->

<!-- ✅ OPÇÃO 1: Nova arquitetura modular (RECOMENDADA) -->
<script type="module" src="js/app.js"></script>

<!-- ⚠️ OPÇÃO 2: Arquitetura antiga (backup) -->
<!-- <script src="script.js"></script> -->

<!-- IMPORTANTE: Apenas UMA das opções deve estar descomentada! -->
```

### Sincronização de IDs

Alguns IDs do HTML precisam funcionar com ambas arquiteturas:

```html
<!-- Dashboard metrics - IDs dual-compatible -->
<div id="dashboard-metrics-cards">
    <!-- Nova arquitetura renderiza aqui -->

    <!-- IDs legados para script.js (hidden) -->
    <span id="dash-funcionarios" style="display:none;"></span>
    <span id="dash-obras" style="display:none;"></span>
    <span id="dash-horas-hoje" style="display:none;"></span>
</div>
```

---

## ⚠️ Riscos e Mitigações

### Risco 1: Dados de Funcionários/Obras Não Disponíveis

**Problema:** Nova arquitetura só tem `empresas.js` implementado.

**Mitigação:**
- Dashboard funciona com arrays vazios (graceful degradation)
- Validar no código: `if (funcionarios.length === 0)` → empty state
- Priorizar implementação de `funcionarios.js` e `obras.js` ANTES do dashboard

### Risco 2: Performance com Muitos Lançamentos

**Problema:** 10.000+ lançamentos podem travar cálculos.

**Mitigação:**
- Filtrar por período ANTES de calcular
- Cache agressivo (5min de validade)
- Lazy loading no feed de atividades
- Web Workers para cálculos pesados (futuro)

### Risco 3: CSS Faltando para Novos Componentes

**Problema:** TopEmployeeCard, Cronograma podem não ter CSS.

**Mitigação:**
- Usar classes CSS existentes quando possível
- CSS inline como fallback temporário
- Documentar CSS necessário para Sprint 4

### Risco 4: Auto-Refresh Sobrecarregar Backend

**Problema:** Múltiplas abas = múltiplos refreshs.

**Mitigação:**
- Aumentar intervalo (5min → 10min)
- Page Visibility API (pausar quando aba inativa)
- Debounce no refresh

---

## ✅ Checklist de Validação Final

### Funcionalidade
- [ ] Todas as 9 métricas implementadas e funcionando
- [ ] Dados carregam do backend real (não mock)
- [ ] Cálculos estão corretos (validar manualmente)
- [ ] Relógio atualiza em tempo real
- [ ] Auto-refresh funciona (esperar 5min)

### Performance
- [ ] Dashboard carrega em < 2 segundos
- [ ] Auto-refresh não trava a UI
- [ ] Animações são suaves (60fps)
- [ ] Não há memory leaks (testar com DevTools)

### UX
- [ ] Interface intuitiva e visualmente agradável
- [ ] Empty states claros quando não há dados
- [ ] Loading states em todas operações assíncronas
- [ ] Feedback visual em todas ações (cliques, hovers)

### Compatibilidade
- [ ] Funciona em Chrome, Firefox, Edge, Safari
- [ ] Responsivo em mobile (iPhone/Android)
- [ ] Responsivo em tablet (iPad)
- [ ] script.js antigo ainda funciona (toggle)

### Código
- [ ] Código comentado e documentado (JSDoc)
- [ ] Segue padrão dos outros módulos (empresas.js)
- [ ] Sem console.errors ou warnings
- [ ] CLAUDE.md atualizado com novo módulo

---

## 📚 Próximos Passos Após Dashboard

### Curto Prazo (1-2 semanas)
1. Migrar `funcionarios.js` (seguir padrão de empresas.js)
2. Migrar `obras.js`
3. Migrar `lancamentos.js`

### Médio Prazo (1 mês)
4. Migrar `avaliacoes.js`
5. Implementar relatórios avançados
6. Exportar dados (Excel, PDF)

### Longo Prazo (futuro)
7. Deletar `script.js` (quando 100% migrado)
8. PWA (modo offline)
9. Gráficos avançados (Chart.js)
10. WebSockets para atualizações em tempo real

---

## 🎯 Arquivos Críticos para Implementação

### Prioridade ALTA (Criar/Modificar primeiro)

1. **[js/modules/dashboard.js](js/modules/dashboard.js)** - CRIAR (coração da implementação)
   - ~600 linhas
   - Todas as funções de cálculo e renderização
   - Lógica de negócio do dashboard

2. **[index.html](index.html)** - MODIFICAR (linhas 99-150)
   - Estrutura HTML do dashboard
   - IDs corretos para renderização

3. **[js/app.js](js/app.js)** - MODIFICAR (3 linhas)
   - Import do módulo dashboard
   - Inicialização no boot

### Prioridade MÉDIA (Adicionar componentes)

4. **[js/modules/components.js](js/modules/components.js)** - MODIFICAR
   - Adicionar `BarChart` (~30 linhas)
   - Adicionar `TopEmployeeCard` (~25 linhas)
   - Adicionar `ActivityFeed` (~20 linhas)

5. **[js/modules/store.js](js/modules/store.js)** - MODIFICAR (5 linhas)
   - Adicionar `dashboardActions`

6. **[js/modules/utils.js](js/modules/utils.js)** - MODIFICAR (30 linhas)
   - Adicionar 3 funções utilitárias

### Prioridade BAIXA (Opcional/Futuro)

7. **[styles.css](styles.css)** - MODIFICAR (se CSS faltar)
   - Adicionar estilos para cronograma
   - Adicionar estilos para TopEmployeeCard
   - Ajustar responsividade se necessário

---

**Fim do plano técnico de implementação.**
