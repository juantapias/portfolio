'use client'

import { uiDesktop, uiMobile } from '@/data/technologies'
import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Swiper as SwiperType } from 'swiper/types'
import { useTranslations } from 'next-intl'

export default function Projects() {
  const t = useTranslations('Projects')

  const containerRef = useRef<HTMLDivElement | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const swiperRef = useRef<SwiperType | null>(null)

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

    tl.from('.projects-filter', { opacity: 0 })
      .from(
        ['.projects-title', '.projects-content'],
        { y: 100, opacity: 0, stagger: 0.3 },
        'a'
      )
      .from('.projects-swiper', { opacity: 0 }, '-=0.75')
  })

  useEffect(() => {
    const activeBtn =
      filterRef.current?.querySelector<HTMLButtonElement>('.is-active')
    if (activeBtn) {
      const { offsetLeft, offsetWidth } = activeBtn
      setSliderStyle({
        transform: `translateX(${offsetLeft}px)`,
        width: `${offsetWidth}px`,
      })
    }
  }, [activeFilter])

  const handleVideoPlayback = (swiper: SwiperType) => {
    swiper.slides.forEach((slide: HTMLElement, index: number) => {
      const video = slide.querySelector('video') as HTMLVideoElement
      if (!video) return

      if (index === swiper.realIndex) {
        video.play().catch(() => {})
      } else {
        video.pause()
      }
    })
  }

  useEffect(() => {
    if (swiperRef.current) {
      const timer = setTimeout(() => {
        handleVideoPlayback(swiperRef.current as SwiperType)
      }, 150)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter])

  return (
    <section
      id='projects'
      ref={containerRef}
      className='projects'
      aria-labelledby='projects-title'>
      <div className='grid grid-rows-1 gap-10'>
        {/* Filtro */}
        <nav
          className='projects-filter'
          ref={filterRef}
          aria-label='Project type filter'>
          <span
            className='projects-filter__slider'
            style={sliderStyle}
            aria-hidden='true'></span>

          <button
            className={activeFilter === 'web' ? 'is-active' : ''}
            onClick={() => setActiveFilter('web')}
            aria-pressed={activeFilter === 'web'}
            aria-label='Show web projects'>
            <i className='icon icon-laptop text-4xl' aria-hidden='true' />
          </button>

          <button
            className={activeFilter === 'mobile' ? 'is-active' : ''}
            onClick={() => setActiveFilter('mobile')}
            aria-pressed={activeFilter === 'mobile'}
            aria-label='Show mobile projects'>
            <i className='icon icon-phone text-4xl' aria-hidden='true' />
          </button>
        </nav>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          <div className='px-16 flex flex-col items-center justify-center order-2 lg:order-1'>
            <h2 id='projects-title' className='projects-title'>
              {t('title')}
            </h2>
            <div className='projects-content gap-2'>
              <p className='whitespace-pre-line'>{t('content')}</p>
            </div>
          </div>

          {/* Swiper con videos */}
          <div className='projects-swiper order-1 lg:order-2 md:h-[500px]'>
            {(activeFilter === 'mobile' ? uiMobile : uiDesktop).length === 1 ? (
              <div className='flex justify-center'>
                <video
                  src={
                    (activeFilter === 'mobile' ? uiMobile : uiDesktop)[0].url
                  }
                  loop
                  muted
                  autoPlay
                  playsInline
                  className='rounded-md'
                  height={200}
                  width={activeFilter === 'mobile' ? 250 : 650}
                />
              </div>
            ) : (
              <Swiper
                onSwiper={swiper => {
                  swiperRef.current = swiper
                }}
                onSlideChange={swiper => handleVideoPlayback(swiper)}
                spaceBetween={50}
                slidesPerView={activeFilter === 'mobile' ? 1 : 1}
                centeredSlides={true}
                // breakpoints={{
                //   320: { slidesPerView: 1.2, spaceBetween: 20 },
                //   640: { slidesPerView: 1.5, spaceBetween: 30 },
                //   768: { slidesPerView: 2, spaceBetween: 40 },
                //   1024: { slidesPerView: 2.5, spaceBetween: 50 },
                // }}
                modules={[Navigation]}
                className='projects-swiper-container py-4'
                aria-label='Projects showcase carousel'
                navigation={{
                  nextEl: '.custom-next',
                  prevEl: '.custom-prev',
                }}>
                {activeFilter === 'mobile'
                  ? uiMobile.map((item, index) => (
                      <SwiperSlide key={index}>
                        <figure
                          className='projects-swiper-figure-mobile'
                          role='group'
                          aria-label={`Mobile project: ${item.label}`}>
                          {item.type === 'image' ? (
                            <Image
                              src={item.url}
                              alt={item.label}
                              fill
                              sizes='(max-width: 768px) 100vw, 50vw'
                            />
                          ) : (
                            <video
                              src={item.url}
                              loop
                              muted
                              playsInline
                              height={200}
                              width={250}
                              className='rounded-md'
                            />
                          )}
                        </figure>
                      </SwiperSlide>
                    ))
                  : uiDesktop.map((item, index) => (
                      <SwiperSlide key={index}>
                        <figure
                          className='projects-swiper-figure-desktop'
                          role='group'
                          aria-label={`Desktop project: ${item.label}`}>
                          {item.type === 'image' ? (
                            <Image
                              src={item.url}
                              alt={item.label}
                              fill
                              sizes='(max-width: 768px) 100vw, 50vw'
                            />
                          ) : (
                            <video
                              src={item.url}
                              loop
                              muted
                              playsInline
                              height={200}
                              width={600}
                              className='rounded-md'
                            />
                          )}
                        </figure>
                      </SwiperSlide>
                    ))}
                <div className='swiper-nav text-white text-4xl'>
                  <button className='custom-prev'>
                    <i className='icon icon-chevron-left' />
                  </button>
                  <button className='custom-next'>
                    <i className='icon icon-chevron-right' />
                  </button>
                </div>
              </Swiper>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
