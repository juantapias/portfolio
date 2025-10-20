import type { NextConfig } from 'next'
import path from 'path'
import createNextIntlPlugin from 'next-intl/plugin'

const __dirname = path.dirname(__filename)

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/styles')],
    prependData: `@import "main.scss";`,
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
  serverExternalPackages: ['next-seo'],
}

export default withNextIntl(nextConfig)
