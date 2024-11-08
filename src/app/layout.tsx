import type { Metadata } from 'next'

import './globals.css'
import '@/styles/icons.css'

import Header from '@/containers/Header'
import Loader from '@/components/loader/Loader'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body>
        <Loader />
        <Header />
        {children}
      </body>
    </html>
  )
}
