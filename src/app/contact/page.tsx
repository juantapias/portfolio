'use client'

import { useEffect, useState } from 'react'
import Contact from '@/components/sections/Contact'
import SocialMedia from '@/components/social/SocialMedia'
import Loader from '@/components/loader/Loader'

export default function Page() {
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return isLoading ? (
    <Loader isLoading={isLoading} />
  ) : (
    <>
      <Contact />
      <SocialMedia />
    </>
  )
}
