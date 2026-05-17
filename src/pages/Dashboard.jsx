import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutGrid, Users, MessageSquare, BarChart3, Clock, Zap, Settings, CreditCard,
  Search, Bell, LogOut, Download, Plus, ChevronDown, Send, TrendingUp, TrendingDown,
  CheckCircle, AlertCircle, X, Moon, Sun, Menu, Home, Bot, Megaphone, Key, Eye, EyeOff,
  ArrowRight, Sparkles, Target, UserPlus, FileText, RefreshCw, Phone, Mail, MapPin,
  Tag, Heart, MoreVertical, Edit, Trash2, ExternalLink, Check, Filter,
  Columns, Wallet, Route, Receipt, Calendar, GripVertical, Circle
} from 'lucide-react'
import { checkSession, logout, supabase } from '../lib/supabase'
import { chatWithAI, OPENROUTER_MODELS } from '../lib/ai'
import { showToast } from '../components/Toast'
import Onboarding from '../components/Onboarding'
import CsvImport from '../components/CsvImport'
import { DashboardSkeleton, ClientsSkeleton } from '../components/Skeleton'
import { useRealtimeClients, useRealtimeAlerts, useRealtimeMessages } from '../hooks/useRealtime'

import { useMetrics, useClients, useAlerts, useCampaigns, useInsights } from '../hooks/useData'
import { useTasks, useGoals, useKanban, useFinancial, useTeam } from '../hooks/useDashboardData'
import { createClient, updateClient, deleteClient, bulkUpdateStatus, sendMessage, getClientMessages } from '../lib/clients'
import { markAlertAsRead, dismissAlert, markAllAlertsAsRead } from '../lib/alerts'
import { createCampaign, launchCampaign, pauseCampaign, CAMPAIGN_TYPES, CAMPAIGN_STATUS } from '../lib/campaigns'
import { getClientSuggestion, getQuickSuggestions } from '../lib/ai-suggestions'

const STATUS_MAP = {
  novo: { label: 'Novo', class: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/20' },
  interessado: { label: 'Interessado', class: 'bg-violet-500/15 text-violet-400 border-violet-500/20' },
  ativo: { label: 'Ativo', class: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' },
  recorrente: { label: 'Recorrente', class: 'bg-blue-500/15 text-blue-400 border-blue-500/20' },
  inativo: { label: 'Inativo', class: 'bg-amber-500/15 text-amber-400 border-amber-500/20' },
  perdido: { label: 'Perdido', class: 'bg-red-500/15 text-red-400 border-red-500/20' },
}

const PRIORITY_MAP = {
  baixa: { label: 'Baixa', class: 'bg-gray-500/15 text-gray-400' },
  normal: { label: 'Normal', class: 'bg-blue-500/15 text-blue-400' },
  alta: { label: 'Alta', class: 'bg-amber-500/15 text-amber-400' },
  urgente: { label: 'Urgente', class: 'bg-red-500/15 text-red-400' },
}

const ALERT_COLORS = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', icon: '🔴' },
  high: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', icon: '🟠' },
  medium: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: '🔵' },
  low: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20', icon: '⚪' },
}

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

export default function Dashboard() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const userId = user?.id
  const [page, setPage] = useState('dashboard')
  const [sidebarHover, setSidebarHover] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(!localStorage.getItem('reativa_onboarding_done'))
  const [showCsvImport, setShowCsvImport] = useState(false)

  // AI state
  const [chatMessages, setChatMessages] = useState([
    { role: 'ai', text: 'Olá! Sou sua assistente de reativação. Posso ajudar a criar campanhas, analisar clientes inativos e sugerir estratégias. O que precisa hoje?' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [apiKey, setApiKey] = useState(localStorage.getItem('reativa_api_key') || '')
  const [aiModel, setAiModel] = useState(localStorage.getItem('reativa_ai_model') || 'openai/gpt-3.5-turbo')
  const [showApiKey, setShowApiKey] = useState(false)
  const chatEndRef = useRef(null)

  // Client form
  const [showClientForm, setShowClientForm] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [clientForm, setClientForm] = useState({ name: '', email: '', phone: '', company: '', status: 'novo', tags: [], notes: '', priority: 'normal' })
  const [clientSearch, setClientSearch] = useState('')
  const [clientFilter, setClientFilter] = useState('all')
  const [selectedClients, setSelectedClients] = useState([])

  // Campaign form
  const [showCampaignForm, setShowCampaignForm] = useState(false)
  const [campaignForm, setCampaignForm] = useState({ name: '', type: 'reativacao', target_status: [], message_template: '', description: '' })

  // Kanban state
  const { columns: kanbanColumns, cards: kanbanCards, loading: kanbanLoading, addColumn: addKanbanColumn, addCard: addKanbanCard, updateCard: updateKanbanCard, removeCard: removeKanbanCard, getColumnCards } = useKanban(userId)
  const [showKanbanForm, setShowKanbanForm] = useState(false)
  const [kanbanForm, setKanbanForm] = useState({ title: '', description: '', tag: '', tagColor: '', columnId: '' })

  // Financial data
  const { entries: financialEntries, months: financialMonths, summary: financialSummary, loading: financialLoading, addEntry: addFinancialEntry, removeEntry: removeFinancialEntry } = useFinancial(userId)
  const [showFinancialForm, setShowFinancialForm] = useState(false)
  const [financialForm, setFinancialForm] = useState({ description: '', category: '', categoryColor: 'bg-emerald-500/15 text-emerald-400', amount: '', type: 'revenue' })

  // Planning tabs
  const [planningTab, setPlanningTab] = useState('canvas')

  // Team members
  const { members: teamMembers, loading: teamLoading, add: addTeamMember, update: updateTeamMember, remove: removeTeamMember } = useTeam(userId)
  const [showTeamForm, setShowTeamForm] = useState(false)
  const [teamForm, setTeamForm] = useState({ name: '', role: '', email: '', tag: '', tagColor: 'bg-emerald-500/15 text-emerald-400' })

  // Tasks
  const { tasks, loading: tasksLoading, add: addTask, toggle: toggleTaskDb, remove: removeTask } = useTasks(userId)

  // Goals
  const { goals, loading: goalsLoading, add: addGoal, update: updateGoalDb, remove: removeGoal } = useGoals(userId)

  // Client detail
  const [selectedClient, setSelectedClient] = useState(null)
  const [clientMessages, setClientMessages] = useState([])
  const [clientSuggestions, setClientSuggestions] = useState([])

  // Auth
  useEffect(() => {
    checkSession().then(session => {
      if (!session) { navigate('/login'); return }
      setUser(session.user)
    })
  }, [navigate])

  // Data hooks
  const { metrics, refresh: refreshMetrics } = useMetrics(userId)
  const { clients, refresh: refreshClients } = useClients(userId, { status: clientFilter !== 'all' ? clientFilter : undefined, search: clientSearch || undefined })
  const { alerts, count: alertCount, refresh: refreshAlerts } = useAlerts(userId)
  const { campaigns, stats: campaignStats, refresh: refreshCampaigns } = useCampaigns(userId)
  const { insights, refresh: refreshInsights } = useInsights(userId)

  // Realtime subscriptions
  useRealtimeClients(userId, useCallback(() => { refreshClients(); refreshMetrics() }, [refreshClients, refreshMetrics]))
  useRealtimeAlerts(userId, useCallback(() => refreshAlerts(), [refreshAlerts]))
  useRealtimeMessages(userId, useCallback(() => refreshMetrics(), [refreshMetrics]))

  const refreshAll = useCallback(() => {
    refreshMetrics()
    refreshClients()
    refreshAlerts()
    refreshCampaigns()
    refreshInsights()
  }, [refreshMetrics, refreshClients, refreshAlerts, refreshCampaigns, refreshInsights])

  useEffect(() => { if (userId) refreshAll() }, [userId, refreshAll])

  // Auto-refresh every 30s
  useEffect(() => {
    if (!userId) return
    const interval = setInterval(refreshAll, 30000)
    return () => clearInterval(interval)
  }, [userId, refreshAll])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatMessages])

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário'

  // =============================================
  // CLIENT ACTIONS
  // =============================================
  const handleCreateClient = async () => {
    if (!clientForm.name.trim()) return showToast('Nome é obrigatório', 'error')
    try {
      await createClient(userId, clientForm)
      showToast('Cliente criado com sucesso!', 'success')
      setShowClientForm(false)
      setClientForm({ name: '', email: '', phone: '', company: '', status: 'novo', tags: [], notes: '', priority: 'normal' })
      refreshClients()
      refreshMetrics()
    } catch (e) { showToast('Erro ao criar cliente', 'error') }
  }

  const handleUpdateClient = async () => {
    if (!editingClient) return
    try {
      await updateClient(editingClient.id, clientForm)
      showToast('Cliente atualizado!', 'success')
      setEditingClient(null)
      setShowClientForm(false)
      refreshClients()
    } catch (e) { showToast('Erro ao atualizar cliente', 'error') }
  }

  const handleDeleteClient = async (clientId) => {
    if (!confirm('Tem certeza que deseja remover este cliente?')) return
    try {
      await deleteClient(clientId)
      showToast('Cliente removido', 'success')
      refreshClients()
      refreshMetrics()
      if (selectedClient?.id === clientId) setSelectedClient(null)
    } catch (e) { showToast('Erro ao remover cliente', 'error') }
  }

  const handleBulkAction = async (action) => {
    if (selectedClients.length === 0) return showToast('Selecione clientes primeiro', 'error')
    try {
      if (action === 'delete') {
        if (!confirm(`Remover ${selectedClients.length} clientes?`)) return
        for (const id of selectedClients) await deleteClient(id)
        showToast(`${selectedClients.length} clientes removidos`, 'success')
      } else {
        await bulkUpdateStatus(selectedClients, action)
        showToast(`Status atualizado para ${STATUS_MAP[action]?.label}`, 'success')
      }
      setSelectedClients([])
      refreshClients()
      refreshMetrics()
    } catch (e) { showToast('Erro na ação em lote', 'error') }
  }

  const openEditClient = (client) => {
    setEditingClient(client)
    setClientForm({
      name: client.name, email: client.email || '', phone: client.phone || '',
      company: client.company || '', status: client.status, tags: client.tags || [],
      notes: client.notes || '', priority: client.priority || 'normal'
    })
    setShowClientForm(true)
  }

  const openClientDetail = async (client) => {
    setSelectedClient(client)
    try {
      const msgs = await getClientMessages(client.id)
      setClientMessages(msgs)
      if (apiKey) {
        const suggestions = getQuickSuggestions(client)
        setClientSuggestions(suggestions)
      }
    } catch (e) { console.error(e) }
  }

  // =============================================
  // CAMPAIGN ACTIONS
  // =============================================
  const handleCreateCampaign = async () => {
    if (!campaignForm.name.trim() || !campaignForm.message_template.trim()) return showToast('Preencha nome e template', 'error')
    try {
      await createCampaign(userId, campaignForm)
      showToast('Campanha criada!', 'success')
      setShowCampaignForm(false)
      setCampaignForm({ name: '', type: 'reativacao', target_status: [], message_template: '', description: '' })
      refreshCampaigns()
    } catch (e) { showToast('Erro ao criar campanha', 'error') }
  }

  const handleLaunchCampaign = async (campaignId) => {
    try {
      await launchCampaign(campaignId)
      showToast('Campanha iniciada!', 'success')
      refreshCampaigns()
    } catch (e) { showToast('Erro ao iniciar campanha', 'error') }
  }

  // =============================================
  // ALERT ACTIONS
  // =============================================
  const handleDismissAlert = async (alertId) => {
    try {
      await dismissAlert(alertId)
      refreshAlerts()
    } catch (e) { console.error(e) }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllAlertsAsRead(userId)
      refreshAlerts()
      showToast('Todas as notificações marcadas como lidas', 'success')
    } catch (e) { console.error(e) }
  }

  // =============================================
  // AI CHAT
  // =============================================
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return
    const userMsg = { role: 'user', text: chatInput }
    const newMessages = [...chatMessages, userMsg]
    setChatMessages(newMessages)
    setChatInput('')
    setChatLoading(true)

    // Build real context from data
    const contextLines = []
    if (metrics?.kpis) {
      const k = metrics.kpis
      contextLines.push(`DADOS ATUAIS: ${k.totalClients} clientes total, ${k.activeClients} ativos, ${k.inactiveClients} inativos, ${k.lostClients} perdidos, ${k.atRiskClients} em risco, ${k.messagesToday} mensagens hoje, ${k.activeCampaigns} campanhas ativas.`)
    }
    if (clients.length > 0) {
      const recent = clients.slice(0, 5).map(c => `${c.name} (${c.status}, ${c.days_inactive || 0}d inativo)`).join(', ')
      contextLines.push(`CLIENTES RECENTES: ${recent}`)
    }
    if (alerts.length > 0) {
      const recentAlerts = alerts.slice(0, 3).map(a => a.title).join('; ')
      contextLines.push(`ALERTAS: ${recentAlerts}`)
    }

    const contextMessage = contextLines.length > 0
      ? { role: 'user', text: `[CONTEXTO DO NEGÓCIO]\n${contextLines.join('\n')}\n\n[PERGUNTA DO USUÁRIO]\n${chatInput}` }
      : userMsg

    const messagesToSend = contextLines.length > 0
      ? [...chatMessages, contextMessage]
      : newMessages

    try {
      const reply = await chatWithAI(messagesToSend, apiKey, aiModel)
      setChatMessages(prev => [...prev, { role: 'ai', text: reply }])
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: `⚠️ ${error.message}` }])
    } finally { setChatLoading(false) }
  }

  const saveApiKey = () => {
    localStorage.setItem('reativa_api_key', apiKey)
    showToast('API Key salva!', 'success')
  }

  const saveModel = (model) => {
    setAiModel(model)
    localStorage.setItem('reativa_ai_model', model)
    showToast('Modelo atualizado!', 'success')
  }

  if (!user) return null

  const kpis = metrics?.kpis || {}

  return (
    <div className="flex min-h-screen bg-deep">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-screen bg-surface/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 transition-all duration-300 ${mobileOpen ? 'w-56 translate-x-0' : 'w-16 hover:w-56 -translate-x-full lg:translate-x-0'}`}
        onMouseEnter={() => !mobileOpen && setSidebarHover(true)} onMouseLeave={() => !mobileOpen && setSidebarHover(false)}>
        <div className="px-3 pt-5 mb-6 flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 bg-gradient-to-br from-accent-violet to-accent-cyan rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent-violet/30">
            <img src="/logo-icon.png" alt="R" className="w-5 h-5" />
          </div>
          <span className={`font-display text-lg font-bold whitespace-nowrap transition-opacity duration-200 ${sidebarHover || mobileOpen ? 'opacity-100' : 'opacity-0'}`}>REATIVA</span>
        </div>
        <nav className="flex-1 px-2 overflow-y-auto overflow-x-hidden">
          {sidebarSections.map((section, si) => (
            <div key={si} className="mb-5">
              <div className={`px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-600 whitespace-nowrap transition-opacity duration-200 ${sidebarHover || mobileOpen ? 'opacity-100' : 'opacity-0'}`}>{section.label}</div>
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = page === item.page
                const badge = item.page === 'clientes' ? clients.length : item.page === 'mensagens' ? alertCount : null
                return (
                  <button key={item.page} onClick={() => { setPage(item.page); setMobileOpen(false) }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${isActive ? 'bg-accent-violet/15 text-accent-light' : 'text-gray-500 hover:bg-white/5 hover:text-gray-300'}`}>
                    <Icon size={18} className="flex-shrink-0" />
                    <span className={`flex-1 text-left transition-opacity duration-200 ${sidebarHover || mobileOpen ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                    {badge > 0 && <span className={`bg-accent-violet text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-opacity duration-200 ${sidebarHover || mobileOpen ? 'opacity-100' : 'opacity-0'}`}>{badge}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="px-2 pb-4 border-t border-white/5 pt-3">
          <div className="flex items-center gap-3 px-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{userName[0].toUpperCase()}</div>
            <div className={`flex-1 min-w-0 transition-opacity duration-200 ${sidebarHover || mobileOpen ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-sm font-semibold truncate">{userName}</div>
              <div className="text-[11px] text-accent-light">Plano Pro</div>
            </div>
            <button onClick={logout} className={`text-gray-600 hover:text-red-400 transition-all p-1 ${sidebarHover || mobileOpen ? 'opacity-100' : 'opacity-0'}`}><LogOut size={16} /></button>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <main className="flex-1 lg:ml-16 min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-deep/80 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button className="lg:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)}><Menu size={22} /></button>
          <div className="flex-1">
            <h1 className="text-lg font-display font-semibold">
              {page === 'dashboard' && `Bom dia, ${userName} ☀️`}
              {page === 'clientes' && 'Clientes'}
              {page === 'campanhas' && 'Campanhas'}
              {page === 'ia' && 'Assistente IA ✦'}
              {page === 'config' && 'Configurações'}
              {page === 'quadros' && 'Quadros'}
              {page === 'financeiro' && 'Financeiro'}
              {page === 'planejamento' && 'Planejamento'}
              {page === 'equipe' && 'Equipe'}
              {!['dashboard','clientes','campanhas','ia','config','quadros','financeiro','planejamento','equipe'].includes(page) && page.charAt(0).toUpperCase() + page.slice(1)}
            </h1>
            {page === 'dashboard' && <p className="text-xs text-gray-500 mt-0.5">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} — {kpis.unreadAlerts || 0} alertas pendentes</p>}
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg w-60">
            <Search size={15} className="text-gray-500" />
            <input type="text" placeholder="Buscar..." className="bg-transparent text-sm w-full outline-none placeholder-gray-600" />
          </div>
          <button onClick={() => setNotifOpen(!notifOpen)} className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 transition-colors">
            <Bell size={17} className="text-gray-400" />
            {alertCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-deep"></span>}
          </button>
        </header>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* ═══════════════ DASHBOARD ═══════════════ */}
            {page === 'dashboard' && !metrics && (
              <DashboardSkeleton />
            )}
            {page === 'dashboard' && metrics && (
              <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {/* Insights */}
                {insights.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {insights.slice(0, 2).map((insight, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className={`relative border rounded-xl p-5 overflow-hidden ${insight.type === 'critical' ? 'bg-red-500/5 border-red-500/10' : insight.type === 'warning' ? 'bg-amber-500/5 border-amber-500/10' : insight.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-accent-violet/5 border-accent-violet/10'}`}>
                        <div className="absolute top-4 right-4 text-3xl opacity-10">✦</div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-accent-light mb-2">
                          <span className="w-1.5 h-1.5 bg-accent-violet rounded-full animate-pulse"></span> Insight da IA
                        </div>
                        <div className="text-sm font-semibold mb-1.5">{insight.title}</div>
                        <div className="text-xs text-gray-400 leading-relaxed">{insight.description}</div>
                        <button onClick={() => setPage(insight.actionPage)} className="mt-3 text-xs px-3 py-1.5 bg-white/5 border border-white/10 rounded-full hover:border-accent-violet/30 hover:bg-accent-violet/10 transition-all">{insight.action}</button>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total de Clientes', value: kpis.totalClients || 0, change: `+${kpis.newThisWeek || 0} esta semana`, up: true, icon: Users, color: 'violet' },
                    { label: 'Clientes Ativos', value: kpis.activeClients || 0, change: `${kpis.recoveryRate || 0}% recuperação`, up: true, icon: RefreshCw, color: 'emerald' },
                    { label: 'Clientes Inativos', value: kpis.inactiveClients || 0, change: `${kpis.atRiskClients || 0} em risco`, up: false, icon: Clock, color: 'amber' },
                    { label: 'Mensagens Hoje', value: kpis.messagesToday || 0, change: `${kpis.totalSent || 0} total`, up: true, icon: MessageSquare, color: 'cyan' },
                  ].map((m, i) => {
                    const Icon = m.icon
                    const colorMap = { violet: 'bg-accent-violet/10 text-accent-violet', emerald: 'bg-emerald-500/10 text-emerald-400', amber: 'bg-amber-500/10 text-amber-400', cyan: 'bg-cyan-500/10 text-cyan-400' }
                    const barMap = { violet: 'bg-accent-violet', emerald: 'bg-emerald-500', amber: 'bg-amber-500', cyan: 'bg-cyan-500' }
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="relative bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-white/10 hover:-translate-y-0.5 transition-all overflow-hidden group">
                        <div className={`absolute top-0 left-0 right-0 h-0.5 ${barMap[m.color]} opacity-60`}></div>
                        <Icon size={32} className="absolute bottom-3 right-3 text-white/[0.03] group-hover:text-white/[0.06] transition-colors" />
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-2">{m.label}</div>
                        <div className="font-display text-2xl font-bold mb-1">{m.value}</div>
                        <div className={`text-xs font-semibold ${m.up ? 'text-emerald-400' : 'text-amber-400'}`}>{m.change}</div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                  {[
                    { icon: UserPlus, label: 'Adicionar Cliente', sub: 'Novo contato', color: 'bg-accent-violet/10 text-accent-violet', action: () => { setEditingClient(null); setClientForm({ name: '', email: '', phone: '', company: '', status: 'novo', tags: [], notes: '', priority: 'normal' }); setShowClientForm(true) } },
                    { icon: Megaphone, label: 'Nova Campanha', sub: 'Reativação', color: 'bg-emerald-500/10 text-emerald-400', action: () => setPage('campanhas') },
                    { icon: Bot, label: 'Pedir à IA', sub: 'Sugestões', color: 'bg-cyan-500/10 text-cyan-400', action: () => setPage('ia') },
                    { icon: BarChart3, label: 'Ver Relatórios', sub: 'Análises', color: 'bg-amber-500/10 text-amber-400', action: () => setPage('relatorios') },
                  ].map((a, i) => {
                    const Icon = a.icon
                    return (
                      <motion.button key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} onClick={a.action} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 text-left hover:border-white/10 hover:-translate-y-0.5 transition-all group">
                        <div className={`w-9 h-9 rounded-lg ${a.color} flex items-center justify-center mb-3`}><Icon size={18} /></div>
                        <div className="text-sm font-semibold mb-0.5">{a.label}</div>
                        <div className="text-xs text-gray-500">{a.sub}</div>
                      </motion.button>
                    )
                  })}
                </div>

                {/* Status Distribution + Alerts */}
                <div className="grid lg:grid-cols-2 gap-4 mb-6">
                  {/* Status */}
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                    <h3 className="text-sm font-semibold mb-4">Status dos Clientes</h3>
                    <div className="flex items-center gap-8">
                      <div className="w-32 h-32 rounded-full relative flex-shrink-0" style={{ background: `conic-gradient(#10b981 0deg ${((kpis.activeClients || 0) / (kpis.totalClients || 1)) * 360}deg, #f59e0b ${((kpis.activeClients || 0) / (kpis.totalClients || 1)) * 360}deg ${((kpis.activeClients || 0) + (kpis.inactiveClients || 0)) / (kpis.totalClients || 1) * 360}deg, #ef4444 ${((kpis.activeClients || 0) + (kpis.inactiveClients || 0)) / (kpis.totalClients || 1) * 360}deg ${((kpis.activeClients || 0) + (kpis.inactiveClients || 0) + (kpis.lostClients || 0)) / (kpis.totalClients || 1) * 360}deg, #8b5cf6 ${((kpis.activeClients || 0) + (kpis.inactiveClients || 0) + (kpis.lostClients || 0)) / (kpis.totalClients || 1) * 360}deg 360deg)` }}>
                        <div className="absolute inset-5 bg-surface rounded-full flex items-center justify-center"><span className="font-display text-lg font-bold">{kpis.totalClients || 0}</span></div>
                      </div>
                      <div className="space-y-2.5 flex-1">
                        {(metrics?.statusDistribution || []).filter(s => s.count > 0).map((s, i) => (
                          <div key={i} className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full bg-${s.color}-500`}></span>
                            <span className="text-xs text-gray-400 flex-1">{s.label}</span>
                            <span className="text-xs font-semibold">{s.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Alerts */}
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold">Alertas Recentes</h3>
                      {alerts.length > 0 && <button onClick={handleMarkAllRead} className="text-xs text-accent-light hover:underline">Marcar todos como lidos</button>}
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {alerts.length === 0 ? (
                        <div className="text-center py-8 text-gray-600 text-xs">Nenhum alerta pendente</div>
                      ) : alerts.slice(0, 5).map((alert, i) => {
                        const colors = ALERT_COLORS[alert.priority] || ALERT_COLORS.medium
                        return (
                          <motion.div key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className={`flex items-start gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg} cursor-pointer hover:opacity-80 transition-opacity`}
                            onClick={() => { markAlertAsRead(alert.id); refreshAlerts() }}>
                            <span className="text-sm flex-shrink-0">{colors.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className={`text-xs font-semibold ${colors.text}`}>{alert.title}</div>
                              <div className="text-[11px] text-gray-500 mt-0.5 truncate">{alert.suggestion}</div>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleDismissAlert(alert.id) }} className="text-gray-600 hover:text-white p-0.5"><X size={12} /></button>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                  <h3 className="text-sm font-semibold mb-4">Novos Clientes por Mês</h3>
                  <div className="h-48 flex items-end gap-2 px-2">
                    {(metrics?.monthlyData || []).map((d, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max((d.clients / Math.max(...(metrics?.monthlyData || []).map(m => m.clients), 1)) * 100, 5)}%` }} transition={{ duration: 0.6, delay: i * 0.1 }} className="w-full bg-gradient-to-t from-accent-violet to-accent-cyan rounded-t-md opacity-60 hover:opacity-100 transition-opacity"></motion.div>
                        <span className="text-[10px] text-gray-500">{d.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════ CLIENTES ═══════════════ */}
            {page === 'clientes' && (
              <motion.div key="clientes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {/* Toolbar */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <div className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg flex-1 max-w-xs">
                    <Search size={15} className="text-gray-500" />
                    <input value={clientSearch} onChange={e => setClientSearch(e.target.value)} type="text" placeholder="Buscar clientes..." className="bg-transparent text-sm w-full outline-none placeholder-gray-600" />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { key: 'all', label: 'Todos' },
                      { key: 'novo', label: 'Novos' },
                      { key: 'interessado', label: 'Interessados' },
                      { key: 'ativo', label: 'Ativos' },
                      { key: 'inativo', label: 'Inativos' },
                      { key: 'perdido', label: 'Perdidos' },
                    ].map(f => (
                      <button key={f.key} onClick={() => setClientFilter(f.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${clientFilter === f.key ? 'bg-accent-violet/15 text-accent-light border border-accent-violet/30' : 'bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white hover:border-white/10'}`}>{f.label}</button>
                    ))}
                  </div>
                  <div className="flex gap-2 ml-auto">
                    {selectedClients.length > 0 && (
                      <div className="flex gap-1.5">
                        <button onClick={() => handleBulkAction('ativo')} className="text-xs px-3 py-2 bg-emerald-500/15 text-emerald-400 rounded-lg hover:bg-emerald-500/25 transition-all">Ativar ({selectedClients.length})</button>
                        <button onClick={() => handleBulkAction('inativo')} className="text-xs px-3 py-2 bg-amber-500/15 text-amber-400 rounded-lg hover:bg-amber-500/25 transition-all">Inativar</button>
                        <button onClick={() => handleBulkAction('delete')} className="text-xs px-3 py-2 bg-red-500/15 text-red-400 rounded-lg hover:bg-red-500/25 transition-all">Remover</button>
                      </div>
                    )}
                    <button onClick={() => setShowCsvImport(true)} className="btn-secondary text-xs py-2 px-3"><Download size={14} /> Importar CSV</button>
                    <button onClick={() => { setEditingClient(null); setClientForm({ name: '', email: '', phone: '', company: '', status: 'novo', tags: [], notes: '', priority: 'normal' }); setShowClientForm(true) }} className="btn-primary text-xs py-2 px-3"><Plus size={14} /> Adicionar</button>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left px-4 py-3 w-10"><input type="checkbox" onChange={e => setSelectedClients(e.target.checked ? clients.map(c => c.id) : [])} className="accent-accent-violet" /></th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Cliente</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">Contato</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Última Interação</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">Dias Inativo</th>
                          <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clients.map((c, i) => (
                          <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 py-3"><input type="checkbox" checked={selectedClients.includes(c.id)} onChange={e => setSelectedClients(e.target.checked ? [...selectedClients, c.id] : selectedClients.filter(id => id !== c.id))} className="accent-accent-violet" /></td>
                            <td className="px-4 py-3">
                              <button onClick={() => openClientDetail(c)} className="flex items-center gap-3 text-left hover:opacity-80 transition-opacity">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                                <div>
                                  <div className="text-sm font-medium">{c.name}</div>
                                  {c.company && <div className="text-xs text-gray-500">{c.company}</div>}
                                </div>
                              </button>
                            </td>
                            <td className="px-4 py-3"><span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_MAP[c.status]?.class}`}>{STATUS_MAP[c.status]?.label}</span></td>
                            <td className="px-4 py-3 hidden md:table-cell">
                              <div className="text-xs text-gray-400">{c.phone || c.email || '-'}</div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">{c.last_interaction ? new Date(c.last_interaction).toLocaleDateString('pt-BR') : '-'}</td>
                            <td className="px-4 py-3 hidden lg:table-cell">
                              <span className={`text-xs font-semibold ${(c.days_inactive || 0) > 30 ? 'text-red-400' : (c.days_inactive || 0) > 14 ? 'text-amber-400' : 'text-gray-400'}`}>{c.days_inactive || 0}d</span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-1.5">
                                <button onClick={() => openClientDetail(c)} className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-white transition-all"><Eye size={14} /></button>
                                <button onClick={() => openEditClient(c)} className="p-1.5 rounded-md hover:bg-white/5 text-gray-500 hover:text-white transition-all"><Edit size={14} /></button>
                                <button onClick={() => handleDeleteClient(c.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-gray-500 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                        {clients.length === 0 && (
                          <tr><td colSpan="7" className="text-center py-12 text-gray-600 text-sm">Nenhum cliente encontrado</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════ CAMPANHAS ═══════════════ */}
            {page === 'campanhas' && (
              <motion.div key="campanhas" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    {['all', 'active', 'draft', 'completed'].map(f => (
                      <button key={f} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${f === 'all' ? 'bg-accent-violet/15 text-accent-light border border-accent-violet/30' : 'bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white'}`}>
                        {f === 'all' ? 'Todas' : CAMPAIGN_STATUS[f]?.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowCampaignForm(true)} className="btn-primary text-xs py-2 px-3"><Plus size={14} /> Nova Campanha</button>
                </div>

                {/* Campaign Stats */}
                {campaignStats && (
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Total Enviadas', value: campaignStats.total_sent },
                      { label: 'Respostas', value: campaignStats.total_responses },
                      { label: 'Taxa de Resposta', value: `${campaignStats.avg_response_rate}%` },
                      { label: 'Campanhas Ativas', value: campaignStats.active },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4">
                        <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">{s.label}</div>
                        <div className="font-display text-xl font-bold">{s.value}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid gap-3">
                  {campaigns.map((c, i) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <h3 className="text-sm font-semibold">{c.name}</h3>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CAMPAIGN_STATUS[c.status]?.color}`}>{CAMPAIGN_STATUS[c.status]?.label}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CAMPAIGN_TYPES[c.type]?.color}`}>{CAMPAIGN_TYPES[c.type]?.label}</span>
                        </div>
                        <div className="flex gap-2">
                          {c.status === 'draft' && <button onClick={() => handleLaunchCampaign(c.id)} className="text-xs px-3 py-1.5 bg-emerald-500/15 text-emerald-400 rounded-lg hover:bg-emerald-500/25 transition-all">Iniciar</button>}
                          {c.status === 'active' && <button onClick={() => pauseCampaign(c.id).then(refreshCampaigns)} className="text-xs px-3 py-1.5 bg-amber-500/15 text-amber-400 rounded-lg hover:bg-amber-500/25 transition-all">Pausar</button>}
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div><div className="text-[10px] text-gray-500 uppercase mb-0.5">Enviadas</div><div className="font-display text-lg font-bold">{c.sent_count || 0}</div></div>
                        <div><div className="text-[10px] text-gray-500 uppercase mb-0.5">Entregues</div><div className="font-display text-lg font-bold">{c.delivered_count || 0}</div></div>
                        <div><div className="text-[10px] text-gray-500 uppercase mb-0.5">Respostas</div><div className="font-display text-lg font-bold">{c.response_count || 0}</div></div>
                        <div><div className="text-[10px] text-gray-500 uppercase mb-0.5">Conversões</div><div className="font-display text-lg font-bold text-emerald-400">{c.conversion_count || 0}</div></div>
                      </div>
                    </motion.div>
                  ))}
                  {campaigns.length === 0 && <div className="text-center py-12 text-gray-600 text-sm">Nenhuma campanha criada</div>}
                </div>
              </motion.div>
            )}

            {/* ═══════════════ ASSISTENTE IA ═══════════════ */}
            {page === 'ia' && (
              <motion.div key="ia" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="max-w-3xl">
                  <div className="space-y-4 mb-6 max-h-[60vh] overflow-y-auto pr-2">
                    {chatMessages.map((msg, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${msg.role === 'ai' ? 'bg-accent-violet/15 text-accent-light' : 'bg-gradient-to-br from-accent-violet to-accent-cyan text-white'}`}>{msg.role === 'ai' ? '✦' : userName[0].toUpperCase()}</div>
                        <div className={`max-w-[75%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'ai' ? 'bg-white/[0.05] border border-white/5' : 'bg-accent-violet text-white'}`}>{msg.text}</div>
                      </motion.div>
                    ))}
                    {chatLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-accent-violet/15 text-accent-light flex items-center justify-center flex-shrink-0 text-xs font-bold">✦</div>
                        <div className="bg-white/[0.05] border border-white/5 px-4 py-3 rounded-xl"><div className="flex gap-1.5"><span className="w-2 h-2 bg-accent-violet/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span><span className="w-2 h-2 bg-accent-violet/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span><span className="w-2 h-2 bg-accent-violet/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span></div></div>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Criar campanha de reativação', 'Analisar clientes inativos', 'Sugestões de automação', 'Reduzir churn rate'].map((chip, i) => (
                      <button key={i} onClick={() => setChatInput(chip)} className="text-xs px-3 py-1.5 bg-white/[0.03] border border-white/5 rounded-full hover:border-accent-violet/30 hover:bg-accent-violet/10 transition-all">{chip}</button>
                    ))}
                  </div>
                  <div className="flex gap-3 bg-white/[0.03] border border-white/5 rounded-xl p-3 focus-within:border-accent-violet/30 transition-colors">
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()} placeholder={apiKey ? 'Pergunte sobre seus clientes...' : 'Configure sua API Key em Configurações...'} className="flex-1 bg-transparent text-sm outline-none placeholder-gray-600" disabled={!apiKey} />
                    <button onClick={sendChat} disabled={!apiKey || chatLoading} className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${apiKey && !chatLoading ? 'bg-gradient-to-br from-accent-violet to-accent-cyan hover:opacity-90' : 'bg-white/5 text-gray-600 cursor-not-allowed'}`}><Send size={16} /></button>
                  </div>
                  {!apiKey && <p className="text-xs text-amber-400/80 mt-2 flex items-center gap-1.5"><AlertCircle size={12} /> Configure sua API Key do OpenRouter em Configurações.</p>}
                </div>
              </motion.div>
            )}

            {/* ═══════════════ CONFIGURAÇÕES ═══════════════ */}
            {page === 'config' && (
              <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="max-w-2xl space-y-6">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-accent-violet/10 flex items-center justify-center text-accent-violet"><Key size={20} /></div>
                      <div><h3 className="text-sm font-semibold">API Key OpenRouter</h3><p className="text-xs text-gray-500">Chave para o assistente IA</p></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 relative">
                        <input type={showApiKey ? 'text' : 'password'} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="sk-or-..." className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors font-mono" />
                        <button onClick={() => setShowApiKey(!showApiKey)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">{showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                      </div>
                      <button onClick={saveApiKey} className="btn-primary px-5">Salvar</button>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-2">Obtenha em <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className="text-accent-violet hover:underline">openrouter.ai/keys</a></p>
                  </div>

                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-accent-cyan/10 flex items-center justify-center text-accent-cyan"><Bot size={20} /></div>
                      <div><h3 className="text-sm font-semibold">Modelo de IA</h3><p className="text-xs text-gray-500">Modelo para o assistente</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {OPENROUTER_MODELS.map(model => (
                        <button key={model.id} onClick={() => saveModel(model.id)} className={`text-left px-3 py-2.5 rounded-lg border text-xs transition-all ${aiModel === model.id ? 'bg-accent-violet/15 border-accent-violet/30 text-accent-light' : 'bg-black/30 border-white/10 text-gray-400 hover:border-white/20 hover:text-white'}`}>
                          <div className="font-semibold">{model.name}</div>
                          <div className="text-[10px] opacity-60">{model.provider}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400"><CreditCard size={20} /></div>
                      <div><h3 className="text-sm font-semibold">Stripe</h3><p className="text-xs text-gray-500">Pagamentos</p></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span><span className="text-emerald-400 font-medium">Conectado</span><span className="text-gray-500">— 3 produtos</span></div>
                  </div>

                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
                      <div><h3 className="text-sm font-semibold">Supabase</h3><p className="text-xs text-gray-500">Banco de dados</p></div>
                    </div>
                    <div className="flex items-center gap-2 text-xs"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span><span className="text-emerald-400 font-medium">Conectado</span><span className="text-gray-500">— 7 tabelas</span></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ═══════════════ QUADROS (KANBAN) ═══════════════ */}
            {page === 'quadros' && (
              <motion.div key="quadros" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium bg-accent-violet/15 text-accent-light border border-accent-violet/30">Quadro Principal</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setKanbanForm({ title: '', description: '', tag: '', tagColor: '', columnId: '' }); setShowKanbanForm(true) }} className="btn-secondary text-xs py-2 px-3"><Plus size={14} /> Coluna</button>
                    <button onClick={() => { setKanbanForm({ title: '', description: '', tag: '', tagColor: '', columnId: kanbanColumns[0]?.id || '' }); setShowKanbanForm(true) }} className="btn-primary text-xs py-2 px-3"><Plus size={14} /> Card</button>
                  </div>
                </div>

                {kanbanLoading ? (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {[1,2,3].map(i => <div key={i} className="min-w-[280px] h-64 bg-white/[0.02] rounded-xl animate-pulse" />)}
                  </div>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {kanbanColumns.map((col) => {
                      const colCards = getColumnCards(col.id)
                      return (
                        <div key={col.id} className="min-w-[280px] max-w-[280px] bg-white/[0.02] rounded-xl p-3">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ background: col.color }}></div>
                              <span className="text-xs font-semibold text-gray-400">{col.title}</span>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.07] text-gray-400">{colCards.length}</span>
                          </div>

                          {colCards.map((card) => (
                            <div key={card.id} className={`bg-white/[0.03] border border-white/5 rounded-lg p-3.5 mb-2.5 cursor-grab hover:border-white/10 hover:-translate-y-0.5 transition-all ${card.done ? 'opacity-60' : ''}`}>
                              {card.tag && <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${card.tag_color || 'bg-purple-500/15 text-purple-400'} mb-2 inline-block`}>{card.tag}</span>}
                              <div className="text-xs font-semibold mb-1.5">{card.title}</div>
                              {card.description && <div className="text-[11px] text-gray-500 mb-2.5">{card.description}</div>}
                              <div className="flex items-center justify-between text-[11px] text-gray-500">
                                <div className="flex">
                                  {(card.avatars || []).map((av, j) => (
                                    <div key={j} className="w-5 h-5 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-[8px] font-bold text-white -ml-1.5 first:ml-0">{av}</div>
                                  ))}
                                </div>
                                <span className={card.urgent ? 'text-red-400' : ''}>{card.date_text}</span>
                              </div>
                            </div>
                          ))}

                          <button onClick={() => { setKanbanForm({ title: '', description: '', tag: '', tagColor: '', columnId: col.id }); setShowKanbanForm(true) }} className="w-full py-2 border border-dashed border-white/10 rounded-lg text-xs text-gray-500 hover:border-accent-violet/30 hover:text-accent-light transition-all">
                            + Adicionar card
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════════ FINANCEIRO ═══════════════ */}
            {page === 'financeiro' && (
              <motion.div key="financeiro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {/* KPIs */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Receita Total', value: `R$ ${financialSummary.revenue.toLocaleString('pt-BR')}`, icon: TrendingUp, color: 'emerald' },
                    { label: 'Despesas', value: `R$ ${financialSummary.expense.toLocaleString('pt-BR')}`, icon: Receipt, color: 'red' },
                    { label: 'Lucro Líquido', value: `R$ ${financialSummary.profit.toLocaleString('pt-BR')}`, icon: Wallet, color: financialSummary.profit >= 0 ? 'emerald' : 'red' },
                  ].map((m, i) => {
                    const Icon = m.icon
                    return (
                      <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{m.label}</div>
                          <div className={`w-8 h-8 rounded-lg ${m.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}><Icon size={16} /></div>
                        </div>
                        <div className="font-mono text-2xl font-bold mb-1">{m.value}</div>
                      </div>
                    )
                  })}
                </div>

                <div className="grid lg:grid-cols-3 gap-4 mb-6">
                  {/* Chart */}
                  <div className="lg:col-span-2 bg-white/[0.03] border border-white/5 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold">Fluxo de Caixa</h3>
                      <button onClick={() => setShowFinancialForm(true)} className="btn-primary text-xs py-2 px-3"><Plus size={14} /> Lançar</button>
                    </div>
                    {financialLoading ? (
                      <div className="h-48 bg-white/[0.02] rounded animate-pulse" />
                    ) : financialMonths.length > 0 ? (
                      <>
                        <div className="h-48 flex items-end gap-3 px-2">
                          {financialMonths.slice(-6).map((d, i) => {
                            const max = Math.max(...financialMonths.map(m => Math.max(m.revenue, m.expense)), 1)
                            return (
                              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <div className="w-full flex gap-1 items-end" style={{ height: '160px' }}>
                                  <motion.div initial={{ height: 0 }} animate={{ height: `${(d.revenue / max) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 }} className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t opacity-70 hover:opacity-100 transition-opacity"></motion.div>
                                  <motion.div initial={{ height: 0 }} animate={{ height: `${(d.expense / max) * 100}%` }} transition={{ duration: 0.8, delay: i * 0.1 + 0.05 }} className="flex-1 bg-red-500/50 rounded-t opacity-70 hover:opacity-100 transition-opacity"></motion.div>
                                </div>
                                <span className="text-[10px] text-gray-500">{d.month}</span>
                              </div>
                            )
                          })}
                        </div>
                        <div className="flex gap-4 mt-3 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>Receita</span>
                          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500/50"></span>Despesa</span>
                        </div>
                      </>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-gray-500 text-sm">Nenhum dado financeiro ainda</div>
                    )}
                  </div>

                  {/* Summary */}
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                    <h3 className="text-sm font-semibold mb-4">Resumo</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'Receita', value: financialSummary.revenue, color: 'bg-emerald-500' },
                        { name: 'Despesas', value: financialSummary.expense, color: 'bg-red-400' },
                        { name: 'Lucro', value: financialSummary.profit, color: financialSummary.profit >= 0 ? 'bg-emerald-500' : 'bg-red-500' },
                      ].map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-gray-400">{item.name}</span>
                            <span className="font-mono font-semibold">R$ {item.value.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${item.color}`} style={{ width: financialSummary.revenue > 0 ? `${Math.abs(item.value) / financialSummary.revenue * 100}%` : '0%' }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Table */}
                <div className="bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b border-white/5">
                    <h3 className="text-sm font-semibold">Lançamentos Recentes</h3>
                  </div>
                  {financialLoading ? (
                    <div className="p-8 text-center text-gray-500 text-sm">Carregando...</div>
                  ) : financialEntries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">Nenhum lançamento ainda</div>
                  ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/5">
                          <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Descrição</th>
                          <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Categoria</th>
                          <th className="text-left px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Data</th>
                          <th className="text-right px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {financialEntries.slice(0, 10).map((entry) => (
                          <tr key={entry.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                            <td className="px-5 py-3.5 text-sm">{entry.description}</td>
                            <td className="px-5 py-3.5"><span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${entry.category_color || 'bg-emerald-500/15 text-emerald-400'}`}>{entry.category}</span></td>
                            <td className="px-5 py-3.5 text-xs text-gray-500">{new Date(entry.entry_date).toLocaleDateString('pt-BR')}</td>
                            <td className={`px-5 py-3.5 text-right text-sm font-mono font-semibold ${entry.type === 'revenue' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {entry.type === 'revenue' ? '+' : '−'} R$ {parseFloat(entry.amount).toLocaleString('pt-BR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </motion.div>
            )}

            {/* ═══════════════ PLANEJAMENTO ═══════════════ */}
            {page === 'planejamento' && (
              <motion.div key="planejamento" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    {[
                      { key: 'canvas', label: 'Canvas' },
                      { key: 'swot', label: 'SWOT' },
                      { key: 'plano', label: 'Plano de Negócio' },
                    ].map(tab => (
                      <button key={tab.key} onClick={() => setPlanningTab(tab.key)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${planningTab === tab.key ? 'bg-accent-violet/15 text-accent-light border border-accent-violet/30' : 'bg-white/[0.03] border border-white/5 text-gray-500 hover:text-white'}`}>{tab.label}</button>
                    ))}
                  </div>
                </div>

                {/* Canvas */}
                {planningTab === 'canvas' && (
                  <div>
                    <div className="grid grid-cols-5 gap-3 mb-3">
                      {[
                        { title: 'Parceiros-chave', items: ['AWS / Google Cloud', 'Parceiros de distribuição', 'Contadores e consultores'] },
                        { title: 'Atividades-chave', items: ['Desenvolvimento do produto', 'Suporte ao cliente'], span: true },
                        { title: 'Proposta de Valor', items: ['Gestão simples para MEIs', 'IA integrada no dia a dia', 'Tudo em um só lugar'], highlight: true },
                        { title: 'Relacionamento', items: ['Comunidade online', 'Suporte por chat'], span: true },
                        { title: 'Segmentos', items: ['MEIs e autônomos', 'Pequenas empresas', 'Startups em early stage'] },
                      ].map((block, i) => (
                        <div key={i} className={`${block.span ? 'flex flex-col gap-3' : ''} ${block.highlight ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/[0.03] border-white/5'} border rounded-lg p-3.5 ${block.span ? '' : 'min-h-[130px]'}`}>
                          <div className={`text-[10px] font-bold uppercase tracking-wider mb-2.5 ${block.highlight ? 'text-emerald-400' : 'text-gray-500'}`}>{block.title}</div>
                          {block.span ? (
                            <>
                              <div className="bg-white/[0.03] border border-white/5 rounded-md p-3 flex-1">
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2">{block.title}</div>
                                {block.items.map((item, j) => <div key={j} className="text-xs text-gray-400 bg-white/[0.04] rounded px-2 py-1 mb-1">{item}</div>)}
                              </div>
                            </>
                          ) : (
                            block.items.map((item, j) => <div key={j} className={`text-xs rounded px-2 py-1 mb-1 ${block.highlight ? 'bg-emerald-500/10 text-emerald-300' : 'bg-white/[0.04] text-gray-400'}`}>{item}</div>)
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2.5">Estrutura de Custos</div>
                        {['Infraestrutura de TI — 18%', 'Equipe e desenvolvimento — 42%', 'Marketing e aquisição — 30%', 'Operacional — 10%'].map((item, j) => <div key={j} className="text-xs text-gray-400 bg-white/[0.04] rounded px-2 py-1 mb-1">{item}</div>)}
                      </div>
                      <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3.5">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2.5">Fontes de Receita</div>
                        {['Assinatura mensal (SaaS)', 'Plano Pro — R$ 49/mês', 'Plano Equipe — R$ 99/mês', 'Consultoria Premium'].map((item, j) => <div key={j} className="text-xs text-gray-400 bg-white/[0.04] rounded px-2 py-1 mb-1">{item}</div>)}
                      </div>
                    </div>
                  </div>
                )}

                {/* SWOT */}
                {planningTab === 'swot' && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { title: 'Forças', color: 'bg-emerald-500/8 border-emerald-500/15', titleColor: 'text-emerald-400', items: ['Interface intuitiva e acessível', 'IA integrada que guia o usuário', 'Tudo em uma só plataforma', 'Baixo custo de aquisição'] },
                      { title: 'Fraquezas', color: 'bg-red-500/8 border-red-500/15', titleColor: 'text-red-400', items: ['Produto ainda em fase inicial', 'Equipe pequena', 'Dependência de APIs externas', 'Reconhecimento de marca limitado'] },
                      { title: 'Oportunidades', color: 'bg-blue-500/8 border-blue-500/15', titleColor: 'text-blue-400', items: ['Mercado de MEI crescendo 20% ao ano', 'Baixa digitalização das pequenas empresas', 'Demanda por IA acessível aumentando', 'Expansão para América Latina'] },
                      { title: 'Ameaças', color: 'bg-amber-500/8 border-amber-500/15', titleColor: 'text-amber-400', items: ['Grandes players como Notion e Monday', 'Concorrência acirrada no segmento SaaS', 'Custo de APIs de IA em alta', 'Regulamentações de dados'] },
                    ].map((block, i) => (
                      <div key={i} className={`${block.color} border rounded-lg p-4`}>
                        <div className={`text-[10px] font-bold uppercase tracking-wider mb-3 ${block.titleColor}`}>{block.title}</div>
                        {block.items.map((item, j) => <div key={j} className="text-xs text-gray-400 py-0.5">· {item}</div>)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Plano */}
                {planningTab === 'plano' && (
                  <div className="grid lg:grid-cols-2 gap-4">
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                      <h3 className="text-sm font-semibold mb-3">Sumário Executivo</h3>
                      <p className="text-xs text-gray-400 leading-relaxed mb-4">A <strong className="text-white">REATIVA</strong> é uma plataforma SaaS de reativação de clientes desenvolvida para pequenos e médios empreendedores. Nosso produto combina automação de WhatsApp, chatbot IA e campanhas promocionais em uma interface acessível.</p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'TAM', value: 'R$ 4,2B' },
                          { label: 'SAM', value: 'R$ 840M' },
                          { label: 'SOM', value: 'R$ 42M', highlight: true },
                        ].map((m, i) => (
                          <div key={i} className={`${m.highlight ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/[0.04] border-white/5'} border rounded-lg p-3 text-center`}>
                            <div className={`text-[10px] font-bold uppercase tracking-wider ${m.highlight ? 'text-emerald-400' : 'text-gray-500'}`}>{m.label}</div>
                            <div className={`font-mono text-lg font-bold mt-1 ${m.highlight ? 'text-emerald-400' : ''}`}>{m.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-xl p-5">
                      <h3 className="text-sm font-semibold mb-3">Metas Anuais</h3>
                      <div className="space-y-4">
                        {[
                          { name: 'Usuários pagantes', target: '1.000', pct: 47, color: 'bg-emerald-500' },
                          { name: 'MRR (Receita Mensal)', target: 'R$ 49k', pct: 58, color: 'bg-blue-500' },
                          { name: 'NPS', target: '85+', pct: 91, color: 'bg-purple-500' },
                          { name: 'Churn Rate', target: '<3%', pct: 80, color: 'bg-amber-500' },
                        ].map((g, i) => (
                          <div key={i}>
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-gray-400">{g.name}</span>
                              <span className="font-mono text-gray-500">{g.target}</span>
                            </div>
                            <div className="h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${g.pct}%` }} transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }} className={`h-full rounded-full ${g.color}`}></motion.div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════════ EQUIPE ═══════════════ */}
            {page === 'equipe' && (
              <motion.div key="equipe" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold">Equipe</h2>
                    <p className="text-xs text-gray-500">Gerencie colaboradores e permissões</p>
                  </div>
                  <button onClick={() => setShowTeamForm(true)} className="btn-primary text-xs py-2 px-3"><UserPlus size={14} /> Convidar</button>
                </div>

                {teamLoading ? (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1,2,3].map(i => <div key={i} className="h-48 bg-white/[0.02] rounded-xl animate-pulse" />)}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="bg-white/[0.03] border border-white/5 rounded-xl p-5 text-center hover:border-white/10 hover:-translate-y-0.5 transition-all">
                        <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${member.gradient || 'from-accent-violet to-accent-cyan'} flex items-center justify-center text-white text-lg font-bold mx-auto mb-3`}>{member.initials || member.name[0]}</div>
                        <div className="text-sm font-semibold mb-0.5">{member.name}</div>
                        <div className="text-xs text-gray-500 mb-2">{member.role}</div>
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500 mb-3">
                          <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'online' ? 'bg-emerald-500' : member.status === 'away' ? 'bg-amber-500' : 'bg-gray-500'}`}></span>
                          {member.status === 'online' ? 'Online agora' : member.status === 'away' ? 'Ausente' : 'Offline'}
                        </div>
                        {member.tag && <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${member.tag_color || 'bg-emerald-500/15 text-emerald-400'}`}>{member.tag}</span>}
                      </div>
                    ))}
                    <div onClick={() => setShowTeamForm(true)} className="bg-white/[0.03] border border-dashed border-white/10 rounded-xl p-5 text-center cursor-pointer hover:border-accent-violet/30 transition-all">
                      <div className="w-14 h-14 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-500 mx-auto mb-3"><Plus size={24} /></div>
                      <div className="text-sm text-gray-500 font-semibold">Adicionar membro</div>
                      <div className="text-xs text-gray-600">Convidar por e-mail</div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ═══════════════ PLACEHOLDER PAGES ═══════════════ */}
            {['mensagens', 'fluxos', 'agendamentos', 'relatorios'].includes(page) && (
              <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mb-4">
                    {page === 'mensagens' && <MessageSquare size={28} className="text-gray-600" />}
                    {page === 'fluxos' && <Zap size={28} className="text-gray-600" />}
                    {page === 'agendamentos' && <Clock size={28} className="text-gray-600" />}
                    {page === 'relatorios' && <BarChart3 size={28} className="text-gray-600" />}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{page.charAt(0).toUpperCase() + page.slice(1)}</h3>
                  <p className="text-sm text-gray-500 max-w-md">Em desenvolvimento. Explore o Dashboard e Clientes enquanto isso.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* ═══════════════ NOTIFICATION PANEL ═══════════════ */}
      <div className={`fixed right-0 top-0 bottom-0 w-80 bg-surface/95 backdrop-blur-xl border-l border-white/5 z-40 transition-transform duration-300 ${notifOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-semibold">Notificações ({alertCount})</h3>
            <div className="flex gap-2">
              <button onClick={handleMarkAllRead} className="text-xs text-accent-light hover:underline">Marcar lidas</button>
              <button onClick={() => setNotifOpen(false)} className="p-1 hover:bg-white/5 rounded-lg transition-colors"><X size={18} /></button>
            </div>
          </div>
          <div className="space-y-2">
            {alerts.map((alert, i) => {
              const colors = ALERT_COLORS[alert.priority] || ALERT_COLORS.medium
              return (
                <div key={alert.id} className={`flex gap-3 p-3 rounded-lg border ${colors.border} ${colors.bg} cursor-pointer hover:opacity-80 transition-opacity`}>
                  <span className="text-sm flex-shrink-0">{colors.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-semibold ${colors.text}`}>{alert.title}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{alert.suggestion}</div>
                    <div className="text-[10px] text-gray-600 mt-1">{new Date(alert.created_at).toLocaleDateString('pt-BR')}</div>
                  </div>
                  <button onClick={() => handleDismissAlert(alert.id)} className="text-gray-600 hover:text-white p-0.5 self-start"><X size={12} /></button>
                </div>
              )
            })}
            {alerts.length === 0 && <div className="text-center py-8 text-gray-600 text-xs">Nenhuma notificação</div>}
          </div>
        </div>
      </div>

      {/* ═══════════════ CLIENT FORM MODAL ═══════════════ */}
      {showClientForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowClientForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-white/10 rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">{editingClient ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <button onClick={() => setShowClientForm(false)} className="p-1 hover:bg-white/5 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 mb-1.5 block">Nome *</label><input value={clientForm.name} onChange={e => setClientForm({ ...clientForm, name: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Nome do cliente" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 mb-1.5 block">Email</label><input value={clientForm.email} onChange={e => setClientForm({ ...clientForm, email: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="email@exemplo.com" /></div>
                <div><label className="text-xs text-gray-500 mb-1.5 block">Telefone</label><input value={clientForm.phone} onChange={e => setClientForm({ ...clientForm, phone: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="(11) 99999-9999" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 mb-1.5 block">Empresa</label><input value={clientForm.company} onChange={e => setClientForm({ ...clientForm, company: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Nome da empresa" /></div>
                <div><label className="text-xs text-gray-500 mb-1.5 block">Status</label>
                  <select value={clientForm.status} onChange={e => setClientForm({ ...clientForm, status: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors">
                    {Object.entries(STATUS_MAP).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="text-xs text-gray-500 mb-1.5 block">Prioridade</label>
                <div className="flex gap-2">
                  {Object.entries(PRIORITY_MAP).map(([key, val]) => (
                    <button key={key} onClick={() => setClientForm({ ...clientForm, priority: key })} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${clientForm.priority === key ? `${val.class} border border-current` : 'bg-white/[0.03] border border-white/5 text-gray-500'}`}>{val.label}</button>
                  ))}
                </div>
              </div>
              <div><label className="text-xs text-gray-500 mb-1.5 block">Observações</label><textarea value={clientForm.notes} onChange={e => setClientForm({ ...clientForm, notes: e.target.value })} rows="3" className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors resize-none" placeholder="Notas sobre o cliente..." /></div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowClientForm(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button onClick={editingClient ? handleUpdateClient : handleCreateClient} className="btn-primary px-6 py-2.5 text-sm">{editingClient ? 'Salvar' : 'Criar Cliente'}</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ CLIENT DETAIL PANEL ═══════════════ */}
      {selectedClient && (
        <div className="fixed right-0 top-0 bottom-0 w-96 bg-surface/95 backdrop-blur-xl border-l border-white/5 z-40 overflow-y-auto" onClick={e => e.target === e.currentTarget && setSelectedClient(null)}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold">Detalhes do Cliente</h3>
              <button onClick={() => setSelectedClient(null)} className="p-1 hover:bg-white/5 rounded-lg"><X size={18} /></button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan flex items-center justify-center text-white text-lg font-bold">{selectedClient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
              <div>
                <div className="text-lg font-semibold">{selectedClient.name}</div>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_MAP[selectedClient.status]?.class}`}>{STATUS_MAP[selectedClient.status]?.label}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {selectedClient.email && <div className="flex items-center gap-3 text-sm"><Mail size={14} className="text-gray-500" />{selectedClient.email}</div>}
              {selectedClient.phone && <div className="flex items-center gap-3 text-sm"><Phone size={14} className="text-gray-500" />{selectedClient.phone}</div>}
              {selectedClient.company && <div className="flex items-center gap-3 text-sm"><MapPin size={14} className="text-gray-500" />{selectedClient.company}</div>}
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                <div className="text-[10px] text-gray-500 mb-1">Mensagens</div>
                <div className="font-display text-lg font-bold">{selectedClient.total_messages || 0}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                <div className="text-[10px] text-gray-500 mb-1">Dias Inativo</div>
                <div className={`font-display text-lg font-bold ${(selectedClient.days_inactive || 0) > 30 ? 'text-red-400' : (selectedClient.days_inactive || 0) > 14 ? 'text-amber-400' : ''}`}>{selectedClient.days_inactive || 0}</div>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-lg p-3 text-center">
                <div className="text-[10px] text-gray-500 mb-1">Receita</div>
                <div className="font-display text-lg font-bold">R$ {(selectedClient.total_revenue || 0).toFixed(0)}</div>
              </div>
            </div>

            {/* AI Suggestions */}
            {clientSuggestions.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Sugestões da IA</h4>
                <div className="space-y-2">
                  {clientSuggestions.map((s, i) => (
                    <div key={i} className={`p-3 rounded-lg border ${ALERT_COLORS[s.type === 'critical' ? 'critical' : s.type === 'high' ? 'high' : 'medium'].border} ${ALERT_COLORS[s.type === 'critical' ? 'critical' : s.type === 'high' ? 'high' : 'medium'].bg}`}>
                      <div className="text-xs font-semibold mb-1">{s.title}</div>
                      <div className="text-[11px] text-gray-400">{s.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Histórico de Mensagens</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {clientMessages.length === 0 ? (
                  <div className="text-center py-4 text-gray-600 text-xs">Nenhuma mensagem</div>
                ) : clientMessages.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-lg text-xs ${msg.direction === 'inbound' ? 'bg-white/[0.03] border border-white/5' : 'bg-accent-violet/10 border border-accent-violet/20'}`}>
                    <div className="flex justify-between mb-1">
                      <span className="font-semibold">{msg.direction === 'inbound' ? selectedClient.name : 'Você'}</span>
                      <span className="text-gray-600">{new Date(msg.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="text-gray-400">{msg.content}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => { openEditClient(selectedClient); setSelectedClient(null) }} className="btn-secondary flex-1 text-xs py-2.5 justify-center"><Edit size={14} /> Editar</button>
              <button onClick={() => handleDeleteClient(selectedClient.id)} className="px-4 py-2.5 bg-red-500/15 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/25 transition-all"><Trash2 size={14} /></button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ CAMPAIGN FORM MODAL ═══════════════ */}
      {showCampaignForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowCampaignForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-white/10 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Nova Campanha</h2>
              <button onClick={() => setShowCampaignForm(false)} className="p-1 hover:bg-white/5 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div><label className="text-xs text-gray-500 mb-1.5 block">Nome *</label><input value={campaignForm.name} onChange={e => setCampaignForm({ ...campaignForm, name: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Nome da campanha" /></div>
              <div><label className="text-xs text-gray-500 mb-1.5 block">Tipo</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CAMPAIGN_TYPES).map(([key, val]) => (
                    <button key={key} onClick={() => setCampaignForm({ ...campaignForm, type: key })} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${campaignForm.type === key ? `${val.color} border border-current` : 'bg-white/[0.03] border border-white/5 text-gray-500'}`}>{val.label}</button>
                  ))}
                </div>
              </div>
              <div><label className="text-xs text-gray-500 mb-1.5 block">Template da Mensagem *</label><textarea value={campaignForm.message_template} onChange={e => setCampaignForm({ ...campaignForm, message_template: e.target.value })} rows="4" className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors resize-none" placeholder="Use {nome} para personalizar..." /></div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowCampaignForm(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button onClick={handleCreateCampaign} className="btn-primary px-6 py-2.5 text-sm">Criar Campanha</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ ONBOARDING ═══════════════ */}
      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}

      {/* ═══════════════ CSV IMPORT MODAL ═══════════════ */}
      {showCsvImport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowCsvImport(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-white/10 rounded-xl p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Importar Clientes</h2>
              <button onClick={() => setShowCsvImport(false)} className="p-1 hover:bg-white/5 rounded-lg"><X size={18} /></button>
            </div>
            <CsvImport userId={userId} onComplete={() => { setShowCsvImport(false); refreshClients(); refreshMetrics() }} />
          </motion.div>
        </div>
      )}

      {/* ═══════════════ KANBAN CARD MODAL ═══════════════ */}
      {showKanbanForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowKanbanForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-white/10 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Novo Card</h2>
              <button onClick={() => setShowKanbanForm(false)} className="p-1 hover:bg-white/5 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Título *</label>
                <input value={kanbanForm.title} onChange={e => setKanbanForm({ ...kanbanForm, title: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Título do card" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Descrição</label>
                <textarea value={kanbanForm.description} onChange={e => setKanbanForm({ ...kanbanForm, description: e.target.value })} rows="3" className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors resize-none" placeholder="Descrição opcional" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Tag</label>
                  <input value={kanbanForm.tag} onChange={e => setKanbanForm({ ...kanbanForm, tag: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Ex: Dev" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Coluna</label>
                  <select value={kanbanForm.columnId} onChange={e => setKanbanForm({ ...kanbanForm, columnId: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors">
                    {kanbanColumns.map(col => <option key={col.id} value={col.id}>{col.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowKanbanForm(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button onClick={async () => {
                  if (!kanbanForm.title.trim()) return showToast('Título é obrigatório', 'error')
                  try {
                    await addKanbanCard({ ...kanbanForm, tagColor: 'bg-purple-500/15 text-purple-400' })
                    showToast('Card criado!', 'success')
                    setShowKanbanForm(false)
                  } catch (e) { showToast('Erro ao criar card', 'error') }
                }} className="btn-primary px-6 py-2.5 text-sm">Criar Card</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ FINANCIAL ENTRY MODAL ═══════════════ */}
      {showFinancialForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowFinancialForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-white/10 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Novo Lançamento</h2>
              <button onClick={() => setShowFinancialForm(false)} className="p-1 hover:bg-white/5 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Descrição *</label>
                <input value={financialForm.description} onChange={e => setFinancialForm({ ...financialForm, description: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Ex: Mensalidade cliente" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Categoria</label>
                  <input value={financialForm.category} onChange={e => setFinancialForm({ ...financialForm, category: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Ex: Receita" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Valor (R$)</label>
                  <input type="number" value={financialForm.amount} onChange={e => setFinancialForm({ ...financialForm, amount: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="0.00" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Tipo</label>
                <div className="flex gap-2">
                  <button onClick={() => setFinancialForm({ ...financialForm, type: 'revenue' })} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${financialForm.type === 'revenue' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-white/[0.03] border border-white/5 text-gray-500'}`}>Receita</button>
                  <button onClick={() => setFinancialForm({ ...financialForm, type: 'expense' })} className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${financialForm.type === 'expense' ? 'bg-red-500/15 text-red-400 border border-red-500/30' : 'bg-white/[0.03] border border-white/5 text-gray-500'}`}>Despesa</button>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowFinancialForm(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button onClick={async () => {
                  if (!financialForm.description.trim() || !financialForm.amount) return showToast('Preencha descrição e valor', 'error')
                  try {
                    await addFinancialEntry({ ...financialForm, categoryColor: financialForm.type === 'revenue' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400' })
                    showToast('Lançamento criado!', 'success')
                    setShowFinancialForm(false)
                    setFinancialForm({ description: '', category: '', categoryColor: 'bg-emerald-500/15 text-emerald-400', amount: '', type: 'revenue' })
                  } catch (e) { showToast('Erro ao criar lançamento', 'error') }
                }} className="btn-primary px-6 py-2.5 text-sm">Criar Lançamento</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════ TEAM MEMBER MODAL ═══════════════ */}
      {showTeamForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && setShowTeamForm(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-surface border border-white/10 rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-semibold">Adicionar Membro</h2>
              <button onClick={() => setShowTeamForm(false)} className="p-1 hover:bg-white/5 rounded-lg"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Nome *</label>
                <input value={teamForm.name} onChange={e => setTeamForm({ ...teamForm, name: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Nome completo" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Cargo</label>
                  <input value={teamForm.role} onChange={e => setTeamForm({ ...teamForm, role: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Ex: Desenvolvedor" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
                  <input type="email" value={teamForm.email} onChange={e => setTeamForm({ ...teamForm, email: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="email@exemplo.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Tag</label>
                  <input value={teamForm.tag} onChange={e => setTeamForm({ ...teamForm, tag: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors" placeholder="Ex: Dev" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1.5 block">Cor da Tag</label>
                  <select value={teamForm.tagColor} onChange={e => setTeamForm({ ...teamForm, tagColor: e.target.value })} className="w-full px-3 py-2.5 bg-black/30 border border-white/10 rounded-lg text-sm outline-none focus:border-accent-violet transition-colors">
                    <option value="bg-emerald-500/15 text-emerald-400">Verde</option>
                    <option value="bg-blue-500/15 text-blue-400">Azul</option>
                    <option value="bg-purple-500/15 text-purple-400">Roxo</option>
                    <option value="bg-amber-500/15 text-amber-400">Amarelo</option>
                    <option value="bg-red-500/15 text-red-400">Vermelho</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => setShowTeamForm(false)} className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors">Cancelar</button>
                <button onClick={async () => {
                  if (!teamForm.name.trim()) return showToast('Nome é obrigatório', 'error')
                  try {
                    const initials = teamForm.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    await addTeamMember({ ...teamForm, initials, gradient: 'from-accent-violet to-accent-cyan', status: 'offline' })
                    showToast('Membro adicionado!', 'success')
                    setShowTeamForm(false)
                    setTeamForm({ name: '', role: '', email: '', tag: '', tagColor: 'bg-emerald-500/15 text-emerald-400' })
                  } catch (e) { showToast('Erro ao adicionar membro', 'error') }
                }} className="btn-primary px-6 py-2.5 text-sm">Adicionar</button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
