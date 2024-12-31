import { onMessage } from 'webext-bridge/background'
import { storageCurrentTab } from '~/logic/storage'

onMessage('event-activity', async ({ data }) => {
  const tabId = storageCurrentTab.value.id

  if (!tabId)
    return

  if (data.show) {
    browser.action.setIcon({
      tabId,
      path: {
        16: browser.runtime.getURL(`assets/icons/icon-16.png`),
        48: browser.runtime.getURL(`assets/icons/icon-48.png`),
        128: browser.runtime.getURL(`assets/icons/icon-128.png`),
      },
    })
  }
  else {
    browser.action.setIcon({
      tabId,
      path: {
        16: browser.runtime.getURL(`assets/icons/icon-gray-16.png`),
        48: browser.runtime.getURL(`assets/icons/icon-gray-48.png`),
        128: browser.runtime.getURL(`assets/icons/icon-gray-128.png`),
      },
    })
  }
})
