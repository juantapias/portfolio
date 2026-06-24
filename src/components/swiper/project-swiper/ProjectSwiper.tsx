import { useEffect, useRef } from 'react'

import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperType } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/navigation'

import { uiDesktop, uiMobile } from '../../../data/technologies'

import styles from './project-swipper.module.css'
import {
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
} from '@tabler/icons-react'

type UIItem = {
  label: string
  url: string
  type: 'video' | 'image'
  link?: string
  slug: string
}

export default function ProjectSwiper({
  activeFilter,
  locale,
}: {
  activeFilter: string
  locale: string
}) {
  const swiperRef = useRef<SwiperType | null>(null)
  const prevRef = useRef<HTMLButtonElement | null>(null)
  const nextRef = useRef<HTMLButtonElement | null>(null)

  const handleVideoPlayback = (swiper: SwiperType) => {
    swiper.slides?.forEach((slide: HTMLElement, index: number) => {
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
    <div
      id='projects-swiper'
      className={`${styles.projectsSwiper} order-1 lg:order-2`}>
      {(activeFilter === 'mobile'
        ? (uiMobile as UIItem[])
        : (uiDesktop as UIItem[])
      ).length === 1 ? (
        <div className='flex justify-center'>
          <video
            src={
              (activeFilter === 'mobile'
                ? (uiMobile as UIItem[])
                : (uiDesktop as UIItem[]))[0].url
            }
            loop
            muted
            autoPlay
            playsInline
            className='rounded-md'
            height={200}
            width={activeFilter === 'mobile' ? 250 : 750}
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
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 20 },
            640: { slidesPerView: 1.5, spaceBetween: 30 },
            768: { slidesPerView: 2, spaceBetween: 40 },
            1024: { slidesPerView: 1.5, spaceBetween: 50 },
          }}
          modules={[Navigation]}
          className={`${styles.projectsSwiperContainer} py-4 w-full`}
          aria-label='Projects showcase carousel'
          onBeforeInit={swiper => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation !== 'boolean'
            ) {
              swiper.params.navigation.prevEl = prevRef.current
              swiper.params.navigation.nextEl = nextRef.current
            }
          }}
          navigation>
          {activeFilter === 'mobile'
            ? (uiMobile as UIItem[]).map((item, index) => (
                <SwiperSlide key={index}>
                  <figure
                    className={styles.projectsSwiperFigureMobile}
                    role='group'
                    aria-label={`Mobile project: ${item.label}`}>
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.label} />
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
            : (uiDesktop as UIItem[]).map((item, index) => (
                <SwiperSlide key={index}>
                  <figure
                    className={`${styles.projectsSwiperFigureWeb} w-full`}
                    role='group'
                    aria-label={`Desktop project: ${item.label}`}>
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.label} />
                    ) : (
                      <video
                        src={item.url}
                        loop
                        muted
                        playsInline
                        height={400}
                        width={600}
                        className='rounded-md'
                      />
                    )}

                    <div className='p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                      <h3 className='text-accent text-sm font-semibold truncate'>{item.label}</h3>

                      <div className='flex items-center gap-2'>
                        <a
                          href={`${locale}/projects/${item.slug}`}
                          className='btn outline small flex-1 sm:flex-none text-center'>
                          Ver más
                        </a>
                        <a
                          href={item.link}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='btn default small flex items-center justify-center gap-1 flex-1 sm:flex-none'>
                          <span>Proyecto</span>
                          <IconExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </figure>
                </SwiperSlide>
              ))}
          <div className={`${styles.swiperNav} text-white text-4xl`}>
            <button ref={prevRef} className={styles.customPrev}>
              <IconChevronLeft />
            </button>
            <button ref={nextRef} className={styles.customNext}>
              <IconChevronRight />
            </button>
          </div>
        </Swiper>
      )}
    </div>
  )
}
