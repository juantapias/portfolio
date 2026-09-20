import type { APIRoute } from 'astro'
import { projects } from '../data/projects'
import en from '../i18n/en.json'

export const GET: APIRoute = ({ site }) => {
  const base = (site?.toString() ?? 'https://juantapias.dev/').replace(/\/$/, '')

  const services = en.Works.services
    .map(s => `- ${s.label}: ${s.description}`)
    .join('\n')

  const projectLines = projects
    .map(p => {
      const t = p.translations.en
      return `- [${t.name}](${base}/en/projects/${p.slug}): ${t.seo.description}`
    })
    .join('\n')

  const body = `# Juan Tapias

> Digital product designer and developer (UI/UX, branding, full-stack web). Based in Colombia, working with clients worldwide in Spanish and English.

## Pages
- [Home (EN)](${base}/en)
- [Inicio (ES)](${base}/es)

## Services
${services}

## Projects
${projectLines}

## Contact
- Email: dev.juantapias@gmail.com
- GitHub: https://github.com/juantapias
- Instagram: https://www.instagram.com/tapias.dev/
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
