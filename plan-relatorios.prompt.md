Perfeito — vamos redesenhar a aba Relatórios do zero com uma arquitetura clara, visual moderno e interação fluida. Abaixo está um plano completo para a “Super Página de Relatório”.

## Plan: Nova Página de Relatórios

Uma página única com quatro áreas principais: Resumo, Filtros por Período e Facetas, Visões Agrupadas (Funcionários/Obras) com drill-down e paginação, e Relatório Detalhado + Exportação/Impressão. Aproveita os arrays globais (`lancamentos`, `funcionarios`, `obras`, `empresas`), filtros por data inicial/final e facetas, mantendo renderização rápida com paginação e CSS de impressão.

### Steps
1. Estruturar `#relatorios` com seções: Resumo (`.stats-grid`), Filtros (`.filters-panel`), Agrupados (funcionários/obras com `#rel-func-paginacao` e `#rel-obra-paginacao`), Detalhado (`#tabela-relatorio`), e Ações (imprimir/exportar).
2. HTML: criar painel de filtros abaixo dos cards com `rel-data-inicio`, `rel-data-fim`, `relatorio-funcionario`, `rel-filtro-funcao`, `relatorio-obra`, `filtro-empresa-rel`, e botões `Exportar`/`Imprimir` + `rel-page-size`.
3. CSS: aplicar tokens existentes (azuis primários, sombras suaves, bordas 20px) em `.filters-panel`, `.filters-row`, `.ctrl-select`, tabelas e paginação; garantir `@media print` para ocultar controles e imprimir tabelas limpas.
4. JS: refatorar `aplicarFiltrosRelatorios()` para filtrar por intervalo de datas e facetas, calcular totais (horas, dias, lançamentos) e popular:
   - Agrupados: `relatorio-funcionario-tbody` e `relatorio-obra-tbody` via `renderRelatorioGrupo()` com paginação.
   - Detalhado: `#tabela-relatorio` com colunas Data, Funcionário, Função, Empresa, Obra, Horas, Observações.
5. Drill-down: manter `abrirDrillDownModal(tipo, nome)` listando somente linhas daquele grupo com cabeçalhos completos e rolagem.
6. Exportação e impressão: `exportarCSV()` com cabeçalhos completos e escaping; `imprimirRelatorios()` respeitando CSS de impressão; opcional botão “Limpar filtros”.

### Further Considerations
1. Facetas multi-select: começar com single-select; opcional evoluir para multi-select com chips e “X” para remover.
2. Cards: renomear “Horas do Mês” para “Horas no Período” e “Funcionários/Obras Ativos” conforme filtros.
3. Performance: manter padrão 30 dias; se volume muito alto, adicionar server-side paginação futura (page/pageSize) para `api_lancamentos.php`.
