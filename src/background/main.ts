import type { Tabs } from 'webextension-polyfill'
import { storageCurrentTabId } from '~/logic'

import('./hmr') // only on dev mode
import('./registers/event-activity')
import('./registers/event-fetch')

async function getCurrentTab(): Promise<Tabs.Tab | null> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })

  return tab ?? null
}

/** 扩展加载时获取当前 tabId */
browser.runtime.onInstalled.addListener(async () => {
  const tab = await getCurrentTab()
  storageCurrentTabId.value = tab?.id
})

/** 监听 tab 激活时获取当前 tabId */
browser.tabs.onActivated.addListener(({ tabId }) => {
  storageCurrentTabId.value = tabId
})

/** 监听窗口切换时获取当前 tabId */
browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === browser.windows.WINDOW_ID_NONE)
    return // 没有窗口获得焦点
  const tab = await getCurrentTab()
  storageCurrentTabId.value = tab?.id
})
