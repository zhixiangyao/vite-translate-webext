import { onMessage, sendMessage } from 'webext-bridge/background'
import { EnumResponseCode } from '~/constant/enum'

const context = 'content-script'

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

    try {
      await sendMessage(
        'event-fetch-on',
        { code: EnumResponseCode.Success, response: await response.json() },
        { tabId, context },
      )
    }
    catch (err) {
      console.error('Message failed [event-fetch-on]:', err)
    }
  }
  catch (error) {
    clearTimeout(timeoutId)
    let code = EnumResponseCode.Error
    if (error instanceof Error && error.name === 'AbortError') {
      code = EnumResponseCode.AbortError
    }

    try {
      await sendMessage('event-fetch-on', { code }, { tabId, context })
    }
    catch (err) {
      console.error('Message failed [event-fetch-on]:', err)
    }
  }
})
