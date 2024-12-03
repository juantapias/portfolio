'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Bubble from '../figures/Bubble'

export default function MainBanner() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)

  const bannerRef = useRef<HTMLDivElement>(null)

  const bubbleBigRef = useRef<HTMLDivElement>(null)
  const bubbleSmallRef = useRef<HTMLDivElement>(null)

  const titleRef = useRef<HTMLHeadingElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)

  const title = ['J', 'u', 'a', 'n', 'T', 'a', 'p', 'i', 'a', 's']

  useGSAP(() => {
    gsap.to(bubbleBigRef.current, {
      y: -20,
      duration: 12,
      repeat: -1,
      yoyoEase: 'back.out(1.7)',
      rotate: 360,
    })
    gsap.to(bubbleSmallRef.current, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyoEase: 'back.out(1.7)',
    })
  })

  useGSAP(() => {
    const contentTL = gsap.timeline()

    contentTL.from(bubbleBigRef.current, { opacity: 0 })
    contentTL.from(bubbleSmallRef.current, { opacity: 0 })
    contentTL
      .from(
        '.letter',
        {
          opacity: 0,
          stagger: 0.2,
        },
        'a'
      )
      .fromTo(
        descriptionRef.current,
        { color: '#222222' },
        { color: '#bbbbbb' },
        '<1'
      )
  })

  useGSAP(
    () => {
      const bannerTL = gsap.timeline({
        scrollTrigger: {
          trigger: bannerRef.current,
          start: '50% 50%',
          pin: true,
          end: '+=1500',
          scrub: true,
        },
      })
      bannerTL.to(titleRef.current, { y: -200, opacity: 0 })
      bannerTL.fromTo(descriptionRef.current, { opacity: 1 }, { opacity: 0 })
      bannerTL.to(bubbleSmallRef.current, {
        top: '-10%',
        x: window.innerWidth + 500,
      })
      bannerTL.to(
        bubbleBigRef.current,
        {
          top: '120%',
          width: '30%',
          x: window.innerWidth + 500,
          opacity: 0,
        },
        '<2'
      )
    },
    { scope: bannerRef }
  )

  return (
    <div id='home' ref={bannerRef} className='main-banner' data-bg='dark'>
      <Bubble ref={bubbleBigRef} top={0} width='50%' left={-40} />
      <Bubble
        ref={bubbleSmallRef}
        bottom={5}
        height='100px'
        width='100px'
        left={5}
      />
      <div>
        <h1 ref={titleRef}>
          {title.map((char, i) => (
            <span key={i} className='letter'>
              {char}
            </span>
          ))}
        </h1>
        <div ref={descriptionRef} className='description'>
          Desarrollo Creativo
        </div>
      </div>
    </div>
  )
}
