import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return [
    {
      url: 'https://www.juantapias.dev/',
      lastModified,
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}
