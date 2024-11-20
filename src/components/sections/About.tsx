'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function About() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const containerRef = useRef<HTMLDivElement | null>(null)

  useGSAP(() => {
    const container = containerRef.current

    if (container) {
      const sections = gsap.utils.toArray<HTMLDivElement>('.section')

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          end: () => `+=${container.offsetWidth}`, // Finaliza el scroll cuando toda la sección se desplace
        },
      })
    }
  })

  return (
    <div ref={containerRef} className='about'>
      <div
        className='section'
        style={{
          minWidth: '100vw',
          height: '100%',
        }}>
        <div className='container mx-auto h-full'>
          <div className='flex items-start flex-col justify-center h-full w-1/2'>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cupiditate quasi quis harum nemo officiis provident numquam
              dolorum asperiores sed totam eum adipisci quidem, officia, earum
              excepturi soluta, quibusdam maiores! Fuga.
            </p>
          </div>
        </div>
      </div>
      <div
        className='section'
        style={{
          minWidth: '100vw',
          height: '100%',
        }}>
        <div className='container mx-auto h-full'>
          <div className='flex items-start flex-col justify-center h-full w-1/2'>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cupiditate quasi quis harum nemo officiis provident numquam
              dolorum asperiores sed totam eum adipisci quidem, officia, earum
              excepturi soluta, quibusdam maiores! Fuga.
            </p>
          </div>
        </div>
      </div>
      <div
        className='section'
        style={{
          minWidth: '100vw',
          height: '100%',
        }}>
        <div className='container mx-auto h-full'>
          <div className='flex items-start flex-col justify-center h-full w-1/2'>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit</h2>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Cupiditate quasi quis harum nemo officiis provident numquam
              dolorum asperiores sed totam eum adipisci quidem, officia, earum
              excepturi soluta, quibusdam maiores! Fuga.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
