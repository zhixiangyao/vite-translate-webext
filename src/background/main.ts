import type { Tabs } from 'webextension-polyfill'
import { onMessage, sendMessage } from 'webext-bridge/background'

import('./hmr')

const currentTabId = ref<number>()

async function getCurrentTab(): Promise<Tabs.Tab | null> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true })

  return tab ?? null
}

/** 扩展加载时获取当前 tab */
browser.runtime.onInstalled.addListener(async () => {
  const tab = await getCurrentTab()
  currentTabId.value = tab?.id
})

/** 监听 tab 激活事件 */
browser.tabs.onActivated.addListener(({ tabId }) => {
  currentTabId.value = tabId
})

/** 监听窗口切换事件 (可选，如果需要跨窗口跟踪) */
browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === browser.windows.WINDOW_ID_NONE)
    return // 没有窗口获得焦点
  const tab = await getCurrentTab()
  currentTabId.value = tab?.id
})

onMessage('event-activity', async ({ data }) => {
  if (data.show) {
    browser.action.setIcon({
      tabId: currentTabId.value,
      path: {
        16: browser.runtime.getURL(`assets/icons/icon-16.png`),
        48: browser.runtime.getURL(`assets/icons/icon-48.png`),
        128: browser.runtime.getURL(`assets/icons/icon-128.png`),
      },
    })
  }
  else {
    browser.action.setIcon({
      tabId: currentTabId.value,
      path: {
        16: browser.runtime.getURL(`assets/icons/icon-gray-16.png`),
        48: browser.runtime.getURL(`assets/icons/icon-gray-48.png`),
        128: browser.runtime.getURL(`assets/icons/icon-gray-128.png`),
      },
    })
  }
})

onMessage('event-fetch-send', async ({ data }) => {
  const tabId = currentTabId.value!

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
