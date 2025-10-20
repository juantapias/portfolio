import Footer from '@/containers/Footer'
import Header from '@/containers/Header'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <NextIntlClientProvider locale={locale}>
      <Header />
      {children}
      <Footer />
    </NextIntlClientProvider>
  )
}
