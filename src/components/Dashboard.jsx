import { TrendingUp, TrendingDown, PiggyBank, Layers } from 'lucide-react';
import { formatCurrency, MONTHS } from '../utils/format';

export default function Dashboard({ data, month, year }) {
  const {
    totalIncome, totalExpenses, sobrou,
    guardado, totalDisp, healthPct,
  } = data;

  const healthColor =
    healthPct > 90 ? 'danger' :
    healthPct > 70 ? 'warning' : 'ok';

  return (
    <div className="dashboard">

      {/* Primary Card — Sobrou */}
      <div className={`balance-card primary ${sobrou < 0 ? 'negative' : ''}`}>
        <div className="balance-label">Sobrou este mês</div>
        <div className="balance-amount">{formatCurrency(sobrou)}</div>
        <div className="balance-sub">
          {MONTHS[month]} {year} · Receitas − Despesas
        </div>
      </div>

      {/* Grid — Receitas / Despesas */}
      <div className="stat-grid">
        <div className="stat-card income">
          <div className="stat-icon"><TrendingUp size={16} /></div>
          <div className="stat-label">Receitas</div>
          <div className="stat-value">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="stat-card expense">
          <div className="stat-icon"><TrendingDown size={16} /></div>
          <div className="stat-label">Despesas</div>
          <div className="stat-value">{formatCurrency(totalExpenses)}</div>
        </div>
      </div>

      {/* Guardado + Total */}
      <div className="stat-grid">
        <div className="stat-card saved">
          <div className="stat-icon"><PiggyBank size={16} /></div>
          <div className="stat-label">Guardado</div>
          <div className="stat-value neutral">{formatCurrency(guardado)}</div>
          <div className="stat-hint">meses anteriores</div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon"><Layers size={16} /></div>
          <div className="stat-label">Total Disponível</div>
          <div className={`stat-value ${totalDisp < 0 ? 'neg' : 'pos'}`}>
            {formatCurrency(totalDisp)}
          </div>
          <div className="stat-hint">sobrou + guardado</div>
        </div>
      </div>

      {/* Health bar */}
      <div className="health-bar-wrap">
        <div className="health-bar-header">
          <span>Saúde Financeira</span>
          <span className={`health-pct ${healthColor}`}>{healthPct.toFixed(0)}% utilizado</span>
        </div>
        <div className="health-track">
          <div
            className={`health-fill ${healthColor}`}
            style={{ width: `${healthPct}%` }}
          />
        </div>
        <div className="health-desc">
          {healthColor === 'ok'    && 'Ótimo! Suas despesas estão sob controle.'}
          {healthColor === 'warning' && 'Atenção: despesas elevadas.'}
          {healthColor === 'danger'  && 'Alerta: você está gastando mais do que ganha.'}
        </div>
      </div>
    </div>
  );
}
