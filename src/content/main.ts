import { sendMessage } from 'webext-bridge/content-script'

import { highlight, storageActivityWebsiteMap, storageWordList, unhighlight } from '~/logic'

async function handleWatchSwitchChange(newActivityWebsiteMap: Record<string, boolean>) {
  if (location.protocol.includes('http') && !!newActivityWebsiteMap[location.host]) {
    const words = storageWordList.value.map(value => value.word)
    highlight(words, 'color: red; font-weight: bold')

    sendMessage('event-activity', { show: true }, 'background')
  }
  else {
    sendMessage('event-activity', { show: false }, 'background')
    unhighlight()
  }
}

watch(() => toRaw(storageActivityWebsiteMap.value), handleWatchSwitchChange, { immediate: true, deep: true })
