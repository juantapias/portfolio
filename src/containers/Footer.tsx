import Link from 'next/link'

export default function Footer() {
  return (
    <div className='footer'>
      <div className='container mx-auto px-8'>
        <div className='grid grid-rows-1'>
          <div className='grid grid-cols-3 py-2'>
            <Link href={'/'} className='text-center'>
              Instagram
            </Link>
            <Link href={'/'} className='text-center'>
              dev.juantapias@gmail.com
            </Link>
            <Link href={'/'} className='text-center'>
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
