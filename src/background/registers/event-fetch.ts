import { onMessage, sendMessage } from 'webext-bridge/background'
import { EnumResponseCode } from '~/enum'
import { storageCurrentTab, storageSetting } from '~/logic'

const context = 'content-script'

onMessage('event-fetch-send', async ({ data }) => {
  const controller = new AbortController()
  const signal = controller.signal
  const timeoutId = setTimeout(() => controller.abort(), storageSetting.value.api.timeout)

  const tabId = storageCurrentTab.value.id!

  try {
    const response = await fetch(data.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...data.headers },
      body: JSON.stringify(data.params),
      signal,
    })
    clearTimeout(timeoutId)

    if (response.status !== 200)
      throw new Error('unknown')

    sendMessage(
      'event-fetch-on',
      { code: EnumResponseCode.Success, response: await response.json() },
      { tabId, context },
    )
  }
  catch (error) {
    clearTimeout(timeoutId)
    let code = EnumResponseCode.Error
    if (error instanceof Error && error.name === 'AbortError') {
      code = EnumResponseCode.AbortError
    }
    sendMessage('event-fetch-on', { code }, { tabId, context })
  }
})
