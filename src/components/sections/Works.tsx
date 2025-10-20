'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from 'next-intl'
import { Services } from '@/types'

export default function Works() {
  const t = useTranslations('Works')
  const services = t.raw('services')

  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'bottom 40%',
          scrub: true,
          markers: false,
        },
      })

      tl.from(
        ['.work-container-item'],
        { y: 100, opacity: 0, stagger: 0.3 },
        'a'
      )
    },
    { scope: containerRef }
  )

  return (
    <section
      id='works'
      ref={containerRef}
      className='work px-8'
      aria-labelledby='works-title'>
      <div className='work-container'>
        <div className='grid grid-rows-1'>
          <div className='grid grid-cols-1'>
            {services.map((service: Services, index: number) => (
              <article
                key={index}
                className='work-container-item'
                aria-label={`Service: ${service.label}`}>
                <div className='work-container-head'>
                  <h3 className='text-2xl font-bold'>{service.label}</h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
