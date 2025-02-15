'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function About() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: true,
          markers: false,
        },
      })
      tl.from('.about-title', { y: 100, opacity: 0 }, 'a')
      tl.from('.about-content p', { y: 100, opacity: 0, stagger: 0.1 })
      tl.from(
        '.about-container',
        { borderBottomColor: 'transparent', delay: 1 },
        'a'
      )
    },
    { scope: containerRef }
  )

  return (
    <div id='about' ref={containerRef} className='about px-8' data-bg='dark'>
      <div className='about-container px-8'>
        <div className='grid grid-rows-1'>
          <div className='grid grid-cols-1 gap-10'>
            {/* Título */}
            <div className='about-title'>
              <h2>Detrás del concepto</h2>
            </div>
            {/* Contenido */}
            <div className='about-content space-y-4 text-center'>
              <p>
                Mi trabajo es una exploración constante entre el arte, la
                identidad y la funcionalidad, buscando crear piezas que no solo
                sean visualmente impactantes, sino que también cuenten una
                historia y generen conexión.
              </p>

              <p>
                A través del branding, el diseño web y la dirección de arte,
                ayudo a marcas y proyectos a encontrar su voz visual, dándoles
                una identidad auténtica y memorable. Cada detalle, cada color y
                cada forma están pensados para comunicar algo más allá de lo
                evidente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
