import MainBanner from '@/components/banners/MainBanner'
import About from '@/components/sections/About'
import Projects from '@/components/sections/Projects'
import Works from '@/components/sections/Works'
import Ads from '@/components/sections/Ads'

export default function HomePage() {
  return (
    <>
      <MainBanner />
      <Works />
      <Projects />
      <About />
      <Ads />
    </>
  )
}
