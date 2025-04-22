import { onMessage, sendMessage } from 'webext-bridge/background'
import { EnumResponseCode } from '~/constant/enum'

const context = 'content-script'

export function register() {
  onMessage('event-fetch-send', async ({ data }) => {
    const { tabId, url, headers, params, timeout = 30 } = data
    const controller = new AbortController()
    const signal = controller.signal
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(params),
        signal,
      })
      clearTimeout(timeoutId)

      if (response.status !== 200)
        throw new Error('unknown')

      sendMessage(
        'event-fetch-on',
        { code: EnumResponseCode.SUCCESS, response: await response.json() },
        { tabId, context },
      ).catch()
    }
    catch (error) {
      clearTimeout(timeoutId)
      let code = EnumResponseCode.ERROR
      if (error instanceof Error && error.name === 'AbortError') {
        code = EnumResponseCode.ABORT_ERROR
      }

      sendMessage('event-fetch-on', { code }, { tabId, context }).catch()
    }
  })
}
