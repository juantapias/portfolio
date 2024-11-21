'use client'

import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export default function Header() {
  const container = useRef<HTMLDivElement>(null)

  const [navOpen, setNavOpen] = useState<boolean>(false)
  const [isDarkBackground, setIsDarkBackground] = useState<boolean>(true)

  const { contextSafe } = useGSAP({ scope: container })

  const onClickMenu = contextSafe(() => {
    const tl = gsap.timeline()

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
    handleScroll() // Run on mount

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div ref={container} className='header'>
      <button
        onClick={onClickMenu}
        className={`btn-nav ${isDarkBackground ? 'btn-light' : 'btn-dark'}`}>
        {navOpen ? 'Cerrar' : 'Menú'}
      </button>

      <div className='nav-list'>
        <nav className='nav-items'>
          <ul className='space-y-4'>
            <li className='nav-item'>Home</li>
            <li className='nav-item'>About</li>
            <li className='nav-item'>Work</li>
            <li className='nav-item'>Contact</li>
          </ul>
        </nav>

        <div>
          <ul className='flex items-center justify-center space-x-4'>
            <li>G</li>
            <li>I</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
