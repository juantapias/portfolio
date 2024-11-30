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
    <div id='about' ref={containerRef} className='about' data-bg='dark'>
      <div
        className='section'
        style={{
          minWidth: '100vw',
          height: '100%',
        }}>
        <div className='container mx-auto h-full'>
          <div className='flex items-start flex-col justify-center h-full w-1/2 space-y-4'>
            <h2 className='underline'>Sobre mí</h2>
            <div className='space-y-4'>
              <p>
                <strong>
                  Transformo ideas en experiencias digitales memorables.
                </strong>
              </p>
              <p>
                ¡Hola! Soy Juan Tapias, desarrollador y diseñador web con más de
                10 años de experiencia creando sitios web funcionales, rápidos y
                muy originales. Trabajo con tecnologías modernas como ReactJS,
                NextJS, WordPress y otras, adaptándome a las necesidades de cada
                proyecto.
              </p>
              <p>
                Mi objetivo es ayudar a empresas y emprendedores como tú a
                destacar en un mundo digital competitivo, ofreciendo soluciones
                que combinan un diseño atractivo con un desarrollo técnico
                impecable.
              </p>
              <p>
                Si buscas a alguien que entienda tu visión y la lleve al
                siguiente nivel, estás en el lugar correcto.
              </p>
            </div>
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
          <div className='flex items-start flex-col justify-center h-full w-1/2 space-y-4'>
            <h2>Servicios</h2>
            <div className='space-y-4'>
              <p>
                <strong>Diseño y desarrollo web hecho a la medida</strong>
              </p>

              <p>
                Cada proyecto tiene su propia esencia y mi misión es resaltarla.
                Aquí tienes lo que puedo hacer por ti:
              </p>

              <ul>
                <li>
                  <strong>Desarrollo personalizado:</strong> Sitios únicos y
                  adaptados a tu marca, diseñados para captar y retener la
                  atención.
                </li>
                <li>
                  <strong>Diseño web:</strong> Diseño de interfaces rápidas,
                  fluidas y optimizadas para dispositivos móviles y de
                  escritorio, brindando una mejor experiencia.
                </li>
                <li>
                  <strong>WordPress:</strong> Soluciones escalables y fáciles de
                  administrar para tu negocio.
                </li>
              </ul>

              <p>
                <strong>
                  Ya sea que necesites una página desde cero o renovar tu
                  presencia digital, trabajemos juntos para lograrlo.
                </strong>
              </p>
            </div>
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
          <div className='flex items-start flex-col justify-center h-full w-1/2 space-y-4'>
            <h2>¿Por qué elegirme?</h2>
            <div className='space-y-4'>
              <p>
                <strong>
                  Porque tu proyecto merece algo más que un sitio web; merece
                  una experiencia única.
                </strong>
              </p>

              <p>
                En un mercado lleno de opciones, destacarse no es una tarea
                fácil. Esto es lo que me diferencia y por qué soy el aliado
                ideal para tu proyecto:
              </p>

              <ul>
                <li>
                  <strong>Enfoque en resultados:</strong> No solo diseño páginas
                  bonitas, creo sitios que generan conversiones, mejoran la
                  experiencia del usuario y cumplen objetivos de negocio.
                </li>
                <li>
                  <strong>Comunicación constante:</strong> Desde la primera
                  reunión hasta el lanzamiento, mantengo un flujo abierto y
                  transparente para que siempre estés al tanto del progreso.
                </li>
                <li>
                  <strong>Calidad y detalle:</strong> Cada línea de código y
                  cada diseño pasan por un proceso riguroso para asegurar que el
                  resultado supere las expectativas.
                </li>
              </ul>

              <p>
                Tu página web es tu carta de presentación en el mundo digital.
                Hagamos que sea memorable, funcional y, sobre todo, efectiva.
              </p>

              <p>
                <i>¿Listo para transformar tu idea en realidad?</i>
              </p>

              <p>
                <strong>¡Hablemos y hagámoslo posible!</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
