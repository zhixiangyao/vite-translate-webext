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

async function updateActionIcon(show: boolean, tabId: number) {
  try {
    if (show) {
      await browser.action.setIcon({ tabId, path: actionPath })
    }
    else {
      await browser.action.setIcon({ tabId, path: unActionPath })
    }
  }
  catch {}
}

export function register() {
  onMessage('event-icon', ({ data }) => {
    const { tabId, show } = data
    updateActionIcon(show, tabId)
  })
}
