import { onMessage, sendMessage } from 'webext-bridge/background'
import { storageCurrentTabId } from '~/logic'

onMessage('event-fetch-send', async ({ data }) => {
  const tabId = storageCurrentTabId.value!

  try {
    const response = await fetch(data.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...data.headers },
      body: JSON.stringify(data.params),
    })

    if (response.status !== 200)
      throw new Error(response.status.toString())

    const json = await response.json()

    sendMessage('event-fetch-on', { json }, { tabId, context: 'content-script' })
  }
  catch {
    sendMessage('event-fetch-on', {}, { tabId, context: 'content-script' })
  }
})
