import { supabase } from './supabase'

// =============================================
// ALERTS SERVICE
// =============================================

export async function getAlerts(userId, filters = {}) {
  let query = supabase
    .from('alerts')
    .select('*, clients(name, phone, email, status)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  if (filters.priority) {
    query = query.eq('priority', filters.priority)
  }

  if (filters.type) {
    query = query.eq('type', filters.type)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getUnreadAlerts(userId) {
  const { data, error } = await supabase
    .from('alerts')
    .select('*, clients(name, phone, email)')
    .eq('user_id', userId)
    .eq('status', 'unread')
    .order('priority', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getAlertCount(userId) {
  const { count, error } = await supabase
    .from('alerts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'unread')

  if (error) throw error
  return count || 0
}

export async function markAlertAsRead(alertId) {
  const { data, error } = await supabase
    .from('alerts')
    .update({ status: 'read' })
    .eq('id', alertId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function dismissAlert(alertId) {
  const { data, error } = await supabase
    .from('alerts')
    .update({ status: 'dismissed' })
    .eq('id', alertId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markAlertAsActed(alertId) {
  const { data, error } = await supabase
    .from('alerts')
    .update({ status: 'acted' })
    .eq('id', alertId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function markAllAlertsAsRead(userId) {
  const { error } = await supabase
    .from('alerts')
    .update({ status: 'read' })
    .eq('user_id', userId)
    .eq('status', 'unread')

  if (error) throw error
}

// =============================================
// AUTO-GENERATE ALERTS
// =============================================

export async function generateAlerts(userId) {
  // Get clients that need attention
  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .not('status', 'eq', 'perdido')

  if (error || !clients) return []

  const newAlerts = []

  for (const client of clients) {
    const daysInactive = client.days_inactive || 0

    // Client inactive for 5+ days
    if (daysInactive >= 5) {
      const existingAlert = await supabase
        .from('alerts')
        .select('id')
        .eq('client_id', client.id)
        .eq('type', 'client_inactive')
        .eq('status', 'unread')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .maybeSingle()

      if (!existingAlert.data) {
        const priority = daysInactive > 30 ? 'critical' : daysInactive > 14 ? 'high' : 'medium'
        const suggestion = daysInactive > 30
          ? `${client.name} está inativo há muito tempo. Envie uma oferta especial de retorno com desconto exclusivo.`
          : daysInactive > 14
          ? `${client.name} não responde há ${daysInactive} dias. Envie uma mensagem de reengajamento.`
          : `${client.name} sumiu há ${daysInactive} dias. Faça um check-in amigável.`

        newAlerts.push({
          user_id: userId,
          client_id: client.id,
          type: 'client_inactive',
          priority,
          title: `Cliente inativo: ${client.name}`,
          description: `${client.name} está sem interação há ${daysInactive} dias.`,
          suggestion,
          status: 'unread'
        })
      }
    }

    // Client showed interest but didn't respond
    if (client.status === 'interessado' && daysInactive >= 3) {
      const existingAlert = await supabase
        .from('alerts')
        .select('id')
        .eq('client_id', client.id)
        .eq('type', 'no_response')
        .eq('status', 'unread')
        .gte('created_at', new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString())
        .maybeSingle()

      if (!existingAlert.data) {
        newAlerts.push({
          user_id: userId,
          client_id: client.id,
          type: 'no_response',
          priority: 'high',
          title: `Sem resposta: ${client.name}`,
          description: `${client.name} demonstrou interesse mas não respondeu nos últimos ${daysInactive} dias.`,
          suggestion: `Envie uma mensagem com urgência limitada ou uma oferta especial para ${client.name}.`,
          status: 'unread'
        })
      }
    }

    // High-value client at risk
    if (client.total_revenue > 1000 && daysInactive >= 7) {
      const existingAlert = await supabase
        .from('alerts')
        .select('id')
        .eq('client_id', client.id)
        .eq('type', 'opportunity')
        .eq('status', 'unread')
        .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
        .maybeSingle()

      if (!existingAlert.data) {
        newAlerts.push({
          user_id: userId,
          client_id: client.id,
          type: 'opportunity',
          priority: 'critical',
          title: `Cliente de alto valor em risco: ${client.name}`,
          description: `${client.name} já gastou R$ ${client.total_revenue.toFixed(2)} e está inativo há ${daysInactive} dias.`,
          suggestion: `Priorize o contato com ${client.name}. Ofereça um benefício exclusivo para manter o relacionamento.`,
          status: 'unread'
        })
      }
    }
  }

  if (newAlerts.length > 0) {
    const { data, error: insertError } = await supabase
      .from('alerts')
      .insert(newAlerts)
      .select()

    if (!insertError) return data
  }

  return []
}

// =============================================
// ALERT TEMPLATES
// =============================================

export const ALERT_ICONS = {
  client_inactive: 'Clock',
  no_response: 'MessageSquare',
  high_interest: 'TrendingUp',
  opportunity: 'Target',
  campaign_result: 'BarChart3',
  system: 'Settings'
}

export const ALERT_COLORS = {
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
  high: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  medium: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  low: { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' }
}
