import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  const base = site?.toString() ?? 'https://juantapias.dev/'
  const body = `User-agent: *
Allow: /
Disallow: /link-tree

# Motores generativos / IA
User-agent: GPTBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /

Sitemap: ${new URL('sitemap-index.xml', base).toString()}
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
