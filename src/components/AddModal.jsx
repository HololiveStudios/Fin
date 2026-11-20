import { useState, useEffect, useRef } from 'react';
import { X, Save } from 'lucide-react';

const DEFAULT = { desc: '', valor: '', total: '', isFixed: false };

export default function AddModal({ show, tab, onClose, onAdd }) {
  const [form, setForm]     = useState(DEFAULT);
  const [error, setError]   = useState('');
  const [saving, setSaving] = useState(false);
  const descRef             = useRef(null);

  useEffect(() => {
    if (show) {
      setForm(DEFAULT);
      setError('');
      // Focus input after animation
      setTimeout(() => descRef.current?.focus(), 100);
    }
  }, [show]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (!form.desc.trim()) { setError('Informe a descrição.'); return; }
    if (!form.valor || isNaN(parseFloat(form.valor))) { setError('Informe o valor.'); return; }
    if (parseFloat(form.valor) <= 0) { setError('O valor deve ser maior que zero.'); return; }

    setSaving(true);
    await onAdd({
      desc:    form.desc.trim(),
      valor:   parseFloat(form.valor),
      total:   form.total.trim(),
      isFixed: form.isFixed,
    });
    setSaving(false);
    onClose();
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleAdd();
    if (e.key === 'Escape') onClose();
  };

  if (!show) return null;

  const isExpense = tab === 'despesas';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} onKeyDown={handleKey}>
        {/* Handle */}
        <div className="modal-handle" />

        <div className="modal-header">
          <h2 className="modal-title">
            {isExpense ? '+ Despesa' : '+ Receita'}
          </h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div className="field">
            <label>Descrição</label>
            <input
              ref={descRef}
              type="text"
              value={form.desc}
              onChange={(e) => { set('desc', e.target.value); setError(''); }}
              placeholder="Ex: Mercado, Salário..."
            />
          </div>

          <div className="field-row">
            <div className="field">
              <label>Valor (R$)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                value={form.valor}
                onChange={(e) => { set('valor', e.target.value); setError(''); }}
                placeholder="0,00"
              />
            </div>
            <div className="field">
              <label>Info / Parcelas</label>
              <input
                type="text"
                value={form.total}
                onChange={(e) => set('total', e.target.value)}
                placeholder="Ex: 3/10"
              />
            </div>
          </div>

          <label className="toggle-check">
            <div className={`toggle ${form.isFixed ? 'on' : ''}`} onClick={() => set('isFixed', !form.isFixed)}>
              <div className="toggle-thumb" />
            </div>
            <span>{isExpense ? 'Despesa fixa (todo mês)' : 'Receita fixa (todo mês)'}</span>
          </label>

          {error && <p className="field-error">{error}</p>}

          <button
            className={`btn-primary ${isExpense ? 'expense-btn' : 'income-btn'}`}
            onClick={handleAdd}
            disabled={saving}
          >
            <Save size={16} />
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  );
}
