export type ProjectStatus = 'completed' | 'in-progress' | 'paused'

export interface ProjectOverview {
  short: string
  medium: string
  long: string
}

export interface ProjectSection {
  title: string
  description: string
}

export interface ProjectSEO {
  title: string
  description: string
  keywords: string[]
}

export interface ProjectTranslation {
  name: string

  category: string
  industry: string

  duration: string

  overview: ProjectOverview

  challenge: ProjectSection
  solution: ProjectSection

  features: string[]
  responsibilities: string[]

  seo: ProjectSEO
}

export interface Project {
  slug: string
  featured?: boolean

  client?: string

  projectType?: 'client' | 'personal' | 'open-source'

  status: ProjectStatus
  country: string

  year: number

  role?: string[]

  website?: string
  behanceUrl?: string
  githubUrl?: string

  coverImage?: string
  thumbnail?: string
  video?: string

  techStack: string[]
  tags: string[]

  translations: {
    es: ProjectTranslation
    en: ProjectTranslation
  }
}

/** Flattened view of a project with a resolved locale — passed directly to UI components */
export interface ProjectView {
  slug: string
  status: ProjectStatus
  country: string
  year: number
  duration: string
  website?: string
  coverImage?: string
  techStack: string[]
  tags: string[]
  role?: string[]

  // Resolved translation fields
  name: string
  category: string
  industry: string
  overview: ProjectOverview
  challenge: ProjectSection
  solution: ProjectSection
  features: string[]
  responsibilities: string[]
}
