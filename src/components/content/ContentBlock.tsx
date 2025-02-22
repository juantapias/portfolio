import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function ContentBlock() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      if (titleRef.current) {
        gsap.from(titleRef.current, { x: -100, opacity: 0 })
        gsap.from(titleRef.current, {
          borderRightColor: 'transparent',
          delay: 1,
        })
      }
      if (contentRef.current) {
        const paragraph = contentRef.current.querySelectorAll('p')
        gsap.from(paragraph, { y: 100, opacity: 0, stagger: 0.1 })
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '45% center',
          end: '120% center',
          scrub: true,
          markers: false,
        },
      })
      tl.to(titleRef.current, { borderRightColor: 'transparent' })
      tl.to(titleRef.current, { x: -100, opacity: 0 }, 'a')
      if (contentRef.current)
        tl.to(contentRef.current?.children, {
          y: 100,
          opacity: 0,
          stagger: 0.1,
        })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className='content-block'>
      <div className='content-block-container px-8'>
        <div className='grid grid-rows-1'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
            <div ref={titleRef} className='content-block-container-title'>
              <h2>Explorando el proceso</h2>
            </div>

            <div
              ref={contentRef}
              className='content-block-container-content space-y-4 text-center lg:col-span-2'>
              <div>
                <p>
                  <strong>Diseño, desarrollo y narrativa visual</strong>
                </p>
                <p>
                  Encontrar el equilibrio perfecto entre estética y
                  funcionalidad es el núcleo de mi trabajo. Cada proyecto es una
                  oportunidad para crear experiencias digitales que inspiran,
                  comunican y conectan. Desde que tengo memoria, me ha fascinado
                  la manera en que el arte y la tecnología pueden fusionarse
                  para contar historias.
                </p>
              </div>
              <div>
                <p>
                  <strong>
                    Tecnología y creatividad: el lenguaje con el que construyo
                  </strong>
                </p>
                <p>
                  El diseño y el desarrollo se convierten en herramientas para
                  dar vida a proyectos únicos. Trabajo con diversas tecnologías
                  y exploro constantemente nuevas herramientas para ofrecer
                  soluciones innovadoras y personalizadas.
                </p>
              </div>
              <div>
                <p>
                  <strong>Una trayectoria en constante evolución</strong>
                </p>
                <p>
                  Cada proyecto es un lienzo en blanco, una oportunidad para
                  transformar ideas en realidades visuales. Mi proceso creativo
                  no solo se centra en la técnica, sino también en la historia
                  detrás de cada marca, producto o experiencia digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
