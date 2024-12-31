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
  const fetch = useBackgroundFetch()

  async function run(text: string, source_lang: EnumTranslateLang, target_lang: EnumTranslateLang) {
    const params = {
      text,
      source_lang,
      target_lang,
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
