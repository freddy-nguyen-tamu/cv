export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const groqApiKey = process.env.GROQ_API_KEY

  if (!groqApiKey) {
    return res.status(500).json({ error: 'Missing GROQ_API_KEY' })
  }

  try {
    const { message, context, pageContext, history } = req.body || {}
    const resolvedContext = typeof context === 'string' ? context : pageContext

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Missing message' })
    }

    const conversationHistory = Array.isArray(history)
      ? history
          .filter(
            (entry) =>
              entry &&
              (entry.role === 'user' || entry.role === 'assistant') &&
              typeof entry.content === 'string' &&
              entry.content.trim()
          )
          .slice(-10)
          .map((entry) => ({
            role: entry.role,
            content: entry.content.trim()
          }))
      : []

    const systemPrompt = `
You are a portfolio assistant for Quan Nguyen.
Answer only from the provided website context.
If the answer is not in the context, say you do not know.
Do not invent achievements, projects, dates, or background details.
Be concise, helpful, and accurate.
`.trim()

    const userPrompt = `
WEBSITE CONTEXT:
${typeof resolvedContext === 'string' ? resolvedContext.slice(0, 12000) : ''}

QUESTION:
${message}
`.trim()

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      {
        role: 'system',
        content: `WEBSITE CONTEXT:\n${typeof resolvedContext === 'string' ? resolvedContext.slice(0, 12000) : ''}`
      },
      ...conversationHistory
    ]

    const lastHistoryMessage = conversationHistory[conversationHistory.length - 1]
    if (!lastHistoryMessage || lastHistoryMessage.role !== 'user' || lastHistoryMessage.content !== message.trim()) {
      groqMessages.push({ role: 'user', content: userPrompt })
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        temperature: 0.2,
        messages: groqMessages
      })
    })

    const data = await groqRes.json()

    if (!groqRes.ok) {
      return res.status(500).json({
        error: 'Groq request failed',
        details: data
      })
    }

    const answer =
      data?.choices?.[0]?.message?.content?.trim() ||
      'Sorry, I could not generate a response.'

    return res.status(200).json({ answer })
  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
