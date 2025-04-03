import type { TMessageSchema } from '../i18n/locales/schema'
import { useI18n } from 'vue-i18n'

export function useLangSwitch() {
  const { locale } = useI18n<[TMessageSchema], 'en' | 'zh'>()

  return locale
}
