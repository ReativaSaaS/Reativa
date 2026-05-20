import {
  LayoutGrid, Users, Columns, Megaphone, Wallet, Route, MessageSquare,
  Zap, Clock, Bot, BarChart3, UserPlus, Settings, LogOut
} from 'lucide-react'

const sidebarSections = [
  { label: 'Menu', items: [
    { icon: LayoutGrid, label: 'Dashboard', page: 'dashboard' },
    { icon: Users, label: 'Clientes', page: 'clientes' },
    { icon: Columns, label: 'Quadros', page: 'quadros', badge: 3 },
    { icon: Megaphone, label: 'Campanhas', page: 'campanhas' },
  ]},
  { label: 'Gestão', items: [
    { icon: Wallet, label: 'Financeiro', page: 'financeiro' },
    { icon: Route, label: 'Planejamento', page: 'planejamento' },
    { icon: MessageSquare, label: 'Mensagens', page: 'mensagens' },
  ]},
  { label: 'Automação', items: [
    { icon: Zap, label: 'Fluxos', page: 'fluxos' },
    { icon: Clock, label: 'Agendamentos', page: 'agendamentos' },
  ]},
  { label: 'Inteligência', items: [
    { icon: Bot, label: 'Assistente IA', page: 'ia' },
    { icon: BarChart3, label: 'Relatórios', page: 'relatorios' },
  ]},
  { label: 'Sistema', items: [
    { icon: UserPlus, label: 'Equipe', page: 'equipe' },
    { icon: Settings, label: 'Configurações', page: 'config' },
  ]},
]

export default function Sidebar({ page, setPage, mobileOpen, setMobileOpen, userName, clients, logout }) {
  return (
    <>
      <aside className={`dashboard-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo-section">
          <div className="sidebar-logo-icon">
            <img src="/logo-icon.png" alt="R" className="w-5 h-5" />
          </div>
          <span className="sidebar-logo-text">REATIVA</span>
        </div>

        <nav className="sidebar-nav">
          {sidebarSections.map((section, si) => (
            <div key={si} className="sidebar-section">
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = page === item.page
                const badge = item.page === 'clientes' ? clients.length : null
                return (
                  <button key={item.page} onClick={() => { setPage(item.page); setMobileOpen(false) }}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}>
                    <span className="sidebar-item-icon"><Icon size={18} /></span>
                    <span className="sidebar-item-label">{item.label}</span>
                    {badge > 0 && <span className="sidebar-item-badge">{badge}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{userName[0].toUpperCase()}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{userName}</div>
            <div className="sidebar-user-plan">Plano Pro</div>
          </div>
          <button onClick={logout} className="sidebar-logout-btn"><LogOut size={16} /></button>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </>
  )
}
