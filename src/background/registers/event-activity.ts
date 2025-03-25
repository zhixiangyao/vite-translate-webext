import { onMessage } from 'webext-bridge/background'

const actionPath = {
  16: browser.runtime.getURL(`assets/icons/icon-16.png`),
  48: browser.runtime.getURL(`assets/icons/icon-48.png`),
  128: browser.runtime.getURL(`assets/icons/icon-128.png`),
}

const unActionPath = {
  16: browser.runtime.getURL(`assets/icons/icon-gray-16.png`),
  48: browser.runtime.getURL(`assets/icons/icon-gray-48.png`),
  128: browser.runtime.getURL(`assets/icons/icon-gray-128.png`),
}

onMessage('event-activity', async ({ data }) => {
  const { tabId } = data

  try {
    const tab = await browser.tabs.get(tabId)

    if (tab) {
      if (data.show) {
        browser.action.setIcon({ tabId, path: actionPath })
      }
      else {
        browser.action.setIcon({ tabId, path: unActionPath })
      }
    }
  }
  catch {}
})
