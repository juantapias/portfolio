'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Ads() {
  gsap.registerPlugin(ScrollTrigger)

  const adsRef = useRef<HTMLDivElement>(null)

  const textWrapRef = useRef<HTMLHeadingElement>(null)
  const textRef1 = useRef<HTMLSpanElement>(null)
  const textRef2 = useRef<HTMLSpanElement>(null)
  const textRef3 = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    gsap.set(adsRef.current, { paddingTop: '53px' })
    const adsTL = gsap.timeline({
      scrollTrigger: {
        trigger: adsRef.current,
        markers: false,
        start: '50% 50%',
        pin: true,
        pinSpacing: true,
        end: '+=2000',
        scrub: true,
      },
    })

    adsTL
      .fromTo(textWrapRef.current, { opacity: 0 }, { opacity: 1 })
      .fromTo(textRef1.current, { opacity: 0, x: -200 }, { opacity: 1, x: 0 })
      .fromTo(textRef2.current, { opacity: 0, x: 200 }, { opacity: 1, x: 0 })
      .fromTo(textRef3.current, { opacity: 0, x: -200 }, { opacity: 1, x: 0 })
  })

  return (
    <section ref={adsRef} className='ads px-8' data-bg='light'>
      <div className='ads-container'>
        <h2 ref={textWrapRef} className='space-x-2 flex flex-col'>
          <span ref={textRef1}>Tu sitio web,</span>
          <span ref={textRef2}>tan auténtico</span>
          <span ref={textRef3}>como tu marca</span>
        </h2>
      </div>
    </section>
  )
}
