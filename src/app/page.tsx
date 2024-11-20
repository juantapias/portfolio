'use client'

import { useEffect, useState } from 'react'

import MainBanner from '@/components/banners/MainBanner'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Ads from '@/components/sections/Ads'
import Loader from '@/components/loader/Loader'

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
      <Ads />
      <Contact />
    </>
  )
}
