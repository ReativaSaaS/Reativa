import { Menu, Search, Bell } from 'lucide-react';

export default function TopBar({ page, userName, alertCount, notifOpen, setNotifOpen, mobileOpen, setMobileOpen }) {
  const pageTitles = {
    dashboard: `Bom dia, ${userName} ☀️`,
    clientes: 'Clientes',
    campanhas: 'Campanhas',
    ia: 'Assistente IA ✦',
    config: 'Configurações',
    quadros: 'Quadros',
    financeiro: 'Financeiro',
    planejamento: 'Planejamento',
    equipe: 'Equipe',
  };

  const title = pageTitles[page] || page.charAt(0).toUpperCase() + page.slice(1);

  return (
    <header className="dashboard-topbar">
      <button className="lg:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={22} /></button>
      <div className="topbar-greeting">
        <h1>{title}</h1>
        {page === 'dashboard' && <p className="text-xs text-gray-500 mt-0.5">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} — {alertCount || 0} alertas pendentes</p>}
      </div>
      <div className="topbar-search hidden md:flex">
        <Search size={16} />
        <input type="text" placeholder="Buscar..." />
      </div>
      <button onClick={() => setNotifOpen(!notifOpen)} className="topbar-icon-btn">
        <Bell size={17} />
        {alertCount > 0 && <span className="notification-dot"></span>}
      </button>
    </header>
  );
}
