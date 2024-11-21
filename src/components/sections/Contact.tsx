'use client'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

export default function Contact() {
  gsap.registerPlugin(useGSAP, ScrollTrigger)
  const containerRef = useRef<HTMLDivElement>(null)
  const letsTalk = ['H', 'A', 'B', 'L', 'A', 'M', 'O', 'S', '?']

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          markers: false,
          start: '40% 50%',
          pin: true,
          end: '+=800',
          scrub: true,
        },
      })

      tl.fromTo(
        '.orbit-letter',
        { y: -300 },
        {
          y: 0,
          duration: 2.5,
          ease: 'bounce.out',
          stagger: 0.2,
        }
      )
      tl.from(['.form-group', '.form-submit'], { opacity: 0, stagger: 0.2 })
    },
    { scope: containerRef }
  )
  return (
    <div className='space-y-8' data-bg='light'>
      <div className='let-talk p-10'>
        <div ref={containerRef} className='container mx-auto space-y-8'>
          <div className='text-center flex items-center justify-center space-x-4'>
            {letsTalk.map((letter, key) => (
              <div key={key} className='orbit-letter'>
                <span className='letter'>{letter}</span>
              </div>
            ))}
          </div>

          <div className='contact'>
            <div className='container mx-auto px-8'>
              <div className='container mx-auto px-8'>
                <div className='form-group'>
                  <input
                    type='text'
                    id='name'
                    className='form-input'
                    required
                  />
                  <label htmlFor='name' className='form-label'>
                    Nombre:
                  </label>
                </div>

                <div className='form-group'>
                  <input
                    type='mail'
                    id='mail'
                    className='form-input'
                    required
                  />
                  <label htmlFor='mail' className='form-label'>
                    E-mail:
                  </label>
                </div>

                <div className='form-group'>
                  <input
                    type='text'
                    id='subject'
                    className='form-input'
                    required
                  />
                  <label htmlFor='subject' className='form-label'>
                    Asunto:
                  </label>
                </div>

                <div className='form-group'>
                  <textarea id='message' className='form-text-area' required />
                  <label htmlFor='message' className='form-label'>
                    Mensaje:
                  </label>
                </div>

                <div className='form-submit'>
                  <button type='submit'>Enviar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
