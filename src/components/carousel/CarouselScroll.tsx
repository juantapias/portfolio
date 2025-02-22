import { useRef } from 'react'
import { technologies } from '@/data/technologies'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export type ITech = {
  icon: string
  location: string
}

export default function CarouselScroll() {
  const containerRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  // Duplicar los elementos varias veces para asegurar una animación fluida
  const duplicateItems = (items: ITech[], times = 2) =>
    Array(times)
      .fill([...items])
      .flat()

  const infinity = duplicateItems(technologies, 2)

  useGSAP(() => {
    const isDesktop = window.innerWidth >= 768
    const isTablet = window.innerWidth >= 576 && window.innerWidth < 768
    const isMobile = window.innerWidth < 576

    let start, end
    if (isDesktop) {
      start = '-50% center'
      end = '20% center'
    } else if (isTablet) {
      start = '-130% center'
      end = '-55% center'
    } else if (isMobile) {
      start = '-130% center'
      end = '-55% center'
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: start,
        end: end,
        scrub: 1,
        markers: false,
      },
    })

    tl.from(containerRef.current, { opacity: 0, duration: 1 })

    const createScrollAnimation = (
      ref: React.RefObject<HTMLDivElement>,
      direction = 1
    ) => {
      const el = ref.current
      if (!el) return

      gsap.set(el, { x: 0 })

      tl.to(
        el,
        {
          x: (direction * -el.scrollWidth) / 2,
          ease: 'none',
        },
        0
      )
    }

    createScrollAnimation(leftRef, -1)
    createScrollAnimation(rightRef, 1)
  }, [])

  // Renderizado de iconos
  const renderIcons = (items: ITech[], location: string) => {
    return items
      .filter(item => item.location === location)
      .map((tech, index) => (
        <i key={index} className={`icon ${tech.icon}`}>
          {tech.icon === 'icon-figma' && (
            <>
              <span className='path1'></span>
              <span className='path2'></span>
              <span className='path3'></span>
              <span className='path4'></span>
              <span className='path5'></span>
            </>
          )}
        </i>
      ))
  }

  return (
    <div
      ref={containerRef}
      className='carousel-scroll overflow-hidden relative py-8 space-y-8'>
      <div
        className='flex flex-row-reverse space-x-8 whitespace-nowrap'
        ref={leftRef}>
        {renderIcons(infinity, 'left')}
      </div>
      <div className='flex space-x-8 whitespace-nowrap' ref={rightRef}>
        {renderIcons(infinity, 'right')}
      </div>
    </div>
  )
}
