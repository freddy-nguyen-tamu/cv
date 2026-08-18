const GROQ_CHAT_COMPLETIONS_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_MODELS_URL = 'https://api.groq.com/openai/v1/models'
const GROQ_MODEL_CACHE_TTL_MS = 15 * 60 * 1000
const RETIRED_GROQ_MODELS = new Set(['llama-3.1-8b-instant'])
const FALLBACK_GROQ_CHAT_MODELS = [
  'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-120b',
  'qwen/qwen3.6-27b',
  'groq/compound-mini',
  'groq/compound'
]
const NON_CHAT_MODEL_MARKERS = [
  'whisper',
  'tts',
  'audio',
  'guard',
  'safeguard',
  'playai',
  'orpheus'
]

let groqModelCache = null
let lastSuccessfulGroqModel = null
let nextGroqKeyStartIndex = 0

function loadGroqKeys() {
  const keys = []
  const base = process.env.GROQ_API_KEY?.trim()

  if (base) {
    keys.push({ name: 'GROQ_API_KEY', value: base })
  }

  for (let index = 1; index <= 9; index += 1) {
    const name = `GROQ_API_KEY${index}`
    const value = process.env[name]?.trim()

    if (value) {
      keys.push({ name, value })
    }
  }

  return keys
}

function rotateItems(items, startIndex) {
  if (!items.length) {
    return items
  }

  const safeIndex = startIndex % items.length
  return [...items.slice(safeIndex), ...items.slice(0, safeIndex)]
}

function configuredModelOverride() {
  const model = process.env.GROQ_MODEL?.trim()

  if (!model || model.toLowerCase() === 'auto' || model.toLowerCase() === 'dynamic') {
    return null
  }

  if (RETIRED_GROQ_MODELS.has(model)) {
    console.warn(`Ignoring retired Groq model override: ${model}`)
    return null
  }

  return model
}

function isLikelyChatModel(modelId) {
  const lower = modelId.toLowerCase()

  if (RETIRED_GROQ_MODELS.has(modelId)) {
    return false
  }

  return !NON_CHAT_MODEL_MARKERS.some((marker) => lower.includes(marker))
}

function modelPreferenceRank(modelId) {
  const explicitRank = FALLBACK_GROQ_CHAT_MODELS.indexOf(modelId)

  if (explicitRank >= 0) {
    return explicitRank
  }

  const lower = modelId.toLowerCase()

  if (lower.includes('gpt-oss-20b')) return 10
  if (lower.includes('llama-3.3')) return 20
  if (lower.includes('gpt-oss-120b')) return 30
  if (lower.includes('qwen')) return 40
  if (lower.includes('llama')) return 50
  if (lower.includes('compound-mini')) return 60
  if (lower.includes('compound')) return 70

  return 100
}

function sortModelIds(modelIds) {
  return [...modelIds].sort((left, right) => modelPreferenceRank(left) - modelPreferenceRank(right))
}

function uniqueModelIds(modelIds) {
  const seen = new Set()
  const unique = []

  for (const modelId of modelIds) {
    const trimmed = modelId?.trim()

    if (!trimmed || seen.has(trimmed) || !isLikelyChatModel(trimmed)) {
      continue
    }

    seen.add(trimmed)
    unique.push(trimmed)
  }

  return unique
}

function summarizeGroqError(body) {
  try {
    const parsed = typeof body === 'string' ? JSON.parse(body) : body
    const parts = [
      parsed?.error?.code,
      parsed?.error?.type,
      parsed?.error?.message
    ].filter(Boolean)

    if (parts.length) {
      return parts.join(': ')
    }
  } catch {
    // Fall through to the raw response snippet.
  }

  return typeof body === 'string' ? body.slice(0, 800) : JSON.stringify(body).slice(0, 800)
}

async function discoverGroqModelIds(keys) {
  if (groqModelCache && groqModelCache.expiresAt > Date.now()) {
    return groqModelCache.ids
  }

  const discovered = new Set()
  const orderedKeys = rotateItems(keys, nextGroqKeyStartIndex)
  let lastError = 'unknown Groq model-list error'

  for (const key of orderedKeys) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 12000)

    try {
      const response = await fetch(GROQ_MODELS_URL, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${key.value}`,
          'Content-Type': 'application/json'
        }
      })
      const body = await response.text()

      if (!response.ok) {
        lastError = `${key.name} HTTP ${response.status}: ${summarizeGroqError(body)}`
        console.warn(`Could not list Groq models with ${lastError}`)
        continue
      }

      const data = JSON.parse(body)

      for (const model of data?.data || []) {
        const id = model?.id?.trim()

        if (id && model.active !== false && isLikelyChatModel(id)) {
          discovered.add(id)
        }
      }

    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
      console.warn(`Could not list Groq models with ${key.name}: ${lastError}`)
    } finally {
      clearTimeout(timeoutId)
    }
  }

  const ids = sortModelIds(Array.from(discovered))
  groqModelCache = {
    expiresAt: Date.now() + GROQ_MODEL_CACHE_TTL_MS,
    ids
  }

  if (!ids.length) {
    console.warn(`Groq model discovery returned no chat candidates. Falling back to built-in candidates. Last error: ${lastError}`)
  }

  return ids
}

async function modelCandidates(keys) {
  return uniqueModelIds([
    lastSuccessfulGroqModel,
    configuredModelOverride(),
    ...sortModelIds(await discoverGroqModelIds(keys)),
    ...FALLBACK_GROQ_CHAT_MODELS
  ])
}

async function createGroqChatCompletion(keys, messages) {
  const models = await modelCandidates(keys)

  if (!models.length) {
    throw new Error('No usable Groq chat models were discovered.')
  }

  let lastError = 'unknown Groq error'
  const disabledKeyNames = new Set()
  const attemptedModels = new Set()

  for (const model of models) {
    attemptedModels.add(model)

    for (const key of rotateItems(keys, nextGroqKeyStartIndex)) {
      if (disabledKeyNames.has(key.name)) {
        continue
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 45000)

      try {
        const groqRes = await fetch(GROQ_CHAT_COMPLETIONS_URL, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${key.value}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            temperature: 0.2,
            max_completion_tokens: 700,
            messages
          })
        })
        const body = await groqRes.text()

        if (groqRes.ok) {
          const data = JSON.parse(body)
          const answer = data?.choices?.[0]?.message?.content?.trim()

          if (!answer) {
            throw new Error('Groq returned an empty message.')
          }

          const usedIndex = keys.findIndex((item) => item.name === key.name)
          nextGroqKeyStartIndex = usedIndex >= 0 ? (usedIndex + 1) % keys.length : 0
          lastSuccessfulGroqModel = data?.model?.trim() || model

          return answer
        }

        lastError = `${key.name} ${model} HTTP ${groqRes.status}: ${summarizeGroqError(body)}`
        console.warn(lastError)

        if (groqRes.status === 401 || groqRes.status === 403) {
          disabledKeyNames.add(key.name)
        }
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
        console.warn(`Groq request failed with ${key.name} using model ${model}: ${lastError}`)
      } finally {
        clearTimeout(timeoutId)
      }
    }
  }

  throw new Error(
    `All Groq API keys/models failed. Tried models: ${Array.from(attemptedModels).join(', ')}. Last error: ${lastError}`
  )
}

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

  const groqKeys = loadGroqKeys()

  if (!groqKeys.length) {
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

    const answer = await createGroqChatCompletion(groqKeys, groqMessages)

    return res.status(200).json({ answer })
  } catch (error) {
    return res.status(500).json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
