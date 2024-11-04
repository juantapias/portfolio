'use client'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useRef } from 'react'

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const loadingArr = ['L', 'o', 'a', 'd', 'i', 'n', 'g']

  useGSAP(
    () => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current?.children,
          { opacity: 0 },
          {
            opacity: 1,
            duration: 0.5,
            repeat: -1,
            stagger: 0.2,
            ease: 'power1.inOut',
          }
        )

        gsap.to(loaderRef.current, {
          y: -1000,
          duration: 1,
          ease: 'power2.inOut',
        })
      }
    },
    { scope: loaderRef }
  )

  return (
    <div ref={loaderRef} className='loader'>
      <div ref={textRef} className='text space-x-2'>
        {loadingArr.map((letter, key) => (
          <span key={key}>{letter}</span>
        ))}
        {Array.from(new Array(3)).map((_, key) => (
          <i key={key} className='dot'>
            .
          </i>
        ))}
      </div>
    </div>
  )
}
