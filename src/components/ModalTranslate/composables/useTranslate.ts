import type { EnumTranslateLang } from '~/constant/enum'
import { useBackgroundFetch } from '~/composables/useBackgroundFetch'
import { storageCurrentTab, storageSettings } from '~/logic/storage'

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
      Authorization: `Bearer ${storageSettings.value.api.token}`,
    }

    if (!storageCurrentTab.value.id)
      return void 0

    const response = await fetch.post<DeeplxResponse>(
      storageCurrentTab.value.id,
      storageSettings.value.api.url,
      {
        params,
        headers,
      },
      storageSettings.value.api.timeout,
    )

    return response
  }

  return { run }
}
