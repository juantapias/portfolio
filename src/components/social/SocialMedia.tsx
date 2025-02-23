import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const socials = [
  {
    icon: 'icon-linkedin',
    link: 'https://www.linkedin.com/in/juan-carlos-tapias-flores/',
  },
  { icon: 'icon-instagram', link: 'https://www.instagram.com/tapias.dev/' },
  { icon: 'icon-tiktok', link: 'https://www.tiktok.com/@tapias.dev' },
  { icon: 'icon-github', link: 'https://github.com/juantapias' },
]

export default function SocialMedia() {
  gsap.registerPlugin(ScrollTrigger)
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const socialsRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          markers: false,
          start: '-100% center',
          end: '-40% center',
          scrub: true,
        },
      })

      tl.from(titleRef.current, {
        y: 100,
        opacity: 0,
        stagger: 0.25,
      })
    },
    { scope: containerRef }
  )

  return (
    <div ref={containerRef} className='social pb-8'>
      <div className='grid grid-cols-1 gap-8'>
        <h2 ref={titleRef} className='text-center'>
          Inspírate, comparte, únete
        </h2>
        <div
          ref={socialsRef}
          className='flex items-center justify-center space-x-4'>
          {socials.map((social, index) => (
            <a
              key={index}
              href={social.link}
              target='_blank'
              className='social-badge'>
              <i className={`icon ${social.icon}`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
