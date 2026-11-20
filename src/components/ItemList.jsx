import { useState } from 'react';
import { Edit2, Trash2, Save, X, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/format';

/* ─── Item Card ─────────────────────────────────────────────── */
function ItemCard({ item, onEdit, onDelete }) {
  const isInstallment = item.total && /\d+\/\d+/.test(item.total);

  return (
    <div className={`item-card ${item.type}`}>
      <div className="item-main">
        <div className="item-desc">
          {item.desc}
          <div className="item-badges">
            {item.isFixed && <span className="badge fixed">Fixa</span>}
            {isInstallment && <span className="badge installment">{item.total}</span>}
            {item.total && !isInstallment && (
              <span className="badge info">{item.total}</span>
            )}
          </div>
        </div>
        <div className={`item-value ${item.type}`}>
          {item.type === 'expense' ? '−' : '+'}{formatCurrency(item.valor)}
        </div>
      </div>

      <div className="item-actions">
        <button className="item-btn edit" onClick={() => onEdit(item)}>
          <Edit2 size={14} />
        </button>
        <button className="item-btn del" onClick={() => onDelete(item.id)}>
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

/* ─── Edit Card (inline) ────────────────────────────────────── */
function EditCard({ item, onSave, onCancel }) {
  const [form, setForm] = useState({
    desc:    item.desc,
    valor:   item.valor,
    total:   item.total || '',
    isFixed: item.isFixed,
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.desc || !form.valor) return;
    onSave(item.id, {
      desc:    form.desc,
      valor:   parseFloat(form.valor),
      total:   form.total,
      isFixed: form.isFixed,
    });
  };

  return (
    <div className="edit-card">
      <input
        className="edit-input"
        value={form.desc}
        onChange={(e) => set('desc', e.target.value)}
        placeholder="Descrição"
      />
      <div className="edit-row">
        <input
          className="edit-input"
          type="number"
          step="0.01"
          value={form.valor}
          onChange={(e) => set('valor', e.target.value)}
          placeholder="Valor"
        />
        <input
          className="edit-input"
          value={form.total}
          onChange={(e) => set('total', e.target.value)}
          placeholder="Parcelas (ex: 3/10)"
        />
      </div>
      <label className="edit-check">
        <input
          type="checkbox"
          checked={form.isFixed}
          onChange={(e) => set('isFixed', e.target.checked)}
        />
        <span>Item fixo (todo mês)</span>
      </label>
      <div className="edit-actions">
        <button className="edit-btn save" onClick={handleSave}>
          <Save size={14} /> Salvar
        </button>
        <button className="edit-btn cancel" onClick={onCancel}>
          <X size={14} /> Cancelar
        </button>
      </div>
    </div>
  );
}

/* ─── Section Header ────────────────────────────────────────── */
function SectionHeader({ label, total, type }) {
  return (
    <div className="section-header">
      <span className="section-label">{label}</span>
      <span className={`section-total ${type}`}>{formatCurrency(total)}</span>
    </div>
  );
}

/* ─── Empty ─────────────────────────────────────────────────── */
function Empty({ text }) {
  return (
    <div className="empty-state">
      <Wallet size={36} className="empty-icon" />
      <p>{text}</p>
    </div>
  );
}

/* ─── Item List ─────────────────────────────────────────────── */
export default function ItemList({ data, tab, onUpdate, onDelete }) {
  const [editingId, setEditingId] = useState(null);

  const { fixedExpenses, varExpenses, fixedIncome, varIncome } = data;

  const handleSave = async (id, fields) => {
    await onUpdate(id, fields);
    setEditingId(null);
  };

  const renderItem = (item) =>
    editingId === item.id ? (
      <EditCard
        key={item.id}
        item={item}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
      />
    ) : (
      <ItemCard
        key={item.id}
        item={item}
        onEdit={(i) => setEditingId(i.id)}
        onDelete={onDelete}
      />
    );

  if (tab === 'despesas') {
    const all = [...fixedExpenses, ...varExpenses];
    if (!all.length) return <Empty text="Sem despesas neste mês." />;

    return (
      <div className="item-list">
        {fixedExpenses.length > 0 && (
          <>
            <SectionHeader
              label="Fixas"
              total={fixedExpenses.reduce((s, i) => s + i.valor, 0)}
              type="expense"
            />
            {fixedExpenses.map(renderItem)}
          </>
        )}
        {varExpenses.length > 0 && (
          <>
            <SectionHeader
              label="Variáveis"
              total={varExpenses.reduce((s, i) => s + i.valor, 0)}
              type="expense"
            />
            {varExpenses.map(renderItem)}
          </>
        )}
      </div>
    );
  }

  // Receitas
  const all = [...fixedIncome, ...varIncome];
  if (!all.length) return <Empty text="Sem receitas neste mês." />;

  return (
    <div className="item-list">
      {fixedIncome.length > 0 && (
        <>
          <SectionHeader
            label="Fixas"
            total={fixedIncome.reduce((s, i) => s + i.valor, 0)}
            type="income"
          />
          {fixedIncome.map(renderItem)}
        </>
      )}
      {varIncome.length > 0 && (
        <>
          <SectionHeader
            label="Variáveis"
            total={varIncome.reduce((s, i) => s + i.valor, 0)}
            type="income"
          />
          {varIncome.map(renderItem)}
        </>
      )}
    </div>
  );
}
