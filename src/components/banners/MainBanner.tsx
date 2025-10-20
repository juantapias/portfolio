'use client'

import { useGSAP } from '@gsap/react'
import { useRef } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function MainBanner() {
  const t = useTranslations('Hero')

  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const bannerRef = useRef<HTMLDivElement>(null)
  const bannerTitleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(
    () => {
      if (!bannerRef.current) return

      // animate title letters
      if (bannerTitleRef.current) {
        const letters = bannerTitleRef.current.querySelectorAll('span')
        gsap.from(letters, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.25,
          ease: 'power2.out',
        })
      }

      // animate subtitle
      gsap.from(bannerRef.current.querySelectorAll('h2'), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.25,
        ease: 'power2.out',
        delay: 0.5,
      })

      // animate buttons
      gsap.from(
        [bannerRef.current.querySelectorAll('button'), '.btn-contact-me'],
        {
          opacity: 0,
          y: 20,
          duration: 0.6,
          stagger: 0.25,
          ease: 'power2.out',
          delay: 1,
        }
      )
    },
    { scope: bannerRef }
  )

  useGSAP(
    () => {
      if (!bannerRef.current) return

      const letters = bannerTitleRef.current?.querySelectorAll('span')
      const h2s = bannerRef.current.querySelectorAll('h2')
      const buttons = bannerRef.current.querySelectorAll(
        'button, .btn-contact-me'
      )

      const mm = gsap.matchMedia()

      // Desktop
      mm.add('(min-width: 769px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bannerRef.current,
            start: '60% center',
            end: '130% center',
            scrub: true,
            markers: false,
          },
        })
        tl.to(letters || [], {
          opacity: 0,
          y: -200,
          duration: 0.5,
          stagger: 0.25,
          ease: 'power2.out',
        })
          .to(h2s, {
            opacity: 0,
            y: -200,
            duration: 0.5,
            stagger: 0.25,
            ease: 'power2.out',
          })
          .to(buttons, {
            opacity: 0,
            y: -200,
            duration: 0.5,
            stagger: 0.25,
            ease: 'power2.out',
          })
      })

      // Mobile
      mm.add('(max-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: bannerRef.current,
            start: 'center center',
            end: '120% center',
            scrub: true,
            markers: false,
          },
        })
        tl.to(letters || [], {
          opacity: 0,
          y: -100,
          duration: 0.5,
          stagger: 0.2,
          ease: 'power2.out',
        })
          .to(h2s, {
            opacity: 0,
            y: -100,
            duration: 0.5,
            stagger: 0.2,
            ease: 'power2.out',
          })
          .to(buttons, {
            opacity: 0,
            y: -100,
            duration: 0.5,
            stagger: 0.2,
            ease: 'power2.out',
          })
      })
    },
    { scope: bannerRef }
  )

  const scrollToWork = () => {
    const workSection = document.getElementById('works')
    if (workSection) {
      workSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id='banner'
      ref={bannerRef}
      className='main-banner px-8 bg-cover'
      aria-labelledby='main-banner-title'>
      <h1 id='main-banner-title' ref={bannerTitleRef}>
        {'Tapias'.split('').map((letter, index) => (
          <span
            key={index}
            className={index >= 1 && index <= 4 ? 'outline' : ''}>
            {letter}
          </span>
        ))}
      </h1>

      <div className='main-banner-content'>
        <div className='main-banner-content-text'>
          <h2>{t('subtitle')}</h2>
        </div>
        <div className='main-banner-content-buttons'>
          <button
            className='btn is-primary btn-view-work'
            onClick={scrollToWork}
            aria-label='Scroll to works section'>
            {t('btnCTA')}
          </button>
          <Link
            href='https://wa.link/63go9c'
            target='_blank'
            rel='noopener noreferrer'
            className='btn is-primary is-outline btn-contact-me'
            aria-label='Contact me via WhatsApp'>
            {t('btnContact')}
          </Link>
        </div>
      </div>
    </section>
  )
}
