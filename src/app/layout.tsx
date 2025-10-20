import type { Metadata } from 'next'
import Script from 'next/script'

import './globals.scss'
import 'swiper/css'
import 'swiper/css/navigation'

export const metadata: Metadata = {
  title: 'Juan Tapias – Crafting Modern Digital Experiences',
  description:
    'I transform ideas into engaging digital experiences through web development, UI/UX design, and creative visual solutions. Explore my portfolio of modern websites and interactive designs.',
  keywords: [
    'web development',
    'UI/UX design',
    'visual identity',
    'creative portfolio',
    'modern websites',
    'digital experiences',
    'front-end developer',
  ],
  authors: [{ url: 'https://www.juantapias.dev/', name: 'Juan Tapias' }],
  verification: {
    google: '7mChXJQWgjNhHpEDBYtQka7uA2dJN3FsNtowrOzmdJc',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-TW8F955S'
            height='0'
            width='0'
            style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>

        {/* Google Tag Manager Script */}
        <Script
          id='google-tag-manager'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-TW8F955S');
            `,
          }}
        />

        {children}
      </body>
    </html>
  )
}
