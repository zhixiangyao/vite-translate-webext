import { onMessage, sendMessage } from 'webext-bridge/content-script'

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
  async function run(text: string, source_lang: Lang, target_lang: Lang) {
    const { promise, resolve } = Promise.withResolvers<object | undefined>()

    sendMessage(
      'event-fetch-send',
      {
        url,
        headers: { Authorization: `Bearer ${__TRANSLATE_TOKEN__}` },
        params: { text, source_lang, target_lang },
      },
      'background',
    )

    onMessage('event-fetch-on', async ({ data }) => resolve(data.json))

    return promise as Promise<Data | undefined>
  }

  return { run }
}
