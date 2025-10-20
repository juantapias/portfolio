import Link from 'next/link'

import { useTranslations } from 'next-intl'

export default function NotFound() {
  const t = useTranslations('NotFound')

  return (
    <div className='not-found space-y-8'>
      <h2>{t('title')}</h2>
      <p>{t('content')}</p>
      <Link href='/' className='btn is-primary'>
        {t('btnBackHome')}
      </Link>
    </div>
  )
}
