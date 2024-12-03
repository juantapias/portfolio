import { useRef } from 'react'
import Image, { StaticImageData } from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import WebCustom from '@images/web-custom.webp'
import WebEcommerce from '@images/e-commerce.webp'
import WebDesign from '@images/web-design.webp'
import WebManaged from '@images/web-self-managed.webp'

type IServices = {
  image: StaticImageData
  title: string
  description: string
}

const servicesItems: IServices[] = [
  {
    image: WebCustom,
    title: 'Desarrollo personalizado',
    description:
      'Creamos sitios únicos y alineados con la identidad de tu marca, pensados para atraer clientes y aumentar el reconocimiento en el mercado.',
  },
  {
    image: WebEcommerce,
    title: 'E-Commerce',
    description:
      'Diseñamos tiendas online que optimizan la experiencia del usuario y están orientadas a maximizar tus ventas con soluciones escalables.',
  },
  {
    image: WebManaged,
    title: 'Desarrollo autogestionable',
    description:
      'Implementamos plataformas fáciles de gestionar, que permiten a tu equipo mantener y actualizar contenidos sin complicaciones técnicas.',
  },
  {
    image: WebDesign,
    title: 'Diseño web',
    description:
      'Creamos interfaces modernas y atractivas que ofrecen una experiencia de usuario optimizada en cualquier dispositivo, mejorando el impacto visual.',
  },
]

export default function Services() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const containerRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const paragraphRef = useRef<HTMLParagraphElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          markers: false,
          start: '40% 50%',
          pin: true,
          end: '+=1200',
          scrub: true,
        },
      })

      tl.from(headingRef.current, { y: -20, opacity: 0 }, 'a')
      tl.from('.services-descrip', { y: 20, opacity: 0, stagger: 0.2 }, 'a')
      tl.from('.card', { x: 300, opacity: 0, stagger: 0.5 })
      tl.from(paragraphRef.current, { scale: 2, opacity: 0 })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} id='services' className='services'>
      <div className='container mx-auto px-8'>
        <div className='grid grid-rows-1 gap-10'>
          <div className='grid grid-cols-1 gap-4'>
            <h2 ref={headingRef}>Diseño y desarrollo web hecho a la medida</h2>

            <p className='services-descrip'>
              Cada proyecto tiene su propia esencia y mi misión es resaltarla.
              Aquí tienes lo que puedo hacer por ti:
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
            {servicesItems.map((service, key) => (
              <div key={key} ref={cardRef} className='card space-y-4'>
                <figure className='flex justify-center'>
                  <Image
                    src={service.image}
                    alt={service.title}
                    height={224}
                    width={224}
                  />
                </figure>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>

          <div className='grid grid-cols-1 gap-4'>
            <p ref={paragraphRef}>
              <strong>
                Ya sea que necesites una página desde cero o renovar tu
                presencia digital, trabajemos juntos para lograrlo.
              </strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
