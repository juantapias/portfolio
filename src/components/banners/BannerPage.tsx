import React, { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function BannerPage({ title }: { title: string }) {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
  const bannerRef = useRef<HTMLDivElement>(null)
  const bannerTitleRef = useRef<HTMLHeadingElement>(null)
  const bannerBackgroundRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (bannerBackgroundRef.current) {
      gsap.from(bannerBackgroundRef.current, {
        opacity: 0,
        duration: 2,
        ease: 'power2.out',
      })
    }

    if (bannerTitleRef.current) {
      const letters = bannerTitleRef.current.querySelectorAll('span')
      gsap.from(letters, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.25,
        ease: 'power2.out',
      })
    }
  })

  useGSAP(
    () => {
      const isDesktop = window.innerWidth >= 768
      const isTablet = window.innerWidth >= 576 && window.innerWidth < 768
      const isMobile = window.innerWidth < 576

      let start, end
      if (isDesktop) {
        start = 'bottom center'
        end = '150% center'
      } else if (isTablet) {
        start = 'top center'
        end = '-55% center'
      } else if (isMobile) {
        start = '250% center'
        end = '500% center'
      }

      const letters =
        bannerTitleRef.current &&
        bannerTitleRef.current.querySelectorAll('span')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bannerRef.current,
          start: start,
          end: end,
          scrub: true,
          markers: false,
        },
      })
      tl.to(
        bannerBackgroundRef.current,
        {
          y: -200,
          delay: 0.1,
          opacity: 0,
        },
        'a'
      )
      tl.to(letters, { y: -200, opacity: 0, stagger: 0.1 }, 'a')
    },
    { scope: bannerRef }
  )

  return (
    <div ref={bannerRef} className='banner-page px-8'>
      <div ref={bannerBackgroundRef} className='banner-page-title'>
        <h1 ref={bannerTitleRef}>
          {title.split('').map((letter, index) => (
            <span key={index} style={{ display: 'inline-block' }}>
              {letter}
            </span>
          ))}
        </h1>
      </div>
    </div>
  )
}
