import type { Tabs } from 'webextension-polyfill'
import { storageCurrentTab, storageWebsiteList } from '~/logic/storage'

import('./hmr') // only on dev mode
import('./registers/event-fetch')

const actionIconPathMap = {
  16: browser.runtime.getURL(`assets/icons/icon-16.png`),
  48: browser.runtime.getURL(`assets/icons/icon-48.png`),
  128: browser.runtime.getURL(`assets/icons/icon-128.png`),
}

const unActionIconPathMap = {
  16: browser.runtime.getURL(`assets/icons/icon-gray-16.png`),
  48: browser.runtime.getURL(`assets/icons/icon-gray-48.png`),
  128: browser.runtime.getURL(`assets/icons/icon-gray-128.png`),
}

async function getCurrentTab(): Promise<Tabs.Tab | undefined> {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true })

    return tab ?? void 0
  }
  catch {
    return void 0
  }
}

async function updateActionIcon(tab: Tabs.Tab | undefined) {
  const url = tab?.url || tab?.pendingUrl
  const tabId = tab?.id

  if (!url || !tabId)
    return

  const { host } = new URL(url)
  const website = storageWebsiteList.value.find(item => item.url === host)

  if (website?.enable) {
    browser.action.setIcon({ tabId, path: actionIconPathMap })
  }
  else {
    browser.action.setIcon({ tabId, path: unActionIconPathMap })
  }
}

/** 标签选中时 */
browser.tabs.onActivated.addListener(async () => {
  const tab = await getCurrentTab()
  const tabId = tab?.id

  updateActionIcon(tab)

  if (tabId && tabId !== storageCurrentTab.value.id) {
    storageCurrentTab.value.id = tabId
  }
})

/** 窗口切换时 */
browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === browser.windows.WINDOW_ID_NONE)
    return // 没有窗口获得焦点

  const tab = await getCurrentTab()
  const tabId = tab?.id

  updateActionIcon(tab)

  if (tabId && tabId !== storageCurrentTab.value.id) {
    storageCurrentTab.value.id = tabId
  }
})
