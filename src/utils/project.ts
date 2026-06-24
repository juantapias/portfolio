import { projects } from './../data/projects'
import type { Project, ProjectView } from '../types/projects'

export function resolveProjectView(
  project: Project,
  locale: 'es' | 'en'
): ProjectView {
  const t = project.translations[locale]
  return {
    slug: project.slug,
    status: project.status,
    country: project.country,
    year: project.year,
    duration: t.duration,
    website: project.website,
    coverImage: project.coverImage,
    techStack: project.techStack,
    tags: project.tags,
    role: project.role,
    name: t.name,
    category: t.category,
    industry: t.industry,
    overview: t.overview,
    challenge: t.challenge,
    solution: t.solution,
    features: t.features,
    responsibilities: t.responsibilities,
  }
}
