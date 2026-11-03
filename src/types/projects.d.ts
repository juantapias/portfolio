export type ProjectStatus = 'completed' | 'in-progress'
export type Locale = 'es' | 'en'

export interface ProjectOverview {
  /** 1 frase (~200 caracteres). Tarjeta de la home y subtítulo del caso. */
  short: string
  /** 1 párrafo. Texto destacado del resumen del caso. */
  medium: string
  /** 2–3 párrafos separados por "\n\n". Narrativa completa e indexable del caso. */
  long: string
}

export interface ProjectSEO {
  /** ≤ 52 caracteres: el layout añade " — Tapias" (total ≤ 60). Formato: "{Nombre}: {qué se hizo} para {industria}" */
  title: string
  /** 120–160 caracteres. Debe incluir la keyword principal. */
  description: string
  /** Búsqueda a la que apunta este caso, en el idioma de la página. */
  primaryKeyword: string
}

export interface ProjectTestimonial {
  quote: string
  author: string
  role: string
}

export interface ProjectResult {
  /** Valor destacado, p. ej. "+118%" o "1.2 s" */
  value: string
  label: string
}

export interface ProjectTranslation {
  name: string
  category: string
  industry: string
  /** Texto alternativo descriptivo de la portada (qué se ve, no "imagen de…"). */
  coverAlt: string

  overview: ProjectOverview
  challenge: string
  solution: string

  features: string[]
  responsibilities: string[]
  /** Etiquetas visibles en el caso y keywords del JSON-LD, en el idioma de la página. */
  tags: string[]

  results?: ProjectResult[]
  testimonial?: ProjectTestimonial

  seo: ProjectSEO
}

export interface Project {
  slug: string
  client: string
  projectType: 'client' | 'personal'
  status: ProjectStatus

  country: string
  year: number
  /** Mes de lanzamiento en formato YYYY-MM, si se conoce. */
  launchedAt?: string
  durationWeeks: number

  website?: string

  /** Portada horizontal ≥ 2000px (Cloudinary o /images/projects/...). */
  coverImage: string
  /** CSS object-position de la portada (por defecto 'center'). */
  coverPosition?: string
  /** Imagen 1200×630 para redes. Si falta, se genera desde la portada (solo Cloudinary). */
  ogImage?: string
  /** Video del recorrido por el sitio (Cloudinary). */
  video?: string

  techStack: string[]

  translations: Record<Locale, ProjectTranslation>
}

/** Vista plana de un proyecto con el idioma resuelto — se pasa directamente a la UI */
export interface ProjectView extends Omit<ProjectTranslation, 'seo'> {
  slug: string
  client: string
  status: ProjectStatus
  country: string
  year: number
  launchedAt?: string
  durationWeeks: number
  website?: string
  coverImage: string
  coverPosition?: string
  video?: string
  techStack: string[]
}
