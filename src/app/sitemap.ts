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
    {
      url: 'https://www.juantapias.dev/about',
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: 'https://www.juantapias.dev/contact',
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.8,
    },
  ]
}
