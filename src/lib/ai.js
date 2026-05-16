const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions'

const SYSTEM_PROMPT = `Você é a assistente de IA da REATIVA, uma plataforma de reativação de clientes e CRM.

Seu papel é ajudar empreendedores a:
- Reativar clientes perdidos ou inativos
- Criar campanhas de reengajamento
- Analisar métricas de clientes
- Sugerir estratégias de automação
- Otimizar o atendimento

Responda sempre em português brasileiro, de forma direta e prática. Use dados e exemplos quando possível. Seja amigável mas profissional.`

export async function chatWithAI(messages, apiKey, model = 'openai/gpt-3.5-turbo') {
  if (!apiKey) {
    throw new Error('API Key não configurada. Vá em Configurações e insira sua chave do OpenRouter.')
  }

  const formattedMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
  ]

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'REATIVA'
    },
    body: JSON.stringify({
      model,
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1024
    })
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    if (response.status === 401) {
      throw new Error('API Key inválida. Verifique sua chave em Configurações.')
    }
    throw new Error(error.error?.message || `Erro na API: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content || 'Sem resposta da IA.'
}

export const OPENROUTER_MODELS = [
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
  { id: 'google/gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  { id: 'meta-llama/llama-3.1-8b-instruct', name: 'Llama 3.1 8B', provider: 'Meta' },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B', provider: 'Mistral' },
]
