import { useBackgroundFetch } from '~/composables/useBackgroundFetch'

const url = `http://home.yaozhixiang.top:1188/translate`

type Lang = 'ZH' | 'EN'

export interface Data {
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
      Authorization: `Bearer ${__TRANSLATE_TOKEN__}`,
    }

    const data = await fetch.post(url, {
      params,
      headers,
    })

    return data as Data | undefined
  }

  return { run }
}
