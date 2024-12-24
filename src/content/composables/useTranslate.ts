import { useBackgroundFetch } from '~/composables/useBackgroundFetch'
import { storageSettingApi } from '~/logic'

type Lang = 'ZH' | 'EN'

export interface DeeplxResponse {
  alternatives: string[]
  code: 200
  data: string
  id: number
  method: 'Free'
  source_lang: Lang
  target_lang: Lang
}

export function useTranslate() {
  const fetch = useBackgroundFetch()

  async function run(text: string, source_lang: Lang, target_lang: Lang) {
    const params = {
      text,
      source_lang,
      target_lang,
    }

    const headers = {
      Authorization: `Bearer ${storageSettingApi.value.token}`,
    }

    const response = await fetch.post<DeeplxResponse>(storageSettingApi.value.url, {
      params,
      headers,
    })

    return response
  }

  return { run }
}
