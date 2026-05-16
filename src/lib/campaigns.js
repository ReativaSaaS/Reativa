import { supabase } from './supabase'

// =============================================
// CAMPAIGNS SERVICE
// =============================================

export async function getCampaigns(userId, filters = {}) {
  let query = supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters.type) {
    query = query.eq('type', filters.type)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getCampaign(campaignId) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single()

  if (error) throw error
  return data
}

export async function createCampaign(userId, campaignData) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      user_id: userId,
      name: campaignData.name,
      description: campaignData.description || null,
      type: campaignData.type || 'reativacao',
      status: 'draft',
      target_status: campaignData.target_status || null,
      target_tags: campaignData.target_tags || null,
      target_days_inactive: campaignData.target_days_inactive || null,
      message_template: campaignData.message_template,
      scheduled_at: campaignData.scheduled_at || null,
      metadata: campaignData.metadata || {}
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCampaign(campaignId, updates) {
  const { data, error } = await supabase
    .from('campaigns')
    .update(updates)
    .eq('id', campaignId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCampaign(campaignId) {
  const { error } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', campaignId)

  if (error) throw error
}

export async function launchCampaign(campaignId) {
  const { data, error } = await supabase
    .from('campaigns')
    .update({
      status: 'active',
      started_at: new Date().toISOString()
    })
    .eq('id', campaignId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function pauseCampaign(campaignId) {
  const { data, error } = await supabase
    .from('campaigns')
    .update({ status: 'paused' })
    .eq('id', campaignId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function completeCampaign(campaignId) {
  const { data, error } = await supabase
    .from('campaigns')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', campaignId)
    .select()
    .single()

  if (error) throw error
  return data
}

// =============================================
// CAMPAIGN ANALYTICS
// =============================================

export async function getCampaignStats(userId) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('status, sent_count, delivered_count, read_count, response_count, conversion_count')
    .eq('user_id', userId)

  if (error) throw error

  const stats = {
    total: data.length,
    active: data.filter(c => c.status === 'active').length,
    completed: data.filter(c => c.status === 'completed').length,
    draft: data.filter(c => c.status === 'draft').length,
    total_sent: data.reduce((sum, c) => sum + (c.sent_count || 0), 0),
    total_delivered: data.reduce((sum, c) => sum + (c.delivered_count || 0), 0),
    total_responses: data.reduce((sum, c) => sum + (c.response_count || 0), 0),
    total_conversions: data.reduce((sum, c) => sum + (c.conversion_count || 0), 0),
    avg_response_rate: 0
  }

  if (stats.total_sent > 0) {
    stats.avg_response_rate = ((stats.total_responses / stats.total_sent) * 100).toFixed(1)
  }

  return stats
}

// =============================================
// CAMPAIGN TEMPLATES
// =============================================

export const CAMPAIGN_TYPES = {
  reativacao: { label: 'Reativação', color: 'bg-amber-500/15 text-amber-400', icon: 'RefreshCw' },
  promocao: { label: 'Promoção', color: 'bg-emerald-500/15 text-emerald-400', icon: 'Tag' },
  followup: { label: 'Follow-up', color: 'bg-blue-500/15 text-blue-400', icon: 'MessageSquare' },
  boasvindas: { label: 'Boas-vindas', color: 'bg-accent-violet/15 text-accent-light', icon: 'Heart' },
  custom: { label: 'Personalizada', color: 'bg-gray-500/15 text-gray-400', icon: 'Settings' }
}

export const CAMPAIGN_STATUS = {
  draft: { label: 'Rascunho', color: 'bg-gray-500/15 text-gray-400' },
  scheduled: { label: 'Agendada', color: 'bg-blue-500/15 text-blue-400' },
  active: { label: 'Ativa', color: 'bg-emerald-500/15 text-emerald-400' },
  paused: { label: 'Pausada', color: 'bg-amber-500/15 text-amber-400' },
  completed: { label: 'Concluída', color: 'bg-accent-violet/15 text-accent-light' },
  cancelled: { label: 'Cancelada', color: 'bg-red-500/15 text-red-400' }
}

export const MESSAGE_TEMPLATES = {
  reativacao: [
    'Olá {nome}! Sentimos sua falta. Que tal voltar com {desconto}% de desconto na sua próxima compra?',
    'Oi {nome}! Notamos que você não aparece há um tempo. Preparamos uma oferta especial só para você!',
    'Ei {nome}! Tudo bem? Temos novidades que vão te interessar. Bate um papinho com a gente?'
  ],
  promocao: [
    '🔥 {nome}, promoção exclusiva! {desconto}% OFF em todos os produtos. Válido até {data}.',
    'Oi {nome}! Seu cupom {cupom} está pronto. Use agora e ganhe {desconto}% de desconto!',
    '⚡ OFERTA RELÂMPAGO para {nome}! Só nas próximas {horas} horas: {desconto}% OFF.'
  ],
  followup: [
    'Oi {nome}! Como foi sua experiência com nosso produto/serviço? Adoraríamos seu feedback!',
    'Olá {nome}! Passando para saber se precisou de algo. Estamos aqui para ajudar!',
    'Oi {nome}! Sua última compra foi há {dias} dias. Que tal conferir nossas novidades?'
  ],
  boasvindas: [
    'Bem-vindo(a), {nome}! 🎉 Estamos muito felizes em ter você com a gente!',
    'Oi {nome}! Seja bem-vindo(a)! Para começar, que tal conhecer nossos principais produtos?',
    'Olá {nome}! Que bom ter você aqui! Se precisar de algo, é só chamar. 😊'
  ]
}
