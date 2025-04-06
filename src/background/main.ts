import type { Tabs } from 'webextension-polyfill'
import { storageCurrentTab } from '~/storage'
import { register as registerEventFetch } from './registers/event-fetch'
import { register as registerEventIcon } from './registers/event-icon'

import('./hmr') // only on dev mode

registerEventIcon()
registerEventFetch()

async function getCurrentTab(): Promise<Tabs.Tab | undefined> {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true })

    return tab ?? void 0
  }
  catch {
    return void 0
  }
}

/** 标签选中时 */
browser.tabs.onActivated.addListener(async () => {
  const tab = await getCurrentTab()
  const tabId = tab?.id

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

  if (tabId && tabId !== storageCurrentTab.value.id) {
    storageCurrentTab.value.id = tabId
  }
})
