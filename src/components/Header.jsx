import { ChevronLeft, ChevronRight, LogOut, Wifi, WifiOff } from 'lucide-react';
import { MONTHS } from '../utils/format';

export default function Header({ month, year, onPrev, onNext, onLogout, syncing }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        {/* Month nav */}
        <div className="month-nav">
          <button className="nav-arrow" onClick={onPrev} aria-label="Mês anterior">
            <ChevronLeft size={20} />
          </button>

          <div className="month-label">
            <span className="month-name">{MONTHS[month]}</span>
            <span className="month-year">{year}</span>
          </div>

          <button className="nav-arrow" onClick={onNext} aria-label="Próximo mês">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Right side */}
        <div className="header-right">
          <div className={`sync-dot ${syncing ? 'syncing' : 'synced'}`} title={syncing ? 'Sincronizando...' : 'Sincronizado'} />
          <button className="icon-btn" onClick={onLogout} aria-label="Sair">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
