import type { EnumTranslateLang } from '~/constant/enum'
import { useBackgroundFetch } from '~/composables/useBackgroundFetch'
import { storageSetting } from '~/logic/storage'

export interface DeeplxResponse {
  alternatives: string[]
  code: 200
  data: string
  id: number
  method: 'Free'
  source_lang: EnumTranslateLang
  target_lang: EnumTranslateLang
}

export function useTranslate() {
  const fetch = useBackgroundFetch({ silent: true })

  async function run(text: string, sourceLang: EnumTranslateLang, targetLang: EnumTranslateLang) {
    const params = {
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    }

    const headers = {
      Authorization: `Bearer ${storageSetting.value.api.token}`,
    }

    const response = await fetch.post<DeeplxResponse>(storageSetting.value.api.url, {
      params,
      headers,
    })

    return response
  }

  return { run }
}
