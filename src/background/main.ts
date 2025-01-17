import type { Tabs } from 'webextension-polyfill'
import { storageCurrentTab } from '~/logic/storage'

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
  storageCurrentTab.value.id = tab?.id
})

/** 监听 tab 激活时获取当前 tabId */
browser.tabs.onActivated.addListener(({ tabId }) => {
  storageCurrentTab.value.id = tabId
})

/** 监听窗口切换时获取当前 tabId */
browser.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === browser.windows.WINDOW_ID_NONE)
    return // 没有窗口获得焦点
  const tab = await getCurrentTab()
  storageCurrentTab.value.id = tab?.id
})

browser.contextMenus.create({
  type: 'normal',
  title: 'Translate',
  contexts: ['all'],
  id: 'menus',
})

browser.contextMenus.create({
  type: 'normal',
  title: '打开 Options',
  contexts: ['all'],
  id: 'menu-1',
  parentId: 'menus',
})

/** 右键菜单点击事件 */
browser.contextMenus.onClicked.addListener((data) => {
  if (data.menuItemId === 'menu-1') {
    browser.runtime.openOptionsPage()
  }
})
