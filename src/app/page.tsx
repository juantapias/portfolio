import MainBanner from '@/components/banners/MainBanner'
import About from '@/components/sections/About'
import Contact from '@/components/sections/Contact'
import Ads from '@/components/sections/Ads'

export default function Home() {
  return (
    <>
      <MainBanner />
      <About />
      <Ads />
      <Contact />
    </>
  )
}
