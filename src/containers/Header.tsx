'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'

export default function Header() {
  const t = useTranslations('Nav')
  const locale = useLocale()
  const pathname = usePathname()

  const headerLink = [
    {
      label: t('home'),
      link: '#banner',
    },
    {
      label: t('works'),
      link: '#works',
    },
    {
      label: t('about'),
      link: '#about',
    },
    {
      label: t('contact'),
      link: '#ads',
    },
  ]

  const [activeSection, setActiveSection] = useState<string>('#banner')
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)

  const switchLocale = (targetLocale: string) => {
    const segments = pathname.split('/')
    segments[1] = targetLocale
    return segments.join('/') || '/'
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      {
        threshold: 0.3, // antes 0.6
        rootMargin: '-10% 0px -10% 0px', // antes -20%
      }
    )

    headerLink.forEach(item => {
      const el = document.querySelector(item.link)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const activeLink = document.querySelector('.navigation-link-active')
    const indicator = document.querySelector(
      '.navigation-indicator'
    ) as HTMLElement | null

    if (activeLink && indicator) {
      const { offsetLeft, offsetWidth } = activeLink as HTMLElement
      gsap.to(indicator, {
        x: offsetLeft,
        width: offsetWidth,
        duration: 0.6,
        ease: 'power3.out',
      })
    }
  }, [activeSection])

  useGSAP(() => {
    gsap.from('.header', {
      y: -100,
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [])

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleMobileLinkClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className='header'>
      {/* Navegación de escritorio */}
      <nav
        className='navigation desktop-navigation'
        aria-label='Main navigation'>
        {headerLink.map((item, index) => (
          <Link
            key={index}
            href={item.link}
            className={`navigation-link ${
              activeSection === item.link
                ? 'navigation-link-active'
                : 'navigation-link-inactive'
            }`}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className='locale-switch'>
        <Link
          href={switchLocale('en')}
          className={`locale-link ${locale === 'en' ? 'active' : ''}`}>
          EN
        </Link>
        <span className='locale-separator'>/</span>
        <Link
          href={switchLocale('es')}
          className={`locale-link ${locale === 'es' ? 'active' : ''}`}>
          ES
        </Link>
      </div>

      {/* Botón de menú móvil */}
      <button
        className='mobile-menu-button'
        onClick={toggleMobileMenu}
        aria-label='Toggle mobile menu'
        aria-expanded={mobileMenuOpen}>
        <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
      </button>

      {/* Navegación móvil */}
      <nav
        className={`mobile-navigation ${mobileMenuOpen ? 'open' : ''}`}
        aria-label='Mobile navigation'>
        <ul className='mobile-navigation-list'>
          {headerLink.map((item, index) => (
            <li key={index} className='mobile-navigation-item'>
              <Link
                href={item.link}
                onClick={handleMobileLinkClick}
                className={`mobile-navigation-link ${
                  activeSection === item.link
                    ? 'mobile-navigation-link-active'
                    : 'mobile-navigation-link-inactive'
                }`}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className='mobile-locale-switch'>
          <Link
            href={switchLocale('en')}
            className={`locale-link ${locale === 'en' ? 'active' : ''}`}
            aria-label='Switch to English'>
            EN
          </Link>
          <span className='locale-separator'>/</span>
          <Link
            href={switchLocale('es')}
            className={`locale-link ${locale === 'es' ? 'active' : ''}`}
            aria-label='Switch to Spanish'>
            ES
          </Link>
        </div>
      </nav>
    </header>
  )
}
