import type { TMessageSchema } from './locales/schema'
import { createI18n } from 'vue-i18n'
import { storageSettings } from '~/storage'
import en from './locales/en.json'
import zh from './locales/zh.json'

function languageDetected() {
  const urlParams = new URLSearchParams(location.search)
  const hashParams = new URLSearchParams(location.hash.split('?')[1])
  const lang = hashParams.get('lang') || urlParams.get('lang') || document.documentElement.lang || navigator.language

  return lang.includes('zh') ? 'zh' : 'en'
}

const i18n = createI18n<[TMessageSchema], 'en' | 'zh'>({
  locale: languageDetected(),
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
  },
})

export function useRegisterI18n() {
  watch(() => storageSettings.value.lang, (lang) => {
    i18n.global.locale = lang === 'auto' ? languageDetected() : lang
  }, { immediate: true })
}

export default i18n
