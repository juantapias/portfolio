import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    implementation: 'sass-embedded',
  },
  serverExternalPackages: ['next-seo'],
}

export default nextConfig
