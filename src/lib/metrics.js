import { supabase } from './supabase'

// =============================================
// METRICS SERVICE
// =============================================

export async function getDashboardMetrics(userId) {
  // Get all clients
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('status, days_inactive, total_revenue, total_messages, created_at, last_interaction, response_rate')
    .eq('user_id', userId)

  if (clientsError) throw clientsError

  // Get campaigns
  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('status, sent_count, response_count, conversion_count')
    .eq('user_id', userId)

  if (campaignsError) throw campaignsError

  // Get messages today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const { count: messagesToday, error: msgError } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', today.toISOString())

  // Get unread alerts
  const { count: unreadAlerts, error: alertError } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'unread')

  // Calculate metrics
  const totalClients = clients?.length || 0
  const activeClients = clients?.filter(c => ['ativo', 'recorrente'].includes(c.status)).length || 0
  const inactiveClients = clients?.filter(c => c.status === 'inativo').length || 0
  const lostClients = clients?.filter(c => c.status === 'perdido').length || 0
  const newClients = clients?.filter(c => c.status === 'novo').length || 0
  const interestedClients = clients?.filter(c => c.status === 'interessado').length || 0
  const atRiskClients = clients?.filter(c => c.days_inactive > 30 && c.status !== 'perdido').length || 0
  const recoveredClients = clients?.filter(c => c.status === 'ativo' && c.days_inactive < 7).length || 0

  const totalRevenue = clients?.reduce((sum, c) => sum + (parseFloat(c.total_revenue) || 0), 0) || 0
  const avgResponseRate = clients?.length
    ? clients.reduce((sum, c) => sum + (parseFloat(c.response_rate) || 0), 0) / clients.length
    : 0

  // Campaign metrics
  const activeCampaigns = campaigns?.filter(c => c.status === 'active').length || 0
  const totalSent = campaigns?.reduce((sum, c) => sum + (c.sent_count || 0), 0) || 0
  const totalResponses = campaigns?.reduce((sum, c) => sum + (c.response_count || 0), 0) || 0
  const recoveryRate = totalSent > 0 ? ((totalResponses / totalSent) * 100).toFixed(1) : 0

  // New this week
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const newThisWeek = clients?.filter(c => new Date(c.created_at) > weekAgo).length || 0

  // Monthly trend (simplified)
  const monthlyData = []
  for (let i = 5; i >= 0; i--) {
    const monthStart = new Date()
    monthStart.setMonth(monthStart.getMonth() - i)
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const monthEnd = new Date(monthStart)
    monthEnd.setMonth(monthEnd.getMonth() + 1)

    const monthClients = clients?.filter(c => {
      const created = new Date(c.created_at)
      return created >= monthStart && created < monthEnd
    }).length || 0

    const monthRecovered = clients?.filter(c => {
      if (c.status !== 'ativo') return false
      const lastInteraction = new Date(c.last_interaction)
      return lastInteraction >= monthStart && lastInteraction < monthEnd
    }).length || 0

    monthlyData.push({
      month: monthStart.toLocaleDateString('pt-BR', { month: 'short' }),
      clients: monthClients,
      recovered: monthRecovered
    })
  }

  // Status distribution
  const statusDistribution = [
    { label: 'Ativos', count: activeClients, color: 'emerald' },
    { label: 'Inativos', count: inactiveClients, color: 'amber' },
    { label: 'Perdidos', count: lostClients, color: 'red' },
    { label: 'Novos', count: newClients, color: 'cyan' },
    { label: 'Interessados', count: interestedClients, color: 'violet' },
    { label: 'Recorrentes', count: clients?.filter(c => c.status === 'recorrente').length || 0, color: 'blue' }
  ]

  return {
    kpis: {
      totalClients,
      activeClients,
      inactiveClients,
      lostClients,
      newClients,
      interestedClients,
      atRiskClients,
      recoveredClients,
      totalRevenue,
      avgResponseRate: avgResponseRate.toFixed(1),
      messagesToday: messagesToday || 0,
      activeCampaigns,
      unreadAlerts: unreadAlerts || 0,
      newThisWeek,
      recoveryRate,
      totalSent,
      totalResponses
    },
    monthlyData,
    statusDistribution
  }
}

// =============================================
// ACTIVITY LOG
// =============================================

export async function getActivityLog(userId, limit = 20) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*, clients(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// =============================================
// INSIGHTS (AI-like analysis)
// =============================================

export async function generateInsights(userId) {
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)

  if (!clients || clients.length === 0) return []

  const insights = []

  // Insight 1: Clients at risk
  const atRisk = clients.filter(c => c.days_inactive > 14 && c.status !== 'perdido')
  if (atRisk.length > 0) {
    insights.push({
      type: 'warning',
      title: `${atRisk.length} clientes em risco de perda`,
      description: `Identificamos ${atRisk.length} clientes sem interação há mais de 14 dias. Uma campanha de reativação pode recuperar até 30% deles.`,
      action: 'Criar campanha de reativação',
      actionPage: 'campanhas'
    })
  }

  // Insight 2: High-value clients
  const highValue = clients.filter(c => parseFloat(c.total_revenue) > 500)
  const highValueInactive = highValue.filter(c => c.days_inactive > 7)
  if (highValueInactive.length > 0) {
    insights.push({
      type: 'critical',
      title: `${highValueInactive.length} clientes de alto valor inativos`,
      description: `Clientes que já gastaram mais de R$ 500 estão sem interação. Priorize o contato com eles.`,
      action: 'Ver clientes',
      actionPage: 'clientes'
    })
  }

  // Insight 3: Best response time
  const activeClients = clients.filter(c => c.response_rate > 50)
  if (activeClients.length > 0) {
    insights.push({
      type: 'success',
      title: `${activeClients.length} clientes com alta taxa de resposta`,
      description: `Esses clientes respondem mais de 50% das mensagens. Considere criar campanhas personalizadas para eles.`,
      action: 'Ver clientes engajados',
      actionPage: 'clientes'
    })
  }

  // Insight 4: New clients need attention
  const newClients = clients.filter(c => c.status === 'novo')
  if (newClients.length > 0) {
    insights.push({
      type: 'info',
      title: `${newClients.length} novos clientes aguardando primeiro contato`,
      description: `Novos clientes têm maior chance de conversão nas primeiras 24 horas. Envie boas-vindas!`,
      action: 'Enviar boas-vindas',
      actionPage: 'campanhas'
    })
  }

  // Insight 5: Recovery opportunity
  const recentlyRecovered = clients.filter(c => {
    if (c.status !== 'ativo') return false
    return c.days_inactive < 7 && c.total_purchases > 0
  })
  if (recentlyRecovered.length > 0) {
    insights.push({
      type: 'success',
      title: `${recentlyRecovered.length} clientes recuperados recentemente`,
      description: `Parabéns! ${recentlyRecovered.length} clientes voltaram a interagir. Mantenha o engajamento com follow-ups.`,
      action: 'Ver recuperados',
      actionPage: 'clientes'
    })
  }

  return insights
}
