'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type IBanner = {
  title: string
  description: string
}

const bannerItem: IBanner[] = [
  {
    title: 'Portafolio',
    description:
      'Proyectos que combinan diseño, conceptos y funcionalidad. Cada trabajo refleja un enfoque único en el desarrollo visual y creativo.',
  },
  {
    title: 'Medellin, Colombia',
    description:
      'Diseño con identidad, innovación y visión global. Inspirado por la cultura vibrante y la energía creativa de Medellin.',
  },
  {
    title: 'Creación Visual',
    description:
      'Estrategia, arte y diseño se conecta y comunican para aplicar innovación visual a los proyectos.',
  },
]

export default function MainBanner() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
  const bannerRef = useRef<HTMLDivElement>(null)
  const bannerTitleRef = useRef<HTMLHeadingElement>(null)
  const bannerBackgroundRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from('.banner-item', {
      opacity: 0,
      duration: 1,
      stagger: 0.3,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.main-banner',
        start: 'top 80%',
      },
    })

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
      const letters =
        bannerTitleRef.current &&
        bannerTitleRef.current.querySelectorAll('span')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'center center',
          end: '150% center',
          scrub: true,
          markers: false,
        },
      })
      tl.to('.main-banner-item', { opacity: 0, stagger: 0.1 })
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
    <div ref={bannerRef} className='main-banner px-8' data-bg='dark'>
      <div className='grid grid-rows-1'>
        <div className='grid grid-cols-1 md:grid-cols-3'>
          {bannerItem.map((item, index) => (
            <div key={index} className='main-banner-item space-y-4'>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <div ref={bannerBackgroundRef} className='main-banner-title'>
          <h1 ref={bannerTitleRef}>
            {'Tapias'.split('').map((letter, index) => (
              <span key={index} style={{ display: 'inline-block' }}>
                {letter}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </div>
  )
}
