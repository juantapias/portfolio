'use client'

import { socials } from '@/data/technologies'
import Link from 'next/link'

import { useTranslations } from 'next-intl'

export default function Footer() {
  const t = useTranslations('Footer')
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer id='footer' className='footer'>
      <section className='grid grid-row-1 px-16 p-12 z-10'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          <article className='flex flex-col gap-2'>
            <h2 className='text-2xl lg:text-4xl font-light'>{t('social')}</h2>
            <nav className='flex gap-4' aria-label='Social media links'>
              {socials.map(item => (
                <Link
                  key={item.label}
                  href={item.url || ''}
                  className='text-white text-4xl hover:text-primary'>
                  <i className={`icon ${item.icon}`} />
                </Link>
              ))}
            </nav>
          </article>

          <aside className='flex flex-col lg:flex-row items-end lg:items-center justify-end gap-4 lg:gap-8'>
            <Link
              href='mailto:dev.juantapias@gmail.com'
              className='btn is-primary is-outline btn-contact-me flex items-center gap-4'>
              <span>dev.juantapias@gmail.com</span>
              <i className='icon icon-arrow-right-up' />
            </Link>

            <Link
              href='https://wa.link/63go9c'
              target='_blank'
              rel='noopener noreferrer'
              className='btn is-primary is-outline btn-contact-me flex items-center'>
              <i className='icon icon-whatsapp' />
            </Link>
          </aside>
        </div>
      </section>

      <div className='flex justify-end pr-8'>
        <button className='uppercase text-xs' onClick={scrollToTop}>
          {t('backToTop')}
        </button>
      </div>

      <div className='footer-copy'>
        <Link href='/' className='flex items-center gap-2 text-white'>
          Tapias © {new Date().getFullYear()}
        </Link>
      </div>
    </footer>
  )
}
