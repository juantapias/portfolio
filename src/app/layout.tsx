import type { Metadata } from 'next'

import './globals.css'
import '@/styles/icons.css'

import Header from '@/containers/Header'
//import Loader from '@/components/loader/Loader'
import Footer from '@/containers/Footer'

export const metadata: Metadata = {
  title: 'Juan Tapias - Desarrollador creativo',
  description:
    'Descubre mi portafolio de desarrollo y diseño web: proyectos innovadores, soluciones personalizadas y diseño creativo para potenciar tu presencia en línea. ¡Explora mi trabajo ahora!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        {/* <Loader /> */}

        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
