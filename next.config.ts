import type { NextConfig } from 'next'
import path from 'path'

const __dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    prependData: `@import "main.scss";`,
  },

  serverExternalPackages: ['next-seo'],
}

export default nextConfig
