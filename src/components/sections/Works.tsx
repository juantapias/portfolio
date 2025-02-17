'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
export default function Works() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '-20% center',
          end: '50% center',
          scrub: true,
          markers: false,
        },
      })
      tl.from('.work-container', { opacity: 0 })
      tl.from(
        ['.work-head', 'h3', 'p', '.view-more'],
        { x: -100, opacity: 0, stagger: 0.1 },
        'a'
      )
      tl.from(
        '.work-container',
        { borderRightColor: 'transparent', delay: 1 },
        'a'
      )
      tl.from('.work-contain', { x: 100, opacity: 0, stagger: 0.1 })
    },
    { scope: containerRef }
  )

  return (
    <div id='work' ref={containerRef} className='work px-8'>
      <div className='work-container'>
        <div className='grid grid-rows-1'>
          <div className='grid grid-cols-1 md:grid-cols-6 lg:grid-cols-4'>
            <div className='work-container-head space-y-4 col-auto md:col-span-2 lg:col-auto'>
              <h3 className='text-center'>
                Creatividad en <br />
                <span>Acción</span>
              </h3>
              <p>
                Cada proyecto es un desafío, una exploración y una oportunidad
                para crear algo único. Diseño con intención, fusionando estética
                y funcionalidad para contar historias visuales que impactan.
              </p>
              <div className='view-more flex items-center justify-center'>
                <button className='btn is-primary'>Ver más</button>
              </div>
            </div>
            <div className='work-container-contain col-span-3 md:col-span-4 lg:col-span-3'>
              <span>En construcción creativa...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
