import MainBanner from '@/components/banners/MainBanner'
import About from '@/components/sections/About'
import Works from '@/components/sections/Works'
import Contact from '@/components/sections/Contact'
import Ads from '@/components/sections/Ads'

export default function Home() {
  return (
    <>
      <MainBanner />
      <About />
      <Ads />
      {/* <Works /> */}
      <Contact />
    </>
  )
}
