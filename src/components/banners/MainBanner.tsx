'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

export default function MainBanner() {
  gsap.registerPlugin(ScrollTrigger)

  const banner = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const title = useRef<HTMLHeadingElement>(null)
  const description = useRef<HTMLParagraphElement>(null)
  const letters = useRef<HTMLSpanElement[]>([])

  useGSAP(() => {
    const tlContent = gsap.timeline()

    tlContent.fromTo(
      wrap.current,
      { scale: 0 },
      {
        borderRadius: '2rem',
        height: '80%',
        width: '90%',
        scale: 1,
        opacity: 1,
      }
    )

    letters.current?.forEach((letter, index) => {
      tlContent.from(
        letter,
        {
          opacity: 0,
          delay: 0.5 + index * 0.2,
        },
        'a'
      )
    })
    tlContent.from(description.current, { opacity: 0 })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: banner.current,
        markers: false,
        start: '55% 50%',
        pin: true,
        end: '+=500',
        scrub: true,
      },
    })

    tl.to([description.current, title.current], {
      opacity: 0,
      delay: 0.5,
      stagger: 0.5,
    })
      .fromTo(
        wrap.current,
        {
          height: '80%',
          width: '90%',
        },
        {
          scale: 0,
          scrub: true,
          opacity: 0,
        }
      )
      .fromTo(wrap.current, { opacity: 1 }, { opacity: 0 })
  })

  return (
    <div ref={banner} className='main-banner space-y-4'>
      <div ref={wrap} className='banner-container'>
        <h1 ref={title}>
          {['J', 'u', 'a', 'n', 'T', 'a', 'p', 'i', 'a', 's'].map((char, i) => (
            <span
              key={i}
              ref={el => {
                if (el) letters.current[i] = el
              }}
              className='letter'>
              {char}
            </span>
          ))}
        </h1>
        <p ref={description}>Creative Developer</p>
      </div>
    </div>
  )
}
