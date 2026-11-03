import type { Locale, Project, ProjectView } from '../types/projects'

export function resolveProjectView(project: Project, locale: Locale): ProjectView {
  const { seo: _seo, ...t } = project.translations[locale]
  return {
    ...t,
    slug: project.slug,
    client: project.client,
    status: project.status,
    country: project.country,
    year: project.year,
    launchedAt: project.launchedAt,
    durationWeeks: project.durationWeeks,
    website: project.website,
    coverImage: project.coverImage,
    coverPosition: project.coverPosition,
    video: project.video || undefined,
    techStack: project.techStack,
  }
}

/** "4 semanas" / "4 weeks" */
export function formatDuration(weeks: number, locale: Locale) {
  if (locale === 'es') return `${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`
  return `${weeks} ${weeks === 1 ? 'week' : 'weeks'}`
}

/** Párrafos de un texto largo separados por líneas en blanco */
export function paragraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(Boolean)
}

/** Cloudinary auto-optimization for images: injects f_auto,q_auto and a width */
export function cloudinaryImage(url: string | undefined, width = 1600) {
  return url?.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
}

/** Cloudinary video delivered as a web-friendly MP4 (source files are .mov) */
export function cloudinaryVideo(url: string | undefined, width = 1280) {
  return url
    ?.replace('/upload/', `/upload/q_auto,vc_auto,w_${width}/`)
    .replace(/\.mov$/i, '.mp4')
}

/** Imagen 1200×630 en JPG para redes sociales (las redes no siempre aceptan WebP) */
export function projectOgImage(project: Project) {
  if (project.ogImage) return project.ogImage
  if (project.coverImage.includes('res.cloudinary.com')) {
    return project.coverImage.replace('/upload/', '/upload/c_fill,g_auto,w_1200,h_630,f_jpg,q_auto/')
  }
  return project.coverImage
}

/* ───────────────────────────── Auditoría SEO (build) ───────────────────────────── */

const SEO_RULES = {
  titleMax: 52,
  descriptionMin: 120,
  descriptionMax: 160,
}

/**
 * Revisa que todos los proyectos cumplan la estructura SEO y devuelve los
 * avisos. Se ejecuta en getStaticPaths, así cualquier problema aparece en la
 * consola de `npm run dev` / `npm run build`.
 */
export function auditProjects(projects: Project[]) {
  const warnings: string[] = []
  const slugs = new Set<string>()

  for (const project of projects) {
    const id = project.slug

    if (slugs.has(id)) warnings.push(`[${id}] slug duplicado`)
    slugs.add(id)

    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) warnings.push(`[${id}] el slug debe ser kebab-case`)
    if (project.launchedAt && !/^\d{4}-(0[1-9]|1[0-2])$/.test(project.launchedAt)) {
      warnings.push(`[${id}] launchedAt debe tener formato YYYY-MM`)
    }

    for (const locale of ['es', 'en'] as const) {
      const t = project.translations[locale]
      const tag = `[${id}/${locale}]`
      const { title, description, primaryKeyword } = t.seo

      if (title.length > SEO_RULES.titleMax) {
        warnings.push(`${tag} seo.title tiene ${title.length} caracteres (máx. ${SEO_RULES.titleMax})`)
      }
      if (description.length < SEO_RULES.descriptionMin || description.length > SEO_RULES.descriptionMax) {
        warnings.push(
          `${tag} seo.description tiene ${description.length} caracteres (${SEO_RULES.descriptionMin}–${SEO_RULES.descriptionMax})`
        )
      }
      if (!description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
        warnings.push(`${tag} seo.description no incluye la keyword "${primaryKeyword}"`)
      }
      if (t.coverAlt.trim().length < 15) warnings.push(`${tag} coverAlt es demasiado corto`)
      if (paragraphs(t.overview.long).length < 2) warnings.push(`${tag} overview.long debería tener 2+ párrafos`)
    }
  }

  return warnings
}
