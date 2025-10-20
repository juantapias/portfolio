'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'

export default function Ads() {
  const t = useTranslations('Ads')
  const adsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!adsRef.current) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(adsRef.current!)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: adsRef.current,
          start: '-50% center',
          end: 'center center',
          scrub: true,
          markers: false,
        },
      })

      tl.from(q('span'), { opacity: 0, x: -200, stagger: 0.5, duration: 1 })
    }, adsRef)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section id='ads' ref={adsRef} className='ads px-16'>
      <article className='ads-container'>
        <h2 className='space-x-2 flex flex-col items-start justify-start'>
          <span className='inline-flex'>{t('line1')}</span>
          <span className='inline-flex'>{t('line2')}</span>
          <span className='inline-flex'>{t('line3')}</span>
        </h2>
      </article>
    </section>
  )
}
