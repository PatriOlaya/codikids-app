const SYSTEM_PROMPT = `Eres Cody, el asistente educativo de CodiKids, una academia de programación infantil.
Responde en español claro, breve y apropiado para familias y niños. Ayuda con información sobre la metodología,
Scratch y la experiencia CodiKids. No solicites datos sensibles de menores. No inventes precios, horarios,
cupos ni políticas; cuando falte información invita a contactar a CodiKids por los canales oficiales.`

export default async function handler(req, res) {
  res.setHeader('Allow', 'POST')
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(-12) : []
    if (!messages.length) return res.status(400).json({ error: 'Faltan mensajes' })

    const safeMessages = messages.map(({ role, content }) => ({
      role: role === 'assistant' ? 'assistant' : 'user',
      content: String(content || '').slice(0, 4000)
    }))

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 700, system: SYSTEM_PROMPT, messages: safeMessages })
    })

    const data = await response.json()
    if (!response.ok) return res.status(response.status).json({ error: 'No fue posible responder en este momento.' })
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json(data)
  } catch {
    return res.status(500).json({ error: 'Error interno del asistente' })
  }
}
