import type { TMessageSchema } from './locales/schema'
import { createI18n } from 'vue-i18n'
import { storageSettings } from '~/storage'
import en from './locales/en.json'
import zh from './locales/zh.json'

export enum EnumLang {
  ZH = 'zh',
  EN = 'en',
}

function languageDetected() {
  const lang = document.documentElement.lang || navigator.language

  return lang.includes(EnumLang.ZH) ? EnumLang.ZH : EnumLang.EN
}

const i18n = createI18n<[TMessageSchema], EnumLang>({
  locale: languageDetected(),
  fallbackLocale: EnumLang.EN,
  messages: {
    en,
    zh,
  },
})

export function useRegisterI18n() {
  function handleWatchLang(lang: typeof storageSettings.value.lang) {
    i18n.global.locale = lang === 'auto' ? languageDetected() : lang
  }

  watch(() => storageSettings.value.lang, handleWatchLang, { immediate: true })
}

export default i18n
