import { sendMessage } from 'webext-bridge/background'
import type { Tabs } from 'webextension-polyfill'

import { storageActivityWebsiteMap } from '~/logic'

// only on dev mode
if (import.meta.hot) {
  // @ts-expect-error for background HMR
  import('/@vite/client')
  // load latest content script
  import('./contentScriptHMR')
}

type Tab = Tabs.Tab | undefined

const state = reactive({
  tab: void 0 as Tab,
})

// communication example: send previous tab title from background page
// see shim.d.ts for type declaration
function handleWatchSendMessage(newTab: Tab, oldTab: Tab) {
  if (newTab && newTab.id && oldTab) {
    sendMessage('tab-prev', { title: oldTab.title }, { context: 'content-script', tabId: newTab.id })
  }
}

function handleWatchUpdateIcon([newTab, newActivityWebsiteMap]: [Tab, Record<string, boolean>]) {
  if (newTab && newTab.url) {
    const { host, protocol } = new URL(newTab.url)

    if (protocol.includes('http') && newActivityWebsiteMap[host]) {
      browser.action.setIcon({
        tabId: newTab.id,
        path: {
          16: browser.runtime.getURL(`assets/icons/icon-16.png`),
          48: browser.runtime.getURL(`assets/icons/icon-48.png`),
          128: browser.runtime.getURL(`assets/icons/icon-128.png`),
        },
      })
    }
    else {
      browser.action.setIcon({
        tabId: newTab.id,
        path: {
          16: browser.runtime.getURL(`assets/icons/icon-gray-16.png`),
          48: browser.runtime.getURL(`assets/icons/icon-gray-48.png`),
          128: browser.runtime.getURL(`assets/icons/icon-gray-128.png`),
        },
      })
    }
  }
}

browser.tabs.onActivated.addListener(async ({ tabId }) => {
  state.tab = await browser.tabs.get(tabId)
})

watch(() => state.tab, handleWatchSendMessage, { deep: true })
watch([() => state.tab, () => storageActivityWebsiteMap.value], handleWatchUpdateIcon, { deep: true })
