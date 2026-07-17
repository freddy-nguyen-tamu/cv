const allowedHosts = new Set([
  'linkedout-aggies-0f3d429fef3a.herokuapp.com',
  'nexus-base-kohl.vercel.app',
  'wavestack.duckdns.org'
])

const hostingProviders = [
  ['herokuapp.com', 'Heroku'],
  ['vercel.app', 'Vercel'],
  ['duckdns.org', 'Duck DNS'],
  ['pages.dev', 'Cloudflare Pages'],
  ['netlify.app', 'Netlify'],
  ['github.io', 'GitHub Pages'],
  ['render.com', 'Render']
]

const titleCase = (value) =>
  value
    .split(/[-.\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const getHostingSource = (targetUrl) => {
  const hostname = targetUrl.hostname.replace(/^www\./, '')
  const provider = hostingProviders.find(([match]) => hostname === match || hostname.endsWith(`.${match}`))

  if (provider) return provider[1]

  const labels = hostname.split('.').filter(Boolean)
  const source = labels.length > 1 ? labels[labels.length - 2] : labels[0]

  return titleCase(source || hostname)
}

const getRequestUrl = (req) => {
  const host = req.headers?.host || 'localhost'
  return new URL(req.url, `https://${host}`)
}

const getRequestOrigin = (req) => {
  const origin = req.headers?.origin

  if (origin) return origin

  try {
    const referer = req.headers?.referer
    return referer ? new URL(referer).origin : ''
  } catch {
    return ''
  }
}

const getFrameAncestors = (contentSecurityPolicy) => {
  if (!contentSecurityPolicy) return ''

  return contentSecurityPolicy
    .split(';')
    .map((directive) => directive.trim())
    .find((directive) => directive.toLowerCase().startsWith('frame-ancestors ')) || ''
}

const sourceAllowsOrigin = (source, origin, targetOrigin) => {
  if (source === '*') return true
  if (source === "'self'") return origin === targetOrigin
  if (source === origin) return true

  if (source.endsWith(':')) {
    return origin.startsWith(source)
  }

  if (source.startsWith('*.')) {
    try {
      return new URL(origin).hostname.endsWith(source.slice(1))
    } catch {
      return false
    }
  }

  return false
}

const cspBlocksFrame = (contentSecurityPolicy, origin, targetOrigin) => {
  const frameAncestors = getFrameAncestors(contentSecurityPolicy)

  if (!frameAncestors) return false

  const sources = frameAncestors.split(/\s+/).slice(1)

  if (sources.includes("'none'")) return true
  if (!origin) return sources.length > 0

  return !sources.some((source) => sourceAllowsOrigin(source, origin, targetOrigin))
}

const xFrameOptionsBlocksFrame = (xFrameOptions, origin) => {
  if (!xFrameOptions) return false

  const value = xFrameOptions.toUpperCase()

  if (value.includes('DENY')) return true
  if (value.includes('SAMEORIGIN')) return true

  if (value.includes('ALLOW-FROM')) {
    const allowedOrigin = xFrameOptions.split(/\s+/).at(-1)
    return allowedOrigin !== origin
  }

  return false
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const requestUrl = getRequestUrl(req)
    const rawUrl = requestUrl.searchParams.get('url')

    if (!rawUrl) {
      return res.status(400).json({ error: 'Missing url' })
    }

    const targetUrl = new URL(rawUrl)

    if (targetUrl.protocol !== 'https:' || !allowedHosts.has(targetUrl.hostname)) {
      return res.status(400).json({ error: 'Unsupported preview host' })
    }

    const response = await fetch(targetUrl, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        'User-Agent': 'Portfolio frame policy checker'
      }
    })

    const finalUrl = new URL(response.url || targetUrl.href)
    const origin = getRequestOrigin(req)
    const xFrameOptions = response.headers.get('x-frame-options') || ''
    const contentSecurityPolicy = response.headers.get('content-security-policy') || ''
    const blockedByXFrameOptions = xFrameOptionsBlocksFrame(xFrameOptions, origin)
    const blockedByCsp = cspBlocksFrame(contentSecurityPolicy, origin, finalUrl.origin)
    const blocked = blockedByXFrameOptions || blockedByCsp

    return res.status(200).json({
      blocked,
      blockReason: blockedByXFrameOptions ? 'x-frame-options' : blockedByCsp ? 'frame-ancestors' : '',
      sourceLabel: getHostingSource(finalUrl),
      finalUrl: finalUrl.href
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Unable to check frame policy',
      details: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}
