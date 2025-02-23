'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Link from 'next/link'

export default function About() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

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
      if (contentRef.current)
        tl.from(['.about-content p', '.view-more'], {
          y: 100,
          opacity: 0,
          stagger: 0.1,
        })
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
            <div className='about-title'>
              <h2>Detrás del concepto</h2>
            </div>

            <div
              ref={contentRef}
              className='about-content space-y-4 text-center'>
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

              <div className='view-more'>
                <Link href='about' className='btn is-secondary'>
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
