'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

type IProps = {
  isLoading: boolean
}

export default function Loader({ isLoading }: IProps) {
  gsap.registerPlugin(useGSAP)

  const loaderRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const loadingArr = ['C', 'a', 'r', 'g', 'a', 'n', 'd', 'o']

  useGSAP(
    () => {
      if (isLoading && textRef.current) {
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
          duration: 5,
          ease: 'power2.inOut',
          delay: 3,
        })
      }
    },
    {
      scope: loaderRef,
    }
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
