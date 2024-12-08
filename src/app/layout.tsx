import type { Metadata } from 'next'

import './globals.css'
import '@/styles/icons.css'

import Header from '@/containers/Header'
//import Loader from '@/components/loader/Loader'
import Footer from '@/containers/Footer'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Juan Tapias - Desarrollador creativo',
  description:
    'Descubre mi portafolio de desarrollo y diseño web: proyectos innovadores, soluciones personalizadas y diseño creativo para potenciar tu presencia en línea. ¡Explora mi trabajo ahora!',
  keywords: ['desarrollo web', 'diseño creativo', 'portafolio'],
  authors: [{ url: 'https://www.juantapias.dev/', name: 'Juan Tapias' }],
  verification: {
    google: '7mChXJQWgjNhHpEDBYtQka7uA2dJN3FsNtowrOzmdJc',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
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

        {/* <Loader /> */}

        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
