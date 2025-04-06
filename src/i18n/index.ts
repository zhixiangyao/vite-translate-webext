import type { TMessageSchema } from './locales/schema'
import { createI18n } from 'vue-i18n'
import { storageSettings } from '~/storage'
import en from './locales/en.json'
import zh from './locales/zh.json'

function languageDetected() {
  const lang = document.documentElement.lang || navigator.language

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
  function handleWatchLang(lang: typeof storageSettings.value.lang) {
    i18n.global.locale = lang === 'auto' ? languageDetected() : lang
    window.document.title = i18n.global.t('Dashboard')
  }

  watch(() => storageSettings.value.lang, handleWatchLang, { immediate: true })
}

export default i18n
