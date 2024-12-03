'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Header() {
  const container = useRef<HTMLDivElement>(null)
  const [navOpen, setNavOpen] = useState<boolean>(false)
  const [isDarkBackground, setIsDarkBackground] = useState<boolean>(true)

  const { contextSafe } = useGSAP({ scope: container })

  const toggleMenu = contextSafe((callback?: () => void) => {
    const tl = gsap.timeline({
      onComplete: callback,
    })

    if (navOpen) {
      tl.to('li', {
        opacity: 0,
        stagger: 0.2,
        y: -20,
        duration: 0.5,
      }).to('.nav-list', {
        x: 1000,
        duration: 0.5,
      })
    } else {
      tl.to('.nav-list', { x: 0, duration: 0.5 }, 'start').fromTo(
        'li',
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          stagger: 0.2,
          duration: 0.5,
        },
        'start+=0.5'
      )
    }

    setNavOpen(!navOpen)
  })

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)

    if (sectionId === 'home') {
      toggleMenu(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
      })
    } else if (section) {
      toggleMenu(() => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-bg]')
      let darkBackground = true

      sections.forEach(section => {
        const rect = section.getBoundingClientRect()
        if (
          rect.top <= window.innerHeight / 2 &&
          rect.bottom >= window.innerHeight / 2
        ) {
          darkBackground = section.getAttribute('data-bg') === 'dark'
        }
      })

      setIsDarkBackground(darkBackground)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div ref={container} className='header'>
      <button
        onClick={() => toggleMenu()}
        className={`btn-nav ${isDarkBackground ? 'btn-light' : 'btn-dark'}`}>
        {navOpen ? 'Cerrar' : 'Menú'}
      </button>

      <div className='nav-list'>
        <nav className='nav-items'>
          <ul className='space-y-4'>
            <li className='nav-item'>
              <button onClick={() => scrollToSection('home')}>Inicio</button>
            </li>
            <li className='nav-item'>
              <button onClick={() => scrollToSection('about')}>Acerca</button>
            </li>
            <li className='nav-item'>
              <button onClick={() => scrollToSection('services')}>
                Servicios
              </button>
            </li>
            <li className='nav-item'>
              <button onClick={() => scrollToSection('contact')}>
                Contacto
              </button>
            </li>
          </ul>
        </nav>

        <div>
          <ul className='flex items-center justify-center space-x-4'>
            <li>
              <Link
                href={'https://github.com/juantapias'}
                className='text-center transition-all duration-150 ease-in-out hover:text-[#CCCCCC]'
                target='_blank'>
                <i className='icon icon-github text-3xl' />
              </Link>
            </li>
            <li>
              <Link
                href={'https://www.instagram.com/tapias.dev/'}
                className='text-center transition-all duration-150 ease-in-out hover:text-[#CCCCCC]'
                target='_blank'>
                <i className='icon icon-instagram text-3xl' />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
