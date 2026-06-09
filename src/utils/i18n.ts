import es from '../i18n/es.json'
import en from '../i18n/en.json'

type Locale = 'es' | 'en'

const translations = { es, en }

export function useTranslations(locale: Locale) {
  return function t(key: string) {
    return (
      key.split('.').reduce((obj: any, i) => obj?.[i], translations[locale]) ??
      key
    )
  }
}
