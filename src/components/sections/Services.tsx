import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

type IServices = {
  title: string
  description: string
}

const servicesItems: IServices[] = [
  {
    title: 'Branding & Identidad Visual',
    description:
      'Las marcas son más que logotipos: son historias, emociones y personalidad. Creamos identidades visuales que dejan huella.',
  },
  {
    title: 'Diseño Web & Experiencia Digital',
    description:
      'Tu sitio es más que una página, es un universo visual y funcional. Diseñamos espacios digitales que cautivan y comunican tu esencia.',
  },
  {
    title: 'Desarrollo Web: eCommerce & Soluciones Personalizadas',
    description:
      'Desde tiendas online hasta plataformas únicas, construimos experiencias digitales que no solo se ven bien, sino que funcionan a la perfección.',
  },
]

export default function Services() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const IconRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.to(IconRef.current, {
      rotation: 360,
      duration: 4,
      repeat: -1,
      ease: 'linear',
    })
  })

  useGSAP(
    () => {
      const letters =
        headingRef.current && headingRef.current.querySelectorAll('span')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: '-20% center',
          end: '80% center',
          scrub: true,
          markers: false,
        },
      })
      tl.from(headingRef.current, { opacity: 0 }, 'a')
      tl.from(letters, { x: -100, opacity: 0, stagger: 0.1 }, 'a')
      tl.from('.services-wrap-item', { y: 100, opacity: 0, stagger: 0.25 })
      tl.from(IconRef.current, { scale: 0, opacity: 0 }, 'a')
      tl.from(
        '.services-wrap-item:first-child',
        {
          borderRightColor: 'transparent',
          borderBottomColor: 'transparent',
          delay: 1.5,
        },
        'a'
      )
      tl.from(
        '.services-wrap-item:last-child',
        { borderTopColor: 'transparent', delay: 2 },
        'a'
      )
    },
    { scope: containerRef }
  )

  return (
    <div id='services' ref={containerRef} className='services'>
      <div className='px-8'>
        <div className='grid grid-rows-1 gap-10'>
          <div ref={headingRef} className='grid grid-cols-4 gap-4'>
            <div className='col-span-3 services-title'>
              <h2>
                {'Creación'.split('').map((letter, index) => (
                  <span key={index} style={{ display: 'inline-block' }}>
                    {letter}
                  </span>
                ))}
              </h2>
            </div>
            <div className='flex items-center justify-center'>
              <i ref={IconRef} className='icon icon-star-solid' />
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 services-wrap'>
            {servicesItems.map((service, index) => (
              <div
                key={index}
                className={`
                  ${
                    index === servicesItems.length - 1 ? 'md:col-span-2' : ''
                  } services-wrap-item space-y-4`}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
