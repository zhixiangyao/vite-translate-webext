import type { EnumTranslateLang } from '~/constant/enum'
import { useBackgroundFetch } from '~/composables/useBackgroundFetch'
import { storageCurrentTab, storageSettings } from '~/storage'

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
    const tabId = storageCurrentTab.value.id
    const url = storageSettings.value.api.url
    const params = {
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    }
    const headers = {
      Authorization: `Bearer ${storageSettings.value.api.token}`,
    }
    const timeout = storageSettings.value.api.timeout

    if (!tabId)
      return void 0

    const response = await fetch.post<DeeplxResponse>(tabId, url, { params, headers }, timeout)

    return response
  }

  return { run }
}
