import React, { useState, useRef, useEffect } from 'react'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslations } from '../../utils/i18n'
import ProjectSwiper from '../../components/swiper/project-swiper/ProjectSwiper'
import { IconDeviceLaptop, IconDeviceMobile } from '@tabler/icons-react'

import styles from './projects.module.css'
import { useGSAP } from '@gsap/react'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

type Locale = 'es' | 'en'
type ProjectosProps = { locale: Locale }

export default function Projectos({ locale }: ProjectosProps) {
  const t = useTranslations(locale)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  const [activeFilter, setActiveFilter] = useState<string>('web')
  const [sliderStyle, setSliderStyle] = useState<React.CSSProperties>({})

  useGSAP(() => {
    if (!containerRef.current) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: '-70% center',
        end: 'center center',
        scrub: true,
        markers: false,
      },
    })

    tl.from('#projects-filter', { opacity: 0 })
      .from(
        ['#projects-title', '#projects-content'],
        { y: 100, opacity: 0, stagger: 0.3 },
        'a'
      )
      .from('#projects-swiper', { opacity: 0 }, '-=0.75')

    // Cleanup ScrollTrigger instances on unmount to avoid memory leaks
    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  })

  useEffect(() => {
    const activeBtn = filterRef.current?.querySelector<HTMLButtonElement>(
      '[aria-pressed="true"]'
    )
    if (activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn
      setSliderStyle({
        transform: `translateX(${offsetLeft}px)`,
        width: `${offsetWidth}px`,
      })
    }
  }, [activeFilter])

  return (
    <section
      id='projects'
      ref={containerRef}
      className='projects py-16 flex flex-col gap-24 bg-grayLight'
      aria-labelledby='projects-title'>
      <div className='grid grid-rows-1 gap-10'>
        {/* Filtro */}
        <nav
          id='projects-filter'
          className={styles.projectsFilter}
          ref={filterRef}
          aria-label='Project type filter'>
          <span
            className={styles.projectsFilterSlider}
            style={sliderStyle}
            aria-hidden='true'></span>

          <button
            className={`${activeFilter === 'web' ? styles.isActive : ''} ${styles.filterButton}`}
            onClick={() => setActiveFilter('web')}
            aria-pressed={activeFilter === 'web'}
            aria-label='Show web projects'>
            <IconDeviceLaptop size={40} />
          </button>

          <button
            className={`${activeFilter === 'mobile' ? styles.isActive : ''} ${styles.filterButton}`}
            onClick={() => setActiveFilter('mobile')}
            aria-pressed={activeFilter === 'mobile'}
            aria-label='Show mobile projects'>
            <IconDeviceMobile size={40} />
          </button>
        </nav>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='px-8 lg:px-16 flex flex-col items-center justify-center order-2 lg:order-1'>
            <h2
              id='projects-title'
              className='text-accent text-4xl lg:text-5xl leading-none relative text-left uppercase mb-8'>
              {t('Projects.title')}
            </h2>
            <div
              id='projects-content'
              className='text-white text-lg lg:text-2xl leading-8 md:leading-9 lg:leading-10 gap-2'>
              <p className='whitespace-pre-line'>{t('Projects.content')}</p>
            </div>
          </div>

          {/* Swiper con videos */}
          <ProjectSwiper activeFilter={activeFilter} locale={locale} />
        </div>
      </div>
    </section>
  )
}
