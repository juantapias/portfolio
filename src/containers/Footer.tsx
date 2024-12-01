import Link from 'next/link'

export default function Footer() {
  return (
    <div className='footer'>
      <div className='container mx-auto px-8'>
        <div className='grid grid-rows-1'>
          <div className='grid grid-cols-1 md:grid-cols-3 py-2'>
            <Link
              href={'https://www.instagram.com/tapias.dev/'}
              className='text-center'
              target='_blank'>
              Instagram
            </Link>
            <a href={'mailto:dev.juantapias@gmail.com'} className='text-center'>
              dev.juantapias@gmail.com
            </a>
            <Link
              href={'https://github.com/juantapias'}
              className='text-center'
              target='_blank'>
              GitHub
            </Link>
          </div>
          <div className='text-center pb-2'>
            <Link href={'/'} className='text-center'>
              ©2024
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
