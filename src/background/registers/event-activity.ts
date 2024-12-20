import { onMessage } from 'webext-bridge/background'
import { storageCurrentTabId } from '~/logic'

onMessage('event-activity', async ({ data }) => {
  if (data.show) {
    browser.action.setIcon({
      tabId: storageCurrentTabId.value,
      path: {
        16: browser.runtime.getURL(`assets/icons/icon-16.png`),
        48: browser.runtime.getURL(`assets/icons/icon-48.png`),
        128: browser.runtime.getURL(`assets/icons/icon-128.png`),
      },
    })
  }
  else {
    browser.action.setIcon({
      tabId: storageCurrentTabId.value,
      path: {
        16: browser.runtime.getURL(`assets/icons/icon-gray-16.png`),
        48: browser.runtime.getURL(`assets/icons/icon-gray-48.png`),
        128: browser.runtime.getURL(`assets/icons/icon-gray-128.png`),
      },
    })
  }
})
