// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://juantapias.dev',
  trailingSlash: 'always',

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
        !/\/404\/?$/.test(new URL(page).pathname) &&
        !page.includes('/link-tree') &&
        // Landing de campañas pagadas: noindex, no debe estar en el sitemap
        !/\/(es|en)\/web\/$/.test(page),
      // Privacy and terms pages have different slugs per locale, so the plugin can't pair them itself
      serialize(item) {
        if (/\/(es\/privacidad|en\/privacy)\/$/.test(item.url)) {
          item.links = [
            { url: 'https://juantapias.dev/es/privacidad/', lang: 'es-CO' },
            { url: 'https://juantapias.dev/en/privacy/', lang: 'en-US' },
          ]
        }
        if (/\/(es\/terminos|en\/terms)\/$/.test(item.url)) {
          item.links = [
            { url: 'https://juantapias.dev/es/terminos/', lang: 'es-CO' },
            { url: 'https://juantapias.dev/en/terms/', lang: 'en-US' },
          ]
        }
        return item
      },
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
