// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://juantapias.dev',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: true,
      fallbackType: 'redirect',
    },
  },

  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'es', locales: { es: 'es-CO', en: 'en-US' } },
      filter: page =>
        page !== 'https://juantapias.dev/' &&
        !page.includes('/404') &&
        !page.includes('/link-tree'),
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
