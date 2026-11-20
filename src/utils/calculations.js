/**
 * AUDITORIA DE CÁLCULOS — Lógica Financeira
 * 
 * Regras:
 * - Itens isFixed aparecem em TODOS os meses
 * - Para acumulado, só contamos meses que tenham pelo menos 1 item NÃO-fixo
 *   (evita meses fantasma inflarem/deflarem o histórico)
 */

/** Retorna todos os itens de um dado mês/ano (incluindo fixos) */
export function getMonthItems(allItems, month, year) {
  return allItems.filter(
    (item) => item.isFixed || (item.month === month && item.year === year)
  );
}

/** Soma os valores de um array de itens */
export function sumItems(items) {
  return items.reduce((sum, i) => sum + (parseFloat(i.valor) || 0), 0);
}

/** Receita total de um mês */
export function getMonthIncome(allItems, month, year) {
  return sumItems(
    getMonthItems(allItems, month, year).filter((i) => i.type === 'income')
  );
}

/** Despesa total de um mês */
export function getMonthExpenses(allItems, month, year) {
  return sumItems(
    getMonthItems(allItems, month, year).filter((i) => i.type === 'expense')
  );
}

/** Saldo de um mês (sobrou) */
export function getMonthBalance(allItems, month, year) {
  return getMonthIncome(allItems, month, year) - getMonthExpenses(allItems, month, year);
}

/**
 * Retorna o acumulado de todos os meses ANTES do mês atual.
 * 
 * FIX: O código anterior só pegava o mês imediatamente anterior.
 * Agora somamos TODOS os meses passados com dados reais.
 * 
 * FIX 2: Só inclui meses que tenham pelo menos 1 item não-fixo.
 * Isso evita que meses sem lançamentos reais sejam computados
 * apenas por causa de itens fixos (o que geraria saldos fantasma).
 */
export function getCumulativeGuardado(allItems, currentMonth, currentYear) {
  // Coleta chaves únicas de meses com dados reais (não-fixos)
  const monthKeys = new Set(
    allItems
      .filter((item) => !item.isFixed)
      .map((item) => `${item.year}-${String(item.month).padStart(2, '0')}`)
  );

  let total = 0;

  monthKeys.forEach((key) => {
    const [y, m] = key.split('-').map(Number);
    const isPrior =
      y < currentYear || (y === currentYear && m < currentMonth);

    if (isPrior) {
      total += getMonthBalance(allItems, m, y);
    }
  });

  return total;
}

/**
 * Retorna dados completos calculados para o mês ativo.
 * Fonte única da verdade para todos os componentes.
 */
export function computeMonthData(allItems, month, year) {
  const monthItems = getMonthItems(allItems, month, year);

  const fixedExpenses = monthItems.filter((i) => i.type === 'expense' && i.isFixed);
  const varExpenses   = monthItems.filter((i) => i.type === 'expense' && !i.isFixed);
  const fixedIncome   = monthItems.filter((i) => i.type === 'income'  && i.isFixed);
  const varIncome     = monthItems.filter((i) => i.type === 'income'  && !i.isFixed);

  const totalExpenses = sumItems([...fixedExpenses, ...varExpenses]);
  const totalIncome   = sumItems([...fixedIncome,   ...varIncome]);
  const sobrou        = totalIncome - totalExpenses;
  const guardado      = getCumulativeGuardado(allItems, month, year);
  const totalDisp     = sobrou + guardado;
  const healthPct     = totalIncome > 0
    ? Math.min((totalExpenses / totalIncome) * 100, 100)
    : 0;

  return {
    fixedExpenses,
    varExpenses,
    fixedIncome,
    varIncome,
    totalExpenses,
    totalIncome,
    sobrou,
    guardado,
    totalDisp,
    healthPct,
  };
}
