import { sendMessage } from 'webext-bridge/content-script'

import { highlight, storageActivityWebsiteMap, storageWordList, unhighlight } from '~/logic'

const enable = computed(() => {
  return location.protocol.includes('http') && !!storageActivityWebsiteMap.value[location.host]
})

/** 更新 page 只有首次加载完毕才会执行 */
async function updatePage() {
  const words = storageWordList.value.map(value => value.word)

  if (enable.value) {
    highlight(words, 'color: red; font-weight: bold')
  }
  else {
    unhighlight()
  }
}

/** 更新 icon 要实时 */
async function updateIcon() {
  if (enable.value) {
    sendMessage('event-activity', { show: true }, 'background')
  }
  else {
    sendMessage('event-activity', { show: false }, 'background')
  }
}

watch(() => enable.value, updateIcon, { immediate: true })

window.addEventListener('load', updatePage)
