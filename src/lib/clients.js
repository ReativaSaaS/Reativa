import { supabase } from './supabase'

// =============================================
// CLIENTS SERVICE
// =============================================

export async function getClients(userId, filters = {}) {
  let query = supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('last_interaction', { ascending: false, nullsFirst: false })

  if (filters.status && filters.status !== 'all') {
    query = query.eq('status', filters.status)
  }

  if (filters.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`)
  }

  if (filters.tag) {
    query = query.contains('tags', [filters.tag])
  }

  if (filters.priority) {
    query = query.eq('priority', filters.priority)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getClient(clientId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single()

  if (error) throw error
  return data
}

export async function createClient(userId, clientData) {
  const { data, error } = await supabase
    .from('clients')
    .insert({
      user_id: userId,
      name: clientData.name,
      email: clientData.email || null,
      phone: clientData.phone || null,
      company: clientData.company || null,
      status: clientData.status || 'novo',
      tags: clientData.tags || [],
      notes: clientData.notes || null,
      source: clientData.source || null,
      priority: clientData.priority || 'normal',
      last_interaction: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateClient(clientId, updates) {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', clientId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteClient(clientId) {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', clientId)

  if (error) throw error
}

export async function getClientsByStatus(userId) {
  const { data, error } = await supabase
    .from('clients')
    .select('status')
    .eq('user_id', userId)

  if (error) throw error

  const counts = { novo: 0, interessado: 0, ativo: 0, recorrente: 0, inativo: 0, perdido: 0 }
  data?.forEach(c => { counts[c.status] = (counts[c.status] || 0) + 1 })
  return counts
}

export async function getInactiveClients(userId, days = 5) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .lt('last_interaction', cutoff.toISOString())
    .not('status', 'eq', 'perdido')
    .order('days_inactive', { ascending: false })

  if (error) throw error
  return data || []
}

export async function bulkUpdateStatus(clientIds, status) {
  const { data, error } = await supabase
    .from('clients')
    .update({ status })
    .in('id', clientIds)
    .select()

  if (error) throw error
  return data
}

export async function bulkAddTag(clientIds, tag) {
  const clients = await supabase
    .from('clients')
    .select('id, tags')
    .in('id', clientIds)

  if (clients.error) throw clients.error

  const updates = clients.data.map(c => ({
    id: c.id,
    tags: [...new Set([...(c.tags || []), tag])]
  }))

  const results = []
  for (const u of updates) {
    const { data, error } = await supabase
      .from('clients')
      .update({ tags: u.tags })
      .eq('id', u.id)
      .select()
      .single()
    if (!error) results.push(data)
  }

  return results
}

export async function importClients(userId, clientsData) {
  const clients = clientsData.map(c => ({
    user_id: userId,
    name: c.name,
    email: c.email || null,
    phone: c.phone || null,
    company: c.company || null,
    status: c.status || 'novo',
    tags: c.tags || [],
    source: 'import',
    last_interaction: new Date().toISOString()
  }))

  const { data, error } = await supabase
    .from('clients')
    .insert(clients)
    .select()

  if (error) throw error
  return data
}

// =============================================
// MESSAGES SERVICE
// =============================================

export async function getClientMessages(clientId) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function sendMessage(userId, clientId, content, channel = 'whatsapp') {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      user_id: userId,
      client_id: clientId,
      content,
      direction: 'outbound',
      channel,
      status: 'sent',
      sent_at: new Date().toISOString()
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getRecentMessages(userId, limit = 20) {
  const { data, error } = await supabase
    .from('messages')
    .select('*, clients(name, phone)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}
