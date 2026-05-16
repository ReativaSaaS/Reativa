import { supabase } from './supabase'
import { chatWithAI } from './ai'

// =============================================
// AI SUGGESTIONS SERVICE
// =============================================

export async function getClientSuggestion(clientId, apiKey, model) {
  const { data: client, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', clientId)
    .single()

  if (error || !client) return null

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
    .limit(10)

  const context = buildClientContext(client, messages || [])

  const prompt = `Analise este cliente e sugira a melhor abordagem comercial:

${context}

Responda em JSON com:
{
  "risk_level": "baixo|médio|alto|crítico",
  "suggested_action": "ação recomendada",
  "suggested_message": "mensagem personalizada para enviar",
  "suggested_offer": "oferta ou desconto sugerido (se aplicável)",
  "reasoning": "motivo da sugestão"
}`

  try {
    const response = await chatWithAI([{ role: 'user', text: prompt }], apiKey, model)
    const jsonMatch = response.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return { suggested_message: response, risk_level: 'médio', suggested_action: 'Enviar mensagem' }
  } catch (e) {
    console.error('AI suggestion error:', e)
    return null
  }
}

export async function getSmartSuggestions(userId, apiKey, model) {
  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .order('days_inactive', { ascending: false })
    .limit(20)

  if (!clients || clients.length === 0) return []

  const context = clients.map(c =>
    `- ${c.name}: status=${c.status}, dias_inativo=${c.days_inactive}, mensagens=${c.total_messages}, receita=R$${c.total_revenue}`
  ).join('\n')

  const prompt = `Analise estes clientes e gere até 5 sugestões inteligentes de ação:

${context}

Para cada sugestão, responda em JSON array:
[
  {
    "type": "reativacao|oportunidade|campanha|atencao",
    "client_name": "nome do cliente",
    "title": "título curto",
    "description": "descrição da sugestão",
    "priority": "low|medium|high|critical",
    "action": "ação sugerida"
  }
]`

  try {
    const response = await chatWithAI([{ role: 'user', text: prompt }], apiKey, model)
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return []
  } catch (e) {
    console.error('AI suggestions error:', e)
    return []
  }
}

function buildClientContext(client, messages) {
  const lines = [
    `Nome: ${client.name}`,
    `Email: ${client.email || 'N/A'}`,
    `Telefone: ${client.phone || 'N/A'}`,
    `Status: ${client.status}`,
    `Dias inativo: ${client.days_inactive || 0}`,
    `Total de mensagens: ${client.total_messages}`,
    `Receita total: R$ ${client.total_revenue || 0}`,
    `Taxa de resposta: ${client.response_rate || 0}%`,
    `Prioridade: ${client.priority}`,
    `Tags: ${(client.tags || []).join(', ') || 'Nenhuma'}`,
    `Observações: ${client.notes || 'Nenhuma'}`
  ]

  if (messages.length > 0) {
    lines.push('\nÚltimas mensagens:')
    messages.slice(0, 5).forEach(m => {
      const date = new Date(m.created_at).toLocaleDateString('pt-BR')
      lines.push(`  [${date}] ${m.direction === 'inbound' ? 'Cliente' : 'Empresa'}: ${m.content.substring(0, 100)}`)
    })
  }

  return lines.join('\n')
}

// =============================================
// TEMPLATE SUGGESTIONS (no AI needed)
// =============================================

export function getQuickSuggestions(client) {
  const suggestions = []
  const days = client.days_inactive || 0

  if (days > 30) {
    suggestions.push({
      type: 'critical',
      title: 'Oferta de retorno',
      message: `Olá ${client.name}! Sentimos sua falta. Que tal voltar com 20% de desconto?`,
      action: 'Enviar oferta'
    })
  } else if (days > 14) {
    suggestions.push({
      type: 'high',
      title: 'Reengajamento',
      message: `Oi ${client.name}! Tudo bem? Passando para saber se precisou de algo.`,
      action: 'Enviar check-in'
    })
  } else if (days > 5) {
    suggestions.push({
      type: 'medium',
      title: 'Check-in amigável',
      message: `Olá ${client.name}! Como está? Temos novidades que podem te interessar.`,
      action: 'Enviar mensagem'
    })
  }

  if (client.status === 'interessado') {
    suggestions.push({
      type: 'opportunity',
      title: 'Converter interesse',
      message: `${client.name} demonstrou interesse. Envie uma proposta personalizada.`,
      action: 'Enviar proposta'
    })
  }

  if (client.total_revenue > 500 && days > 7) {
    suggestions.push({
      type: 'high',
      title: 'Cliente VIP inativo',
      message: `${client.name} já gastou R$ ${client.total_revenue}. Priorize o contato!`,
      action: 'Contatar agora'
    })
  }

  return suggestions
}
