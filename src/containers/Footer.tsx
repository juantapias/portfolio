import Link from 'next/link'

export default function Footer() {
  return (
    <div className='footer border-t-px border-t-secondary'>
      <div className='mx-auto px-8'>
        <div className='grid grid-rows-1'>
          <div className='grid grid-cols-1 md:grid-cols-2 py-2'>
            <div
              className='flex items-center justify-center md:justify-start space-x-2 order-2 md:order-none
'>
              <Link href={'/'} className='font-primary uppercase'>
                Tapias
              </Link>
              <span className='text-xs'>©{new Date().getFullYear()}</span>
            </div>
            <div className='flex items-center justify-center md:justify-end space-x-5'>
              <Link
                href={'https://www.instagram.com/tapias.dev/'}
                className='footer-link'
                target='_blank'>
                Instagram
              </Link>
              <Link
                href={'https://github.com/juantapias'}
                className='footer-link'
                target='_blank'>
                GitHub
              </Link>
              <a
                href={'mailto:dev.juantapias@gmail.com'}
                className='footer-link'>
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
