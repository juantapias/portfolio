'use client'

import { useRef, ReactNode, useEffect, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

type PageTransitionProps = {
  children: ReactNode
}

const PageTransition = ({ children }: PageTransitionProps) => {
  const router = useRouter()
  const transitionRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const handleRouteChange = useCallback(
    (url: string) => {
      if (!transitionRef.current) {
        console.error('transitionRef no está asignado')
        return
      }

      gsap.to(transitionRef.current.children, {
        opacity: 0,
        stagger: 0.25,
        duration: 1,
        delay: 2.5,
        onComplete: () => {
          router.push(url)
        },
      })
    },
    [router]
  )

  useGSAP(() => {
    const handleRouteComplete = () => {
      if (!transitionRef.current) {
        console.error('transitionRef no está asignado')
        return
      }

      console.log('Animación de entrada iniciada')
      // Animación de entrada
      gsap.from(transitionRef.current.children, {
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
      })
    }

    // Ejecutar animación de entrada al montar el componente
    handleRouteComplete()
  }, [router])

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.currentTarget as HTMLAnchorElement
      const href = target.getAttribute('href')

      if (href && href !== pathname) {
        event.preventDefault() // Evitar la navegación inmediata
        handleRouteChange(href) // Ejecutar animación de salida antes de navegar
      }
    }

    // Agregar listeners a todos los enlaces
    const anchors = document.querySelectorAll('a')
    anchors.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick)
    })

    // Limpiar listeners al desmontar el componente
    return () => {
      anchors.forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick)
      })
    }
  }, [pathname, handleRouteChange]) // Añadir handleRouteChange como dependencia

  return <div ref={transitionRef}>{children}</div>
}

export default PageTransition
