'use client'

import { useEffect, useState } from 'react'
import BannerPage from '@/components/banners/BannerPage'
import Loader from '@/components/loader/Loader'
import CarouselScroll from '@/components/carousel/CarouselScroll'
import ContentBlock from '@/components/content/ContentBlock'

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
      <BannerPage title='Acerca' />
      <ContentBlock />
      <CarouselScroll />
    </>
  )
}
