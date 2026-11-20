import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Plus } from 'lucide-react';

import { useAuth }    from './hooks/useAuth';
import { useFinance } from './hooks/useFinance';
import { computeMonthData } from './utils/calculations';

import AuthScreen from './components/AuthScreen';
import Header     from './components/Header';
import Dashboard  from './components/Dashboard';
import ItemList   from './components/ItemList';
import AddModal   from './components/AddModal';

export default function App() {
  const { user, loading, error, login, register, logout, setError } = useAuth();
  const { allItems, syncing, addItem, updateItem, deleteItem } = useFinance(user);

  const [month, setMonth]       = useState(new Date().getMonth());
  const [year, setYear]         = useState(new Date().getFullYear());
  const [tab, setTab]           = useState('despesas');
  const [showModal, setShowModal] = useState(false);

  // Month navigation
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  // Swipe between months
  const swipe = useSwipeable({
    onSwipedLeft:  nextMonth,
    onSwipedRight: prevMonth,
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  const handleAdd = async (fields) => {
    await addItem({
      ...fields,
      type:  tab === 'despesas' ? 'expense' : 'income',
      month,
      year,
    });
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="splash">
        <div className="splash-dot" />
      </div>
    );
  }

  if (!user) {
    return (
      <AuthScreen
        onLogin={login}
        onRegister={register}
        error={error}
        setError={setError}
      />
    );
  }

  // Cálculos centralizados — fonte única da verdade
  const data = computeMonthData(allItems, month, year);

  return (
    <div className="app" {...swipe}>
      <Header
        month={month}
        year={year}
        onPrev={prevMonth}
        onNext={nextMonth}
        onLogout={handleLogout}
        syncing={syncing}
      />

      <main className="main-content">
        <Dashboard data={data} month={month} year={year} />

        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${tab === 'despesas' ? 'active expense' : ''}`}
            onClick={() => setTab('despesas')}
          >
            Despesas
            {data.totalExpenses > 0 && (
              <span className="tab-count">{[...data.fixedExpenses, ...data.varExpenses].length}</span>
            )}
          </button>
          <button
            className={`tab ${tab === 'receitas' ? 'active income' : ''}`}
            onClick={() => setTab('receitas')}
          >
            Receitas
            {data.totalIncome > 0 && (
              <span className="tab-count">{[...data.fixedIncome, ...data.varIncome].length}</span>
            )}
          </button>
        </div>

        <ItemList
          data={data}
          tab={tab}
          onUpdate={updateItem}
          onDelete={deleteItem}
        />
      </main>

      {/* FAB */}
      <button
        className={`fab ${tab === 'despesas' ? 'fab-expense' : 'fab-income'}`}
        onClick={() => setShowModal(true)}
        aria-label="Adicionar"
      >
        <Plus size={24} />
      </button>

      <AddModal
        show={showModal}
        tab={tab}
        onClose={() => setShowModal(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
