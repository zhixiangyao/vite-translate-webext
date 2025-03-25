import type { Tabs } from 'webextension-polyfill'
import { storageCurrentTab } from '~/logic/storage'

import('./hmr') // only on dev mode
import('./registers/event-activity')
import('./registers/event-fetch')

async function getCurrentTab(): Promise<Tabs.Tab | undefined> {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true })

    return tab ?? void 0
  }
  catch {
    return void 0
  }
}

/** 扩展加载时获取当前 tabId */
browser.runtime.onInstalled.addListener(async () => {
  const tab = await getCurrentTab()
  const tabId = tab?.id

  if (tabId && tabId !== storageCurrentTab.value.id) {
    storageCurrentTab.value.id = tabId
  }
})

/** 监听 tab 激活时获取当前 tabId */
browser.tabs.onActivated.addListener(({ tabId }) => {
  if (tabId && tabId !== storageCurrentTab.value.id) {
    storageCurrentTab.value.id = tabId
  }
})

/** 监听窗口切换时获取当前 tabId */
browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === browser.windows.WINDOW_ID_NONE)
    return // 没有窗口获得焦点
  const tab = await getCurrentTab()
  const tabId = tab?.id

  if (tabId && tabId !== storageCurrentTab.value.id) {
    storageCurrentTab.value.id = tabId
  }
})
