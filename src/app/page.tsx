'use client'

import { useEffect, useState } from 'react'

import Loader from '@/components/loader/Loader'
import MainBanner from '@/components/banners/MainBanner'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import Ads from '@/components/sections/Ads'
import Contact from '@/components/sections/Contact'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return isLoading ? (
    <Loader isLoading={isLoading} />
  ) : (
    <>
      <MainBanner />
      <About />
      <Services />
      <Ads />
      <Contact />
    </>
  )
}
