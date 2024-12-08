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
    <div
      id='about'
      ref={containerRef}
      className='about relative'
      data-bg='dark'>
      <div
        className='section'
        style={{
          minWidth: '100vw',
          height: '100%',
        }}>
        <div className='container mx-auto h-full px-8'>
          <div className='grid grid-rows-1 h-full'>
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='flex flex-col items-start justify-center h-full space-y-4'>
                <h2 className='underline'>Sobre mí</h2>
                <div className='space-y-4'>
                  <p>
                    <strong>
                      Transformo ideas en experiencias digitales memorables.
                    </strong>
                  </p>
                  <p>
                    ¡Hola! Soy Juan Tapias, desarrollador y diseñador web con
                    más de 10 años de experiencia creando sitios web
                    funcionales, rápidos y muy originales. Trabajo con
                    tecnologías modernas como ReactJS, NextJS, WordPress y
                    otras, adaptándome a las necesidades de cada proyecto.
                  </p>
                  <p>
                    Mi objetivo es ayudar a empresas y emprendedores como tú a
                    destacar en un mundo digital competitivo, ofreciendo
                    soluciones que combinan un diseño atractivo con un
                    desarrollo técnico impecable.
                  </p>
                  <p>
                    Si buscas a alguien que entienda tu visión y la lleve al
                    siguiente nivel, estás en el lugar correcto.
                  </p>
                </div>
              </div>
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
        <div className='container mx-auto h-full px-8'>
          <div className='grid grid-rows-1 h-full'>
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='flex flex-col items-start justify-center h-full space-y-4'>
                <h2>¿Por qué elegirme?</h2>
                <div className='space-y-4'>
                  <p>
                    En un mercado lleno de opciones, destacarse no es una tarea
                    fácil. Esto es lo que me diferencia y por qué soy el aliado
                    ideal para tu proyecto:
                  </p>

                  <ul>
                    <li>
                      <strong>Enfoque en resultados:</strong> No solo diseño
                      páginas bonitas, creo sitios que generan conversiones,
                      mejoran la experiencia del usuario y cumplen objetivos de
                      negocio.
                    </li>
                    <li>
                      <strong>Comunicación constante:</strong> Desde la primera
                      reunión hasta el lanzamiento, mantengo un flujo abierto y
                      transparente para que siempre estés al tanto del progreso.
                    </li>
                    <li>
                      <strong>Calidad y detalle:</strong> Cada línea de código y
                      cada diseño pasan por un proceso riguroso para asegurar
                      que el resultado supere las expectativas.
                    </li>
                  </ul>

                  <p>
                    Tu página web es tu carta de presentación en el mundo
                    digital. Hagamos que sea memorable, funcional y, sobre todo,
                    efectiva.
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
      </div>
    </div>
  )
}
