import createScalarI18n, { type ScalarLocale, type ScalarMessageInput } from '@scalar/core/libs/i18n'

import en from './locales/en.json'
import ja from './locales/ja.json'

export const apiClientMessages = {
  en,
  ja,
} satisfies ScalarMessageInput

const resolveLocale = (): ScalarLocale => {
  if (typeof document === 'object') {
    const documentLocale = document.documentElement.lang?.trim().toLowerCase()

    if (documentLocale.startsWith('ja')) {
      return 'ja'
    }
  }

  if (typeof navigator === 'object') {
    const navigatorLocale = navigator.language?.trim().toLowerCase()

    if (navigatorLocale.startsWith('ja')) {
      return 'ja'
    }
  }

  return 'en'
}

export const createApiClientI18n = (locale = resolveLocale()) =>
  createScalarI18n({
    locale,
    messages: apiClientMessages,
  })
