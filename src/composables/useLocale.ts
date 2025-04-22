import type { TMessageSchema } from '../i18n/locales/schema'
import type { EnumLang } from '~/constant/enum'
import { useI18n } from 'vue-i18n'

export function useLocal() {
  const { locale } = useI18n<[TMessageSchema], EnumLang>()

  return locale
}
