// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://juantapias.dev',

  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false, // '/' sirve español, '/en/' sirve inglés
    },
  },

  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
  },
})
