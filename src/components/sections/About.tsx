'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function About() {
  const t = useTranslations('About')
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const imageRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '-40% center',
          end: '70% center',
          scrub: true,
          markers: false,
        },
      })
      if (contentRef.current)
        tl.from(['.about-title', '.about-content p'], {
          y: 100,
          opacity: 0,
          stagger: 0.1,
        }).from(
          imageRef.current,
          {
            opacity: 0,
            scale: 0,
          },
          '-=0.75'
        )
    },
    { scope: containerRef }
  )

  return (
    <section id='about' ref={containerRef} className='about px-16'>
      <div className='about-container'>
        <div className='grid grid-rows-1'>
          <article className='grid grid-cols-1 lg:grid-cols-2 gap-10'>
            <figure
              ref={imageRef}
              className='relative flex items-center justify-center w-72 h-96 md:w-[500px] md:h-[500px] mx-auto'>
              <Image
                src='/images/about.png'
                alt='About me'
                fill
                className='object-contain rounded-2xl fade-borders'
                priority
              />
            </figure>

            <div>
              <div className='about-title'>
                <h2>{t('title')}</h2>
              </div>

              <div
                ref={contentRef}
                className='about-content space-y-4 text-center'>
                <p className='whitespace-pre-line'>{t('content')}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
