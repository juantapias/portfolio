'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Ads() {
  gsap.registerPlugin(ScrollTrigger)

  const adsRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)

  const textWrapRef = useRef<HTMLHeadingElement>(null)
  const textRef1 = useRef<HTMLSpanElement>(null)
  const textRef2 = useRef<HTMLSpanElement>(null)
  const textRef3 = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const adsTL = gsap.timeline({
      scrollTrigger: {
        trigger: adsRef.current,
        markers: false,
        start: '50% 50%',
        pin: true,
        end: '+=2000',
        scrub: true,
      },
    })

    adsTL
      .fromTo(
        circleRef.current,
        { y: '-50%', opacity: 0 },
        {
          backgroundColor: '#EDF2EF',
          opacity: 1,
          y: 50,
        },
        'a'
      )
      .to(
        circleRef.current,
        {
          borderRadius: 0,
          scale: 10,
          y: 0,
          height: '100%',
          width: '100%',
        },
        'a'
      )
      .to(circleRef.current, { scale: 1 })
      .fromTo(textWrapRef.current, { opacity: 0 }, { opacity: 1 })
      .fromTo(textRef1.current, { opacity: 0, x: -200 }, { opacity: 1, x: 0 })
      .fromTo(textRef2.current, { opacity: 0, x: 200 }, { opacity: 1, x: 0 })
      .fromTo(textRef3.current, { opacity: 0, x: -200 }, { opacity: 1, x: 0 })
  })

  return (
    <section ref={adsRef} className='ads' data-bg='light'>
      <div ref={circleRef} className='circle'>
        <h2 ref={textWrapRef} className='space-x-2'>
          <span ref={textRef1}>Tu sitio web,</span>
          <span ref={textRef2}>tan único como</span>
          <span ref={textRef3}>tu negocio</span>
        </h2>
      </div>
    </section>
  )
}
